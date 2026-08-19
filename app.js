(function () {
  "use strict";

  const STORAGE_KEY = "metricEnglish.v1";
  const STORAGE_SCHEMA = 4;
  const READING_PLAN_DAYS = 30;
  const WRITING_PLAN_DAYS = 30;
  const ADVANCED_READING_PLAN_DAYS = 60;
  const MAX_DRAFT_LENGTH = 10000;
  const MAX_ADVANCED_RESPONSE_LENGTH = 3000;
  const MAX_NOTE_LENGTH = 500;
  const MAX_ACTIVE_SECONDS = 7200;
  const SECTION_LABELS = {
    "English Original": "英文原文",
    "Chinese Translation": "中文翻译",
    "Vocabulary": "重点词汇",
    "Grammar Analysis": "语法解析",
    "Data Analyst Extension": "分析师延伸",
    "Reading Questions": "阅读问题"
  };
  const ARTICLE_SECTIONS = Object.keys(SECTION_LABELS);
  const WRITING_BASE_SECTIONS = [
    "Workplace Context",
    "Data Brief",
    "Model Email",
    "Structure Breakdown",
    "Language Toolkit",
    "Model Task",
    "Model Reference",
    "Guided Task",
    "Guided Reference",
    "Independent Task",
    "Independent Reference",
    "Oral Retell"
  ];
  const WRITING_MODES = [
    { id: "model", label: "MODEL DAY", title: "示范日 · 30–35分钟", task: "Model Task", reference: "Model Reference" },
    { id: "guided", label: "GUIDED DAY", title: "引导日 · 30–35分钟", task: "Guided Task", reference: "Guided Reference" },
    { id: "independent", label: "INDEPENDENT DAY", title: "独立日 · 30–35分钟", task: "Independent Task", reference: "Independent Reference" }
  ];
  const RUBRIC_ITEMS = [
    { id: "clarity", label: "结论清晰", help: "第一段能否让读者快速知道结果或请求" },
    { id: "evidence", label: "证据充分", help: "是否使用了关键数字、比较基准或事实" },
    { id: "logic", label: "逻辑连贯", help: "结论、证据、解释和下一步是否连得起来" },
    { id: "tone", label: "职业措辞", help: "语气是否准确、克制，并说明不确定性" },
    { id: "action", label: "行动建议", help: "读者能否看出下一步、负责人或时间点" }
  ];
  const READING_DAY_MODES = [
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
  const ADVANCED_READING_MODES = [
    {
      id: "deep",
      label: "DEEP READING",
      title: "精读日 · 30–35分钟",
      description: "先独立读懂文章，再处理词汇、语法和理解问题",
      tasks: [
        { id: "read", label: "不看翻译阅读英文原文", time: "12 min" },
        { id: "words", label: "学习重点词汇", time: "8 min" },
        { id: "grammar", label: "阅读语法解析", time: "7 min" },
        { id: "questions", label: "完成理解问题", time: "6 min" }
      ]
    },
    {
      id: "apply",
      label: "WORKPLACE APPLICATION",
      title: "应用日 · 30–35分钟",
      description: "复读文章并把方法转成自己的英文业务表达",
      tasks: [
        { id: "translation", label: "重新阅读并核对中文翻译", time: "8 min" },
        { id: "extension", label: "学习分析师延伸", time: "7 min" },
        { id: "retell", label: "完成1分钟英文复述", time: "5 min" }
      ]
    }
  ];
  const ADVANCED_MODULES = [
    { id: "sql", title: "SQL与数据建模" },
    { id: "metrics", title: "指标与产品分析" },
    { id: "experiments", title: "实验与统计" },
    { id: "communication", title: "报告与沟通" },
    { id: "quality", title: "数据质量与治理" },
    { id: "strategy", title: "策略与管理层表达" }
  ];

  let progressNotice = "";
  const state = {
    manifest: [],
    writingManifest: [],
    currentItem: null,
    currentSections: {},
    currentApplicationPrompt: "",
    activeSection: "English Original",
    activeLevel: "all",
    activeModule: "all",
    completionFilter: "all",
    query: "",
    viewBeforeReader: "dashboard",
    bilingual: false,
    fontScale: 1,
    currentView: "dashboard",
    articleLoaded: false,
    readingLoadError: false,
    writingLoadError: false,
    currentWritingDay: 1,
    currentAdvancedDay: 1,
    writingSections: {},
    writingMaterialLoaded: false,
    timerInterval: null,
    timerLastTick: null,
    data: loadProgress()
  };
  const elements = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cacheElements();
    renderRubricFields();
    bindEvents();
    syncSidebarAccessibility();
    setTodayLabel();
    renderDashboard();
    await Promise.all([loadReadingManifest(), loadWritingManifest()]);
    restoreLastView();
    if (progressNotice) showToast(progressNotice, 4200);
  }

  function cacheElements() {
    [
      "sidebar", "menuButton", "searchInput", "moduleFilter", "statusFilter", "libraryList", "libraryCards", "dashboardView", "libraryView", "readerView",
      "recordsView", "writingView", "libraryTools", "dailyTaskList", "dailyPercent", "startTrainingButton", "todayAssignment",
      "openFrameworkButton", "headerStreak", "headerProgress", "statCompleted", "statWords", "statStreak", "statCompletedLabel",
      "statWordsLabel", "statStreakLabel", "progressTrack", "progressBar", "progressCopy", "todayLabel", "dayNumber", "dayTotal",
      "dayCounter", "dashboardTitle", "heroCopy", "roadmapKicker", "roadmapTitle", "readerEyebrow", "readerTitle", "readerMeta",
      "readerToolbar", "sectionTabs", "readerContent", "completeButton", "completeButtonBottom", "backButton", "bilingualButton",
      "fontDownButton", "fontUpButton", "toast", "mainContent", "sidebarScrim", "resumeReadingButton", "exportProgressButton",
      "importProgressButton", "importProgressInput", "resetAdvancedButton", "roadmapList", "todayModeLabel", "todayPlanTitle", "recordsList",
      "benchmarkPanel", "benchmarkTitle", "openCurrentWritingButton", "writingBackButton", "writingEyebrow", "writingTitle",
      "writingMeta", "saveIndicator", "workplaceContext", "writingDataBrief", "modelExampleCard", "modelEmail", "languageSupport",
      "languageToolkit", "writingModeLabel", "writingTaskTitle", "writingTarget", "writingTask", "writingDraft", "wordCount",
      "activeTimer", "copyDraftButton", "submitWritingButton", "submissionPanel", "firstSubmissionText", "copySubmissionButton",
      "rubricForm", "rubricFields", "reflectionNote", "rubricTotal", "saveAssessmentButton", "referencePanel", "referenceAnswer",
      "structureBreakdown", "oralRetell", "nextWritingButton", "writingError", "retryWritingButton", "advancedPracticePanel",
      "advancedPracticeKicker", "advancedPracticeTitle", "advancedPracticeCopy", "advancedTaskList", "advancedResponseGroup",
      "advancedResponsePrompt", "advancedResponse", "advancedResponseCount", "advancedResponseHint", "advancedSaveIndicator", "completeAdvancedDayButton"
    ].forEach((id) => { elements[id] = document.getElementById(id); });
  }

  function bindEvents() {
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => showView(button.dataset.view));
    });
    document.querySelectorAll("[data-program]").forEach((button) => {
      button.addEventListener("click", () => setActiveProgram(button.dataset.program));
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
    elements.moduleFilter.addEventListener("change", (event) => {
      state.activeModule = event.target.value;
      renderLibrary();
    });
    elements.statusFilter.addEventListener("change", (event) => {
      state.completionFilter = event.target.value;
      renderLibrary();
    });
    elements.dailyTaskList.addEventListener("change", onReadingTaskChange);
    elements.startTrainingButton.addEventListener("click", startCurrentTraining);
    elements.resumeReadingButton.addEventListener("click", () => openItem(state.data.lastReader?.itemId, { resume: true }));
    elements.openCurrentWritingButton.addEventListener("click", openCurrentWriting);
    elements.exportProgressButton.addEventListener("click", exportProgress);
    elements.importProgressButton.addEventListener("click", () => elements.importProgressInput.click());
    elements.importProgressInput.addEventListener("change", importProgress);
    elements.resetAdvancedButton.addEventListener("click", resetAdvancedReadingProgram);
    elements.openFrameworkButton.addEventListener("click", () => openItem("nce3-framework"));
    elements.backButton.addEventListener("click", () => showView(state.viewBeforeReader));
    elements.writingBackButton.addEventListener("click", () => showView("dashboard"));
    elements.completeButton.addEventListener("click", toggleCurrentComplete);
    elements.completeButtonBottom.addEventListener("click", toggleCurrentComplete);
    elements.sectionTabs.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-section]");
      if (button) activateSection(button.dataset.section, true);
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
    elements.writingDraft.addEventListener("input", onWritingInput);
    elements.copyDraftButton.addEventListener("click", () => copyText(elements.writingDraft.value, "草稿已复制"));
    elements.copySubmissionButton.addEventListener("click", () => copyText(elements.firstSubmissionText.textContent, "首次提交已复制"));
    elements.submitWritingButton.addEventListener("click", submitWriting);
    elements.rubricForm.addEventListener("change", onRubricChange);
    elements.reflectionNote.addEventListener("input", debounce(saveRubricDraft, 400));
    elements.rubricForm.addEventListener("submit", submitAssessment);
    elements.nextWritingButton.addEventListener("click", openNextWriting);
    elements.retryWritingButton.addEventListener("click", () => openWritingDay(state.currentWritingDay, { retry: true }));
    elements.advancedTaskList.addEventListener("change", onAdvancedTaskChange);
    elements.advancedResponse.addEventListener("input", onAdvancedResponseInput);
    elements.completeAdvancedDayButton.addEventListener("click", completeAdvancedReadingDay);
    elements.recordsList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-writing-day]");
      if (button) openWritingDay(Number(button.dataset.writingDay));
      const copyButton = event.target.closest("button[data-copy-day]");
      if (copyButton) copyRecord(Number(copyButton.dataset.copyDay), copyButton.dataset.copyKind);
    });
    window.addEventListener("resize", syncSidebarAccessibility);
    window.addEventListener("scroll", saveReaderPosition, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", () => {
      saveReaderPosition({ type: "beforeunload" });
      pauseWritingTimer();
      persistWritingDraft();
      persistAdvancedResponse();
    });
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
      lastWritingDay: 1,
      fontScale: 1,
      activeProgram: "writing",
      writingProgram: { startedAt: null, completedAt: null, attempts: {} },
      advancedReadingProgram: { startedAt: null, completedAt: null, attempts: {} }
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
      if (elements.toast) showToast("进度保存失败，请先导出备份并检查浏览器设置", 3600);
      return false;
    }
  }

  function sanitizeProgress(candidate) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) throw new Error("Progress must be an object");
    const fallback = defaultProgress();
    const legacySchema = Number(candidate.schemaVersion) || 1;
    if (!Number.isInteger(legacySchema) || legacySchema < 1 || legacySchema > STORAGE_SCHEMA) throw new Error("Progress schema is not supported");
    const parsedStart = parseLocalDate(candidate.startedAt || "");
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(candidate.startedAt || "") &&
      !Number.isNaN(parsedStart.getTime()) && localDateKey(parsedStart) === candidate.startedAt;
    const startedAt = validDate && parsedStart <= new Date() ? candidate.startedAt : fallback.startedAt;
    const daily = {};
    if (candidate.daily && typeof candidate.daily === "object" && !Array.isArray(candidate.daily)) {
      Object.entries(candidate.daily).slice(0, 400).forEach(([date, tasks]) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date) && Array.isArray(tasks)) daily[date] = uniqueStrings(tasks, 20);
      });
    }
    const legacyLastOpened = typeof candidate.lastOpened === "string" ? candidate.lastOpened : null;
    const sourceReader = candidate.lastReader && typeof candidate.lastReader === "object" ? candidate.lastReader : null;
    const lastReader = sourceReader && typeof sourceReader.itemId === "string" ? {
      itemId: safeText(sourceReader.itemId, 120),
      section: ARTICLE_SECTIONS.includes(sourceReader.section) ? sourceReader.section : "English Original",
      bilingual: Boolean(sourceReader.bilingual),
      scrollY: finiteNumber(sourceReader.scrollY, 0, 100000, 0)
    } : legacyLastOpened ? { itemId: safeText(legacyLastOpened, 120), section: "English Original", bilingual: false, scrollY: 0 } : null;
    const writingProgram = sanitizeWritingProgram(candidate.writingProgram);
    const advancedReadingProgram = sanitizeAdvancedReadingProgram(candidate.advancedReadingProgram);
    const allowedViews = ["dashboard", "library", "reader", "records", "writing"];
    let lastView = allowedViews.includes(candidate.lastView) ? candidate.lastView : "dashboard";
    if (lastView === "reader" && !lastReader) lastView = "dashboard";
    if (legacySchema < STORAGE_SCHEMA) {
      lastView = "dashboard";
      progressNotice = "V1.3数据升级完成，原有阅读和写作进度已保留";
    }
    const activeProgram = candidate.activeProgram === "readingAdvanced" ? "readingAdvanced" :
      ["reading", "readingFoundation"].includes(candidate.activeProgram) ? "readingFoundation" : "writing";
    return {
      schemaVersion: STORAGE_SCHEMA,
      startedAt,
      completed: uniqueStrings(candidate.completed, 200),
      learnedWords: uniqueStrings(candidate.learnedWords, 5000).map((word) => word.toLowerCase()),
      daily,
      lastOpened: lastReader?.itemId || null,
      lastReader,
      lastView,
      lastWritingDay: Math.round(finiteNumber(candidate.lastWritingDay, 1, WRITING_PLAN_DAYS, 1)),
      fontScale: finiteNumber(candidate.fontScale, 0.8, 1.3, 1),
      activeProgram,
      writingProgram,
      advancedReadingProgram
    };
  }

  function sanitizeAdvancedReadingProgram(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const attempts = {};
    if (source.attempts && typeof source.attempts === "object" && !Array.isArray(source.attempts)) {
      Object.entries(source.attempts).slice(0, ADVANCED_READING_PLAN_DAYS).forEach(([dayKey, attempt]) => {
        const day = Number(dayKey);
        if (Number.isInteger(day) && day >= 1 && day <= ADVANCED_READING_PLAN_DAYS) {
          attempts[String(day)] = sanitizeAdvancedAttempt(attempt, day);
        }
      });
    }
    const allComplete = Array.from({ length: ADVANCED_READING_PLAN_DAYS }, (_, index) => attempts[String(index + 1)]?.completedAt).every(Boolean);
    return {
      startedAt: safeIso(source.startedAt),
      completedAt: allComplete ? safeIso(source.completedAt) || new Date().toISOString() : null,
      attempts
    };
  }

  function sanitizeAdvancedAttempt(value, day) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const mode = ADVANCED_READING_MODES[(day - 1) % ADVANCED_READING_MODES.length];
    const allowedTasks = new Set(mode.tasks.map((task) => task.id));
    const tasks = uniqueStrings(source.tasks, 10).filter((task) => allowedTasks.has(task));
    const applicationText = safeText(source.applicationText, MAX_ADVANCED_RESPONSE_LENGTH);
    const taskComplete = mode.tasks.every((task) => tasks.includes(task.id));
    const responseComplete = mode.id !== "apply" || countEnglishWords(applicationText) >= 40;
    return {
      articleId: safeText(source.articleId, 120),
      mode: mode.id,
      tasks,
      applicationText,
      startedAt: safeIso(source.startedAt),
      updatedAt: safeIso(source.updatedAt),
      completedAt: taskComplete && responseComplete ? safeIso(source.completedAt) : null
    };
  }

  function sanitizeWritingProgram(value) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const attempts = {};
    if (source.attempts && typeof source.attempts === "object" && !Array.isArray(source.attempts)) {
      Object.entries(source.attempts).slice(0, WRITING_PLAN_DAYS).forEach(([dayKey, attempt]) => {
        const day = Number(dayKey);
        if (Number.isInteger(day) && day >= 1 && day <= WRITING_PLAN_DAYS) attempts[String(day)] = sanitizeAttempt(attempt, day);
      });
    }
    const allComplete = Array.from({ length: WRITING_PLAN_DAYS }, (_, index) => attempts[String(index + 1)]?.completedAt).every(Boolean);
    return {
      startedAt: safeIso(source.startedAt),
      completedAt: allComplete ? safeIso(source.completedAt) || new Date().toISOString() : null,
      attempts
    };
  }

  function sanitizeAttempt(value, day) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const draftText = safeText(source.draftText, MAX_DRAFT_LENGTH);
    const activeSeconds = finiteNumber(source.activeSeconds, 0, MAX_ACTIVE_SECONDS, 0);
    const firstSource = source.firstSubmission && typeof source.firstSubmission === "object" ? source.firstSubmission : null;
    const firstText = safeText(firstSource?.text, MAX_DRAFT_LENGTH);
    const firstSubmission = firstText.trim() ? {
      text: firstText,
      submittedAt: safeIso(firstSource?.submittedAt) || new Date().toISOString(),
      wordCount: countEnglishWords(firstText),
      activeSeconds: finiteNumber(firstSource?.activeSeconds, 0, MAX_ACTIVE_SECONDS, activeSeconds)
    } : null;
    const assessment = sanitizeAssessment(source.assessment);
    const completedAt = firstSubmission && assessment?.assessedAt ? safeIso(source.completedAt) || assessment.assessedAt : null;
    return {
      exerciseId: typeof source.exerciseId === "string" ? safeText(source.exerciseId, 120) : `day-${String(day).padStart(2, "0")}`,
      draftText,
      startedAt: safeIso(source.startedAt),
      updatedAt: safeIso(source.updatedAt),
      activeSeconds,
      firstSubmission,
      assessment,
      completedAt
    };
  }

  function sanitizeAssessment(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const scores = {};
    RUBRIC_ITEMS.forEach((item) => {
      const score = Number(value.scores?.[item.id]);
      if (Number.isInteger(score) && score >= 0 && score <= 2) scores[item.id] = score;
    });
    const complete = RUBRIC_ITEMS.every((item) => Object.prototype.hasOwnProperty.call(scores, item.id));
    return {
      scores,
      note: safeText(value.note, MAX_NOTE_LENGTH),
      assessedAt: complete ? safeIso(value.assessedAt) : null
    };
  }

  function safeText(value, limit) {
    return typeof value === "string" ? value.slice(0, limit) : "";
  }

  function safeIso(value) {
    if (typeof value !== "string" || value.length > 40) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  function finiteNumber(value, min, max, fallback) {
    return Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
  }

  function uniqueStrings(value, limit) {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value.filter((item) => typeof item === "string" && item.length <= 120))).slice(0, limit);
  }

  async function loadReadingManifest() {
    try {
      const response = await fetch("./content/manifest.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Reading manifest failed: ${response.status}`);
      const manifest = await response.json();
      const ids = Array.isArray(manifest) ? manifest.map((item) => item?.id) : [];
      if (!Array.isArray(manifest) || !manifest.length || !manifest.every(isValidReadingEntry) || new Set(ids).size !== ids.length) {
        throw new Error("Reading manifest format is invalid");
      }
      state.manifest = manifest;
      state.readingLoadError = false;
    } catch (error) {
      console.error(error);
      state.manifest = [];
      state.readingLoadError = true;
    }
    state.fontScale = state.data.fontScale;
    document.documentElement.style.setProperty("--reader-scale", state.fontScale);
    renderAll();
  }

  async function loadWritingManifest() {
    try {
      const response = await fetch("./content/writing/manifest.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Writing manifest failed: ${response.status}`);
      const manifest = await response.json();
      if (!Array.isArray(manifest) || manifest.length !== 10 || !manifest.every(isValidWritingEntry)) {
        throw new Error("Writing manifest format is invalid");
      }
      state.writingManifest = manifest;
      state.writingLoadError = false;
    } catch (error) {
      console.error(error);
      state.writingManifest = [];
      state.writingLoadError = true;
    }
    renderAll();
  }

  function isSafeContentPath(path) {
    return typeof path === "string" && /^\.\/content\/[A-Za-z0-9_./-]+\.md$/.test(path) && !path.includes("..");
  }

  function isValidReadingEntry(item) {
    if (!item || typeof item !== "object" || !isSafeContentPath(item.path)) return false;
    if (!/^[a-z0-9-]{2,80}$/.test(item.id || "") || !["framework", "article"].includes(item.type)) return false;
    if (!Number.isInteger(Number(item.order))) return false;
    if (![item.title, item.titleZh, item.level, item.focus, item.summary].every((value) => typeof value === "string" && value.length > 0 && value.length <= 300)) return false;
    if (item.type === "article" && !Number.isFinite(Number(item.minutes))) return false;
    if (item.track === "advanced" && !ADVANCED_MODULES.some((module) => module.id === item.module)) return false;
    return item.track === undefined || ["foundation", "advanced"].includes(item.track);
  }

  function isValidWritingEntry(item) {
    if (!item || typeof item !== "object" || !isSafeContentPath(item.path)) return false;
    if (!/^[a-z0-9-]{2,80}$/.test(item.id || "") || !Number.isInteger(Number(item.order))) return false;
    if (![item.title, item.titleZh, item.level, item.focus, item.summary].every((value) => typeof value === "string" && value.length <= 300)) return false;
    return WRITING_MODES.every((mode) => {
      const target = item.targets?.[mode.id];
      return Array.isArray(target) && target.length === 2 && target.every(Number.isFinite) && target[0] >= 20 && target[1] <= 300 && target[0] <= target[1];
    });
  }

  function renderAll() {
    renderLibrary();
    renderDashboard();
    renderRecords();
  }

  function restoreLastView() {
    const view = state.data.lastView;
    if (view === "reader" && state.data.lastReader && state.manifest.some((item) => item.id === state.data.lastReader.itemId)) {
      const advancedDay = state.data.activeProgram === "readingAdvanced" ? getCurrentAdvancedReadingDay() : null;
      const advancedPlan = advancedDay ? getAdvancedReadingPlan(advancedDay) : null;
      openItem(state.data.lastReader.itemId, { resume: true, advancedDay: advancedPlan?.article.id === state.data.lastReader.itemId ? advancedDay : null });
    } else if (view === "writing" && state.writingManifest.length) {
      openWritingDay(state.data.lastWritingDay || getCurrentWritingDay());
    } else if (view === "library" || view === "records") {
      showView(view);
    } else {
      showView("dashboard");
    }
  }

  function showView(view) {
    if (!["dashboard", "library", "reader", "records", "writing"].includes(view)) view = "dashboard";
    if (state.currentView === "reader" && view !== "reader") {
      saveReaderPosition({ type: "beforeunload" });
      persistAdvancedResponse();
    }
    if (state.currentView === "writing" && view !== "writing") {
      pauseWritingTimer();
      persistWritingDraft();
    }
    if (view !== "reader" && view !== "writing") state.viewBeforeReader = view;
    state.currentView = view;
    state.data.lastView = view;
    saveProgress();
    elements.dashboardView.hidden = view !== "dashboard";
    elements.libraryView.hidden = view !== "library";
    elements.readerView.hidden = view !== "reader";
    elements.recordsView.hidden = view !== "records";
    elements.writingView.hidden = view !== "writing";
    elements.libraryTools.hidden = !["library", "reader"].includes(view);
    document.querySelectorAll(".nav-button").forEach((button) => {
      const activeView = view === "writing" ? "dashboard" : view === "reader" ? "library" : view;
      button.classList.toggle("is-active", button.dataset.view === activeView);
    });
    toggleSidebar(false);
    if (view === "dashboard") renderDashboard();
    if (view === "records") renderRecords();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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

  function setTodayLabel() {
    elements.todayLabel.textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(new Date());
  }

  function setActiveProgram(program) {
    if (!["writing", "readingFoundation", "readingAdvanced"].includes(program) || state.data.activeProgram === program) return;
    const previous = state.data.activeProgram;
    state.data.activeProgram = program;
    state.data.lastView = "dashboard";
    if (!saveProgress()) {
      state.data.activeProgram = previous;
      return;
    }
    renderDashboard();
    showView("dashboard");
  }

  function renderDashboard() {
    elements.resetAdvancedButton.hidden = state.data.activeProgram !== "readingAdvanced";
    document.querySelectorAll("[data-program]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.program === state.data.activeProgram));
    });
    if (state.data.activeProgram === "readingFoundation") renderReadingDashboard();
    else if (state.data.activeProgram === "readingAdvanced") renderAdvancedReadingDashboard();
    else renderWritingDashboard();
  }

  function renderWritingDashboard() {
    const currentDay = getCurrentWritingDay();
    const plan = getWritingPlan(currentDay);
    const started = Boolean(state.data.writingProgram.startedAt);
    const complete = isWritingProgramComplete();
    elements.dashboardTitle.textContent = "把分析写成能推动决策的英文";
    elements.heroCopy.textContent = "每天30–35分钟，在数据分析工作情境中完成一封邮件或一段分析结论";
    elements.dayNumber.textContent = String(complete ? WRITING_PLAN_DAYS : currentDay).padStart(3, "0");
    elements.dayTotal.textContent = "/ 030 DAYS";
    elements.dayCounter.setAttribute("aria-label", `写作训练第${complete ? WRITING_PLAN_DAYS : currentDay}天`);
    elements.openFrameworkButton.hidden = true;
    elements.roadmapKicker.textContent = "30-DAY WRITING";
    elements.roadmapTitle.textContent = "10个分析师工作情境";
    elements.resumeReadingButton.hidden = true;

    if (state.writingLoadError || !plan) {
      elements.todayModeLabel.textContent = "CONTENT UNAVAILABLE";
      elements.todayPlanTitle.textContent = "写作材料暂时无法读取";
      elements.dailyTaskList.innerHTML = '<div class="plan-finished"><strong>目录加载失败</strong><span>刷新页面后重试，阅读资料仍可使用</span></div>';
      elements.todayAssignment.innerHTML = '<h2 id="assignmentTitle">写作训练未加载</h2><p>请检查网络连接后刷新页面</p>';
      elements.startTrainingButton.disabled = true;
      renderWritingStats();
      renderWritingRoadmap(currentDay);
      return;
    }

    if (complete) {
      elements.todayModeLabel.textContent = "WRITING COMPLETE";
      elements.todayPlanTitle.textContent = "30天写作训练已完成";
      elements.dailyTaskList.innerHTML = '<div class="plan-finished"><strong>30 / 30天</strong><span>查看写作记录，对比第1天和第30天</span></div>';
      elements.dailyPercent.textContent = "100%";
      elements.dailyPercent.classList.add("is-complete");
      elements.todayAssignment.innerHTML = '<p class="assignment-type">训练结果</p><h2 id="assignmentTitle">基线与终测已可对比</h2><p>回看首次提交和修改版，确定下一轮最需要加强的表达</p>';
      elements.startTrainingButton.disabled = false;
      elements.startTrainingButton.innerHTML = '查看写作记录 <span aria-hidden="true">→</span>';
    } else if (!started) {
      elements.todayModeLabel.textContent = "READY TO START";
      elements.todayPlanTitle.textContent = "30天职场写作训练";
      elements.dailyTaskList.innerHTML = [
        ["01", "示范、仿写、独立输出", "10个情境"],
        ["02", "首次提交与五项自评", "保留快照"],
        ["03", "基线和终测对比", "第1、30天"]
      ].map(([mark, label, time]) => `<div class="daily-task task-status"><span class="task-mark">${mark}</span><span>${label}</span><small>${time}</small></div>`).join("");
      elements.dailyPercent.textContent = "0%";
      elements.dailyPercent.classList.remove("is-complete");
      elements.todayAssignment.innerHTML = `
        <p class="assignment-type">第1天 · 写作基线</p>
        <h2 id="assignmentTitle">${escapeHtml(plan.scenario.title)}</h2>
        <p>先完成一段限时写作，再查看范例。训练按完成顺序推进，不会因跨天跳题</p>
        <div class="assignment-meta"><span class="meta-pill">B1+</span><span class="meta-pill">30–35分钟</span><span class="meta-pill">虚构数据</span></div>
      `;
      elements.startTrainingButton.disabled = false;
      elements.startTrainingButton.innerHTML = '开始30天写作训练 <span aria-hidden="true">→</span>';
    } else {
      const attempt = getAttempt(currentDay);
      const status = getWritingStepStatus(attempt);
      elements.todayModeLabel.textContent = plan.mode.label;
      elements.todayPlanTitle.textContent = plan.mode.title;
      elements.dailyTaskList.innerHTML = [
        { done: Boolean(attempt?.draftText.trim()), label: "完成英文草稿", meta: `${plan.target[0]}–${plan.target[1]}词` },
        { done: Boolean(attempt?.firstSubmission), label: "提交首次版本", meta: "保留快照" },
        { done: Boolean(attempt?.assessment?.assessedAt), label: "完成五项自评", meta: "解锁参考" }
      ].map((task) => `<div class="daily-task task-status ${task.done ? "is-done" : ""}"><span class="task-mark" aria-hidden="true">${task.done ? "✓" : "·"}</span><span>${task.label}</span><small>${task.meta}</small></div>`).join("");
      elements.dailyPercent.textContent = `${status}%`;
      elements.dailyPercent.classList.toggle("is-complete", status === 100);
      elements.todayAssignment.innerHTML = `
        <p class="assignment-type">第${currentDay}天 · 情境${plan.scenario.order}</p>
        <h2 id="assignmentTitle">${escapeHtml(plan.scenario.title)}</h2>
        <p>${escapeHtml(plan.scenario.summary)}</p>
        <div class="assignment-meta"><span class="meta-pill">${escapeHtml(plan.scenario.level)}</span><span class="meta-pill">${plan.target[0]}–${plan.target[1]}词</span><span class="meta-pill">${escapeHtml(plan.scenario.focus)}</span></div>
      `;
      elements.startTrainingButton.disabled = false;
      elements.startTrainingButton.innerHTML = `${attempt?.draftText ? "继续今日写作" : "开始今日写作"} <span aria-hidden="true">→</span>`;
    }
    renderWritingStats();
    renderWritingRoadmap(currentDay);
  }

  function renderWritingStats() {
    const attempts = Object.values(state.data.writingProgram.attempts);
    const completed = countCompletedWritingDays();
    const drafted = attempts.filter((attempt) => attempt.draftText.trim()).length;
    const assessed = attempts.filter((attempt) => attempt.assessment?.assessedAt);
    const latestScore = assessed.length ? assessmentTotal(assessed.sort((a, b) => new Date(a.assessment.assessedAt) - new Date(b.assessment.assessedAt)).at(-1).assessment) : null;
    const streak = calculateWritingStreak();
    elements.statCompleted.textContent = String(completed);
    elements.statCompletedLabel.textContent = "完成天数";
    elements.statWords.textContent = String(drafted);
    elements.statWordsLabel.textContent = "已有草稿";
    elements.statStreak.textContent = latestScore === null ? "—" : `${latestScore}/10`;
    elements.statStreakLabel.textContent = "最近自评";
    elements.headerStreak.textContent = `写作连续 ${streak} 天`;
    elements.headerProgress.textContent = `写作 ${completed} / ${WRITING_PLAN_DAYS}`;
    const percent = Math.round((completed / WRITING_PLAN_DAYS) * 100);
    elements.progressBar.style.width = `${percent}%`;
    elements.progressTrack.setAttribute("aria-label", `30天写作计划已完成${completed}天`);
    elements.progressCopy.textContent = completed ? `已完成${percent}%，当前内容会保留到提交和自评结束` : "开始第1次写作后记录训练进度";
  }

  function renderWritingRoadmap(currentDay) {
    if (!state.writingManifest.length) {
      elements.roadmapList.innerHTML = '<li><span>—</span><div><strong>写作目录未加载</strong><small>刷新页面后重试</small></div></li>';
      return;
    }
    const completed = countCompletedWritingDays();
    elements.roadmapList.innerHTML = state.writingManifest.map((scenario, index) => {
      const start = index * 3 + 1;
      const end = start + 2;
      const current = currentDay >= start && currentDay <= end && completed < WRITING_PLAN_DAYS;
      const scenarioDone = completed >= end;
      return `<li class="${current ? "is-current" : ""} ${scenarioDone ? "is-done" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHtml(scenario.titleZh)}</strong><small>第${start}–${end}天 · ${escapeHtml(scenario.focus)}</small></div></li>`;
    }).join("");
  }

  function renderAdvancedReadingDashboard() {
    const currentDay = getCurrentAdvancedReadingDay();
    const plan = getAdvancedReadingPlan(currentDay);
    const started = Boolean(state.data.advancedReadingProgram.startedAt);
    const complete = isAdvancedReadingProgramComplete();
    elements.dashboardTitle.textContent = "把行业阅读转成英文分析表达";
    elements.heroCopy.textContent = "每篇文章训练2天：先精读理解，再完成一段可用于工作的英文应用回答";
    elements.dayNumber.textContent = String(complete ? ADVANCED_READING_PLAN_DAYS : currentDay).padStart(3, "0");
    elements.dayTotal.textContent = "/ 060 DAYS";
    elements.dayCounter.setAttribute("aria-label", `进阶阅读第${complete ? ADVANCED_READING_PLAN_DAYS : currentDay}天`);
    elements.openFrameworkButton.hidden = true;
    elements.resumeReadingButton.hidden = true;
    elements.roadmapKicker.textContent = "60-DAY ADVANCED READING";
    elements.roadmapTitle.textContent = "6个数据分析主题模块";

    if (!isAdvancedContentReady() || !plan) {
      elements.todayModeLabel.textContent = "ENGINE READY · CONTENT PENDING";
      elements.todayPlanTitle.textContent = "进阶阅读内容正在准备";
      elements.dailyTaskList.innerHTML = [
        ["✓", "schema 4与旧数据迁移", "已就绪"],
        ["✓", "60天顺序训练引擎", "已就绪"],
        ["…", "30篇进阶阅读正文", `${getAdvancedArticles().length}/30篇`]
      ].map(([mark, label, meta]) => `<div class="daily-task task-status ${mark === "✓" ? "is-done" : ""}"><span class="task-mark">${mark}</span><span>${label}</span><small>${meta}</small></div>`).join("");
      elements.dailyPercent.textContent = "0%";
      elements.dailyPercent.classList.remove("is-complete");
      elements.todayAssignment.innerHTML = '<p class="assignment-type">V1.3 CORE</p><h2 id="assignmentTitle">核心训练引擎已接入</h2><p>进阶清单达到30篇并通过校验后，开始按钮会自动解锁。现有阅读和写作训练不受影响</p>';
      elements.startTrainingButton.disabled = true;
      elements.startTrainingButton.innerHTML = '等待30篇内容 <span aria-hidden="true">→</span>';
      renderAdvancedReadingStats();
      renderAdvancedReadingRoadmap(currentDay);
      return;
    }

    if (complete) {
      elements.todayModeLabel.textContent = "ADVANCED READING COMPLETE";
      elements.todayPlanTitle.textContent = "60天进阶阅读已完成";
      elements.dailyTaskList.innerHTML = '<div class="plan-finished"><strong>60 / 60天</strong><span>30篇文章和应用回答仍可继续回顾</span></div>';
      elements.dailyPercent.textContent = "100%";
      elements.dailyPercent.classList.add("is-complete");
      elements.startTrainingButton.disabled = false;
      elements.startTrainingButton.innerHTML = '回顾最后一篇 <span aria-hidden="true">→</span>';
    } else if (!started) {
      elements.todayModeLabel.textContent = "READY TO START";
      elements.todayPlanTitle.textContent = "60天进阶阅读训练";
      elements.dailyTaskList.innerHTML = [
        ["01", "精读原文、词汇与语法", "奇数日"],
        ["02", "复述并完成英文应用回答", "偶数日"],
        ["03", "按完成顺序推进", "不按日期跳题"]
      ].map(([mark, label, meta]) => `<div class="daily-task task-status"><span class="task-mark">${mark}</span><span>${label}</span><small>${meta}</small></div>`).join("");
      elements.dailyPercent.textContent = "0%";
      elements.dailyPercent.classList.remove("is-complete");
      elements.startTrainingButton.disabled = false;
      elements.startTrainingButton.innerHTML = '开始60天进阶阅读 <span aria-hidden="true">→</span>';
    } else {
      const attempt = getAdvancedAttempt(currentDay);
      const requirementCount = getAdvancedRequirementCount(plan, attempt);
      elements.todayModeLabel.textContent = plan.mode.label;
      elements.todayPlanTitle.textContent = plan.mode.title;
      elements.dailyTaskList.innerHTML = getAdvancedDashboardTasks(plan, attempt).map((task) => `<div class="daily-task task-status ${task.done ? "is-done" : ""}"><span class="task-mark">${task.done ? "✓" : "·"}</span><span>${escapeHtml(task.label)}</span><small>${escapeHtml(task.meta)}</small></div>`).join("");
      elements.dailyPercent.textContent = `${requirementCount * 25}%`;
      elements.dailyPercent.classList.toggle("is-complete", requirementCount === 4);
      elements.startTrainingButton.disabled = false;
      elements.startTrainingButton.innerHTML = `${attempt ? "继续今日训练" : "开始今日训练"} <span aria-hidden="true">→</span>`;
    }

    elements.todayAssignment.innerHTML = `
      <p class="assignment-type">第${currentDay}天 · ${escapeHtml(plan.mode.title.split(" · ")[0])}</p>
      <h2 id="assignmentTitle">${escapeHtml(plan.article.title)}</h2>
      <p>${escapeHtml(plan.mode.description)}。${escapeHtml(plan.article.summary)}</p>
      <div class="assignment-meta"><span class="meta-pill">${escapeHtml(plan.article.level)}</span><span class="meta-pill">30–35分钟</span><span class="meta-pill">${escapeHtml(plan.article.focus)}</span></div>
    `;
    renderAdvancedReadingStats();
    renderAdvancedReadingRoadmap(currentDay);
  }

  function renderAdvancedReadingStats() {
    const attempts = Object.values(state.data.advancedReadingProgram.attempts);
    const completedDays = countCompletedAdvancedReadingDays();
    const completedArticles = Array.from({ length: 30 }, (_, index) => getAdvancedAttempt((index + 1) * 2)?.completedAt).filter(Boolean).length;
    const responseCount = attempts.filter((attempt) => attempt.mode === "apply" && attempt.applicationText.trim()).length;
    const streak = calculateAdvancedReadingStreak();
    elements.statCompleted.textContent = String(completedDays);
    elements.statCompletedLabel.textContent = "完成天数";
    elements.statWords.textContent = String(completedArticles);
    elements.statWordsLabel.textContent = "完成文章";
    elements.statStreak.textContent = String(responseCount);
    elements.statStreakLabel.textContent = "应用回答";
    elements.headerStreak.textContent = `进阶连续 ${streak} 天`;
    elements.headerProgress.textContent = `进阶 ${completedDays} / ${ADVANCED_READING_PLAN_DAYS}`;
    const percent = Math.round((completedDays / ADVANCED_READING_PLAN_DAYS) * 100);
    elements.progressBar.style.width = `${percent}%`;
    elements.progressTrack.setAttribute("aria-label", `60天进阶阅读已完成${completedDays}天`);
    elements.progressCopy.textContent = completedDays ? `已完成${percent}%，当前停在第${getCurrentAdvancedReadingDay()}天` : "开始第1篇精读后记录进阶阅读进度";
  }

  function renderAdvancedReadingRoadmap(currentDay) {
    const completedDays = countCompletedAdvancedReadingDays();
    elements.roadmapList.innerHTML = ADVANCED_MODULES.map((module, index) => {
      const start = index * 10 + 1;
      const end = start + 9;
      const current = currentDay >= start && currentDay <= end && completedDays < ADVANCED_READING_PLAN_DAYS;
      const done = completedDays >= end;
      return `<li class="${current ? "is-current" : ""} ${done ? "is-done" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHtml(module.title)}</strong><small>第${start}–${end}天 · 5篇文章</small></div></li>`;
    }).join("");
  }

  function renderReadingDashboard() {
    const plan = getReadingPlan();
    elements.dashboardTitle.textContent = "把英语练进工作里";
    elements.heroCopy.textContent = "每天35分钟，读一篇、记八词、拆一句、答两题，建立稳定的行业英语输入";
    elements.dayNumber.textContent = String(getReadingPlanDay()).padStart(3, "0");
    elements.dayTotal.textContent = "/ 030 DAYS";
    elements.dayCounter.setAttribute("aria-label", `阅读计划第${getReadingPlanDay()}天`);
    elements.openFrameworkButton.hidden = false;
    elements.roadmapKicker.textContent = "30-DAY READING";
    elements.roadmapTitle.textContent = "30天阅读闭环";
    if (state.readingLoadError || !plan) {
      elements.todayModeLabel.textContent = "CONTENT UNAVAILABLE";
      elements.todayPlanTitle.textContent = "阅读目录暂时无法读取";
      elements.dailyTaskList.innerHTML = '<div class="plan-finished"><strong>目录加载失败</strong><span>请检查网络后刷新页面</span></div>';
      elements.todayAssignment.innerHTML = '<h2 id="assignmentTitle">阅读材料未加载</h2><p>直接双击HTML文件会阻止Markdown读取</p>';
      elements.startTrainingButton.disabled = true;
      renderReadingStats();
      renderReadingRoadmap();
      return;
    }
    const today = localDateKey(new Date());
    const checked = state.data.daily[today] || [];
    if (isReadingPlanFinished()) {
      const completedDays = countCompletedReadingDays();
      elements.todayModeLabel.textContent = "READING COMPLETE";
      elements.todayPlanTitle.textContent = "30天阅读验证期已结束";
      elements.dailyTaskList.innerHTML = `<div class="plan-finished"><strong>完成${completedDays}天</strong><span>文章和词汇记录仍可继续回顾</span></div>`;
      elements.dailyPercent.textContent = `${Math.round((completedDays / READING_PLAN_DAYS) * 100)}%`;
      elements.dailyPercent.classList.toggle("is-complete", completedDays === READING_PLAN_DAYS);
    } else {
      elements.todayModeLabel.textContent = plan.mode.label;
      elements.todayPlanTitle.textContent = plan.mode.title;
      elements.dailyTaskList.innerHTML = plan.mode.tasks.map((task) => `
        <label class="daily-task">
          <input type="checkbox" value="${task.id}" ${checked.includes(task.id) ? "checked" : ""}>
          <span>${task.label}</span><small>${task.time}</small>
        </label>
      `).join("");
      updateReadingDailyPercent();
    }
    elements.todayAssignment.innerHTML = `
      <p class="assignment-type">第${plan.day}天 · ${escapeHtml(plan.mode.title.split(" · ")[0])}</p>
      <h2 id="assignmentTitle">${escapeHtml(plan.article.title)}</h2>
      <p>${escapeHtml(plan.mode.description)}。${escapeHtml(plan.article.summary)}</p>
      <div class="assignment-meta"><span class="meta-pill">${escapeHtml(plan.article.level)}</span><span class="meta-pill">35分钟</span><span class="meta-pill">${escapeHtml(plan.article.focus)}</span></div>
    `;
    const label = isReadingPlanFinished() ? "回顾最后一篇" : plan.mode.id === "learn" ? "开始今日阅读" : "打开今日复习文章";
    elements.startTrainingButton.disabled = false;
    elements.startTrainingButton.innerHTML = `${label} <span aria-hidden="true">→</span>`;
    const lastItem = state.manifest.find((item) => item.id === state.data.lastReader?.itemId);
    const canResume = lastItem && lastItem.id !== plan.article.id;
    elements.resumeReadingButton.hidden = !canResume;
    if (canResume) elements.resumeReadingButton.textContent = `继续上次：${lastItem.title}`;
    renderReadingStats();
    renderReadingRoadmap();
  }

  function renderReadingRoadmap() {
    const items = [
      ["01", "基础词汇", "第1–9天 · 三篇A2文章", 1, 9],
      ["02", "指标表达", "第10–15天 · KPI与报表", 10, 15],
      ["03", "分析方法", "第16–21天 · 留存与实验", 16, 21],
      ["04", "工作沟通", "第22–30天 · 预测、故障与建议", 22, 30]
    ];
    const day = getReadingPlanDay();
    elements.roadmapList.innerHTML = items.map(([order, title, copy, start, end]) => `<li class="${day >= start && day <= end ? "is-current" : ""}"><span>${order}</span><div><strong>${title}</strong><small>${copy}</small></div></li>`).join("");
  }

  function renderReadingStats() {
    const articleIds = getFoundationArticles().map((item) => item.id);
    const completed = state.data.completed.filter((id) => articleIds.includes(id)).length;
    const streak = calculateReadingStreak();
    const completedDays = countCompletedReadingDays();
    elements.statCompleted.textContent = String(completed);
    elements.statCompletedLabel.textContent = "已读文章";
    elements.statWords.textContent = String(state.data.learnedWords.length);
    elements.statWordsLabel.textContent = "已掌握词汇";
    elements.statStreak.textContent = String(streak);
    elements.statStreakLabel.textContent = "连续天数";
    elements.headerStreak.textContent = `阅读连续 ${streak} 天`;
    elements.headerProgress.textContent = `阅读 ${completedDays} / ${READING_PLAN_DAYS}`;
    const percent = Math.round((completedDays / READING_PLAN_DAYS) * 100);
    elements.progressBar.style.width = `${percent}%`;
    elements.progressTrack.setAttribute("aria-label", `30天阅读计划已完成${completedDays}天`);
    elements.progressCopy.textContent = completedDays ? `阅读验证计划已完成${percent}%，4项任务全部勾选才计入` : "完成今天4项任务后记录第1个阅读日";
  }

  function startCurrentTraining() {
    if (state.data.activeProgram === "readingFoundation") {
      openItem(getReadingPlan()?.article?.id);
      return;
    }
    if (state.data.activeProgram === "readingAdvanced") {
      if (!isAdvancedContentReady()) return;
      openAdvancedReadingDay(isAdvancedReadingProgramComplete() ? ADVANCED_READING_PLAN_DAYS : getCurrentAdvancedReadingDay());
      return;
    }
    if (isWritingProgramComplete()) {
      showView("records");
      return;
    }
    if (!state.data.writingProgram.startedAt) {
      state.data.writingProgram.startedAt = new Date().toISOString();
      saveProgress();
    }
    openWritingDay(getCurrentWritingDay());
  }

  function getAdvancedArticles() {
    return state.manifest.filter((item) => item.type === "article" && item.track === "advanced").sort((a, b) => Number(a.order) - Number(b.order));
  }

  function getFoundationArticles() {
    return state.manifest.filter((item) => item.type === "article" && item.track !== "advanced").sort((a, b) => Number(a.order) - Number(b.order));
  }

  function getAdvancedModuleTitle(moduleId) {
    return ADVANCED_MODULES.find((module) => module.id === moduleId)?.title || "";
  }

  function resetAdvancedReadingProgram() {
    if (state.data.activeProgram !== "readingAdvanced") return;
    const confirmed = window.confirm("重置会删除60天进阶阅读任务和英文应用回答，但保留基础阅读、写作、词汇和资料库已读标记。确认继续吗？");
    if (!confirmed) return;
    const previous = cloneProgressData(state.data);
    state.data.advancedReadingProgram = { startedAt: null, completedAt: null, attempts: {} };
    state.currentAdvancedDay = 1;
    if (!saveProgress()) {
      state.data = previous;
      return;
    }
    renderAll();
    showView("dashboard");
    showToast("进阶阅读进度已重置，其他训练数据未改变");
  }

  function isAdvancedContentReady() {
    const articles = getAdvancedArticles();
    return articles.length === 30 && articles.every((article, index) => ADVANCED_MODULES[Math.floor(index / 5)]?.id === article.module);
  }

  function getAdvancedReadingPlan(day) {
    if (!Number.isInteger(day) || day < 1 || day > ADVANCED_READING_PLAN_DAYS || !isAdvancedContentReady()) return null;
    const articles = getAdvancedArticles();
    return {
      day,
      article: articles[Math.floor((day - 1) / 2)],
      mode: ADVANCED_READING_MODES[(day - 1) % 2]
    };
  }

  function getCurrentAdvancedReadingDay() {
    for (let day = 1; day <= ADVANCED_READING_PLAN_DAYS; day += 1) {
      if (!getAdvancedAttempt(day)?.completedAt) return day;
    }
    return ADVANCED_READING_PLAN_DAYS;
  }

  function getAdvancedAttempt(day) {
    return state.data.advancedReadingProgram.attempts[String(day)] || null;
  }

  function ensureAdvancedAttempt(day, plan) {
    const key = String(day);
    if (!state.data.advancedReadingProgram.attempts[key]) {
      state.data.advancedReadingProgram.attempts[key] = {
        articleId: plan.article.id,
        mode: plan.mode.id,
        tasks: [],
        applicationText: "",
        startedAt: new Date().toISOString(),
        updatedAt: null,
        completedAt: null
      };
    }
    return state.data.advancedReadingProgram.attempts[key];
  }

  function getAdvancedRequirementCount(plan, attempt) {
    if (!plan || !attempt) return 0;
    const taskCount = plan.mode.tasks.filter((task) => attempt.tasks.includes(task.id)).length;
    return taskCount + (plan.mode.id === "apply" && countEnglishWords(attempt.applicationText) >= 40 ? 1 : 0);
  }

  function getAdvancedDashboardTasks(plan, attempt) {
    const tasks = plan.mode.tasks.map((task) => ({
      done: Boolean(attempt?.tasks.includes(task.id)),
      label: task.label,
      meta: task.time
    }));
    if (plan.mode.id === "apply") {
      const words = countEnglishWords(attempt?.applicationText || "");
      tasks.push({ done: words >= 40, label: "完成英文业务应用回答", meta: `${words}/40词` });
    }
    return tasks;
  }

  function countCompletedAdvancedReadingDays() {
    return Array.from({ length: ADVANCED_READING_PLAN_DAYS }, (_, index) => getAdvancedAttempt(index + 1)?.completedAt).filter(Boolean).length;
  }

  function isAdvancedReadingProgramComplete() {
    return countCompletedAdvancedReadingDays() === ADVANCED_READING_PLAN_DAYS;
  }

  function calculateAdvancedReadingStreak() {
    const dates = new Set(Object.values(state.data.advancedReadingProgram.attempts).map((attempt) => attempt.completedAt).filter(Boolean).map((iso) => localDateKey(new Date(iso))));
    return calculateDateSetStreak(dates);
  }

  async function openAdvancedReadingDay(day) {
    const current = getCurrentAdvancedReadingDay();
    const attemptExists = Boolean(getAdvancedAttempt(day));
    if (!Number.isInteger(day) || day < 1 || day > ADVANCED_READING_PLAN_DAYS || (!attemptExists && day > current)) {
      showToast("后续阅读会在当前任务完成后解锁");
      return;
    }
    const plan = getAdvancedReadingPlan(day);
    if (!plan) {
      showToast("30篇进阶阅读内容尚未准备完成", 3200);
      return;
    }
    const previous = cloneProgressData(state.data);
    if (!state.data.advancedReadingProgram.startedAt) state.data.advancedReadingProgram.startedAt = new Date().toISOString();
    state.currentAdvancedDay = day;
    ensureAdvancedAttempt(day, plan);
    if (!saveProgress()) {
      state.data = previous;
      return;
    }
    await openItem(plan.article.id, { resume: true, advancedDay: day });
  }

  function cloneProgressData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function openCurrentWriting() {
    if (isWritingProgramComplete()) {
      openWritingDay(WRITING_PLAN_DAYS);
      return;
    }
    if (!state.data.writingProgram.startedAt) {
      state.data.activeProgram = "writing";
      showView("dashboard");
      return;
    }
    openWritingDay(getCurrentWritingDay());
  }

  function getWritingPlan(day) {
    if (!Number.isInteger(day) || day < 1 || day > WRITING_PLAN_DAYS || !state.writingManifest.length) return null;
    const scenario = state.writingManifest[Math.floor((day - 1) / 3)];
    const mode = WRITING_MODES[(day - 1) % 3];
    let taskSection = mode.task;
    let referenceSection = mode.reference;
    let target = scenario.targets[mode.id];
    if (day === 1) {
      taskSection = "Baseline Task";
      referenceSection = "Baseline Reference";
      target = [120, 160];
    } else if (day === WRITING_PLAN_DAYS) {
      taskSection = "Final Task";
      referenceSection = "Final Reference";
      target = [120, 160];
    }
    return { day, scenario, mode, taskSection, referenceSection, target };
  }

  function getCurrentWritingDay() {
    for (let day = 1; day <= WRITING_PLAN_DAYS; day += 1) {
      if (!getAttempt(day)?.completedAt) return day;
    }
    return WRITING_PLAN_DAYS;
  }

  function getAttempt(day) {
    return state.data.writingProgram.attempts[String(day)] || null;
  }

  function ensureAttempt(day) {
    const key = String(day);
    if (!state.data.writingProgram.attempts[key]) {
      state.data.writingProgram.attempts[key] = {
        exerciseId: `day-${String(day).padStart(2, "0")}`,
        draftText: "",
        startedAt: new Date().toISOString(),
        updatedAt: null,
        activeSeconds: 0,
        firstSubmission: null,
        assessment: null,
        completedAt: null
      };
    }
    return state.data.writingProgram.attempts[key];
  }

  function countCompletedWritingDays() {
    return Array.from({ length: WRITING_PLAN_DAYS }, (_, index) => getAttempt(index + 1)?.completedAt).filter(Boolean).length;
  }

  function isWritingProgramComplete() {
    return countCompletedWritingDays() === WRITING_PLAN_DAYS;
  }

  function getWritingStepStatus(attempt) {
    if (attempt?.assessment?.assessedAt) return 100;
    if (attempt?.firstSubmission) return 66;
    if (attempt?.draftText.trim()) return 33;
    return 0;
  }

  async function openWritingDay(day, options = {}) {
    const current = getCurrentWritingDay();
    const attemptExists = Boolean(getAttempt(day));
    if (!Number.isInteger(day) || day < 1 || day > WRITING_PLAN_DAYS || (!attemptExists && day > current)) {
      showToast("后续练习会在当前任务完成后解锁");
      return;
    }
    const plan = getWritingPlan(day);
    if (!plan) {
      showToast("写作目录尚未加载，请刷新页面重试", 3200);
      return;
    }
    if (!state.data.writingProgram.startedAt) state.data.writingProgram.startedAt = new Date().toISOString();
    state.currentWritingDay = day;
    state.data.lastWritingDay = day;
    const attempt = ensureAttempt(day);
    saveProgress();
    showView("writing");
    state.writingMaterialLoaded = false;
    elements.writingError.hidden = true;
    elements.submitWritingButton.disabled = true;
    elements.writingDraft.disabled = true;
    elements.saveIndicator.textContent = options.retry ? "正在重新加载" : "正在加载材料";
    elements.writingEyebrow.textContent = `DAY ${String(day).padStart(2, "0")} · ${plan.mode.id.toUpperCase()}`;
    elements.writingTitle.textContent = plan.scenario.title;
    elements.writingMeta.innerHTML = [plan.scenario.titleZh, plan.scenario.level, plan.scenario.focus, `目标${plan.target[0]}–${plan.target[1]}词`].map((value) => `<span>${escapeHtml(value)}</span>`).join("");
    try {
      const response = await fetch(plan.scenario.path, { cache: "no-store" });
      if (!response.ok) throw new Error(`Writing material failed: ${response.status}`);
      const sections = splitSections(await response.text());
      const required = [...WRITING_BASE_SECTIONS, plan.taskSection, plan.referenceSection];
      if (day === 1) required.push("Baseline Task", "Baseline Reference");
      if (day === WRITING_PLAN_DAYS) required.push("Final Task", "Final Reference");
      const missing = Array.from(new Set(required)).filter((section) => !sections[section]);
      if (missing.length) throw new Error(`Missing writing sections: ${missing.join(", ")}`);
      state.writingSections = sections;
      state.writingMaterialLoaded = true;
      renderWritingWorkspace(plan, attempt);
      startWritingTimer();
    } catch (error) {
      console.error(error);
      state.writingMaterialLoaded = false;
      elements.writingError.hidden = false;
      elements.submitWritingButton.disabled = true;
      elements.writingDraft.disabled = false;
      elements.saveIndicator.textContent = "材料加载失败，草稿仍可编辑";
      elements.writingDraft.value = attempt.draftText;
      updateWordCount();
    }
  }

  function renderWritingWorkspace(plan, attempt) {
    const sections = state.writingSections;
    const assessed = Boolean(attempt.assessment?.assessedAt);
    const submitted = Boolean(attempt.firstSubmission);
    elements.workplaceContext.innerHTML = renderMarkdown(sections["Workplace Context"]);
    elements.writingDataBrief.innerHTML = renderMarkdown(sections["Data Brief"]);
    elements.modelEmail.innerHTML = renderMarkdown(sections["Model Email"]);
    elements.languageToolkit.innerHTML = renderMarkdown(sections["Language Toolkit"]);
    elements.writingTask.innerHTML = renderMarkdown(sections[plan.taskSection]);
    elements.writingModeLabel.textContent = plan.day === 1 ? "BASELINE WRITING" : plan.day === WRITING_PLAN_DAYS ? "FINAL WRITING" : plan.mode.label;
    elements.writingTaskTitle.textContent = plan.day === 1 ? "15分钟基线写作" : plan.day === WRITING_PLAN_DAYS ? "第30天终测写作" : "今日写作任务";
    elements.writingTarget.textContent = `${plan.target[0]}–${plan.target[1]} words`;
    const showModel = plan.mode.id === "model" && plan.day !== 1 || assessed;
    elements.modelExampleCard.hidden = !showModel;
    const hideSupport = (plan.mode.id === "independent" || plan.day === 1) && !assessed;
    elements.languageSupport.hidden = hideSupport;
    elements.languageSupport.open = plan.mode.id === "model" && plan.day !== 1;
    elements.writingDraft.disabled = false;
    elements.writingDraft.value = attempt.draftText;
    elements.writingDraft.placeholder = submitted ? "Revise your first submission here…" : "Write your answer in English…";
    elements.saveIndicator.textContent = attempt.updatedAt ? "已从本地恢复草稿" : "草稿未修改";
    updateWordCount();
    updateTimerDisplay(attempt.activeSeconds);
    renderWritingPanels(plan, attempt);
  }

  function renderWritingPanels(plan, attempt) {
    const submitted = Boolean(attempt.firstSubmission);
    const assessed = Boolean(attempt.assessment?.assessedAt);
    elements.submitWritingButton.disabled = !state.writingMaterialLoaded || submitted;
    elements.submitWritingButton.innerHTML = submitted ? '首次版本已保存 <span aria-hidden="true">✓</span>' : '提交首次版本 <span aria-hidden="true">→</span>';
    elements.submissionPanel.hidden = !submitted;
    elements.rubricForm.hidden = !submitted;
    elements.referencePanel.hidden = !assessed;
    if (submitted) {
      elements.firstSubmissionText.textContent = attempt.firstSubmission.text;
      populateRubric(attempt.assessment);
    }
    if (assessed) {
      const sections = state.writingSections;
      let reference = renderMarkdown(sections[plan.referenceSection]);
      if (plan.day === 1) {
        reference += `<h3>进入训练前先观察范例</h3>${renderMarkdown(sections["Model Email"])}`;
      }
      elements.referenceAnswer.innerHTML = reference;
      elements.structureBreakdown.innerHTML = `<div class="markdown-body">${renderMarkdown(sections["Structure Breakdown"])}</div>`;
      elements.oralRetell.innerHTML = renderMarkdown(sections["Oral Retell"]);
      elements.modelExampleCard.hidden = false;
      elements.languageSupport.hidden = false;
      elements.saveAssessmentButton.textContent = "更新自评";
      elements.nextWritingButton.hidden = plan.day === WRITING_PLAN_DAYS;
      if (plan.day === WRITING_PLAN_DAYS) {
        elements.nextWritingButton.hidden = false;
        elements.nextWritingButton.innerHTML = '查看30天写作记录 <span aria-hidden="true">→</span>';
      } else {
        elements.nextWritingButton.innerHTML = '进入下一天 <span aria-hidden="true">→</span>';
      }
    } else {
      elements.saveAssessmentButton.textContent = "保存自评并查看参考版本";
    }
  }

  function onWritingInput() {
    updateWordCount();
    elements.saveIndicator.textContent = "正在保存…";
    clearTimeout(onWritingInput.timer);
    onWritingInput.timer = window.setTimeout(persistWritingDraft, 400);
  }

  function persistWritingDraft() {
    if (!elements.writingDraft || !state.data.writingProgram.startedAt || !Number.isInteger(state.currentWritingDay)) return;
    const attempt = getAttempt(state.currentWritingDay);
    if (!attempt) return;
    const value = safeText(elements.writingDraft.value, MAX_DRAFT_LENGTH);
    if (attempt.draftText === value && attempt.updatedAt) return;
    attempt.draftText = value;
    attempt.updatedAt = new Date().toISOString();
    if (saveProgress() && elements.saveIndicator) elements.saveIndicator.textContent = "已自动保存到当前浏览器";
    if (state.data.activeProgram === "writing") renderWritingStats();
  }

  function updateWordCount() {
    elements.wordCount.textContent = String(countEnglishWords(elements.writingDraft.value));
  }

  function countEnglishWords(value) {
    return (String(value).match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
  }

  function startWritingTimer() {
    pauseWritingTimer();
    const attempt = getAttempt(state.currentWritingDay);
    if (!attempt || attempt.firstSubmission || document.hidden || state.currentView !== "writing") return;
    state.timerLastTick = Date.now();
    state.timerInterval = window.setInterval(tickWritingTimer, 1000);
  }

  function tickWritingTimer() {
    const attempt = getAttempt(state.currentWritingDay);
    if (!attempt || attempt.firstSubmission || document.hidden || state.currentView !== "writing") {
      window.clearInterval(state.timerInterval);
      state.timerInterval = null;
      state.timerLastTick = null;
      return;
    }
    const now = Date.now();
    const delta = Math.min(5, Math.max(0, Math.floor((now - state.timerLastTick) / 1000)));
    if (delta > 0) {
      attempt.activeSeconds = Math.min(MAX_ACTIVE_SECONDS, attempt.activeSeconds + delta);
      state.timerLastTick = now;
      updateTimerDisplay(attempt.activeSeconds);
      if (attempt.activeSeconds % 15 === 0) saveProgress();
    }
  }

  function pauseWritingTimer() {
    const attempt = getAttempt(state.currentWritingDay);
    if (state.timerInterval && attempt && !attempt.firstSubmission && !document.hidden && state.currentView === "writing" && state.timerLastTick) {
      const delta = Math.min(5, Math.max(0, Math.floor((Date.now() - state.timerLastTick) / 1000)));
      attempt.activeSeconds = Math.min(MAX_ACTIVE_SECONDS, attempt.activeSeconds + delta);
      updateTimerDisplay(attempt.activeSeconds);
    }
    window.clearInterval(state.timerInterval);
    state.timerInterval = null;
    state.timerLastTick = null;
  }

  function onVisibilityChange() {
    if (document.hidden) {
      pauseWritingTimer();
      persistWritingDraft();
      persistAdvancedResponse();
    } else if (state.currentView === "writing") {
      startWritingTimer();
    }
  }

  function updateTimerDisplay(seconds) {
    const value = Math.max(0, Math.floor(seconds || 0));
    const minutes = String(Math.floor(value / 60)).padStart(2, "0");
    const remainder = String(value % 60).padStart(2, "0");
    elements.activeTimer.textContent = `${minutes}:${remainder}`;
  }

  function submitWriting() {
    const attempt = getAttempt(state.currentWritingDay);
    if (!attempt || attempt.firstSubmission || !state.writingMaterialLoaded) return;
    const text = safeText(elements.writingDraft.value, MAX_DRAFT_LENGTH);
    const words = countEnglishWords(text);
    if (words < 10) {
      showToast("至少先写10个英文词，目标字数只是提示，不会强制卡住", 3200);
      elements.writingDraft.focus();
      return;
    }
    if (!window.confirm("首次提交会保留为不可覆盖的快照。确认提交吗？")) return;
    pauseWritingTimer();
    attempt.draftText = text;
    attempt.updatedAt = new Date().toISOString();
    attempt.firstSubmission = {
      text,
      submittedAt: new Date().toISOString(),
      wordCount: words,
      activeSeconds: attempt.activeSeconds
    };
    saveProgress();
    renderWritingPanels(getWritingPlan(state.currentWritingDay), attempt);
    showToast("首次提交已保存，请完成五项自评");
    window.setTimeout(() => elements.rubricForm.querySelector("input")?.focus({ preventScroll: true }), 0);
  }

  function renderRubricFields() {
    elements.rubricFields.innerHTML = RUBRIC_ITEMS.map((item) => `
      <fieldset class="rubric-row">
        <legend><strong>${item.label}</strong><span>${item.help}</span></legend>
        <div class="score-options">
          ${[0, 1, 2].map((score) => `<label><input type="radio" name="${item.id}" value="${score}"><span>${score}</span></label>`).join("")}
        </div>
      </fieldset>
    `).join("");
  }

  function populateRubric(assessment) {
    RUBRIC_ITEMS.forEach((item) => {
      const value = assessment?.scores?.[item.id];
      elements.rubricForm.querySelector(`input[name="${item.id}"][value="${value}"]`)?.click();
    });
    elements.reflectionNote.value = assessment?.note || "";
    updateRubricTotal();
  }

  function onRubricChange() {
    updateRubricTotal();
    saveRubricDraft();
  }

  function collectRubricScores() {
    const scores = {};
    const formData = new FormData(elements.rubricForm);
    RUBRIC_ITEMS.forEach((item) => {
      const value = Number(formData.get(item.id));
      if (Number.isInteger(value) && value >= 0 && value <= 2) scores[item.id] = value;
    });
    return scores;
  }

  function updateRubricTotal() {
    const scores = collectRubricScores();
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    elements.rubricTotal.textContent = `当前 ${total} / 10 · 已评${Object.keys(scores).length}/5项`;
  }

  function saveRubricDraft() {
    const attempt = getAttempt(state.currentWritingDay);
    if (!attempt?.firstSubmission) return;
    const previousAssessedAt = attempt.assessment?.assessedAt || null;
    attempt.assessment = {
      scores: collectRubricScores(),
      note: safeText(elements.reflectionNote.value, MAX_NOTE_LENGTH),
      assessedAt: previousAssessedAt
    };
    saveProgress();
  }

  function submitAssessment(event) {
    event.preventDefault();
    const attempt = getAttempt(state.currentWritingDay);
    if (!attempt?.firstSubmission) return;
    const scores = collectRubricScores();
    if (!RUBRIC_ITEMS.every((item) => Object.prototype.hasOwnProperty.call(scores, item.id))) {
      showToast("五项都评分后才能查看参考版本", 3000);
      return;
    }
    const now = new Date().toISOString();
    const wasComplete = Boolean(attempt.completedAt);
    attempt.assessment = {
      scores,
      note: safeText(elements.reflectionNote.value, MAX_NOTE_LENGTH),
      assessedAt: attempt.assessment?.assessedAt || now
    };
    attempt.completedAt = attempt.completedAt || now;
    if (state.currentWritingDay === WRITING_PLAN_DAYS && countCompletedWritingDays() === WRITING_PLAN_DAYS) {
      state.data.writingProgram.completedAt = state.data.writingProgram.completedAt || now;
    }
    saveProgress();
    renderWritingPanels(getWritingPlan(state.currentWritingDay), attempt);
    renderWritingStats();
    if (!wasComplete) showToast("今日训练已完成，参考版本已解锁");
    elements.referencePanel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function openNextWriting() {
    persistWritingDraft();
    if (state.currentWritingDay === WRITING_PLAN_DAYS || isWritingProgramComplete()) {
      showView("records");
      return;
    }
    openWritingDay(getCurrentWritingDay());
  }

  function renderRecords() {
    if (!elements.recordsList) return;
    if (state.writingLoadError) {
      elements.recordsList.innerHTML = '<div class="error-state"><p>写作目录加载失败，请刷新页面后重试</p></div>';
      return;
    }
    if (!state.writingManifest.length) {
      elements.recordsList.innerHTML = '<div class="loading-state">正在加载写作记录…</div>';
      return;
    }
    renderBenchmark();
    const attempts = state.data.writingProgram.attempts;
    const hasAny = Object.values(attempts).some((attempt) => attempt.draftText || attempt.firstSubmission);
    if (!hasAny) {
      elements.recordsList.innerHTML = '<div class="empty-records"><strong>还没有写作记录</strong><span>开始第1天后，草稿和首次提交会显示在这里</span></div>';
      return;
    }
    elements.recordsList.innerHTML = state.writingManifest.map((scenario, scenarioIndex) => {
      const dayCards = WRITING_MODES.map((mode, modeIndex) => {
        const day = scenarioIndex * 3 + modeIndex + 1;
        const attempt = attempts[String(day)];
        const score = attempt?.assessment?.assessedAt ? assessmentTotal(attempt.assessment) : null;
        const status = attempt?.completedAt ? "已完成" : attempt?.firstSubmission ? "待自评" : attempt?.draftText ? "草稿中" : "未开始";
        const revision = attempt?.firstSubmission && attempt.draftText !== attempt.firstSubmission.text;
        return `<article class="record-card ${attempt?.completedAt ? "is-complete" : ""}">
          <div class="record-card-head">
            <div><span>DAY ${String(day).padStart(2, "0")} · ${mode.label}</span><strong>${status}</strong></div>
            <button class="secondary-button" type="button" data-writing-day="${day}" ${!attempt && day > getCurrentWritingDay() ? "disabled" : ""}>${attempt ? "打开记录" : day === getCurrentWritingDay() ? "开始" : "未解锁"}</button>
          </div>
          <div class="record-metrics">
            <span>首次字数 <strong>${attempt?.firstSubmission?.wordCount ?? "—"}</strong></span>
            <span>有效用时 <strong>${attempt?.firstSubmission ? formatDuration(attempt.firstSubmission.activeSeconds) : "—"}</strong></span>
            <span>自评 <strong>${score === null ? "—" : `${score}/10`}</strong></span>
          </div>
          ${attempt?.firstSubmission ? `<details class="record-text"><summary>查看首次提交${revision ? "与修改版" : ""}</summary><div><p>首次提交</p><pre data-record-first="${day}"></pre><button class="text-button" type="button" data-copy-day="${day}" data-copy-kind="first">复制首次提交</button></div>${revision ? `<div><p>当前修改版</p><pre data-record-revision="${day}"></pre><button class="text-button" type="button" data-copy-day="${day}" data-copy-kind="revision">复制修改版</button></div>` : ""}</details>` : ""}
        </article>`;
      }).join("");
      return `<section class="scenario-record"><div class="scenario-record-title"><span>${String(scenarioIndex + 1).padStart(2, "0")}</span><div><h2>${escapeHtml(scenario.titleZh)}</h2><p>${escapeHtml(scenario.focus)}</p></div></div><div class="scenario-days">${dayCards}</div></section>`;
    }).join("");
    Object.entries(attempts).forEach(([day, attempt]) => {
      const first = elements.recordsList.querySelector(`[data-record-first="${day}"]`);
      const revision = elements.recordsList.querySelector(`[data-record-revision="${day}"]`);
      if (first) first.textContent = attempt.firstSubmission?.text || "";
      if (revision) revision.textContent = attempt.draftText;
    });
  }

  function renderBenchmark() {
    const baseline = getAttempt(1);
    const final = getAttempt(WRITING_PLAN_DAYS);
    if (!baseline?.completedAt || !final?.completedAt) {
      elements.benchmarkPanel.innerHTML = '<p class="section-kicker">BASELINE VS FINAL</p><h2 id="benchmarkTitle">完成第1天和第30天后显示对比</h2><p>对比有效用时、目标字数和五项自评分，不把主观评分解释成客观考试成绩</p>';
      return;
    }
    const baseScore = assessmentTotal(baseline.assessment);
    const finalScore = assessmentTotal(final.assessment);
    elements.benchmarkPanel.innerHTML = `
      <p class="section-kicker">BASELINE VS FINAL</p>
      <h2 id="benchmarkTitle">第1天与第30天自我对比</h2>
      <div class="benchmark-grid">
        <div><span>有效用时</span><strong>${formatDuration(baseline.firstSubmission.activeSeconds)} → ${formatDuration(final.firstSubmission.activeSeconds)}</strong></div>
        <div><span>首次字数</span><strong>${baseline.firstSubmission.wordCount} → ${final.firstSubmission.wordCount}</strong></div>
        <div><span>自评总分</span><strong>${baseScore}/10 → ${finalScore}/10</strong></div>
      </div>
      <div class="rubric-comparison">${RUBRIC_ITEMS.map((item) => `<span>${item.label}<strong>${baseline.assessment.scores[item.id]} → ${final.assessment.scores[item.id]}</strong></span>`).join("")}</div>
      <p>这些变化用于复盘自己的写作过程，不等同于标准化英语考试结果</p>
    `;
  }

  function assessmentTotal(assessment) {
    return RUBRIC_ITEMS.reduce((sum, item) => sum + (Number(assessment?.scores?.[item.id]) || 0), 0);
  }

  function copyRecord(day, kind) {
    const attempt = getAttempt(day);
    if (!attempt) return;
    const text = kind === "revision" ? attempt.draftText : attempt.firstSubmission?.text;
    if (text) copyText(text, kind === "revision" ? "修改版已复制" : "首次提交已复制");
  }

  async function copyText(value, successMessage) {
    if (!value) {
      showToast("当前没有可复制的内容");
      return;
    }
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const helper = document.createElement("textarea");
        helper.value = value;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        if (!document.execCommand("copy")) throw new Error("Copy command failed");
        helper.remove();
      }
      showToast(successMessage);
    } catch (error) {
      console.warn("Copy failed", error);
      showToast("浏览器未允许复制，请在编辑器中手动选择文本", 3600);
    }
  }

  function formatDuration(seconds) {
    const value = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(value / 60);
    const remainder = value % 60;
    return minutes ? `${minutes}分${String(remainder).padStart(2, "0")}秒` : `${remainder}秒`;
  }

  function calculateWritingStreak() {
    const dates = new Set(Object.values(state.data.writingProgram.attempts).map((attempt) => attempt.completedAt).filter(Boolean).map((iso) => localDateKey(new Date(iso))));
    return calculateDateSetStreak(dates);
  }

  function calculateDateSetStreak(dates) {
    let streak = 0;
    const cursor = new Date();
    if (!dates.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (dates.has(localDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function onReadingTaskChange() {
    if (state.data.activeProgram !== "readingFoundation") return;
    const today = localDateKey(new Date());
    state.data.daily[today] = Array.from(elements.dailyTaskList.querySelectorAll("input:checked")).map((input) => input.value);
    saveProgress();
    updateReadingDailyPercent();
    renderReadingStats();
    if (isReadingDateComplete(today)) showToast("今日4项阅读任务已完成");
  }

  function updateReadingDailyPercent() {
    if (isReadingPlanFinished()) return;
    const today = localDateKey(new Date());
    const tasks = getReadingPlan()?.mode.tasks || READING_DAY_MODES[0].tasks;
    const required = new Set(tasks.map((task) => task.id));
    const count = (state.data.daily[today] || []).filter((id) => required.has(id)).length;
    elements.dailyPercent.textContent = `${Math.round((count / tasks.length) * 100)}%`;
    elements.dailyPercent.classList.toggle("is-complete", count === tasks.length);
  }

  function getReadingPlan(date = new Date()) {
    const articles = getFoundationArticles();
    if (!articles.length) return null;
    const day = getReadingPlanDay(date);
    const articleIndex = Math.min(articles.length - 1, Math.floor((day - 1) / READING_DAY_MODES.length));
    return { day, article: articles[articleIndex], mode: READING_DAY_MODES[(day - 1) % READING_DAY_MODES.length] };
  }

  function getReadingPlanDay(date = new Date()) {
    return Math.min(READING_PLAN_DAYS, Math.max(1, daysBetween(parseLocalDate(state.data.startedAt), date) + 1));
  }

  function isReadingPlanFinished(date = new Date()) {
    return daysBetween(parseLocalDate(state.data.startedAt), date) + 1 > READING_PLAN_DAYS;
  }

  function isReadingDateComplete(dateKey) {
    const date = parseLocalDate(dateKey);
    if (Number.isNaN(date.getTime())) return false;
    const rawDay = daysBetween(parseLocalDate(state.data.startedAt), date) + 1;
    if (rawDay < 1 || rawDay > READING_PLAN_DAYS) return false;
    const required = READING_DAY_MODES[(rawDay - 1) % READING_DAY_MODES.length].tasks.map((task) => task.id);
    const checked = new Set(state.data.daily[dateKey] || []);
    return required.every((id) => checked.has(id));
  }

  function countCompletedReadingDays() {
    const start = parseLocalDate(state.data.startedAt);
    let count = 0;
    for (let index = 0; index < READING_PLAN_DAYS; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      if (isReadingDateComplete(localDateKey(date))) count += 1;
    }
    return count;
  }

  function calculateReadingStreak() {
    let streak = 0;
    const cursor = new Date();
    if (!isReadingDateComplete(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (isReadingDateComplete(localDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function filteredItems() {
    return state.manifest.filter((item) => {
      const matchesLevel = state.activeLevel === "all" || item.level === state.activeLevel;
      const matchesModule = state.activeModule === "all" || item.module === state.activeModule;
      const isComplete = state.data.completed.includes(item.id);
      const matchesCompletion = state.completionFilter === "all" ||
        (item.type === "article" && (state.completionFilter === "complete" ? isComplete : !isComplete));
      const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
      const haystack = `${item.title || ""} ${item.titleZh || ""} ${tags} ${item.focus || ""} ${getAdvancedModuleTitle(item.module)}`.toLowerCase();
      return matchesLevel && matchesModule && matchesCompletion && (!state.query || haystack.includes(state.query));
    });
  }

  function renderLibrary() {
    if (!elements.libraryList) return;
    if (state.readingLoadError) {
      elements.libraryList.innerHTML = '<div class="error-box"><p>阅读目录加载失败</p><button class="secondary-button" id="retryManifestButton" type="button">重新加载</button></div>';
      elements.libraryCards.innerHTML = '<div class="error-state"><p>请检查网络后重新加载阅读目录</p></div>';
      document.getElementById("retryManifestButton")?.addEventListener("click", loadReadingManifest);
      return;
    }
    const items = filteredItems();
    elements.libraryList.innerHTML = items.length ? items.map((item) => {
      const done = state.data.completed.includes(item.id);
      const moduleTitle = getAdvancedModuleTitle(item.module);
      return `<button class="library-item ${state.currentItem?.id === item.id ? "is-current" : ""}" type="button" data-id="${escapeHtml(item.id)}"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.type === "framework" ? "学习框架" : `${item.level} · ${item.minutes}分钟${moduleTitle ? ` · ${moduleTitle}` : ""}`)}${done ? " · 已完成" : ""}</small></button>`;
    }).join("") : '<p class="empty-list">当前筛选下没有文章</p>';
    elements.libraryList.querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => openItem(button.dataset.id)));
    const articles = items.filter((item) => item.type === "article");
    elements.libraryCards.innerHTML = articles.length ? articles.map((item) => `
      <button class="article-card ${state.data.completed.includes(item.id) ? "is-complete" : ""}" type="button" data-id="${escapeHtml(item.id)}">
        <span class="article-card-number">${escapeHtml(item.order)}</span>
        <span><span class="card-title">${escapeHtml(item.title)}</span><span class="card-summary">${escapeHtml(item.summary)}</span><span class="card-meta"><span>${escapeHtml(item.level)}</span><span>${item.minutes}分钟</span><span>${escapeHtml(getAdvancedModuleTitle(item.module) || item.focus)}</span></span></span>
      </button>
    `).join("") : '<p class="empty-list">当前筛选下没有数据分析文章</p>';
    elements.libraryCards.querySelectorAll("[data-id]").forEach((button) => button.addEventListener("click", () => openItem(button.dataset.id)));
  }

  async function openItem(id, options = {}) {
    const item = state.manifest.find((entry) => entry.id === id);
    if (!item) return;
    state.currentItem = item;
    state.currentApplicationPrompt = "";
    state.currentAdvancedDay = Number.isInteger(options.advancedDay) ? options.advancedDay : null;
    state.articleLoaded = false;
    elements.advancedPracticePanel.hidden = true;
    state.data.lastOpened = id;
    const savedReader = options.resume && state.data.lastReader?.itemId === id ? state.data.lastReader : null;
    state.activeSection = item.type === "article" && savedReader?.section ? savedReader.section : "English Original";
    state.bilingual = item.type === "article" && Boolean(savedReader?.bilingual);
    elements.bilingualButton.setAttribute("aria-pressed", String(state.bilingual));
    updateLastReader({ itemId: id, section: state.activeSection, bilingual: state.bilingual, scrollY: savedReader?.scrollY || 0 });
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
        const missing = ARTICLE_SECTIONS.filter((section) => !state.currentSections[section]);
        if (missing.length) throw new Error(`Missing article sections: ${missing.join(", ")}`);
        if (item.track === "advanced") {
          state.currentApplicationPrompt = extractAdvancedApplicationPrompt(state.currentSections["Reading Questions"]);
          if (!state.currentApplicationPrompt || !state.currentSections["Reading Questions"].includes("### Answer Key")) {
            throw new Error("Advanced article is missing Workplace Application or Answer Key");
          }
        }
        elements.readerToolbar.hidden = false;
        renderSectionTabs();
        renderArticleSection();
      }
      state.articleLoaded = true;
      [elements.completeButton, elements.completeButtonBottom].forEach((button) => { button.disabled = false; });
      if (Number.isInteger(state.currentAdvancedDay)) renderAdvancedPracticePanel();
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
    elements.sectionTabs.innerHTML = ARTICLE_SECTIONS.map((section) => `<button id="tab-${section.replace(/\s+/g, "-").toLowerCase()}" type="button" role="tab" data-section="${section}" aria-controls="readerContent" aria-selected="${section === state.activeSection}" tabindex="${section === state.activeSection ? "0" : "-1"}">${SECTION_LABELS[section]}</button>`).join("");
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
      elements.readerContent.innerHTML = `<div class="bilingual-grid"><section class="bilingual-panel"><p class="panel-label">ENGLISH ORIGINAL</p><div class="markdown-body">${renderMarkdown(state.currentSections["English Original"] || "")}</div></section><section class="bilingual-panel"><p class="panel-label">中文翻译</p><div class="markdown-body">${renderMarkdown(state.currentSections["Chinese Translation"] || "")}</div></section></div>`;
      return;
    }
    elements.sectionTabs.querySelectorAll("button").forEach((button) => {
      const active = button.dataset.section === state.activeSection;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    elements.readerContent.setAttribute("aria-labelledby", `tab-${state.activeSection.replace(/\s+/g, "-").toLowerCase()}`);
    const source = state.currentSections[state.activeSection] || "## 内容缺失\n\n这部分内容尚未准备";
    if (state.activeSection === "Reading Questions" && source.includes("### Answer Key")) {
      const [questions, answers] = source.split("### Answer Key");
      elements.readerContent.innerHTML = `<div class="markdown-body">${renderMarkdown(questions)}<details><summary>查看参考答案</summary>${renderMarkdown(answers)}</details></div>`;
    } else {
      elements.readerContent.innerHTML = `<div class="markdown-body">${renderMarkdown(source)}</div>`;
    }
    if (state.activeSection === "Vocabulary") attachVocabularyButtons();
  }

  function renderAdvancedPracticePanel() {
    const plan = getAdvancedReadingPlan(state.currentAdvancedDay);
    const attempt = getAdvancedAttempt(state.currentAdvancedDay);
    if (!plan || !attempt || plan.article.id !== state.currentItem?.id || !state.articleLoaded) {
      elements.advancedPracticePanel.hidden = true;
      return;
    }
    const complete = Boolean(attempt.completedAt);
    elements.advancedPracticePanel.hidden = false;
    elements.advancedPracticeKicker.textContent = `DAY ${String(plan.day).padStart(2, "0")} · ${plan.mode.label}`;
    elements.advancedPracticeTitle.textContent = plan.mode.title;
    elements.advancedPracticeCopy.textContent = complete ? "本日训练已经完成，记录保持只读" : plan.mode.description;
    elements.advancedTaskList.innerHTML = plan.mode.tasks.map((task) => `
      <label class="daily-task">
        <input type="checkbox" value="${escapeHtml(task.id)}" ${attempt.tasks.includes(task.id) ? "checked" : ""} ${complete ? "disabled" : ""}>
        <span>${escapeHtml(task.label)}</span><small>${escapeHtml(task.time)}</small>
      </label>
    `).join("");
    elements.advancedResponseGroup.hidden = plan.mode.id !== "apply";
    if (plan.mode.id === "apply") {
      elements.advancedResponsePrompt.innerHTML = renderMarkdown(state.currentApplicationPrompt);
      const words = countEnglishWords(attempt.applicationText);
      elements.advancedTaskList.insertAdjacentHTML("beforeend", `<div class="daily-task task-requirement ${words >= 40 ? "is-requirement-met" : ""}"><span class="task-mark">${words >= 40 ? "✓" : "·"}</span><span>完成英文业务应用回答</span><small>${words}/40词</small></div>`);
      elements.advancedResponse.value = attempt.applicationText;
      elements.advancedResponse.disabled = complete;
      updateAdvancedResponseStatus(attempt.applicationText);
    } else {
      elements.advancedResponse.value = "";
      elements.advancedResponse.disabled = true;
    }
    elements.advancedSaveIndicator.textContent = complete ? "已完成" : attempt.updatedAt ? "已保存到当前浏览器" : "任务未修改";
    elements.completeAdvancedDayButton.disabled = complete || !isAdvancedAttemptReady(plan, attempt);
    elements.completeAdvancedDayButton.innerHTML = complete ? '本日已完成 <span aria-hidden="true">✓</span>' : '完成今日训练 <span aria-hidden="true">→</span>';
  }

  function extractAdvancedApplicationPrompt(source) {
    const marker = "### Workplace Application";
    const start = source.indexOf(marker);
    if (start < 0) return "";
    const afterMarker = source.slice(start + marker.length);
    return afterMarker.split("### Answer Key")[0].trim();
  }

  function onAdvancedTaskChange() {
    const plan = getAdvancedReadingPlan(state.currentAdvancedDay);
    const attempt = getAdvancedAttempt(state.currentAdvancedDay);
    if (!plan || !attempt || attempt.completedAt) return;
    const previous = cloneProgressData(state.data);
    attempt.tasks = Array.from(elements.advancedTaskList.querySelectorAll("input:checked")).map((input) => input.value);
    attempt.updatedAt = new Date().toISOString();
    if (!saveProgress()) {
      state.data = previous;
      renderAdvancedPracticePanel();
      return;
    }
    elements.advancedSaveIndicator.textContent = "已保存到当前浏览器";
    elements.completeAdvancedDayButton.disabled = !isAdvancedAttemptReady(plan, attempt);
  }

  function onAdvancedResponseInput() {
    const value = safeText(elements.advancedResponse.value, MAX_ADVANCED_RESPONSE_LENGTH);
    if (elements.advancedResponse.value !== value) elements.advancedResponse.value = value;
    updateAdvancedResponseStatus(value);
    elements.advancedSaveIndicator.textContent = "正在保存…";
    elements.completeAdvancedDayButton.disabled = true;
    clearTimeout(onAdvancedResponseInput.timer);
    onAdvancedResponseInput.timer = window.setTimeout(persistAdvancedResponse, 400);
  }

  function persistAdvancedResponse() {
    clearTimeout(onAdvancedResponseInput.timer);
    const plan = getAdvancedReadingPlan(state.currentAdvancedDay);
    const attempt = getAdvancedAttempt(state.currentAdvancedDay);
    if (!plan || plan.mode.id !== "apply" || !attempt || attempt.completedAt || !elements.advancedResponse) return true;
    const value = safeText(elements.advancedResponse.value, MAX_ADVANCED_RESPONSE_LENGTH);
    if (attempt.applicationText === value && attempt.updatedAt) {
      elements.advancedSaveIndicator.textContent = "已保存到当前浏览器";
      elements.completeAdvancedDayButton.disabled = !isAdvancedAttemptReady(plan, attempt);
      return true;
    }
    const previousText = attempt.applicationText;
    const previousUpdatedAt = attempt.updatedAt;
    attempt.applicationText = value;
    attempt.updatedAt = new Date().toISOString();
    if (!saveProgress()) {
      attempt.applicationText = previousText;
      attempt.updatedAt = previousUpdatedAt;
      elements.advancedSaveIndicator.textContent = "尚未保存，请继续编辑后重试";
      elements.completeAdvancedDayButton.disabled = true;
      return false;
    }
    elements.advancedSaveIndicator.textContent = "已自动保存到当前浏览器";
    elements.completeAdvancedDayButton.disabled = !isAdvancedAttemptReady(plan, attempt);
    renderAdvancedApplicationRequirement(attempt);
    return true;
  }

  function updateAdvancedResponseStatus(value) {
    const words = countEnglishWords(value);
    elements.advancedResponseCount.textContent = String(words);
    elements.advancedResponseHint.textContent = words < 40 ? `还需${40 - words}词` : words > 80 ? "已超过建议80词，可继续完成" : "已达到建议范围";
  }

  function renderAdvancedApplicationRequirement(attempt) {
    const requirement = elements.advancedTaskList.querySelector(".task-requirement");
    if (!requirement) return;
    const words = countEnglishWords(attempt.applicationText);
    requirement.classList.toggle("is-requirement-met", words >= 40);
    requirement.querySelector(".task-mark").textContent = words >= 40 ? "✓" : "·";
    requirement.querySelector("small").textContent = `${words}/40词`;
  }

  function isAdvancedAttemptReady(plan, attempt) {
    if (!plan || !attempt || attempt.completedAt) return false;
    const tasksComplete = plan.mode.tasks.every((task) => attempt.tasks.includes(task.id));
    return tasksComplete && (plan.mode.id !== "apply" || countEnglishWords(attempt.applicationText) >= 40);
  }

  function completeAdvancedReadingDay() {
    const plan = getAdvancedReadingPlan(state.currentAdvancedDay);
    const attempt = getAdvancedAttempt(state.currentAdvancedDay);
    if (!plan || !attempt || attempt.completedAt) return;
    if (plan.mode.id === "apply" && !persistAdvancedResponse()) return;
    if (!isAdvancedAttemptReady(plan, attempt)) {
      const words = countEnglishWords(attempt.applicationText);
      showToast(plan.mode.id === "apply" && words < 40 ? `英文回答还需要${40 - words}词` : "完成全部训练项目后才能进入下一天", 2800);
      return;
    }
    const previous = cloneProgressData(state.data);
    const completedAt = new Date().toISOString();
    attempt.completedAt = completedAt;
    attempt.updatedAt = completedAt;
    if (plan.mode.id === "apply" && !state.data.completed.includes(plan.article.id)) state.data.completed.push(plan.article.id);
    if (countCompletedAdvancedReadingDays() === ADVANCED_READING_PLAN_DAYS) state.data.advancedReadingProgram.completedAt = completedAt;
    if (!saveProgress()) {
      state.data = previous;
      renderAdvancedPracticePanel();
      return;
    }
    showToast(plan.day === ADVANCED_READING_PLAN_DAYS ? "60天进阶阅读已完成" : `第${plan.day}天已完成`);
    showView("dashboard");
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
    const lines = String(markdown || "").replace(/\r/g, "").split("\n");
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
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index].trim();
      if (!line) { flushParagraph(); closeList(); continue; }
      if (line.startsWith("|") && lines[index + 1]?.trim().match(/^\|?\s*:?-+/)) {
        flushParagraph(); closeList();
        const headers = tableCells(line);
        index += 2;
        const rows = [];
        while (index < lines.length && lines[index].trim().startsWith("|")) { rows.push(tableCells(lines[index].trim())); index += 1; }
        index -= 1;
        html.push(`<table><thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
        continue;
      }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) { flushParagraph(); closeList(); html.push(`<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`); continue; }
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
    let safe = escapeHtml(value).replace(/`([^`]+)`/g, (_, content) => {
      code.push(`<code>${content}</code>`);
      return `%%CODE${code.length - 1}%%`;
    });
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
    if (state.data.activeProgram === "readingFoundation") renderReadingStats();
    showToast(exists ? `已移出词汇：${word}` : `已掌握：${word}`);
  }

  function toggleCurrentComplete() {
    if (!state.currentItem || !state.articleLoaded) return;
    const id = state.currentItem.id;
    const exists = state.data.completed.includes(id);
    state.data.completed = exists ? state.data.completed.filter((item) => item !== id) : [...state.data.completed, id];
    const todayPlan = getReadingPlan();
    if (state.currentItem.type === "article" && todayPlan?.article.id === id && todayPlan.mode.id === "learn") {
      const today = localDateKey(new Date());
      const tasks = new Set(state.data.daily[today] || []);
      if (exists) tasks.delete("read");
      else tasks.add("read");
      state.data.daily[today] = Array.from(tasks);
    }
    saveProgress();
    updateCompleteButtons();
    renderLibrary();
    if (state.data.activeProgram === "readingFoundation") renderReadingStats();
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

  function changeFont(delta) {
    state.fontScale = Math.min(1.3, Math.max(0.8, Number((state.fontScale + delta).toFixed(1))));
    state.data.fontScale = state.fontScale;
    saveProgress();
    document.documentElement.style.setProperty("--reader-scale", state.fontScale);
    showToast(`正文字号 ${Math.round(state.fontScale * 100)}%`);
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
    pauseWritingTimer();
    persistWritingDraft();
    persistAdvancedResponse();
    saveReaderPosition({ type: "beforeunload" });
    const payload = { app: "Metric English", schemaVersion: STORAGE_SCHEMA, exportedAt: new Date().toISOString(), data: state.data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `metric-english-progress-${localDateKey(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    if (state.currentView === "writing") startWritingTimer();
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
      if (!window.confirm("导入会覆盖当前浏览器中的阅读、写作和草稿进度。确认继续吗？")) return;
      pauseWritingTimer();
      persistAdvancedResponse();
      const previous = state.data;
      state.data = imported;
      state.fontScale = imported.fontScale;
      document.documentElement.style.setProperty("--reader-scale", state.fontScale);
      state.data.lastView = "dashboard";
      if (!saveProgress()) {
        state.data = previous;
        state.fontScale = previous.fontScale;
        document.documentElement.style.setProperty("--reader-scale", state.fontScale);
        return;
      }
      state.currentAdvancedDay = getCurrentAdvancedReadingDay();
      elements.advancedPracticePanel.hidden = true;
      renderAll();
      showView("dashboard");
      showToast("学习进度导入成功", 2800);
    } catch (error) {
      console.error("Progress import failed", error);
      showToast("导入失败：不是有效的Metric English进度文件", 3600);
    }
  }

  function showToast(message, duration = 1800) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.classList.remove("is-visible"), duration);
  }

  function debounce(callback, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => callback.apply(this, args), wait);
    };
  }

  function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseLocalDate(value) {
    const [year, month, day] = String(value).split("-").map(Number);
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
