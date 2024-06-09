"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const perf_hooks_1 = require("perf_hooks");
const syntax_1 = require("./syntax");
const handlebars = __importStar(require("handlebars"));
const defaultPostOptions = {
    max_tokens: 100,
    temperature: 0,
    n: 5,
    top_p: 1, // no need to change this
};
function getEnv(name) {
    const value = process.env[name];
    if (!value) {
        console.error(`Please set the ${name} environment variable.`);
        process.exit(1);
    }
    return value;
}
class ChatModel {
    constructor(instanceOptions = {}) {
        this.instanceOptions = instanceOptions;
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
    async query(prompt, requestPostOptions = {}) {
        // console.log(`Codex.query: prompt = ${prompt}, requestPostOptions = ${JSON.stringify(requestPostOptions)}`);
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
        perf_hooks_1.performance.mark("codex-query-start");
        const postOptions = {
            prompt,
            ...options,
        };
        const templateFileName = './templates/template1.hb';
        const templateFile = fs_1.default.readFileSync(templateFileName, 'utf8');
        const compiledTemplate = handlebars.compile(templateFile);
        const newPrompt = compiledTemplate({ code: prompt });
        // console.log(`newPrompt = ${newPrompt}`);
        const newApiEndpoint = 'https://api.perplexity.ai/chat/completions';
        const newOptions = {
            model: "llama-3-70b-instruct",
            max_tokens: 500,
            messages: [
                {
                    role: "system",
                    content: "You are a programming assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        };
        const newHeaders = {
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                ...JSON.parse(this.authHeaders)
            }
        };
        // const res = await axios.post(this.apiEndpoint, postOptions, { headers });
        const res = await axios_1.default.post(this.apiEndpoint, newOptions, newHeaders);
        const completions = new Set();
        const regExp = /```[^\n\r]*\n((?:.(?!```))*)\n```/gs;
        let match;
        const content = res.data.choices[0].message.content;
        while ((match = regExp.exec(content)) !== null) {
            const substitution = match[1];
            // console.log(`substitution = ${substitution}`);
            completions.add(substitution);
        }
        perf_hooks_1.performance.measure(`codex-query:${JSON.stringify({
            ...options,
            promptLength: prompt.length,
        })}`, "codex-query-start");
        if (res.status !== 200) {
            throw new Error(`Request failed with status ${res.status} and message ${res.statusText}`);
        }
        if (!res.data) {
            throw new Error("Response data is empty");
        }
        // const json = res.data;
        // if (json.error) {
        //   throw new Error(json.error);
        // }
        // let numContentFiltered = 0;
        // const completions = new Set<string>();
        // if (this.isStarCoder) {
        //   completions.add(json.generated_text);
        // } else {
        //   for (const choice of json.choices || [{ text: "" }]) {
        //     if (choice.finish_reason === "content_filter") {
        //       numContentFiltered++;
        //     }
        //     completions.add(choice.text);
        //   }
        // }
        // if (numContentFiltered > 0) {
        //   console.warn(
        //     `${numContentFiltered} completions were truncated due to content filtering.`
        //   );
        // }
        return completions;
    }
    /**
     * Get completions from Codex and postprocess them as needed; print a warning if it did not produce any
     *
     * @param prompt the prompt to use
     */
    async completions(prompt, temperature) {
        try {
            let result = new Set();
            for (const completion of await this.query(prompt, { temperature })) {
                result.add((0, syntax_1.trimCompletion)(completion));
            }
            return result;
        }
        catch (err) {
            console.warn(`Failed to get completions: ${err.message}`);
            return new Set();
        }
    }
}
exports.ChatModel = ChatModel;
if (require.main === module) {
    (async () => {
        const codex = new ChatModel();
        const prompt = fs_1.default.readFileSync(0, "utf8");
        const responses = await codex.query(prompt, { n: 1 });
        console.log([...responses][0]);
    })().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=chatmodel.js.map