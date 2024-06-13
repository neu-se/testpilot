import { ICompletionModel } from "./completionModel";
import { APIFunction } from "./exploreAPI";
import {
  IPromptRefiner,
  Prompt,
  RetryWithError,
  SnippetIncluder,
  DocCommentIncluder,
  FunctionBodyIncluder,
  defaultPromptOptions,
} from "./promptCrafting";
import { ITestInfo, TestOutcome, TestStatus } from "./report";
import { SnippetMap } from "./snippetHelper";
import { ITestResultCollector } from "./testResultCollector";
import { TestValidator } from "./testValidator";

/**
 * Context class collecting various bits of information needed for test
 * generation.
 */
export class TestGenerator {
  private refiners: IPromptRefiner[] = [
    new SnippetIncluder(),
    new RetryWithError(),
    new DocCommentIncluder(),
    new FunctionBodyIncluder(),
  ];

  constructor(
    private temperatures: number[],
    private snippetMap: SnippetMap,
    private model: ICompletionModel,
    private isChatModel: boolean,
    private templateFileName: string,
    private validator: TestValidator,
    private collector: ITestResultCollector
  ) {}

  /**
   * Generate tests for a given function and validate them.
   */
  async generateAndValidateTests(fun: APIFunction) {
    for (const temperature of this.temperatures) {
      let generatedPassingTests = false;
      const generatedPrompts = new Map<string, Prompt>();
      const snippets = this.snippetMap(fun.functionName) ?? [];
      const promptOptions = {
        ...defaultPromptOptions(),
        isChatModel: this.isChatModel,
        templateFileName: this.templateFileName,
      };
      const worklist = [new Prompt(fun, snippets, promptOptions)];
      while (worklist.length > 0) {
        const prompt = worklist.pop()!;

        // check whether we've generated this prompt before; if so, record that
        // fact by updating provenance info and skip it
        const assembledPrompt = prompt.assemble();
        const previousPrompt = generatedPrompts.get(assembledPrompt);
        if (previousPrompt) {
          previousPrompt.withProvenance(...prompt.provenance);
          continue;
        }
        generatedPrompts.set(assembledPrompt, prompt);

        const rawCompletions = await this.model.completions(
          prompt.assemble(),
          temperature
        );
        let completions = new Set<string>;  
        if (this.isChatModel){ // for chat models, we need to extract the tests from fenced code blocks
          const regExp = /```[^\n\r]*\n((?:.(?!```))*)\n```/gs;
          for (const rawCompletion of rawCompletions) {
            let match;
            while ((match = regExp.exec(rawCompletion!)) !== null) {
                const substitution = match[1];
                completions.add(substitution);
                break;
            }
          }
        }
        for (const completion of completions) {
          // console.log(`** completion = ${completion}`);
          const testInfo = this.validateCompletion(
            prompt,
            completion,
            temperature
          );
          if (testInfo.outcome.status === TestStatus.PASSED) {
            generatedPassingTests = true;
          }

          this.refinePrompts(prompt, completion, testInfo, worklist);
        }
        this.collector.recordPromptInfo(prompt, temperature, completions);
      }
      if (generatedPassingTests) break;
    }
  }

  /**
   * Build a test for the given prompt and completion, validate it, and return
   * a test info object.
   */
  public validateCompletion(
    prompt: Prompt,
    completion: string,
    temperature: number
  ) {
    let testSource = prompt.completeTest(completion);
    if (this.isChatModel){ // for chat models, we need to extract the test from a fenced code block
      const regExp = /```[^\n\r]*\n((?:.(?!```))*)\n```/gs;
      let match;
      while ((match = regExp.exec(testSource!)) !== null) {
          const substitution = match[1];
          testSource = substitution;
          break;
      }
    }

    const testInfo = this.collector.recordTestInfo(
      testSource ?? completion,
      prompt,
      prompt.fun.accessPath
    );
    if (testInfo.prompts.length > 1) {
      // we have already validated this test
      return testInfo;
    }

    let outcome;
    if (completion === "") {
      outcome = TestOutcome.FAILED({ message: "Empty test" });
    } else if (testSource) {
      outcome = this.validator.validateTest(
        testInfo.testName,
        testInfo.testSource
      );
    } else {
      outcome = TestOutcome.FAILED({ message: "Invalid syntax" });
    }
    this.collector.recordTestResult(testInfo, temperature, outcome);
    return testInfo;
  }

  /**
   * Refine the prompt based on the test outcome, and add the refined prompts
   * to the worklist.
   */
  private refinePrompts(
    prompt: Prompt,
    completion: string,
    testInfo: ITestInfo,
    worklist: Prompt[]
  ) {
    for (const refiner of this.refiners) {
      for (const refinedPrompt of refiner.refine(
        prompt,
        completion,
        testInfo.outcome
      )) {
        const provenance = {
          originalPrompt: prompt,
          testId: testInfo.id,
          refiner: refiner.name,
        };
        worklist.push(refinedPrompt.withProvenance(provenance));
      }
    }
  }
}
