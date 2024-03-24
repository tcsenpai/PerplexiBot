import Perplexity from "./libs/Perplexity";
import "dotenv/config";
import required from "./libs/required";
import readin from "./libs/readin";
import fs from "fs"
import parseCommands from "./libs/parseCommands";
import config from "./config"
import type Message from "./libs/Perplexity"
import type { ListFormat } from "typescript";

required(process.env.PPLX_API_KEY);
const PPLX_API_KEY = process.env.PPLX_API_KEY as string;
let perplexity: Perplexity;

// NOTE Helper to load context from file
function inject_context() {
    let loaded_context = fs.readFileSync("./context.json", {encoding: "utf-8"})
    let list_context = JSON.parse(loaded_context)
    for (let i=0; i<list_context.length; i++) {
        perplexity.add_to_context(list_context[i])
    }
}

// NOTE Helper to save context long term
function save_in_context(role: string, message: string) {
    let loaded_context = fs.readFileSync("./context.json", {encoding: "utf-8"})
    let list_context = JSON.parse(loaded_context) as Array<{"role": string, "content": string}>
    let new_insertion = {
        role: role,
        content: message
    }
    list_context.push(new_insertion)
    fs.writeFileSync("./context.json", JSON.stringify(list_context))
}

async function main() {
  console.log("[TCSenPPLX] Working with: " + PPLX_API_KEY);
  // Connecting to perplexity
  perplexity = new Perplexity(
    PPLX_API_KEY,
    "https://api.perplexity.ai",
    "sonar-medium-chat",
    false,
    {}
  );
  // Setting our ai personality
  perplexity.add_to_context(config);
  // If any, inject context
  inject_context()
  // Chatting
  await chat();
}

async function chat(loop: boolean = true, save: boolean = true) {
  var proceed = true;
  while (proceed) {
    proceed = loop;
    let question = await readin("You: ");
    let parsed = parseCommands(question);
    proceed = parsed.proceed
    let logpart = parsed.logpart
    let response = await perplexity.ask(question);
    console.log("Assistant: " + response);
    if (save) {
        save_in_context("user", question)
        if (logpart) {
            response += +"\n[" + logpart + "]"
        }
        save_in_context("assistant", response as string)
    }
  }
}

main();
