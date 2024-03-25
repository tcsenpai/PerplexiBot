import 'dotenv/config';

import config from 'config/';
import { parseCommands } from 'libs/parseCommands';
import Perplexity from 'libs/Perplexity';
import readin from 'libs/readin';
import required from 'libs/required';

required(process.env.PPLX_API_KEY, "No API key provided?");
const PPLX_API_KEY = process.env.PPLX_API_KEY as string;
let perplexity: Perplexity;

async function main() {
  console.log("[TCSenPPLX] Working with: " + PPLX_API_KEY);
  // Connecting to perplexity
  perplexity = new Perplexity(
    PPLX_API_KEY,
    "https://api.perplexity.ai",
    "sonar-small-chat",
    false,
    {}
  )
  // Chatting
  await chat();
}

async function chat(loop: boolean = true, save: boolean = true) {
  var proceed = true;
  while (proceed) {
    proceed = loop;
    let question = await readin("[You]> ");
    let parsed = parseCommands(question);
    proceed = parsed.proceed;
    let logpart = parsed.logpart;
    let response = await perplexity.ask(question);
    console.log("[Assistant]> " + response);
    if (save) {
      perplexity.save_in_context("user", question);
      if (logpart) {
        response += " " + logpart;
      }
      perplexity.save_in_context("assistant", response as string);
    }
  }
}

main();
