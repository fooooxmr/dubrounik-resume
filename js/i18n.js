const I18N = {
  en: {
    splash: { tagline: 'Indexing dubrounik.resume.rb…', hint: 'Press any key to skip indexing' },
    menu: { file: 'File', edit: 'Edit', view: 'View', navigate: 'Navigate', code: 'Code', refactor: 'Refactor', run: 'Run', tools: 'Tools', git: 'Git', help: 'Help' },
    menuItems: {
      file: [
        { label: 'Open README.md', action: 'file:readme', shortcut: '' },
        { label: 'Open Gemfile', action: 'file:gemfile', shortcut: '' },
        { label: 'Open dubrounik.resume.rb', action: 'file:resume', shortcut: '⌘1' },
        { label: 'Open Profile Photo', action: 'photo', shortcut: '' },
        { label: 'Export Contact', action: 'contact', shortcut: '' },
        { label: 'Close Active Tab', action: 'close-tab', shortcut: '⌘W' }
      ],
      edit: [
        { label: 'Copy Email', action: 'copy-email', shortcut: '' },
        { label: 'Find in Path', action: 'search', shortcut: '⌘⇧F' },
        { label: 'Search Everywhere', action: 'palette', shortcut: '⇧⇧' },
        { label: 'Toggle Language EN/RU', action: 'lang', shortcut: '⌘L' }
      ],
      view: [
        { label: 'Project Panel', action: 'panel:project', shortcut: '⌘1' },
        { label: 'Structure Panel', action: 'panel:structure', shortcut: '⌘7' },
        { label: 'Git Log Panel', action: 'panel:git', shortcut: '' },
        { label: 'Terminal', action: 'terminal', shortcut: '⌃`' },
        { label: 'Toggle Minimap', action: 'minimap', shortcut: '' },
        { label: 'Toggle Tool Window', action: 'toolwindow', shortcut: '' }
      ],
      navigate: [
        { label: 'Go to File…', action: 'palette', shortcut: '⌘⇧O' },
        { label: 'Go to Symbol…', action: 'panel:structure', shortcut: '⌘⌥O' },
        { label: 'Go to Projects', action: 'file:projects', shortcut: '' },
        { label: 'Go to Experience', action: 'file:experience', shortcut: '' },
        { label: 'Recent: Avallain', action: 'file:p_avallain', shortcut: '' }
      ],
      code: [
        { label: 'Go to Declaration', action: 'goto-decl', shortcut: '⌘B' },
        { label: 'Show Quick Documentation', action: 'quick-doc', shortcut: '⌃Q' },
        { label: 'Reformat Code', action: 'reformat', shortcut: '⌘⌥L' },
        { label: 'Inspect Stack Trace', action: 'problems', shortcut: '' }
      ],
      refactor: [
        { label: 'Switch Language EN ↔ RU', action: 'lang', shortcut: '⌘L' },
        { label: 'Rename Tab', action: 'rename-tab', shortcut: '⇧F6' },
        { label: 'Extract Method (easter egg)', action: 'extract', shortcut: '' }
      ],
      run: [
        { label: 'Run dubrounik.resume.rb', action: 'run', shortcut: '⌃R' },
        { label: 'Debug (breakpoint)', action: 'debug', shortcut: '⌃D' },
        { label: 'Run Specs', action: 'run', shortcut: '' },
        { label: 'Start IRB Console', action: 'irb', shortcut: '' }
      ],
      tools: [
        { label: 'IRB Console', action: 'irb', shortcut: '' },
        { label: 'Services Dashboard', action: 'services', shortcut: '' },
        { label: 'Database Console (Skills)', action: 'file:skills', shortcut: '' },
        { label: 'Problems', action: 'problems', shortcut: '' }
      ],
      git: [
        { label: 'Show Git Log', action: 'gitlog', shortcut: '' },
        { label: 'Annotate (Blame)', action: 'blame', shortcut: '' },
        { label: 'Version Control Panel', action: 'panel:git', shortcut: '' }
      ],
      help: [
        { label: 'Terminal Commands', action: 'term-help', shortcut: '' },
        { label: 'Keyboard Shortcuts', action: 'shortcuts', shortcut: '' },
        { label: 'About dubrounik.resume', action: 'about', shortcut: '' },
        { label: 'Hire Me 💎', action: 'contact', shortcut: '' }
      ]
    },
    toolbar: { run: 'Run', debug: 'Debug', config: 'dubrounik.resume.rb' },
    panel: { project: 'Project', git: 'Version Control', structure: 'Structure', terminal: 'Terminal', contact: 'Hire Me' },
    structure: { empty: 'No symbols in file', title: 'Structure' },
    tw: { terminal: 'Terminal', run: 'Run', problems: 'Problems', gitLog: 'Git Log', services: 'Services' },
    status: { problems: '✓ 0 errors, 0 warnings, 8+ years exp', ruby: '♦ Ruby in my heart forever' },
    palette: { placeholder: 'Search Everywhere…' },
    search: { title: 'Find in Path', placeholder: 'Search skills, projects…' },
    contact: {
      title: 'bundle exec dubrounik --hire',
      sub: "Deployment successful. Let's connect.",
      location: 'Grodno, Belarus · Remote worldwide',
      easter: 'You found the hidden breakpoint. Nice debugging skills.'
    },
    terminal: {
      welcome: 'Welcome to dubrounik.resume terminal v2.0 — type `irb` for Ruby console',
      help: 'Commands: help, whoami, skills, projects, experience, education, irb, run, debug, hire, clear, lang, ls',
      whoami: 'Artsiom Dubrounik — Senior Software Engineer, 8+ years Ruby/Rails',
      skills: 'Ruby, Rails, React, AWS, Docker, K8s, PostgreSQL, Redis, Sidekiq, SQS, Auth0, SAML, Microservices, AI',
      education: 'Yanka Kupala State University of Grodno — Software Development (2014–2018)',
      hobbies: 'Teaching, Psychology, mentoring via pair programming',
      run: 'Running dubrounik.resume.rb…\n✓ All specs passed. Ready for production hire.',
      debug: 'Breakpoint hit at ContactController#hire — opening contact modal…',
      hire: 'Opening contact channels…',
      irb: 'Starting IRB 3.3.0 — type `exit` to return to shell',
      unknown: 'Command not found. Type `help` or `irb` for Ruby console.',
      cleared: 'Terminal cleared.'
    },
    files: {
      root: 'dubrounik.resume',
      resume: 'dubrounik.resume.rb',
      experience: 'app/models/experience.rb',
      education: 'app/models/education.rb',
      skills: 'app/services/skills_engine.rb',
      projects: 'app/models/projects.rb',
      contact: 'app/controllers/contact_controller.rb',
      spec: 'spec/achievements_spec.rb',
      readme: 'README.md',
      gemfile: 'Gemfile',
      photo: 'assets/photo.jpg',
      p_avallain: 'app/models/projects/avallain.rb',
      p_hoot: 'app/models/projects/hoot_dev.rb',
      p_loyalty: 'app/models/projects/loyalty_plus.rb',
      p_listen: 'app/models/projects/listen_loop.rb',
      p_friends: 'app/models/projects/friendsurance.rb',
      p_spider: 'app/models/projects/spider_door.rb',
      p_tracker: 'app/models/projects/tracker.rb',
      p_ship: 'app/models/projects/ship_hawk.rb',
      p_bahamas: 'app/models/projects/bahamas_vacations.rb'
    },
    tree: { app: 'app', models: 'models', projects: 'projects', services: 'services', controllers: 'controllers', config: 'config', locales: 'locales', spec: 'spec', assets: 'assets' },
    run: {
      title: 'Running spec/achievements_spec.rb…',
      lines: [
        { status: 'pass', text: 'Avallain SSO & OneRoster integration scales to millions of learners' },
        { status: 'pass', text: 'Hoot.dev performance refactor & DICOM viewer pipeline' },
        { status: 'pass', text: 'LoyaltyPlus Rails 3→6 migration with 85% test coverage' },
        { status: 'pass', text: 'ListenLoop monolith→Go lambdas & Auth0/Okta redesign' },
        { status: 'pass', text: 'Friendsurance SQS→Sidekiq migration cut ops costs' },
        { status: 'pass', text: 'AI-driven development workflow & team mentoring' },
        { status: 'pass', text: '9 examples, 0 failures' }
      ]
    },
    problems: [
      { icon: '✓', text: 'No production bugs found in this resume' },
      { icon: '✓', text: 'SOLID principles: enforced' },
      { icon: '✓', text: 'Test coverage: 85%+ on major projects' },
      { icon: 'ℹ', text: 'Warning: excessive passion for Ruby detected' }
    ],
    services: [
      { name: 'Rails API', status: 'UP' },
      { name: 'Sidekiq Workers', status: 'UP' },
      { name: 'PostgreSQL', status: 'UP' },
      { name: 'Redis Cache', status: 'UP' },
      { name: 'Mentoring Sessions', status: 'UP' }
    ],
    paletteItems: [
      { label: 'Go to dubrounik.resume.rb', action: 'file:resume' },
      { label: 'Go to README.md', action: 'file:readme' },
      { label: 'Go to Gemfile', action: 'file:gemfile' },
      { label: 'Go to Experience', action: 'file:experience' },
      { label: 'Go to Projects registry', action: 'file:projects' },
      { label: 'Go to Avallain project', action: 'file:p_avallain' },
      { label: 'Go to Skills', action: 'file:skills' },
      { label: 'Start IRB Console', action: 'irb' },
      { label: 'Run Resume', action: 'run', shortcut: '⌃R' },
      { label: 'Debug / Contact', action: 'contact', shortcut: '⌃D' },
      { label: 'Find in Path', action: 'search', shortcut: '⌘⇧F' },
      { label: 'Switch Language', action: 'lang', shortcut: '⌘L' },
      { label: 'Open Terminal', action: 'terminal' },
      { label: 'Git Log — Career Timeline', action: 'gitlog' }
    ],
    gitLog: [
      { hash: 'a8f3c21', date: '2022–present', msg: 'feat: founded The Lessoner — nonprofit IT education' },
      { hash: 'b7e2d10', date: '2021–present', msg: 'feat: Education Mentor @ IT Academy Grodno' },
      { hash: 'c6d1e09', date: '2018–present', msg: 'feat: Team Manager @ iTechArt Group' },
      { hash: 'd5c0f08', date: '2018', msg: 'feat: Senior Ruby Developer @ Anadea' },
      { hash: 'e4b9g07', date: '2016–2022', msg: 'feat: 9 major projects — Avallain, Hoot, LoyaltyPlus…' },
      { hash: 'f3a8h06', date: '2014–2018', msg: 'init: Software Development @ Yanka Kupala University' }
    ],
    tooltip: {
      class: 'Senior Software Engineer with 8+ years in Ruby/Rails. Team lead, mentor, AI-augmented developer.',
      method: 'Click to inspect — or type in IRB: Dubrounik.new.method_name',
      project: 'Major project — open file for full achievements'
    },
    about: 'dubrounik.resume v2.0 — Interactive RubyMine-styled portfolio.\nBuilt by Artsiom Dubrounik.\nType `irb` in terminal. Double-Shift for Search Everywhere.',
    shortcuts: '⌃R Run · ⌃D Debug · ⌘L Language · ⌘⇧F Find · ⇧⇧ Search Everywhere · ⌘B Go to Declaration',
    blame: 'Line 1: Artsiom Dubrounik <artsiom.dubrounik@gmail.com> 2016\nEvery line: pair-programmed with excellence.'
  },
  ru: {
    splash: { tagline: 'Индексация dubrounik.resume.rb…', hint: 'Нажмите любую клавишу, чтобы пропустить' },
    menu: { file: 'Файл', edit: 'Правка', view: 'Вид', navigate: 'Навигация', code: 'Код', refactor: 'Рефакторинг', run: 'Запуск', tools: 'Инструменты', git: 'Git', help: 'Справка' },
    menuItems: {
      file: [
        { label: 'Открыть README.md', action: 'file:readme', shortcut: '' },
        { label: 'Открыть Gemfile', action: 'file:gemfile', shortcut: '' },
        { label: 'Открыть dubrounik.resume.rb', action: 'file:resume', shortcut: '⌘1' },
        { label: 'Открыть фото профиля', action: 'photo', shortcut: '' },
        { label: 'Экспорт контактов', action: 'contact', shortcut: '' },
        { label: 'Закрыть вкладку', action: 'close-tab', shortcut: '⌘W' }
      ],
      edit: [
        { label: 'Копировать email', action: 'copy-email', shortcut: '' },
        { label: 'Найти в пути', action: 'search', shortcut: '⌘⇧F' },
        { label: 'Поиск везде', action: 'palette', shortcut: '⇧⇧' },
        { label: 'Сменить язык EN/RU', action: 'lang', shortcut: '⌘L' }
      ],
      view: [
        { label: 'Панель проекта', action: 'panel:project', shortcut: '⌘1' },
        { label: 'Панель структуры', action: 'panel:structure', shortcut: '⌘7' },
        { label: 'Панель Git', action: 'panel:git', shortcut: '' },
        { label: 'Терминал', action: 'terminal', shortcut: '⌃`' },
        { label: 'Миникарта', action: 'minimap', shortcut: '' },
        { label: 'Tool Window', action: 'toolwindow', shortcut: '' }
      ],
      navigate: [
        { label: 'Перейти к файлу…', action: 'palette', shortcut: '⌘⇧O' },
        { label: 'Перейти к символу…', action: 'panel:structure', shortcut: '⌘⌥O' },
        { label: 'К проектам', action: 'file:projects', shortcut: '' },
        { label: 'К опыту', action: 'file:experience', shortcut: '' },
        { label: 'Недавний: Avallain', action: 'file:p_avallain', shortcut: '' }
      ],
      code: [
        { label: 'Перейти к объявлению', action: 'goto-decl', shortcut: '⌘B' },
        { label: 'Быстрая документация', action: 'quick-doc', shortcut: '⌃Q' },
        { label: 'Форматировать код', action: 'reformat', shortcut: '⌘⌥L' },
        { label: 'Стек вызовов', action: 'problems', shortcut: '' }
      ],
      refactor: [
        { label: 'Сменить язык EN ↔ RU', action: 'lang', shortcut: '⌘L' },
        { label: 'Переименовать вкладку', action: 'rename-tab', shortcut: '⇧F6' },
        { label: 'Extract Method (пасхалка)', action: 'extract', shortcut: '' }
      ],
      run: [
        { label: 'Запустить dubrounik.resume.rb', action: 'run', shortcut: '⌃R' },
        { label: 'Отладка (breakpoint)', action: 'debug', shortcut: '⌃D' },
        { label: 'Запустить тесты', action: 'run', shortcut: '' },
        { label: 'Запустить IRB', action: 'irb', shortcut: '' }
      ],
      tools: [
        { label: 'IRB консоль', action: 'irb', shortcut: '' },
        { label: 'Сервисы', action: 'services', shortcut: '' },
        { label: 'Database Console (Skills)', action: 'file:skills', shortcut: '' },
        { label: 'Проблемы', action: 'problems', shortcut: '' }
      ],
      git: [
        { label: 'Git Log', action: 'gitlog', shortcut: '' },
        { label: 'Annotate (Blame)', action: 'blame', shortcut: '' },
        { label: 'Панель контроля версий', action: 'panel:git', shortcut: '' }
      ],
      help: [
        { label: 'Команды терминала', action: 'term-help', shortcut: '' },
        { label: 'Горячие клавиши', action: 'shortcuts', shortcut: '' },
        { label: 'О dubrounik.resume', action: 'about', shortcut: '' },
        { label: 'Нанять 💎', action: 'contact', shortcut: '' }
      ]
    },
    toolbar: { run: 'Запуск', debug: 'Отладка', config: 'dubrounik.resume.rb' },
    panel: { project: 'Проект', git: 'Контроль версий', structure: 'Структура', terminal: 'Терминал', contact: 'Нанять' },
    structure: { empty: 'Нет символов в файле', title: 'Структура' },
    tw: { terminal: 'Терминал', run: 'Запуск', problems: 'Проблемы', gitLog: 'Git Log', services: 'Сервисы' },
    status: { problems: '✓ 0 ошибок, 0 предупреждений, 8+ лет опыта', ruby: '♦ Ruby в сердце навсегда' },
    palette: { placeholder: 'Поиск везде…' },
    search: { title: 'Найти в пути', placeholder: 'Поиск навыков, проектов…' },
    contact: {
      title: 'bundle exec dubrounik --hire',
      sub: 'Деплой успешен. Давайте свяжемся.',
      location: 'Гродно, Беларусь · Удалённо по всему миру',
      easter: 'Вы нашли скрытую точку останова. Отличные навыки отладки.'
    },
    terminal: {
      welcome: 'Терминал dubrounik.resume v2.0 — введите `irb` для Ruby-консоли',
      help: 'Команды: help, whoami, skills, projects, experience, education, irb, run, debug, hire, clear, lang, ls',
      whoami: 'Артём Дубровник — Senior Software Engineer, 8+ лет Ruby/Rails',
      skills: 'Ruby, Rails, React, AWS, Docker, K8s, PostgreSQL, Redis, Sidekiq, SQS, Auth0, SAML, микросервисы, AI',
      education: 'ГрГУ им. Янки Купалы — Разработка ПО (2014–2018)',
      hobbies: 'Преподавание, психология, менторинг через pair programming',
      run: 'Запуск dubrounik.resume.rb…\n✓ Все тесты пройдены. Готов к продакшену.',
      debug: 'Точка останова в ContactController#hire — открываю контакты…',
      hire: 'Открываю каналы связи…',
      irb: 'Запуск IRB 3.3.0 — `exit` для возврата в shell',
      unknown: 'Команда не найдена. Введите `help` или `irb`.',
      cleared: 'Терминал очищен.'
    },
    files: {
      root: 'dubrounik.resume',
      resume: 'dubrounik.resume.rb',
      experience: 'app/models/experience.rb',
      education: 'app/models/education.rb',
      skills: 'app/services/skills_engine.rb',
      projects: 'app/models/projects.rb',
      contact: 'app/controllers/contact_controller.rb',
      spec: 'spec/achievements_spec.rb',
      readme: 'README.md',
      gemfile: 'Gemfile',
      photo: 'assets/photo.jpg',
      p_avallain: 'app/models/projects/avallain.rb',
      p_hoot: 'app/models/projects/hoot_dev.rb',
      p_loyalty: 'app/models/projects/loyalty_plus.rb',
      p_listen: 'app/models/projects/listen_loop.rb',
      p_friends: 'app/models/projects/friendsurance.rb',
      p_spider: 'app/models/projects/spider_door.rb',
      p_tracker: 'app/models/projects/tracker.rb',
      p_ship: 'app/models/projects/ship_hawk.rb',
      p_bahamas: 'app/models/projects/bahamas_vacations.rb'
    },
    tree: { app: 'app', models: 'models', projects: 'projects', services: 'services', controllers: 'controllers', config: 'config', locales: 'locales', spec: 'spec', assets: 'assets' },
    run: {
      title: 'Запуск spec/achievements_spec.rb…',
      lines: [
        { status: 'pass', text: 'Avallain: SSO & OneRoster для миллионов пользователей' },
        { status: 'pass', text: 'Hoot.dev: рефакторинг и DICOM-просмотр в браузере' },
        { status: 'pass', text: 'LoyaltyPlus: миграция Rails 3→6, покрытие тестами 85%' },
        { status: 'pass', text: 'ListenLoop: монолит→Go lambdas, Auth0/Okta' },
        { status: 'pass', text: 'Friendsurance: SQS→Sidekiq, снижение затрат' },
        { status: 'pass', text: 'AI-разработка и менторинг команд' },
        { status: 'pass', text: '9 примеров, 0 ошибок' }
      ]
    },
    problems: [
      { icon: '✓', text: 'Багов в этом резюме не обнаружено' },
      { icon: '✓', text: 'SOLID-принципы: соблюдены' },
      { icon: '✓', text: 'Покрытие тестами: 85%+ на крупных проектах' },
      { icon: 'ℹ', text: 'Предупреждение: обнаружена избыточная любовь к Ruby' }
    ],
    services: [
      { name: 'Rails API', status: 'UP' },
      { name: 'Sidekiq Workers', status: 'UP' },
      { name: 'PostgreSQL', status: 'UP' },
      { name: 'Redis Cache', status: 'UP' },
      { name: 'Менторинг', status: 'UP' }
    ],
    paletteItems: [
      { label: 'Перейти к dubrounik.resume.rb', action: 'file:resume' },
      { label: 'Перейти к README.md', action: 'file:readme' },
      { label: 'Перейти к Gemfile', action: 'file:gemfile' },
      { label: 'Перейти к Experience', action: 'file:experience' },
      { label: 'Реестр проектов', action: 'file:projects' },
      { label: 'Проект Avallain', action: 'file:p_avallain' },
      { label: 'Перейти к Skills', action: 'file:skills' },
      { label: 'Запустить IRB', action: 'irb' },
      { label: 'Запустить резюме', action: 'run', shortcut: '⌃R' },
      { label: 'Отладка / Контакты', action: 'contact', shortcut: '⌃D' },
      { label: 'Найти в пути', action: 'search', shortcut: '⌘⇧F' },
      { label: 'Сменить язык', action: 'lang', shortcut: '⌘L' },
      { label: 'Открыть терминал', action: 'terminal' },
      { label: 'Git Log — карьера', action: 'gitlog' }
    ],
    gitLog: [
      { hash: 'a8f3c21', date: '2022–н.в.', msg: 'feat: основал The Lessoner — некоммерческое IT-образование' },
      { hash: 'b7e2d10', date: '2021–н.в.', msg: 'feat: ментор @ IT Academy Гродно' },
      { hash: 'c6d1e09', date: '2018–н.в.', msg: 'feat: Team Manager @ iTechArt Group' },
      { hash: 'd5c0f08', date: '2018', msg: 'feat: Ruby Developer @ Anadea' },
      { hash: 'e4b9g07', date: '2016–2022', msg: 'feat: 9 крупных проектов — Avallain, Hoot, LoyaltyPlus…' },
      { hash: 'f3a8h06', date: '2014–2018', msg: 'init: Разработка ПО @ ГрГУ им. Янки Купалы' }
    ],
    tooltip: {
      class: 'Senior Software Engineer, 8+ лет Ruby/Rails. Тимлид, ментор, AI-разработчик.',
      method: 'Кликните или в IRB: Dubrounik.new.method_name',
      project: 'Крупный проект — откройте файл для полного описания'
    },
    about: 'dubrounik.resume v2.0 — интерактивное резюме в стиле RubyMine.\nАртём Дубровник.\n`irb` в терминале. Двойной Shift — поиск везде.',
    shortcuts: '⌃R Запуск · ⌃D Отладка · ⌘L Язык · ⌘⇧F Поиск · ⇧⇧ Search Everywhere · ⌘B К объявлению',
    blame: 'Строка 1: Артём Дубровник <artsiom.dubrounik@gmail.com> 2016\nКаждая строка: pair programming с excellence.'
  }
};
