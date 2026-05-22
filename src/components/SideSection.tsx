import { useState } from 'react';
import { games, type Difficulty } from '@/data/games';

const difficultyLabel: Record<Difficulty, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const difficultyClass: Record<Difficulty, string> = {
  easy: 'badge-level-easy',
  medium: 'badge-level-medium',
  hard: 'badge-level-hard',
};

const mockLeaderboard = [
  { name: 'Максим К.', grade: '9А', xp: 3420, games: 28, avatar: '🦊' },
  { name: 'Алина П.', grade: '8Б', xp: 2980, games: 24, avatar: '🐱' },
  { name: 'Дима Ш.', grade: '9В', xp: 2750, games: 22, avatar: '🐺' },
  { name: 'Катя Н.', grade: '7А', xp: 2100, games: 18, avatar: '🦋' },
  { name: 'Вася М.', grade: '8А', xp: 1890, games: 15, avatar: '🐸' },
  { name: 'Оля Г.', grade: '9Б', xp: 1650, games: 14, avatar: '🦄' },
  { name: 'Саша Д.', grade: '7В', xp: 1400, games: 12, avatar: '🐻' },
  { name: 'Лера Ж.', grade: '8В', xp: 980, games: 9, avatar: '🐧' },
];

interface StatsProps {
  completedGames: number[];
  totalXP: number;
}

interface CertificateProps {
  completedGames: number[];
  totalXP: number;
}

interface RatingProps {
  completedGames: number[];
  totalXP: number;
}

export function StatsSection({ completedGames, totalXP }: StatsProps) {
  return (
    <div>
      <h2 className="font-game text-2xl text-purple-700 mb-1">📊 Мой прогресс</h2>
      <p className="text-gray-400 text-sm mb-6">Следи за своими достижениями</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border-2 border-purple-100 p-4 text-center">
          <div className="text-3xl mb-1">🎮</div>
          <div className="font-game text-2xl text-purple-700">{completedGames.length}</div>
          <div className="text-xs text-gray-400">игр пройдено из 30</div>
        </div>
        <div className="bg-white rounded-xl border-2 border-yellow-100 p-4 text-center">
          <div className="text-3xl mb-1">⚡</div>
          <div className="font-game text-2xl text-yellow-500">{totalXP}</div>
          <div className="text-xs text-gray-400">очков опыта</div>
        </div>
      </div>

      {completedGames.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-gray-100 p-8 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-gray-500 text-sm">Ты ещё не прошёл ни одной игры.<br/>Перейди в каталог и начни!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">✅ Пройденные игры</h3>
          <div className="space-y-2">
            {completedGames.map(id => {
              const g = games.find(game => game.id === id);
              if (!g) return null;
              return (
                <div key={id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{g.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{g.title}</div>
                      <div className="text-xs text-gray-400">{g.topic}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyClass[g.difficulty]}`}>{difficultyLabel[g.difficulty]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CertificateSection({ completedGames, totalXP }: CertificateProps) {
  const [certName, setCertName] = useState('');
  const [certSurname, setCertSurname] = useState('');
  const [certShown, setCertShown] = useState(false);

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="font-game text-3xl text-purple-700 mb-2">🏆 Сертификат</h2>
        <p className="text-gray-500">Введи имя и фамилию для создания сертификата</p>
      </div>

      <div className="card-game rounded-2xl p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Имя</label>
            <input
              value={certName}
              onChange={e => setCertName(e.target.value)}
              placeholder="Введи своё имя..."
              className="w-full px-4 py-3 rounded-xl font-body text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all border-2 border-gray-200 focus:border-purple-400 bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Фамилия</label>
            <input
              value={certSurname}
              onChange={e => setCertSurname(e.target.value)}
              placeholder="Введи свою фамилию..."
              className="w-full px-4 py-3 rounded-xl font-body text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all border-2 border-gray-200 focus:border-purple-400 bg-gray-50"
            />
          </div>
          <button
            onClick={() => { if (certName && certSurname) setCertShown(true); }}
            disabled={!certName || !certSurname}
            className="w-full btn-game py-3 rounded-xl font-game text-sm text-white transition-all bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🏆 Создать сертификат
          </button>
        </div>
      </div>

      {certShown && certName && certSurname && (
        <div className="animate-scale-in">
          <div className="certificate-bg rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-3 left-3 text-2xl opacity-60">⭐</div>
            <div className="absolute top-3 right-3 text-2xl opacity-60">⭐</div>
            <div className="absolute bottom-3 left-3 text-2xl opacity-60">⭐</div>
            <div className="absolute bottom-3 right-3 text-2xl opacity-60">⭐</div>

            <div className="text-4xl mb-4">🎓</div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-500 mb-2">Образовательная платформа</p>
            <h2 className="font-game text-3xl text-purple-800 mb-1">КодоГерой</h2>
            <div className="w-24 h-0.5 mx-auto mb-4 bg-purple-300" />

            <p className="text-gray-600 text-sm mb-2">Настоящим подтверждается, что</p>
            <h3 className="font-game text-2xl md:text-3xl text-purple-700 mb-2">{certName} {certSurname}</h3>
            <p className="text-gray-600 text-sm mb-6">успешно прошёл(а) курс дидактических игр по информатике для 7-9 классов</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="font-game text-2xl text-purple-700">{completedGames.length}</div>
                <div className="text-xs text-gray-500">игр пройдено</div>
              </div>
              <div className="text-center">
                <div className="font-game text-2xl text-purple-700">{totalXP}</div>
                <div className="text-xs text-gray-500">XP набрано</div>
              </div>
              <div className="text-center">
                <div className="font-game text-2xl text-purple-700">7-9</div>
                <div className="text-xs text-gray-500">классы</div>
              </div>
            </div>

            <div className="certificate-seal w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl mb-4">🏆</div>
            <p className="text-xs text-gray-400">{new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Распечатай сертификат или сделай скриншот! 📸</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function RatingSection({ completedGames, totalXP }: RatingProps) {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="font-game text-3xl text-purple-700 mb-2">👑 Рейтинг Игроков</h2>
        <p className="text-gray-500">Топ КодоГероев школы</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8 items-end">
        {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((player, i) => {
          const pos = [2, 1, 3][i];
          const palette = [
            { border: '#9ca3af', bg: '#f9fafb', medal: '🥈' },
            { border: '#f59e0b', bg: '#fffbeb', medal: '🥇' },
            { border: '#d97706', bg: '#fef3c7', medal: '🥉' },
          ];
          const sizes = ['text-4xl', 'text-5xl', 'text-3xl'];
          return (
            <div key={player.name}
              className={`flex flex-col items-center card-game rounded-2xl p-4 border-2 ${i === 1 ? 'order-2' : i === 0 ? 'order-1' : 'order-3'}`}
              style={{ borderColor: palette[i].border, background: palette[i].bg }}
            >
              <div className={`${sizes[i]} mb-2`}>{player.avatar}</div>
              <div className="font-game text-xl mb-1">{pos === 1 ? palette[1].medal : pos === 2 ? palette[0].medal : palette[2].medal}</div>
              <div className="font-semibold text-xs text-gray-700 text-center">{player.name}</div>
              <div className="text-xs text-gray-400 mb-1">{player.grade}</div>
              <div className="font-game text-xs text-yellow-500">⚡ {player.xp}</div>
            </div>
          );
        })}
      </div>

      <div className="card-game rounded-2xl overflow-hidden">
        {mockLeaderboard.map((player, idx) => (
          <div
            key={player.name}
            className="flex items-center gap-4 px-5 py-4 transition-all hover:bg-purple-50"
            style={{ borderBottom: idx < mockLeaderboard.length - 1 ? '1px solid #f3f4f6' : 'none' }}
          >
            <div className="w-8 text-center font-game text-lg" style={{ color: idx === 0 ? '#f59e0b' : idx === 1 ? '#9ca3af' : idx === 2 ? '#d97706' : '#9ca3af' }}>
              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
            </div>
            <div className="text-2xl">{player.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-800">{player.name}</div>
              <div className="text-xs text-gray-400">{player.grade} · {player.games} игр</div>
            </div>
            <div className="text-right">
              <div className="font-game text-sm text-yellow-500">⚡ {player.xp} XP</div>
              <div className="text-xs text-yellow-400 mt-0.5">{'⭐'.repeat(Math.min(Math.floor(player.xp / 1000), 5))}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 card-game rounded-xl p-4 text-center border-2 border-purple-200 bg-purple-50">
        <p className="text-sm text-gray-500 mb-1">Твой результат сейчас:</p>
        <p className="font-game text-lg text-purple-700">⚡ {totalXP} XP · {completedGames.length} игр пройдено</p>
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-game text-2xl text-purple-700 mb-1">💬 Контакты</h2>
      <p className="text-gray-400 text-sm mb-6">Есть вопросы? Пишите!</p>

      <div className="space-y-3 mb-6">
        <div className="bg-white rounded-xl border-2 border-purple-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-purple-50">📧</div>
          <div>
            <div className="font-semibold text-sm text-gray-700">Электронная почта</div>
            <div className="text-sm font-semibold text-purple-600">baranovaanna890@gmail.com</div>
            <div className="text-xs text-gray-400">Ответим в течение 24 часов</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-pink-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-pink-50">📱</div>
          <div>
            <div className="font-semibold text-sm text-gray-700">Телефон</div>
            <div className="text-sm font-semibold text-purple-600">+7 (913) 066-73-92</div>
            <div className="text-xs text-gray-400">Пн–Пт с 8:00 до 17:00</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-blue-50">🏫</div>
          <div>
            <div className="font-semibold text-sm text-gray-700">Педагог-разработчик</div>
            <div className="text-sm font-semibold text-purple-600">Баранова Анна</div>
            <div className="text-xs text-gray-400">Специальность: Профессиональное обучение — Информационные системы и программирование</div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-xl border border-purple-200 p-5">
        <p className="font-semibold text-purple-700 mb-2">📌 О проекте</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Данный сайт является выпускной квалификационной работой по теме:<br/>
          <strong>«Активизация учебно-познавательной деятельности учащихся средствами дидактических игр»</strong>.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Платформа содержит дидактические игры по информатике для учащихся 7–9 классов с разным уровнем сложности.
        </p>
      </div>
    </div>
  );
}