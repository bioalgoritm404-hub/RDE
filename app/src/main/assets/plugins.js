/**
 * RDE Plugin System Architecture (window.rdeAPI)
 */
(function() {
  const plugins = new Map();
  let lofiAudio = null;
  let isLofiPlaying = false;

  window.rdeAPI = {
    // 1. Plugin Registration
    registerPlugin: function(manifest) {
      if (!manifest || !manifest.id) return;
      plugins.set(manifest.id, manifest);
      if (typeof manifest.init === "function") {
        manifest.init(window.rdeAPI);
      }
      console.log(`[rdeAPI] Plugin registered: ${manifest.name || manifest.id}`);
    },

    // 2. Toolbar & UI Extension
    addToolbarButton: function(config) {
      const container = document.getElementById("custom-plugin-actions");
      if (!container) return;
      const btn = document.createElement("button");
      btn.className = "icon-btn";
      btn.id = config.id || `btn-plugin-${Date.now()}`;
      btn.title = config.title || "";
      btn.innerHTML = config.iconHtml || "⚡";
      if (typeof config.onClick === "function") {
        btn.addEventListener("click", () => config.onClick(window.rdeAPI));
      }
      container.appendChild(btn);
      return btn;
    },

    // 3. Notification & Toast
    showNotification: function(msg, type = "info") {
      if (window.AndroidBridge && typeof window.AndroidBridge.showToast === "function") {
        window.AndroidBridge.showToast(msg);
      }
      if (window.appendOutputText) {
        window.appendOutputText(`[RDE Plugin] ${msg}\n`, type);
      }
    },

    // 4. Editor Access
    getEditorContent: function() {
      return window.editor ? window.editor.getValue() : "";
    },

    setEditorContent: function(text) {
      if (window.editor) {
        window.editor.setValue(text);
      }
    },

    getActiveFile: function() {
      return window.currentFileName || "main.py";
    },

    // 5. Lo-Fi Radio Player
    toggleLofiRadio: function() {
      if (!lofiAudio) {
        lofiAudio = new Audio("https://live.hunter.fm/lofi_high");
        lofiAudio.volume = 0.6;
        lofiAudio.addEventListener("error", (e) => {
          console.warn("Lo-Fi stream error:", e);
          window.rdeAPI.showNotification("Lo-Fi stream unavailable offline", "stderr");
          isLofiPlaying = false;
          updateLofiBtn();
        });
      }

      if (isLofiPlaying) {
        lofiAudio.pause();
        isLofiPlaying = false;
        window.rdeAPI.showNotification("🎵 Lo-Fi Radio Paused");
      } else {
        lofiAudio.play().then(() => {
          isLofiPlaying = true;
          window.rdeAPI.showNotification("🎵 Lo-Fi Coding Beats Playing...");
        }).catch(err => {
          console.warn("Lo-Fi play error:", err);
          window.rdeAPI.showNotification("Tap again to play Lo-Fi Radio");
        });
      }
      updateLofiBtn();
    },

    isLofiActive: function() {
      return isLofiPlaying;
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
      stat.textContent = isLofiPlaying ? "🎵 Lo-Fi ON" : "⏱️ Exec: 0ms";
    }
  }

  // Pre-register Lo-Fi Music Plugin
  window.addEventListener("DOMContentLoaded", () => {
    window.rdeAPI.registerPlugin({
      id: "rde.lofi.radio",
      name: "Lo-Fi Coding Beats",
      version: "1.0.0",
      init: function(api) {
        const btn = api.addToolbarButton({
          id: "btn-lofi-toggle",
          title: "Lo-Fi Background Coding Radio",
          iconHtml: "🎵",
          onClick: () => api.toggleLofiRadio()
        });
      }
    });
  });
})();
