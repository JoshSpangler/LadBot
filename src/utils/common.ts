/** Common utilities. */

import { Client, Message } from "discord.js";
import { wordsEmojis } from "./wordsEmojisRegex";
import config from "../../data/config.json";
import fs from "fs";

/**
 * Returns a random item from the input {@code #arr} array.
 * @param arr The array to get a random item from
 * @returns A random item from {@code #arr} or {@code undefined} if empty
 */
export function randomItemFromArr(arr: any[]): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Checks if the input {@code #msg} is a valid message to add to the database.
 * Validity is determined by if the message contains normal letters/symbols and
 * emojis and starts with no bot prefixes and contains no mentions or links.
 * @param msg The {@code Message} to check the validity of.
 * @returns {@code true} if {@code #msg} is a valid message,
 *          {@code false} otherwise.
 */
export function validMessage(msg: Message): boolean {
  const regex = new RegExp(wordsEmojis);
  return (
    !msg.author.bot &&
    msg.content.match(regex) !== null &&
    !msg.content.startsWith("!") &&
    !msg.content.startsWith(config.prefix) &&
    !msg.content.includes("<@") &&
    !msg.content.includes("http:") &&
    !msg.content.includes("https:")
  );
}

/**
 * Restarts the bot linked to the input {@code #client} object.
 * @param client The {@code Client} object to restart.
 */
export function restart(client: Client): void {
  client.destroy();
  client.login(config.token);
  console.log("Bot has been restarted.\n");
  setActivity(client);
}

/**
 * Sets the input {@code #client.user}'s status with a random custom activity.
 * @param client The {@code Client} object to set the activity of.
 */
export function setActivity(client: Client): void {
  const customActivities = JSON.parse(
    fs.readFileSync((config as any).customActivities).toString()
  );
  const randStatus = randomItemFromArr(customActivities);
  console.log(client);
  if (client.user) {
    client.user.setActivity(randStatus);
  } else {
    console.log("BLAH!");
  }
}

/**
 * Returns a random color.
 * @returns a random color.
 */
export function randomColor(): number {
  return Math.floor(Math.random() * 16777214 + 1);
}

/**
 * Converts input r, g, b {@code number}s to a hex {@code string}.
 * @param r The red rgb value
 * @param g The green rgb value
 * @param b The blue rgb value
 * @returns A color hex {@code string}.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
