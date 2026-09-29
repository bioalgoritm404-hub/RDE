/**
 * ====================================================================
 * RDE (RayVen Development Environment) - Plugin Template & Guide
 * ====================================================================
 *
 * This file demonstrates how to build and register custom extensions
 * using the window.rdeAPI interface.
 *
 * Available RDE API methods:
 * --------------------------------------------------------------------
 * - api.registerPlugin(manifest) : Registers an extension into RDE.
 * - api.addToolbarButton(config) : Adds an action icon button to the top toolbar.
 *     config: { id, title, iconHtml, onClick: (api) => void }
 * - api.showNotification(msg, type) : Shows a native Android Toast and console log.
 *     type: "info" | "success" | "stderr"
 * - api.insertText(text) : Inserts text at the current cursor position in the editor.
 * - api.getEditorContent() : Returns current active file text as string.
 * - api.setEditorContent(text) : Overwrites active file text with new string.
 * - api.getActiveFile() : Returns current active filename (e.g. "main.py").
 * - api.toggleLofiRadio() : Toggles background Lo-Fi coding audio stream.
 * - api.isLofiActive() : Returns boolean audio stream status.
 * ====================================================================
 */

(function() {
  const samplePluginManifest = {
    // Unique identifier for the plugin
    id: "com.user.myplugin",
    name: "Quick Header & Docstring Tool",
    author: "Developer",
    version: "1.0.0",
    description: "Inserts standard PEP-8 headers and demonstrates custom toolbar buttons and notifications.",

    // Vector SVG icon for the Marketplace card (no emojis allowed)
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,

    isInstalled: true,
    isEnabled: true,

    /**
     * Called when the plugin is initialized or enabled
     */
    init: function(api) {
      // 1. Add a custom action button to the top header toolbar
      api.addToolbarButton({
        id: "btn-my-plugin-header",
        title: "Insert Header Docstring (My Plugin)",
        iconHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
        onClick: (rde) => {
          const fileName = rde.getActiveFile();
          const timestamp = new Date().toISOString().split("T")[0];

          // 2. Insert custom template at editor cursor
          const docstring = `"""\nProject: ${fileName}\nAuthor: RayVen Developer\nDate: ${timestamp}\nDescription: Autonomous Python module.\n"""\n\n`;
          rde.insertText(docstring);

          // 3. Show native toast notification & console message
          rde.showNotification(`Inserted standard header into ${fileName}!`, "success");
        }
      });
    },

    /**
     * Called when the plugin is uninstalled or disabled
     */
    cleanup: function() {
      // Remove any elements created by the plugin
      const btn = document.getElementById("btn-my-plugin-header");
      if (btn) btn.remove();
    }
  };

  // Register with RDE if API is already ready, or wait for DOMContentLoaded
  if (window.rdeAPI && typeof window.rdeAPI.registerPlugin === "function") {
    window.rdeAPI.registerPlugin(samplePluginManifest);
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      if (window.rdeAPI && typeof window.rdeAPI.registerPlugin === "function") {
        window.rdeAPI.registerPlugin(samplePluginManifest);
      }
    });
  }
})();
