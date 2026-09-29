(function() {
  const samplePluginManifest = {
    id: "com.user.myplugin",
    name: "Quick Header & Docstring Tool",
    author: "Developer",
    version: "1.0.0",
    description: "Inserts standard PEP-8 headers and demonstrates custom toolbar buttons and notifications.",

    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,

    isInstalled: true,
    isEnabled: true,

    init: function(api) {
      api.addToolbarButton({
        id: "btn-my-plugin-header",
        title: "Insert Header Docstring (My Plugin)",
        iconHtml: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
        onClick: (rde) => {
          const fileName = rde.getActiveFile();
          const timestamp = new Date().toISOString().split("T")[0];

          const docstring = `"""\nProject: ${fileName}\nAuthor: RayVen Developer\nDate: ${timestamp}\nDescription: Autonomous Python module.\n"""\n\n`;
          rde.insertText(docstring);

          rde.showNotification(`Inserted standard header into ${fileName}!`, "success");
        }
      });
    },

    cleanup: function() {
      const btn = document.getElementById("btn-my-plugin-header");
      if (btn) btn.remove();
    }
  };

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
