export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameType = 'quiz' | 'match' | 'sort' | 'fill' | 'code' | 'logic' | 'quest' | 'oddone' | 'typetext' | 'truefalse' | 'numpad' | 'catch' | 'wordbuild' | 'race' | 'puzzle';

export interface Game {
  id: number;
  title: string;
  description: string;
  topic: string;
  grade: string;
  difficulty: Difficulty;
  type: GameType;
  emoji: string;
  xp: number;
  duration: string;
  questions?: QuizQuestion[];
  matchPairs?: MatchPair[];
  sortItems?: SortItem[];
  fillBlanks?: FillBlank[];
  quest?: QuestData;
  oddOneRounds?: OddOneRound[];
  typeTextRounds?: TypeTextRound[];
  trueFalseCards?: TrueFalseCard[];
  numpadRounds?: NumpadRound[];
  catchRounds?: CatchRound[];
  wordBuildRounds?: WordBuildRound[];
  raceQuestions?: RaceQuestion[];
  puzzleRounds?: PuzzleRound[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface SortItem {
  value: string;
  order: number;
}

export interface FillBlank {
  text: string;
  blanks: string[];
  answers: string[];
}

export interface CatchRound {
  question: string;
  items: { label: string; correct: boolean }[];
}

export interface WordBuildRound {
  clue: string;
  word: string;
}

export interface RaceQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface PuzzleRound {
  question: string;
  options: string[];
  correct: number;
  emoji: string;
}

export interface OddOneRound {
  items: string[];
  oddIndex: number;
  explanation: string;
}

export interface TypeTextRound {
  prompt: string;
  answer: string;
  hint: string;
}

export interface TrueFalseCard {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface NumpadRound {
  question: string;
  answer: number;
  unit: string;
  hint: string;
}

export interface QuestScene {
  id: string;
  character: string;
  avatar: string;
  text: string;
  type: 'dialog' | 'choice' | 'input' | 'result';
  choices?: { label: string; correct: boolean; nextId: string; response: string }[];
  nextId?: string;
  isEnd?: boolean;
  xpBonus?: number;
}

export interface QuestData {
  scenes: QuestScene[];
  startId: string;
}

export const games: Game[] = [
  // === АРКАДНЫЕ ИГРЫ ===
  {
    id: 401,
    title: 'Поймай ответ!',
    description: 'Правильные и неправильные термины летят по экрану — кликни только верные!',
    topic: 'Аппаратное обеспечение',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'catch',
    emoji: '🎯',
    xp: 65,
    duration: '4 мин',
    catchRounds: [
      { question: 'Лови устройства ВВОДА', items: [{ label: 'Клавиатура', correct: true }, { label: 'Монитор', correct: false }, { label: 'Мышь', correct: true }, { label: 'Принтер', correct: false }, { label: 'Сканер', correct: true }, { label: 'Колонки', correct: false }, { label: 'Микрофон', correct: true }, { label: 'Проектор', correct: false }] },
      { question: 'Лови устройства ХРАНЕНИЯ данных', items: [{ label: 'SSD', correct: true }, { label: 'RAM', correct: false }, { label: 'HDD', correct: true }, { label: 'CPU', correct: false }, { label: 'Flash-карта', correct: true }, { label: 'Видеокарта', correct: false }, { label: 'CD-диск', correct: true }, { label: 'Материнская плата', correct: false }] },
      { question: 'Лови ЯЗЫКИ ПРОГРАММИРОВАНИЯ', items: [{ label: 'Python', correct: true }, { label: 'HTML', correct: false }, { label: 'Java', correct: true }, { label: 'CSS', correct: false }, { label: 'C++', correct: true }, { label: 'SQL', correct: false }, { label: 'Pascal', correct: true }, { label: 'JSON', correct: false }] },
    ],
  },
  {
    id: 402,
    title: 'Собери слово!',
    description: 'Буквы рассыпались — кликай на них по порядку, чтобы собрать IT-термин',
    topic: 'Информатика и термины',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'wordbuild',
    emoji: '🔤',
    xp: 60,
    duration: '5 мин',
    wordBuildRounds: [
      { clue: 'Главный «мозг» компьютера (3 буквы)', word: 'CPU' },
      { clue: 'Временная память компьютера (3 буквы)', word: 'RAM' },
      { clue: 'Язык программирования — питон', word: 'PYTHON' },
      { clue: 'Всемирная паутина (3 буквы)', word: 'WWW' },
      { clue: 'Вредоносная программа', word: 'ВИРУС' },
      { clue: 'Сеть для соединения компьютеров', word: 'ИНТЕРНЕТ' },
      { clue: 'Хранилище данных на компьютере', word: 'БАЗА' },
      { clue: 'Программа для просмотра сайтов', word: 'БРАУЗЕР' },
    ],
  },
  {
    id: 403,
    title: 'Гонка знаний!',
    description: 'Отвечай быстрее — чем меньше времени потратишь, тем больше очков получишь!',
    topic: 'Основы информатики',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'race',
    emoji: '⚡',
    xp: 90,
    duration: '5 мин',
    raceQuestions: [
      { question: 'Сколько бит в байте?', options: ['4', '8', '16', '32'], correct: 1 },
      { question: 'Что такое алгоритм?', options: ['Программа', 'Последовательность шагов', 'База данных', 'Тип данных'], correct: 1 },
      { question: 'Какой тип данных хранит целые числа?', options: ['float', 'string', 'int', 'bool'], correct: 2 },
      { question: 'Что делает функция print() в Python?', options: ['Считывает ввод', 'Выводит текст', 'Создаёт файл', 'Удаляет данные'], correct: 1 },
      { question: 'Как называется повторяющийся блок кода?', options: ['Условие', 'Функция', 'Цикл', 'Переменная'], correct: 2 },
      { question: 'HTTP расшифровывается как...', options: ['HyperText Transfer Protocol', 'High Tech Transfer Program', 'Home Tool Transfer Page', 'Hyper Tool Text Protocol'], correct: 0 },
      { question: 'Двоичное 1000 равно...', options: ['4', '6', '8', '10'], correct: 2 },
      { question: 'Что хранит переменная?', options: ['Программу', 'Значение', 'Алгоритм', 'Функцию'], correct: 1 },
    ],
  },
  {
    id: 404,
    title: 'Пазл: Открой картинку!',
    description: 'За каждый верный ответ открывается кусочек секретной картинки — собери её полностью!',
    topic: 'Программирование на Python',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'puzzle',
    emoji: '🧩',
    xp: 80,
    duration: '6 мин',
    puzzleRounds: [
      { question: 'Как вывести текст в Python?', options: ['echo()', 'print()', 'write()', 'show()'], correct: 1, emoji: '🐍' },
      { question: 'Что такое переменная?', options: ['Программа', 'Ячейка памяти с именем', 'Функция', 'Цикл'], correct: 1, emoji: '📦' },
      { question: 'Какой оператор проверяет равенство?', options: ['=', '!=', '==', '=>'], correct: 2, emoji: '⚖️' },
      { question: 'Что делает цикл for?', options: ['Проверяет условие', 'Повторяет код N раз', 'Создаёт функцию', 'Останавливает программу'], correct: 1, emoji: '🔄' },
      { question: 'Как объявить функцию в Python?', options: ['function', 'def', 'func', 'define'], correct: 1, emoji: '🛠️' },
      { question: 'Что такое список (list) в Python?', options: ['Одно число', 'Набор элементов', 'Строка', 'Словарь'], correct: 1, emoji: '📋' },
    ],
  },
  // === НАЙДИ ЛИШНЕЕ ===
  {
    id: 301,
    title: 'Найди лишнее: Железо',
    description: 'Три предмета связаны по смыслу, один — чужой. Найди его!',
    topic: 'Аппаратное обеспечение',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'oddone',
    emoji: '🔍',
    xp: 50,
    duration: '4 мин',
    oddOneRounds: [
      { items: ['Процессор', 'Клавиатура', 'Оперативная память', 'Видеокарта'], oddIndex: 1, explanation: 'Клавиатура — устройство ввода. Остальные три — внутренние компоненты компьютера.' },
      { items: ['Монитор', 'Принтер', 'Сканер', 'Колонки'], oddIndex: 2, explanation: 'Сканер — устройство ввода. Остальные три — устройства вывода.' },
      { items: ['HDD', 'SSD', 'Flash-накопитель', 'Процессор'], oddIndex: 3, explanation: 'Процессор обрабатывает данные. Остальные три — устройства хранения данных.' },
      { items: ['Wi-Fi', 'Bluetooth', 'Ethernet', 'HDMI'], oddIndex: 3, explanation: 'HDMI — видеоинтерфейс. Остальные три — сетевые технологии передачи данных.' },
      { items: ['Python', 'Java', 'HTML', 'C++'], oddIndex: 2, explanation: 'HTML — язык разметки, а не программирования. Остальные три — языки программирования.' },
    ],
  },
  {
    id: 302,
    title: 'Найди лишнее: Программирование',
    description: 'Найди слово, которое не подходит к остальным трём',
    topic: 'Основы программирования',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'oddone',
    emoji: '🕵️',
    xp: 70,
    duration: '5 мин',
    oddOneRounds: [
      { items: ['if', 'else', 'elif', 'import'], oddIndex: 3, explanation: 'import подключает библиотеки. Остальные три — операторы условного ветвления.' },
      { items: ['for', 'while', 'loop', 'range'], oddIndex: 2, explanation: 'loop — не ключевое слово Python. Остальные три реально используются в циклах Python.' },
      { items: ['int', 'float', 'bool', 'print'], oddIndex: 3, explanation: 'print — функция вывода. Остальные три — типы данных в Python.' },
      { items: ['append', 'remove', 'pop', 'split'], oddIndex: 3, explanation: 'split — метод строки. Остальные три — методы списка (list).' },
      { items: ['def', 'return', 'class', 'SELECT'], oddIndex: 3, explanation: 'SELECT — оператор SQL, не Python. Остальные три — ключевые слова Python.' },
    ],
  },

  // === НАПЕЧАТАЙ КОД ===
  {
    id: 303,
    title: 'Напечатай: Python',
    description: 'Повтори строку кода точно — тренируй навык письма на Python',
    topic: 'Программирование на Python',
    grade: '8 класс',
    difficulty: 'easy',
    type: 'typetext',
    emoji: '⌨️',
    xp: 60,
    duration: '5 мин',
    typeTextRounds: [
      { prompt: 'Как вывести "Привет" на экран?', answer: 'print("Привет")', hint: 'Функция вывода + текст в кавычках' },
      { prompt: 'Как объявить переменную x со значением 10?', answer: 'x = 10', hint: 'Имя переменной, знак равно, значение' },
      { prompt: 'Как начать цикл от 0 до 4 (5 раз)?', answer: 'for i in range(5):', hint: 'for, имя переменной, in range(количество):' },
      { prompt: 'Как объявить функцию с именем greet?', answer: 'def greet():', hint: 'def, пробел, имя функции, скобки, двоеточие' },
      { prompt: 'Как проверить: если x больше 0?', answer: 'if x > 0:', hint: 'if, условие, двоеточие в конце' },
    ],
  },
  {
    id: 304,
    title: 'Напечатай: SQL',
    description: 'Вводи SQL-запросы руками — самый быстрый способ запомнить синтаксис',
    topic: 'Базы данных',
    grade: '9 класс',
    difficulty: 'medium',
    type: 'typetext',
    emoji: '🗄️',
    xp: 80,
    duration: '6 мин',
    typeTextRounds: [
      { prompt: 'Выбери все записи из таблицы users', answer: 'SELECT * FROM users;', hint: 'SELECT *, FROM, имя таблицы, точка с запятой' },
      { prompt: 'Выбери только поле name из таблицы students', answer: 'SELECT name FROM students;', hint: 'SELECT поле FROM таблица;' },
      { prompt: 'Удали запись где id равен 5', answer: 'DELETE FROM users WHERE id = 5;', hint: 'DELETE FROM таблица WHERE условие;' },
      { prompt: 'Создай таблицу с полем id (тип INTEGER)', answer: 'CREATE TABLE test (id INTEGER);', hint: 'CREATE TABLE имя (поле тип);' },
      { prompt: 'Добавь запись "Аня" в поле name таблицы students', answer: 'INSERT INTO students (name) VALUES ("Аня");', hint: 'INSERT INTO таблица (поле) VALUES (значение);' },
    ],
  },

  // === ВЕРНО / НЕВЕРНО ===
  {
    id: 305,
    title: 'Верно или нет: Сети',
    description: 'Читай утверждение и быстро решай: правда это или ложь?',
    topic: 'Компьютерные сети',
    grade: '8 класс',
    difficulty: 'easy',
    type: 'truefalse',
    emoji: '✅',
    xp: 55,
    duration: '4 мин',
    trueFalseCards: [
      { statement: 'IP-адрес — это уникальный адрес устройства в сети', isTrue: true, explanation: 'Верно! IP-адрес идентифицирует каждое устройство в сети, как домашний адрес.' },
      { statement: 'HTTP и HTTPS — это одно и то же', isTrue: false, explanation: 'Неверно! HTTPS добавляет шифрование SSL/TLS, что делает передачу безопасной.' },
      { statement: 'DNS переводит доменные имена в IP-адреса', isTrue: true, explanation: 'Верно! DNS (Domain Name System) — как телефонная книга интернета.' },
      { statement: 'Wi-Fi — это проводная технология передачи данных', isTrue: false, explanation: 'Неверно! Wi-Fi — беспроводная технология. Проводная — это Ethernet.' },
      { statement: 'Порт 80 используется для HTTP', isTrue: true, explanation: 'Верно! HTTP = порт 80, HTTPS = порт 443 — стандартные назначения.' },
      { statement: 'Браузер — это операционная система', isTrue: false, explanation: 'Неверно! Браузер — прикладная программа для просмотра сайтов. ОС — Windows, Linux.' },
    ],
  },
  {
    id: 306,
    title: 'Верно или нет: Python',
    description: 'Проверь каждое утверждение о языке Python — правда или миф?',
    topic: 'Программирование на Python',
    grade: '9 класс',
    difficulty: 'medium',
    type: 'truefalse',
    emoji: '🐍',
    xp: 75,
    duration: '5 мин',
    trueFalseCards: [
      { statement: 'В Python индексация списков начинается с 0', isTrue: true, explanation: 'Верно! list[0] — первый элемент, list[1] — второй.' },
      { statement: 'Python чувствителен к регистру: Variable и variable — одно и то же', isTrue: false, explanation: 'Неверно! Python чувствителен к регистру: Variable и variable — разные переменные.' },
      { statement: 'Функция len() возвращает длину строки или списка', isTrue: true, explanation: 'Верно! len("hello") = 5, len([1,2,3]) = 3.' },
      { statement: 'Для создания функции в Python используется ключевое слово function', isTrue: false, explanation: 'Неверно! В Python используется def, а не function.' },
      { statement: 'Список (list) в Python может содержать элементы разных типов', isTrue: true, explanation: 'Верно! [1, "текст", True, 3.14] — абсолютно допустимый список Python.' },
      { statement: 'Оператор == присваивает значение переменной', isTrue: false, explanation: 'Неверно! == сравнивает значения. Присваивание — это одинарный знак = .' },
    ],
  },

  // === ЧИСЛОВОЙ ВВОД ===
  {
    id: 307,
    title: 'Числа информатики',
    description: 'Введи правильное число — проверь знание ключевых констант информатики',
    topic: 'Представление информации',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'numpad',
    emoji: '🔢',
    xp: 50,
    duration: '4 мин',
    numpadRounds: [
      { question: 'Сколько бит в одном байте?', answer: 8, unit: 'бит', hint: 'Это основная единица — запомни раз и навсегда!' },
      { question: 'Сколько байт в одном килобайте?', answer: 1024, unit: 'байт', hint: '2 в степени 10 = ...' },
      { question: 'Сколько символов в стандартной таблице ASCII?', answer: 128, unit: 'символов', hint: '2 в степени 7 = ...' },
      { question: 'Сколько цифр используется в двоичной системе счисления?', answer: 2, unit: 'цифры', hint: 'Двоичная — потому что...' },
      { question: 'Сколько цифр и букв в шестнадцатеричной системе (0-9 и A-F)?', answer: 16, unit: 'символов', hint: 'Hex = hexa (шесть) + decimal (десять)' },
    ],
  },
  {
    id: 308,
    title: 'Числа и коды',
    description: 'Переводи числа между системами счисления — вводи ответ цифрами',
    topic: 'Системы счисления',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'numpad',
    emoji: '💡',
    xp: 80,
    duration: '6 мин',
    numpadRounds: [
      { question: 'Двоичное 1010 в десятичной системе =', answer: 10, unit: '', hint: '1×8 + 0×4 + 1×2 + 0×1 = ?' },
      { question: 'Двоичное 1111 в десятичной системе =', answer: 15, unit: '', hint: '8 + 4 + 2 + 1 = ?' },
      { question: 'Десятичное 16 в двоичной системе — сколько знаков в записи?', answer: 5, unit: 'знаков', hint: '16 = 10000₂ — считай цифры' },
      { question: 'Шестнадцатеричное FF в десятичной системе =', answer: 255, unit: '', hint: '15×16 + 15×1 = ?' },
      { question: 'Чему равен факториал 5 (5!)?', answer: 120, unit: '', hint: '5 × 4 × 3 × 2 × 1 = ?' },
    ],
  },

  // === КВЕСТ-ИГРЫ ===
  {
    id: 201,
    title: 'Миссия: Спаси данные!',
    description: 'Робот Байт попал в беду — помоги ему восстановить файлы, отвечая на вопросы об устройстве компьютера',
    topic: 'Аппаратное обеспечение',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'quest',
    emoji: '🤖',
    xp: 70,
    duration: '7 мин',
    quest: {
      startId: 's1',
      scenes: [
        {
          id: 's1',
          character: 'Байт',
          avatar: '🤖',
          text: 'Привет! Я робот Байт. Произошла катастрофа — вирус атаковал компьютер и стёр важные файлы! Мне нужна твоя помощь. Ты готов помочь мне разобраться с устройством компьютера, чтобы мы всё восстановили?',
          type: 'choice',
          choices: [
            { label: 'Конечно, я готов!', correct: true, nextId: 's2', response: 'Отлично! Я знал, что могу на тебя рассчитывать!' },
            { label: 'Звучит сложно...', correct: true, nextId: 's2', response: 'Не бойся, мы справимся вместе! Главное — не паниковать.' },
          ],
        },
        {
          id: 's2',
          character: 'Байт',
          avatar: '🤖',
          text: 'Отлично! Первым делом нужно проверить "мозг" компьютера. Скажи мне — как называется главное устройство обработки данных?',
          type: 'choice',
          choices: [
            { label: 'Процессор (CPU)', correct: true, nextId: 's3', response: '✅ Верно! Процессор — это "мозг" компьютера. Он живой, можем идти дальше!' },
            { label: 'Оперативная память', correct: false, nextId: 's2b', response: '❌ Нет, RAM — это временная память. Попробуй ещё раз!' },
            { label: 'Жёсткий диск', correct: false, nextId: 's2b', response: '❌ Жёсткий диск хранит данные, но не обрабатывает их. Подумай ещё!' },
          ],
        },
        {
          id: 's2b',
          character: 'Байт',
          avatar: '🤖',
          text: 'Не совсем верно. Подсказка: это устройство выполняет все вычисления и управляет другими компонентами. Аббревиатура — CPU.',
          type: 'choice',
          choices: [
            { label: 'Процессор (CPU)', correct: true, nextId: 's3', response: '✅ Теперь правильно! Процессор жив, продолжаем!' },
          ],
        },
        {
          id: 's3',
          character: 'Байт',
          avatar: '🤖',
          text: 'Уф, один компонент спасён! Теперь проверим хранилище. Файлы хранятся постоянно, даже когда компьютер выключен. Какое устройство за это отвечает?',
          type: 'choice',
          choices: [
            { label: 'Жёсткий диск (HDD/SSD)', correct: true, nextId: 's4', response: '✅ Именно! HDD и SSD — постоянное хранилище данных. Файлы найдены!' },
            { label: 'Оперативная память (RAM)', correct: false, nextId: 's3b', response: '❌ RAM очищается при выключении. Файлы там не хранятся!' },
            { label: 'Видеокарта', correct: false, nextId: 's3b', response: '❌ Видеокарта выводит картинку на экран, это другое.' },
          ],
        },
        {
          id: 's3b',
          character: 'Байт',
          avatar: '🤖',
          text: 'Подсказка: это устройство работает даже когда компьютер выключен. Данные не исчезают. Бывает двух видов: HDD и SSD.',
          type: 'choice',
          choices: [
            { label: 'Жёсткий диск (HDD/SSD)', correct: true, nextId: 's4', response: '✅ Правильно! Файлы в безопасности!' },
          ],
        },
        {
          id: 's4',
          character: 'Байт',
          avatar: '🤖',
          text: 'Прекрасно! Осталось проверить устройства ввода. Через что пользователь вводит текст в компьютер?',
          type: 'choice',
          choices: [
            { label: 'Клавиатура', correct: true, nextId: 's5', response: '✅ Верно! Клавиатура — главное устройство ввода текста.' },
            { label: 'Монитор', correct: false, nextId: 's4b', response: '❌ Монитор — устройство вывода, он отображает, но не принимает ввод.' },
            { label: 'Принтер', correct: false, nextId: 's4b', response: '❌ Принтер — устройство вывода (печати), не ввода.' },
          ],
        },
        {
          id: 's4b',
          character: 'Байт',
          avatar: '🤖',
          text: 'Подсказка: это устройство, на котором есть буквы, цифры и специальные клавиши. Ты используешь его прямо сейчас!',
          type: 'choice',
          choices: [
            { label: 'Клавиатура', correct: true, nextId: 's5', response: '✅ Конечно! Клавиатура — вот она!' },
          ],
        },
        {
          id: 's5',
          character: 'Байт',
          avatar: '🤖',
          text: 'Ты справился! Все компоненты компьютера проверены и работают. Файлы восстановлены! Ты настоящий герой информатики! 🎉',
          type: 'result',
          isEnd: true,
          xpBonus: 70,
        },
      ],
    },
  },
  {
    id: 202,
    title: 'Детектив Нет: Тайна сети',
    description: 'Детектив Нет расследует преступление в интернете. Помоги ему разобраться в сетевых протоколах!',
    topic: 'Компьютерные сети',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'quest',
    emoji: '🕵️',
    xp: 90,
    duration: '8 мин',
    quest: {
      startId: 'n1',
      scenes: [
        {
          id: 'n1',
          character: 'Детектив Нет',
          avatar: '🕵️',
          text: 'Добро пожаловать в моё агентство! Я — детектив Нет, специализируюсь на киберпреступлениях. Поступило дело: хакер проник в школьную сеть и украл данные. Ты поможешь мне его поймать?',
          type: 'choice',
          choices: [
            { label: '🔍 Принять дело!', correct: true, nextId: 'n2', response: 'Отличный выбор! Приступаем к расследованию.' },
            { label: '😎 Я уже на месте!', correct: true, nextId: 'n2', response: 'Вот это настрой! Начинаем!' },
          ],
        },
        {
          id: 'n2',
          character: 'Детектив Нет',
          avatar: '🕵️',
          text: 'Улика №1 🔎 Хакер подключился через веб-браузер. Какой протокол используется для безопасной передачи веб-страниц (с шифрованием)?',
          type: 'choice',
          choices: [
            { label: 'HTTPS', correct: true, nextId: 'n3', response: '✅ Точно! HTTPS — это HTTP + шифрование SSL. Хакер использовал незащищённый HTTP, это наш след!' },
            { label: 'HTTP', correct: false, nextId: 'n2b', response: '❌ HTTP — незащищённый протокол, без шифрования. А нам нужен защищённый.' },
            { label: 'FTP', correct: false, nextId: 'n2b', response: '❌ FTP — протокол передачи файлов, не веб-страниц.' },
          ],
        },
        {
          id: 'n2b',
          character: 'Детектив Нет',
          avatar: '🕵️',
          text: 'Улика повторная 🔎 Подсказка: если в адресе сайта написано "https://", значит соединение защищено. Буква S означает Secure (безопасный).',
          type: 'choice',
          choices: [
            { label: 'HTTPS', correct: true, nextId: 'n3', response: '✅ Верно! Запомни: замочек в браузере = HTTPS = безопасно.' },
          ],
        },
        {
          id: 'n3',
          character: 'Детектив Нет',
          avatar: '🕵️',
          text: 'Улика №2 🔎 По логам мы видим IP-адрес хакера: 192.168.1.105. Что такое IP-адрес?',
          type: 'choice',
          choices: [
            { label: 'Уникальный числовой адрес устройства в сети', correct: true, nextId: 'n4', response: '✅ Правильно! Как домашний адрес, только для компьютера в сети. Мы знаем где он!' },
            { label: 'Имя пользователя в сети', correct: false, nextId: 'n3b', response: '❌ Нет, это не имя пользователя. Имя — это логин, а IP — числовой адрес.' },
            { label: 'Скорость интернета', correct: false, nextId: 'n3b', response: '❌ Скорость измеряется в Мбит/с, а IP — это адрес устройства.' },
          ],
        },
        {
          id: 'n3b',
          character: 'Детектив Нет',
          avatar: '🕵️',
          text: 'Подсказка 🔎 Думай как почтальон: у каждого дома есть адрес (улица, дом). У каждого устройства в сети тоже есть свой "адрес" — набор цифр через точки.',
          type: 'choice',
          choices: [
            { label: 'Уникальный числовой адрес устройства в сети', correct: true, nextId: 'n4', response: '✅ Именно! 192.168.1.105 — это адрес компьютера хакера!' },
          ],
        },
        {
          id: 'n4',
          character: 'Детектив Нет',
          avatar: '🕵️',
          text: 'Улика №3 🔎 Хакер использовал DNS для нахождения сервера. Что делает DNS-сервер?',
          type: 'choice',
          choices: [
            { label: 'Переводит доменные имена в IP-адреса', correct: true, nextId: 'n5', response: '✅ Верно! DNS — это "телефонная книга" интернета. Ты набираешь "google.com", DNS переводит в IP.' },
            { label: 'Шифрует данные в сети', correct: false, nextId: 'n4b', response: '❌ Шифрованием занимается SSL/TLS, а DNS — это другое.' },
            { label: 'Хранит все файлы интернета', correct: false, nextId: 'n4b', response: '❌ Файлы хранятся на веб-серверах, а DNS только переводит имена в адреса.' },
          ],
        },
        {
          id: 'n4b',
          character: 'Детектив Нет',
          avatar: '🕵️',
          text: 'Подсказка 🔎 DNS = Domain Name System. Когда ты пишешь "vk.com" в браузере, DNS находит IP-адрес этого сайта. Как справочник имён и номеров телефонов.',
          type: 'choice',
          choices: [
            { label: 'Переводит доменные имена в IP-адреса', correct: true, nextId: 'n5', response: '✅ Отлично! Теперь ты знаешь как работает DNS.' },
          ],
        },
        {
          id: 'n5',
          character: 'Детектив Нет',
          avatar: '🕵️',
          text: '🎉 Дело раскрыто! Благодаря твоим знаниям о сетевых протоколах мы отследили хакера по IP-адресу, разобрались с DNS и HTTPS. Ты прирождённый сетевой детектив! Школьные данные в безопасности!',
          type: 'result',
          isEnd: true,
          xpBonus: 90,
        },
      ],
    },
  },
  // === ИНТЕРАКТИВНЫЕ ИГРЫ ===
  {
    id: 101,
    title: 'Соедини: устройства компьютера',
    description: 'Соедини каждое устройство с его назначением перетаскиванием',
    topic: 'Устройства компьютера',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'match',
    emoji: '🖥️',
    xp: 60,
    duration: '5 мин',
    matchPairs: [
      { left: '🖥️ Монитор', right: 'Отображает изображение' },
      { left: '⌨️ Клавиатура', right: 'Ввод текста' },
      { left: '🖱️ Мышь', right: 'Управление курсором' },
      { left: '🖨️ Принтер', right: 'Печатает документы' },
      { left: '💾 Жёсткий диск', right: 'Хранит данные' },
    ],
  },
  {
    id: 102,
    title: 'Расставь шаги алгоритма',
    description: 'Перетащи шаги в правильном порядке, чтобы составить алгоритм',
    topic: 'Алгоритмы',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'sort',
    emoji: '📋',
    xp: 55,
    duration: '5 мин',
    sortItems: [
      { value: '1. Включить компьютер', order: 1 },
      { value: '2. Дождаться загрузки ОС', order: 2 },
      { value: '3. Открыть нужную программу', order: 3 },
      { value: '4. Выполнить задачу', order: 4 },
      { value: '5. Сохранить результат', order: 5 },
      { value: '6. Выключить компьютер', order: 6 },
    ],
  },
  // === ЛЕГКИЙ (10 игр) ===
  {
    id: 1,
    title: 'Что такое алгоритм?',
    description: 'Узнай основы алгоритмов через весёлые вопросы',
    topic: 'Алгоритмы',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'quiz',
    emoji: '🤖',
    xp: 50,
    duration: '5 мин',
    questions: [
      { question: 'Что такое алгоритм?', options: ['Программа на компьютере', 'Последовательность шагов для решения задачи', 'Язык программирования', 'Устройство компьютера'], correct: 1, explanation: 'Алгоритм — это точная последовательность шагов для решения задачи.' },
      { question: 'Какое свойство алгоритма означает, что он должен завершаться?', options: ['Результативность', 'Конечность', 'Определённость', 'Массовость'], correct: 1, explanation: 'Конечность означает, что алгоритм должен завершаться за конечное число шагов.' },
      { question: 'Что такое исполнитель алгоритма?', options: ['Автор алгоритма', 'Тот, кто выполняет алгоритм', 'Результат работы', 'Язык записи'], correct: 1, explanation: 'Исполнитель — это тот, кто выполняет команды алгоритма.' },
      { question: 'Как называется алгоритм, где команды выполняются одна за другой?', options: ['Циклический', 'Разветвляющийся', 'Линейный', 'Рекурсивный'], correct: 2, explanation: 'Линейный алгоритм — команды выполняются строго по порядку.' },
      { question: 'Что обозначает ромб в блок-схеме?', options: ['Начало/конец', 'Действие', 'Условие', 'Вывод данных'], correct: 2, explanation: 'Ромб в блок-схеме обозначает условие (проверку).' },
    ],
  },
  {
    id: 2,
    title: 'Двоичный счёт',
    description: 'Переводи числа из двоичной системы в десятичную',
    topic: 'Системы счисления',
    grade: '8 класс',
    difficulty: 'easy',
    type: 'quiz',
    emoji: '🔢',
    xp: 60,
    duration: '6 мин',
    questions: [
      { question: 'Чему равно двоичное число 101 в десятичной системе?', options: ['3', '5', '7', '9'], correct: 1, explanation: '101₂ = 1×4 + 0×2 + 1×1 = 5₁₀' },
      { question: 'Чему равно двоичное число 1010 в десятичной системе?', options: ['8', '10', '12', '14'], correct: 1, explanation: '1010₂ = 1×8 + 0×4 + 1×2 + 0×1 = 10₁₀' },
      { question: 'Сколько цифр используется в двоичной системе счисления?', options: ['1', '2', '8', '10'], correct: 1, explanation: 'В двоичной системе используются только цифры 0 и 1.' },
      { question: 'Чему равно число 7 в двоичной системе?', options: ['110', '111', '101', '100'], correct: 1, explanation: '7 = 4+2+1 = 111₂' },
      { question: 'Как называется минимальная единица информации?', options: ['Байт', 'Бит', 'Килобайт', 'Символ'], correct: 1, explanation: 'Бит (bit) — минимальная единица информации, принимает значения 0 или 1.' },
    ],
  },
  {
    id: 3,
    title: 'Устройства компьютера',
    description: 'Соедини каждое устройство с его типом: ввод или вывод',
    topic: 'Аппаратное обеспечение',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'match',
    emoji: '💻',
    xp: 40,
    duration: '4 мин',
    matchPairs: [
      { left: '⌨️ Клавиатура', right: 'Устройство ввода' },
      { left: '🖱️ Мышь', right: 'Устройство ввода' },
      { left: '🖥️ Монитор', right: 'Устройство вывода' },
      { left: '🖨️ Принтер', right: 'Устройство вывода' },
      { left: '🧠 Процессор', right: 'Устройство обработки' },
    ],
  },
  {
    id: 4,
    title: 'Типы данных',
    description: 'Соедини тип данных с его примером значения',
    topic: 'Основы программирования',
    grade: '8 класс',
    difficulty: 'easy',
    type: 'match',
    emoji: '📦',
    xp: 55,
    duration: '5 мин',
    matchPairs: [
      { left: 'int', right: '42' },
      { left: 'float', right: '3.14' },
      { left: 'string', right: '"Привет"' },
      { left: 'bool', right: 'True / False' },
      { left: 'list', right: '[1, 2, 3]' },
    ],
  },
  {
    id: 5,
    title: 'Интернет и сети',
    description: 'Соедини термин с его правильным определением',
    topic: 'Компьютерные сети',
    grade: '9 класс',
    difficulty: 'easy',
    type: 'match',
    emoji: '🌐',
    xp: 50,
    duration: '5 мин',
    matchPairs: [
      { left: 'IP-адрес', right: 'Уникальный адрес устройства в сети' },
      { left: 'URL', right: 'Адрес страницы в интернете' },
      { left: 'HTTP', right: 'Протокол передачи веб-страниц' },
      { left: 'Wi-Fi', right: 'Беспроводная сеть' },
      { left: 'Браузер', right: 'Программа для просмотра сайтов' },
    ],
  },
  {
    id: 6,
    title: 'Операционные системы',
    description: 'Расставь события по порядку — от нажатия кнопки до появления рабочего стола',
    topic: 'Программное обеспечение',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'sort',
    emoji: '🖥️',
    xp: 45,
    duration: '4 мин',
    sortItems: [
      { value: 'Нажата кнопка питания', order: 1 },
      { value: 'BIOS проверяет оборудование', order: 2 },
      { value: 'Загрузчик находит ОС', order: 3 },
      { value: 'Загружается ядро Windows', order: 4 },
      { value: 'Запускаются системные службы', order: 5 },
      { value: 'Появляется рабочий стол', order: 6 },
    ],
  },
  {
    id: 7,
    title: 'Графика и пиксели',
    description: 'Как работает компьютерная графика?',
    topic: 'Компьютерная графика',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'quiz',
    emoji: '🎨',
    xp: 45,
    duration: '5 мин',
    questions: [
      { question: 'Что такое пиксель?', options: ['Единица цвета', 'Минимальная точка изображения', 'Тип файла', 'Размер монитора'], correct: 1, explanation: 'Пиксель — наименьший элемент растрового изображения.' },
      { question: 'Что означает разрешение экрана 1920×1080?', options: ['Диагональ экрана', 'Количество пикселей по ширине и высоте', 'Яркость', 'Частота обновления'], correct: 1, explanation: '1920×1080 — количество пикселей: 1920 по горизонтали, 1080 по вертикали.' },
      { question: 'Как расшифровывается RGB?', options: ['Real Graphic Brightness', 'Red Green Blue', 'Resolution Graphic Base', 'Raster Grid Border'], correct: 1, explanation: 'RGB — Red, Green, Blue (красный, зелёный, синий) — модель цвета.' },
      { question: 'Какой формат файла используется для фотографий?', options: ['TXT', 'DOCX', 'JPEG', 'MP3'], correct: 2, explanation: 'JPEG — популярный формат для хранения фотографий с сжатием.' },
      { question: 'Что такое растровое изображение?', options: ['Изображение из кривых', 'Изображение из пикселей', 'Чёрно-белое изображение', 'Анимация'], correct: 1, explanation: 'Растровое изображение состоит из множества пикселей.' },
    ],
  },
  {
    id: 8,
    title: 'Единицы информации',
    description: 'Соедини единицу информации с её размером',
    topic: 'Представление информации',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'match',
    emoji: '📏',
    xp: 50,
    duration: '5 мин',
    matchPairs: [
      { left: '1 байт', right: '8 бит' },
      { left: '1 Килобайт', right: '1024 байт' },
      { left: '1 Мегабайт', right: '1024 Килобайт' },
      { left: '1 Гигабайт', right: '1024 Мегабайт' },
      { left: '1 Терабайт', right: '1024 Гигабайт' },
    ],
  },
  {
    id: 9,
    title: 'Безопасность в сети',
    description: 'Правила безопасного поведения в интернете',
    topic: 'Информационная безопасность',
    grade: '8 класс',
    difficulty: 'easy',
    type: 'quiz',
    emoji: '🔒',
    xp: 60,
    duration: '5 мин',
    questions: [
      { question: 'Что такое пароль?', options: ['Имя пользователя', 'Секретный код для входа', 'Адрес электронной почты', 'Номер телефона'], correct: 1, explanation: 'Пароль — секретный набор символов для подтверждения личности.' },
      { question: 'Какой пароль считается надёжным?', options: ['123456', 'qwerty', 'P@ssw0rd!2024', 'password'], correct: 2, explanation: 'Надёжный пароль содержит буквы, цифры, символы и длиннее 8 символов.' },
      { question: 'Что такое фишинг?', options: ['Вид рыбалки', 'Мошенничество для кражи данных', 'Тип вируса', 'Безопасный протокол'], correct: 1, explanation: 'Фишинг — мошенничество для кражи логинов, паролей и данных.' },
      { question: 'Что делает антивирус?', options: ['Ускоряет компьютер', 'Защищает от вредоносных программ', 'Чистит диск', 'Настраивает сеть'], correct: 1, explanation: 'Антивирус обнаруживает и удаляет вредоносные программы.' },
      { question: 'Что такое двухфакторная аутентификация?', options: ['Два пароля', 'Вход с двумя устройствами', 'Подтверждение входа двумя способами', 'Двойное шифрование'], correct: 2, explanation: '2FA требует два подтверждения личности — пароль + SMS или приложение.' },
    ],
  },
  {
    id: 10,
    title: 'История компьютеров',
    description: 'Путешествие сквозь историю вычислительной техники',
    topic: 'История информатики',
    grade: '7 класс',
    difficulty: 'easy',
    type: 'quiz',
    emoji: '📜',
    xp: 40,
    duration: '4 мин',
    questions: [
      { question: 'Кто считается первым программистом в мире?', options: ['Билл Гейтс', 'Ада Лавлейс', 'Алан Тьюринг', 'Стив Джобс'], correct: 1, explanation: 'Ада Лавлейс (1815–1852) написала первую программу для машины Бэббиджа.' },
      { question: 'В каком году был создан первый персональный компьютер IBM PC?', options: ['1971', '1976', '1981', '1985'], correct: 2, explanation: 'IBM PC появился в 1981 году и стал стандартом для ПК.' },
      { question: 'Что такое ENIAC?', options: ['Первый смартфон', 'Первый электронный компьютер', 'Первый процессор', 'Первый принтер'], correct: 1, explanation: 'ENIAC (1945) — один из первых электронных компьютеров в мире.' },
      { question: 'Кто основал компанию Apple?', options: ['Билл Гейтс', 'Стив Джобс', 'Марк Цукерберг', 'Джефф Безос'], correct: 1, explanation: 'Apple основали Стив Джобс, Стив Возняк и Рональд Уэйн в 1976 году.' },
      { question: 'В каком году появился Интернет (ARPANET)?', options: ['1959', '1969', '1979', '1989'], correct: 1, explanation: 'ARPANET — предшественник интернета — запущен в 1969 году.' },
    ],
  },

  // === СРЕДНИЙ (10 игр) ===
  {
    id: 11,
    title: 'Ветвление в алгоритмах',
    description: 'Расставь строки кода в правильном порядке, чтобы программа заработала',
    topic: 'Алгоритмы',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'sort',
    emoji: '🔀',
    xp: 80,
    duration: '8 мин',
    sortItems: [
      { value: 'x = int(input("Введи число: "))', order: 1 },
      { value: 'if x > 0:', order: 2 },
      { value: '    print("Число положительное")', order: 3 },
      { value: 'elif x < 0:', order: 4 },
      { value: '    print("Число отрицательное")', order: 5 },
      { value: 'else:', order: 6 },
      { value: '    print("Число равно нулю")', order: 7 },
    ],
  },
  {
    id: 12,
    title: 'Циклы в программировании',
    description: 'For и while — освой циклы в Python',
    topic: 'Основы программирования',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'quiz',
    emoji: '🔄',
    xp: 90,
    duration: '9 мин',
    questions: [
      { question: 'Что делает цикл for i in range(5)?', options: ['Выполняет 4 итерации', 'Выполняет 5 итераций', 'Бесконечный цикл', 'Ошибка'], correct: 1, explanation: 'range(5) генерирует числа 0,1,2,3,4 — 5 итераций.' },
      { question: 'Когда лучше использовать while?', options: ['Когда число итераций известно', 'Когда число итераций неизвестно', 'Только для чисел', 'Только для строк'], correct: 1, explanation: 'while используют, когда не знаем заранее, сколько раз повторять.' },
      { question: 'Что делает break в цикле?', options: ['Пропускает итерацию', 'Прерывает цикл', 'Повторяет итерацию', 'Начинает новый цикл'], correct: 1, explanation: 'break немедленно прерывает выполнение цикла.' },
      { question: 'Что делает continue в цикле?', options: ['Прерывает цикл', 'Пропускает текущую итерацию', 'Повторяет цикл', 'Ничего'], correct: 1, explanation: 'continue пропускает оставшийся код итерации и переходит к следующей.' },
      { question: 'Каков результат: s=0; for i in range(3): s+=i; print(s)?', options: ['0', '3', '6', '9'], correct: 1, explanation: 's = 0+1+2 = 3.' },
    ],
  },
  {
    id: 13,
    title: 'Шестнадцатеричная система',
    description: 'Перевод чисел в HEX и обратно',
    topic: 'Системы счисления',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'quiz',
    emoji: '🔡',
    xp: 85,
    duration: '8 мин',
    questions: [
      { question: 'Сколько цифр в шестнадцатеричной системе?', options: ['10', '16', '8', '12'], correct: 1, explanation: 'HEX использует цифры 0-9 и буквы A-F = 16 символов.' },
      { question: 'Чему равно F в шестнадцатеричной системе?', options: ['5', '12', '15', '16'], correct: 2, explanation: 'F = 15 в десятичной системе.' },
      { question: 'Чему равно шестнадцатеричное число FF в десятичной?', options: ['150', '200', '255', '256'], correct: 2, explanation: 'FF = 15×16 + 15×1 = 240 + 15 = 255.' },
      { question: 'Как записывается число 16 в шестнадцатеричной системе?', options: ['F', 'G', '10', '1F'], correct: 2, explanation: '16₁₀ = 10₁₆ (1×16 + 0).' },
      { question: 'В каком контексте часто используется HEX?', options: ['Математика', 'Цвета в веб-дизайне', 'Измерение температуры', 'Расчёт скорости'], correct: 1, explanation: 'Цвета в CSS записываются в HEX: #FF5733.' },
    ],
  },
  {
    id: 14,
    title: 'Функции в Python',
    description: 'Создавай и вызывай функции как профессионал',
    topic: 'Программирование на Python',
    grade: '9 класс',
    difficulty: 'medium',
    type: 'quiz',
    emoji: '⚙️',
    xp: 95,
    duration: '10 мин',
    questions: [
      { question: 'Как объявить функцию в Python?', options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'create myFunc():'], correct: 1, explanation: 'В Python функции объявляются с помощью ключевого слова def.' },
      { question: 'Что делает return в функции?', options: ['Выводит значение', 'Возвращает значение и завершает функцию', 'Принимает аргумент', 'Объявляет переменную'], correct: 1, explanation: 'return возвращает значение из функции вызывающему коду.' },
      { question: 'Что такое параметры функции?', options: ['Результаты функции', 'Переменные, передаваемые в функцию', 'Типы данных', 'Команды внутри функции'], correct: 1, explanation: 'Параметры — это входные данные, которые функция принимает при вызове.' },
      { question: 'Можно ли функцию вызывать несколько раз?', options: ['Нет, только один раз', 'Да, любое количество раз', 'Только дважды', 'Зависит от типа'], correct: 1, explanation: 'Функцию можно вызывать многократно — в этом их главная цель.' },
      { question: 'Что такое рекурсия?', options: ['Функция без параметров', 'Функция, вызывающая саму себя', 'Цикл внутри функции', 'Функция без return'], correct: 1, explanation: 'Рекурсия — когда функция вызывает саму себя для решения подзадачи.' },
    ],
  },
  {
    id: 15,
    title: 'Базы данных: основы',
    description: 'Соедини SQL-команду с её действием',
    topic: 'Базы данных',
    grade: '9 класс',
    difficulty: 'medium',
    type: 'match',
    emoji: '🗄️',
    xp: 80,
    duration: '8 мин',
    matchPairs: [
      { left: 'SELECT', right: 'Выбрать данные из таблицы' },
      { left: 'INSERT', right: 'Добавить новую запись' },
      { left: 'UPDATE', right: 'Изменить существующие данные' },
      { left: 'DELETE', right: 'Удалить запись' },
      { left: 'CREATE TABLE', right: 'Создать новую таблицу' },
    ],
  },
  {
    id: 16,
    title: 'Протоколы передачи данных',
    description: 'TCP/IP, HTTP — как данные путешествуют по сети',
    topic: 'Компьютерные сети',
    grade: '9 класс',
    difficulty: 'medium',
    type: 'quiz',
    emoji: '📡',
    xp: 85,
    duration: '9 мин',
    questions: [
      { question: 'Что такое протокол в компьютерных сетях?', options: ['Тип кабеля', 'Набор правил передачи данных', 'Устройство сети', 'Адрес компьютера'], correct: 1, explanation: 'Протокол — стандартный набор правил для обмена данными в сети.' },
      { question: 'Что обеспечивает протокол TCP?', options: ['Шифрование данных', 'Надёжную доставку данных', 'Беспроводную связь', 'Присвоение адресов'], correct: 1, explanation: 'TCP гарантирует доставку пакетов в правильном порядке.' },
      { question: 'Для чего используется DNS?', options: ['Для шифрования', 'Для перевода доменных имён в IP-адреса', 'Для сжатия данных', 'Для аутентификации'], correct: 1, explanation: 'DNS переводит имена (google.com) в IP-адреса (142.250.74.46).' },
      { question: 'Что такое порт в сетях?', options: ['Физический разъём', 'Логический адрес приложения', 'Тип протокола', 'Скорость сети'], correct: 1, explanation: 'Порт — числовой идентификатор для конкретного приложения (HTTP = 80).' },
      { question: 'Чем HTTPS отличается от HTTP?', options: ['Скоростью', 'Шифрованием данных', 'Поддержкой видео', 'Размером файлов'], correct: 1, explanation: 'HTTPS шифрует данные с помощью SSL/TLS — защищённая версия HTTP.' },
    ],
  },
  {
    id: 17,
    title: 'Логические операции',
    description: 'Соедини логический оператор с его описанием',
    topic: 'Логика',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'match',
    emoji: '🧮',
    xp: 80,
    duration: '8 мин',
    matchPairs: [
      { left: 'AND (И)', right: 'True, только если оба True' },
      { left: 'OR (ИЛИ)', right: 'True, если хотя бы один True' },
      { left: 'NOT (НЕ)', right: 'Инвертирует значение' },
      { left: 'XOR (исключающее ИЛИ)', right: 'True, если значения различаются' },
      { left: 'NAND', right: 'Отрицание AND' },
    ],
  },
  {
    id: 18,
    title: 'Сортировка данных',
    description: 'Алгоритмы сортировки: пузырёк, выбор, вставка',
    topic: 'Алгоритмы',
    grade: '9 класс',
    difficulty: 'medium',
    type: 'quiz',
    emoji: '📊',
    xp: 90,
    duration: '9 мин',
    questions: [
      { question: 'Что делает сортировка пузырьком?', options: ['Делит массив пополам', 'Многократно сравнивает соседние элементы', 'Ищет минимум', 'Вставляет элементы по одному'], correct: 1, explanation: 'Пузырьковая сортировка сравнивает пары соседних элементов и меняет их местами.' },
      { question: 'Какова сложность пузырьковой сортировки в худшем случае?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], correct: 2, explanation: 'Пузырьковая сортировка имеет сложность O(n²) — медленная для больших данных.' },
      { question: 'Что ищет алгоритм сортировки выбором на каждом шаге?', options: ['Максимальный элемент', 'Минимальный элемент', 'Средний элемент', 'Случайный элемент'], correct: 1, explanation: 'На каждом шаге находит минимум и ставит его на нужную позицию.' },
      { question: 'Что такое устойчивая сортировка?', options: ['Быстрая сортировка', 'Сохраняет порядок равных элементов', 'Работает без памяти', 'Рекурсивная сортировка'], correct: 1, explanation: 'Устойчивая сортировка не меняет порядок равных по ключу элементов.' },
      { question: 'Какой алгоритм сортировки самый быстрый в среднем?', options: ['Пузырьковая', 'Выбором', 'Быстрая (QuickSort)', 'Вставками'], correct: 2, explanation: 'QuickSort имеет среднюю сложность O(n log n) и на практике очень быстр.' },
    ],
  },
  {
    id: 19,
    title: 'Хранение текста: кодировки',
    description: 'ASCII, Unicode — как компьютер хранит текст',
    topic: 'Представление информации',
    grade: '8 класс',
    difficulty: 'medium',
    type: 'quiz',
    emoji: '📝',
    xp: 75,
    duration: '7 мин',
    questions: [
      { question: 'Что такое ASCII?', options: ['Язык программирования', 'Стандарт кодирования символов', 'Тип файла', 'Алгоритм шифрования'], correct: 1, explanation: 'ASCII — стандарт кодирования символов: каждому символу соответствует число.' },
      { question: 'Сколько символов определяет стандартная таблица ASCII?', options: ['64', '128', '256', '512'], correct: 1, explanation: 'Стандартный ASCII определяет 128 символов (7 бит).' },
      { question: 'Что такое Unicode?', options: ['Расширенная кодировка для всех языков мира', 'Тип файла', 'Протокол сети', 'Алгоритм'], correct: 0, explanation: 'Unicode поддерживает более 140 000 символов всех языков мира.' },
      { question: 'Чему соответствует символ "A" в ASCII?', options: ['65', '97', '41', '1'], correct: 0, explanation: 'Буква "A" (заглавная) в ASCII = 65.' },
      { question: 'Что такое UTF-8?', options: ['Язык разметки', 'Формат кодирования Unicode переменной длины', 'Тип базы данных', 'Сетевой протокол'], correct: 1, explanation: 'UTF-8 — наиболее распространённый формат кодирования Unicode.' },
    ],
  },
  {
    id: 20,
    title: 'Модели OSI и TCP/IP',
    description: 'Сетевые модели для профессионалов',
    topic: 'Компьютерные сети',
    grade: '9 класс',
    difficulty: 'medium',
    type: 'quiz',
    emoji: '🏗️',
    xp: 85,
    duration: '8 мин',
    questions: [
      { question: 'Сколько уровней в модели OSI?', options: ['4', '5', '7', '8'], correct: 2, explanation: 'Модель OSI состоит из 7 уровней: физический, канальный, сетевой и т.д.' },
      { question: 'На каком уровне OSI работает IP?', options: ['Физическом', 'Канальном', 'Сетевом', 'Транспортном'], correct: 2, explanation: 'IP работает на сетевом (3-м) уровне модели OSI.' },
      { question: 'На каком уровне OSI работает TCP?', options: ['Сетевом', 'Транспортном', 'Сеансовом', 'Прикладном'], correct: 1, explanation: 'TCP работает на транспортном (4-м) уровне.' },
      { question: 'Что такое пакет данных?', options: ['Весь файл целиком', 'Порция данных для передачи по сети', 'Тип устройства', 'Сетевой адрес'], correct: 1, explanation: 'Пакет — единица данных, передаваемая по сети.' },
      { question: 'Что делает маршрутизатор?', options: ['Выводит данные на экран', 'Направляет пакеты между сетями', 'Хранит файлы', 'Шифрует данные'], correct: 1, explanation: 'Маршрутизатор определяет путь пакетов между разными сетями.' },
    ],
  },

  // === СЛОЖНЫЙ (10 игр) ===
  {
    id: 21,
    title: 'Рекурсия и стек',
    description: 'Глубокое погружение в рекурсивные алгоритмы',
    topic: 'Алгоритмы',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '🌀',
    xp: 150,
    duration: '12 мин',
    questions: [
      { question: 'Что такое базовый случай в рекурсии?', options: ['Первый вызов функции', 'Условие остановки рекурсии', 'Максимальная глубина', 'Последний вызов'], correct: 1, explanation: 'Базовый случай — условие, при котором рекурсия останавливается.' },
      { question: 'Что происходит без базового случая?', options: ['Программа работает медленно', 'Переполнение стека (Stack Overflow)', 'Ошибка типов', 'Бесконечный цикл'], correct: 1, explanation: 'Без базового случая рекурсия бесконечна и переполняет стек.' },
      { question: 'Чему равен factorial(0) по математическому определению?', options: ['0', '1', '-1', 'Ошибка'], correct: 1, explanation: '0! = 1 — это математическое соглашение (базовый случай для факториала).' },
      { question: 'Что такое стек вызовов?', options: ['Список переменных', 'Структура хранения вызовов функций', 'Тип данных', 'Алгоритм поиска'], correct: 1, explanation: 'Стек вызовов хранит информацию о вызовах функций в порядке LIFO.' },
      { question: 'Числа Фибоначчи: fib(n) = fib(n-1) + fib(n-2), fib(0)=0, fib(1)=1. Чему равен fib(5)?', options: ['3', '5', '8', '13'], correct: 1, explanation: 'fib(5) = 0,1,1,2,3,5 — пятый элемент равен 5.' },
    ],
  },
  {
    id: 22,
    title: 'Объектно-ориентированное программирование',
    description: 'Соедини понятие ООП с его определением',
    topic: 'Программирование на Python',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'match',
    emoji: '🏛️',
    xp: 160,
    duration: '15 мин',
    matchPairs: [
      { left: 'Класс', right: 'Шаблон для создания объектов' },
      { left: 'Объект', right: 'Конкретный экземпляр класса' },
      { left: 'Наследование', right: 'Создание нового класса на основе существующего' },
      { left: 'Инкапсуляция', right: 'Скрытие данных внутри класса' },
      { left: 'Полиморфизм', right: 'Один интерфейс — разные реализации' },
    ],
  },
  {
    id: 23,
    title: 'Криптография: основы',
    description: 'Шифры, ключи и основы защиты информации',
    topic: 'Информационная безопасность',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '🔐',
    xp: 140,
    duration: '12 мин',
    questions: [
      { question: 'Что такое шифрование?', options: ['Сжатие данных', 'Преобразование данных для защиты от несанкционированного доступа', 'Резервное копирование', 'Форматирование'], correct: 1, explanation: 'Шифрование преобразует данные в нечитаемый вид без ключа.' },
      { question: 'Что такое симметричное шифрование?', options: ['Один ключ для шифрования и расшифровки', 'Разные ключи для шифрования и расшифровки', 'Без ключа', 'Два ключа для шифрования'], correct: 0, explanation: 'Симметричное шифрование использует один и тот же ключ для обоих операций.' },
      { question: 'Что такое хеш-функция?', options: ['Функция шифрования', 'Функция преобразования данных в строку фиксированной длины', 'Функция сжатия', 'Функция архивации'], correct: 1, explanation: 'Хеш-функция создаёт уникальный "отпечаток" данных фиксированной длины.' },
      { question: 'Что такое шифр Цезаря?', options: ['Современный алгоритм', 'Шифр замены с фиксированным сдвигом букв', 'Тип хеша', 'Асимметричный шифр'], correct: 1, explanation: 'Шифр Цезаря сдвигает буквы алфавита на фиксированное число позиций.' },
      { question: 'Что такое публичный ключ в асимметричном шифровании?', options: ['Секретный ключ', 'Ключ для шифрования, доступный всем', 'Пароль', 'Код доступа'], correct: 1, explanation: 'Публичный ключ открыт для всех — используется для шифрования данных.' },
    ],
  },
  {
    id: 24,
    title: 'Структуры данных',
    description: 'Массивы, стеки, очереди, списки',
    topic: 'Структуры данных',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '📚',
    xp: 155,
    duration: '14 мин',
    questions: [
      { question: 'Что такое стек?', options: ['Структура FIFO', 'Структура LIFO', 'Случайный доступ', 'Двусвязный список'], correct: 1, explanation: 'Стек — структура LIFO (Last In, First Out): последний вошёл, первый вышел.' },
      { question: 'Что такое очередь?', options: ['Структура LIFO', 'Структура FIFO', 'Двоичное дерево', 'Хеш-таблица'], correct: 1, explanation: 'Очередь — структура FIFO (First In, First Out): первый вошёл, первый вышел.' },
      { question: 'Что такое связный список?', options: ['Массив с индексами', 'Элементы, связанные указателями', 'Хеш-таблица', 'Двоичное дерево'], correct: 1, explanation: 'Связный список: каждый элемент хранит данные и ссылку на следующий.' },
      { question: 'В чём преимущество массива перед связным списком?', options: ['Быстрое добавление', 'Быстрый доступ по индексу', 'Динамический размер', 'Меньше памяти'], correct: 1, explanation: 'Массив обеспечивает O(1) доступ к элементу по индексу.' },
      { question: 'Что такое дерево в информатике?', options: ['Граф с циклами', 'Иерархическая структура с корнем и ветвями', 'Тип сортировки', 'Линейная структура'], correct: 1, explanation: 'Дерево — нелинейная иерархическая структура: корень, узлы, листья.' },
    ],
  },
  {
    id: 25,
    title: 'Алгоритмы поиска',
    description: 'Линейный и бинарный поиск: анализ сложности',
    topic: 'Алгоритмы',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '🔍',
    xp: 145,
    duration: '12 мин',
    questions: [
      { question: 'Какова сложность линейного поиска?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 2, explanation: 'Линейный поиск проверяет каждый элемент — O(n) в худшем случае.' },
      { question: 'Какова сложность бинарного поиска?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correct: 1, explanation: 'Бинарный поиск делит массив пополам каждый раз — O(log n).' },
      { question: 'Что обязательно нужно для бинарного поиска?', options: ['Несортированный массив', 'Отсортированный массив', 'Связный список', 'Стек'], correct: 1, explanation: 'Бинарный поиск работает только на отсортированных данных.' },
      { question: 'Как бинарный поиск сужает область поиска?', options: ['Случайно', 'Всегда берёт первый элемент', 'Сравнивает с серединой и отбрасывает половину', 'Проверяет все элементы'], correct: 2, explanation: 'Сравнивает искомое со средним: берёт левую или правую половину.' },
      { question: 'За сколько шагов бинарный поиск найдёт элемент в массиве из 1024 элементов (в худшем случае)?', options: ['512', '100', '10', '1024'], correct: 2, explanation: 'log₂(1024) = 10 — за 10 шагов в худшем случае.' },
    ],
  },
  {
    id: 26,
    title: 'Графы: основы',
    description: 'Теория графов и алгоритмы обхода',
    topic: 'Алгоритмы',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '🕸️',
    xp: 160,
    duration: '14 мин',
    questions: [
      { question: 'Что такое граф?', options: ['Диаграмма', 'Набор вершин и рёбер', 'Алгоритм сортировки', 'Тип базы данных'], correct: 1, explanation: 'Граф — математическая модель из вершин (узлов) и рёбер (связей).' },
      { question: 'Что такое ориентированный граф (орграф)?', options: ['Граф с весами', 'Граф с направленными рёбрами', 'Полный граф', 'Граф без рёбер'], correct: 1, explanation: 'В орграфе рёбра имеют направление (стрелки).' },
      { question: 'Что делает алгоритм BFS?', options: ['Сортирует вершины', 'Обходит граф в ширину', 'Находит максимум', 'Строит дерево'], correct: 1, explanation: 'BFS (обход в ширину) посещает все вершины на расстоянии n перед n+1.' },
      { question: 'Что делает алгоритм DFS?', options: ['Ищет кратчайший путь', 'Обходит граф в глубину', 'Сортирует рёбра', 'Находит цикл'], correct: 1, explanation: 'DFS (обход в глубину) идёт как можно глубже перед возвратом.' },
      { question: 'Что такое смежность вершин в графе?', options: ['Одинаковый вес', 'Соединение ребром', 'Одна вершина', 'Разные компоненты'], correct: 1, explanation: 'Две вершины смежны, если между ними есть ребро.' },
    ],
  },
  {
    id: 27,
    title: 'Двоичная логика процессора',
    description: 'Логические схемы: AND, OR, NOT, XOR, NAND',
    topic: 'Аппаратное обеспечение',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '⚡',
    xp: 150,
    duration: '13 мин',
    questions: [
      { question: 'Что делает логический элемент XOR?', options: ['И (оба должны быть 1)', 'ИЛИ (хотя бы один)', 'Исключающее ИЛИ (разные входы)', 'НЕ (инверсия)'], correct: 2, explanation: 'XOR даёт 1 только если входы разные: 0⊕1=1, 1⊕1=0.' },
      { question: 'Из чего состоит компьютерный процессор на самом базовом уровне?', options: ['Транзисторов', 'Резисторов', 'Конденсаторов', 'Диодов'], correct: 0, explanation: 'Процессор состоит из миллиардов транзисторов — переключателей.' },
      { question: 'Что такое полусумматор?', options: ['Алгоритм сложения', 'Схема сложения двух бит', 'Тип памяти', 'Шина данных'], correct: 1, explanation: 'Полусумматор — логическая схема для сложения двух однобитных чисел.' },
      { question: 'Каков результат 1 XOR 1?', options: ['1', '0', '2', 'Error'], correct: 1, explanation: '1 XOR 1 = 0 (одинаковые входы дают 0 в XOR).' },
      { question: 'Что такое регистр процессора?', options: ['Тип кабеля', 'Сверхбыстрая память внутри процессора', 'Тип шины', 'Алгоритм'], correct: 1, explanation: 'Регистр — сверхбыстрая ячейка памяти непосредственно в процессоре.' },
    ],
  },
  {
    id: 28,
    title: 'Машина Тьюринга',
    description: 'Теоретические основы вычислений',
    topic: 'Теория вычислений',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '🧠',
    xp: 170,
    duration: '15 мин',
    questions: [
      { question: 'Кто придумал машину Тьюринга?', options: ['Чарльз Бэббидж', 'Алан Тьюринг', 'Джон фон Нейман', 'Клод Шеннон'], correct: 1, explanation: 'Алан Тьюринг предложил теоретическую модель вычислений в 1936 году.' },
      { question: 'Что такое тезис Чёрча-Тьюринга?', options: ['Теорема доказательства', 'Всё вычислимое может быть вычислено машиной Тьюринга', 'Алгоритм шифрования', 'Метод сортировки'], correct: 1, explanation: 'Тезис утверждает: любая вычислимая функция реализуема на машине Тьюринга.' },
      { question: 'Что такое неразрешимая задача?', options: ['Очень сложная задача', 'Задача без алгоритма решения', 'Задача с большой сложностью', 'Задача без входных данных'], correct: 1, explanation: 'Неразрешимая задача — для неё не существует алгоритма, дающего ответ.' },
      { question: 'Что такое проблема остановки (Halting Problem)?', options: ['Остановка компьютера', 'Невозможность определить, остановится ли программа', 'Бесконечный цикл', 'Зависание ОС'], correct: 1, explanation: 'Тьюринг доказал: нельзя создать программу, определяющую остановку любой другой.' },
      { question: 'Что общего у всех современных компьютеров?', options: ['Одна операционная система', 'Они эквивалентны машине Тьюринга', 'Одинаковая скорость', 'Одинаковая архитектура'], correct: 1, explanation: 'Все современные компьютеры — практические реализации машины Тьюринга.' },
    ],
  },
  {
    id: 29,
    title: 'Сжатие данных',
    description: 'Алгоритмы Хаффмана и сжатие без потерь',
    topic: 'Алгоритмы',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '🗜️',
    xp: 145,
    duration: '12 мин',
    questions: [
      { question: 'Что такое сжатие данных без потерь?', options: ['Сжатие с удалением данных', 'Сжатие с возможностью полного восстановления', 'Шифрование данных', 'Архивирование без сжатия'], correct: 1, explanation: 'Сжатие без потерь позволяет восстановить исходные данные полностью.' },
      { question: 'На чём основан алгоритм Хаффмана?', options: ['Случайном распределении', 'Частоте появления символов', 'Алфавитном порядке', 'Длине строк'], correct: 1, explanation: 'Хаффман: частые символы кодируются короткими кодами, редкие — длинными.' },
      { question: 'Какой формат файлов использует сжатие без потерь для изображений?', options: ['JPEG', 'MP3', 'PNG', 'AVI'], correct: 2, explanation: 'PNG использует сжатие без потерь — изображение восстанавливается точно.' },
      { question: 'Что такое кодирование длин серий (RLE)?', options: ['Кодирование повторяющихся последовательностей', 'Алгоритм шифрования', 'Метод сортировки', 'Тип базы данных'], correct: 0, explanation: 'RLE: повторяющиеся символы заменяются на число+символ (AAAA → 4A).' },
      { question: 'В чём недостаток сжатия с потерями (JPEG)?', options: ['Большой размер файла', 'Невозможно восстановить исходное изображение', 'Медленная работа', 'Не поддерживается браузерами'], correct: 1, explanation: 'JPEG удаляет "незаметные" данные — оригинал восстановить нельзя.' },
    ],
  },
  {
    id: 30,
    title: 'Искусственный интеллект: основы',
    description: 'Машинное обучение и нейронные сети для начинающих',
    topic: 'Искусственный интеллект',
    grade: '9 класс',
    difficulty: 'hard',
    type: 'quiz',
    emoji: '🤖',
    xp: 200,
    duration: '15 мин',
    questions: [
      { question: 'Что такое машинное обучение?', options: ['Программирование компьютера вручную', 'Обучение модели на данных для предсказаний', 'Тип операционной системы', 'Алгоритм сортировки'], correct: 1, explanation: 'МО — системы, которые улучшаются на основе опыта (данных).' },
      { question: 'Что такое нейронная сеть?', options: ['Тип базы данных', 'Математическая модель, вдохновлённая мозгом', 'Алгоритм сортировки', 'Сетевой протокол'], correct: 1, explanation: 'Нейронная сеть — слои искусственных нейронов для обработки информации.' },
      { question: 'Что такое обучение с учителем (supervised learning)?', options: ['Обучение без данных', 'Обучение на размеченных данных', 'Обучение роботов', 'Обучение без ответов'], correct: 1, explanation: 'Supervised learning: модель учится на парах (вход, правильный ответ).' },
      { question: 'Что делает ChatGPT?', options: ['Ищет в интернете', 'Генерирует текст на основе языковой модели', 'Переводит код', 'Управляет роботами'], correct: 1, explanation: 'ChatGPT — большая языковая модель, генерирующая ответы на основе обучения.' },
      { question: 'Что такое переобучение (overfitting) в МО?', options: ['Слишком медленное обучение', 'Модель работает на обучающих данных, но плохо на новых', 'Нехватка данных', 'Слишком простая модель'], correct: 1, explanation: 'Overfitting: модель "заучила" обучающие данные, но не умеет обобщать.' },
    ],
  },
];

export const topics = [
  { id: 'all', label: 'Все темы', emoji: '🎯' },
  { id: 'Алгоритмы', label: 'Алгоритмы', emoji: '🤖' },
  { id: 'Системы счисления', label: 'Системы счисления', emoji: '🔢' },
  { id: 'Основы программирования', label: 'Программирование', emoji: '💻' },
  { id: 'Программирование на Python', label: 'Python', emoji: '🐍' },
  { id: 'Компьютерные сети', label: 'Сети', emoji: '🌐' },
  { id: 'Информационная безопасность', label: 'Безопасность', emoji: '🔒' },
  { id: 'Аппаратное обеспечение', label: 'Железо', emoji: '⚙️' },
  { id: 'Искусственный интеллект', label: 'ИИ', emoji: '🧠' },
];