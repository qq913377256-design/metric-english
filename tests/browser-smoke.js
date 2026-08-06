const { chromium } = require("playwright");

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const edgePath = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const screenshotDir = process.env.QA_SCREENSHOT_DIR;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: edgePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const runtimeErrors = [];
  let expectLoadFailure = false;

  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !expectLoadFailure) runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    if (!expectLoadFailure) runtimeErrors.push(`request: ${request.url()} ${request.failure()?.errorText || "failed"}`);
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  assert(await page.title() === "Metric English · 英语阅读训练台", "Unexpected page title");
  assert(await page.locator(".daily-task").count() === 4, "Daily plan should contain four tasks");
  assert(await page.locator("#todayModeLabel").innerText() === "LEARN DAY", "Day one should be a learn day");
  assert(await page.locator("#dayNumber").innerText() === "001", "Fresh progress should start on day one");
  assert(await page.locator("#libraryList .library-item").count() === 11, "Library should contain one framework and ten articles");
  if (screenshotDir) await page.screenshot({ path: `${screenshotDir}/v11-desktop.png`, fullPage: true });

  const dailyChecks = page.locator("#dailyTaskList input");
  await dailyChecks.first().check();
  assert(await page.locator("#statStreak").innerText() === "0", "A partial day must not increase the streak");
  for (let index = 1; index < 4; index += 1) await dailyChecks.nth(index).check();
  assert(await page.locator("#statStreak").innerText() === "1", "All four tasks should complete one learning day");
  assert((await page.locator("#headerProgress").innerText()).includes("1 / 30"), "Thirty-day progress did not update");

  await page.locator("#startReadingButton").click();
  await page.locator("#readerView:not([hidden])").waitFor();
  await page.locator(".markdown-body").waitFor();
  assert((await page.locator("#readerTitle").innerText()).length > 5, "Reader title did not load");
  assert((await page.locator(".markdown-body").innerText()).length > 200, "English article content is too short");

  await page.locator('button[data-section="English Original"]').focus();
  await page.keyboard.press("ArrowRight");
  assert(await page.locator('button[data-section="Chinese Translation"]').getAttribute("aria-selected") === "true", "Arrow keys should switch reader tabs");
  const translation = await page.locator(".markdown-body").innerText();
  assert(translation.length > 150 && /[\u4e00-\u9fff]/.test(translation), "Chinese translation did not render");

  await page.locator("#bilingualButton").click();
  assert(await page.locator(".bilingual-panel").count() === 2, "Bilingual view should have two panels");

  await page.locator('button[data-section="Vocabulary"]').click();
  const firstWord = page.locator(".vocab-action").first();
  await firstWord.click();
  assert(await firstWord.innerText() === "已掌握", "Vocabulary progress did not update");

  await page.locator("#completeButton").click();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("metricEnglish.v1")));
  assert(stored.completed.length === 1, "Completion was not saved");
  assert(stored.learnedWords.length === 1, "Vocabulary was not saved");
  assert(stored.schemaVersion === 2, "Progress schema was not migrated to V2");
  assert(Object.values(stored.daily)[0].length === 4, "Daily completion should keep all four tasks");

  await page.locator('button[data-section="Grammar Analysis"]').click();

  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#readerView:not([hidden])").waitFor();
  await page.locator(".markdown-body").waitFor();
  assert(await page.locator('button[data-section="Grammar Analysis"]').getAttribute("aria-selected") === "true", "Last reader section did not survive reload");
  assert((await page.locator("#headerProgress").innerText()).includes("1 / 30"), "Saved progress did not survive reload");

  await page.locator("#backButton").click();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#exportProgressButton").click();
  const download = await downloadPromise;
  assert(download.suggestedFilename().startsWith("metric-english-progress-"), "Export filename is incorrect");

  await page.locator('.nav-button[data-view="library"]').click();
  await page.locator('.filter-chip[data-level="B2"]').click();
  assert(await page.locator("#libraryCards .article-card").count() === 3, "B2 filter returned the wrong number of articles");
  await page.locator("#searchInput").fill("forecast");
  assert(await page.locator("#libraryCards .article-card").count() === 1, "Library search did not filter article cards");
  await page.locator("#searchInput").fill("");
  await page.locator('.filter-chip[data-level="all"]').click();
  await page.locator('.brand[data-view="dashboard"]').click();

  expectLoadFailure = true;
  await page.route("**/content/articles/02-business-questions.md", (route) => route.fulfill({ status: 500, body: "temporary error" }));
  await page.locator('.nav-button[data-view="library"]').click();
  await page.locator('.article-card[data-id="business-questions"]').click();
  await page.locator("[data-retry-article]").waitFor();
  assert(await page.locator("#completeButton").isDisabled(), "Completion must stay disabled when an article fails to load");
  await page.unroute("**/content/articles/02-business-questions.md");
  expectLoadFailure = false;
  await page.locator("[data-retry-article]").click();
  await page.locator(".markdown-body").waitFor();
  assert(!(await page.locator("#completeButton").isDisabled()), "Retry should restore the reader controls");

  await page.locator('.brand[data-view="dashboard"]').click();
  await page.locator("#openFrameworkButton").click();
  await page.locator("#readerView:not([hidden])").waitFor();
  await page.locator(".markdown-body").waitFor();
  assert((await page.locator(".markdown-body").innerText()).includes("一年学习框架"), "Framework did not load");

  await page.locator('.brand[data-view="dashboard"]').click();
  const todayKey = await page.evaluate(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#importProgressInput").setInputFiles({
    name: "metric-english-progress-test.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({
      app: "Metric English",
      schemaVersion: 2,
      data: {
        schemaVersion: 2,
        startedAt: todayKey,
        completed: ["dashboard-basics"],
        learnedWords: ["metric", "trend"],
        daily: { [todayKey]: ["read", "words", "grammar", "questions"] },
        lastReader: { itemId: "dashboard-basics", section: "Vocabulary", bilingual: false, scrollY: 0 },
        lastView: "dashboard",
        fontScale: 1.1
      }
    }))
  });
  assert(await page.locator("#statWords").innerText() === "2", "Imported progress did not replace local data");
  assert((await page.locator("#headerProgress").innerText()).includes("1 / 30"), "Imported daily completion was not counted");

  await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem("metricEnglish.v1"));
    const start = new Date();
    start.setDate(start.getDate() - 2);
    data.startedAt = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    data.daily = {};
    data.lastView = "dashboard";
    localStorage.setItem("metricEnglish.v1", JSON.stringify(data));
  });
  await page.reload({ waitUntil: "networkidle" });
  assert(await page.locator("#dayNumber").innerText() === "003", "The plan should advance to day three");
  assert(await page.locator("#todayModeLabel").innerText() === "APPLY DAY", "Day three should be an apply day");
  assert((await page.locator("#assignmentTitle").innerText()).includes("Dashboard"), "The first three days should use the same article");

  await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem("metricEnglish.v1"));
    const start = new Date();
    start.setDate(start.getDate() - 3);
    data.startedAt = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    localStorage.setItem("metricEnglish.v1", JSON.stringify(data));
  });
  await page.reload({ waitUntil: "networkidle" });
  assert(await page.locator("#dayNumber").innerText() === "004", "The plan should advance to day four");
  assert(await page.locator("#todayModeLabel").innerText() === "LEARN DAY", "Day four should start the next learn cycle");
  assert((await page.locator("#assignmentTitle").innerText()).includes("Business Question"), "Day four should assign the second article");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(350);
  if (screenshotDir) await page.screenshot({ path: `${screenshotDir}/v11-mobile.png`, fullPage: true });
  assert(await page.locator("#sidebar").evaluate((element) => element.inert), "Closed mobile sidebar should be inert");
  await page.locator("#menuButton").click();
  assert(await page.locator("#sidebar").evaluate((element) => element.classList.contains("is-open")), "Mobile library menu did not open");
  assert(!(await page.locator("#sidebar").evaluate((element) => element.inert)), "Open mobile sidebar should be focusable");
  assert(await page.locator("#mainContent").evaluate((element) => element.inert), "Main content should be inert behind the mobile drawer");
  await page.locator("#sidebarScrim").click({ position: { x: 380, y: 400 } });
  await page.waitForTimeout(350);
  assert(await page.locator("#sidebar").evaluate((element) => element.inert), "Closing the drawer should restore the inert sidebar state");
  assert(!(await page.locator("#mainContent").evaluate((element) => element.inert)), "Main content should be restored after closing the drawer");

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 667, height: 375 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1440, height: 960 }
  ]) {
    await page.setViewportSize(viewport);
    const layout = await page.evaluate(() => {
      const offenders = Array.from(document.querySelectorAll("body *")).map((element) => {
        const box = element.getBoundingClientRect();
        return { name: `#${element.id || element.className || element.tagName}`, right: Math.round(box.right), left: Math.round(box.left) };
      }).filter((item) => item.right > window.innerWidth + 1).slice(0, 5);
      return { overflow: document.documentElement.scrollWidth - window.innerWidth, offenders };
    });
    assert(layout.overflow <= 1, `Horizontal overflow at ${viewport.width}x${viewport.height}: ${JSON.stringify(layout)}`);
  }

  assert(runtimeErrors.length === 0, runtimeErrors.join("\n"));
  console.log("Browser smoke test passed");
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
