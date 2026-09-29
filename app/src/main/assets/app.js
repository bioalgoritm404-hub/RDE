/**
 * RDE Core Application Engine
 */

// --- 1. LOCALIZATION DICTIONARY ---
const I18N = {
  en: {
    explorer: "EXPLORER",
    newFile: "New File",
    openFile: "Open Device File",
    saveFile: "Save to Downloads",
    saveAs: "Save As...",
    rename: "Rename",
    delete: "Delete",
    run: "RUN",
    preview: "PREVIEW",
    running: "RUNNING",
    clear: "Clear Console",
    toggleConsole: "Toggle Console",
    output: "OUTPUT",
    terminal: "TERMINAL (REPL)",
    type: "Type",
    hide: "Hide",
    settingsTitle: "Settings",
    themeTitle: "Color Theme",
    kbTitle: "Keyboard Mode",
    langTitle: "Language",
    searchTitle: "Search & Replace",
    confirmDelete: "Delete file",
    enterNewName: "Enter new filename for",
    enterFileName: "Enter new filename (e.g. script.py or page.html):"
  },
  ru: {
    explorer: "ПРОВОДНИК",
    newFile: "Новый файл",
    openFile: "Открыть файл с телефона",
    saveFile: "Сохранить в Downloads",
    saveAs: "Сохранить как...",
    rename: "Переименовать",
    delete: "Удалить",
    run: "ПУСК",
    preview: "ПРОСМОТР",
    running: "РАБОТАЕТ",
    clear: "Очистить консоль",
    toggleConsole: "Консоль вывода",
    output: "ВЫВОД",
    terminal: "ТЕРМИНАЛ (REPL)",
    type: "Ввод",
    hide: "Скрыть",
    settingsTitle: "Настройки",
    themeTitle: "Цветовая тема",
    kbTitle: "Режим клавиатуры",
    langTitle: "Язык интерфейса",
    searchTitle: "Поиск и замена",
    confirmDelete: "Удалить файл",
    enterNewName: "Введите новое имя для",
    enterFileName: "Имя нового файла (например script.py или page.html):"
  }
};

// --- 2. SETTINGS STATE ---
const SETTINGS_KEY = "rde_user_settings_v3";
let appSettings = loadAppSettings();

function loadAppSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        theme: parsed.theme || "cyberfox",
        keyboardMode: parsed.keyboardMode || "builtin",
        language: parsed.language || "ru",
        lofiEnabled: parsed.lofiEnabled !== false,
        showWelcomeOnStartup: parsed.showWelcomeOnStartup !== false
      };
    }
  } catch (e) {
    console.warn("Settings load error:", e);
  }
  return { theme: "cyberfox", keyboardMode: "builtin", language: "ru", lofiEnabled: true, showWelcomeOnStartup: true };
}

function saveAppSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
  } catch (e) {
    console.warn("Settings save error:", e);
  }
  applyAppSettings();
}

function applyAppSettings() {
  document.body.className = appSettings.theme === "cyberfox" ? "theme-cyberfox" : "theme-vscode";
  const t = I18N[appSettings.language] || I18N.ru;

  document.getElementById("lbl-explorer").textContent = t.explorer;
  updateRunButtonLabel();
  document.getElementById("ptab-output").textContent = t.output;
  document.getElementById("ptab-terminal").textContent = t.terminal;
  document.getElementById("lbl-settings-title").textContent = t.settingsTitle;
  document.getElementById("lbl-theme-title").textContent = t.themeTitle;
  document.getElementById("lbl-kb-title").textContent = t.kbTitle;
  document.getElementById("lbl-lang-title").textContent = t.langTitle;

  document.getElementById("opt-theme-vscode").classList.toggle("active", appSettings.theme === "vscode");
  document.getElementById("opt-theme-cyberfox").classList.toggle("active", appSettings.theme === "cyberfox");
  document.getElementById("opt-kb-system").classList.toggle("active", appSettings.keyboardMode === "system");
  document.getElementById("opt-kb-builtin").classList.toggle("active", appSettings.keyboardMode === "builtin");
  document.getElementById("opt-lang-ru").classList.toggle("active", appSettings.language === "ru");
  document.getElementById("opt-lang-en").classList.toggle("active", appSettings.language === "en");

  updateKeyboardToggleBtn();
  if (window.editor && window.editor.refresh) setTimeout(() => window.editor.refresh(), 30);
}

// --- 3. STARTER FILES & STORAGE ---
const DEFAULT_PYTHON = `"""
═══════════════════════════════════════════════════════
   RayVen Development Environment (RDE)
   Python & Web Multi-Engine IDE
═══════════════════════════════════════════════════════
"""
import sys
import math

RAVEN_ART = r"""
        __
       /\\\\ ,\\__
      |    .0 )_
      \\__   _/  )
       /  \\    /
      /    \\  /
     (   /\\ \\/
      \\  \\ \\  \\
       \\__\\ \\__\\
    ═══════════════════════════════════
       R A Y V E N   D E V   I D E
    ═══════════════════════════════════
"""

def main():
    print(RAVEN_ART)
    print(f"[RDE] Python version: {sys.version.split()[0]}")
    print("[RDE] Real-time Wasm execution ready!")
    print("-" * 45)
    numbers = [12, 45, 78, 23, 56, 89, 90, 34]
    print(f"Numbers: {numbers}")
    print(f"Sum: {sum(numbers)}, Max: {max(numbers)}, Mean: {sum(numbers)/len(numbers):.2f}")
    primes = [n for n in range(2, 50) if all(n % d != 0 for d in range(2, int(math.isqrt(n)) + 1))]
    print(f"Primes up to 50: {primes}")

main()
`;

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      background: #121216;
      color: #ffffff;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: #1e1e24;
      border: 1px solid #ff6600;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(255, 102, 0, 0.3);
    }
    button {
      background: #ff6600;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 15px;
    }
    button:active { transform: scale(0.95); }
  </style>
</head>
<body>
  <div class="card">
    <h2>RayVen Web Preview</h2>
    <p>Live HTML + CSS + JS is working seamlessly!</p>
    <button onclick="greet()">Click Me</button>
    <p id="msg" style="color: #00e5ff; margin-top: 10px;"></p>
  </div>
  <script>
    function greet() {
      document.getElementById('msg').textContent = 'Hello from RDE Web Engine! Time: ' + new Date().toLocaleTimeString();
    }
  </script>
</body>
</html>
`;

const STORAGE_KEY = "rde_virtual_files_v7";
const ACTIVE_FILE_KEY = "rde_active_filename_v3";
let files = loadStoredFiles();
let currentFileName = localStorage.getItem(ACTIVE_FILE_KEY) || "main.py";
if (!files[currentFileName]) {
  currentFileName = Object.keys(files)[0] || "main.py";
  if (!files[currentFileName]) {
    files[currentFileName] = DEFAULT_PYTHON;
  }
}

let editor = null;
let pyodideInstance = null;
let isPyodideLoading = true;
let isExecuting = false;
let isShiftActive = false;
let isCtrlActive = false;
let isKeyboardOpen = false;

// Search State
let searchCursor = null;
let currentSearchMatches = [];
let currentSearchIndex = -1;
let isCaseSensitive = false;

const BRACKET_PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };

function loadStoredFiles() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Storage load error:", e);
  }
  return { "main.py": DEFAULT_PYTHON, "demo.html": DEFAULT_HTML };
}

function saveStoredFiles(f) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
    localStorage.setItem(ACTIVE_FILE_KEY, currentFileName);
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

// --- 4. REAL DEVICE FILE & FOLDER INTEGRATION (OPEN / SAVE TO DOWNLOADS) ---
function setupDeviceFileIntegration() {
  const fileInput = document.getElementById("device-file-input");
  const folderInput = document.getElementById("device-folder-input");

  // Open single file from phone memory
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const fileName = file.name;
      files[fileName] = content;
      saveStoredFiles(files);
      switchToFile(fileName);
      appendOutputText(`[Opened] Loaded ${fileName} from device storage.\n`, "info");
      if (window.AndroidBridge && typeof window.AndroidBridge.showToast === "function") {
        window.AndroidBridge.showToast(`Opened: ${fileName}`);
      }
    };
    reader.readAsText(file);
    fileInput.value = "";
  });

  // Open whole folder/workspace from device
  if (folderInput) {
    folderInput.addEventListener("change", (e) => {
      const selectedFiles = Array.from(e.target.files);
      if (!selectedFiles || selectedFiles.length === 0) return;

      let loadedCount = 0;
      let firstFileToOpen = null;

      selectedFiles.forEach(file => {
        const path = file.webkitRelativePath || file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
          files[path] = event.target.result;
          loadedCount++;
          if (!firstFileToOpen && (path.endsWith(".py") || path.endsWith(".html"))) {
            firstFileToOpen = path;
          }
          if (loadedCount === selectedFiles.length) {
            saveStoredFiles(files);
            switchToFile(firstFileToOpen || path);
            appendOutputText(`[Workspace] Opened folder with ${selectedFiles.length} files.\n`, "success");
            if (window.AndroidBridge && typeof window.AndroidBridge.showToast === "function") {
              window.AndroidBridge.showToast(`Workspace: ${selectedFiles.length} files loaded`);
            }
          }
        };
        reader.readAsText(file);
      });
      folderInput.value = "";
    });
  }

  // Open file button trigger
  document.getElementById("btn-open-device-file")?.addEventListener("click", () => {
    fileInput.click();
  });

  // Open folder button trigger (SAF Android Directory Picker)
  document.getElementById("btn-open-device-folder")?.addEventListener("click", () => {
    if (window.AndroidBridge && typeof window.AndroidBridge.openDirectoryPicker === "function") {
      window.AndroidBridge.openDirectoryPicker();
    } else {
      folderInput ? folderInput.click() : fileInput.click();
    }
  });

  // Save current file button
  document.getElementById("btn-save-device-file")?.addEventListener("click", () => {
    saveCurrentFileToDevice(currentFileName);
  });
}

// Native SAF Folder Loaded Callback from Android Kotlin
window.onNativeFolderLoaded = function(rootName, filesMap) {
  if (!filesMap || typeof filesMap !== "object") return;
  const keys = Object.keys(filesMap);
  if (keys.length === 0) return;

  files = filesMap;
  saveStoredFiles(files);

  const firstToOpen = keys.find(k => k.endsWith(".py") || k.endsWith(".html")) || keys[0];
  switchToFile(firstToOpen);
  hideWelcomeView();

  appendOutputText(`[Workspace] Opened folder: ${rootName} (${keys.length} files)\n`, "success");
  if (window.AndroidBridge && typeof window.AndroidBridge.showToast === "function") {
    window.AndroidBridge.showToast(`Workspace: ${rootName} (${keys.length} files)`);
  }
};

function saveCurrentFileToDevice(targetName) {
  const content = editor ? editor.getValue() : (files[currentFileName] || "");
  files[targetName] = content;
  saveStoredFiles(files);

  if (window.AndroidBridge && typeof window.AndroidBridge.saveFileToDownloads === "function") {
    window.AndroidBridge.saveFileToDownloads(targetName, content);
  } else {
    // Browser fallback download
    try {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = targetName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      appendOutputText(`[Saved] Exported ${targetName} to Downloads.\n`, "success");
    } catch (e) {
      appendOutputText(`[Error] Failed to save file: ${e.message}\n`, "stderr");
    }
  }
}

// --- 5. RUN / HTML PREVIEW DISPATCHER ---
function updateRunButtonLabel() {
  const runBtn = document.getElementById("btn-run-code");
  const runLabel = document.getElementById("run-label");
  const runIcon = document.getElementById("run-icon");
  const t = I18N[appSettings.language] || I18N.ru;

  const isHtml = currentFileName.toLowerCase().endsWith(".html");
  if (isHtml) {
    runBtn.classList.add("preview-mode");
    runIcon.innerHTML = ICONS.previewGlobe;
    runLabel.textContent = t.preview;
  } else {
    runBtn.classList.remove("preview-mode");
    runIcon.innerHTML = isExecuting ? ICONS.refresh : ICONS.play;
    runLabel.textContent = isExecuting ? t.running : t.run;
  }
}

function handleRunOrPreview() {
  if (currentFileName.toLowerCase().endsWith(".html")) {
    openHtmlLivePreview();
  } else {
    runCode();
  }
}

function openHtmlLivePreview() {
  const modal = document.getElementById("preview-modal");
  const iframe = document.getElementById("preview-iframe");
  const title = document.getElementById("preview-url-title");
  const code = editor ? editor.getValue() : (files[currentFileName] || "");

  title.textContent = `file://${currentFileName}`;
  iframe.srcdoc = code;
  modal.style.display = "flex";
}

// --- 6. SEARCH & REPLACE ENGINE ---
function setupSearchReplace() {
  const bar = document.getElementById("search-replace-bar");
  const queryInput = document.getElementById("sr-query");
  const replaceInput = document.getElementById("sr-replace");
  const counter = document.getElementById("sr-counter");
  const btnCase = document.getElementById("sr-btn-case");

  document.getElementById("btn-toggle-search").addEventListener("click", () => {
    const isVisible = bar.style.display === "flex";
    bar.style.display = isVisible ? "none" : "flex";
    if (!isVisible) {
      queryInput.focus();
      queryInput.select();
      performSearch();
    } else {
      clearSearchMarkers();
    }
  });

  document.getElementById("sr-btn-close").addEventListener("click", () => {
    bar.style.display = "none";
    clearSearchMarkers();
  });

  btnCase.addEventListener("click", () => {
    isCaseSensitive = !isCaseSensitive;
    btnCase.classList.toggle("active", isCaseSensitive);
    performSearch();
  });

  queryInput.addEventListener("input", performSearch);
  queryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.shiftKey ? findPrev() : findNext();
    }
  });

  document.getElementById("sr-btn-next").addEventListener("click", findNext);
  document.getElementById("sr-btn-prev").addEventListener("click", findPrev);

  document.getElementById("sr-btn-replace").addEventListener("click", () => {
    if (!editor || !editor.getSearchCursor) return;
    const query = queryInput.value;
    if (!query) return;

    if (editor.somethingSelected()) {
      editor.replaceSelection(replaceInput.value);
      findNext();
    } else {
      findNext();
      if (editor.somethingSelected()) {
        editor.replaceSelection(replaceInput.value);
      }
    }
  });

  document.getElementById("sr-btn-replace-all").addEventListener("click", () => {
    if (!editor || !editor.getSearchCursor) return;
    const query = queryInput.value;
    if (!query) return;
    const replacement = replaceInput.value;

    let count = 0;
    const cursor = editor.getSearchCursor(query, { line: 0, ch: 0 }, { caseFold: !isCaseSensitive });
    while (cursor.findNext()) {
      cursor.replace(replacement);
      count++;
    }
    performSearch();
    appendOutputText(`[Search] Replaced ${count} occurrences of "${query}".\n`, "info");
  });
}

function clearSearchMarkers() {
  if (!editor || !editor.getAllMarks) return;
  editor.getAllMarks().forEach(m => m.clear());
  currentSearchMatches = [];
  currentSearchIndex = -1;
  const counter = document.getElementById("sr-counter");
  if (counter) counter.textContent = "0/0";
}

function performSearch() {
  clearSearchMarkers();
  const query = document.getElementById("sr-query").value;
  const counter = document.getElementById("sr-counter");
  if (!query || !editor || !editor.getSearchCursor) {
    if (counter) counter.textContent = "0/0";
    return;
  }

  const cursor = editor.getSearchCursor(query, { line: 0, ch: 0 }, { caseFold: !isCaseSensitive });
  while (cursor.findNext()) {
    const from = cursor.from();
    const to = cursor.to();
    const mark = editor.markText(from, to, { className: "cm-searching" });
    currentSearchMatches.push({ from, to, mark });
  }

  if (currentSearchMatches.length > 0) {
    currentSearchIndex = 0;
    highlightCurrentMatch();
  } else {
    counter.textContent = "0/0";
  }
}

function highlightCurrentMatch() {
  const counter = document.getElementById("sr-counter");
  if (currentSearchMatches.length === 0 || currentSearchIndex < 0) {
    if (counter) counter.textContent = "0/0";
    return;
  }

  const match = currentSearchMatches[currentSearchIndex];
  counter.textContent = `${currentSearchIndex + 1}/${currentSearchMatches.length}`;
  editor.setSelection(match.from, match.to);
  editor.scrollIntoView(match.from, 40);
}

function findNext() {
  if (currentSearchMatches.length === 0) return;
  currentSearchIndex = (currentSearchIndex + 1) % currentSearchMatches.length;
  highlightCurrentMatch();
}

function findPrev() {
  if (currentSearchMatches.length === 0) return;
  currentSearchIndex = (currentSearchIndex - 1 + currentSearchMatches.length) % currentSearchMatches.length;
  highlightCurrentMatch();
}

// --- 7. KEYBOARD CONTROLLER ---
function updateKeyboardToggleBtn() {
  const kbBtn = document.getElementById("btn-toggle-keyboard");
  const kbText = document.getElementById("kb-btn-text");
  const t = I18N[appSettings.language] || I18N.ru;
  if (kbBtn && kbText) {
    kbBtn.classList.toggle("active", isKeyboardOpen);
    kbText.textContent = isKeyboardOpen ? t.hide : t.type;
  }
}

function toggleKeyboard() {
  setKeyboardOpen(!isKeyboardOpen);
}

function setKeyboardOpen(open) {
  isKeyboardOpen = open;
  updateKeyboardToggleBtn();

  const vk = document.getElementById("rde-virtual-keyboard");
  const input = editor && editor.getInputField ? editor.getInputField() : document.getElementById("code-editor-fallback");

  if (appSettings.keyboardMode === "builtin") {
    if (input) input.setAttribute("inputmode", "none");
    vk.style.display = open ? "flex" : "none";
  } else {
    vk.style.display = "none";
    if (input) {
      if (open) {
        input.setAttribute("inputmode", "text");
        input.focus();
      } else {
        input.setAttribute("inputmode", "none");
        input.blur();
      }
    }
  }

  if (editor && editor.refresh) {
    setTimeout(() => {
      editor.refresh();
      if (open && editor.scrollIntoView) {
        editor.scrollIntoView(editor.getCursor(), 30);
      }
    }, 50);
  }
}

// --- 8. VIRTUAL KEYBOARD ACTIONS ---
function setupVirtualKeyboard() {
  document.querySelectorAll(".vk-btn[data-key]").forEach(btn => {
    btn.addEventListener("click", () => {
      let char = btn.getAttribute("data-key");
      if (isShiftActive && char.length === 1) {
        char = char.toUpperCase();
        setShiftActive(false);
      }
      if (isCtrlActive) {
        handleCtrlShortcut(char.toLowerCase());
        setCtrlActive(false);
        return;
      }
      insertTextIntoEditor(char);
    });
  });

  document.querySelectorAll(".vk-btn[data-insert]").forEach(btn => {
    btn.addEventListener("click", () => {
      insertTextIntoEditor(btn.getAttribute("data-insert"));
    });
  });

  document.querySelectorAll(".vk-btn[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      handleVirtualAction(btn.getAttribute("data-action"));
    });
  });
}

function setShiftActive(active) {
  isShiftActive = active;
  const btn = document.getElementById("vk-shift-btn");
  if (btn) btn.classList.toggle("active", active);
  document.querySelectorAll(".vk-btn[data-key]").forEach(b => {
    const k = b.getAttribute("data-key");
    if (k && k.length === 1 && k >= 'a' && k <= 'z') {
      b.textContent = active ? k.toUpperCase() : k.toLowerCase();
    }
  });
}

function setCtrlActive(active) {
  isCtrlActive = active;
  const btn = document.getElementById("vk-ctrl-btn");
  if (btn) btn.classList.toggle("active", active);
}

function handleCtrlShortcut(key) {
  if (!editor) return;
  if (key === "z") { if (editor.undo) editor.undo(); }
  else if (key === "y") { if (editor.redo) editor.redo(); }
  else if (key === "f") { document.getElementById("btn-toggle-search").click(); }
  else if (key === "a") {
    if (editor.setSelection && editor.lineCount) {
      editor.setSelection({ line: 0, ch: 0 }, { line: editor.lineCount(), ch: 0 });
    }
  }
  else if (key === "c") { document.getElementById("btn-copy-sel").click(); }
  else if (key === "v") { document.getElementById("btn-paste-sel").click(); }
}

function handleVirtualAction(action) {
  if (!editor) return;
  if (action === "backspace") {
    handleBackspace(editor);
  } else if (action === "enter") {
    if (typeof CodeMirror !== "undefined" && editor instanceof CodeMirror) {
      CodeMirror.commands.newlineAndIndent(editor);
    } else {
      insertTextIntoEditor("\n");
    }
  } else if (action === "tab") {
    insertTextIntoEditor("    ");
  } else if (action === "space") {
    insertTextIntoEditor(" ");
  } else if (action === "shift") {
    setShiftActive(!isShiftActive);
  } else if (action === "ctrl") {
    setCtrlActive(!isCtrlActive);
  } else if (action === "left") {
    if (editor.getCursor && editor.setCursor) {
      const c = editor.getCursor();
      if (c.ch > 0) editor.setCursor({ line: c.line, ch: c.ch - 1 });
      else if (c.line > 0) editor.setCursor({ line: c.line - 1, ch: editor.getLine(c.line - 1).length });
    }
  } else if (action === "right") {
    if (editor.getCursor && editor.setCursor) {
      const c = editor.getCursor();
      const lineLen = editor.getLine(c.line).length;
      if (c.ch < lineLen) editor.setCursor({ line: c.line, ch: c.ch + 1 });
      else if (c.line < editor.lineCount() - 1) editor.setCursor({ line: c.line + 1, ch: 0 });
    }
  } else if (action === "up") {
    if (editor.getCursor && editor.setCursor) {
      const c = editor.getCursor();
      if (c.line > 0) editor.setCursor({ line: c.line - 1, ch: Math.min(c.ch, editor.getLine(c.line - 1).length) });
    }
  } else if (action === "down") {
    if (editor.getCursor && editor.setCursor) {
      const c = editor.getCursor();
      if (c.line < editor.lineCount() - 1) editor.setCursor({ line: c.line + 1, ch: Math.min(c.ch, editor.getLine(c.line + 1).length) });
    }
  } else if (action === "hide_kb") {
    setKeyboardOpen(false);
  } else if (action.startsWith("pair_")) {
    const pairMap = { pair_paren: "()", pair_brack: "[]", pair_brace: "{}", pair_dquote: '""', pair_squote: "''" };
    insertPair(pairMap[action]);
  }
}

function insertTextIntoEditor(text) {
  if (!editor) return;
  editor.replaceSelection(text);
  if (editor.focus) editor.focus();
}

function insertPair(pair) {
  if (!editor || !pair) return;
  if (editor.somethingSelected && editor.somethingSelected()) {
    const sel = editor.getSelection();
    editor.replaceSelection(pair[0] + sel + pair[1]);
  } else {
    editor.replaceSelection(pair);
    if (editor.getCursor && editor.setCursor) {
      const c = editor.getCursor();
      editor.setCursor({ line: c.line, ch: c.ch - 1 });
    }
  }
  if (editor.focus) editor.focus();
}

function handleBackspace(cm) {
  if (cm.somethingSelected && cm.somethingSelected()) {
    cm.replaceSelection("");
    return;
  }
  const cur = cm.getCursor();
  if (cur.ch === 0 && cur.line > 0) {
    const prevLine = cm.getLine(cur.line - 1);
    const prevLen = prevLine.length;
    cm.replaceRange("", { line: cur.line - 1, ch: prevLen }, { line: cur.line, ch: 0 });
    cm.setCursor({ line: cur.line - 1, ch: prevLen });
  } else {
    if (typeof CodeMirror !== "undefined" && cm instanceof CodeMirror) {
      CodeMirror.commands.delCharBefore(cm);
    } else {
      const el = document.getElementById("code-editor-fallback");
      const s = el.selectionStart;
      if (s > 0) {
        el.value = el.value.substring(0, s - 1) + el.value.substring(s);
        el.selectionStart = el.selectionEnd = s - 1;
      }
    }
  }
}

// --- 9. EDITOR INITIALIZATION ---
function initEditor() {
  const fallback = document.getElementById("code-editor-fallback");
  const initialCode = files[currentFileName] || DEFAULT_PYTHON;
  fallback.value = initialCode;
  fallback.style.display = "block";
  fallback.setAttribute("inputmode", "none");

  fallback.addEventListener("input", () => {
    files[currentFileName] = fallback.value;
    saveStoredFiles(files);
  });

  editor = {
    getValue: () => fallback.value,
    setValue: (v) => { fallback.value = v; },
    replaceSelection: (text) => {
      const start = fallback.selectionStart;
      const end = fallback.selectionEnd;
      const val = fallback.value;
      fallback.value = val.substring(0, start) + text + val.substring(end);
      fallback.selectionStart = fallback.selectionEnd = start + text.length;
      fallback.focus();
    },
    focus: () => fallback.focus(),
    refresh: () => {},
    getInputField: () => fallback,
    getCursor: () => ({ line: 0, ch: 0 }),
    setCursor: () => {},
    lineCount: () => fallback.value.split("\n").length,
    getLine: (i) => fallback.value.split("\n")[i] || "",
    scrollIntoView: () => {},
    somethingSelected: () => fallback.selectionStart !== fallback.selectionEnd,
    getSelection: () => fallback.value.substring(fallback.selectionStart, fallback.selectionEnd)
  };

  upgradeToCodeMirror();
}

function upgradeToCodeMirror() {
  if (typeof CodeMirror === "undefined") return;
  const wrapper = document.getElementById("codemirror-wrapper");
  const fallback = document.getElementById("code-editor-fallback");
  if (!wrapper || !fallback || wrapper.querySelector(".CodeMirror")) return;

  try {
    const isHtml = currentFileName.toLowerCase().endsWith(".html");
    const cmInstance = CodeMirror(wrapper, {
      value: fallback.value,
      mode: isHtml ? "htmlmixed" : "python",
      lineNumbers: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      tabSize: 4,
      indentUnit: 4,
      indentWithTabs: false,
      lineWrapping: false,
      gutters: ["CodeMirror-linenumbers"],
      extraKeys: {
        "Backspace": (cm) => handleBackspace(cm),
        "Ctrl-F": () => document.getElementById("btn-toggle-search").click()
      }
    });

    fallback.style.display = "none";
    cmInstance.setSize("100%", "100%");
    cmInstance.refresh();

    const input = cmInstance.getInputField();
    if (input) {
      input.setAttribute("inputmode", "none");
      input.addEventListener("beforeinput", (e) => {
        if (e.inputType === "deleteContentBackward") {
          if (cmInstance.somethingSelected()) {
            e.preventDefault();
            cmInstance.replaceSelection("");
            return;
          }
          const cur = cmInstance.getCursor();
          if (cur.ch === 0 && cur.line > 0) {
            e.preventDefault();
            const prevLine = cmInstance.getLine(cur.line - 1);
            const prevLen = prevLine.length;
            cmInstance.replaceRange("", { line: cur.line - 1, ch: prevLen }, { line: cur.line, ch: 0 });
            cmInstance.setCursor({ line: cur.line - 1, ch: prevLen });
          }
        }
      });
    }

    const cmEl = cmInstance.getWrapperElement();
    cmEl.addEventListener("touchstart", () => {
      if (!isKeyboardOpen && input) input.setAttribute("inputmode", "none");
    }, { passive: true });
    cmEl.addEventListener("touchend", () => {
      if (!isKeyboardOpen && input) input.setAttribute("inputmode", "none");
    }, { passive: true });

    cmInstance.on("beforeChange", (cm, change) => {
      if (change.origin === "+input" && change.text && change.text.length === 1) {
        const typed = change.text[0];
        const cur = cm.getCursor();
        const line = cm.getLine(cur.line);
        const nextChar = line ? line.charAt(cur.ch) : "";

        if ((typed === ")" || typed === "]" || typed === "}" || typed === '"' || typed === "'") && nextChar === typed) {
          change.cancel();
          cm.setCursor({ line: cur.line, ch: cur.ch + 1 });
          return;
        }

        const closer = BRACKET_PAIRS[typed];
        if (closer) {
          if (cm.somethingSelected()) {
            const sel = cm.getSelection();
            change.text = [typed + sel + closer];
            setTimeout(() => {
              const start = cm.getCursor("from");
              const end = cm.getCursor("to");
              cm.setSelection(start, end);
            }, 0);
          } else {
            change.text = [typed + closer];
            setTimeout(() => cm.setCursor({ line: cur.line, ch: cur.ch + 1 }), 0);
          }
        }
      }
    });

    cmInstance.on("renderLine", (cm, line, elt) => {
      const match = line.text.match(/^(\s+)/);
      if (!match) return;
      const numSpaces = match[1].replace(/\t/g, "    ").length;
      const levels = Math.floor(numSpaces / 4);
      if (levels === 0) return;

      const guideContainer = document.createElement("span");
      guideContainer.className = "cm-indent-guide-container";
      guideContainer.style.position = "absolute";
      guideContainer.style.left = "0";
      guideContainer.style.top = "0";
      guideContainer.style.bottom = "0";
      guideContainer.style.pointerEvents = "none";
      guideContainer.style.zIndex = "1";

      for (let i = 1; i <= levels; i++) {
        const guide = document.createElement("span");
        guide.className = "cm-indent-guide-line";
        guide.style.position = "absolute";
        guide.style.left = `calc(${ (i - 1) * 4 }ch + 8px)`;
        guide.style.top = "0";
        guide.style.bottom = "0";
        guide.style.width = "1px";
        guide.style.backgroundColor = "rgba(255, 255, 255, 0.16)";
        guideContainer.appendChild(guide);
      }
      elt.style.position = "relative";
      elt.insertBefore(guideContainer, elt.firstChild);
    });

    cmInstance.on("change", () => {
      files[currentFileName] = cmInstance.getValue();
      fallback.value = cmInstance.getValue();
      saveStoredFiles(files);
    });

    editor = cmInstance;
  } catch (e) {
    console.warn("CodeMirror upgrade skipped:", e);
  }
}

// --- 10. CONSOLE OUTPUT & PYODIDE ---
const outputView = document.getElementById("output-view");

function appendOutputText(text, type = "stdout") {
  const span = document.createElement("span");
  span.className = `out-${type}`;
  span.textContent = text;
  outputView.appendChild(span);
  outputView.scrollTop = outputView.scrollHeight;
}

function clearOutput() { outputView.innerHTML = ""; }

async function initPyodideWasm() {
  const fillBar = document.getElementById("pyodide-loader-fill");
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");

  fillBar.style.width = "30%";
  statusText.textContent = "Loading Pyodide...";

  try {
    if (typeof loadPyodide === "undefined") throw new Error("Pyodide script not available");
    fillBar.style.width = "65%";
    statusText.textContent = "Compiling Wasm...";

    pyodideInstance = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" });
    pyodideInstance.setStdout({ batched: (msg) => appendOutputText(msg + "\n", "stdout") });
    pyodideInstance.setStderr({ batched: (msg) => appendOutputText(msg + "\n", "stderr") });

    fillBar.style.width = "100%";
    setTimeout(() => { fillBar.style.opacity = "0"; }, 400);

    isPyodideLoading = false;
    statusDot.className = "status-dot ready";
    statusText.textContent = "Python 3.12 (Ready)";
    appendOutputText("[Pyodide Ready] Python 3.12 initialized with Wasm.\n", "success");
  } catch (err) {
    statusDot.style.backgroundColor = "var(--accent-red)";
    statusText.textContent = "Python (Local)";
    appendOutputText(`[Notice] Pyodide: ${err.message}\n`, "info");
  }
}

async function runCode() {
  if (isExecuting) return;
  const code = editor.getValue();
  const runBtn = document.getElementById("btn-run-code");
  const runIcon = document.getElementById("run-icon");
  const runLabel = document.getElementById("run-label");
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");
  const execStat = document.getElementById("sb-plugin-stat");
  const t = I18N[appSettings.language] || I18N.ru;

  const bottomPanel = document.getElementById("bottom-panel");
  if (bottomPanel.classList.contains("collapsed")) bottomPanel.classList.remove("collapsed");
  showPanelTab("output");

  if (isPyodideLoading || !pyodideInstance) {
    appendOutputText("[Notice] Pyodide Python engine is still initializing. Please wait a moment...\n", "info");
    return;
  }

  isExecuting = true;
  runBtn.classList.add("running");
  runIcon.innerHTML = ICONS.refresh;
  runLabel.textContent = t.running;
  statusDot.className = "status-dot running";
  statusText.textContent = "Executing...";

  appendOutputText(`\n>>> [Executing ${currentFileName}] ${new Date().toLocaleTimeString()} <<<\n`, "info");
  if (window.AndroidBridge && typeof window.AndroidBridge.vibrate === "function") {
    try { window.AndroidBridge.vibrate(20); } catch (_) {}
  }

  const startTime = performance.now();
  let hasError = false;

  try {
    await pyodideInstance.runPythonAsync(code);
  } catch (err) {
    hasError = true;
    appendOutputText(`${err.message || err}\n`, "stderr");
  } finally {
    const duration = Math.round(performance.now() - startTime);
    isExecuting = false;
    runBtn.classList.remove("running");
    updateRunButtonLabel();
    statusDot.className = "status-dot ready";
    statusText.textContent = "Python 3.12 (Ready)";
    execStat.textContent = `Exec: ${duration}ms`;
    if (!hasError) appendOutputText(`[Done] Exited with code=0 in ${(duration / 1000).toFixed(3)}s\n`, "success");
  }
}

// --- 10.5 PIP PACKAGE MANAGER (MICROPIP) ---
let installedPipPackages = JSON.parse(localStorage.getItem("rde_installed_pip_v2") || '["micropip"]');

function addInstalledPackage(pkg) {
  const clean = pkg.trim().toLowerCase();
  if (!installedPipPackages.includes(clean)) {
    installedPipPackages.push(clean);
    localStorage.setItem("rde_installed_pip_v2", JSON.stringify(installedPipPackages));
  }
  renderInstalledPipList();
}

function renderInstalledPipList() {
  const container = document.getElementById("pip-installed-list");
  if (!container) return;
  container.innerHTML = "";

  if (installedPipPackages.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); padding:10px 0; font-size:11.5px;">No packages installed yet.</div>`;
    return;
  }

  installedPipPackages.forEach(pkg => {
    const card = document.createElement("div");
    card.className = "extension-card";
    card.style.padding = "7px 12px";
    card.innerHTML = `
      <div class="ext-header">
        <div class="ext-title-group">
          <span style="display:flex;align-items:center;color:var(--accent-cyan);">${ICONS.boxPackage}</span>
          <span class="ext-title" style="font-size:12.5px;">${pkg}</span>
        </div>
        <div style="font-size:10px; color:#23d18b; font-weight:700; letter-spacing:0.5px;">INSTALLED</div>
      </div>
    `;
    container.appendChild(card);
  });
}

async function runPipInstall(rawPkg) {
  if (!rawPkg || !rawPkg.trim()) return;
  const pkgName = rawPkg.trim().replace(/^pip\s+install\s+/i, "").trim().toLowerCase();
  if (!pkgName) return;

  const bottomPanel = document.getElementById("bottom-panel");
  if (bottomPanel.classList.contains("collapsed")) bottomPanel.classList.remove("collapsed");
  showPanelTab("terminal");

  appendReplLog(`pip install ${pkgName}`, "prompt");

  if (isPyodideLoading || !pyodideInstance) {
    appendReplLog(`[pip error] Pyodide Python engine is still initializing. Please wait a moment...`, "stderr");
    return;
  }

  appendReplLog(`[pip] Resolving package: ${pkgName}...`, "info");
  appendReplLog(`[pip] Downloading and preparing wheel for ${pkgName}...`, "stdout");

  try {
    await pyodideInstance.loadPackage("micropip");
    await pyodideInstance.runPythonAsync(`
import micropip
await micropip.install('${pkgName}')
    `);
    appendReplLog(`[pip] Unpacking and verifying dependencies...`, "stdout");
    appendReplLog(`[pip] Successfully installed ${pkgName}!`, "success");
    addInstalledPackage(pkgName);
    if (window.AndroidBridge && typeof window.AndroidBridge.showToast === "function") {
      window.AndroidBridge.showToast(`pip: ${pkgName} installed successfully`);
    }
  } catch (err) {
    appendReplLog(`[pip error] ${err.message || err}`, "stderr");
  }
}

// --- 11. TREE VIEW EXPLORER & RECENT FILES ---
let collapsedFolders = new Set(JSON.parse(localStorage.getItem("rde_collapsed_folders_v1") || "[]"));
let recentFiles = JSON.parse(localStorage.getItem("rde_recent_files_v1") || "[]");

function addRecentFile(filePath) {
  if (!filePath) return;
  recentFiles = recentFiles.filter(item => (typeof item === "string" ? item : item.path) !== filePath);
  recentFiles.unshift({ path: filePath, name: filePath.split("/").pop(), time: Date.now() });
  if (recentFiles.length > 8) recentFiles.pop();
  try {
    localStorage.setItem("rde_recent_files_v1", JSON.stringify(recentFiles));
  } catch (_) {}
  renderRecentList();
}

function renderRecentList() {
  const container = document.getElementById("welcome-recent-list");
  if (!container) return;
  container.innerHTML = "";

  if (recentFiles.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); font-size:11.5px; padding:6px 0;">No recent files yet.</div>`;
    return;
  }

  recentFiles.forEach(item => {
    const filePath = typeof item === "string" ? item : item.path;
    const fileName = typeof item === "string" ? item : item.name;
    const row = document.createElement("div");
    row.className = "recent-item";
    const iconSvg = typeof getFileIconSvg === "function" ? getFileIconSvg(fileName) : ICONS.text;
    row.innerHTML = `
      <div class="recent-name">
        <span style="display:flex;align-items:center;">${iconSvg}</span>
        <span>${fileName}</span>
      </div>
      <div class="recent-path">${filePath}</div>
    `;
    row.onclick = () => {
      hideWelcomeView();
      switchToFile(filePath);
    };
    container.appendChild(row);
  });
}

function showWelcomeView() {
  const wv = document.getElementById("welcome-view");
  if (wv) {
    renderRecentList();
    wv.style.display = "block";
  }
}

function hideWelcomeView() {
  const wv = document.getElementById("welcome-view");
  if (wv) wv.style.display = "none";
}

function toggleFolder(folderPath) {
  if (collapsedFolders.has(folderPath)) {
    collapsedFolders.delete(folderPath);
  } else {
    collapsedFolders.add(folderPath);
  }
  try {
    localStorage.setItem("rde_collapsed_folders_v1", JSON.stringify(Array.from(collapsedFolders)));
  } catch (_) {}
  renderFileTree();
}

function buildTreeStructure(filesMap) {
  const root = { name: "", path: "", isFolder: true, children: {} };
  Object.keys(filesMap).forEach(filePath => {
    const parts = filePath.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = (i === parts.length - 1);
      const currentPath = parts.slice(0, i + 1).join("/");
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: currentPath,
          isFolder: !isFile,
          children: {}
        };
      }
      current = current.children[part];
    }
  });
  return root;
}

function renderTreeBranch(node, container) {
  const t = I18N[appSettings.language] || I18N.ru;
  const sortedKeys = Object.keys(node.children).sort((a, b) => {
    const aIsFolder = node.children[a].isFolder;
    const bIsFolder = node.children[b].isFolder;
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    return a.localeCompare(b);
  });

  sortedKeys.forEach(key => {
    const item = node.children[key];
    if (item.isFolder) {
      const isCollapsed = collapsedFolders.has(item.path);
      const folderEl = document.createElement("div");
      folderEl.className = `tree-folder ${isCollapsed ? "collapsed" : ""}`;

      const header = document.createElement("div");
      header.className = "tree-folder-header";
      header.onclick = () => toggleFolder(item.path);

      const left = document.createElement("div");
      left.className = "tree-folder-left";
      const chevron = isCollapsed ? ICONS.chevronRight : ICONS.chevronDown;
      const folderIcon = isCollapsed ? ICONS.folder : ICONS.folderOpen;
      left.innerHTML = `
        <span class="tree-chevron">${chevron}</span>
        <span style="display:flex;align-items:center;">${folderIcon}</span>
        <span>${item.name}</span>
      `;

      const actions = document.createElement("div");
      actions.className = "file-item-actions";

      // Add new file in folder
      const btnAddInFolder = document.createElement("button");
      btnAddInFolder.className = "file-action-btn";
      btnAddInFolder.title = t.newFile;
      btnAddInFolder.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
      btnAddInFolder.onclick = (e) => {
        e.stopPropagation();
        const fName = prompt(t.enterFileName);
        if (fName && fName.trim()) {
          const fullPath = `${item.path}/${fName.trim()}`;
          files[fullPath] = fName.endsWith(".html") ? DEFAULT_HTML : `# ${fName}\n`;
          saveStoredFiles(files);
          switchToFile(fullPath);
        }
      };

      actions.appendChild(btnAddInFolder);
      header.appendChild(left);
      header.appendChild(actions);
      folderEl.appendChild(header);

      const childrenEl = document.createElement("div");
      childrenEl.className = "tree-folder-children";
      renderTreeBranch(item, childrenEl);
      folderEl.appendChild(childrenEl);

      container.appendChild(folderEl);
    } else {
      // File Leaf
      const fileEl = document.createElement("div");
      fileEl.className = `file-tree-item ${item.path === currentFileName ? "active" : ""}`;

      const left = document.createElement("div");
      left.className = "file-item-left";
      const iconSvg = typeof getFileIconSvg === "function" ? getFileIconSvg(item.name) : ICONS.text;
      left.innerHTML = `<span style="display:flex;align-items:center;">${iconSvg}</span><span>${item.name}</span>`;
      left.onclick = () => {
        hideWelcomeView();
        switchToFile(item.path);
      };

      const actions = document.createElement("div");
      actions.className = "file-item-actions";

      const btnRename = document.createElement("button");
      btnRename.className = "file-action-btn";
      btnRename.title = t.rename;
      btnRename.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
      btnRename.onclick = (e) => { e.stopPropagation(); renameFile(item.path); };

      const btnDelete = document.createElement("button");
      btnDelete.className = "file-action-btn";
      btnDelete.title = t.delete;
      btnDelete.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
      btnDelete.onclick = (e) => { e.stopPropagation(); deleteFile(item.path); };

      actions.appendChild(btnRename);
      actions.appendChild(btnDelete);
      fileEl.appendChild(left);
      fileEl.appendChild(actions);
      container.appendChild(fileEl);
    }
  });
}

function renderFileTree() {
  const container = document.getElementById("file-tree-container");
  if (!container) return;
  container.innerHTML = "";
  const tree = buildTreeStructure(files);
  renderTreeBranch(tree, container);
}

function switchToFile(fileName) {
  if (!files[fileName]) return;
  currentFileName = fileName;
  document.getElementById("tab-filename").textContent = fileName.split("/").pop();
  const tabIcon = document.getElementById("tab-file-icon");
  if (tabIcon && typeof getFileIconSvg === "function") {
    tabIcon.innerHTML = getFileIconSvg(fileName);
  }
  editor.setValue(files[fileName]);
  if (editor.setOption) {
    editor.setOption("mode", fileName.toLowerCase().endsWith(".html") ? "htmlmixed" : "python");
  }
  saveStoredFiles(files);
  addRecentFile(fileName);
  updateRunButtonLabel();
  if (editor.refresh) setTimeout(() => editor.refresh(), 30);
  renderFileTree();
}

function renameFile(oldName) {
  const t = I18N[appSettings.language] || I18N.ru;
  const newName = prompt(`${t.enterNewName} "${oldName}":`, oldName);
  if (!newName || !newName.trim() || newName.trim() === oldName) return;
  const clean = newName.trim();
  if (files[clean]) { alert("File exists!"); return; }
  files[clean] = files[oldName];
  delete files[oldName];
  if (currentFileName === oldName) currentFileName = clean;
  saveStoredFiles(files);
  switchToFile(currentFileName);
}

function deleteFile(name) {
  const t = I18N[appSettings.language] || I18N.ru;
  if (Object.keys(files).length <= 1) { alert("Cannot delete the only file!"); return; }
  if (confirm(`${t.confirmDelete} "${name}"?`)) {
    delete files[name];
    if (currentFileName === name) currentFileName = Object.keys(files)[0];
    saveStoredFiles(files);
    switchToFile(currentFileName);
  }
}

function showPanelTab(tabName) {
  document.getElementById("ptab-output").classList.toggle("active", tabName === "output");
  document.getElementById("ptab-terminal").classList.toggle("active", tabName === "terminal");
  document.getElementById("output-view").style.display = tabName === "output" ? "block" : "none";
  document.getElementById("terminal-view").style.display = tabName === "terminal" ? "flex" : "none";
}

function loadScriptAsync(src, onLoad) {
  const s = document.createElement("script");
  s.src = src; s.async = true;
  if (onLoad) s.onload = onLoad;
  s.onerror = (e) => console.warn("Failed:", src, e);
  document.body.appendChild(s);
}

// --- 12. VIEWPORT ADAPTATION ---
function adaptLayoutToViewport() {
  const vv = window.visualViewport;
  const appRoot = document.getElementById("app-root");
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  if (vv && appRoot) {
    appRoot.style.height = `${vv.height}px`;
    appRoot.style.top = `${vv.offsetTop}px`;
  }
  if (editor && typeof editor.refresh === "function") {
    editor.refresh();
    const cur = editor.getCursor();
    setTimeout(() => { if (editor && editor.scrollIntoView) editor.scrollIntoView(cur, 30); }, 50);
  }
}

// --- 13. DOM SETUP ---
window.addEventListener("DOMContentLoaded", () => {
  initEditor();
  setupVirtualKeyboard();
  setupDeviceFileIntegration();
  setupSearchReplace();
  renderFileTree();
  applyAppSettings();
  updateRunButtonLabel();

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", adaptLayoutToViewport);
    window.visualViewport.addEventListener("scroll", () => window.scrollTo(0, 0));
  }
  window.addEventListener("resize", adaptLayoutToViewport);

  document.getElementById("btn-run-code").addEventListener("click", handleRunOrPreview);
  document.getElementById("btn-clear-output").addEventListener("click", clearOutput);
  document.getElementById("btn-toggle-keyboard").addEventListener("click", toggleKeyboard);

  document.getElementById("btn-select-all").addEventListener("click", () => {
    if (editor && editor.setSelection && editor.lineCount) {
      editor.setSelection({ line: 0, ch: 0 }, { line: editor.lineCount(), ch: 0 });
      editor.focus();
    }
  });

  document.getElementById("btn-copy-sel").addEventListener("click", () => {
    if (!editor) return;
    const text = editor.somethingSelected && editor.somethingSelected() ? editor.getSelection() : editor.getValue();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      appendOutputText("[Copied to clipboard]\n", "info");
    }
  });

  document.getElementById("btn-paste-sel").addEventListener("click", async () => {
    if (!editor) return;
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) editor.replaceSelection(clipText);
      }
    } catch (_) {}
  });

  // Settings Modal
  const settingsModal = document.getElementById("settings-modal");
  document.getElementById("btn-open-settings").addEventListener("click", () => settingsModal.style.display = "flex");
  document.getElementById("btn-close-settings").addEventListener("click", () => settingsModal.style.display = "none");
  document.getElementById("btn-settings-done").addEventListener("click", () => settingsModal.style.display = "none");

  document.getElementById("opt-theme-vscode").addEventListener("click", () => { appSettings.theme = "vscode"; saveAppSettings(); });
  document.getElementById("opt-theme-cyberfox").addEventListener("click", () => { appSettings.theme = "cyberfox"; saveAppSettings(); });
  document.getElementById("opt-kb-system").addEventListener("click", () => { appSettings.keyboardMode = "system"; setKeyboardOpen(false); saveAppSettings(); });
  document.getElementById("opt-kb-builtin").addEventListener("click", () => { appSettings.keyboardMode = "builtin"; setKeyboardOpen(false); saveAppSettings(); });
  document.getElementById("opt-lang-ru").addEventListener("click", () => { appSettings.language = "ru"; saveAppSettings(); });
  document.getElementById("opt-lang-en").addEventListener("click", () => { appSettings.language = "en"; saveAppSettings(); });

  // Web Preview Modal
  const previewModal = document.getElementById("preview-modal");
  document.getElementById("btn-close-preview").addEventListener("click", () => previewModal.style.display = "none");
  document.getElementById("btn-refresh-preview").addEventListener("click", () => {
    document.getElementById("preview-iframe").srcdoc = editor ? editor.getValue() : "";
  });

  // Console Panel
  const bottomPanel = document.getElementById("bottom-panel");
  document.getElementById("btn-toggle-terminal").addEventListener("click", () => {
    bottomPanel.classList.toggle("collapsed");
    if (editor && editor.refresh) setTimeout(() => editor.refresh(), 30);
  });
  document.getElementById("btn-close-panel").addEventListener("click", () => {
    bottomPanel.classList.add("collapsed");
    if (editor && editor.refresh) setTimeout(() => editor.refresh(), 30);
  });

  document.getElementById("ptab-output").addEventListener("click", () => showPanelTab("output"));
  document.getElementById("ptab-terminal").addEventListener("click", () => showPanelTab("terminal"));

  // Sidebar
  const sidebar = document.getElementById("sidebar-container");
  document.getElementById("btn-toggle-sidebar").addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    if (editor && editor.refresh) setTimeout(() => editor.refresh(), 30);
  });
  document.getElementById("act-explorer").addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    if (editor && editor.refresh) setTimeout(() => editor.refresh(), 30);
  });

  document.getElementById("btn-new-file")?.addEventListener("click", () => {
    const t = I18N[appSettings.language] || I18N.ru;
    const name = prompt(t.enterFileName);
    if (name && name.trim()) {
      const clean = name.trim();
      if (!files[clean]) {
        files[clean] = clean.endsWith(".html") ? DEFAULT_HTML : `# File: ${clean}\n`;
        saveStoredFiles(files);
        switchToFile(clean);
      } else {
        switchToFile(clean);
      }
      hideWelcomeView();
    }
  });

  document.getElementById("btn-new-folder")?.addEventListener("click", () => {
    const folderName = prompt("Enter folder name (e.g. src or utils):");
    if (folderName && folderName.trim()) {
      const cleanFolder = folderName.trim().replace(/\/+$/, "");
      const placeholder = `${cleanFolder}/main.py`;
      if (!files[placeholder]) {
        files[placeholder] = `# Package: ${cleanFolder}\n\ndef init():\n    pass\n`;
        saveStoredFiles(files);
        switchToFile(placeholder);
      }
      hideWelcomeView();
    }
  });

  // Welcome Page Event Listeners
  document.getElementById("btn-show-welcome-logo")?.addEventListener("click", () => {
    showWelcomeView();
  });

  document.getElementById("welcome-btn-new-file")?.addEventListener("click", () => {
    document.getElementById("btn-new-file")?.click();
  });

  document.getElementById("welcome-btn-open-file")?.addEventListener("click", () => {
    hideWelcomeView();
    document.getElementById("btn-open-device-file")?.click();
  });

  document.getElementById("welcome-btn-open-folder")?.addEventListener("click", () => {
    hideWelcomeView();
    document.getElementById("btn-open-device-folder")?.click();
  });

  document.getElementById("welcome-btn-tpl-py")?.addEventListener("click", () => {
    const tplName = "calculator.py";
    if (!files[tplName]) {
      files[tplName] = `# Math & Statistics Calculator\nimport math\n\ndef calc(a, b, op):\n    if op == '+': return a + b\n    if op == '-': return a - b\n    if op == '*': return a * b\n    if op == '/': return a / b if b != 0 else 'Error'\n\nprint("24 * 7 =", calc(24, 7, '*'))\nprint("Hypotenuse (3, 4) =", math.hypot(3, 4))\n`;
    }
    saveStoredFiles(files);
    hideWelcomeView();
    switchToFile(tplName);
  });

  document.getElementById("welcome-btn-tpl-web")?.addEventListener("click", () => {
    const tplName = "app.html";
    if (!files[tplName]) {
      files[tplName] = DEFAULT_HTML;
    }
    saveStoredFiles(files);
    hideWelcomeView();
    switchToFile(tplName);
  });

  const chkWelcome = document.getElementById("chk-show-welcome-on-startup");
  if (chkWelcome) {
    chkWelcome.checked = appSettings.showWelcomeOnStartup !== false;
    chkWelcome.addEventListener("change", () => {
      appSettings.showWelcomeOnStartup = chkWelcome.checked;
      saveAppSettings();
    });
  }

  // Show Welcome on startup if enabled
  if (appSettings.showWelcomeOnStartup) {
    showWelcomeView();
  }

  // Quick accessory bar keys
  document.querySelectorAll(".acc-key[data-insert]").forEach(btn => {
    btn.addEventListener("click", () => insertTextIntoEditor(btn.getAttribute("data-insert")));
  });

  document.querySelectorAll(".acc-key[data-pair]").forEach(btn => {
    btn.addEventListener("click", () => {
      const pair = btn.getAttribute("data-pair");
      if (!pair || !editor) return;
      if (pair === "print()") {
        if (editor.somethingSelected && editor.somethingSelected()) {
          editor.replaceSelection("print(" + editor.getSelection() + ")");
        } else {
          editor.replaceSelection("print()");
          if (editor.getCursor && editor.setCursor) {
            const c = editor.getCursor();
            editor.setCursor({ line: c.line, ch: c.ch - 1 });
          }
        }
      } else {
        insertPair(pair);
      }
      if (editor.focus) editor.focus();
    });
  });

  // REPL Send & Pip Interceptor
  const replInput = document.getElementById("repl-input");
  const replHistory = document.getElementById("repl-history");

  function appendReplLog(text, type = "stdout") {
    if (!replHistory) return;
    const line = document.createElement("div");
    if (type === "prompt") {
      line.innerHTML = `<span style="color:var(--accent-cyan); font-weight:bold;">&gt;&gt;&gt;</span> <span>${text}</span>`;
    } else if (type === "stderr") {
      line.style.color = "var(--accent-red)";
      line.textContent = text;
    } else if (type === "success") {
      line.style.color = "#23d18b";
      line.style.fontWeight = "bold";
      line.textContent = text;
    } else if (type === "info") {
      line.style.color = "var(--accent-cyan)";
      line.textContent = text;
    } else {
      line.style.color = "#dcdcdc";
      line.textContent = text;
    }
    replHistory.appendChild(line);
    replHistory.scrollTop = replHistory.scrollHeight;
  }

  const sendRepl = async () => {
    const cmd = replInput.value.trim();
    if (!cmd) return;
    replInput.value = "";

    // Intercept pip install command
    if (cmd.toLowerCase().startsWith("pip install ")) {
      runPipInstall(cmd);
      return;
    }

    appendReplLog(cmd, "prompt");

    if (pyodideInstance) {
      try {
        const res = await pyodideInstance.runPythonAsync(cmd);
        if (res !== undefined) {
          appendReplLog(String(res), "success");
        }
      } catch (e) {
        appendReplLog(e.message, "stderr");
      }
    }
  };
  document.getElementById("btn-repl-send").addEventListener("click", sendRepl);
  replInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); sendRepl(); } });

  // Packages Modal Listeners
  const packagesModal = document.getElementById("packages-modal");
  document.getElementById("btn-open-packages")?.addEventListener("click", () => {
    packagesModal.style.display = "flex";
    renderInstalledPipList();
  });
  document.getElementById("act-packages")?.addEventListener("click", () => {
    packagesModal.style.display = "flex";
    renderInstalledPipList();
  });
  document.getElementById("btn-close-packages")?.addEventListener("click", () => {
    packagesModal.style.display = "none";
  });
  document.getElementById("btn-pip-install-submit")?.addEventListener("click", () => {
    const input = document.getElementById("pip-package-input");
    if (input && input.value) {
      const val = input.value.trim();
      input.value = "";
      packagesModal.style.display = "none";
      runPipInstall(val);
    }
  });
  document.querySelectorAll(".btn-quick-pkg").forEach(btn => {
    btn.addEventListener("click", () => {
      const pkg = btn.getAttribute("data-pkg");
      if (pkg) {
        packagesModal.style.display = "none";
        runPipInstall(pkg);
      }
    });
  });

  // Resizer
  const resizer = document.getElementById("panel-resizer");
  let isResizing = false, startY = 0, startHeight = 110;
  const onPointerMove = (e) => {
    if (!isResizing) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = startY - clientY;
    bottomPanel.style.height = `${Math.max(28, Math.min(window.innerHeight * 0.6, startHeight + delta))}px`;
    if (editor && editor.refresh) editor.refresh();
  };
  const onPointerUp = () => {
    isResizing = false;
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mouseup", onPointerUp);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchend", onPointerUp);
  };
  const onPointerDown = (e) => {
    isResizing = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    startHeight = bottomPanel.offsetHeight;
    bottomPanel.classList.remove("collapsed");
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("touchend", onPointerUp);
  };
  resizer.addEventListener("mousedown", onPointerDown);
  resizer.addEventListener("touchstart", onPointerDown, { passive: true });

  // Scripts
  loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js", () => {
    loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js", () => {
      loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js", () => {
        loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js", () => {
          loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js", () => {
            loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js", () => {
              loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/search/searchcursor.min.js", () => {
                upgradeToCodeMirror();
              });
            });
          });
        });
      });
    });
  });

  loadScriptAsync("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js", () => {
    initPyodideWasm();
  });
});

window.handleAndroidBack = function() {
  const packagesModal = document.getElementById("packages-modal");
  if (packagesModal && packagesModal.style.display === "flex") {
    packagesModal.style.display = "none";
    return true;
  }
  const welcomeView = document.getElementById("welcome-view");
  if (welcomeView && welcomeView.style.display === "block") {
    welcomeView.style.display = "none";
    return true;
  }
  const marketplaceModal = document.getElementById("marketplace-modal");
  if (marketplaceModal && marketplaceModal.style.display === "flex") {
    marketplaceModal.style.display = "none";
    return true;
  }
  const previewModal = document.getElementById("preview-modal");
  if (previewModal && previewModal.style.display === "flex") {
    previewModal.style.display = "none";
    return true;
  }
  const settingsModal = document.getElementById("settings-modal");
  if (settingsModal && settingsModal.style.display === "flex") {
    settingsModal.style.display = "none";
    return true;
  }
  const searchBar = document.getElementById("search-replace-bar");
  if (searchBar && searchBar.style.display === "flex") {
    searchBar.style.display = "none";
    clearSearchMarkers();
    return true;
  }
  if (isKeyboardOpen) {
    setKeyboardOpen(false);
    return true;
  }
  const sidebar = document.getElementById("sidebar-container");
  if (!sidebar.classList.contains("collapsed")) {
    sidebar.classList.add("collapsed");
    return true;
  }
  return false;
};
