# Practitioner talks and essays on evaluating LLM applications ("AI evals"), 2023 to November 2026

Research date: 2026-11-17. How to read these notes:

- Every page cited was opened unless marked **[snippet only]** (seen only in search results) or **[secondhand]** (a third party's notes on a talk).
- Quotes were extracted by an automated page reader asked for verbatim text. Spot-check any quote against the source before it goes on a slide.
- The ai.engineer talk pages are written summaries of each talk, so quotes from them are the page's wording and may not be the speaker's exact words.
- No view counts were verified, so none are reported.

## 1. Which practitioner talks and essays on LLM evals are most cited and recommended, 2023 to Nov 2026?

### Takeaway
The canon is small and self-referential: Hamel Husain and Shreya Shankar (essays, FAQ, course, Lenny's Podcast), Eugene Yan's five eval essays, the six-author "What We've Learned From A Year of Building with LLMs", Anthropic's "Demystifying evals for AI agents", and Braintrust's AI Engineer talks. From June to November 2026 the new material is mostly about agents and about automating the eval loop itself (AI Engineer World's Fair, Arize Observe, Interrupt London, QCon SF).

### Cited Findings

#### Signals of what is most cited
- Simon Willison linked the Husain and Shankar FAQ on 3 July 2025 and wrote that a robust approach to evals is the most important factor separating well-engineered AI systems from trial-and-error development — [Simon Willison](https://simonwillison.net/2025/Jul/3/faqs-about-ai-evals/)
- Latent Space's evals wiki page (as of 2026-09-15) lists Husain's "Your AI Product Needs Evals" and Anthropic's "Demystifying evals for AI agents" among its handful of sources — [Latent Space wiki](https://latent.space/wiki/evals/)
- Husain's Field Guide builds on Shankar's criteria drift, Bryan Bischof's "capability funnel" and Eugene Yan's timeboxed experiments, which shows how tightly this group cites itself — [Hamel Husain](https://hamel.dev/blog/posts/field-guide/)
- The Husain and Shankar Maven course is described in August 2026 as "taken by 4,500+ students" with "4.7 stars with 900 reviews". This is a promotional claim on an affiliate page — [Peter Yang, Behind the Craft](https://creatoreconomy.so/p/how-to-build-better-ai-evals-with-claude-code-shreya-hamel)
- At the AI Engineer World's Fair 2026 evals track intro (1 July 2026), Aparna Dhinakaran said evals moved from a skill every PM and AI engineer has to learn to something "every serious AI team is betting on" — [conference transcript](https://agents.conffab.com/worlds-fair/live/day-1-keynotes/sessions/1782926700.md)

#### Hamel Husain (often with Shreya Shankar)

**Hamel Husain, "Your AI Product Needs Evals", hamel.dev, 29 March 2024** — [link](https://hamel.dev/blog/posts/evals/)
- Three levels of evals: Level 1 unit tests (assertions) on every code change, Level 2 human and model eval on a cadence, Level 3 A/B testing for mature products. "The cost of Level 3 > Level 2 > Level 1."
- Failing products lack an eval system. Building has three activities (evaluate quality, debug, change the system) and "Many people focus exclusively on #3 above, which prevents them from improving their LLM products beyond a demo."
- "Your pass rate is a product decision, depending on the failures you are willing to tolerate."
- Remove all friction from looking at data and build domain-specific viewers. "You can never stop looking at data—no free lunch exists."
- Align an LLM judge to human labels and track agreement. On imbalanced data, measure precision and recall separately because raw agreement misleads.
- Do not rely on generic eval frameworks, and distrust vendors who claim humans can be removed from evaluation.

**Hamel Husain, "Using LLM-as-a-Judge For Evaluation: A Complete Guide", hamel.dev, 29 October 2024 (page shows "Modified" 1 September 2026)** — [link](https://hamel.dev/blog/posts/llm-judge/)
- The method is "Critique Shadowing": find the principal domain expert, build a dataset, collect expert pass/fail judgments with written critiques, fix obvious errors, build the judge iteratively, run error analysis, add specialized judges only if needed.
- Developers standing in for the domain expert is "a recipe for disaster".
- Binary over 1-5 scales: "People don't know what to do with a 3 or 4."
- Validate the judge with True Positive Rate and True Negative Rate on a train (10-20%), dev (40-45%), test (40-45%) split, with 30-50 examples per label in each set.
- The judge is "a nice 'hack' I use to trick people into carefully looking at their data."

**Hamel Husain, "A Field Guide to Rapidly Improving AI Products", hamel.dev, 24 March 2025** — [link](https://hamel.dev/blog/posts/field-guide/)
- "Error analysis - the single most valuable activity in AI development and consistently the highest-ROI activity."
- Case: NurtureBoss's assistant failed 66% of date-handling requests. After categorizing failures and adding targeted tests, success went from 33% to 95%. Three issues caused over 60% of problems.
- The most important investment is a simple custom data viewer, "a customized interface that lets anyone examine what their AI is actually doing."
- Bootstrap with synthetic data along dimensions (features, scenarios, personas). Generate user inputs, not outputs.
- Trust in evals needs binary judgments plus critiques, because "a binary pass/fail forces evaluators to make a clear judgment: did this output achieve its purpose or not?"
- "The key metric for AI roadmaps isn't features shipped – it's experiments run."

**Hamel Husain and Shreya Shankar, evals FAQ, hamel.dev** — [link](https://hamel.dev/blog/posts/evals-faq/)
- Dating: linked by Simon Willison on 3 July 2025 as "Frequently Asked Questions (And Answers) About AI Evals" ([Willison](https://simonwillison.net/2025/Jul/3/faqs-about-ai-evals/)). One per-question page is dated 27 July 2025 ([EDD question](https://hamel.dev/blog/posts/evals-faq/should-i-practice-eval-driven-development.html)). The consolidated page is now titled "AI Evals: Everything You Need to Know" and shows published 18 September 2026, updated 21 September 2026.
- Error analysis is "the most important activity in evals": open coding (free-text notes on traces), then axial coding (grouping notes into a failure taxonomy), repeated until new traces stop revealing new failure modes.
- "we've spent 60-80% of our development time on error analysis and evaluation."
- "If you're passing 100% of your evals, you're likely not challenging your system enough." Willison adds that the FAQ suggests a 70% pass rate may indicate a more meaningful eval.
- Eval-driven development: "Generally no." Instead, "Write evaluators for errors you discover, not errors you imagine." The exception is a known hard constraint such as "never mention competitors".
- "Generic evaluations waste time and create false confidence when you use them as quality measures."
- For most small and medium companies, appoint one domain expert as a "benevolent dictator". Outsourcing core error analysis is "usually a big mistake".

**Hamel Husain and Shreya Shankar on Lenny's Podcast, "Why AI evals are the hottest new skill for product builders", 25 September 2025** — [show notes](https://www.lennysnewsletter.com/p/why-ai-evals-are-the-hottest-new-skill), [YouTube](https://youtu.be/BsWxPI9UM4c)
- Show notes (verified): "Always start with error analysis (don't jump into writing evals)" and "Evals are the new PRDs". Chapters include "The great evals debate" (1:09:57), "Why dogfooding isn't enough for most AI products" (1:15:15) and "The Claude Code controversy and the importance of context" (1:23:02).
- Show notes say implementation takes about 30 minutes per week after initial setup.
- **[secondhand]** A third-party summary gives these quotes. Shankar: "The goal is not to do evals perfectly. It's to actionably improve your product." Husain: "You're never going to know what the failure modes are going to be up front." Husain: "If someone ever reports to you agreement, you should immediately ask, okay, tell me more." — [podcast summary](https://podcasts-distilled-hugo-content.pages.dev/lennys-podcast-product-career-growth/why-ai-evals-are-the-hottest-new-skill-for-product-builders-hamel-husain-shreya-shankar-creators-of/)
- **[secondhand, paraphrase]** The same summary says most products need about 4 to 7 LLM judges, review about 100 traces to reach "theoretical saturation", and expect 3 to 4 days of upfront work.

**Hamel Husain and Shreya Shankar, "Evals Skills for Coding Agents", hamel.dev, 2 March 2026 (modified 31 August 2026)** — [link](https://hamel.dev/blog/posts/evals-skills/)
- Eight skills for coding agents: evals-start, eval-audit, error-discovery, generate-synthetic-data, write-judge-prompt, validate-evaluator, evaluate-rag, build-review-interface.
- "Eval tools often get in the way." They "nudge you toward generic off-the-shelf metrics" before you have looked at your data.
- "Product evals measure whether _your_ pipeline works on _your_ task with _your_ data."
- "These skills are only a starting point."

**Hamel Husain, "The Revenge of the Data Scientist", hamel.dev, 26 March 2026 (annotated PyAI Conf talk)** — [link](https://hamel.dev/blog/posts/revenge/)
- "a large portion of the harness is data science." Agent harnesses need metrics and observability, not only tests.
- Five pitfalls: generic metrics, unverified judges, bad experimental design, bad data and labels, automating too much.
- Treat a judge as a classifier with human labels and train/dev/test splits. Report precision and recall, because "accuracy hides the system's true performance".
- Replace "subjective scales with binary pass/fail on scoped criteria".
- LLMs can do the plumbing but "They cannot look at the data for you."
- On the backlash: "They claim “RAG is dead” or “evals are dead,” yet build systems that depend on those concepts." Each pitfall maps to a classic data science practice: "None of this is new!"

**Same talk, later venues (June to November 2026)**
- Arize Observe 2026, written up in June 2026 as "AI evals are a data science problem: What most teams get wrong". Quotes on the page: "Traces tell you what happened. Human labels define what good means."; "The rubric is an output of error analysis, not a prerequisite for it."; "A judge can look 95% accurate while missing most of the rare failures."; "Synthetic data should start from hypotheses, not volume." — [Arize](https://arize.com/?p=29757)
- The same write-up lists dashboards with about 50 mostly generic metrics, and offline scores never validated against live traffic, as common mistakes — [Arize](https://arize.com/?p=29757)
- QCon San Francisco, 17 November 2026, "The Revenge of the Data Scientist: Why Reliable AI Needs Evals, Traces, and Metrics". Abstract: "production AI is won or lost in the harness around the model" — [QCon SF](https://qconsf.com/presentation/nov2026/revenge-data-scientist-why-reliable-ai-needs-evals-traces-and-metrics)

**Shreya Shankar and Hamel Husain with Peter Yang, "How to Build Better AI Evals with Claude Code in 5 Steps", Behind the Craft, 23 August 2026** — [link](https://creatoreconomy.so/p/how-to-build-better-ai-evals-with-claude-code-shreya-hamel)
- "There are two types of evals: top-down and bottom-up." "Top-down evals are rules that you define upfront."
- Compare 10 to 20 past examples before turning a failure into an eval. Do not overfit to a few examples.
- Listed topics (body paywalled): why evals are "completely different now with the latest models", spinning up agents to grade each criterion, and where human judgment is still needed.

#### Shreya Shankar

**Shreya Shankar, J.D. Zamfirescu-Pereira, Björn Hartmann, Aditya G. Parameswaran, Ian Arawjo, "Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences", arXiv:2404.12272, 18 April 2024** — [link](https://arxiv.org/abs/2404.12272)
- Criteria drift: "users need criteria to grade outputs, but grading outputs helps users define criteria."
- "some criteria appears dependent on the specific LLM outputs observed", which challenges approaches that assume evaluation is independent of observing outputs.
- LLM-generated evaluators inherit the problems of the LLMs they evaluate, so they need human validation.
- EvalGen generates candidate evaluators (code and LLM grader prompts), asks the user to grade a subset, and keeps the implementations that match those grades.

**Shreya Shankar (with support from Hamel Husain and Bryan Bischof), "In Defense of AI Evals, for Everyone", sh-reya.com, 5 September 2025** — [link](https://www.sh-reya.com/blog/in-defense-ai-evals/)
- Evals are "systematic measurement of application quality", not one specific method.
- Teams that say they don't do evals are "usually lying to themselves". The real line is systematic versus ad hoc.
- Coding agents inherit evaluation from model providers, because coding is heavily covered in post-training benchmarks.
- Lighter process is defensible when the task is well covered in post-training, or the team has the domain expertise and discipline to iterate by dogfooding.
- Anti-eval sentiment hurts newcomers who cannot rely on either.

#### Eugene Yan

**"Patterns for Building LLM-based Systems & Products", eugeneyan.com, 30 July 2023** — [link](https://eugeneyan.com/writing/llm-patterns/)
- Without evals "we would be flying blind, or would have to visually inspect LLM outputs with each change."
- Conventional metrics (BLEU, ROUGE, BERTScore, MoverScore) correlate weakly with human judgment and adapt poorly across tasks.
- "Think of it as Eval Driven Development (EDD)." Start by "collecting a set of task-specific evals".
- Quotes Jonathan Frankle: "The vibe-based eval cannot be underrated."

**"Task-Specific LLM Evals that Do & Don't Work", eugeneyan.com, 31 March 2024** — [link](https://eugeneyan.com/writing/evals/)
- Off-the-shelf evals "barely correlate with application-specific performance."
- G-Eval is "unreliable (low recall), costly (at least double the token count), and has poor sensitivity."
- Use task-specific evals instead: precision and recall for classification, an NLI model for factual consistency in summaries.
- Calibrate rigor to risk: "Don't be paralyzed by the need for perfection or zero risk".

**"Evaluating the Effectiveness of LLM-Evaluators (aka LLM-as-Judge)", eugeneyan.com, 18 August 2024** — [link](https://eugeneyan.com/writing/llm-evaluators/)
- Direct scoring for objective criteria, pairwise comparison for subjective ones.
- "Thus, where possible, I have my evaluators return binary outputs."
- "Classification metrics are more straightforward to apply and interpret." Correlation metrics "don't account for chance agreement and thus could be overoptimistic."
- Known judge biases: position, verbosity, self-enhancement. Fine-tuned judges generalize poorly.

**"An LLM-as-Judge Won't Save The Product—Fixing Your Process Will", eugeneyan.com, 20 April 2025** — [link](https://eugeneyan.com/writing/eval-process/)
- "Building product evals is simply the scientific method in disguise." The loop is observe, annotate, hypothesize, experiment, measure.
- EDD: "It's similar to test-driven development where we write tests before implementing software that passes those tests."
- "If we're not actively reviewing AI outputs and customer feedback, automated evaluators won't save our product."
- "Ideally, we should have a 50:50 split of passes and fails that spans the distribution of inputs."

**"Product Evals in Three Simple Steps", eugeneyan.com, 23 November 2025** — [link](https://eugeneyan.com/writing/product-evals/)
- Step 1: label a small dataset with binary labels, "at least 50-100 failures out of 200+ total samples". Prefer organic failures over synthetic defects.
- Step 2: align one evaluator per dimension. The "God Evaluator" that checks 5-10 criteria in one prompt is an anti-pattern. Use a 75/25 dev/test split, precision, recall and Cohen's kappa.
- The benchmark is human agreement, not perfection. Human kappa can be as low as 0.2-0.3.
- Step 3: run the harness on every config change and do the statistics. With 200 samples and 3% observed defects the 95% interval is "3% ± 2.4%", so a 5% requirement is not yet met. 400 samples narrows it to ±1.7%.

#### Group essay

**Eugene Yan, Bryan Bischof, Charles Frye, Hamel Husain, Jason Liu, Shreya Shankar, "What We've Learned From A Year of Building with LLMs", applied-llms.org, 8 June 2024** — [link](https://applied-llms.org/)
- "Create unit tests (i.e., assertions) consisting of samples of inputs and outputs from production."
- "LLM-as-Judge is not a silver bullet though."
- Goodhart: "When a measure becomes a target, it ceases to be a good measure." The needle-in-a-haystack eval is the example.
- "Two tasks that work well are binary classifications and pairwise comparisons."
- "These 'vibe checks' are signals of bad outputs; code and assertions operationalize them."
- "The model isn't the product, the system around it is." "Even teams that are just getting started need evals."

#### Bryan Bischof

**"LLM Evals Done Right - Lessons from Bryan Bischof of Hex AI", High Agency podcast (Humanloop, host Raza Habib), 10 June 2024** — [link](https://humanloop.com/blog/LLM-eval-done-right)
- Avoid one overall score. Use many binary evaluators, each on one aspect of quality.
- Evals are the offline evaluation ML teams have always done: "they should be like approached very similarly."
- "you will answer most of the hard product questions by looking at the data." His team holds a weekly "evals party" and he urges teams to "get absolutely filthy in that data."
- **[snippet only]** His talk "Failure is a Funnel" is listed at Data Council 2025 — [Data Council](https://datacouncil.ai/talks25/failure-is-a-funnel)

#### Jason Liu

**"There Are Only 6 RAG Evals", jxnl.co, 19 May 2025** — [link](https://jxnl.co/writing/2025/05/19/there-are-only-6-rag-evals/)
- RAG has three parts (question, context, answer), so six conditional relationships cover evaluation. "There are no hidden variables."
- Retrieval precision and recall are the foundation tier, with no LLM needed.
- Named anti-patterns: "absence blindness" (ignoring whether retrieval works), "complexity theater", and selling "a RAG evaluation framework with 20 different metrics."

#### Braintrust (Ankur Goyal and colleagues)

**"Production AI Engineering starts with Evals — with Ankur Goyal of Braintrust", Latent Space podcast, 11 October (year not shown on the page; search results file it under 2024)** — [link](https://www.latent.space/p/braintrust)
- Teams should "embrace evaluation as the sort of core workflow in AI engineering."
- "it's useful to write the eval before you actually tweak the prompt".
- Logging traces in the eval format gives "an instant flywheel of data that you can collect in datasets and use for evals."

**Ankur Goyal, "Five Hard-Earned Lessons About Evals", AI Engineer World's Fair 2025 (day not stated on page)** — [talk page](https://ai.engineer/talks/five-hard-earned-lessons-about-evals), [video](https://www.youtube.com/watch?v=a4BV0gGmXgA)
- Evals should let you adopt a new model within 24 hours, and turn a user-reported failure into an eval easily.
- "Scorers are the specification for the application." Synthetic datasets and generic judges do not make a useful system on their own.
- Keep evals for features that do not work yet. A Braintrust benchmark rose from about 10% to 58% across models and the feature shipped two weeks after Claude Sonnet 4.
- Give an optimizer the dataset and scorers, not just the prompt: 8.9% versus 39.14% on Braintrust's benchmark.

**Manu Goyal, "Why should anyone care about Evals?", AI Engineer World's Fair 2025** — [talk page](https://ai.engineer/talks/why-should-anyone-care-about-evals), [video](https://www.youtube.com/watch?v=jJ45Yz1lJao)
- "A higher model score does not establish that an application works."
- "Calling evals unit tests for AI captures only part of their purpose." The other part is experimentation before release.
- "Production feedback helps decide what to evaluate next."

**Ameya Bhatawdekar, "Your Agent Evolved. Your Evals Didn't.", AI Engineer World's Fair 2026** — [talk page](https://ai.engineer/talks/your-agent-evolved-your-evals-didn-t), [video](https://www.youtube.com/watch?v=nxokqOq1imY)
- "Architecture follows model capabilities; evaluations must follow architecture."
- "A single successful trace is insufficient evidence of repeatable behavior."
- pass@k (at least one of k attempts succeeds) versus pass^k (all k succeed). The page notes the talk's spoken definition of pass^k was imprecise.
- Finding new failure categories in production matters more than adding examples of known ones.

**"The Great Evals Debate — Ankur Goyal & Malte Ubl", Latent Space podcast (host swyx), 7 December 2025** — [video](https://www.youtube.com/watch?v=wQg5JtmoZXA). See section 3.

#### Anthropic

**Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares, Jiri De Jonghe, "Demystifying evals for AI agents", Anthropic Engineering, 9 January 2026** — [link](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Vocabulary: task, trial, grader, transcript, outcome, evaluation harness, agent harness, suite. Evaluating "an agent" means evaluating the harness and model together.
- Capability evals should start with low pass rates. Regression evals should sit near 100%. Capability evals "graduate" into regression suites. "An eval at 100% tracks regressions but provides no signal for improvement."
- pass@k "measures the likelihood that an agent gets at least one correct solution in k attempts". pass^k "measures the probability that all k trials succeed". 75% per trial gives roughly 42% over three trials.
- Grade the outcome, not a fixed sequence of steps, and give partial credit on multi-part tasks.
- Start with 20 to 50 tasks drawn from real failures. A 0% pass rate usually means a broken task. Isolate trials.
- "You won't know if your graders are working well unless you read the transcripts and grades from many trials." Owning evals "should be as routine as maintaining unit tests."

**"An update on recent Claude Code quality reports", Anthropic Engineering, 23 April 2026** — [link](https://www.anthropic.com/engineering/april-23-postmortem). See section 3.

**Michele Catasta (Replit) and Hannah Moran (Anthropic), "Evaluating and improving Replit Agent at scale", Code w/ Claude 2026, San Francisco, 6 May 2026** — [session page](https://claude.com/code-with-claude/session/sf-evaluating-and-improving-replit-agent-at-scale)
- Abstract only: many teams struggle to build evals that predict production performance.
- Replit closed the gap with ViBench, a public benchmark that checks whether generated apps work, plus an offline/online evaluation loop.
- Moran covers what separates evals that look rigorous from evals that help teams adopt new models confidently.

#### OpenAI

**"Evaluation best practices", OpenAI developer docs (undated)** — [link](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- Evals are "structured tests for measuring a model's performance." "Evaluate early and often".
- Four anti-patterns: overly generic metrics, biased design, vibe-based evals ("Using "it seems like it's working" as an evaluation strategy"), and ignoring human feedback ("Not calibrating your automated metrics against human evals").
- Guidance by architecture (single-turn, workflow, single-agent, multi-agent). Each step up adds a source of nondeterminism, such as tool selection or handoffs.
- Set up continuous evaluation "to run evals on every change".
- The page states OpenAI's Evals platform becomes read-only on 31 October 2026 and shuts down on 30 November 2026.

**DevDay sessions (not opened)**
- **[secondhand]** DevDay 2023 breakout "The New Stack and Ops for AI" by Sherwin Wu and Shyamal Hitesh Anadkat, 6 November 2023, spent most of its time on evaluation-driven development, according to a wiki entry — [aiwiki](https://aiwiki.ai/wiki/the_new_stack_and_ops_for_ai_openai_dev_day_2023)
- **[snippet only]** DevDay 2025 lists a session titled "Evals in Action: From Frontier Research to Production Applications" — [OpenAI DevDay](https://openai.com/devday/content/)

#### LangChain (Harrison Chase)

**Harrison Chase, "How to Build Agents That Improve Over Time: Model, Harness, Context", Interrupt London, 13 October 2026** — [notes by Bryce Watson, secondhand](https://brycewatson.com/research/agents-improve-over-time/), [video](https://www.youtube.com/watch?v=xy_7SzwsIjM)
- "Evals are where you define what good looks like." He endorses "evals are the new PRD".
- Evals are hard and have no silver bullet. The three hard parts are realistic inputs (production traces), defining good (final answer, end state or tool-call sequence), and a place to run them (simulation environments).
- Loop: run the agent, get feedback, open the trace, save the case as an eval, change weights, harness or context.
- Without a reliable judge, use metamorphic testing: ask two questions with the same meaning and check the answers agree.
- LangSmith Engine groups production failures into named issues and proposes fixes.

#### Arize

**Aparna Dhinakaran, "The Future of Evals: From LLM as a Judge to Agent as a Judge", AI Engineer World's Fair 2026** — [talk page](https://ai.engineer/talks/the-future-of-evals-from-llm-as-a-judge-to-agent-as-a-judge-aparna-dhinakaran-arize-ai), [video](https://www.youtube.com/watch?v=q2JrUKBMf0w)
- Three complementary methods: deterministic checks, fixed-rubric LLM judges for prompt-level failures, and agent-as-judge for trajectory and harness failures.
- "Offline and online evaluations each have a place."
- Their own agent "still forgot context, failed to recognize when a task was done and sometimes became stuck in loops."

#### Critics

**Ben Hylak (CTO, Raindrop), "Thoughts on Evals", raindrop.ai, 5 September 2025** — [link](https://raindrop.ai/blog/thoughts-on-evals/). See section 3.

**Stella Liu, "AI Evals Are Not Unit Tests for AI", Data Science x AI (Substack), 4 November 2025** — [link](https://datasciencexai.substack.com/p/ai-evals-are-not-unit-tests-for-ai). See section 4.

### Inferences
Recurring themes across the canon, each of which is developed with sources in sections 2 to 6:
- **Look at the data first.** Error analysis on real traces comes before any metric, judge or tool. This is the single most repeated instruction.
- **Evals are application-specific.** Generic metrics and model benchmarks do not show whether a product works.
- **Binary, narrow, validated.** Prefer pass/fail on one scoped criterion, and validate every LLM judge against human labels like a classifier.
- **A domain expert owns "good".** Criteria emerge from reviewing outputs, so someone with product judgment has to do the reviewing.
- **Evals are one layer.** Offline evals, production monitoring, A/B tests, user feedback and dogfooding each catch what the others miss.
- **It is data science more than testing.** The speakers reach for the scientific method, offline ML evaluation and statistics more often than for unit testing.

### Gaps
- No ranked roundup or reading list of eval resources was found, so "most cited" rests on cross-citation and the few signals above.
- OpenAI DevDay eval sessions were not opened. Their content is unverified.
- A Code w/ Claude 2026 session titled "You should build evaluation engineers instead of evaluation sets" appeared in search results, but its page returned 404. Speaker and content are unknown.
- Vanishing Gradients episode 60, "10 Things I Hate About AI Evals with Hamel Husain", exists in podcast listings but its page returned 404. Date and content are unverified.
- Harrison Chase's Interrupt 2025 and Interrupt 2026 (13-14 May 2026, San Francisco) eval content was seen only in third-party recaps.
- The full AI Engineer World's Fair 2026 evals-track lineup was not found. The intro names Uber, Snorkel and a company transcribed as "Turnbench".
- The UIST 2024 venue for "Who Validates the Validators?" is not stated on the arXiv page.

## 2. What concrete workflow do they teach?

### Takeaway
The taught workflow is: review real traces, write free-text notes, cluster them into a failure taxonomy, fix the cheap problems, then build narrow binary evaluators (code first, LLM judge only where needed) and validate each judge against human labels before trusting it. Automated evals then run in CI on a small curated set and on sampled production traces, and the loop restarts whenever new failures appear.

### Cited Findings

**Error analysis**
- Open coding (free-text notes on traces), then axial coding (grouping into a failure taxonomy), repeated until no new failure modes appear — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Review at least 30 traces yourself, build toward about 100 diverse traces, and label 100 to 200 examples per failure mode for an LLM judge — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- In multi-turn traces, "Annotate only the first failure in the trace at first." — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Bottom-up analysis, where failure modes emerge from data, beat starting from generic categories — [Hamel Husain](https://hamel.dev/blog/posts/field-guide/)
- LLMs can help with first-pass axial coding, but open coding, taxonomy validation and ground-truth labeling stay human: "Use LLMs to scale what you’ve learned, not to avoid looking at data." — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- A minimal starting recipe: pull about 50 recent traces, have a PM or domain expert label them, cluster failures, pick one high-impact failure mode, write a binary eval, validate it against human labels — [Arize write-up of Husain](https://arize.com/?p=29757)

**Look at your data**
- Bischof's team runs a weekly "evals party" — [Humanloop](https://humanloop.com/blog/LLM-eval-done-right)
- Review input-output samples daily, because criteria drift as developers see more data — [applied-llms.org](https://applied-llms.org/)

**Binary versus Likert**
- "Binary evaluations force clearer thinking and more consistent labeling." — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Yan uses pass/fail for objective criteria and win/lose/tie for comparisons, and avoids 1-5 scales because annotators and LLMs cannot separate adjacent scores consistently — [Eugene Yan](https://eugeneyan.com/writing/product-evals/)
- OpenAI recommends pairwise comparison or pass/fail grading for LLM judges — [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- Counterpoint: Anthropic recommends partial credit for multi-part agent tasks and allows weighted, binary or hybrid scoring — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

**Aligning an LLM judge with human labels**
- Report True Positive Rate and True Negative Rate, split labels into train 10-20%, dev 40-45%, test 40-45%, and run the frozen judge on the test set once — [Hamel Husain](https://hamel.dev/blog/posts/llm-judge/)
- Yan uses a 75/25 dev/test split, precision and recall (prioritizing recall on the fail class) and Cohen's kappa, with human-human agreement as the bar — [Eugene Yan](https://eugeneyan.com/writing/product-evals/)
- For pairwise judging, run twice with the order swapped and treat inconsistent verdicts as ties — [Eugene Yan](https://eugeneyan.com/writing/product-evals/)
- Give judges an "Unknown" option and make graders resistant to cheating — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Scale an LLM judge only once it "consistently agrees with human annotations" — [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- Using critiques as few-shot examples reportedly raised human-LLM agreement by 15-20% — [Hamel Husain](https://hamel.dev/blog/posts/field-guide/)

**Synthetic data**
- Define dimensions first, generate structured tuples, then convert tuples to natural-language queries in a separate step. Synthetic data "cannot tell you how common a failure is in production." — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Synthetic data "is not as good as real data, but it's a good starting point." — [Hamel Husain](https://hamel.dev/blog/posts/llm-judge/)
- Yan prefers organic failures (from weaker models or production) because synthetic defects are out of distribution — [Eugene Yan](https://eugeneyan.com/writing/product-evals/)

**Custom annotation tools**
- A custom tool is "the single most impactful investment you can make." "Keep your annotation interface minimal." — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Five features: show all context, one-click feedback, open-ended notes, quick filtering, hotkeys. The post claims teams with good viewers iterate about 10x faster — [Hamel Husain](https://hamel.dev/blog/posts/field-guide/)

**Criteria drift and ownership**
- "it is impossible to completely determine evaluation criteria prior to human judging of LLM outputs." — [Hamel Husain, citing Shankar et al.](https://hamel.dev/blog/posts/field-guide/)
- Two domain experts should independently reach the same verdict on a task — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

**Offline versus online, CI versus production**
- CI uses small curated datasets to "protect against known regressions before deployment", including "regression tests for past bugs". Production monitoring samples live traces with reference-free evaluators and tracks confidence intervals — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Automated evals suit pre-launch and CI/CD, monitoring and A/B tests suit post-launch, and human review calibrates the system. Anthropic calls this a Swiss cheese model — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Apply the same offline metrics to live data so production feeds the next eval — [Manu Goyal, AI Engineer](https://ai.engineer/talks/why-should-anyone-care-about-evals)

**Guardrails versus evals**
- Guardrails are fast inline checks that block objective, high-impact failures. Evaluators run after the response. "you would almost never use a slow or non-deterministic LLM-as-Judge as a synchronous guardrail." — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- "And if your evals are reference-free, they can be used as guardrails too." — [applied-llms.org](https://applied-llms.org/)

**Agents**
- Assess end-to-end task success first, then run step-level diagnostics on tool choice, parameters and error handling. A transition failure matrix shows where first failures cluster — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Each trial should start from a clean, isolated environment. Shared state causes correlated failures, such as an agent reading git history from earlier trials — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

**Cost and cadence**
- How often to run an eval depends on its cost, how saturated it is, and the value of catching the error. "There are no bright-line rules." — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Sample size is a cost decision: halving the margin of error needs four times the samples — [Eugene Yan](https://eugeneyan.com/writing/product-evals/)
- Do a cost-benefit check before building any evaluator — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/should-i-practice-eval-driven-development.html)

### Inferences
- The workflow starts from observed failures, not from a written spec. In deck terms, the step before "write eval" is "read traces and name the failure modes", and the deck's loop does not have that step.
- The deck's "partial credit" term sits in tension with the practitioner preference for binary judgments. The sources reconcile the two by keeping each grader binary and getting nuance from several narrow graders, with Anthropic allowing partial credit on multi-part agent tasks.
- The human-label alignment workflow (TPR/TNR or precision/recall on a held-out split) is the practitioner version of the deck's "graders need tests". It is a different technique from mutation-scoring a grader, and the two are complementary.
- Custom review tools, synthetic data by dimensions, domain-expert ownership and the guardrail versus evaluator split have no counterpart in the deck's pages as described.

### Gaps
- The Lenny's Podcast figures of "3 to 4 days upfront" and "4 to 7 LLM judges" come from a third-party summary, not the show notes.
- Husain's judge guide now uses TPR/TNR while his 2026 talk says precision and recall. I could not tell whether the guide's wording changed in its September 2026 revision.

## 3. What was the 2025-2026 "evals vs vibes" / "do you even need evals" debate?

### Takeaway
In early September 2025 a cluster of posts argued that top coding-agent teams ship without formal evals and that production signals and A/B tests matter more. Shankar, Husain and others replied that "evals" means systematic measurement in any form. By 2026 both sides had converged on a layered view: offline evals for regression and iteration, plus production monitoring, A/B tests and dogfooding. Anthropic's own Claude Code postmortem shows the limits of relying on dogfooding and narrow evals.

### Cited Findings

**The anti-evals side**
- swyx's post (September 2025) reads: "Claude Code: no evals [well known code agent company]: no evals [well known code agent company 2]: kinda halfassed evals [leading vibe coding company]: no evals [ceo of company selling you evals]: mmmmm yess all my top customers do evals, you should do evals". The text is from the search listing; the post itself returned HTTP 402 — [swyx on X](https://x.com/swyx/status/1963725773355057249)
- Ben Hylak's essay responds to a Braintrust post by Ankur Goyal. It concedes "Like tests, evals are great at preventing regressions." — [Raindrop](https://raindrop.ai/blog/thoughts-on-evals/)
- Hylak's case against evals as a quality measure: "You wouldn't brag about how many unit tests your product passes." Eval sets are "often adversarially selected", so they become "a collection of issues you already know about." — [Raindrop](https://raindrop.ai/blog/thoughts-on-evals/)
- Hylak on agents: "As agents get more capable, they become more unpredictable." "There is no such thing as stable." — [Raindrop](https://raindrop.ai/blog/thoughts-on-evals/)
- His alternative: production signals (thumbs, regenerations, custom detectors for loops), A/B experiments that take "minutes to deploy, hours to get answers", and about 100 smoke-test cases. "Or you can write 10,000,000 evals. Your choice." — [Raindrop](https://raindrop.ai/blog/thoughts-on-evals/)
- Hylak is CTO of Raindrop, which sells production monitoring, so the essay is also a vendor position — [Raindrop](https://raindrop.ai/blog/thoughts-on-evals/)

**The rebuttals**
- Shankar's post links three "anti-evals" posts (Ben Hylak, swyx, Jason Liu) and answers them — [Shreya Shankar](https://www.sh-reya.com/blog/in-defense-ai-evals/)
- Her core move is definitional: evals are "systematic measurement of application quality", and dogfooding done deliberately is error analysis that "happens continuously" — [Shreya Shankar](https://www.sh-reya.com/blog/in-defense-ai-evals/)
- Coding agents can get away with less because model providers already evaluate coding heavily — [Shreya Shankar](https://www.sh-reya.com/blog/in-defense-ai-evals/)
- Lenny's show notes say the popular "you don't need evals" stance is misleading, and the episode has a chapter titled "Why dogfooding isn't enough for most AI products" — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/why-ai-evals-are-the-hottest-new-skill)
- **[secondhand]** Shankar on the backlash: "People have been burned by evals in the past." — [podcast summary](https://podcasts-distilled-hugo-content.pages.dev/lennys-podcast-product-career-growth/why-ai-evals-are-the-hottest-new-skill-for-product-builders-hamel-husain-shreya-shankar-creators-of/)

**The December 2025 Latent Space debate**
- **[secondhand]** The episode opens from the claim that Claude Code lacks traditional evals and relies on vibes. It frames evals, A/B tests and vibes as a spectrum of feedback loops and recommends investing in all three. The summary does not attribute points to Goyal or Ubl individually — [Summify summary](https://summify.io/discover/the-great-evals-debate-ankur-goyal-malte-ubl-wQg5Jt)
- **[secondhand]** The same summary says offline evals are the tool for reconciling production behavior with iteration: capture real failures from logs and reproduce them offline — [Summify summary](https://summify.io/discover/the-great-evals-debate-ankur-goyal-malte-ubl-wQg5Jt)

**Where it landed (2026)**
- Anthropic says Claude Code "started with fast iteration on feedback" and added evals later, first for narrow areas such as concision and file edits — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Anthropic's position: teams get far on manual testing, dogfooding and intuition, then hit a breaking point in production where they are "flying blind" and cannot separate real regressions from noise — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Anthropic's Claude Code postmortem: "neither our internal usage nor evals initially reproduced the issues identified." Three changes (4 March, 26 March, 16 April 2026) degraded quality — [Anthropic](https://www.anthropic.com/engineering/april-23-postmortem)
- A later ablation found "One of these evaluations showed a 3% drop for both Opus 4.6 and 4.7." — [Anthropic](https://www.anthropic.com/engineering/april-23-postmortem)
- Remediation: "run a broad suite of per-model evals for every system prompt change to Claude Code", add soak periods and gradual rollouts, and have more staff use the exact public build — [Anthropic](https://www.anthropic.com/engineering/april-23-postmortem)
- **[snippet only]** Boris Cherny described running ablations at each model release as "essentially an eval", which undercuts the "no evals" label — [YC Root Access](https://www.ycrootaccess.com/p/boris-cherny-building-claude-code)
- Husain in March 2026: "They claim “RAG is dead” or “evals are dead,” yet build systems that depend on those concepts." — [Hamel Husain](https://hamel.dev/blog/posts/revenge/)
- By July 2026 the AI Engineer evals track framed it as settled: "offline evals, online evals, they each have their own place." — [conference transcript](https://agents.conffab.com/worlds-fair/live/day-1-keynotes/sessions/1782926700.md)

### Inferences
- The debate was mostly about the word "evals". Critics meant offline golden sets and LLM judges. Defenders meant any systematic measurement, including A/B tests and structured dogfooding. Once the definition widened, little disagreement was left.
- The Claude Code postmortem is the most useful single case for a deck: dogfooding and existing evals both missed the regressions, and the fix was more layers (broader evals, ablations, soak periods, gradual rollout), not one better layer.
- The deck's closing line, "No evals, no deploy", takes the pre-deploy gate position. The 2026 consensus adds that a gate is necessary and not sufficient: Hylak's point that a passing eval set only covers "issues you already know about" is not answered by gating alone.
- Shankar's observation that coding agents inherit evaluation from model providers explains why the loudest "we ship on vibes" teams were coding-agent teams. It does not transfer to most application domains.

### Gaps
- The X posts by swyx, Ben Hylak and Jason Liu could not be opened (HTTP 402). Hylak's 2 September 2025 post about A/B tests and the Statsig acquisition, and Liu's position, are known only through search snippets and Shankar's links.
- The Ankur Goyal post that Hylak answers was not found.
- No transcript of the Latent Space debate was found, so Goyal's and Ubl's individual arguments are unverified.
- The Lenny's Podcast debate segment is paywalled. What Husain and Shankar said about Claude Code specifically is unverified.
- I found no primary statement from the Claude Code team saying they do no evals.

## 4. What do these speakers say explicitly about how evals resemble or differ from unit tests and software testing?

### Takeaway
They accept the analogy for one job, regression protection in CI, and reject it as a description of the whole practice. The stated differences are that eval criteria are discovered from data and not specified up front, pass rates below 100% are expected and useful, the grader itself is fallible, and a passing suite says little about real-world quality. Several speakers say the better analogy is the scientific method or classic offline ML evaluation.

### Cited Findings

**Where they say the analogy helps**
- Husain's Level 1 evals are literally unit tests: assertions run on every code change through existing CI. He writes that "tests in software engineering pay massive dividends in the long term despite requiring up-front investment." — [Hamel Husain](https://hamel.dev/blog/posts/evals/)
- The CI dataset should include "regression tests for past bugs", and new production issues should be added to it — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Anthropic: owning evals "should be as routine as maintaining unit tests", failures become test cases, and regression evals should sit near 100% — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- OpenAI: set up continuous evaluation "to run evals on every change" — [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- Yan frames eval-driven development as "similar to test-driven development where we write tests before implementing software that passes those tests." — [Eugene Yan](https://eugeneyan.com/writing/eval-process/)
- Chase's loop ends by saving each failing case as an eval so later changes do not regress — [Bryce Watson's notes, secondhand](https://brycewatson.com/research/agents-improve-over-time/)

**Where they say it misleads**
- Write-the-test-first does not transfer, according to Husain and Shankar. EDD is "Generally no" because you cannot predict how an LLM will fail — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/should-i-practice-eval-driven-development.html)
- This is a live disagreement. Anthropic recommends eval-driven development (write evals for planned capabilities before the agent can do them), and Yan and Ankur Goyal say to write the eval first — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents); [Eugene Yan](https://eugeneyan.com/writing/eval-process/); [Latent Space](https://www.latent.space/p/braintrust)
- Passing is not the goal. A 100% pass rate means the eval is too easy, and capability evals should start low — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/); [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Ankur Goyal keeps evals that fail on purpose, for features no model can do yet, so the team notices when a new model makes them viable — [AI Engineer](https://ai.engineer/talks/five-hard-earned-lessons-about-evals)
- "Calling evals unit tests for AI captures only part of their purpose." Evals are also the lab for experiments before release — [Manu Goyal, AI Engineer](https://ai.engineer/talks/why-should-anyone-care-about-evals)
- Evals cost considerably more than unit tests to maintain and run — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- One green run proves little: "A single successful trace is insufficient evidence of repeatable behavior." — [Ameya Bhatawdekar, AI Engineer](https://ai.engineer/talks/your-agent-evolved-your-evals-didn-t)
- Hylak turns the analogy against evals: nobody brags about unit-test counts, and software teams moved from heavy up-front testing to monitoring once they could ship fixes in minutes — [Raindrop](https://raindrop.ai/blog/thoughts-on-evals/)
- Stella Liu gives three reasons evals are not unit tests: they probe behavior, not code logic ("There is no single line of code that ensures accuracy or consistency."); they are nondeterministic, so they need samples and a threshold; and the analogy wrongly makes evals a developer-only concern when they should start from the product — [Stella Liu](https://datasciencexai.substack.com/p/ai-evals-are-not-unit-tests-for-ai)
- **[snippet only]** Ankur Goyal: unit tests are "a pure function of code", while evals also depend on data, and sourcing good data is the hard part — [podcast transcript](https://share.transistor.fm/s/4375755a/transcription)

**The alternative analogies they prefer**
- The applied-llms authors note evaluation gets framed three ways, "it's simply unit testing, or it's more like observability, or maybe it's just data science", and find all three useful — [applied-llms.org](https://applied-llms.org/)
- "Building product evals is simply the scientific method in disguise." — [Eugene Yan](https://eugeneyan.com/writing/eval-process/)
- Bischof: evals are the offline evaluation ML teams have always done — [Humanloop](https://humanloop.com/blog/LLM-eval-done-right)
- Husain maps each eval pitfall to a classic data science practice (EDA, model evaluation, experimental design, data collection, production ML) — [Hamel Husain](https://hamel.dev/blog/posts/revenge/)
- Evals as specification: "Scorers are the specification for the application." — [Ankur Goyal, AI Engineer](https://ai.engineer/talks/five-hard-earned-lessons-about-evals); "Evals are the new PRDs" — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/why-ai-evals-are-the-hottest-new-skill)

### Inferences
- The deck's thesis matches the practitioner view for regression suites, CI, "every bug becomes a case" and "graders need tests". Those pages are well supported.
- The deck's "eval-driven development" habit is contested by the most-cited source in the field. A deck that recommends it should acknowledge the "errors you discover, not errors you imagine" objection, or scope EDD to known constraints and planned capabilities.
- The deck maps evals to the model ("evals check the model", "evals on every checkpoint"). The practitioner canon evaluates the application: prompt, retrieval, tools, harness and model together. For an application-layer audience that is the largest framing difference.
- The deck's "where the analogy breaks" list (noise, no spec, Goodhart, leakage) overlaps with the sources on noise, missing spec and Goodhart. The sources add four more breaks: criteria drift, the fallible grader needing human labels, expected sub-100% pass rates with capability versus regression suites, and the limit that a passing suite only covers known failures.
- Three analogies the deck does not use carry much of the practitioner framing: evals as scientific method, evals as product spec or PRD, and evals as offline ML evaluation.

### Gaps
- I found no source among those opened that discusses mutation testing of graders, A/A runs or item rotation by those names. I did not search for them specifically, so absence here is weak evidence.
- Pydantic Evals and its pytest-like framing were out of scope and not researched.

## 5. Which anti-patterns do they name?

### Takeaway
The named anti-patterns cluster into five groups: measuring the wrong thing (generic metrics), trusting an unchecked grader, hiding ambiguity in scales and dashboards, skipping the humans who know what good is, and automating before looking.

### Cited Findings

**Generic or borrowed metrics**
- Off-the-shelf metrics "tend to lead people astray." — [Hamel Husain](https://hamel.dev/blog/posts/llm-judge/)
- Scores like helpfulness or coherence are too generic to diagnose failures. Use app-specific metrics such as "Calendar Scheduling Failure" — [Hamel Husain](https://hamel.dev/blog/posts/revenge/)
- "Relying solely on academic metrics like perplexity or BLEU score." — [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- "We strongly advise against offering generic metrics" on an internal eval platform — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Treating a model benchmark score as proof the application works — [Manu Goyal, AI Engineer](https://ai.engineer/talks/why-should-anyone-care-about-evals)

**Unvalidated judges**
- Trusting a judge because its score looks authoritative, or reporting accuracy when failures are rare — [Arize write-up of Husain](https://arize.com/?p=29757)
- "Not calibrating your automated metrics against human evals." — [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- The "God Evaluator" that checks 5-10 criteria in one prompt — [Eugene Yan](https://eugeneyan.com/writing/product-evals/)
- Believing an AI can evaluate itself, or that an off-the-shelf tool solves everything (paraphrased) — [podcast summary, secondhand](https://podcasts-distilled-hugo-content.pages.dev/lennys-podcast-product-career-growth/why-ai-evals-are-the-hottest-new-skill-for-product-builders-hamel-husain-shreya-shankar-creators-of/)

**Scales, sprawl and vanity dashboards**
- "Arbitrary scoring: Using uncalibrated scales (like 1-5) across multiple dimensions." and "Too many metrics: Creating numerous measurements that become unmanageable." — [Hamel Husain](https://hamel.dev/blog/posts/llm-judge/)
- Dashboards with about 50 metrics, uncalibrated scores without confidence intervals, and a single score such as 3.7 used as a ship signal — [Arize write-up of Husain](https://arize.com/?p=29757)
- "a RAG evaluation framework with 20 different metrics", and "complexity theater" — [Jason Liu](https://jxnl.co/writing/2025/05/19/there-are-only-6-rag-evals/)
- A 100% pass rate, which signals an unchallenging eval — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Over-optimizing one eval until it stops measuring anything (Goodhart) — [applied-llms.org](https://applied-llms.org/)

**People and process**
- Skipping error analysis and chasing tools first — [Hamel Husain](https://hamel.dev/blog/posts/field-guide/)
- "Ignoring domain experts", and developers acting as proxy for the expert — [Hamel Husain](https://hamel.dev/blog/posts/llm-judge/)
- Outsourcing core error analysis — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/)
- Making annotators read raw JSON instead of giving them a labeling UI — [Hamel Husain](https://hamel.dev/blog/posts/revenge/)
- Expecting an LLM-as-judge to fix a product when nobody reviews outputs — [Eugene Yan](https://eugeneyan.com/writing/eval-process/)
- Vibe-based evals, and delaying evals until after shipping — [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

**Bad datasets and harnesses**
- "Creating eval datasets that don't faithfully reproduce production traffic patterns." — [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices)
- Synthetic test sets generated by prompting with no grounding in real logs — [Hamel Husain](https://hamel.dev/blog/posts/revenge/)
- Offline scores never validated against live traffic — [Arize write-up of Husain](https://arize.com/?p=29757)
- Grading a fixed sequence of steps, ambiguous tasks, and shared state between trials — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Evaluating only one-sided cases. Test both when a behavior should happen and when it should not — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Eval sets that only contain known issues and lag real user behavior — [Raindrop](https://raindrop.ai/blog/thoughts-on-evals/)
- Automating too much: "They cannot look at the data for you." — [Hamel Husain](https://hamel.dev/blog/posts/revenge/)

### Inferences
- The deck already covers the 100% pass rate, the vanity dashboard and step-grading anti-patterns through "a green dashboard is not a good model", "read the failures" and "grade outcomes not steps".
- The deck does not name the three anti-patterns that practitioners repeat most: generic off-the-shelf metrics, Likert scales, and judges never checked against human labels.
- "Eval sets nobody reads" appears in the sources as its positive form (read transcripts, look at data) more than as a named anti-pattern.

### Gaps
- No source quantified how common each anti-pattern is. The lists are experience-based.

## 6. What changed in advice between 2023 and late 2026?

### Takeaway
The advice moved from choosing metrics (2023), to building an eval system around your own data (2024), to error analysis as the core activity and a public backlash (2025), to agent evals with their own vocabulary and to coding agents automating the eval plumbing (2026). The constant across all four years is "look at the data"; what changed is what gets evaluated (model output, then application, then agent plus harness) and who does the mechanical work.

### Cited Findings

**2023: metrics, benchmarks and legitimate vibe checks**
- Yan's July 2023 survey spends most of its evals section on BLEU, ROUGE, BERTScore, MoverScore and G-Eval, coins "Eval Driven Development (EDD)", and quotes "The vibe-based eval cannot be underrated." — [Eugene Yan](https://eugeneyan.com/writing/llm-patterns/)
- **[secondhand]** OpenAI's November 2023 DevDay breakout reportedly centered on evaluation-driven development — [aiwiki](https://aiwiki.ai/wiki/the_new_stack_and_ops_for_ai_openai_dev_day_2023)

**2024: application-specific eval systems**
- By March 2024 Yan says off-the-shelf evals "barely correlate with application-specific performance." — [Eugene Yan](https://eugeneyan.com/writing/evals/)
- Husain's three-level system (assertions, human and model eval, A/B tests) and custom data viewers appear in March 2024 — [Hamel Husain](https://hamel.dev/blog/posts/evals/)
- Criteria drift is named in April 2024 — [Shankar et al.](https://arxiv.org/abs/2404.12272)
- The June 2024 group essay still leads with "unit tests (i.e., assertions)" — [applied-llms.org](https://applied-llms.org/)
- LLM-as-judge gets a method (Critique Shadowing) and a skeptical literature review in late 2024 — [Hamel Husain](https://hamel.dev/blog/posts/llm-judge/); [Eugene Yan](https://eugeneyan.com/writing/llm-evaluators/)

**2025: process over tools, mainstreaming and backlash**
- Error analysis becomes the headline in March 2025 — [Hamel Husain](https://hamel.dev/blog/posts/field-guide/)
- Yan's April 2025 title states the shift: the judge "Won't Save The Product", fixing the process will — [Eugene Yan](https://eugeneyan.com/writing/eval-process/)
- The FAQ reverses the 2023 EDD advice ("Generally no") in July 2025 — [Husain and Shankar FAQ](https://hamel.dev/blog/posts/evals-faq/should-i-practice-eval-driven-development.html)
- Evals reach product managers: "Evals are the new PRDs" — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/why-ai-evals-are-the-hottest-new-skill)
- The September 2025 backlash and defense — [Raindrop](https://raindrop.ai/blog/thoughts-on-evals/); [Shreya Shankar](https://www.sh-reya.com/blog/in-defense-ai-evals/)
- Statistics enter the mainstream recipe in November 2025 (sample sizes, confidence intervals, kappa) — [Eugene Yan](https://eugeneyan.com/writing/product-evals/)

**2026: agents, harnesses and automated loops**
- January 2026: Anthropic supplies the agent-eval vocabulary (task, trial, grader, transcript, outcome), pass^k, capability versus regression suites, and saturation — [Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- March 2026: Husain and Shankar package their method as skills for coding agents, and Husain reframes the harness as data science — [Evals Skills](https://hamel.dev/blog/posts/evals-skills/); [Revenge of the Data Scientist](https://hamel.dev/blog/posts/revenge/)
- June 2026: "The hardest problems in agent engineering are now evaluation problems". Coding agents need logs, metrics and traces exposed to them so they can tell when they introduce a regression — [Arize write-up of Husain](https://arize.com/?p=29757)
- July 2026: agent-as-judge for trajectory failures, and "evaluations must follow architecture" — [Aparna Dhinakaran, AI Engineer](https://ai.engineer/talks/the-future-of-evals-from-llm-as-a-judge-to-agent-as-a-judge-aparna-dhinakaran-arize-ai); [Ameya Bhatawdekar, AI Engineer](https://ai.engineer/talks/your-agent-evolved-your-evals-didn-t)
- August 2026: Husain and Shankar distinguish top-down evals (rules defined upfront) from bottom-up evals (failures found in data), and say evals are "completely different now with the latest models" — [Peter Yang, Behind the Craft](https://creatoreconomy.so/p/how-to-build-better-ai-evals-with-claude-code-shreya-hamel)
- October 2026: products that read production traces, cluster failures into named issues and propose fixes. Chase calls a fully self-improving agent a far-off "North Star" — [Bryce Watson's notes, secondhand](https://brycewatson.com/research/agents-improve-over-time/)
- OpenAI's docs say its hosted Evals platform is being shut down on 30 November 2026 — [OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices)

**What stayed constant**
- "Always look at the data" closes Husain's 2026 talk, as it anchored his 2024 essay — [2026](https://hamel.dev/blog/posts/revenge/); [2024](https://hamel.dev/blog/posts/evals/)
- Human judgment still defines "good": "Claude can't read your mind. Claude doesn't know what good and bad is." — [Arize write-up of Husain](https://arize.com/?p=29757)

### Inferences
- The unit of evaluation moved up a level each year: a single model output (2023), an application pipeline (2024-2025), then an agent plus its harness across repeated trials (2026). The deck's model-and-checkpoint framing matches the earliest of these.
- The 2026 material makes the deck's pass^k, "grade outcomes not steps" and "read the failures" pages current. Those ideas are prominent in Anthropic's January 2026 guide and the July 2026 talks.
- The most recent shift, coding agents doing eval plumbing while humans keep the labeling and the definition of good, is absent from the deck and is the freshest addition available.
- The view of vibe checks went full circle: praised in 2023, listed as an anti-pattern by OpenAI, then readmitted in 2025-2026 as one legitimate input among several feedback loops.

### Gaps
- June to November 2026 coverage relies on a few pages: the Arize write-up, two ai.engineer talk pages, secondhand notes on Interrupt London, a paywalled Peter Yang post and a QCon abstract. I found no major new essay from Yan, Shankar or Anthropic in that window.
- The claim that evals are "completely different now with the latest models" is a topic heading from a paywalled post. The argument behind it is unverified.
- I did not verify the reason for OpenAI's Evals platform shutdown or what replaces it.
