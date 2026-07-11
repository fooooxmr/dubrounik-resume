(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const state = {
    lang: localStorage.getItem('resume-lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en'),
    activeFile: 'resume',
    activePanel: 'project',
    openTabs: ['resume'],
    openFolders: new Set(['root', 'app', 'models', 'projects', 'services', 'controllers', 'assets']),
    breakpointLine: null,
    irbMode: false,
    irbLine: 1,
    irbCtx: null,
    minimapVisible: true,
    toolWindowVisible: true,
    history: [],
    historyIdx: -1
  };

  function t(path) {
    const parts = path.split('.');
    let obj = I18N[state.lang];
    for (const p of parts) obj = obj?.[p];
    return obj ?? path;
  }

  function applyI18n() {
    $$('[data-i18n]').forEach(el => {
      const val = t(el.dataset.i18n);
      if (val) el.textContent = val;
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.documentElement.lang = state.lang;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderSyntax(line) {
    if (line.t === 'empty') return '&nbsp;';
    if (line.t === 'cmt') return `<span class="cmt">${esc(line.s)}</span>`;
    return line.s.replace(/<(\w+)>/g, (_, cls) => `<span class="${cls}">`).replace(/<\/\w+>/g, '</span>');
  }

  function renderEditor(fileKey) {
    if (fileKey === 'photo') {
      renderPhotoView();
      return;
    }
    const lines = CODE_FILES[fileKey]?.[state.lang] || [];
    const editor = $('#editor');
    const gutter = $('#gutter');
    const hireLine = lines.findIndex(l => l.s?.includes('hire!') || l.s?.includes('нанять!'));

    editor.innerHTML = lines.map((line, i) => {
      const n = i + 1;
      const cls = state.breakpointLine === n ? 'line highlight' : 'line';
      return `<span class="${cls}" data-line="${n}">${renderSyntax(line)}</span>`;
    }).join('\n');

    gutter.innerHTML = lines.map((_, i) => {
      const n = i + 1;
      const isBp = (fileKey === 'resume' || fileKey === 'contact') && n === hireLine + 1;
      const bp = isBp ? `<span class="bp${state.breakpointLine === n ? ' active' : ''}" data-bp="${n}"></span>` : '';
      return `<span class="ln${n === 1 ? ' current' : ''}" data-ln="${n}">${bp}${n}</span>`;
    }).join('');

    $('#minimap')?.classList.toggle('hidden', !state.minimapVisible);
    renderMinimap(lines);
    updateBreadcrumbs(fileKey);
    bindEditorEvents(fileKey);
    if (state.activePanel === 'structure') renderStructurePanel();
  }

  function renderPhotoView() {
    const editor = $('#editor');
    const gutter = $('#gutter');
    gutter.innerHTML = '<span class="ln current">1</span>';
    editor.innerHTML = `
      <div class="photo-view">
        <img src="assets/photo.jpg" alt="Artsiom Dubrounik" class="profile-photo">
        <div class="photo-meta">
          <span class="photo-name">Artsiom Dubrounik</span>
          <span class="photo-role">Senior Software Engineer · Ruby on Rails</span>
          <span class="photo-hint">${state.lang === 'ru' ? 'assets/photo.jpg — GitHub @fooooxmr' : 'assets/photo.jpg — GitHub @fooooxmr'}</span>
        </div>
      </div>`;
    updateBreadcrumbs('photo');
    $('#minimap')?.classList.add('hidden');
  }

  function renderMinimap(lines) {
    const mm = $('#minimap');
    if (!mm || !state.minimapVisible) return;
    const total = lines.length || 1;
    mm.innerHTML = lines.map((line, i) => {
      let color = '#4a4a4a';
      if (line.t === 'cmt') color = '#3d4a3d';
      else if (line.s?.includes('cls')) color = '#6b5a3a';
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
      const name = key === 'photo' ? 'photo.jpg' : t(FILE_KEYS[key] || key).split('/').pop();
      const active = key === state.activeFile ? 'active' : '';
      return `<button class="tab ${active}" data-tab="${key}"><span class="icon">◆</span>${name}<span class="close" data-close="${key}">×</span></button>`;
    }).join('');
  }

  function openFile(key) {
    if (!CODE_FILES[key] && key !== 'photo') return;
    if (!state.openTabs.includes(key)) state.openTabs.push(key);
    state.activeFile = key;
    renderTabs();
    renderEditor(key);
    if (state.activePanel === 'project') renderProjectTree();
    if (state.activePanel === 'structure') renderStructurePanel();
  }

  function getTreeDef() {
    const f = t('files');
    const tr = t('tree');
    const projectChildren = PROJECT_KEYS.map(slug => ({
      id: PROJECTS_DATA[slug].key,
      label: `${PROJECTS_DATA[slug].slug}.rb`,
      type: 'ruby',
      file: PROJECTS_DATA[slug].key
    }));
    return [
      { id: 'root', label: f.root, type: 'folder', children: [
        { id: 'resume', label: f.resume, type: 'ruby', file: 'resume' },
        { id: 'app', label: tr.app, type: 'folder', children: [
          { id: 'models', label: tr.models, type: 'folder', children: [
            { id: 'experience', label: 'experience.rb', type: 'ruby', file: 'experience' },
            { id: 'education', label: 'education.rb', type: 'ruby', file: 'education' },
            { id: 'projects-folder', label: tr.projects, type: 'folder', children: [
              { id: 'projects-index', label: 'projects.rb', type: 'ruby', file: 'projects' },
              ...projectChildren
            ]}
          ]},
          { id: 'services', label: tr.services, type: 'folder', children: [
            { id: 'skills', label: 'skills_engine.rb', type: 'ruby', file: 'skills' }
          ]},
          { id: 'controllers', label: tr.controllers, type: 'folder', children: [
            { id: 'contact', label: 'contact_controller.rb', type: 'ruby', file: 'contact' }
          ]}
        ]},
        { id: 'config', label: tr.config, type: 'folder', children: [
          { id: 'locales', label: tr.locales, type: 'folder', children: [
            { id: 'en', label: 'en.yml', type: 'yaml', file: 'readme' },
            { id: 'ru', label: 'ru.yml', type: 'yaml', file: 'readme' }
          ]}
        ]},
        { id: 'spec', label: tr.spec, type: 'folder', children: [
          { id: 'specfile', label: 'achievements_spec.rb', type: 'ruby', file: 'spec' }
        ]},
        { id: 'assets', label: tr.assets, type: 'folder', children: [
          { id: 'photo', label: 'photo.jpg', type: 'image', file: 'photo' }
        ]},
        { id: 'readme', label: f.readme, type: 'markdown', file: 'readme' },
        { id: 'gemfile', label: f.gemfile, type: 'gemfile', file: 'gemfile' }
      ]}
    ];
  }

  function renderProjectTree() {
    const tree = getTreeDef();

    function renderNode(node, depth = 0) {
      const indent = depth * 14 + 8;
      const isOpen = state.openFolders.has(node.id);
      const isFolder = node.type === 'folder';
      const iconMap = { folder: '📁', ruby: '◆', markdown: 'ⓘ', gemfile: '💎', yaml: '⚙', image: '🖼' };
      const icon = isFolder ? (isOpen ? '📂' : '📁') : (iconMap[node.type] || '📄');
      const active = node.file === state.activeFile ? 'active' : '';
      const folderCls = isFolder ? 'folder' : node.type;
      let html = `<div class="tree-item ${folderCls} ${active}${isFolder && isOpen ? ' open' : ''}" style="--indent:${indent}px" data-id="${node.id}" ${node.file ? `data-file="${node.file}"` : ''} ${isFolder ? 'data-is-folder="1"' : ''}>`;
      html += `<span class="chevron">${isFolder ? '▶' : ''}</span><span class="icon">${icon}</span><span class="label">${node.label}</span></div>`;
      if (isFolder && isOpen && node.children) {
        html += `<div class="tree-children">${node.children.map(c => renderNode(c, depth + 1)).join('')}</div>`;
      }
      return html;
    }

    $('#panelContent').innerHTML = `<div class="profile-card" id="profileCard">
      <img src="assets/photo.jpg" alt="" class="profile-thumb">
      <div><strong>Artsiom Dubrounik</strong><br><span class="profile-sub">Senior Rails Engineer</span></div>
    </div>` + tree.map(n => renderNode(n)).join('');
  }

  function renderStructurePanel() {
    const symbols = STRUCTURE_INDEX[state.activeFile] || [];
    if (!symbols.length) {
      $('#panelContent').innerHTML = `<div class="structure-empty">${t('structure.empty')}</div>`;
      return;
    }
    $('#panelContent').innerHTML = symbols.map(s => `
      <div class="struct-item struct-${s.kind}" data-line="${s.line}" data-symbol="${s.name}">
        <span class="struct-icon">${s.icon}</span>
        <span class="struct-kind">${s.kind}</span>
        <span class="struct-name">${s.name}</span>
        <span class="struct-line">:${s.line}</span>
      </div>
    `).join('');
  }

  function renderGitLog() {
    return t('gitLog').map(e => `
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

  function updateTerminalPrompt() {
    const prompt = $('#terminalPrompt');
    const cwd = $('#terminalCwd');
    if (state.irbMode) {
      const n = String(state.irbLine).padStart(3, '0');
      prompt.textContent = `irb(main):${n}:0>`;
      prompt.classList.add('irb');
      cwd.style.display = 'none';
    } else {
      prompt.textContent = '➜';
      prompt.classList.remove('irb');
      cwd.style.display = '';
    }
  }

  function termPrint(text, cls = '') {
    const out = $('#terminalOutput');
    text.split('\n').forEach(line => {
      out.innerHTML += `<div class="line-out ${cls}">${esc(line)}</div>`;
    });
    out.scrollTop = out.scrollHeight;
  }

  function startIrb() {
    state.irbMode = true;
    state.irbLine = 1;
    state.irbCtx = IrbEngine.buildContext(state.lang);
    updateTerminalPrompt();
    termPrint(t('terminal.irb'), 'info');
    termPrint('irb(main):001:0> # Dubrounik, Projects, Experience, SkillsEngine available', 'info');
  }

  function stopIrb() {
    state.irbMode = false;
    state.irbLine = 1;
    updateTerminalPrompt();
    termPrint('← back to shell', 'info');
  }

  function handleIrbInput(expr) {
    termPrint(`irb(main):${String(state.irbLine).padStart(3, '0')}:0> ${expr}`, 'cmd');
    if (expr.trim() === 'exit') { stopIrb(); return; }
    try {
      const result = IrbEngine.eval(expr, state.irbCtx);
      if (result) termPrint(result, 'irb-out');
      if (expr.includes('hire')) setTimeout(showContact, 400);
    } catch (e) {
      termPrint(e.message, 'error');
    }
    state.irbLine++;
    updateTerminalPrompt();
  }

  function handleTerminalCommand(cmd) {
    const raw = cmd.trim();
    if (!raw) return;

    if (state.irbMode) { handleIrbInput(raw); return; }

    termPrint(`➜ ${cmd}`, 'cmd');
    const c = raw.toLowerCase();

    const map = {
      help: () => t('terminal.help'),
      whoami: () => t('terminal.whoami'),
      skills: () => { openFile('skills'); return t('terminal.skills'); },
      projects: () => { openFile('projects'); return '→ opening projects.rb'; },
      experience: () => { openFile('experience'); return '→ opening experience.rb'; },
      education: () => { openFile('education'); return t('terminal.education'); },
      hobbies: () => t('terminal.hobbies'),
      irb: () => { startIrb(); return null; },
      run: () => { runSpecs(); return t('terminal.run'); },
      debug: () => { triggerDebug(); return t('terminal.debug'); },
      hire: () => { setTimeout(showContact, 300); return t('terminal.hire'); },
      clear: () => { $('#terminalOutput').innerHTML = ''; return null; },
      lang: () => { toggleLang(); return `→ ${state.lang.toUpperCase()}`; },
      ls: () => 'README.md  Gemfile  dubrounik.resume.rb  app/  spec/  assets/photo.jpg',
      pwd: () => '/Users/artsiom/dubrounik.resume',
      ruby: () => 'ruby 3.3.0 (2024-04-23) [arm64-darwin] — type `irb` to start console',
      cat: () => c.includes('readme') ? '→ opening README.md' : null,
      open: () => {
        const f = raw.split(' ')[1];
        if (f?.includes('readme')) { openFile('readme'); return '→ README.md'; }
        if (f?.includes('gemfile')) { openFile('gemfile'); return '→ Gemfile'; }
        return null;
      },
      bundle: () => raw.includes('hire') ? (showContact(), 'Contact channels deployed.') : 'Could not find gem dubrounik locally. Try: bundle exec dubrounik --hire',
      exit: () => 'There is no escape from excellence.',
      debugger: () => (triggerDebug(), 'Breakpoint triggered.')
    };

    if (c.startsWith('cat ')) {
      const r = map.cat();
      if (r) { openFile('readme'); termPrint(r); return; }
    }
    if (c.startsWith('open ')) {
      const r = map.open();
      if (r) { termPrint(r); return; }
    }

    const fn = map[c] || map[c.split(' ')[0]];
    if (fn) {
      const result = fn();
      if (result) termPrint(result, c === 'run' ? 'success' : c === 'irb' ? 'info' : '');
    } else {
      termPrint(t('terminal.unknown'), 'error');
    }
  }

  function triggerDebug() {
    state.breakpointLine = 41;
    renderEditor(state.activeFile);
    setTimeout(showContact, 600);
  }

  function runSpecs() {
    switchToolTab('run');
    $('#tw-run').innerHTML = renderRunOutput();
    $('#ide').classList.add('glitch');
    setTimeout(() => $('#ide').classList.remove('glitch'), 300);
  }

  function showContact() {
    $('#contactOverlay').classList.remove('hidden');
  }

  function showPhoto() {
    openFile('photo');
  }

  function hideOverlays() {
    $$('.overlay').forEach(o => o.classList.add('hidden'));
    hideMenuDropdown();
  }

  function hideMenuDropdown() {
    $('#menuDropdown')?.classList.add('hidden');
  }

  function showMenuDropdown(menu, anchor) {
    const items = t(`menuItems.${menu}`);
    if (!items) return;
    const dd = $('#menuDropdown');
    dd.innerHTML = items.map(i =>
      `<button class="menu-dd-item" data-action="${i.action}"><span>${i.label}</span>${i.shortcut ? `<span class="shortcut">${i.shortcut}</span>` : ''}</button>`
    ).join('');
    const rect = anchor.getBoundingClientRect();
    dd.style.left = rect.left + 'px';
    dd.style.top = rect.bottom + 'px';
    dd.classList.remove('hidden');
    dd.dataset.menu = menu;
  }

  function toggleLang() {
    state.lang = state.lang === 'en' ? 'ru' : 'en';
    localStorage.setItem('resume-lang', state.lang);
    if (state.irbMode) state.irbCtx = IrbEngine.buildContext(state.lang);
    applyI18n();
    renderTabs();
    renderEditor(state.activeFile);
    refreshPanels();
    $('#tw-run').innerHTML = renderRunOutput();
    $('#tw-problems').innerHTML = renderProblems();
    $('#tw-git-log').innerHTML = renderGitLog();
    $('#tw-services').innerHTML = renderServices();
    renderPalette($('#paletteInput')?.value || '');
  }

  function refreshPanels() {
    if (state.activePanel === 'project') renderProjectTree();
    else if (state.activePanel === 'structure') renderStructurePanel();
    else if (state.activePanel === 'git') $('#panelContent').innerHTML = renderGitLog();
  }

  function switchToolTab(name) {
    $$('.tw-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tw === name));
    $$('.tw-pane').forEach(pane => pane.classList.remove('active'));
    const pane = $(`#tw-${name}`);
    if (pane) pane.classList.add('active');
    state.toolWindowVisible = true;
    $('#toolWindow').classList.remove('collapsed');
  }

  function setActivePanel(panel) {
    state.activePanel = panel;
    $$('.ab-btn').forEach(b => b.classList.toggle('active', b.dataset.panel === panel));
    const titles = { project: 'panel.project', git: 'panel.git', structure: 'panel.structure' };
    $('#panelTitle').textContent = t(titles[panel] || 'panel.project');
    if (panel === 'project') renderProjectTree();
    else if (panel === 'structure') renderStructurePanel();
    else if (panel === 'git') $('#panelContent').innerHTML = renderGitLog();
    $('#sidePanel').classList.add('mobile-open');
  }

  function scrollToLine(line) {
    const el = $(`#editor .line[data-line="${line}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight');
      setTimeout(() => el.classList.remove('highlight'), 1500);
      $('#sbPos').textContent = `Ln ${line}, Col 1`;
    }
  }

  function handleAction(action) {
    hideOverlays();
    hideMenuDropdown();
    if (action.startsWith('file:')) openFile(action.slice(5));
    else if (action.startsWith('panel:')) setActivePanel(action.slice(6));
    else if (action === 'run') runSpecs();
    else if (action === 'debug') triggerDebug();
    else if (action === 'contact') showContact();
    else if (action === 'photo') showPhoto();
    else if (action === 'search') { $('#searchOverlay').classList.remove('hidden'); $('#searchInput').focus(); }
    else if (action === 'palette') { $('#paletteOverlay').classList.remove('hidden'); renderPalette(); $('#paletteInput').focus(); }
    else if (action === 'lang') toggleLang();
    else if (action === 'terminal') { switchToolTab('terminal'); state.toolWindowVisible = true; $('#toolWindow').classList.remove('collapsed'); }
    else if (action === 'gitlog') switchToolTab('git-log');
    else if (action === 'services') switchToolTab('services');
    else if (action === 'problems') switchToolTab('problems');
    else if (action === 'irb') { switchToolTab('terminal'); startIrb(); $('#terminalInput').focus(); }
    else if (action === 'copy-email') { navigator.clipboard?.writeText('artsiom.dubrounik@gmail.com'); termPrint('Copied: artsiom.dubrounik@gmail.com', 'success'); switchToolTab('terminal'); }
    else if (action === 'close-tab') {
      const key = state.activeFile;
      state.openTabs = state.openTabs.filter(t => t !== key);
      state.activeFile = state.openTabs[state.openTabs.length - 1] || 'resume';
      if (!state.openTabs.length) state.openTabs = ['resume'];
      renderTabs(); renderEditor(state.activeFile);
    }
    else if (action === 'minimap') { state.minimapVisible = !state.minimapVisible; renderEditor(state.activeFile); }
    else if (action === 'toolwindow') {
      state.toolWindowVisible = !state.toolWindowVisible;
      $('#toolWindow').classList.toggle('collapsed', !state.toolWindowVisible);
    }
    else if (action === 'goto-decl') scrollToLine(5);
    else if (action === 'quick-doc') {
      const hint = t('tooltip.class');
      $('#inlineHint').textContent = hint;
      setTimeout(() => $('#inlineHint').textContent = '', 4000);
    }
    else if (action === 'reformat') {
      $('#editor').classList.add('reformat-flash');
      setTimeout(() => $('#editor').classList.remove('reformat-flash'), 500);
    }
    else if (action === 'blame') { switchToolTab('git-log'); termPrint(t('blame'), 'info'); }
    else if (action === 'term-help') { switchToolTab('terminal'); termPrint(t('terminal.help'), 'info'); }
    else if (action === 'shortcuts') { switchToolTab('terminal'); termPrint(t('shortcuts'), 'info'); }
    else if (action === 'about') { switchToolTab('terminal'); termPrint(t('about'), 'info'); }
    else if (action === 'rename-tab' || action === 'extract') {
      termPrint(action === 'extract' ? 'Extracted method: def excellence; end ✓' : 'Tab renamed (not really — it\'s HTML)', 'info');
      switchToolTab('terminal');
    }
  }

  function renderPalette(query = '') {
    const items = t('paletteItems');
    const q = query.toLowerCase();
    const filtered = items.filter(i => !q || i.label.toLowerCase().includes(q));
    $('#paletteResults').innerHTML = filtered.map(i =>
      `<li data-action="${i.action}"><span>${i.label}</span>${i.shortcut ? `<span class="shortcut">${i.shortcut}</span>` : ''}</li>`
    ).join('');
  }

  function renderSearchResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) { $('#searchResults').innerHTML = ''; return; }
    const results = SEARCH_INDEX.filter(item => item.q.includes(q) || q.split(' ').some(w => w.length > 2 && item.q.includes(w)));
    $('#searchResults').innerHTML = results.map(r => {
      const label = t(FILE_KEYS[r.file] || 'files.resume');
      return `<li data-search-file="${r.file}" data-line="${r.line}"><span>${label}:${r.line}</span><span class="search-match">${r.q.split(' ').slice(0, 2).join(' ')}…</span></li>`;
    }).join('') || `<li class="search-empty">No matches</li>`;
  }

  function bindEditorEvents(fileKey) {
    const editor = $('#editor');
    if (!editor) return;
    editor.onscroll = () => {
      const gutter = $('#gutter');
      if (gutter) gutter.scrollTop = editor.scrollTop;
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
      el.onclick = () => {
        if (el.classList.contains('mth') && (el.textContent.includes('hire') || el.textContent.includes('нанять'))) showContact();
      };
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
    setTimeout(() => splash.remove(), 700);
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
    $('#debugBtn').onclick = triggerDebug;
    $('#searchBtn').onclick = () => handleAction('search');
    $('#paletteBtn').onclick = () => handleAction('palette');
    $('#tabs').onclick = e => {
      const close = e.target.dataset.close;
      if (close) {
        state.openTabs = state.openTabs.filter(t => t !== close);
        state.activeFile = state.openTabs[state.openTabs.length - 1] || 'resume';
        if (!state.openTabs.length) state.openTabs = ['resume'];
        renderTabs(); renderEditor(state.activeFile);
        return;
      }
      const tab = e.target.closest('[data-tab]');
      if (tab) openFile(tab.dataset.tab);
    };

    $('#panelContent').onclick = e => {
      if (e.target.closest('.profile-card')) { showPhoto(); return; }

      const struct = e.target.closest('.struct-item');
      if (struct) { scrollToLine(+struct.dataset.line); return; }

      const item = e.target.closest('.tree-item');
      if (!item) return;

      if (item.dataset.isFolder === '1') {
        const id = item.dataset.id;
        if (state.openFolders.has(id)) state.openFolders.delete(id);
        else state.openFolders.add(id);
        renderProjectTree();
        return;
      }
      if (item.dataset.file) openFile(item.dataset.file);
    };

    $$('.ab-btn').forEach(btn => {
      btn.onclick = () => {
        const panel = btn.dataset.panel;
        if (panel === 'terminal') { switchToolTab('terminal'); return; }
        if (panel === 'contact') { showContact(); return; }
        setActivePanel(panel);
      };
    });

    $('#panelClose').onclick = () => $('#sidePanel').classList.remove('mobile-open');
    $$('.tw-tab').forEach(tab => tab.onclick = () => switchToolTab(tab.dataset.tw));

    const termInput = $('#terminalInput');
    termInput.onkeydown = e => {
      if (e.key === 'Enter') {
        const val = e.target.value;
        if (!state.irbMode) state.history.push(val);
        handleTerminalCommand(val);
        e.target.value = '';
        state.historyIdx = state.history.length;
      } else if (e.key === 'ArrowUp' && !state.irbMode) {
        e.preventDefault();
        if (state.historyIdx > 0) { state.historyIdx--; e.target.value = state.history[state.historyIdx]; }
      } else if (e.key === 'ArrowDown' && !state.irbMode) {
        e.preventDefault();
        if (state.historyIdx < state.history.length - 1) { state.historyIdx++; e.target.value = state.history[state.historyIdx]; }
        else { state.historyIdx = state.history.length; e.target.value = ''; }
      }
    };

    $('#paletteInput').oninput = e => renderPalette(e.target.value);
    $('#paletteResults').onclick = e => {
      const li = e.target.closest('[data-action]');
      if (li) handleAction(li.dataset.action);
    };

    $('#searchInput').oninput = e => renderSearchResults(e.target.value);
    $('#searchResults').onclick = e => {
      const li = e.target.closest('[data-search-file]');
      if (li) { hideOverlays(); openFile(li.dataset.searchFile); scrollToLine(+li.dataset.line || 1); }
    };

    $$('.overlay').forEach(o => o.onclick = e => { if (e.target === o) hideOverlays(); });
    $$('[data-close]').forEach(b => b.onclick = () => hideOverlays());

    $$('.menu-item').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const menu = btn.dataset.menu;
        const dd = $('#menuDropdown');
        if (!dd.classList.contains('hidden') && dd.dataset.menu === menu) hideMenuDropdown();
        else showMenuDropdown(menu, btn);
      };
    });

    $('#menuDropdown').onclick = e => {
      const item = e.target.closest('[data-action]');
      if (item) handleAction(item.dataset.action);
    };

    document.addEventListener('click', e => {
      if (!e.target.closest('.menubar') && !e.target.closest('#menuDropdown')) hideMenuDropdown();
    });

    $$('.titlebar .dot').forEach(dot => {
      dot.onclick = () => {
        if (dot.dataset.action === 'close') showContact();
        else if (dot.dataset.action === 'minimize') handleAction('terminal');
        else runSpecs();
      };
    });

    $('#sbProblems').onclick = () => handleAction('problems');

    $$('#mobileNav button').forEach(btn => {
      btn.onclick = () => {
        $$('#mobileNav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mobile;
        $('#sidePanel').classList.remove('mobile-open');
        if (mode === 'project') setActivePanel('project');
        else if (mode === 'terminal') switchToolTab('terminal');
        else if (mode === 'contact') showContact();
      };
    });

    document.onkeydown = e => {
      if (e.key === 'Escape') hideOverlays();
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') { e.preventDefault(); toggleLang(); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') { e.preventDefault(); handleAction('search'); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') { e.preventDefault(); runSpecs(); }
    };

    let lastShift = 0;
    document.addEventListener('keydown', e => {
      if (e.key === 'Shift') {
        const now = Date.now();
        if (now - lastShift < 400) handleAction('palette');
        lastShift = now;
      }
    });

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
    updateTerminalPrompt();
    initSplash();
    initEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
