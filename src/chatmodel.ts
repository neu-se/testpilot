import axios from "axios";
import fs from "fs";
import { ICompletionModel } from "./completionModel";
import { trimCompletion } from "./syntax";
import * as handlebars from "handlebars";


const defaultPostOptions = {
  max_tokens: 500, // maximum number of tokens to return
  temperature: 0, // sampling temperature; higher values increase diversity
  top_p: 1, // no need to change this
};
export type PostOptions = Partial<typeof defaultPostOptions>;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Please set the ${name} environment variable.`);
    process.exit(1);
  }
  return value;
}

export class ChatModel implements ICompletionModel {
  private readonly apiEndpoint: string;
  private readonly authHeaders: string;

  constructor(
    private readonly model: string,
    private readonly template: string,
    private readonly instanceOptions: PostOptions = {}
  ) {
    this.apiEndpoint = getEnv("TESTPILOT_LLM_API_ENDPOINT");
    this.authHeaders = getEnv("TESTPILOT_LLM_AUTH_HEADERS");
    console.log(`Using Chat Model API at ${this.apiEndpoint}`);
  }

  /**
   * Query Codex for completions with a given prompt.
   *
   * @param prompt The prompt to use for the completion.
   * @param requestPostOptions The options to use for the request.
   * @returns A promise that resolves to a set of completions.
   */
  public async query(
    prompt: string,
    requestPostOptions: PostOptions = {}
  ): Promise<Set<string>> {

    const headers = {
      "Content-Type": "application/json",
      ...JSON.parse(this.authHeaders),
    };
     
    const options = {
      ...defaultPostOptions,
      // options provided to constructor override default options
      ...this.instanceOptions,
      // options provided to this function override default and instance options
      ...requestPostOptions,
    };

    const templateFileName = this.template;
    const templateFile = fs.readFileSync(templateFileName, 'utf8');
    const compiledTemplate = handlebars.compile(templateFile);

    const postOptions = {
      model: this.model,
      messages: [
        {
          role: "system",
          content: "You are a programming assistant."
        },
        {
          role: "user",
          content: compiledTemplate({ code: prompt })
        }
      ],
      ...options
    };


    const res = await axios.post(this.apiEndpoint, postOptions, { headers });

    if (res.status !== 200) {
      throw new Error(
        `Request failed with status ${res.status} and message ${res.statusText}`
      );
    }
    if (!res.data) {
      throw new Error("Response data is empty");
    }

    const json = res.data;
    if (json.error) {
      throw new Error(json.error);
    }

    const completions = new Set<string>();
    const regExp = /```[^\n\r]*\n((?:.(?!```))*)\n```/gs;
    let match;

    for (const choice of json.choices) {
      const content = choice.message.content;
      while ((match = regExp.exec(content)) !== null) {
        const substitution = match[1];
        completions.add(substitution);
      }
    } 
    return completions;
  }

  /**
   * Get completions from Codex and postprocess them as needed; print a warning if it did not produce any
   *
   * @param prompt the prompt to use
   */
  public async completions(
    prompt: string,
    temperature: number
  ): Promise<Set<string>> {
    try {
      let result = new Set<string>();
      for (const completion of await this.query(prompt, { temperature })) {
        result.add(trimCompletion(completion));
      }
      return result;
    } catch (err: any) {
      console.warn(`Failed to get completions: ${err.message}`);
      return new Set<string>();
    }
  }
}

if (require.main === module) {
  (async () => {
    const codex = new ChatModel('./template/template0.hb', 'llama-3-70b-instruct');
    const prompt = fs.readFileSync(0, "utf8");
    const responses = await codex.query(prompt);
    console.log([...responses][0]);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
