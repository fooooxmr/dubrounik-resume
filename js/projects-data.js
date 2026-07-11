const PROJECTS_DATA = {
  avallain: {
    key: 'p_avallain',
    slug: 'avallain',
    en: {
      name: 'Avallain',
      role: 'Senior Software Developer',
      skills: 'Rails, Ruby, react-rails, RSpec, SQS, Sidekiq, Shoryuken, OneRoster, ClassLink, Capistrano, SAML 2.0',
      description: 'International premium eLearning platform. Millions of learners. SSO, OneRoster, homework flows.',
      achievements: [
        'Led architecture decisions and project evolution',
        'Designed scalable OneRoster integration',
        'Migrated Sidekiq → SQS Shoryuken and back',
        'Refactored Import process for scalability & readability',
        'Implemented SSO (SAML, ClassLink)',
        'Profiled & optimized for max speed and scalability',
        'Fixed critical memory leak in import pipeline',
        'Integrated AI tools for dev efficiency & problem-solving'
      ]
    },
    ru: {
      name: 'Avallain',
      role: 'Senior Software Developer',
      skills: 'Rails, Ruby, react-rails, RSpec, SQS, Sidekiq, Shoryuken, OneRoster, ClassLink, Capistrano, SAML 2.0',
      description: 'Международная eLearning-платформа. Миллионы пользователей. SSO, OneRoster, домашние задания.',
      achievements: [
        'Архитектурные решения и эволюция проекта',
        'Масштабируемая интеграция OneRoster',
        'Миграция Sidekiq ↔ SQS Shoryuken',
        'Рефакторинг Import-процесса',
        'SSO-интеграции (SAML, ClassLink)',
        'Профилирование и оптимизация производительности',
        'Исправление утечки памяти в import pipeline',
        'AI-инструменты для ускорения разработки'
      ]
    }
  },
  hoot: {
    key: 'p_hoot',
    slug: 'hoot_dev',
    en: {
      name: 'hoot.dev',
      role: 'Senior Software Developer',
      skills: 'Ruby API, React, Heroku, AppBox, Sidekiq, Postgres, GitHub Actions, RSpec, Rails, S3',
      description: 'Connects insurance agents with medical experts. DICOM viewer in browser. Appointments & file storage.',
      achievements: [
        'Performance refactor & module optimization',
        'Led technical decisions for project evolution',
        'Built appointment & time management features E2E',
        'CI/CD with GitHub Actions',
        'AppBox ↔ Cloud File Storage integrations',
        'Refactored File Upload mechanism'
      ]
    },
    ru: {
      name: 'hoot.dev',
      role: 'Senior Software Developer',
      skills: 'Ruby API, React, Heroku, AppBox, Sidekiq, Postgres, GitHub Actions, RSpec, Rails, S3',
      description: 'Связь страховых агентов с медэкспертами. DICOM в браузере. Записи и хранение файлов.',
      achievements: [
        'Рефакторинг и оптимизация производительности',
        'Технические решения по развитию проекта',
        'Фичи записи и тайм-менеджмента E2E',
        'CI/CD на GitHub Actions',
        'Интеграции AppBox ↔ облачное хранилище',
        'Рефакторинг механизма загрузки файлов'
      ]
    }
  },
  loyaltyplus: {
    key: 'p_loyalty',
    slug: 'loyalty_plus',
    en: {
      name: 'LoyaltyPlus',
      role: 'Senior Software Engineer',
      skills: 'Docker, Kubernetes, AWS, PostgreSQL, Rails, JS, RSpec, WebMock, Microservices, Lambda, SOA, RabbitMQ',
      description: 'Cloud SaaS loyalty lifecycle platform for major brands. Omni-channel, first-party data analytics.',
      achievements: [
        'Rails 3 → 6 migration',
        '85% test coverage via unit/integration tests',
        'Frontend redesign & development',
        'CI/CD integration & support',
        'Microservices architecture support',
        'Independent code reviews & reusable libraries'
      ]
    },
    ru: {
      name: 'LoyaltyPlus',
      role: 'Senior Software Engineer',
      skills: 'Docker, Kubernetes, AWS, PostgreSQL, Rails, JS, RSpec, WebMock, Microservices, Lambda, SOA, RabbitMQ',
      description: 'Облачная SaaS-платформа лояльности для крупных брендов. Омниканал, first-party аналитика.',
      achievements: [
        'Миграция Rails 3 → 6',
        '85% покрытие тестами',
        'Редизайн и разработка фронтенда',
        'CI/CD интеграция',
        'Поддержка микросервисной архитектуры',
        'Code review и переиспользуемые библиотеки'
      ]
    }
  },
  listenloop: {
    key: 'p_listen',
    slug: 'listen_loop',
    en: {
      name: 'ListenLoop',
      role: 'Senior Software Engineer / Team Lead',
      skills: 'Redux, React, Rails, Redis, AWS S3/Redshift/RDS, Auth0, Microservices, Lambda, K8s, AI',
      description: 'B2B account-based marketing. Campaign config, analytics charts, marketing automation.',
      achievements: [
        'Technical growth of the engineering team',
        'Third-party integration support',
        'Unit tests, automation, code reviews',
        'Rails monolith → Go lambdas migration',
        'Postgres → Redshift Big Data migration',
        'Auth0 & Okta authorization redesign',
        'Microservices on Kubernetes',
        'AI-based Job Titles matching'
      ]
    },
    ru: {
      name: 'ListenLoop',
      role: 'Senior Software Engineer / Team Lead',
      skills: 'Redux, React, Rails, Redis, AWS S3/Redshift/RDS, Auth0, Microservices, Lambda, K8s, AI',
      description: 'B2B account-based marketing. Кампании, аналитика, маркетинговая автоматизация.',
      achievements: [
        'Технический рост команды',
        'Интеграции с third-party',
        'Тесты, автоматизация, code review',
        'Миграция монолита Rails → Go lambdas',
        'Миграция Postgres → Redshift',
        'Редизайн авторизации Auth0/Okta',
        'Микросервисы на Kubernetes',
        'AI Job Titles matching'
      ]
    }
  },
  friendsurance: {
    key: 'p_friends',
    slug: 'friendsurance',
    en: {
      name: 'Friendsurance',
      role: 'Senior Software Engineer',
      skills: 'Rails, React, ElasticSearch, AWS S3, AWS SQS, OCR, LDAP',
      description: 'Digital insurance broker. 150K customers, 175+ insurance companies. ML on unstructured data.',
      achievements: [
        'Strategic SQS → Sidekiq migration — lower ops costs',
        'OCR service integration for document processing',
        'SSO via Active Directory (LDAP)',
        'ElasticSearch optimization — faster queries',
        'Complex bug fixes across the stack',
        'Legacy refactoring & technical documentation'
      ]
    },
    ru: {
      name: 'Friendsurance',
      role: 'Senior Software Engineer',
      skills: 'Rails, React, ElasticSearch, AWS S3, AWS SQS, OCR, LDAP',
      description: 'Цифровой страховой брокер. 150K клиентов, 175+ страховых. ML на неструктурированных данных.',
      achievements: [
        'Миграция SQS → Sidekiq — снижение затрат',
        'Интеграция OCR для документов',
        'SSO через Active Directory (LDAP)',
        'Оптимизация ElasticSearch',
        'Сложные багфиксы по всему стеку',
        'Рефакторинг legacy и техдокументация'
      ]
    }
  },
  spiderdoor: {
    key: 'p_spider',
    slug: 'spider_door',
    en: {
      name: 'SpiderDoor',
      role: 'Senior Software Engineer',
      skills: 'Ruby, Rails, jQuery, Bootstrap, Twilio, Mobile API',
      description: 'Self-storage management: keypads, push/text notifications, mobile apps for tenants.',
      achievements: [
        'Deployment & client UI development',
        'Admin area redesign',
        'Access control & custom design migration',
        'Twilio integration'
      ]
    },
    ru: {
      name: 'SpiderDoor',
      role: 'Senior Software Engineer',
      skills: 'Ruby, Rails, jQuery, Bootstrap, Twilio, Mobile API',
      description: 'Self-storage: кейпады, push/SMS, мобильные приложения для арендаторов.',
      achievements: [
        'Деплой и клиентский UI',
        'Редизайн админки',
        'Контроль доступа и кастомный дизайн',
        'Интеграция Twilio'
      ]
    }
  },
  tracker: {
    key: 'p_tracker',
    slug: 'tracker',
    en: {
      name: 'Tracker',
      role: 'Senior Software Engineer',
      skills: 'jQuery, JavaScript, HTML5, CSS3, Bootstrap, CoffeeScript, Ruby, Rails',
      description: 'Agile project management @ Anadea. Transparency, planning, tracking, remote collaboration.',
      achievements: [
        'Business logic & UI implementation',
        'Time tracking system',
        'Tag system in tasks',
        'Third-party integrations'
      ]
    },
    ru: {
      name: 'Tracker',
      role: 'Senior Software Engineer',
      skills: 'jQuery, JavaScript, HTML5, CSS3, Bootstrap, CoffeeScript, Ruby, Rails',
      description: 'Agile PM @ Anadea. Прозрачность, планирование, трекинг, удалённая коллаборация.',
      achievements: [
        'Бизнес-логика и UI',
        'Система тайм-трекинга',
        'Теги в задачах',
        'Интеграции с third-party'
      ]
    }
  },
  shiphawk: {
    key: 'p_ship',
    slug: 'ship_hawk',
    en: {
      name: 'ShipHawk',
      role: 'Senior Software Engineer',
      skills: 'React, Rails, Grape, ElasticSearch, Redis, Sidekiq',
      description: 'Shipping automation software. Carriers, billing, import/export.',
      achievements: [
        'New carrier integrations',
        'Billing implementation',
        'UI optimization',
        'Import/export XLS, XML, CSV',
        'Access Control system'
      ]
    },
    ru: {
      name: 'ShipHawk',
      role: 'Senior Software Engineer',
      skills: 'React, Rails, Grape, ElasticSearch, Redis, Sidekiq',
      description: 'Автоматизация доставки. Перевозчики, биллинг, импорт/экспорт.',
      achievements: [
        'Интеграции новых перевозчиков',
        'Биллинг',
        'Оптимизация UI',
        'Импорт/экспорт XLS, XML, CSV',
        'Система контроля доступа'
      ]
    }
  },
  bahamas: {
    key: 'p_bahamas',
    slug: 'bahamas_vacations',
    en: {
      name: 'Bahamas Vacations',
      role: 'Senior Software Engineer',
      skills: 'Ruby on Rails, jQuery, Third-party APIs',
      description: 'Travel booking: flights, hotels, car rentals.',
      achievements: [
        'Hotels API & Car Rental API integration',
        'Booking system optimization',
        'Code refactoring & business logic optimization'
      ]
    },
    ru: {
      name: 'Bahamas Vacations',
      role: 'Senior Software Engineer',
      skills: 'Ruby on Rails, jQuery, Third-party APIs',
      description: 'Бронирование: авиа, отели, аренда авто.',
      achievements: [
        'Интеграции Hotels API и Car Rental API',
        'Оптимизация системы бронирования',
        'Рефакторинг и оптимизация бизнес-логики'
      ]
    }
  }
};

const PROJECT_KEYS = Object.keys(PROJECTS_DATA);
