const { chromium } = require("playwright");

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const edgePath = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: edgePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const runtimeErrors = [];

  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => runtimeErrors.push(`request: ${request.url()} ${request.failure()?.errorText || "failed"}`));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  assert(await page.title() === "Metric English · 英语阅读训练台", "Unexpected page title");
  assert(await page.locator(".daily-task").count() === 4, "Daily plan should contain four tasks");
  assert(await page.locator("#libraryList .library-item").count() === 11, "Library should contain one framework and ten articles");

  await page.locator("#startReadingButton").click();
  await page.locator("#readerView:not([hidden])").waitFor();
  await page.locator(".markdown-body").waitFor();
  assert((await page.locator("#readerTitle").innerText()).length > 5, "Reader title did not load");
  assert((await page.locator(".markdown-body").innerText()).length > 200, "English article content is too short");

  await page.locator('button[data-section="Chinese Translation"]').click();
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

  await page.reload({ waitUntil: "networkidle" });
  assert((await page.locator("#headerProgress").innerText()).includes("1 / 10"), "Saved progress did not survive reload");

  await page.locator('.nav-button[data-view="library"]').click();
  await page.locator('.filter-chip[data-level="B2"]').click();
  assert(await page.locator("#libraryCards .article-card").count() === 3, "B2 filter returned the wrong number of articles");
  await page.locator("#searchInput").fill("forecast");
  assert(await page.locator("#libraryCards .article-card").count() === 1, "Library search did not filter article cards");
  await page.locator("#searchInput").fill("");
  await page.locator('.filter-chip[data-level="all"]').click();
  await page.locator('.brand[data-view="dashboard"]').click();

  await page.locator("#openFrameworkButton").click();
  await page.locator("#readerView:not([hidden])").waitFor();
  await page.locator(".markdown-body").waitFor();
  assert((await page.locator(".markdown-body").innerText()).includes("一年学习框架"), "Framework did not load");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#menuButton").click();
  assert(await page.locator("#sidebar").evaluate((element) => element.classList.contains("is-open")), "Mobile library menu did not open");

  assert(runtimeErrors.length === 0, runtimeErrors.join("\n"));
  console.log("Browser smoke test passed");
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
