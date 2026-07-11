const IrbEngine = (() => {
  'use strict';

  function buildContext(lang) {
    const roles = lang === 'ru'
      ? [
          { title: 'Team Manager', company: 'iTechArt Group', period: '2018–н.в.' },
          { title: 'Ментор', company: 'IT Academy Гродно', period: '2021–н.в.' },
          { title: 'Основатель', company: 'The Lessoner', period: '2022–н.в.' }
        ]
      : [
          { title: 'Team Manager', company: 'iTechArt Group', period: '2018–present' },
          { title: 'Education Mentor', company: 'IT Academy Grodno', period: '2021–present' },
          { title: 'Founder', company: 'The Lessoner', period: '2022–present' }
        ];

    const projects = PROJECT_KEYS.map(slug => {
      const p = PROJECTS_DATA[slug][lang];
      return { name: p.name, role: p.role, skills: p.skills, description: p.description, achievements: p.achievements };
    });

    const skills = lang === 'ru'
      ? { 'Ruby on Rails': ':expert', Ruby: ':expert', PostgreSQL: ':expert', React: ':advanced', AWS: ':advanced', 'Docker/K8s': ':advanced' }
      : { 'Ruby on Rails': ':expert', Ruby: ':expert', PostgreSQL: ':expert', React: ':advanced', AWS: ':advanced', 'Docker/K8s': ':advanced' };

    return {
      Dubrounik: {
        about_me: () => lang === 'ru'
          ? 'Инженер с 8+ годами Ruby/Rails. Team Manager @ iTechArt. Основатель The Lessoner.'
          : 'Software engineer with 8+ years Ruby/Rails. Team Manager @ iTechArt. Founder of The Lessoner.',
        core_competencies: () => skills,
        current_positions: () => roles,
        'hire!': () => '=> opening contact modal…',
        hire: () => '=> opening contact modal…'
      },
      Experience: {
        ROLES: roles,
        total_years: () => '8 years 2 months',
        highlights: () => lang === 'ru'
          ? ['Техрост команд', 'Менторинг', 'AI-разработка', '9 enterprise-проектов']
          : ['Team growth', 'Mentoring', 'AI-driven dev', '9 enterprise projects']
      },
      Projects: {
        REGISTRY: PROJECT_KEYS.map(k => `:${k}`),
        all: () => projects,
        count: () => 9,
        find: name => projects.find(p => p.name.toLowerCase().includes(String(name).toLowerCase().replace(/['"]/g, '')))
      },
      SkillsEngine: {
        evaluate: () => skills
      },
      Education: {
        DEGREE: lang === 'ru'
          ? { university: 'ГрГУ им. Янки Купалы', faculty: 'Разработка ПО', period: '2014–2018' }
          : { university: 'Yanka Kupala State University of Grodno', faculty: 'Software Development', period: '2014–2018' }
      },
      ContactController: {
        reach_out: () => ({
          email: 'artsiom.dubrounik@gmail.com',
          linkedin: 'linkedin.com/in/artsiom-dubrounik-813750146',
          github: 'github.com/fooooxmr'
        })
      },
      projects,
      skills
    };
  }

  function format(val, depth = 0) {
    if (val === undefined) return '=> nil';
    if (val === null) return '=> nil';
    if (typeof val === 'function') {
      try { return '=> ' + format(val(), depth + 1).replace(/^=> /, ''); } catch (e) { return `=> #<Proc:${e.message}>`; }
    }
    if (typeof val === 'string') return `=> "${val}"`;
    if (typeof val === 'number' || typeof val === 'boolean') return `=> ${val}`;
    if (Array.isArray(val)) {
      if (!val.length) return '=> []';
      if (depth > 1) return `=> [${val.length} items]`;
      const items = val.map(v => {
        if (typeof v === 'object' && v !== null) return `{:${Object.keys(v)[0]}=>"${Object.values(v)[0]}"...}`;
        return JSON.stringify(v);
      });
      return '=> [\n   ' + items.join(',\n   ') + '\n]';
    }
    if (typeof val === 'object') {
      const entries = Object.entries(val);
      if (!entries.length) return '=> {}';
      if (depth > 1) return `=> {${entries.length} keys}`;
      return '=> {\n   ' + entries.map(([k, v]) => {
        const fv = typeof v === 'string' ? `"${v}"` : (typeof v === 'function' ? '#<Method>' : JSON.stringify(v));
        return `${k}: ${fv}`;
      }).join(',\n   ') + '\n}';
    }
    return `=> ${String(val)}`;
  }

  function safeEval(expr, ctx) {
    const e = expr.trim();

    if (!e) return null;
    if (e === 'nil' || e === 'null') return '=> nil';
    if (e === 'true') return '=> true';
    if (e === 'false') return '=> false';
    if (/^\d+(\.\d+)?$/.test(e)) return `=> ${e}`;
    if ((e.startsWith('"') && e.endsWith('"')) || (e.startsWith("'") && e.endsWith("'"))) return `=> ${e}`;

    if (e === 'help' || e === '?') {
      return [
        'IRB commands:',
        '  Dubrounik.new.about_me',
        '  Experience::ROLES',
        '  Projects.count  /  Projects.all',
        '  Projects.find("Avallain")',
        '  SkillsEngine.new.evaluate',
        '  Education::DEGREE',
        '  ContactController.reach_out',
        '  1 + 1  /  "ruby".upcase',
        '  exit  — leave IRB'
      ].join('\n');
    }

    if (e === 'Dubrounik.new' || e === 'Dubrounik.new()') return '=> #<Dubrounik:0x000001>';
    if (e === 'SkillsEngine.new' || e === 'SkillsEngine.new()') return '=> #<SkillsEngine:0x000002>';
    if (e === 'Projects') return '=> Projects';
    if (e === 'Experience') return '=> Experience';

    const math = e.match(/^(\d+)\s*([+\-*/%])\s*(\d+)$/);
    if (math) {
      const [, a, op, b] = math;
      const ops = { '+': +a + +b, '-': +a - +b, '*': +a * *b, '/': +a / +b, '%': +a % +b };
      return `=> ${ops[op]}`;
    }

    const strOp = e.match(/^["'](.+)["']\.(upcase|downcase|reverse|length|size)$/);
    if (strOp) {
      const [, s, method] = strOp;
      const res = { upcase: s.toUpperCase(), downcase: s.toLowerCase(), reverse: [...s].reverse().join(''), length: s.length, size: s.length };
      return `=> ${typeof res[method] === 'string' ? `"${res[method]}"` : res[method]}`;
    }

    const chain = e.match(/^(\w+)\.new\.(\w+[!?]?)(\(.*\))?$/);
    if (chain) {
      const [, cls, method] = chain;
      const obj = ctx[cls];
      if (obj && typeof obj[method] === 'function') return format(obj[method]());
    }

    const staticCall = e.match(/^(\w+)::(\w+)$/);
    if (staticCall) {
      const [, mod, prop] = staticCall;
      const obj = ctx[mod];
      if (obj) {
        const val = obj[prop];
        if (typeof val === 'function') return format(val());
        return format(val);
      }
    }

    const staticMethod = e.match(/^(\w+)\.(\w+)(\((.*)\))?$/);
    if (staticMethod) {
      const [, mod, method, , args] = staticMethod;
      const obj = ctx[mod];
      if (obj && typeof obj[method] === 'function') {
        const arg = args?.replace(/['"]/g, '');
        return format(obj[method](arg));
      }
      if (obj && obj[method] !== undefined) return format(obj[method]);
    }

    const constAccess = e.match(/^(\w+)\.(\w+)$/);
    if (constAccess) {
      const [, mod, prop] = constAccess;
      const obj = ctx[mod];
      if (obj && obj[prop] !== undefined) return format(obj[prop]);
    }

    throw new Error(`NameError: undefined local variable or method \`${e.split(/[.(]/)[0]}\``);
  }

  return { buildContext, eval: safeEval, format };
})();
