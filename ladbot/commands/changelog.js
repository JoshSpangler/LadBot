/*
Fetches the latest commit from this repository and messages it in a nice
Discord embeded message.

Due to the nature of github's api, I couldn't find a way to get all of
the data I need from one http request. What I did was the following:
1) The first http request gets the repo's master branch information, 
   which contains a URL to the most recent commit of this branch.
   From this, I grabbed the commit's ID at the end of the URL
2) Using the commit ID, the second http request gets specific info.
   regarding this commit, such as the commit's message, timestamp, etc.
   (information I want). Using this information, I finally build and send
   the discord embedded message.
*/

exports.run = (client, message, args) => {
	let https = require('https');

	// Need this for the first http request
	let options1 = {
		host: 'api.github.com',
		path: '/repos/jspangled/LadBot/git/refs/heads/master',
		method: 'GET',
		headers: {'user-agent': 'node.js'}
	};
	
	// Setup function for first http request
	let commitID;
	let urlText = "https://api.github.com/repos/jspangled/LadBot/git/commits/";
	let callback1 = (response) => {
		let data = '';
		response.on('data', (chunk) => {
			data += chunk;	
		});
		// Here we can grab the commit ID and call the next request
		response.on('end', () => {
			commitID = JSON.parse(data).object.url.slice(urlText.length);
			
			// Call next function with commitID
			nextRequstCall();
		});
	}
	// Actually call first http request
	let request1 = https.request(options1, callback1).end();	

	// Setup function for second http request
	let nextRequstCall = () => {
		let msgText, commitURL, commitDate;
		let options2 = {
			host: 'api.github.com',
			path: '/repos/jspangled/LadBot/git/commits/' + commitID,
			method : 'GET',
			headers: {'user-agent': 'node.js'}
		};
		let callback2 = (response) => {
			let data = '';
			response.on('data', (chunk) => {
				data += chunk;
			});
			// Here we get the juicy commit information and build the embed
			response.on('end', () => {
				let repoURL = "https://github.com/jspangled/LadBot"; 
				let dataJ = JSON.parse(data);
				msgText = dataJ.message;
				commitURL = dataJ.html_url;
				commitDate = new Date(dataJ.author.date);
				// Now, finally setup discord embed message
				let embed = {
			    	"embed": {
				    "title": "**Recent updates (click me for more details):** ",
				    "description": "```" + msgText + "```",
				    "timestamp": commitDate,
				    "url": commitURL,
				    "color": 16777215,
				    "thumbnail": {
				      "url": client.config.projectPicURL
				    },
				    "footer": {
				      "icon_url": client.config.ladbotPicURL,
				      "text": "Update released on"
				    },
				    "fields": [
				    	{
				    		"name": "See more about this project at",
				    		"value": "[the project page](" + repoURL + ")."
				    	}
				    ]
				  }
				};
				return message.channel.send(embed);
			});
		}
		// Start second request
		let request2 = https.request(options2, callback2).end();
	}
}
