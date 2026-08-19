const { chromium } = require("playwright");

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const edgePath = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const screenshotDir = process.env.QA_SCREENSHOT_DIR;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: edgePath });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 960 });
  const runtimeErrors = [];
  let expectLoadFailure = false;

  page.on("pageerror", (error) => runtimeErrors.push("pageerror: " + error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !expectLoadFailure) runtimeErrors.push("console: " + message.text());
  });
  page.on("requestfailed", (request) => {
    if (!expectLoadFailure) runtimeErrors.push("request: " + request.url() + " " + (request.failure()?.errorText || "failed"));
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  assert(await page.title() === "Metric English · 数据分析英语训练台", "Unexpected V1.2 page title");
  assert(await page.locator('[data-program="writing"]').getAttribute("aria-pressed") === "true", "Writing should be the default program");
  assert(await page.locator("#roadmapList li").count() === 10, "Writing roadmap should contain ten scenarios");
  const contentAudit = await page.evaluate(async () => {
    const required = ["Workplace Context", "Data Brief", "Model Email", "Structure Breakdown", "Language Toolkit", "Model Task", "Model Reference", "Guided Task", "Guided Reference", "Independent Task", "Independent Reference", "Oral Retell"];
    const manifest = await fetch("./content/writing/manifest.json").then((response) => response.json());
    const results = await Promise.all(manifest.map(async (item) => {
      const text = await fetch(item.path).then((response) => response.text());
      const headings = Array.from(text.matchAll(/^##\s+(.+)$/gm), (match) => match[1].trim());
      return { id: item.id, missing: required.filter((heading) => !headings.includes(heading)) };
    }));
    return { count: manifest.length, results };
  });
  assert(contentAudit.count === 10 && contentAudit.results.every((item) => item.missing.length === 0), "Writing Markdown section audit failed: " + JSON.stringify(contentAudit));
  assert((await page.locator("#dayNumber").innerText()) === "001", "Fresh writing progress should start on day one");
  assert((await page.locator("#todayModeLabel").innerText()) === "READY TO START", "Fresh progress should wait for an explicit start");
  if (screenshotDir) await page.screenshot({ path: screenshotDir + "/v12-writing-dashboard.png", fullPage: true });

  await page.locator("#startTrainingButton").click();
  await page.locator("#writingView:not([hidden])").waitFor();
  await page.locator("#writingDraft:not([disabled])").waitFor();
  assert((await page.locator("#writingEyebrow").innerText()).includes("DAY 01"), "Day one writing workspace did not open");
  assert((await page.locator("#writingModeLabel").innerText()) === "BASELINE WRITING", "Day one should be the baseline");
  assert(await page.locator("#referencePanel").isHidden(), "Reference must be hidden before submission");
  assert(await page.locator("#modelExampleCard").isHidden(), "The day-one model must be hidden before the baseline");

  const maliciousDraft = '<img src=x onerror=window.__xss=1> Conversion fell this week while traffic stayed stable. I recommend checking mobile payment errors before changing the rollout.';
  await page.locator("#writingDraft").fill(maliciousDraft);
  await page.waitForTimeout(650);
  let stored = await page.evaluate(() => JSON.parse(localStorage.getItem("metricEnglish.v1")));
  assert(stored.schemaVersion === 3, "Progress schema should be V3");
  assert(stored.writingProgram.attempts["1"].draftText === maliciousDraft, "Draft autosave did not preserve text");
  assert(stored.writingProgram.attempts["1"].firstSubmission === null, "Autosave must not submit a draft");

  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#writingDraft:not([disabled])").waitFor();
  assert(await page.locator("#writingDraft").inputValue() === maliciousDraft, "Draft did not survive reload");

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#submitWritingButton").click();
  await page.locator("#submissionPanel:not([hidden])").waitFor();
  assert(await page.locator("#firstSubmissionText").innerText() === maliciousDraft, "First submission snapshot changed");
  assert(await page.locator("#firstSubmissionText img").count() === 0, "User text was interpreted as HTML");
  assert(await page.evaluate(() => window.__xss) !== 1, "Injected event handler executed");
  assert(await page.locator("#referencePanel").isHidden(), "Reference should remain hidden before self-review");

  for (const item of ["clarity", "evidence", "logic", "tone", "action"]) {
    await page.locator('input[name="' + item + '"][value="2"]').focus();
    await page.keyboard.press("Space");
  }
  await page.locator("#reflectionNote").fill("Lead with the result and keep the causal claim cautious.");
  await page.locator("#saveAssessmentButton").click();
  await page.locator("#referencePanel:not([hidden])").waitFor();
  assert((await page.locator("#referenceAnswer").innerText()).includes("Mobile checkout conversion update"), "Baseline reference did not unlock");
  stored = await page.evaluate(() => JSON.parse(localStorage.getItem("metricEnglish.v1")));
  assert(Boolean(stored.writingProgram.attempts["1"].completedAt), "Completed writing day was not saved");
  assert(stored.writingProgram.attempts["1"].firstSubmission.text === maliciousDraft, "First snapshot was overwritten");
  assert(stored.writingProgram.attempts["1"].assessment.scores.clarity === 2, "Rubric score was not saved");

  await page.locator("#writingDraft").fill(maliciousDraft + " The revised version adds a clear owner and deadline.");
  await page.waitForTimeout(650);
  stored = await page.evaluate(() => JSON.parse(localStorage.getItem("metricEnglish.v1")));
  assert(stored.writingProgram.attempts["1"].firstSubmission.text === maliciousDraft, "Revision overwrote the first submission");
  assert(stored.writingProgram.attempts["1"].draftText !== stored.writingProgram.attempts["1"].firstSubmission.text, "Revision was not saved separately");

  await page.locator("#nextWritingButton").click();
  await page.locator("#writingDraft:not([disabled])").waitFor();
  assert((await page.locator("#writingEyebrow").innerText()).includes("DAY 02"), "Completing day one did not unlock day two");
  assert((await page.locator("#writingModeLabel").innerText()) === "GUIDED DAY", "Day two should be guided practice");
  const dayTwoDraft = "The regional review will support Friday's budget decision. I will compare revenue and order volume, then share the result by Wednesday.";
  await page.locator("#writingDraft").fill(dayTwoDraft);
  await page.waitForTimeout(650);

  await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem("metricEnglish.v1"));
    data.writingProgram.startedAt = "2020-01-01T00:00:00.000Z";
    localStorage.setItem("metricEnglish.v1", JSON.stringify(data));
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#writingDraft:not([disabled])").waitFor();
  assert((await page.locator("#writingEyebrow").innerText()).includes("DAY 02"), "Writing plan advanced because calendar time changed");
  if (screenshotDir) await page.screenshot({ path: screenshotDir + "/v12-workbench-desktop.png", fullPage: true });

  await page.locator("#writingBackButton").click();
  await page.locator('.nav-button[data-view="records"]').click();
  assert(await page.locator("#recordsList .scenario-record").count() === 10, "Records should be grouped into ten scenarios");
  assert((await page.locator("#recordsList").innerText()).includes("10/10"), "Saved self-review score is missing from records");

  await page.locator('.nav-button[data-view="dashboard"]').click();
  await page.locator('[data-program="reading"]').click();
  assert(await page.locator("#dailyTaskList .daily-task").count() === 4, "V1.1 reading tasks were not preserved");
  assert(await page.locator("#libraryList .library-item").count() === 11, "Reading library should keep one framework and ten articles");
  await page.locator("#startTrainingButton").click();
  await page.locator("#readerView:not([hidden])").waitFor();
  await page.locator("#readerContent .markdown-body").waitFor();
  await page.locator('button[data-section="English Original"]').focus();
  await page.keyboard.press("ArrowRight");
  assert(await page.locator('button[data-section="Chinese Translation"]').getAttribute("aria-selected") === "true", "Reader keyboard tabs regressed");
  await page.locator('button[data-section="Vocabulary"]').click();
  await page.locator(".vocab-action").first().click();
  assert((await page.locator(".vocab-action").first().innerText()) === "已掌握", "Vocabulary state did not update");

  await page.locator('.brand[data-view="dashboard"]').click();
  await page.locator('[data-program="writing"]').click();
  expectLoadFailure = true;
  await page.route("**/content/writing/01-requirement-clarification.md", (route) => route.fulfill({ status: 500, body: "temporary error" }));
  await page.locator("#startTrainingButton").click();
  await page.locator("#writingError:not([hidden])").waitFor();
  assert(await page.locator("#writingDraft").inputValue() === dayTwoDraft, "Draft was lost when writing material failed");
  assert(await page.locator("#submitWritingButton").isDisabled(), "Submission must stay disabled when material fails");
  await page.unroute("**/content/writing/01-requirement-clarification.md");
  expectLoadFailure = false;
  await page.locator("#retryWritingButton").click();
  await page.locator("#writingError").waitFor({ state: "hidden" });
  assert(!(await page.locator("#writingDraft").isDisabled()), "Retry did not restore the writing editor");
  if (screenshotDir) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: screenshotDir + "/v12-workbench-mobile.png", fullPage: true });
    await page.setViewportSize({ width: 1440, height: 960 });
  }

  await page.locator("#writingBackButton").click();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#exportProgressButton").click();
  const download = await downloadPromise;
  assert(download.suggestedFilename().startsWith("metric-english-progress-"), "V3 export filename is incorrect");

  const migrationContext = await browser.newContext();
  const migrationPage = await migrationContext.newPage();
  await migrationPage.goto(baseUrl, { waitUntil: "networkidle" });
  await migrationPage.evaluate(() => {
    const now = new Date();
    const date = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    localStorage.setItem("metricEnglish.v1", JSON.stringify({
      schemaVersion: 2,
      startedAt: date,
      completed: ["dashboard-basics"],
      learnedWords: ["metric"],
      daily: { [date]: ["read", "words", "grammar", "questions"] },
      lastReader: { itemId: "dashboard-basics", section: "Vocabulary", bilingual: false, scrollY: 90 },
      lastView: "reader",
      fontScale: 1.1
    }));
  });
  await migrationPage.reload({ waitUntil: "networkidle" });
  const migrated = await migrationPage.evaluate(() => JSON.parse(localStorage.getItem("metricEnglish.v1")));
  assert(migrated.schemaVersion === 3, "V2 progress did not migrate to V3");
  assert(migrated.completed[0] === "dashboard-basics" && migrated.learnedWords[0] === "metric", "Migration lost V1.1 learning data");
  assert(migrated.lastReader.section === "Vocabulary", "Migration lost the reading resume point");
  assert(migrated.activeProgram === "writing", "Migrated users should enter the writing stage");
  assert(Object.keys(migrated.writingProgram.attempts).length === 0, "Migration should start with empty writing progress");
  await migrationContext.close();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  if (screenshotDir) await page.screenshot({ path: screenshotDir + "/v12-writing-mobile.png", fullPage: true });
  assert(await page.locator("#sidebar").evaluate((element) => element.inert), "Closed mobile sidebar should be inert");
  await page.locator("#menuButton").click();
  assert(!(await page.locator("#sidebar").evaluate((element) => element.inert)), "Open mobile sidebar should be focusable");
  assert(await page.locator("#mainContent").evaluate((element) => element.inert), "Main content should be inert behind the drawer");
  await page.locator("#sidebarScrim").click({ position: { x: 380, y: 400 } });

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 667, height: 375 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 960 }
  ]) {
    await page.setViewportSize(viewport);
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      offenders: Array.from(document.querySelectorAll("body *")).map((element) => {
        const box = element.getBoundingClientRect();
        return { name: "#" + (element.id || element.className || element.tagName), right: Math.round(box.right) };
      }).filter((item) => item.right > window.innerWidth + 1).slice(0, 5)
    }));
    assert(layout.overflow <= 1, "Horizontal overflow at " + viewport.width + "x" + viewport.height + ": " + JSON.stringify(layout));
  }

  assert(runtimeErrors.length === 0, runtimeErrors.join("\n"));
  console.log("V1.2 browser smoke test passed");
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
