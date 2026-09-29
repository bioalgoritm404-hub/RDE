/**
 * RDE Plugin System & Marketplace (window.rdeAPI)
 */
(function() {
  const activePlugins = new Map();
  let lofiAudio = null;
  let isLofiPlaying = false;

  // --- MARKETPLACE CATALOG ---
  const MARKETPLACE_STORAGE_KEY = "rde_marketplace_plugins_v1";

  const DEFAULT_CATALOG = [
    {
      id: "rde.lofi.radio",
      name: "Lo-Fi Coding Radio",
      author: "RayVen Team",
      version: "1.2.0",
      description: "Chill lo-fi music stream directly in your IDE for deep coding focus.",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`,
      isInstalled: true,
      isEnabled: true,
      init: function(api) {
        api.addToolbarButton({
          id: "btn-lofi-toggle",
          title: "Lo-Fi Background Coding Radio",
          iconHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`,
          onClick: () => api.toggleLofiRadio()
        });
      },
      cleanup: function() {
        const btn = document.getElementById("btn-lofi-toggle");
        if (btn) btn.remove();
        if (lofiAudio && isLofiPlaying) {
          lofiAudio.pause();
          isLofiPlaying = false;
        }
      }
    },
    {
      id: "rde.code.formatter",
      name: "Code Beautifier & Formatter",
      author: "PythonDev",
      version: "1.0.4",
      description: "Cleans trailing spaces, fixes 4-space indentations, and tidies blank lines.",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10M4 18h14"/></svg>`,
      isInstalled: true,
      isEnabled: true,
      init: function(api) {
        api.addToolbarButton({
          id: "btn-format-code",
          title: "Format & Clean Code",
          iconHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10M4 18h14"/></svg>`,
          onClick: () => {
            const raw = api.getEditorContent();
            if (!raw) return;
            const formatted = raw
              .split("\n")
              .map(line => line.trimEnd())
              .join("\n");
            api.setEditorContent(formatted);
            api.showNotification("Code formatted: trailing spaces cleared!", "success");
          }
        });
      },
      cleanup: function() {
        const btn = document.getElementById("btn-format-code");
        if (btn) btn.remove();
      }
    },
    {
      id: "rde.snippets.pack",
      name: "Python Quick Snippets",
      author: "DevTools",
      version: "1.1.0",
      description: "Quick insert templates for classes, try-except, lambda, and async functions.",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      isInstalled: false,
      isEnabled: false,
      init: function(api) {
        api.addToolbarButton({
          id: "btn-snippet-pack",
          title: "Insert Python Snippet",
          iconHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
          onClick: () => {
            const snippet = prompt("Choose Snippet:\n1. class MyClass\n2. try/except\n3. if __name__ == '__main__':\nEnter 1, 2, or 3:");
            if (snippet === "1") {
              api.insertText("\nclass Model:\n    def __init__(self, name):\n        self.name = name\n");
            } else if (snippet === "2") {
              api.insertText("\ntry:\n    pass\nexcept Exception as e:\n    print(f'Error: {e}')\n");
            } else if (snippet === "3") {
              api.insertText("\nif __name__ == '__main__':\n    main()\n");
            }
          }
        });
      },
      cleanup: function() {
        const btn = document.getElementById("btn-snippet-pack");
        if (btn) btn.remove();
      }
    },
    {
      id: "rde.line.sorter",
      name: "Line Sorter & Uniq",
      author: "Algorithms Lab",
      version: "1.0.1",
      description: "Sort selected lines alphabetically and remove duplicate entries.",
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>`,
      isInstalled: false,
      isEnabled: false,
      init: function(api) {
        api.addToolbarButton({
          id: "btn-line-sorter",
          title: "Sort Lines Alphabetically",
          iconHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>`,
          onClick: () => {
            const content = api.getEditorContent();
            if (!content) return;
            const lines = content.split("\n");
            const sorted = Array.from(new Set(lines)).sort().join("\n");
            api.setEditorContent(sorted);
            api.showNotification("Lines sorted and duplicates removed!", "info");
          }
        });
      },
      cleanup: function() {
        const btn = document.getElementById("btn-line-sorter");
        if (btn) btn.remove();
      }
    }
  ];

  const UNINSTALLED_STORAGE_KEY = "rde_uninstalled_plugins_v2";
  const CUSTOM_PLUGINS_META_KEY = "rde_custom_plugins_meta_v2";

  function markPluginUninstalled(pluginId) {
    if (!pluginId) return;
    try {
      const list = JSON.parse(localStorage.getItem(UNINSTALLED_STORAGE_KEY) || "[]");
      if (!list.includes(pluginId)) {
        list.push(pluginId);
        localStorage.setItem(UNINSTALLED_STORAGE_KEY, JSON.stringify(list));
      }
    } catch (_) {}
  }

  function unmarkPluginUninstalled(pluginId) {
    if (!pluginId) return;
    try {
      let list = JSON.parse(localStorage.getItem(UNINSTALLED_STORAGE_KEY) || "[]");
      list = list.filter(id => id !== pluginId);
      localStorage.setItem(UNINSTALLED_STORAGE_KEY, JSON.stringify(list));
    } catch (_) {}
  }

  function isPluginUninstalled(pluginId) {
    if (!pluginId) return false;
    try {
      const list = JSON.parse(localStorage.getItem(UNINSTALLED_STORAGE_KEY) || "[]");
      return list.includes(pluginId);
    } catch (_) {
      return false;
    }
  }

  function saveCustomPlugin(pluginId, scriptCode, fileName) {
    if (!pluginId || !scriptCode) return;
    try {
      let list = JSON.parse(localStorage.getItem(CUSTOM_PLUGINS_META_KEY) || "[]");
      list = list.filter(p => p.id !== pluginId);
      list.push({ id: pluginId, code: scriptCode, fileName: fileName || "plugin.js" });
      localStorage.setItem(CUSTOM_PLUGINS_META_KEY, JSON.stringify(list));
      localStorage.removeItem("rde_user_custom_plugins_scripts_v1");
    } catch (_) {}
  }

  function removeCustomPlugin(pluginId) {
    if (!pluginId) return;
    try {
      let list = JSON.parse(localStorage.getItem(CUSTOM_PLUGINS_META_KEY) || "[]");
      list = list.filter(p => p.id !== pluginId);
      localStorage.setItem(CUSTOM_PLUGINS_META_KEY, JSON.stringify(list));
      localStorage.removeItem("rde_user_custom_plugins_scripts_v1");
    } catch (_) {}
  }

  let catalog = loadCatalog();

  function loadCatalog() {
    try {
      const stored = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
      const uninstalled = JSON.parse(localStorage.getItem(UNINSTALLED_STORAGE_KEY) || "[]");
      if (stored) {
        const parsed = JSON.parse(stored);
        return DEFAULT_CATALOG.map(def => {
          if (uninstalled.includes(def.id)) {
            return { ...def, isInstalled: false, isEnabled: false };
          }
          const found = parsed.find(p => p.id === def.id);
          return found ? { ...def, isInstalled: found.isInstalled, isEnabled: found.isEnabled } : def;
        });
      }
    } catch (e) {
      console.warn("Marketplace load error:", e);
    }
    return DEFAULT_CATALOG.map(def => ({ ...def }));
  }

  function saveCatalog() {
    try {
      const stateToSave = catalog.map(p => ({ id: p.id, isInstalled: p.isInstalled, isEnabled: p.isEnabled }));
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Marketplace save error:", e);
    }
  }

  let currentRegisteringPluginId = null;
  let lastRegisteredPluginId = null;
  let isExplicitImportInProgress = false;

  window.rdeAPI = {
    // 1. Plugin Registration & Execution
    registerPlugin: function(manifest) {
      if (!manifest || !manifest.id) return;
      lastRegisteredPluginId = manifest.id;

      // If user uninstalled this plugin and this is an automatic startup load, skip it completely!
      if (isPluginUninstalled(manifest.id) && !isExplicitImportInProgress) {
        return;
      }

      // If user explicitly imported this plugin, restore it from uninstalled list
      if (isExplicitImportInProgress) {
        unmarkPluginUninstalled(manifest.id);
      }

      // Lifecycle Cleanup if plugin is re-registered
      const existing = activePlugins.get(manifest.id);
      if (existing) {
        if (typeof existing.cleanup === "function") {
          try { existing.cleanup(); } catch (e) { console.warn(e); }
        }
      }
      // Remove any leftover buttons from previous registration of this plugin
      document.querySelectorAll(`#custom-plugin-actions [data-plugin-id="${manifest.id}"]`).forEach(btn => btn.remove());

      activePlugins.set(manifest.id, manifest);

      // Add to catalog if not present, or update existing entry
      const existingCatalogEntry = catalog.find(p => p.id === manifest.id);
      if (!existingCatalogEntry) {
        catalog.push({
          id: manifest.id,
          name: manifest.name || "Custom Plugin",
          author: manifest.author || "User",
          version: manifest.version || "1.0.0",
          description: manifest.description || "User imported plugin.",
          icon: manifest.icon || `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>`,
          isInstalled: true,
          isEnabled: true,
          init: manifest.init,
          cleanup: manifest.cleanup
        });
        saveCatalog();
      } else {
        existingCatalogEntry.init = manifest.init;
        existingCatalogEntry.cleanup = manifest.cleanup;
        existingCatalogEntry.isInstalled = true;
        existingCatalogEntry.isEnabled = true;
        saveCatalog();
      }

      if (typeof manifest.init === "function") {
        currentRegisteringPluginId = manifest.id;
        try {
          manifest.init(window.rdeAPI);
        } catch (e) {
          console.warn("Plugin init error:", e);
        } finally {
          currentRegisteringPluginId = null;
        }
      }
      renderMarketplaceUI();
    },

    // Unregister plugin & cleanup created UI
    unregisterPlugin: function(pluginId) {
      if (!pluginId) return;
      const existing = activePlugins.get(pluginId);
      if (existing && typeof existing.cleanup === "function") {
        try { existing.cleanup(); } catch (e) { console.warn(e); }
      }
      // Remove any toolbar buttons registered by this plugin
      document.querySelectorAll(`#custom-plugin-actions [data-plugin-id="${pluginId}"]`).forEach(btn => btn.remove());
      activePlugins.delete(pluginId);

      const ext = catalog.find(p => p.id === pluginId);
      if (ext) {
        ext.isEnabled = false;
        saveCatalog();
      }
      renderMarketplaceUI();
    },

    // 2. Toolbar & UI Extension with strict deduplication
    addToolbarButton: function(config) {
      const container = document.getElementById("custom-plugin-actions");
      if (!container || !config) return null;

      const btnId = config.id || `btn-plugin-${Date.now()}`;

      // Deduplication: remove existing button with identical ID
      const oldBtn = document.getElementById(btnId);
      if (oldBtn) {
        oldBtn.remove();
      }

      const btn = document.createElement("button");
      btn.className = "icon-btn";
      btn.id = btnId;
      btn.title = config.title || "";
      btn.innerHTML = config.iconHtml || `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;

      const ownerPluginId = config.pluginId || currentRegisteringPluginId || "";
      if (ownerPluginId) {
        btn.setAttribute("data-plugin-id", ownerPluginId);
      }

      if (typeof config.onClick === "function") {
        btn.addEventListener("click", () => config.onClick(window.rdeAPI));
      }
      container.appendChild(btn);
      return btn;
    },

    showNotification: function(msg, type = "info") {
      if (window.AndroidBridge && typeof window.AndroidBridge.showToast === "function") {
        window.AndroidBridge.showToast(msg);
      }
      if (window.appendOutputText) {
        window.appendOutputText(`[Extension] ${msg}\n`, type);
      }
    },

    getEditorContent: function() {
      return window.editor ? window.editor.getValue() : "";
    },

    setEditorContent: function(text) {
      if (window.editor) {
        window.editor.setValue(text);
      }
    },

    insertText: function(text) {
      if (window.editor) {
        window.editor.replaceSelection(text);
        if (window.editor.focus) window.editor.focus();
      }
    },

    getActiveFile: function() {
      return window.currentFileName || "main.py";
    },

    // 3. Lo-Fi Radio Player
    toggleLofiRadio: function() {
      if (!lofiAudio) {
        lofiAudio = new Audio("https://live.hunter.fm/lofi_high");
        lofiAudio.volume = 0.6;
        lofiAudio.addEventListener("error", (e) => {
          console.warn("Lo-Fi stream error:", e);
          window.rdeAPI.showNotification("Lo-Fi stream offline", "stderr");
          isLofiPlaying = false;
          updateLofiBtn();
        });
      }

      if (isLofiPlaying) {
        lofiAudio.pause();
        isLofiPlaying = false;
        window.rdeAPI.showNotification("Lo-Fi Radio Paused");
      } else {
        lofiAudio.play().then(() => {
          isLofiPlaying = true;
          window.rdeAPI.showNotification("Lo-Fi Beats Playing...");
        }).catch(() => {
          window.rdeAPI.showNotification("Tap again to play Lo-Fi");
        });
      }
      updateLofiBtn();
    },

    isLofiActive: function() {
      return isLofiPlaying;
    },

    // 4. Marketplace API
    getCatalog: function() {
      return catalog;
    },

    installExtension: function(id) {
      const ext = catalog.find(p => p.id === id);
      if (!ext) return;
      unmarkPluginUninstalled(id);
      ext.isInstalled = true;
      ext.isEnabled = true;
      saveCatalog();
      if (typeof ext.init === "function") ext.init(window.rdeAPI);
      window.rdeAPI.showNotification(`Installed "${ext.name}"!`, "success");
      renderMarketplaceUI();
    },

    uninstallExtension: function(id) {
      window.rdeAPI.unregisterPlugin(id);
      markPluginUninstalled(id);
      removeCustomPlugin(id);

      const isDefault = DEFAULT_CATALOG.some(d => d.id === id);
      const ext = catalog.find(p => p.id === id);
      const pluginName = ext ? ext.name : id;

      if (isDefault) {
        if (ext) {
          ext.isInstalled = false;
          ext.isEnabled = false;
        }
      } else {
        // Custom plugin: remove completely from catalog
        catalog = catalog.filter(p => p.id !== id);
      }
      saveCatalog();
      window.rdeAPI.showNotification(`Плагин "${pluginName}" удалён.`, "info");
      renderMarketplaceUI();
    },

    toggleExtension: function(id, enable) {
      const ext = catalog.find(p => p.id === id);
      if (!ext) return;
      ext.isEnabled = enable;
      saveCatalog();
      if (enable) {
        // Clean any leftover buttons before re-initializing
        document.querySelectorAll(`#custom-plugin-actions [data-plugin-id="${id}"]`).forEach(btn => btn.remove());
        if (typeof ext.init === "function") {
          currentRegisteringPluginId = id;
          try {
            ext.init(window.rdeAPI);
          } finally {
            currentRegisteringPluginId = null;
          }
        }
        window.rdeAPI.showNotification(`Enabled "${ext.name}".`, "success");
      } else {
        if (typeof ext.cleanup === "function") {
          try { ext.cleanup(); } catch (_) {}
        }
        document.querySelectorAll(`#custom-plugin-actions [data-plugin-id="${id}"]`).forEach(btn => btn.remove());
        window.rdeAPI.showNotification(`Disabled "${ext.name}".`, "info");
      }
      renderMarketplaceUI();
    }
  };

  function updateLofiBtn() {
    const btn = document.getElementById("btn-lofi-toggle");
    if (btn) {
      btn.style.color = isLofiPlaying ? "var(--accent-cyan)" : "var(--text-bright)";
      btn.style.borderColor = isLofiPlaying ? "var(--accent-cyan)" : "var(--border-color)";
    }
    const stat = document.getElementById("sb-plugin-stat");
    if (stat) {
      stat.textContent = isLofiPlaying ? "Lo-Fi ON" : "Exec: 0ms";
    }
  }

  // --- MARKETPLACE MODAL RENDERING ---
  let activeTab = "all"; // 'all', 'installed', or 'import'

  function importCustomScript(scriptCode, fileName = "plugin.js") {
    if (!scriptCode || !scriptCode.trim()) return;
    lastRegisteredPluginId = null;
    isExplicitImportInProgress = true;
    try {
      new Function(scriptCode)();
      const pluginId = lastRegisteredPluginId;
      if (pluginId) {
        unmarkPluginUninstalled(pluginId);
        saveCustomPlugin(pluginId, scriptCode, fileName);
        window.rdeAPI.showNotification(`Импортирован плагин "${fileName}"!`, "success");
      } else {
        window.rdeAPI.showNotification(`Скрипт "${fileName}" выполнен.`, "info");
      }
    } catch (err) {
      window.rdeAPI.showNotification(`Ошибка выполнения плагина: ${err.message}`, "stderr");
    } finally {
      isExplicitImportInProgress = false;
    }
  }

  function renderMarketplaceUI() {
    const container = document.getElementById("marketplace-list");
    const importContainer = document.getElementById("marketplace-import-container");
    const searchRow = document.getElementById("marketplace-search-row");
    if (!container) return;

    if (activeTab === "import") {
      container.style.display = "none";
      if (searchRow) searchRow.style.display = "none";
      if (importContainer) importContainer.style.display = "flex";
      return;
    }

    container.style.display = "block";
    if (searchRow) searchRow.style.display = "flex";
    if (importContainer) importContainer.style.display = "none";
    container.innerHTML = "";

    const searchQuery = (document.getElementById("marketplace-search")?.value || "").toLowerCase().trim();

    const filtered = catalog.filter(ext => {
      const matchesTab = activeTab === "all" ? true : ext.isInstalled;
      const matchesSearch = ext.name.toLowerCase().includes(searchQuery) || ext.description.toLowerCase().includes(searchQuery);
      return matchesTab && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No extensions found</div>`;
      return;
    }

    filtered.forEach(ext => {
      const card = document.createElement("div");
      card.className = "extension-card";

      card.innerHTML = `
        <div class="ext-header">
          <div class="ext-title-group">
            <span class="ext-icon">${ext.icon}</span>
            <div>
              <div class="ext-title">${ext.name} <span class="ext-version">v${ext.version}</span></div>
              <div class="ext-author">by ${ext.author}</div>
            </div>
          </div>
          <div class="ext-controls">
            ${ext.isInstalled ? `
              <button class="ext-btn ${ext.isEnabled ? 'btn-active' : ''}" data-action="toggle" data-id="${ext.id}">
                ${ext.isEnabled ? 'Enabled' : 'Disabled'}
              </button>
              <button class="ext-btn btn-danger" data-action="uninstall" data-id="${ext.id}">Delete</button>
            ` : `
              <button class="ext-btn btn-install" data-action="install" data-id="${ext.id}">Install</button>
            `}
          </div>
        </div>
        <div class="ext-desc">${ext.description}</div>
      `;

      container.appendChild(card);
    });

    // Bind card buttons
    container.querySelectorAll("button[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        const id = btn.getAttribute("data-id");
        if (action === "install") {
          window.rdeAPI.installExtension(id);
        } else if (action === "uninstall") {
          window.rdeAPI.uninstallExtension(id);
        } else if (action === "toggle") {
          const ext = catalog.find(p => p.id === id);
          if (ext) window.rdeAPI.toggleExtension(id, !ext.isEnabled);
        }
      });
    });
  }

  // --- INITIALIZE ENABLED EXTENSIONS ---
  window.addEventListener("DOMContentLoaded", () => {
    // 1. Purge obsolete unkeyed scripts storage
    localStorage.removeItem("rde_user_custom_plugins_scripts_v1");

    // 2. Run enabled built-in plugins (strictly skipping any uninstalled plugins)
    catalog.forEach(ext => {
      if (ext.isInstalled && ext.isEnabled && !isPluginUninstalled(ext.id) && typeof ext.init === "function") {
        currentRegisteringPluginId = ext.id;
        try {
          ext.init(window.rdeAPI);
        } catch (e) {
          console.warn("Init error:", e);
        } finally {
          currentRegisteringPluginId = null;
        }
      }
    });

    // 3. Run stored custom plugin scripts (strictly checking they were NOT uninstalled)
    try {
      const customPlugins = JSON.parse(localStorage.getItem(CUSTOM_PLUGINS_META_KEY) || "[]");
      customPlugins.forEach(item => {
        if (!item || !item.id || isPluginUninstalled(item.id)) return;
        try {
          new Function(item.code)();
        } catch (e) {
          console.warn("Failed executing stored custom plugin:", e);
        }
      });
    } catch (_) {}

    // Marketplace triggers
    const modal = document.getElementById("marketplace-modal");
    document.getElementById("btn-open-marketplace")?.addEventListener("click", () => {
      modal.style.display = "flex";
      renderMarketplaceUI();
    });

    document.getElementById("act-marketplace")?.addEventListener("click", () => {
      modal.style.display = "flex";
      renderMarketplaceUI();
    });

    document.getElementById("btn-close-marketplace")?.addEventListener("click", () => {
      modal.style.display = "none";
    });

    const tabAll = document.getElementById("marketplace-tab-all");
    const tabInstalled = document.getElementById("marketplace-tab-installed");
    const tabImport = document.getElementById("marketplace-tab-import");

    tabAll?.addEventListener("click", () => {
      activeTab = "all";
      tabAll.classList.add("active");
      tabInstalled?.classList.remove("active");
      tabImport?.classList.remove("active");
      renderMarketplaceUI();
    });

    tabInstalled?.addEventListener("click", () => {
      activeTab = "installed";
      tabInstalled.classList.add("active");
      tabAll?.classList.remove("active");
      tabImport?.classList.remove("active");
      renderMarketplaceUI();
    });

    tabImport?.addEventListener("click", () => {
      activeTab = "import";
      tabImport.classList.add("active");
      tabAll?.classList.remove("active");
      tabInstalled?.classList.remove("active");
      renderMarketplaceUI();
    });

    document.getElementById("marketplace-search")?.addEventListener("input", renderMarketplaceUI);

    // Global callback from Android SAF pickPluginLauncher
    window.onPluginFileImported = function(fileName, code) {
      if (!fileName || !fileName.toLowerCase().endsWith(".js")) {
        window.rdeAPI.showNotification("Выберите файл с расширением .js", "stderr");
        return;
      }
      importCustomScript(code, fileName);
    };

    // Custom Plugin File Picker
    const pluginPicker = document.getElementById("plugin-file-picker");
    document.getElementById("btn-import-plugin-file")?.addEventListener("click", () => {
      if (window.AndroidBridge && typeof window.AndroidBridge.pickPluginJsFile === "function") {
        window.AndroidBridge.pickPluginJsFile();
      } else {
        pluginPicker?.click();
      }
    });

    pluginPicker?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".js")) {
        window.rdeAPI.showNotification("Выберите файл с расширением .js", "stderr");
        pluginPicker.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        importCustomScript(event.target.result, file.name);
      };
      reader.readAsText(file);
      pluginPicker.value = "";
    });

    // Custom Plugin Code Evaluation
    document.getElementById("btn-eval-custom-plugin")?.addEventListener("click", () => {
      const textarea = document.getElementById("custom-plugin-code");
      if (!textarea || !textarea.value.trim()) return;
      const code = textarea.value.trim();
      importCustomScript(code, "pasted_script.js");
      textarea.value = "";
    });

    // Load sample my_plugin.js
    document.getElementById("btn-load-sample-plugin")?.addEventListener("click", () => {
      fetch("my_plugin.js")
        .then(res => res.text())
        .then(code => {
          importCustomScript(code, "my_plugin.js");
        })
        .catch(err => {
          window.rdeAPI.showNotification(`Load error: ${err.message}`, "stderr");
        });
    });
  });
})();
