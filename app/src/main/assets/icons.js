/**
 * RDE Vector SVG Icons System (Devicon & VS Code style)
 * Crisp, lightweight, local vectors with zero network dependencies.
 */
const ICONS = {
  // --- File Type Logomarks ---
  python: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11.9 2c-3.1 0-5.1 1.4-5.1 3.2v2.4h5.2v.8H4.7c-2 0-3.7 1.6-3.7 4 0 2.2 1.4 3.7 3.5 3.9h1.7v-2.3c0-2.3 2-4.1 4.3-4.1h5.1V7.5c0-1.8-2.2-5.5-3.7-5.5zm-1.8 1.6a.9.9 0 110 1.8.9.9 0 010-1.8z" fill="#3776ab"/><path d="M12.1 22c3.1 0 5.1-1.4 5.1-3.2v-2.4H12v-.8h7.3c2 0 3.7-1.6 3.7-4 0-2.2-1.4-3.7-3.5-3.9h-1.7v2.3c0 2.3-2 4.1-4.3 4.1H8.4v2.4c0 1.8 2.2 5.5 3.7 5.5zm1.8-1.6a.9.9 0 110-1.8.9.9 0 010 1.8z" fill="#ffd343"/></svg>`,

  html: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 2l1.6 18.2L12 22.5l7.4-2.3L21 2H3z" fill="#e34f26"/><path d="M12 3.8v16.9l5.8-1.8 1.4-15.1H12z" fill="#ef652a"/><path d="M7 6.8h10l-.2 2.6H9.7l.2 2.6h6.8l-.6 6.3L12 19.4l-4.1-1.1-.3-3.2h2.5l.2 1.5 1.7.5 1.7-.5.2-2.1H7.4L7 6.8z" fill="#ffffff"/></svg>`,

  js: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="3" fill="#f7df1e"/><path d="M6.5 17.5c.8 1.3 2 2 3.5 2 2.3 0 3.8-1.4 3.8-3.3v-6.7h-2.3v6.7c0 .9-.6 1.4-1.5 1.4-.9 0-1.5-.5-1.9-1.2l-1.6 1.1zm9 0c.9 1.3 2.3 2 4.1 2 2.6 0 4.4-1.4 4.4-3.5 0-2.1-1.3-3-3.1-3.7l-.8-.3c-.9-.4-1.4-.8-1.4-1.4 0-.6.5-1.1 1.4-1.1.8 0 1.5.3 2 1.1l1.7-1.1c-.8-1.4-2-1.9-3.7-1.9-2.3 0-4 1.4-4 3.4 0 2 1.3 2.9 3.1 3.7l.8.3c1 .4 1.5.8 1.5 1.5 0 .7-.6 1.3-1.6 1.3-1.1 0-1.9-.6-2.4-1.5l-2 1.2z" fill="#000000"/></svg>`,

  css: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 2l1.6 18.2L12 22.5l7.4-2.3L21 2H3z" fill="#1572b6"/><path d="M12 3.8v16.9l5.8-1.8 1.4-15.1H12z" fill="#33a9dc"/><path d="M7 6.8h10l-.2 2.6H9.7l.2 2.6h6.8l-.6 6.3L12 19.4l-4.1-1.1-.3-3.2h2.5l.2 1.5 1.7.5 1.7-.5.2-2.1H7.4L7 6.8z" fill="#ffffff"/></svg>`,

  cpp: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7.2v9.6L12 22l9-5.2V7.2L12 2z" fill="#00599c"/><path d="M12 6.5a5.5 5.5 0 00-4.8 2.8 5.5 5.5 0 000 5.4 5.5 5.5 0 004.8 2.8c2 0 3.7-.9 4.6-2.3l-2-1.2c-.6.8-1.6 1.3-2.6 1.3a3.3 3.3 0 01-3.1-2.1 3.3 3.3 0 010-2.4 3.3 3.3 0 013.1-2.1c1 0 2 .5 2.6 1.3l2-1.2c-.9-1.4-2.6-2.3-4.6-2.3z" fill="#ffffff"/><path d="M17 11h1v-1h1v1h1v1h-1v1h-1v-1h-1v-1zm4 0h1v-1h1v1h1v1h-1v1h-1v-1h-1v-1z" fill="#004482"/></svg>`,

  json: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="3" fill="#252526"/><path d="M7 6c-1 0-2 .8-2 1.8v2.7c0 .8-.6 1.5-1.5 1.5.9 0 1.5.7 1.5 1.5v2.7c0 1 1 1.8 2 1.8h1v-1.8H7v-2c0-.9-.7-1.7-1.6-1.7.9 0 1.6-.8 1.6-1.7V7.8h1V6H7zm10 0h-1v1.8h1v2c0 .9.7 1.7 1.6 1.7-.9 0-1.6.8-1.6 1.7v2h-1v1.8h1c1 0 2-.8 2-1.8v-2.7c0-.8.6-1.5 1.5-1.5-.9 0-1.5-.7-1.5-1.5V7.8c0-1-1-1.8-2-1.8z" fill="#cbcb41"/></svg>`,

  markdown: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" fill="#222" stroke="#42a5f5" stroke-width="1.5"/><path d="M6 15V9h2l2 2.5L12 9h2v6h-2v-3.5L10 14l-2-2.5V15H6zm10-3h1.5V9h2v3H21l-3 4-3-4z" fill="#42a5f5"/></svg>`,

  text: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9da5b4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>`,

  // --- Toolbar & Action Icons ---
  folder: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#dcb67a"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/></svg>`,

  folderOpen: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#dcb67a"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,

  newFolder: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,

  chevronRight: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`,

  chevronDown: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>`,

  save: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,

  saveAs: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,

  marketplace: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,

  lofiRadio: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`,

  search: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,

  settings: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,

  play: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,

  previewGlobe: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

/**
 * Returns crisp SVG logomark for any filename.
 */
function getFileIconSvg(fileName) {
  if (!fileName) return ICONS.text;
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".py")) return ICONS.python;
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return ICONS.html;
  if (lower.endsWith(".js") || lower.endsWith(".mjs")) return ICONS.js;
  if (lower.endsWith(".css")) return ICONS.css;
  if (lower.endsWith(".cpp") || lower.endsWith(".c") || lower.endsWith(".h") || lower.endsWith(".hpp")) return ICONS.cpp;
  if (lower.endsWith(".json")) return ICONS.json;
  if (lower.endsWith(".md")) return ICONS.markdown;
  return ICONS.text;
}
