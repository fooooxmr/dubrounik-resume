(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const state = {
    lang: localStorage.getItem('resume-lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en'),
    activeFile: 'resume',
    openTabs: ['resume'],
    breakpointLine: null,
    sidePanelOpen: true
  };

  const FILE_KEYS = {
    resume: 'files.resume',
    experience: 'files.experience',
    skills: 'files.skills',
    projects: 'files.projects',
    contact: 'files.contact',
    spec: 'files.spec'
  };

  function t(path) {
    const parts = path.split('.');
    let obj = I18N[state.lang];
    for (const p of parts) obj = obj?.[p];
    return obj ?? path;
  }

  function applyI18n() {
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val) el.textContent = val;
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.documentElement.lang = state.lang;
  }

  function renderSyntax(line) {
    if (line.t === 'empty') return '&nbsp;';
    if (line.t === 'cmt') return `<span class="cmt">${esc(line.s)}</span>`;
    return line.s.replace(/<(\w+)>/g, (_, cls) => `<span class="${cls}">`).replace(/<\/\w+>/g, '</span>');
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderEditor(fileKey) {
    const lines = CODE_FILES[fileKey]?.[state.lang] || [];
    const editor = $('#editor');
    const gutter = $('#gutter');
    const hireLine = lines.findIndex(l => l.s?.includes('hire!') || l.s?.includes('нанять!') || l.s?.includes('reach_out') || l.s?.includes('связаться'));

    editor.innerHTML = lines.map((line, i) => {
      const n = i + 1;
      const cls = state.breakpointLine === n ? 'line highlight' : 'line';
      return `<span class="${cls}" data-line="${n}">${renderSyntax(line)}</span>`;
    }).join('\n');

    gutter.innerHTML = lines.map((_, i) => {
      const n = i + 1;
      const isBp = (fileKey === 'resume' || fileKey === 'contact') && (n === hireLine + 1 || n === hireLine);
      const bp = isBp ? `<span class="bp${state.breakpointLine === n ? ' active' : ''}" data-bp="${n}"></span>` : '';
      return `<span class="ln${n === 1 ? ' current' : ''}" data-ln="${n}">${bp}${n}</span>`;
    }).join('');

    renderMinimap(lines);
    updateBreadcrumbs(fileKey);
    bindEditorEvents(fileKey);
  }

  function renderMinimap(lines) {
    const mm = $('#minimap');
    if (!mm) return;
    const total = lines.length || 1;
    mm.innerHTML = lines.map((line, i) => {
      let color = '#4a4a4a';
      if (line.t === 'cmt') color = '#3d4a3d';
      else if (line.s?.includes('cls')) color = '#6b5a3a';
      else if (line.s?.includes('kw')) color = '#5a3d2a';
      else if (line.s?.includes('str')) color = '#3a5a3a';
      const top = (i / total) * 100;
      const h = Math.max(1.5, (1 / total) * 100);
      return `<div class="minimap-block" style="top:${top}%;height:${h}%;background:${color}"></div>`;
    }).join('') + '<div class="minimap-viewport" style="top:0;height:30%"></div>';
  }

  function updateBreadcrumbs(fileKey) {
    const bc = $('#breadcrumbs');
    const path = t(FILE_KEYS[fileKey] || 'files.resume');
    const parts = path.split('/');
    bc.innerHTML = parts.map((p, i) =>
      i === parts.length - 1 ? `<span class="bc-active">${p}</span>` : `<span>${p}</span>`
    ).join(' › ');
  }

  function renderTabs() {
    const tabs = $('#tabs');
    tabs.innerHTML = state.openTabs.map(key => {
      const name = t(FILE_KEYS[key] || key).split('/').pop();
      const active = key === state.activeFile ? 'active' : '';
      return `<button class="tab ${active}" data-tab="${key}"><span class="icon">◆</span>${name}<span class="close" data-close="${key}">×</span></button>`;
    }).join('');
  }

  function openFile(key) {
    if (!CODE_FILES[key]) return;
    if (!state.openTabs.includes(key)) state.openTabs.push(key);
    state.activeFile = key;
    renderTabs();
    renderEditor(key);
    updatePanelTitle('project');
  }

  function renderProjectTree() {
    const f = I18N[state.lang].files;
    const tr = I18N[state.lang].tree;
    const tree = [
      { id: 'root', label: f.root, type: 'folder', open: true, children: [
        { id: 'resume', label: f.resume, type: 'ruby', file: 'resume' },
        { id: 'app', label: tr.app, type: 'folder', open: true, children: [
          { id: 'models', label: tr.models, type: 'folder', open: true, children: [
            { id: 'experience', label: 'experience.rb', type: 'ruby', file: 'experience' },
            { id: 'projects', label: 'projects.rb', type: 'ruby', file: 'projects' }
          ]},
          { id: 'services', label: tr.services, type: 'folder', open: true, children: [
            { id: 'skills', label: 'skills_engine.rb', type: 'ruby', file: 'skills' }
          ]},
          { id: 'controllers', label: tr.controllers, type: 'folder', open: true, children: [
            { id: 'contact', label: 'contact_controller.rb', type: 'ruby', file: 'contact' }
          ]}
        ]},
        { id: 'config', label: tr.config, type: 'folder', open: false, children: [
          { id: 'locales', label: tr.locales, type: 'folder', open: false, children: [
            { id: 'en', label: 'en.yml', type: 'file', file: 'resume' },
            { id: 'ru', label: 'ru.yml', type: 'file', file: 'resume' }
          ]}
        ]},
        { id: 'spec', label: tr.spec, type: 'folder', open: false, children: [
          { id: 'specfile', label: 'achievements_spec.rb', type: 'ruby', file: 'spec' }
        ]},
        { id: 'readme', label: f.readme, type: 'file', file: 'resume' },
        { id: 'gemfile', label: f.gemfile, type: 'file', file: 'skills' }
      ]}
    ];

    function renderNode(node, depth = 0) {
      const indent = depth * 14 + 8;
      const icon = node.type === 'folder' ? (node.open ? '▼' : '▶') : (node.type === 'ruby' ? '◆' : '📄');
      const chevron = node.type === 'folder' ? '<span class="chevron">▶</span>' : '<span class="chevron"></span>';
      const active = node.file === state.activeFile ? 'active' : '';
      const openCls = node.open ? 'open' : '';
      let html = `<div class="tree-item ${node.type} ${active} ${openCls}" style="--indent:${indent}px" data-file="${node.file || ''}" data-folder="${node.id}">${chevron}<span class="icon">${icon}</span>${node.label}</div>`;
      if (node.open && node.children) {
        html += node.children.map(c => renderNode(c, depth + 1)).join('');
      }
      return html;
    }

    $('#panelContent').innerHTML = tree.map(n => renderNode(n)).join('');
  }

  function renderGitLog() {
    const entries = t('gitLog');
    return entries.map(e => `
      <div class="git-entry" data-hash="${e.hash}">
        <span class="git-hash">${e.hash}</span>
        <span class="git-msg">${e.msg}</span>
        <span class="git-date">${e.date}</span>
      </div>
    `).join('');
  }

  function renderRunOutput() {
    const run = t('run');
    return `<div class="run-line info">${run.title}</div>` +
      run.lines.map(l => `<div class="run-line run-${l.status}">${l.status === 'pass' ? '✓' : '✗'} ${l.text}</div>`).join('');
  }

  function renderProblems() {
    return t('problems').map(p => `
      <div class="problem-item"><span class="problem-icon">${p.icon}</span><span>${p.text}</span></div>
    `).join('');
  }

  function renderServices() {
    return t('services').map(s => `
      <div class="service-card"><span class="service-dot"></span><span>${s.name}</span><span style="color:var(--green);margin-left:auto">${s.status}</span></div>
    `).join('');
  }

  function initToolWindows() {
    $('#tw-run').innerHTML = renderRunOutput();
    $('#tw-problems').innerHTML = renderProblems();
    $('#tw-git-log').innerHTML = renderGitLog();
    $('#tw-services').innerHTML = renderServices();
    termPrint(t('terminal.welcome'), 'info');
  }

  function termPrint(text, cls = '') {
    const out = $('#terminalOutput');
    text.split('\n').forEach(line => {
      out.innerHTML += `<div class="line-out ${cls}">${esc(line)}</div>`;
    });
    out.scrollTop = out.scrollHeight;
  }

  function handleTerminalCommand(cmd) {
    const c = cmd.trim().toLowerCase();
    if (!c) return;
    termPrint(`➜ ${cmd}`, 'cmd');

    const map = {
      help: () => t('terminal.help'),
      whoami: () => t('terminal.whoami'),
      skills: () => t('terminal.skills'),
      projects: () => { openFile('projects'); return t('terminal.skills').split(',')[0] + '… → opening projects.rb'; },
      experience: () => { openFile('experience'); return '→ opening experience.rb'; },
      education: () => t('terminal.education'),
      hobbies: () => t('terminal.hobbies'),
      run: () => { runSpecs(); return t('terminal.run'); },
      debug: () => { setTimeout(() => showContact(), 400); return t('terminal.debug'); },
      hire: () => { setTimeout(() => showContact(), 300); return t('terminal.hire'); },
      clear: () => { $('#terminalOutput').innerHTML = ''; return null; },
      lang: () => { toggleLang(); return `→ ${state.lang.toUpperCase()}`; },
      ls: () => 'dubrounik.resume.rb  app/  config/  spec/  Gemfile  README.md',
      pwd: () => '/Users/artsiom/dubrounik.resume',
      ruby: () => 'ruby 3.3.0 (2024-04-23 revision aab39f6a7d) [arm64-darwin]',
      bundle: () => c.includes('hire') ? (showContact(), 'Contact channels deployed.') : 'Could not find gem dubrounik in locally installed gems.',
      exit: () => 'There is no escape from excellence.',
      debugger: () => (showContact(), 'Breakpoint triggered.')
    };

    const fn = map[c] || map[c.split(' ')[0]];
    if (fn) {
      const result = fn();
      if (result) termPrint(result, c === 'run' ? 'success' : '');
    } else {
      termPrint(t('terminal.unknown'), 'error');
    }
  }

  function runSpecs() {
    switchToolTab('run');
    const runPane = $('#tw-run');
    runPane.innerHTML = renderRunOutput();
    $('#ide').classList.add('glitch');
    setTimeout(() => $('#ide').classList.remove('glitch'), 300);
  }

  function showContact() {
    $('#contactOverlay').classList.remove('hidden');
  }

  function hideOverlays() {
    $$('.overlay').forEach(o => o.classList.add('hidden'));
  }

  function toggleLang() {
    state.lang = state.lang === 'en' ? 'ru' : 'en';
    localStorage.setItem('resume-lang', state.lang);
    applyI18n();
    renderTabs();
    renderEditor(state.activeFile);
    renderProjectTree();
    $('#tw-run').innerHTML = renderRunOutput();
    $('#tw-problems').innerHTML = renderProblems();
    $('#tw-git-log').innerHTML = renderGitLog();
    $('#tw-services').innerHTML = renderServices();
    renderPalette($('#paletteInput')?.value || '');
  }

  function switchToolTab(name) {
    $$('.tw-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tw === name));
    $$('.tw-pane').forEach(pane => pane.classList.remove('active'));
    const pane = $(`#tw-${name}`);
    if (pane) pane.classList.add('active');
  }

  function updatePanelTitle(panel) {
    const titles = { project: 'panel.project', git: 'panel.git', structure: 'panel.structure', terminal: 'panel.terminal', contact: 'panel.contact' };
    $('#panelTitle').textContent = t(titles[panel] || 'panel.project');
    if (panel === 'project' || panel === 'structure') renderProjectTree();
    if (panel === 'git') $('#panelContent').innerHTML = renderGitLog();
    if (panel === 'contact') showContact();
  }

  function renderPalette(query = '') {
    const items = t('paletteItems');
    const q = query.toLowerCase();
    const filtered = items.filter(i => !q || i.label.toLowerCase().includes(q));
    $('#paletteResults').innerHTML = filtered.map(i =>
      `<li data-action="${i.action}"><span>${i.label}</span>${i.shortcut ? `<span class="shortcut">${i.shortcut}</span>` : ''}</li>`
    ).join('');
  }

  function handlePaletteAction(action) {
    hideOverlays();
    if (action.startsWith('file:')) openFile(action.split(':')[1]);
    else if (action === 'run') runSpecs();
    else if (action === 'contact') showContact();
    else if (action === 'search') { $('#searchOverlay').classList.remove('hidden'); $('#searchInput').focus(); }
    else if (action === 'lang') toggleLang();
    else if (action === 'terminal') switchToolTab('terminal');
    else if (action === 'gitlog') switchToolTab('git-log');
  }

  function renderSearchResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) { $('#searchResults').innerHTML = ''; return; }
    const results = SEARCH_INDEX.filter(item => item.q.includes(q) || q.split(' ').some(w => item.q.includes(w)));
    $('#searchResults').innerHTML = results.map(r => {
      const file = Object.keys(CODE_FILES).find(k => k === r.file) || 'resume';
      const label = t(FILE_KEYS[file]);
      return `<li data-search-file="${file}" data-line="${r.line}"><span>${label}:${r.line}</span><span style="color:var(--text-dim)">${r.q.split(' ')[0]}…</span></li>`;
    }).join('') || `<li style="color:var(--text-dim)">No matches</li>`;
  }

  function bindEditorEvents(fileKey) {
    const editor = $('#editor');
    editor.onscroll = () => {
      gutter.scrollTop = editor.scrollTop;
      const lines = editor.querySelectorAll('.line');
      const rect = editor.getBoundingClientRect();
      for (const line of lines) {
        const lr = line.getBoundingClientRect();
        if (lr.top >= rect.top && lr.top < rect.top + 24) {
          const n = +line.dataset.line;
          $$('#gutter .ln').forEach(l => l.classList.toggle('current', +l.dataset.ln === n));
          $('#sbPos').textContent = `Ln ${n}, Col 1`;
          break;
        }
      }
    };

    $$('#gutter .bp').forEach(bp => {
      bp.onclick = () => {
        state.breakpointLine = +bp.dataset.bp;
        renderEditor(fileKey);
        setTimeout(showContact, 500);
      };
    });

    editor.querySelectorAll('.cls, .mth').forEach(el => {
      el.onmouseenter = e => showTooltip(e, el.classList.contains('cls') ? t('tooltip.class') : t('tooltip.method'));
      el.onmouseleave = hideTooltip;
    });
  }

  function showTooltip(e, text) {
    const tt = $('#tooltip');
    tt.innerHTML = `<div class="tt-body">${text}</div>`;
    tt.classList.remove('hidden');
    tt.style.left = Math.min(e.clientX + 12, window.innerWidth - 380) + 'px';
    tt.style.top = (e.clientY + 16) + 'px';
  }

  function hideTooltip() { $('#tooltip').classList.add('hidden'); }

  function dismissSplash() {
    const splash = $('#splash');
    if (splash.classList.contains('fade-out')) return;
    splash.classList.add('fade-out');
    $('#ide').classList.remove('hidden');
    setTimeout(() => { splash.remove(); }, 700);
  }

  function initSplash() {
    const dismiss = () => dismissSplash();
    setTimeout(dismiss, 2800);
    document.addEventListener('keydown', dismiss, { once: true });
    document.addEventListener('click', dismiss, { once: true });
  }

  function initEvents() {
    $('#langToggle').onclick = toggleLang;
    $('#runBtn').onclick = runSpecs;
    $('#debugBtn').onclick = () => { state.breakpointLine = 38; renderEditor(state.activeFile); setTimeout(showContact, 600); };
    $('#searchBtn').onclick = () => { $('#searchOverlay').classList.remove('hidden'); $('#searchInput').focus(); };
    $('#paletteBtn').onclick = () => { $('#paletteOverlay').classList.remove('hidden'); $('#paletteInput').value = ''; renderPalette(); $('#paletteInput').focus(); };

    $('#tabs').onclick = e => {
      const close = e.target.dataset.close;
      if (close) {
        state.openTabs = state.openTabs.filter(t => t !== close);
        if (state.activeFile === close) state.activeFile = state.openTabs[state.openTabs.length - 1] || 'resume';
        if (!state.openTabs.length) state.openTabs = ['resume'];
        renderTabs();
        renderEditor(state.activeFile);
        return;
      }
      const tab = e.target.closest('[data-tab]');
      if (tab) openFile(tab.dataset.tab);
    };

    $('#panelContent').onclick = e => {
      const item = e.target.closest('.tree-item');
      if (!item) return;
      if (item.dataset.folder && !item.dataset.file) {
        item.classList.toggle('open');
        renderProjectTree();
        return;
      }
      if (item.dataset.file) openFile(item.dataset.file);
    };

    $$('.ab-btn').forEach(btn => {
      btn.onclick = () => {
        $$('.ab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panel = btn.dataset.panel;
        if (panel === 'terminal') switchToolTab('terminal');
        else if (panel === 'contact') showContact();
        else {
          $('#sidePanel').classList.add('mobile-open');
          updatePanelTitle(panel === 'git' ? 'git' : panel === 'structure' ? 'structure' : 'project');
        }
      };
    });

    $('#panelClose').onclick = () => $('#sidePanel').classList.remove('mobile-open');

    $$('.tw-tab').forEach(tab => tab.onclick = () => switchToolTab(tab.dataset.tw));

    $('#terminalInput').onkeydown = e => {
      if (e.key === 'Enter') {
        handleTerminalCommand(e.target.value);
        e.target.value = '';
      }
    };

    $('#paletteInput').oninput = e => renderPalette(e.target.value);
    $('#paletteResults').onclick = e => {
      const li = e.target.closest('[data-action]');
      if (li) handlePaletteAction(li.dataset.action);
    };

    $('#searchInput').oninput = e => renderSearchResults(e.target.value);
    $('#searchResults').onclick = e => {
      const li = e.target.closest('[data-search-file]');
      if (li) { hideOverlays(); openFile(li.dataset.searchFile); }
    };

    $$('.overlay').forEach(o => o.onclick = e => { if (e.target === o) hideOverlays(); });
    $$('[data-close]').forEach(b => b.onclick = () => hideOverlays());

    $$('.menu-item').forEach(btn => {
      btn.onclick = () => {
        const menu = btn.dataset.menu;
        if (menu === 'run') runSpecs();
        else if (menu === 'help' || menu === 'navigate') { $('#paletteOverlay').classList.remove('hidden'); renderPalette(); $('#paletteInput').focus(); }
        else if (menu === 'refactor') toggleLang();
        else if (menu === 'git') { switchToolTab('git-log'); updatePanelTitle('git'); }
        else if (menu === 'tools') switchToolTab('services');
      };
    });

    $$('.titlebar .dot').forEach(dot => {
      dot.onclick = () => {
        if (dot.dataset.action === 'close') showContact();
        else if (dot.dataset.action === 'minimize') switchToolTab('terminal');
        else runSpecs();
      };
    });

    $$('#mobileNav button').forEach(btn => {
      btn.onclick = () => {
        $$('#mobileNav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mobile;
        $('#sidePanel').classList.remove('mobile-open');
        if (mode === 'editor') { /* default */ }
        else if (mode === 'project') { $('#sidePanel').classList.add('mobile-open'); updatePanelTitle('project'); }
        else if (mode === 'terminal') switchToolTab('terminal');
        else if (mode === 'contact') showContact();
      };
    });

    document.onkeydown = e => {
      if (e.key === 'Escape') hideOverlays();
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') { e.preventDefault(); toggleLang(); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') { e.preventDefault(); $('#searchOverlay').classList.remove('hidden'); $('#searchInput').focus(); }
      if (e.shiftKey && e.key === 'Shift' && !$('#paletteOverlay').classList.contains('hidden') === false) {
        // double-shift handled below
      }
    };

    let lastShift = 0;
    document.addEventListener('keydown', e => {
      if (e.key === 'Shift') {
        const now = Date.now();
        if (now - lastShift < 400) {
          $('#paletteOverlay').classList.remove('hidden');
          renderPalette();
          $('#paletteInput').focus();
        }
        lastShift = now;
      }
    });

    // Tool window resize
    let resizing = false;
    $('#twResize').onmousedown = () => { resizing = true; };
    document.onmousemove = e => {
      if (!resizing) return;
      const ide = $('#ide');
      const rect = ide.getBoundingClientRect();
      const newH = rect.bottom - e.clientY - 22;
      document.documentElement.style.setProperty('--tool-h', Math.max(100, Math.min(newH, window.innerHeight * 0.5)) + 'px');
    };
    document.onmouseup = () => { resizing = false; };
  }

  function init() {
    applyI18n();
    renderTabs();
    renderEditor('resume');
    renderProjectTree();
    initToolWindows();
    initSplash();
    initEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
