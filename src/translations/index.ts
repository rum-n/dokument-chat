import { Language } from "../contexts/LanguageContext";

interface TranslationStrings {
  nav: {
    signIn: string;
    getStarted: string;
  };
  hero: {
    title: string;
    subtitle: string;
    startChatting: string;
    watchDemo: string;
    documentUploaded: string;
  };
  features: {
    title: string;
    subtitle: string;
    smartPdf: {
      title: string;
      description: string;
    };
    naturalChat: {
      title: string;
      description: string;
    };
    multilingual: {
      title: string;
      description: string;
    };
    smartSearch: {
      title: string;
      description: string;
    };
    secure: {
      title: string;
      description: string;
    };
    fast: {
      title: string;
      description: string;
    };
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
    };
    step3: {
      title: string;
      description: string;
    };
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    description: string;
    product: string;
    company: string;
    support: string;
    features: string;
    pricing: string;
    api: string;
    documentation: string;
    about: string;
    blog: string;
    careers: string;
    contact: string;
    helpCenter: string;
    privacyPolicy: string;
    termsOfService: string;
    status: string;
    copyright: string;
    comingSoon: string;
  };
  auth: {
    // Login
    title: string;
    subtitle: string;
    email: string;
    password: string;
    signIn: string;
    forgotPassword: string;
    noAccount: string;
    signUp: string;
    backToHome: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    demoCredentials: string;
    demoEmail: string;
    demoPassword: string;
    signInWithDemo: string;
    or: string;

    // Signup
    createAccount: string;
    signupSubtitle: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    alreadyHaveAccount: string;

    // Validation
    requiredFields: string;
    passwordsDontMatch: string;
    passwordTooShort: string;
    invalidEmail: string;

    // Messages
    signupSuccess: string;
    signupFailed: string;
    loginFailed: string;
  };
  useCases: {
    title: string;
    subtitle: string;
    academic: {
      title: string;
      description: string;
      examples: string[];
    };
    business: {
      title: string;
      description: string;
      examples: string[];
    };
    legal: {
      title: string;
      description: string;
      examples: string[];
    };
    technical: {
      title: string;
      description: string;
      examples: string[];
    };
    healthcare: {
      title: string;
      description: string;
      examples: string[];
    };
    education: {
      title: string;
      description: string;
      examples: string[];
    };
  };
  pricing: {
    title: string;
    subtitle: string;
    free: {
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      button: string;
      popular: boolean;
    };
    premium: {
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      button: string;
      popular: boolean;
    };
    ultimate: {
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      button: string;
      popular: boolean;
    };
  };
  languageSwitcher: {
    en: string;
    bg: string;
  };
}

type Translations = {
  [key in Language]: TranslationStrings;
};

export const translations: Translations = {
  en: {
    // Navigation
    nav: {
      signIn: "Sign In",
      getStarted: "Get Started",
    },

    // Hero Section
    hero: {
      title: "Chat with Your Documents",
      subtitle:
        "Upload your PDF documents and ask questions. Get instant, accurate answers with page references powered by AI.",
      startChatting: "Start Chatting Now",
      watchDemo: "Watch Demo",
      documentUploaded: "Uploaded successfully",
    },

    // Features Section
    features: {
      title: "Powerful Features for Document Intelligence",
      subtitle:
        "Transform how you interact with your documents using advanced AI technology",
      smartPdf: {
        title: "Smart PDF Processing",
        description:
          "Upload any PDF document and our AI will extract and understand the content, making it searchable and queryable.",
      },
      naturalChat: {
        title: "Natural Language Chat",
        description:
          "Ask questions using natural language. Get instant, accurate answers with page references.",
      },
      multilingual: {
        title: "Multilingual Support",
        description:
          "Full support for Bulgarian and English. Ask questions in either language and receive responses in the same language.",
      },
      smartSearch: {
        title: "Smart Search",
        description:
          "Advanced vector search finds the most relevant content across your documents for accurate and contextual answers.",
      },
      secure: {
        title: "Secure & Private",
        description:
          "Your documents are processed securely. We don't store your content and all data is encrypted in transit.",
      },
      fast: {
        title: "Lightning Fast",
        description:
          "Get instant answers powered by state-of-the-art AI models. No waiting, no delays - just fast, accurate responses.",
      },
    },

    // How It Works
    howItWorks: {
      title: "How It Works",
      subtitle: "Get started in minutes with our simple three-step process",
      step1: {
        title: "Upload Your PDF",
        description:
          "Simply drag and drop your PDF document or click to browse. We support documents up to 20MB in size.",
      },
      step2: {
        title: "AI Processing",
        description:
          "Our AI extracts and analyzes the content, creating searchable chunks with intelligent embeddings.",
      },
      step3: {
        title: "Start Chatting",
        description:
          "Ask questions and get instant answers with clickable page references.",
      },
    },

    // CTA Section
    cta: {
      title: "Ready to Transform Your Document Experience?",
      subtitle:
        "Join thousands of users who are already chatting with their documents. Get started today and see the difference AI can make.",
      button: "Start now for free",
    },

    // Footer
    footer: {
      description: "AI-powered document chat platform.",
      product: "Product",
      company: "Company",
      support: "Support",
      features: "Features",
      pricing: "Pricing",
      api: "API",
      documentation: "Documentation",
      about: "About",
      blog: "Blog",
      careers: "Careers",
      contact: "Contact",
      helpCenter: "Help Center",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      status: "Status",
      copyright: "© 2024 Dokument Chat. All rights reserved.",
      comingSoon: "(coming soon)",
    },

    // Auth Section
    auth: {
      // Login
      title: "Welcome Back",
      subtitle: "Sign in to your account to continue",
      email: "Email",
      password: "Password",
      signIn: "Sign In",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      backToHome: "Back to Home",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      demoCredentials: "Demo Credentials",
      demoEmail: "demo@example.com",
      demoPassword: "demo123",
      signInWithDemo: "Sign in with Demo",
      or: "or",

      // Signup
      createAccount: "Create Account",
      signupSubtitle:
        "Join Dokument Chat and start chatting with your documents",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      alreadyHaveAccount: "Already have an account?",

      // Validation
      requiredFields: "Please fill in all required fields",
      passwordsDontMatch: "Passwords don't match",
      passwordTooShort: "Password must be at least 6 characters long",
      invalidEmail: "Please enter a valid email address",

      // Messages
      signupSuccess: "Account created successfully! Redirecting...",
      signupFailed: "Failed to create account. Please try again.",
      loginFailed: "Login failed. Please check your credentials.",
    },

    // Use Cases Section
    useCases: {
      title: "Perfect for Every Document Type",
      subtitle:
        "From academic research to business reports, Dokument Chat helps you understand any document instantly",
      academic: {
        title: "Academic & Research",
        description:
          "Analyze research papers, textbooks, and academic documents",
        examples: [
          "Scientific papers",
          "Textbooks",
          "Research reports",
          "Theses",
          "Academic articles",
        ],
      },
      business: {
        title: "Business & Finance",
        description:
          "Extract insights from financial reports and business documents",
        examples: [
          "Financial reports",
          "Annual reports",
          "Business plans",
          "Market analysis",
          "Investment documents",
        ],
      },
      legal: {
        title: "Legal & Compliance",
        description:
          "Navigate complex legal documents and contracts efficiently",
        examples: [
          "Contracts",
          "Legal briefs",
          "Regulatory documents",
          "Compliance reports",
          "Policy documents",
        ],
      },
      technical: {
        title: "Technical & Manuals",
        description:
          "Get instant answers from technical documentation and manuals",
        examples: [
          "User manuals",
          "Technical specifications",
          "API documentation",
          "Product guides",
          "Installation guides",
        ],
      },
      healthcare: {
        title: "Healthcare & Medical",
        description: "Understand medical documents and research papers quickly",
        examples: [
          "Medical research",
          "Clinical studies",
          "Patient documentation",
          "Medical guidelines",
          "Drug information",
        ],
      },
      education: {
        title: "Education & Training",
        description: "Enhance learning with interactive document analysis",
        examples: [
          "Training materials",
          "Course content",
          "Educational resources",
          "Study guides",
          "Assessment documents",
        ],
      },
    },

    // Pricing Section
    pricing: {
      title: "Simple, Transparent Pricing",
      subtitle:
        "Choose the plan that fits your needs. All plans include our core AI features.",
      free: {
        name: "Free",
        price: "€0",
        period: "/month",
        description: "Perfect for trying out Dokument Chat",
        features: [
          "1 PDF upload per day",
          "100 questions per month",
          "10 MB file size limit",
          "Document deleted next day",
          "Basic AI chat support",
          "Page references in answers",
        ],
        button: "Get Started Free",
        popular: false,
      },
      premium: {
        name: "Premium",
        price: "€9",
        period: "/month",
        description: "Ideal for regular document analysis",
        features: [
          "20 PDF uploads per day",
          "1000 questions per month",
          "20 MB file size limit",
          "Documents stored for 30 days",
          "Priority AI chat support",
          "Advanced search features",
          "Export chat history",
        ],
        button: "Start Premium",
        popular: true,
      },
      ultimate: {
        name: "Ultimate",
        price: "€29",
        period: "/month",
        description: "For power users and teams",
        features: [
          "Unlimited PDF uploads",
          "Unlimited questions per month",
          "50 MB file size limit",
          "Documents stored permanently",
          "Priority support",
          "Advanced analytics",
          "Team collaboration",
          "API access",
        ],
        button: "Start Ultimate",
        popular: false,
      },
    },

    // Language Switcher
    languageSwitcher: {
      en: "English",
      bg: "Български",
    },
  },

  bg: {
    // Navigation
    nav: {
      signIn: "Вход",
      getStarted: "Започни",
    },

    // Hero Section
    hero: {
      title: "Попитайте своите документи",
      subtitle:
        "Качете PDF документи и започнете чат с тях. Получете мигновени, точни отговори с референции към страниците, задвижвани от ИИ.",
      startChatting: "Започнете чат сега",
      watchDemo: "Гледайте демото",
      documentUploaded: "Качен успешно",
    },

    // Features Section
    features: {
      title: "Мощни Функции за Интелигентност на Документите",
      subtitle:
        "Трансформирайте начина, по който взаимодействате с вашите документи, използвайки усъвършенствана ИИ технология",
      smartPdf: {
        title: "Интелигентна PDF обработка",
        description:
          "Качете всеки PDF документ и нашият ИИ ще извлече и разбере съдържанието, правейки го търсим и заявяем.",
      },
      naturalChat: {
        title: "Естествен Езиков Чат",
        description:
          "Задавайте въпроси на естествен език. Получете мигновени, точни отговори с референции към страниците.",
      },
      multilingual: {
        title: "Многоезична Поддръжка",
        description:
          "Пълна поддръжка за български и английски. Задавайте въпроси на всеки от езиците и получавайте отговори на същия език.",
      },
      smartSearch: {
        title: "Интелигентно Търсене",
        description:
          "Усъвършенствано векторно търсене намира най-релевантното съдържание във вашите документи за точни и контекстуални отговори.",
      },
      secure: {
        title: "Сигурно и Приватно",
        description:
          "Вашите документи се обработват сигурно. Ние не съхраняваме вашето съдържание и всички данни са криптирани при предаване.",
      },
      fast: {
        title: "Мълниеносно Бързо",
        description:
          "Получете мигновени отговори, задвижвани от най-новите ИИ модели. Без изчакване, без закъснения - просто бързи, точни отговори.",
      },
    },

    // How It Works
    howItWorks: {
      title: "Как Работи",
      subtitle: "Започнете за минути с нашия прост тристепенен процес",
      step1: {
        title: "Качете Вашия PDF",
        description:
          "Просто плъзнете и пуснете вашия PDF документ или кликнете за разглеждане. Поддържаме документи до 20MB.",
      },
      step2: {
        title: "ИИ Обработка",
        description:
          "Нашият ИИ извлича и анализира съдържанието, създавайки търсими парчета с интелигентни вграждания.",
      },
      step3: {
        title: "Започнете Чат",
        description:
          "Задавайте въпроси на български или английски и получете мигновени отговори с референции към страниците.",
      },
    },

    // CTA Section
    cta: {
      title: "Готови ли сте да промените как четете документи?",
      subtitle:
        "Присъединете се към хиляди потребители, които вече чатят с техните документи. Започнете днес и вижте разликата.",
      button: "Започнете сега",
    },

    // Footer
    footer: {
      description: "ИИ-задвижвана платформа за чат с документи.",
      product: "Продукт",
      company: "Компания",
      support: "Поддръжка",
      features: "Функции",
      pricing: "Цени",
      api: "API",
      documentation: "Документация",
      about: "За нас",
      blog: "Блог",
      careers: "Кариери",
      contact: "Контакти",
      helpCenter: "Център за Помощ",
      privacyPolicy: "Политика за Поверителност",
      termsOfService: "Условия за Ползване",
      status: "Статус",
      copyright: "© 2025 Dokument Chat. Всички права запазени.",
      comingSoon: "(скоро)",
    },

    // Auth Section
    auth: {
      // Login
      title: "Добре дошли отново",
      subtitle: "Влезте в профила си, за да продължите",
      email: "Имейл",
      password: "Парола",
      signIn: "Вход",
      forgotPassword: "Забравена парола?",
      noAccount: "Нямате акаунт?",
      signUp: "Регистрация",
      backToHome: "Обратно към Началото",
      emailPlaceholder: "Въведете вашия имейл",
      passwordPlaceholder: "Въведете вашата парола",
      demoCredentials: "Демо Данни",
      demoEmail: "demo@example.com",
      demoPassword: "demo123",
      signInWithDemo: "Вход с Демо",
      or: "или",

      // Signup
      createAccount: "Създаване на Акаунт",
      signupSubtitle:
        "Присъединете се към Dokument Chat и започнете чат с вашите документи",
      confirmPassword: "Потвърди парола",
      confirmPasswordPlaceholder: "Потвърдете вашата парола",
      alreadyHaveAccount: "Вече имате акаунт?",

      // Validation
      requiredFields: "Моля, попълнете всички задължителни полета",
      passwordsDontMatch: "Паролите не съвпадат",
      passwordTooShort: "Паролата трябва да бъде поне 6 символа",
      invalidEmail: "Моля, въведете валиден имейл адрес",

      // Messages
      signupSuccess: "Акаунтът е създаден успешно! Пренасочване...",
      signupFailed: "Неуспешно създаване на акаунт. Моля, опитайте отново.",
      loginFailed: "Неуспешен вход. Моля, проверете данните си.",
    },

    // Use Cases Section
    useCases: {
      title: "Идеален за Всеки Тип Документ",
      subtitle:
        "От академични изследвания до бизнес отчети, Dokument Chat ви помага да разберете всеки документ мигновено",
      academic: {
        title: "Академични и Научни",
        description:
          "Анализирайте научни статии, учебници и академични документи",
        examples: [
          "Научни статии",
          "Учебници",
          "Изследователски отчети",
          "Дипломни работи",
          "Академични статии",
        ],
      },
      business: {
        title: "Бизнес и Финанси",
        description:
          "Извлечете прозрения от финансови отчети и бизнес документи",
        examples: [
          "Финансови отчети",
          "Годишни отчети",
          "Бизнес планове",
          "Пазарен анализ",
          "Инвестиционни документи",
        ],
      },
      legal: {
        title: "Юридически и Счетоводни",
        description: "Навигирайте ефективно сложни правни документи и договори",
        examples: [
          "Договори",
          "Правни меморандуми",
          "Регулаторни документи",
          "Отчети за съответствие",
          "Политически документи",
        ],
      },
      technical: {
        title: "Технически и Ръководства",
        description:
          "Получете мигновени отговори от техническа документация и ръководства",
        examples: [
          "Потребителски ръководства",
          "Технически спецификации",
          "API документация",
          "Продуктови ръководства",
          "Инсталационни ръководства",
        ],
      },
      healthcare: {
        title: "Здравеопазване и Медицина",
        description: "Разберете бързо медицински документи и научни статии",
        examples: [
          "Медицински изследвания",
          "Клинични проучвания",
          "Документация на пациенти",
          "Медицински насоки",
          "Информация за лекарства",
        ],
      },
      education: {
        title: "Образование и Обучение",
        description: "Подобрете обучението с интерактивен анализ на документи",
        examples: [
          "Обучаващи материали",
          "Съдържание на курсове",
          "Образователни ресурси",
          "Учебни ръководства",
          "Документи за оценяване",
        ],
      },
    },

    // Pricing Section
    pricing: {
      title: "Прозрачни Цени",
      subtitle:
        "Изберете плана, който отговаря на вашите нужди. Всички планове включват нашите основни ИИ функции.",
      free: {
        name: "Безплатен",
        price: "€0",
        period: "/месец",
        description: "Идеален за опитване на Dokument Chat",
        features: [
          "1 PDF качване на ден",
          "100 въпроса на месец",
          "10 MB лимит на файл",
          "Документът се изтрива на следващия ден",
          "Основна ИИ чат поддръжка",
          "Референции към страници в отговорите",
        ],
        button: "Изберете",
        popular: false,
      },
      premium: {
        name: "Премиум",
        price: "€9",
        period: "/месец",
        description: "Идеален за редовен анализ на документи",
        features: [
          "20 PDF качвания на ден",
          "1000 въпроса на месец",
          "20 MB лимит на файл",
          "Документите се съхраняват 30 дни",
          "Приоритетна поддръжка",
          "Експорт на историята на чата",
        ],
        button: "Изберете",
        popular: true,
      },
      ultimate: {
        name: "Ултимативен",
        price: "€29",
        period: "/месец",
        description: "За професионалисти и екипи",
        features: [
          "Неограничени PDF качвания",
          "Неограничени въпроси на месец",
          "50 MB лимит на файл",
          "Документите се съхраняват постоянно",
          "Приоритетна поддръжка",
          "API достъп (скоро)",
        ],
        button: "Изберете",
        popular: false,
      },
    },

    // Language Switcher
    languageSwitcher: {
      en: "English",
      bg: "Български",
    },
  },
};
