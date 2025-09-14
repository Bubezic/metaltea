// Расширяем структуру уроков
export const lessonTypes = {
  LECTURE: 'lecture',
  TEST: 'test',
  OPEN_QUESTION: 'open_question',
  SIMULATOR: 'simulator'
};

// Добавляем больше курсов и уроков
export const coursesData = [
  {
    id: 1,
    title: 'Основы работы со смартфоном',
    category: 'Компьютерная грамотность',
    description: 'Научитесь уверенно пользоваться смартфоном',
    icon: '📱',
    seasonality: null,
    difficulty: 'Начальный',
    lessons: 5,
    lessons: [
      {
        id: 101,
        title: 'Включение и основные жесты',
        type: lessonTypes.LECTURE,
        content: `<h1>Добро пожаловать!</h1><p>Современный смартфон — это ваш помощник.</p><p><strong>Кнопка питания:</strong> зажмите на 2-3 секунды.</p>`
      },
      {
        id: 102,
        title: 'Проверочный тест',
        type: lessonTypes.TEST,
        content: {
          question: "Для чего нужна кнопка питания?",
          options: [
            "Для увеличения громкости",
            "Для включения/выключения",
            "Для выхода в интернет"
          ],
          correctAnswer: 1
        }
      },
      {
        id: 103,
        title: 'Тренажер: сделайте звонок',
        type: lessonTypes.SIMULATOR,
        content: {
          type: 'phone_call',
          task: "Симуляция звонка. Нажмите на иконку телефона, затем выберите контакт 'Внук' и нажмите кнопку вызова.",
          steps: [
            "Найти иконку телефона",
            "Выбрать контакт 'Внук'",
            "Нажать кнопку вызова"
          ],
    contacts: [
      { 
        name: "Внук", 
        number: "+7 900 123-45-67", 
        relation: "Внук Алексей" 
      },
      { 
        name: "Мария", 
        number: "+7 900 765-43-21", 
        relation: "Дочь" 
      },
      { 
        name: "Сергей", 
        number: "+7 900 111-22-33", 
        relation: "Сын" 
      },
      { 
        name: "Соседка", 
        number: "+7 900 999-88-77", 
        relation: "Соседка Люда" 
      }
    ]
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Летняя зарядка',
    category: 'Здоровье',
    description: 'Упражнения для поддержания тонуса',
    icon: '🌞',
    seasonality: 'summer',
    difficulty: 'Начальный',
    lessons: 3,
    lessons: [
      {
        id: 201,
        title: 'Вводное занятие',
        type: lessonTypes.LECTURE,
        content: `<h1>Летняя зарядка</h1><p>Занимайтесь на свежем воздухе...</p>`
      }
    ]
  },
  {
    id: 3,
    title: 'Безопасность в интернете',
    category: 'Компьютерная грамотность',
    description: 'Научитесь распознавать мошенников и защищать свои данные',
    icon: '🛡️',
    seasonality: null,
    difficulty: 'Средний',
    lessons: 4,
    lessons: [
      {
  id: 301,
  title: 'Распознавание фишинговых сайтов',
  type: lessonTypes.SIMULATOR,
  content: {
    type: 'phishing',
    task: "Определите, какой из сайтов является поддельным. Внимательно смотрите на адресную строку!",
    steps: [
      "Внимательно изучите URL-адрес",
      "Найдите подозрительные элементы в адресе", 
      "Выберите опасный сайт"
    ],
    examples: [
      { 
        url: "https://vkontakte.ru", 
        suspicious: false, 
        reason: "Официальный домен .ru" 
      },
      { 
        url: "https://vk0ntakte.com", 
        suspicious: true, 
        reason: "Цифра 0 вместо буквы o в названии" 
      },
      { 
        url: "https://sberbank.ru", 
        suspicious: false, 
        reason: "Официальный домен банка" 
      },
      { 
        url: "https://sberbank-online.com", 
        suspicious: true, 
        reason: "Подозрительный домен .com вместо .ru" 
      },
      { 
        url: "https://ваш-банк.рф", 
        suspicious: true, 
        reason: "Подозрительное название домена" 
      }
    ]
  }
}
    ]
  },
  {
    id: 4,
    title: 'Оплата ЖКХ онлайн',
    category: 'Финансовая грамотность',
    description: 'Научитесь оплачивать коммунальные услуги через интернет',
    icon: '💳',
    seasonality: null,
    difficulty: 'Начальный',
    lessons: 3,
    lessons: [
      {
        id: 401,
        title: 'Тренажер оплаты через Сбербанк Онлайн',
        type: lessonTypes.SIMULATOR,
        content: {
          type: 'payment',
          task: "Оплатите счет за квартиру через мобильное приложение",
          steps: [
            "Откройте раздел 'Платежи'",
            "Выберите 'ЖКХ'",
            "Введите номер лицевого счета",
            "Проверьте сумму и нажмите 'Оплатить'",
            "Подтвердите платеж кодом из SMS"
          ]
        }
      }
    ]
  },
  {
    id: 5,
    title: 'Зимняя безопасность',
    category: 'Здоровье',
    description: 'Как избежать падений и переохлаждения в зимний период',
    icon: '⛄',
    seasonality: 'winter',
    difficulty: 'Начальный',
    lessons: 2,
    lessons: [
      {
  id: 501,
  title: 'Выбор безопасной обуви',
  type: lessonTypes.SIMULATOR,
  content: {
    type: 'safety',
    task: "Выберите ВСЕ подходящие варианты обуви для безопасной зимней прогулки",
    steps: [
      "Оцените характеристики каждой пары обуви",
      "Выберите все безопасные варианты",
      "Убедитесь в правильности выбора"
    ],
    shoes: [
      { 
        type: "Сапоги на высокой платформе", 
        safe: false, 
        reason: "Высокая платформа увеличивает риск падения и неустойчивости на льду" 
      },
      { 
        type: "Кроссовки с гладкой подошвой", 
        safe: false, 
        reason: "Гладкая подошва скользит на льду, нет сцепления с поверхностью" 
      },
      { 
        type: "Зимние ботинки с рифленой подошвой", 
        safe: true, 
        reason: "Рифленая подошва обеспечивает отличное сцепление со снегом и льдом" 
      },
      { 
        type: "Валенки с резиновой подошвой", 
        safe: true, 
        reason: "Резиновая подошва предотвращает скольжение, а утепление защищает от холода" 
      },
      { 
        type: "Туфли на кожаной подошве", 
        safe: false, 
        reason: "Кожаная подошва очень скользкая на зимних поверхностях" 
      },
      { 
        type: "Зимние мокасины с противоскользящим покрытием", 
        safe: true, 
        reason: "Противоскользящее покрытие и утепление делают их безопасными для зимы" 
      }
    ]
  }
}
    ]
  }
];

// База знаний пользователя
export const userKnowledgeBase = {
  completedCourses: [],
  currentProgress: {},
  achievements: []
};