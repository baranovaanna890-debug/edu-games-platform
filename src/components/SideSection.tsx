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
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="font-game text-3xl text-purple-700 mb-2">📊 Статистика и Достижения</h2>
        <p className="text-gray-500">Следи за своим прогрессом</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { emoji: '🎮', label: 'Игр пройдено', value: completedGames.length, total: 30, color: '#7c3aed', bg: '#ede9fe' },
          { emoji: '⚡', label: 'Всего XP', value: totalXP, total: 3750, color: '#f59e0b', bg: '#fef3c7' },
          { emoji: '🔥', label: 'Дней подряд', value: 3, total: 30, color: '#ef4444', bg: '#fee2e2' },
          { emoji: '🏆', label: 'Достижений', value: Math.floor(completedGames.length / 3), total: 10, color: '#10b981', bg: '#d1fae5' },
        ].map(s => (
          <div key={s.label} className="card-game rounded-2xl p-5 text-center hover-lift" style={{ borderTop: `4px solid ${s.color}` }}>
            <div className="text-4xl mb-2">{s.emoji}</div>
            <div className="font-game text-3xl text-gray-800 mb-1">{s.value}</div>
            <div className="text-xs text-gray-500 mb-3">{s.label}</div>
            <div className="h-2 rounded-full overflow-hidden bg-gray-100">
              <div className="h-full rounded-full" style={{ width: `${Math.min((s.value / s.total) * 100, 100)}%`, background: s.color }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">{s.value} / {s.total}</div>
          </div>
        ))}
      </div>

      <div className="card-game rounded-2xl p-6 mb-6">
        <h3 className="font-game text-lg text-purple-700 mb-4">🏅 Достижения</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { emoji: '🌱', title: 'Первый шаг', desc: 'Пройди первую игру', earned: completedGames.length >= 1 },
            { emoji: '🔥', title: 'На разогреве', desc: 'Пройди 5 игр', earned: completedGames.length >= 5 },
            { emoji: '⚡', title: 'Энергетик', desc: 'Набери 500 XP', earned: totalXP >= 500 },
            { emoji: '🧠', title: 'Эрудит', desc: 'Пройди 10 игр', earned: completedGames.length >= 10 },
            { emoji: '🏆', title: 'Чемпион', desc: 'Пройди 20 игр', earned: completedGames.length >= 20 },
            { emoji: '👑', title: 'КодоГерой', desc: 'Пройди все 30 игр', earned: completedGames.length >= 30 },
            { emoji: '🔢', title: 'Алгоритмист', desc: 'Пройди все игры по алгоритмам', earned: games.filter(g => g.topic === 'Алгоритмы').every(g => completedGames.includes(g.id)) },
            { emoji: '🌐', title: 'Сетевик', desc: 'Пройди все игры по сетям', earned: games.filter(g => g.topic === 'Компьютерные сети').every(g => completedGames.includes(g.id)) },
          ].map(ach => (
            <div key={ach.title} className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all"
              style={{ background: ach.earned ? '#ede9fe' : '#f9fafb', borderColor: ach.earned ? '#7c3aed' : '#e5e7eb', opacity: ach.earned ? 1 : 0.55 }}>
              <span className="text-3xl">{ach.emoji}</span>
              <div>
                <div className="font-semibold text-sm text-gray-800">{ach.title} {ach.earned && '✓'}</div>
                <div className="text-xs text-gray-500">{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {completedGames.length > 0 && (
        <div className="card-game rounded-2xl p-6">
          <h3 className="font-game text-lg text-purple-700 mb-4">✅ Пройденные игры</h3>
          <div className="space-y-2">
            {completedGames.map(id => {
              const g = games.find(game => game.id === id);
              if (!g) return null;
              return (
                <div key={id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
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
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="font-game text-3xl text-purple-700 mb-2">💬 Контакты и Поддержка</h2>
        <p className="text-gray-500">Есть вопрос? Мы поможем!</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {[
          { emoji: '📧', title: 'Электронная почта', desc: 'info@kodo-hero.ru', sub: 'Ответим в течение 24 часов', color: '#ede9fe' },
          { emoji: '📱', title: 'Телефон учителя', desc: '+7 (000) 000-00-00', sub: 'Пн-Пт с 8:00 до 17:00', color: '#fce7f3' },
          { emoji: '🏫', title: 'Кабинет информатики', desc: 'Кабинет №204', sub: '2 этаж, главный корпус', color: '#dbeafe' },
        ].map(c => (
          <div key={c.title} className="card-game rounded-xl p-4 flex items-center gap-4 hover-lift">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: c.color }}>
              {c.emoji}
            </div>
            <div>
              <div className="font-semibold text-sm text-gray-800">{c.title}</div>
              <div className="text-sm font-semibold text-purple-600">{c.desc}</div>
              <div className="text-xs text-gray-400">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-game rounded-2xl p-6 mb-6">
        <h3 className="font-game text-lg text-purple-700 mb-4">📝 Написать нам</h3>
        <div className="space-y-3">
          <input placeholder="Твоё имя" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none border-2 border-gray-200 focus:border-purple-400 bg-gray-50" />
          <input placeholder="Email или телефон" className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none border-2 border-gray-200 focus:border-purple-400 bg-gray-50" />
          <textarea placeholder="Опиши свой вопрос..." rows={4} className="w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none resize-none border-2 border-gray-200 focus:border-purple-400 bg-gray-50" />
          <button className="w-full btn-game py-3 rounded-xl font-game text-sm text-white bg-purple-600">
            Отправить сообщение 🚀
          </button>
        </div>
      </div>

      <div className="card-game rounded-xl p-5">
        <p className="font-game text-sm text-purple-700 mb-3">❓ Частые вопросы</p>
        {[
          { q: '🎮 Сколько игр доступно?', a: '30 игр по информатике для 7-9 классов, три уровня сложности.' },
          { q: '🏆 Как получить сертификат?', a: 'Перейди в раздел «Сертификат», введи имя и фамилию — создаётся мгновенно!' },
          { q: '⚡ Что такое XP?', a: 'Очки опыта, которые ты зарабатываешь за прохождение игр. Чем больше правильных ответов — тем больше XP!' },
        ].map(faq => (
          <div key={faq.q} className="mb-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
            <div className="font-semibold text-sm text-gray-800 mb-1">{faq.q}</div>
            <div className="text-xs text-gray-500">{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}