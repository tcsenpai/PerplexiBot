// Wrapper class for easy tasking with Perplexity (and OpenAI in general)

import OpenAI from "openai";
import type { RequestOptions } from "openai/core.mjs";

interface Message {
  role: string;
  content: string;
}

interface Context {
  messages: Message[];
}

export default class Perplexity {
  API_KEY: string;
  instance: OpenAI;
  current_model: string;
  verbose: boolean;

  // Instance vars
  roles = {
    a: "system",
    b: "user",
    c: "assistant",
  };
  context: Context = { messages: [] };
  options: RequestOptions = {}

  constructor(
    api_key: string,
    base_url: string = "https://api.perplexity.ai",
    base_model: string = "sonar-small-chat",
    verbose: boolean = false,
    options: RequestOptions = {}
  ) {
    // Setting our API Key
    this.API_KEY = api_key;
    this.current_model = base_model;
    // Setting verbosity
    this.verbose = verbose;
    // Setting options
    this.options = options;
    // Creating an openai agent
    this.instance = new OpenAI({
      baseURL: base_url,
      apiKey: this.API_KEY, // This is the default and can be omitted
    });
  }

  // INFO Adding something to context
  add_to_context(message: Message) {
    // Validate roles
    if (
      message.role != this.roles.a &&
      message.role != this.roles.b &&
      message.role != this.roles.c
    ) {
      console.log("[ERROR] Not added. Possible roles can be:");
      console.log(this.roles);
      return false;
    }
    this.context.messages.push(message);
    if(this.verbose) console.log("[OK] Added to context for: " + message.role);
  }

  // INFO Setting a default model
  set_current_model(model: string) {
    this.current_model = model;
  }

  // INFO Context viewer
  show_context() {
    console.log(this.context)
  }

  // INFO Wrapper for asking
  async ask(question: string) {
    let insertion = {
      role: "user",
      content: question,
    };
    this.add_to_context(insertion);
    let response = await this.complete(false, this.options);
    this.add_to_context(response as Message);
    return response.content;
  }

  // INFO Wrapper around completion
  async complete(override_model?: string | boolean, options: RequestOptions = {}) {
    if (this.verbose) console.log("[WORKING] Thinking...");
    let used_model = override_model ? override_model : this.current_model;
    const chatCompletion = await this.instance.chat.completions.create(
      {
        messages: this.context.messages as [],
        model: used_model as string,
        stream: false,
      },
      options
    );
    let return_prompt = chatCompletion.choices[0].message;
    return return_prompt;
  }

  // TODO Support streams if needed
}
