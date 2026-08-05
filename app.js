(function () {
  "use strict";

  const STORAGE_KEY = "metricEnglish.v1";
  const SECTION_LABELS = {
    "English Original": "英文原文",
    "Chinese Translation": "中文翻译",
    "Vocabulary": "重点词汇",
    "Grammar Analysis": "语法解析",
    "Data Analyst Extension": "分析师延伸",
    "Reading Questions": "阅读问题"
  };
  const ARTICLE_SECTIONS = Object.keys(SECTION_LABELS);
  const DAILY_TASKS = [
    { id: "read", label: "精读今日文章", time: "15 min" },
    { id: "words", label: "掌握8个重点词", time: "8 min" },
    { id: "grammar", label: "拆解1个长句", time: "7 min" },
    { id: "questions", label: "口头回答2道题", time: "5 min" }
  ];

  const state = {
    manifest: [],
    currentItem: null,
    currentSections: {},
    activeSection: "English Original",
    activeLevel: "all",
    query: "",
    viewBeforeReader: "dashboard",
    bilingual: false,
    fontScale: 1,
    data: loadProgress()
  };

  const elements = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    bindEvents();
    setTodayLabels();
    renderDailyTasks();
    try {
      const response = await fetch("./content/manifest.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Manifest request failed");
      state.manifest = await response.json();
      renderAll();
    } catch (error) {
      console.error(error);
      elements.libraryList.innerHTML = '<p class="empty-list">资料加载失败，请通过静态服务器或GitHub Pages访问</p>';
      elements.todayAssignment.innerHTML = '<h2 id="assignmentTitle">无法加载文章目录</h2><p>直接双击HTML文件会阻止Markdown读取，请查看README中的本地预览方法</p>';
    }
  }

  function cacheElements() {
    [
      "sidebar", "menuButton", "searchInput", "libraryList", "libraryCards", "dashboardView", "libraryView", "readerView",
      "dailyTaskList", "dailyPercent", "startReadingButton", "todayAssignment", "openFrameworkButton", "headerStreak",
      "headerProgress", "statCompleted", "statWords", "statStreak", "progressBar", "progressCopy", "todayLabel", "dayNumber",
      "readerEyebrow", "readerTitle", "readerMeta", "readerToolbar", "sectionTabs", "readerContent", "completeButton",
      "completeButtonBottom", "backButton", "bilingualButton", "fontDownButton", "fontUpButton", "toast"
    ].forEach((id) => { elements[id] = document.getElementById(id); });
  }

  function bindEvents() {
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => showView(button.dataset.view));
    });
    document.querySelectorAll("[data-level]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeLevel = button.dataset.level;
        document.querySelectorAll("[data-level]").forEach((item) => item.classList.toggle("is-active", item === button));
        renderLibrary();
      });
    });
    elements.menuButton.addEventListener("click", toggleSidebar);
    elements.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      renderLibrary();
    });
    elements.dailyTaskList.addEventListener("change", onDailyTaskChange);
    elements.startReadingButton.addEventListener("click", () => openItem(getTodayArticle()?.id));
    elements.openFrameworkButton.addEventListener("click", () => openItem("nce3-framework"));
    elements.backButton.addEventListener("click", () => showView(state.viewBeforeReader));
    elements.completeButton.addEventListener("click", toggleCurrentComplete);
    elements.completeButtonBottom.addEventListener("click", toggleCurrentComplete);
    elements.sectionTabs.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-section]");
      if (!button) return;
      state.bilingual = false;
      elements.bilingualButton.setAttribute("aria-pressed", "false");
      state.activeSection = button.dataset.section;
      renderArticleSection();
    });
    elements.bilingualButton.addEventListener("click", () => {
      if (!state.currentItem || state.currentItem.type !== "article") return;
      state.bilingual = !state.bilingual;
      elements.bilingualButton.setAttribute("aria-pressed", String(state.bilingual));
      renderArticleSection();
    });
    elements.fontDownButton.addEventListener("click", () => changeFont(-0.1));
    elements.fontUpButton.addEventListener("click", () => changeFont(0.1));
    elements.readerContent.addEventListener("click", onReaderContentClick);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && elements.sidebar.classList.contains("is-open")) toggleSidebar(false);
    });
  }

  function loadProgress() {
    const fallback = {
      startedAt: localDateKey(new Date()),
      completed: [],
      learnedWords: [],
      daily: {},
      lastOpened: null
    };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...fallback, ...saved };
    } catch (error) {
      console.warn("Progress data was reset", error);
      return fallback;
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  }

  function renderAll() {
    renderLibrary();
    renderDashboard();
    updateStats();
  }

  function showView(view) {
    if (view !== "reader") state.viewBeforeReader = view;
    elements.dashboardView.hidden = view !== "dashboard";
    elements.libraryView.hidden = view !== "library";
    elements.readerView.hidden = view !== "reader";
    document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
    toggleSidebar(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("mainContent").focus({ preventScroll: true });
  }

  function toggleSidebar(force) {
    const open = typeof force === "boolean" ? force : !elements.sidebar.classList.contains("is-open");
    elements.sidebar.classList.toggle("is-open", open);
    elements.menuButton.setAttribute("aria-expanded", String(open));
  }

  function setTodayLabels() {
    const now = new Date();
    elements.todayLabel.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(now);
    const start = parseLocalDate(state.data.startedAt);
    const day = Math.min(365, Math.max(1, daysBetween(start, now) + 1));
    elements.dayNumber.textContent = String(day).padStart(3, "0");
  }

  function renderDailyTasks() {
    const today = localDateKey(new Date());
    const checked = state.data.daily[today] || [];
    elements.dailyTaskList.innerHTML = DAILY_TASKS.map((task) => `
      <label class="daily-task">
        <input type="checkbox" value="${task.id}" ${checked.includes(task.id) ? "checked" : ""}>
        <span>${task.label}</span>
        <small>${task.time}</small>
      </label>
    `).join("");
    updateDailyPercent();
  }

  function onDailyTaskChange() {
    const today = localDateKey(new Date());
    state.data.daily[today] = Array.from(elements.dailyTaskList.querySelectorAll("input:checked")).map((input) => input.value);
    saveProgress();
    updateDailyPercent();
    updateStats();
  }

  function updateDailyPercent() {
    const today = localDateKey(new Date());
    const count = (state.data.daily[today] || []).length;
    elements.dailyPercent.textContent = `${Math.round((count / DAILY_TASKS.length) * 100)}%`;
  }

  function renderDashboard() {
    const article = getTodayArticle();
    if (!article) return;
    elements.todayAssignment.innerHTML = `
      <h2 id="assignmentTitle">${escapeHtml(article.title)}</h2>
      <p>${escapeHtml(article.summary)}</p>
      <div class="assignment-meta">
        <span class="meta-pill">${escapeHtml(article.level)}</span>
        <span class="meta-pill">${escapeHtml(article.minutes)}分钟</span>
        <span class="meta-pill">${escapeHtml(article.focus)}</span>
      </div>
    `;
  }

  function getTodayArticle() {
    const articles = state.manifest.filter((item) => item.type === "article");
    if (!articles.length) return null;
    const index = daysBetween(parseLocalDate(state.data.startedAt), new Date()) % articles.length;
    return articles[(index + articles.length) % articles.length];
  }

  function filteredItems() {
    return state.manifest.filter((item) => {
      const matchesLevel = state.activeLevel === "all" || item.level === state.activeLevel;
      const haystack = `${item.title} ${item.titleZh || ""} ${item.tags.join(" ")} ${item.focus}`.toLowerCase();
      return matchesLevel && (!state.query || haystack.includes(state.query));
    });
  }

  function renderLibrary() {
    const items = filteredItems();
    elements.libraryList.innerHTML = items.length ? items.map((item) => {
      const done = state.data.completed.includes(item.id);
      return `<button class="library-item ${state.currentItem?.id === item.id ? "is-current" : ""}" type="button" data-id="${item.id}">
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.type === "framework" ? "学习框架" : `${item.level} · ${item.minutes}分钟`)}</small>
        ${done ? '<span class="done-dot" aria-label="已读"></span>' : ""}
      </button>`;
    }).join("") : '<p class="empty-list">没有符合条件的文章</p>';

    elements.libraryList.querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => openItem(button.dataset.id)));

    const articles = items.filter((item) => item.type === "article");
    elements.libraryCards.innerHTML = articles.length ? articles.map((item) => `
      <button class="article-card ${state.data.completed.includes(item.id) ? "is-complete" : ""}" type="button" data-id="${item.id}">
        <span class="article-card-number">${item.order}</span>
        <span>
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.summary)}</p>
          <span class="card-meta"><span>${escapeHtml(item.level)}</span><span>${item.minutes}分钟</span><span>${escapeHtml(item.focus)}</span></span>
        </span>
      </button>
    `).join("") : '<p class="empty-list">当前筛选下没有数据分析文章</p>';
    elements.libraryCards.querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => openItem(button.dataset.id)));
  }

  async function openItem(id) {
    const item = state.manifest.find((entry) => entry.id === id);
    if (!item) return;
    state.currentItem = item;
    state.data.lastOpened = id;
    state.activeSection = "English Original";
    state.bilingual = false;
    saveProgress();
    showView("reader");
    renderReaderHeader();
    elements.readerContent.innerHTML = '<div class="loading-state">正在加载阅读材料…</div>';
    try {
      const response = await fetch(item.path, { cache: "no-store" });
      if (!response.ok) throw new Error(`Article request failed: ${response.status}`);
      const markdown = await response.text();
      if (item.type === "framework") {
        state.currentSections = { full: markdown };
        elements.sectionTabs.innerHTML = "";
        elements.readerToolbar.hidden = true;
        elements.readerContent.innerHTML = `<div class="markdown-body">${renderMarkdown(markdown)}</div>`;
      } else {
        state.currentSections = splitSections(markdown);
        elements.readerToolbar.hidden = false;
        renderSectionTabs();
        renderArticleSection();
      }
      renderLibrary();
    } catch (error) {
      console.error(error);
      elements.readerContent.innerHTML = '<div class="error-state">文章加载失败，请刷新页面后重试</div>';
    }
  }

  function renderReaderHeader() {
    const item = state.currentItem;
    elements.readerEyebrow.textContent = item.type === "framework" ? "STUDY FRAMEWORK" : `READING ${item.order}`;
    elements.readerTitle.textContent = item.title;
    elements.readerMeta.innerHTML = [item.titleZh, item.level, `${item.minutes}分钟`, item.focus].filter(Boolean).map((value) => `<span>${escapeHtml(value)}</span>`).join("");
    updateCompleteButtons();
  }

  function renderSectionTabs() {
    elements.sectionTabs.innerHTML = ARTICLE_SECTIONS.map((section) => `
      <button type="button" role="tab" data-section="${section}" aria-selected="${section === state.activeSection}">${SECTION_LABELS[section]}</button>
    `).join("");
  }

  function renderArticleSection() {
    if (state.bilingual) {
      elements.sectionTabs.querySelectorAll("button").forEach((button) => button.setAttribute("aria-selected", "false"));
      elements.readerContent.innerHTML = `<div class="bilingual-grid">
        <section class="bilingual-panel"><p class="panel-label">ENGLISH ORIGINAL</p><div class="markdown-body">${renderMarkdown(state.currentSections["English Original"] || "")}</div></section>
        <section class="bilingual-panel"><p class="panel-label">中文翻译</p><div class="markdown-body">${renderMarkdown(state.currentSections["Chinese Translation"] || "")}</div></section>
      </div>`;
      return;
    }
    elements.sectionTabs.querySelectorAll("button").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.section === state.activeSection)));
    let source = state.currentSections[state.activeSection] || "## 内容缺失\n\n这部分内容尚未准备";
    if (state.activeSection === "Reading Questions" && source.includes("### Answer Key")) {
      const [questions, answers] = source.split("### Answer Key");
      elements.readerContent.innerHTML = `<div class="markdown-body">${renderMarkdown(questions)}<details><summary>查看参考答案</summary>${renderMarkdown(answers)}</details></div>`;
    } else {
      elements.readerContent.innerHTML = `<div class="markdown-body">${renderMarkdown(source)}</div>`;
    }
    if (state.activeSection === "Vocabulary") attachVocabularyButtons();
  }

  function splitSections(markdown) {
    const sections = {};
    const pattern = /^##\s+(.+)$/gm;
    const matches = Array.from(markdown.matchAll(pattern));
    matches.forEach((match, index) => {
      const name = match[1].trim();
      const start = match.index + match[0].length;
      const end = matches[index + 1]?.index ?? markdown.length;
      sections[name] = markdown.slice(start, end).trim();
    });
    return sections;
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r/g, "").split("\n");
    const html = [];
    let paragraph = [];
    let listType = null;

    const flushParagraph = () => {
      if (paragraph.length) html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    };
    const closeList = () => {
      if (listType) html.push(`</${listType}>`);
      listType = null;
    };

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) { flushParagraph(); closeList(); continue; }

      if (line.startsWith("|") && lines[i + 1]?.trim().match(/^\|?\s*:?-+/)) {
        flushParagraph(); closeList();
        const headers = tableCells(line);
        i += 2;
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(tableCells(lines[i].trim())); i += 1; }
        i -= 1;
        html.push(`<table><thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
        continue;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) { flushParagraph(); closeList(); const level = heading[1].length; html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); continue; }
      if (/^---+$/.test(line)) { flushParagraph(); closeList(); html.push("<hr>"); continue; }
      if (line.startsWith("> ")) { flushParagraph(); closeList(); html.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`); continue; }

      const unordered = line.match(/^[-*]\s+(.+)$/);
      const ordered = line.match(/^\d+[.)]\s+(.+)$/);
      if (unordered || ordered) {
        flushParagraph();
        const wanted = unordered ? "ul" : "ol";
        if (listType !== wanted) { closeList(); listType = wanted; html.push(`<${listType}>`); }
        html.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
        continue;
      }
      paragraph.push(line);
    }
    flushParagraph(); closeList();
    return html.join("");
  }

  function tableCells(line) {
    return line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
  }

  function inlineMarkdown(value) {
    const code = [];
    let safe = escapeHtml(value).replace(/`([^`]+)`/g, (_, content) => { code.push(`<code>${content}</code>`); return `%%CODE${code.length - 1}%%`; });
    safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return safe.replace(/%%CODE(\d+)%%/g, (_, index) => code[Number(index)]);
  }

  function attachVocabularyButtons() {
    elements.readerContent.querySelectorAll(".markdown-body strong").forEach((strong) => {
      const word = strong.textContent.trim();
      if (!/^[A-Za-z][A-Za-z -]{1,30}$/.test(word)) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `vocab-action ${state.data.learnedWords.includes(word.toLowerCase()) ? "is-saved" : ""}`;
      button.dataset.word = word.toLowerCase();
      button.textContent = state.data.learnedWords.includes(word.toLowerCase()) ? "已掌握" : "记住";
      strong.insertAdjacentElement("afterend", button);
    });
  }

  function onReaderContentClick(event) {
    const button = event.target.closest(".vocab-action");
    if (!button) return;
    const word = button.dataset.word;
    const exists = state.data.learnedWords.includes(word);
    state.data.learnedWords = exists ? state.data.learnedWords.filter((item) => item !== word) : [...state.data.learnedWords, word];
    saveProgress();
    button.classList.toggle("is-saved", !exists);
    button.textContent = exists ? "记住" : "已掌握";
    updateStats();
    showToast(exists ? `已移出词汇：${word}` : `已掌握：${word}`);
  }

  function toggleCurrentComplete() {
    if (!state.currentItem) return;
    const id = state.currentItem.id;
    const exists = state.data.completed.includes(id);
    state.data.completed = exists ? state.data.completed.filter((item) => item !== id) : [...state.data.completed, id];
    if (!exists && state.currentItem.type === "article") {
      const today = localDateKey(new Date());
      const tasks = new Set(state.data.daily[today] || []);
      tasks.add("read");
      state.data.daily[today] = Array.from(tasks);
      renderDailyTasks();
    }
    saveProgress();
    updateCompleteButtons();
    updateStats();
    renderLibrary();
    showToast(exists ? "已取消完成标记" : "本篇已完成");
  }

  function updateCompleteButtons() {
    const done = state.currentItem && state.data.completed.includes(state.currentItem.id);
    [elements.completeButton, elements.completeButtonBottom].forEach((button) => {
      button.classList.toggle("is-complete", done);
      button.textContent = done ? "已完成 ✓" : button === elements.completeButton ? "标记为已读" : "完成本篇阅读";
    });
  }

  function updateStats() {
    const articleIds = state.manifest.filter((item) => item.type === "article").map((item) => item.id);
    const completed = state.data.completed.filter((id) => articleIds.includes(id)).length;
    const total = articleIds.length || 10;
    const streak = calculateStreak();
    elements.statCompleted.textContent = String(completed);
    elements.statWords.textContent = String(state.data.learnedWords.length);
    elements.statStreak.textContent = String(streak);
    elements.headerStreak.textContent = `连续 ${streak} 天`;
    elements.headerProgress.textContent = `完成 ${completed} / ${total}`;
    const percent = Math.round((completed / total) * 100);
    elements.progressBar.style.width = `${percent}%`;
    elements.progressCopy.textContent = completed ? `首批文章已完成${percent}%，下一篇从资料库继续` : "首批10篇文章，等待你的第一条记录";
  }

  function calculateStreak() {
    let streak = 0;
    const cursor = new Date();
    const todayKey = localDateKey(cursor);
    if (!(state.data.daily[todayKey] || []).length) cursor.setDate(cursor.getDate() - 1);
    while ((state.data.daily[localDateKey(cursor)] || []).length) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function changeFont(delta) {
    state.fontScale = Math.min(1.3, Math.max(0.8, Number((state.fontScale + delta).toFixed(1))));
    document.documentElement.style.setProperty("--reader-scale", state.fontScale);
    showToast(`正文字号 ${Math.round(state.fontScale * 100)}%`);
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.classList.remove("is-visible"), 1800);
  }

  function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseLocalDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function daysBetween(start, end) {
    const oneDay = 86400000;
    const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return Math.floor((endUtc - startUtc) / oneDay);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  }
})();
