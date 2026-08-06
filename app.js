(function () {
  "use strict";

  const STORAGE_KEY = "metricEnglish.v1";
  const STORAGE_SCHEMA = 2;
  const PLAN_DAYS = 30;
  const SECTION_LABELS = {
    "English Original": "英文原文",
    "Chinese Translation": "中文翻译",
    "Vocabulary": "重点词汇",
    "Grammar Analysis": "语法解析",
    "Data Analyst Extension": "分析师延伸",
    "Reading Questions": "阅读问题"
  };
  const ARTICLE_SECTIONS = Object.keys(SECTION_LABELS);
  const DAY_MODES = [
    {
      id: "learn",
      label: "LEARN DAY",
      title: "新学日 · 35分钟",
      description: "先读懂文章，再建立词汇和句型记录",
      tasks: [
        { id: "read", label: "精读今日文章", time: "15 min" },
        { id: "words", label: "掌握8个重点词", time: "8 min" },
        { id: "grammar", label: "拆解1个长句", time: "7 min" },
        { id: "questions", label: "口头回答2道题", time: "5 min" }
      ]
    },
    {
      id: "review",
      label: "REVIEW DAY",
      title: "复习日 · 35分钟",
      description: "不看答案先回忆，再回到文章核对",
      tasks: [
        { id: "reread", label: "限时重读英文原文", time: "8 min" },
        { id: "recall", label: "回忆8个重点词", time: "8 min" },
        { id: "translate", label: "口译1个长句", time: "9 min" },
        { id: "answer", label: "重新回答阅读题", time: "10 min" }
      ]
    },
    {
      id: "apply",
      label: "APPLY DAY",
      title: "应用日 · 35分钟",
      description: "把文章语言转成自己的分析表达",
      tasks: [
        { id: "scan", label: "快速浏览并复述主旨", time: "7 min" },
        { id: "insight", label: "提炼1条分析洞察", time: "8 min" },
        { id: "write", label: "写3句英文工作表达", time: "10 min" },
        { id: "speak", label: "做1分钟口头汇报", time: "10 min" }
      ]
    }
  ];

  let progressNotice = "";

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
    currentView: "dashboard",
    articleLoaded: false,
    data: loadProgress()
  };

  const elements = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    bindEvents();
    elements.startReadingButton.disabled = true;
    setTodayLabels();
    renderDailyTasks();
    syncSidebarAccessibility();
    await loadManifest();
    if (progressNotice) showToast(progressNotice, 3600);
  }

  function cacheElements() {
    [
      "sidebar", "menuButton", "searchInput", "libraryList", "libraryCards", "dashboardView", "libraryView", "readerView",
      "dailyTaskList", "dailyPercent", "startReadingButton", "todayAssignment", "openFrameworkButton", "headerStreak",
      "headerProgress", "statCompleted", "statWords", "statStreak", "progressBar", "progressCopy", "todayLabel", "dayNumber",
      "readerEyebrow", "readerTitle", "readerMeta", "readerToolbar", "sectionTabs", "readerContent", "completeButton",
      "completeButtonBottom", "backButton", "bilingualButton", "fontDownButton", "fontUpButton", "toast", "mainContent",
      "sidebarScrim", "resumeReadingButton", "exportProgressButton", "importProgressButton", "importProgressInput", "roadmapList",
      "todayModeLabel", "todayPlanTitle"
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
    elements.sidebarScrim.addEventListener("click", () => toggleSidebar(false));
    elements.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      renderLibrary();
    });
    elements.dailyTaskList.addEventListener("change", onDailyTaskChange);
    elements.startReadingButton.addEventListener("click", () => openItem(getTodayPlan()?.article?.id));
    elements.resumeReadingButton.addEventListener("click", () => openItem(state.data.lastReader?.itemId, { resume: true }));
    elements.exportProgressButton.addEventListener("click", exportProgress);
    elements.importProgressButton.addEventListener("click", () => elements.importProgressInput.click());
    elements.importProgressInput.addEventListener("change", importProgress);
    elements.openFrameworkButton.addEventListener("click", () => openItem("nce3-framework"));
    elements.backButton.addEventListener("click", () => showView(state.viewBeforeReader));
    elements.completeButton.addEventListener("click", toggleCurrentComplete);
    elements.completeButtonBottom.addEventListener("click", toggleCurrentComplete);
    elements.sectionTabs.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-section]");
      if (!button) return;
      activateSection(button.dataset.section, true);
    });
    elements.sectionTabs.addEventListener("keydown", onSectionTabKeydown);
    elements.bilingualButton.addEventListener("click", () => {
      if (!state.currentItem || state.currentItem.type !== "article") return;
      state.bilingual = !state.bilingual;
      elements.bilingualButton.setAttribute("aria-pressed", String(state.bilingual));
      updateLastReader({ bilingual: state.bilingual });
      renderArticleSection();
    });
    elements.fontDownButton.addEventListener("click", () => changeFont(-0.1));
    elements.fontUpButton.addEventListener("click", () => changeFont(0.1));
    elements.readerContent.addEventListener("click", onReaderContentClick);
    window.addEventListener("resize", syncSidebarAccessibility);
    window.addEventListener("scroll", saveReaderPosition, { passive: true });
    window.addEventListener("beforeunload", saveReaderPosition);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && elements.sidebar.classList.contains("is-open")) toggleSidebar(false);
    });
  }

  function defaultProgress() {
    return {
      schemaVersion: STORAGE_SCHEMA,
      startedAt: localDateKey(new Date()),
      completed: [],
      learnedWords: [],
      daily: {},
      lastOpened: null,
      lastReader: null,
      lastView: "dashboard",
      fontScale: 1
    };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultProgress();
      return sanitizeProgress(JSON.parse(raw));
    } catch (error) {
      console.warn("Progress data was reset", error);
      progressNotice = "本地进度格式异常，已安全重置";
      return defaultProgress();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
      return true;
    } catch (error) {
      console.error("Progress could not be saved", error);
      if (elements.toast) showToast("进度保存失败，请导出备份后检查浏览器设置", 3600);
      return false;
    }
  }

  function sanitizeProgress(candidate) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) throw new Error("Progress must be an object");
    const fallback = defaultProgress();
    const parsedStart = parseLocalDate(candidate.startedAt || "");
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(candidate.startedAt || "") && !Number.isNaN(parsedStart.getTime()) && localDateKey(parsedStart) === candidate.startedAt;
    const startedAt = validDate && parseLocalDate(candidate.startedAt) <= new Date() ? candidate.startedAt : fallback.startedAt;
    const daily = {};
    if (candidate.daily && typeof candidate.daily === "object" && !Array.isArray(candidate.daily)) {
      Object.entries(candidate.daily).slice(0, 400).forEach(([date, tasks]) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date) && Array.isArray(tasks)) daily[date] = uniqueStrings(tasks, 20);
      });
    }
    const legacyLastOpened = typeof candidate.lastOpened === "string" ? candidate.lastOpened : null;
    const sourceReader = candidate.lastReader && typeof candidate.lastReader === "object" ? candidate.lastReader : null;
    const lastReader = sourceReader && typeof sourceReader.itemId === "string" ? {
      itemId: sourceReader.itemId,
      section: ARTICLE_SECTIONS.includes(sourceReader.section) ? sourceReader.section : "English Original",
      bilingual: Boolean(sourceReader.bilingual),
      scrollY: Number.isFinite(sourceReader.scrollY) ? Math.max(0, Math.min(sourceReader.scrollY, 100000)) : 0
    } : legacyLastOpened ? { itemId: legacyLastOpened, section: "English Original", bilingual: false, scrollY: 0 } : null;
    return {
      schemaVersion: STORAGE_SCHEMA,
      startedAt,
      completed: uniqueStrings(candidate.completed, 200),
      learnedWords: uniqueStrings(candidate.learnedWords, 5000).map((word) => word.toLowerCase()),
      daily,
      lastOpened: lastReader?.itemId || null,
      lastReader,
      lastView: candidate.lastView === "reader" && lastReader ? "reader" : candidate.lastView === "library" ? "library" : "dashboard",
      fontScale: Number.isFinite(candidate.fontScale) ? Math.min(1.3, Math.max(0.8, candidate.fontScale)) : 1
    };
  }

  function uniqueStrings(value, limit) {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value.filter((item) => typeof item === "string" && item.length <= 120))).slice(0, limit);
  }

  function renderAll() {
    renderLibrary();
    renderDashboard();
    updateStats();
  }

  async function loadManifest() {
    elements.startReadingButton.disabled = true;
    elements.todayAssignment.setAttribute("aria-busy", "true");
    elements.todayAssignment.innerHTML = '<h2 id="assignmentTitle">正在准备今日文章</h2><p>读取学习目录中…</p>';
    try {
      const response = await fetch("./content/manifest.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Manifest request failed: ${response.status}`);
      const manifest = await response.json();
      if (!Array.isArray(manifest) || !manifest.some((item) => item?.type === "article" && typeof item.path === "string")) {
        throw new Error("Manifest format is invalid");
      }
      state.manifest = manifest;
      elements.todayAssignment.removeAttribute("aria-busy");
      elements.startReadingButton.disabled = false;
      state.fontScale = state.data.fontScale;
      document.documentElement.style.setProperty("--reader-scale", state.fontScale);
      renderDailyTasks();
      renderAll();
      if (state.data.lastView === "reader" && state.data.lastReader && state.manifest.some((item) => item.id === state.data.lastReader.itemId)) {
        await openItem(state.data.lastReader.itemId, { resume: true });
      } else if (state.data.lastView === "library") {
        showView("library");
      }
    } catch (error) {
      console.error(error);
      state.manifest = [];
      elements.libraryList.innerHTML = '<div class="error-box"><p>资料目录加载失败</p><button class="secondary-button" id="retryManifestButton" type="button">重新加载</button></div>';
      elements.todayAssignment.removeAttribute("aria-busy");
      elements.todayAssignment.innerHTML = '<h2 id="assignmentTitle">暂时无法读取文章</h2><p>请检查网络后重试。直接双击HTML文件也会阻止Markdown读取。</p><button class="light-button" id="retryAssignmentButton" type="button">重新加载</button>';
      document.getElementById("retryManifestButton")?.addEventListener("click", loadManifest);
      document.getElementById("retryAssignmentButton")?.addEventListener("click", loadManifest);
    }
  }

  function showView(view) {
    if (state.currentView === "reader" && view !== "reader") saveReaderPosition({ type: "beforeunload" });
    if (view !== "reader") state.viewBeforeReader = view;
    state.currentView = view;
    state.data.lastView = view;
    saveProgress();
    elements.dashboardView.hidden = view !== "dashboard";
    elements.libraryView.hidden = view !== "library";
    elements.readerView.hidden = view !== "reader";
    document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
    toggleSidebar(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    elements.mainContent.focus({ preventScroll: true });
  }

  function toggleSidebar(force) {
    const open = typeof force === "boolean" ? force : !elements.sidebar.classList.contains("is-open");
    elements.sidebar.classList.toggle("is-open", open);
    elements.menuButton.setAttribute("aria-expanded", String(open));
    syncSidebarAccessibility();
    if (open) {
      window.setTimeout(() => elements.sidebar.querySelector("button, input")?.focus(), 0);
    } else if (elements.sidebar.contains(document.activeElement)) {
      elements.menuButton.focus();
    }
  }

  function syncSidebarAccessibility() {
    if (!elements.sidebar) return;
    const mobile = window.matchMedia("(max-width: 980px)").matches;
    const open = mobile && elements.sidebar.classList.contains("is-open");
    elements.sidebar.inert = mobile && !open;
    if (mobile && !open) elements.sidebar.setAttribute("aria-hidden", "true");
    else elements.sidebar.removeAttribute("aria-hidden");
    elements.mainContent.inert = open;
    elements.sidebarScrim.hidden = !open;
  }

  function setTodayLabels() {
    const now = new Date();
    elements.todayLabel.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(now);
    const day = getPlanDay(now);
    elements.dayNumber.textContent = String(day).padStart(3, "0");
  }

  function renderDailyTasks() {
    const today = localDateKey(new Date());
    const checked = state.data.daily[today] || [];
    const plan = getTodayPlan();
    if (isPlanFinished()) {
      const completedDays = countCompletedPlanDays();
      elements.todayModeLabel.textContent = "VALIDATION COMPLETE";
      elements.todayPlanTitle.textContent = "30天验证期已结束";
      elements.dailyTaskList.innerHTML = `<div class="plan-finished"><strong>完成${completedDays}天</strong><span>导出进度备份，再根据完成率决定下一轮计划</span></div>`;
      elements.dailyPercent.textContent = `${Math.round((completedDays / PLAN_DAYS) * 100)}%`;
      elements.dailyPercent.classList.toggle("is-complete", completedDays === PLAN_DAYS);
      return;
    }
    const tasks = plan?.mode.tasks || DAY_MODES[0].tasks;
    elements.todayModeLabel.textContent = plan?.mode.label || DAY_MODES[0].label;
    elements.todayPlanTitle.textContent = plan?.mode.title || DAY_MODES[0].title;
    elements.dailyTaskList.innerHTML = tasks.map((task) => `
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
    if (isDateComplete(today)) showToast("今日4项任务已完成，连续学习记录已更新");
  }

  function updateDailyPercent() {
    if (isPlanFinished()) {
      const completedDays = countCompletedPlanDays();
      elements.dailyPercent.textContent = `${Math.round((completedDays / PLAN_DAYS) * 100)}%`;
      return;
    }
    const today = localDateKey(new Date());
    const tasks = getTodayPlan()?.mode.tasks || DAY_MODES[0].tasks;
    const required = new Set(tasks.map((task) => task.id));
    const count = (state.data.daily[today] || []).filter((id) => required.has(id)).length;
    elements.dailyPercent.textContent = `${Math.round((count / tasks.length) * 100)}%`;
    elements.dailyPercent.classList.toggle("is-complete", count === tasks.length);
  }

  function renderDashboard() {
    const plan = getTodayPlan();
    const article = plan?.article;
    if (!article) return;
    elements.todayAssignment.innerHTML = `
      <p class="assignment-type">第${plan.day}天 · ${escapeHtml(plan.mode.title.split(" · ")[0])}</p>
      <h2 id="assignmentTitle">${escapeHtml(article.title)}</h2>
      <p>${escapeHtml(plan.mode.description)}。${escapeHtml(article.summary)}</p>
      <div class="assignment-meta">
        <span class="meta-pill">${escapeHtml(article.level)}</span>
        <span class="meta-pill">35分钟</span>
        <span class="meta-pill">${escapeHtml(article.focus)}</span>
      </div>
    `;
    const startLabel = isPlanFinished() ? "回顾最后一篇" : plan.mode.id === "learn" ? "开始今日阅读" : "打开今日复习文章";
    elements.startReadingButton.innerHTML = `${startLabel} <span aria-hidden="true">→</span>`;
    const lastItem = state.manifest.find((item) => item.id === state.data.lastReader?.itemId);
    const canResume = lastItem && lastItem.id !== article.id;
    elements.resumeReadingButton.hidden = !canResume;
    if (canResume) elements.resumeReadingButton.textContent = `继续上次：${lastItem.title}`;
    elements.roadmapList.querySelectorAll("li").forEach((item) => {
      const current = plan.day >= Number(item.dataset.start) && plan.day <= Number(item.dataset.end);
      item.classList.toggle("is-current", current);
    });
  }

  function getTodayPlan(date = new Date()) {
    const articles = state.manifest.filter((item) => item.type === "article");
    if (!articles.length) return null;
    const day = getPlanDay(date);
    const articleIndex = Math.min(articles.length - 1, Math.floor((day - 1) / DAY_MODES.length));
    return { day, article: articles[articleIndex], mode: DAY_MODES[(day - 1) % DAY_MODES.length] };
  }

  function getPlanDay(date) {
    return Math.min(PLAN_DAYS, Math.max(1, daysBetween(parseLocalDate(state.data.startedAt), date) + 1));
  }

  function isPlanFinished(date = new Date()) {
    return daysBetween(parseLocalDate(state.data.startedAt), date) + 1 > PLAN_DAYS;
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
          <span class="card-title">${escapeHtml(item.title)}</span>
          <span class="card-summary">${escapeHtml(item.summary)}</span>
          <span class="card-meta"><span>${escapeHtml(item.level)}</span><span>${item.minutes}分钟</span><span>${escapeHtml(item.focus)}</span></span>
        </span>
      </button>
    `).join("") : '<p class="empty-list">当前筛选下没有数据分析文章</p>';
    elements.libraryCards.querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => openItem(button.dataset.id)));
  }

  async function openItem(id, options = {}) {
    const item = state.manifest.find((entry) => entry.id === id);
    if (!item) return;
    state.currentItem = item;
    state.articleLoaded = false;
    state.data.lastOpened = id;
    const savedReader = options.resume && state.data.lastReader?.itemId === id ? state.data.lastReader : null;
    state.activeSection = item.type === "article" && savedReader?.section ? savedReader.section : "English Original";
    state.bilingual = item.type === "article" && Boolean(savedReader?.bilingual);
    elements.bilingualButton.setAttribute("aria-pressed", String(state.bilingual));
    updateLastReader({ itemId: id, section: state.activeSection, bilingual: state.bilingual, scrollY: savedReader?.scrollY || 0 });
    saveProgress();
    showView("reader");
    renderReaderHeader();
    [elements.completeButton, elements.completeButtonBottom].forEach((button) => { button.disabled = true; });
    elements.readerContent.innerHTML = '<div class="loading-state">正在加载阅读材料…</div>';
    try {
      const response = await fetch(item.path, { cache: "no-store" });
      if (!response.ok) throw new Error(`Article request failed: ${response.status}`);
      const markdown = await response.text();
      if (item.type === "framework") {
        state.currentSections = { full: markdown };
        elements.sectionTabs.innerHTML = "";
        elements.readerToolbar.hidden = true;
        elements.readerContent.removeAttribute("aria-labelledby");
        elements.readerContent.innerHTML = `<div class="markdown-body">${renderMarkdown(markdown)}</div>`;
      } else {
        state.currentSections = splitSections(markdown);
        const missingSections = ARTICLE_SECTIONS.filter((section) => !state.currentSections[section]);
        if (missingSections.length) throw new Error(`Missing article sections: ${missingSections.join(", ")}`);
        elements.readerToolbar.hidden = false;
        renderSectionTabs();
        renderArticleSection();
      }
      state.articleLoaded = true;
      [elements.completeButton, elements.completeButtonBottom].forEach((button) => { button.disabled = false; });
      renderLibrary();
      if (savedReader?.scrollY) window.requestAnimationFrame(() => window.scrollTo({ top: savedReader.scrollY, behavior: "auto" }));
    } catch (error) {
      console.error(error);
      elements.readerContent.innerHTML = '<div class="error-state"><p>文章加载失败，当前完成状态没有改变</p><button class="secondary-button" type="button" data-retry-article>重新加载文章</button></div>';
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
      <button id="tab-${section.replace(/\s+/g, "-").toLowerCase()}" type="button" role="tab" data-section="${section}" aria-controls="readerContent" aria-selected="${section === state.activeSection}" tabindex="${section === state.activeSection ? "0" : "-1"}">${SECTION_LABELS[section]}</button>
    `).join("");
    elements.readerContent.setAttribute("aria-labelledby", `tab-${state.activeSection.replace(/\s+/g, "-").toLowerCase()}`);
  }

  function activateSection(section, focusTab = false) {
    if (!ARTICLE_SECTIONS.includes(section)) return;
    state.bilingual = false;
    elements.bilingualButton.setAttribute("aria-pressed", "false");
    state.activeSection = section;
    updateLastReader({ section, bilingual: false, scrollY: 0 });
    renderArticleSection();
    if (focusTab) elements.sectionTabs.querySelector(`[data-section="${section}"]`)?.focus();
  }

  function onSectionTabKeydown(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const tabs = Array.from(elements.sectionTabs.querySelectorAll('[role="tab"]'));
    const currentIndex = tabs.indexOf(event.target);
    if (currentIndex < 0) return;
    event.preventDefault();
    let nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : currentIndex + (event.key === "ArrowRight" ? 1 : -1);
    nextIndex = (nextIndex + tabs.length) % tabs.length;
    activateSection(tabs[nextIndex].dataset.section, true);
  }

  function renderArticleSection() {
    if (state.bilingual) {
      elements.sectionTabs.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-selected", "false");
        button.tabIndex = button.dataset.section === "English Original" ? 0 : -1;
      });
      elements.readerContent.removeAttribute("aria-labelledby");
      elements.readerContent.innerHTML = `<div class="bilingual-grid">
        <section class="bilingual-panel"><p class="panel-label">ENGLISH ORIGINAL</p><div class="markdown-body">${renderMarkdown(state.currentSections["English Original"] || "")}</div></section>
        <section class="bilingual-panel"><p class="panel-label">中文翻译</p><div class="markdown-body">${renderMarkdown(state.currentSections["Chinese Translation"] || "")}</div></section>
      </div>`;
      return;
    }
    elements.sectionTabs.querySelectorAll("button").forEach((button) => {
      const active = button.dataset.section === state.activeSection;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    elements.readerContent.setAttribute("aria-labelledby", `tab-${state.activeSection.replace(/\s+/g, "-").toLowerCase()}`);
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
    if (event.target.closest("[data-retry-article]")) {
      openItem(state.currentItem?.id, { resume: true });
      return;
    }
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
    if (!state.currentItem || !state.articleLoaded) return;
    const id = state.currentItem.id;
    const exists = state.data.completed.includes(id);
    state.data.completed = exists ? state.data.completed.filter((item) => item !== id) : [...state.data.completed, id];
    const todayPlan = getTodayPlan();
    if (state.currentItem.type === "article" && todayPlan?.article.id === id && todayPlan.mode.id === "learn") {
      const today = localDateKey(new Date());
      const tasks = new Set(state.data.daily[today] || []);
      if (exists) tasks.delete("read");
      else tasks.add("read");
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
      button.setAttribute("aria-pressed", String(Boolean(done)));
    });
  }

  function updateStats() {
    const articleIds = state.manifest.filter((item) => item.type === "article").map((item) => item.id);
    const completed = state.data.completed.filter((id) => articleIds.includes(id)).length;
    const streak = calculateStreak();
    const completedDays = countCompletedPlanDays();
    elements.statCompleted.textContent = String(completed);
    elements.statWords.textContent = String(state.data.learnedWords.length);
    elements.statStreak.textContent = String(streak);
    elements.headerStreak.textContent = `连续 ${streak} 天`;
    elements.headerProgress.textContent = `计划 ${completedDays} / ${PLAN_DAYS}`;
    const percent = Math.round((completedDays / PLAN_DAYS) * 100);
    elements.progressBar.style.width = `${percent}%`;
    elements.progressBar.parentElement.setAttribute("aria-label", `30天计划已完成${completedDays}天`);
    elements.progressCopy.textContent = completedDays ? `30天验证计划已完成${percent}%，只有4项任务全部勾选才计入` : `从今天开始，完成4项任务后记录第1个学习日`;
  }

  function calculateStreak() {
    let streak = 0;
    const cursor = new Date();
    const todayKey = localDateKey(cursor);
    if (!isDateComplete(todayKey)) cursor.setDate(cursor.getDate() - 1);
    while (isDateComplete(localDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function isDateComplete(dateKey) {
    const date = parseLocalDate(dateKey);
    if (Number.isNaN(date.getTime())) return false;
    const rawDay = daysBetween(parseLocalDate(state.data.startedAt), date) + 1;
    if (rawDay < 1 || rawDay > PLAN_DAYS) return false;
    const required = DAY_MODES[(rawDay - 1) % DAY_MODES.length].tasks.map((task) => task.id);
    const checked = new Set(state.data.daily[dateKey] || []);
    return required.every((id) => checked.has(id));
  }

  function countCompletedPlanDays() {
    const start = parseLocalDate(state.data.startedAt);
    let count = 0;
    for (let index = 0; index < PLAN_DAYS; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      if (isDateComplete(localDateKey(date))) count += 1;
    }
    return count;
  }

  function changeFont(delta) {
    state.fontScale = Math.min(1.3, Math.max(0.8, Number((state.fontScale + delta).toFixed(1))));
    state.data.fontScale = state.fontScale;
    saveProgress();
    document.documentElement.style.setProperty("--reader-scale", state.fontScale);
    showToast(`正文字号 ${Math.round(state.fontScale * 100)}%`);
  }

  function showToast(message, duration = 1800) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.classList.remove("is-visible"), duration);
  }

  function updateLastReader(changes) {
    const current = state.data.lastReader || { itemId: state.currentItem?.id || "", section: "English Original", bilingual: false, scrollY: 0 };
    state.data.lastReader = { ...current, ...changes };
    state.data.lastOpened = state.data.lastReader.itemId;
    saveProgress();
  }

  function saveReaderPosition(event) {
    if (state.currentView !== "reader" || !state.currentItem) return;
    const persist = () => updateLastReader({ scrollY: Math.round(window.scrollY) });
    clearTimeout(saveReaderPosition.timer);
    if (event?.type === "beforeunload") persist();
    else saveReaderPosition.timer = setTimeout(persist, 250);
  }

  function exportProgress() {
    saveReaderPosition({ type: "beforeunload" });
    const payload = {
      app: "Metric English",
      schemaVersion: STORAGE_SCHEMA,
      exportedAt: new Date().toISOString(),
      data: state.data
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `metric-english-progress-${localDateKey(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    showToast("学习进度已导出");
  }

  async function importProgress(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 1024 * 1024) {
      showToast("导入失败：文件不能超过1MB", 3600);
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      const imported = sanitizeProgress(parsed?.data || parsed);
      if (!window.confirm("导入会覆盖当前浏览器中的学习进度。确认继续吗？")) return;
      state.data = imported;
      state.fontScale = imported.fontScale;
      document.documentElement.style.setProperty("--reader-scale", state.fontScale);
      state.data.lastView = "dashboard";
      saveProgress();
      setTodayLabels();
      renderDailyTasks();
      renderAll();
      showView("dashboard");
      showToast("学习进度导入成功", 2800);
    } catch (error) {
      console.error("Progress import failed", error);
      showToast("导入失败：不是有效的Metric English进度文件", 3600);
    }
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
