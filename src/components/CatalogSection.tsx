import { games, topics, type Game, type Difficulty } from '@/data/games';

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

interface CatalogSectionProps {
  selectedTopic: string;
  setSelectedTopic: (t: string) => void;
  selectedDifficulty: 'all' | Difficulty;
  setSelectedDifficulty: (d: 'all' | Difficulty) => void;
  completedGames: number[];
  totalXP: number;
  onStartGame: (game: Game) => void;
  onNavigateToSection: (s: 'catalog') => void;
}

interface GamesSectionProps {
  completedGames: number[];
  totalXP: number;
  setSelectedDifficulty: (d: 'all' | Difficulty) => void;
  setSection: (s: 'catalog') => void;
}

export function CatalogSection({
  selectedTopic,
  setSelectedTopic,
  selectedDifficulty,
  setSelectedDifficulty,
  completedGames,
  onStartGame,
}: CatalogSectionProps) {
  const filteredGames = games.filter(g => {
    const topicMatch = selectedTopic === 'all' || g.topic === selectedTopic;
    const diffMatch = selectedDifficulty === 'all' || g.difficulty === selectedDifficulty;
    return topicMatch && diffMatch;
  });

  return (
    <div className="animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden mb-8 p-8 md:p-10" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
        <div className="absolute top-4 right-4 text-6xl animate-float opacity-40">🤖</div>
        <div className="absolute bottom-4 left-1/3 text-4xl animate-float opacity-30" style={{ animationDelay: '1s' }}>💡</div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-white/20 text-white border border-white/30">
            🎓 Информатика · 7-9 класс · 30 игр
          </div>
          <h1 className="font-game text-3xl md:text-5xl text-white mb-3">
            Стань <span className="shimmer-text">КодоГероем!</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mb-6">
            Учи информатику через игры, зарабатывай XP и получай сертификаты. Алгоритмы, программирование, сети — всё в формате игры!
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { emoji: '🎮', label: '30 игр' },
              { emoji: '⭐', label: '3 уровня сложности' },
              { emoji: '🏆', label: 'Сертификаты' },
              { emoji: '📈', label: 'Рейтинг' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-white/15 border border-white/20">
                <span>{item.emoji}</span> {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all border-2"
              style={{
                background: selectedTopic === t.id ? '#7c3aed' : '#ffffff',
                color: selectedTopic === t.id ? 'white' : '#6b7280',
                borderColor: selectedTopic === t.id ? '#7c3aed' : '#e5e7eb',
              }}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all border-2"
              style={{
                background: selectedDifficulty === d
                  ? d === 'easy' ? '#10b981' : d === 'medium' ? '#f59e0b' : d === 'hard' ? '#ef4444' : '#7c3aed'
                  : '#ffffff',
                color: selectedDifficulty === d ? 'white' : '#6b7280',
                borderColor: selectedDifficulty === d
                  ? d === 'easy' ? '#10b981' : d === 'medium' ? '#f59e0b' : d === 'hard' ? '#ef4444' : '#7c3aed'
                  : '#e5e7eb',
              }}
            >
              {d === 'all' ? '🎯 Все' : d === 'easy' ? '🟢 Лёгкий' : d === 'medium' ? '🟡 Средний' : '🔴 Сложный'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game, idx) => (
          <div
            key={game.id}
            className="game-card card-game rounded-2xl overflow-hidden hover-lift cursor-pointer relative"
            style={{ animationDelay: `${idx * 0.05}s` }}
            onClick={() => onStartGame(game)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-purple-50 border border-purple-100">
                  {game.emoji}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyClass[game.difficulty]}`}>
                    {difficultyLabel[game.difficulty]}
                  </span>
                  {completedGames.includes(game.id) && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">✓ Пройдено</span>
                  )}
                </div>
              </div>
              <h3 className="font-game text-sm text-gray-800 mb-1 leading-tight">{game.title}</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{game.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>⏱ {game.duration}</span>
                  <span>📚 {game.grade}</span>
                </div>
                <span className="text-xs font-bold text-yellow-500">⚡ {game.xp} XP</span>
              </div>
            </div>
            <div className="game-card-overlay absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(124,58,237,0.15)', backdropFilter: 'blur(1px)' }}>
              <div className="px-6 py-2 rounded-full font-game text-sm text-white bg-purple-600 shadow-md">
                Играть! 🎮
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GamesSection({ completedGames, totalXP, setSelectedDifficulty, setSection }: GamesSectionProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="font-game text-3xl text-purple-700 mb-2">🎮 Игровой Зал</h2>
        <p className="text-gray-500">Выбери уровень и начни прокачку знаний!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => {
          const colors = {
            easy: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46', badge: '#ecfdf5' },
            medium: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', badge: '#fffbeb' },
            hard: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', badge: '#fff1f2' },
          }[diff];
          return (
            <div
              key={diff}
              className="card-game rounded-2xl p-6 text-center hover-lift cursor-pointer border-2"
              style={{ borderColor: colors.border, background: colors.bg }}
              onClick={() => { setSelectedDifficulty(diff); setSection('catalog'); }}
            >
              <div className="text-5xl mb-4">{diff === 'easy' ? '🌱' : diff === 'medium' ? '⚔️' : '🔥'}</div>
              <h3 className="font-game text-xl mb-2" style={{ color: colors.text }}>{difficultyLabel[diff]}</h3>
              <p className="text-sm mb-4" style={{ color: colors.text, opacity: 0.7 }}>{diff === 'easy' ? '10 игр · 40-60 XP за игру' : diff === 'medium' ? '10 игр · 75-95 XP за игру' : '10 игр · 140-200 XP за игру'}</p>
              <div className="text-xs font-semibold px-3 py-1 rounded-full inline-block border" style={{ background: colors.badge, color: colors.text, borderColor: colors.border }}>
                {diff === 'easy' ? '7 класс' : diff === 'medium' ? '8 класс' : '9 класс'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-game rounded-2xl p-6">
        <h3 className="font-game text-lg text-purple-700 mb-4">🏅 Твой прогресс</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Игр пройдено', value: completedGames.length, max: 30, color: '#7c3aed', emoji: '🎮' },
            { label: 'Набрано XP', value: totalXP, max: 3750, color: '#f59e0b', emoji: '⚡' },
            { label: 'Уровень', value: Math.floor(totalXP / 500) + 1, max: 10, color: '#10b981', emoji: '🌟' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <div className="font-game text-2xl text-gray-800 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 mb-2">{stat.label}</div>
              <div className="h-2 rounded-full overflow-hidden bg-gray-100">
                <div className="h-full rounded-full" style={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%`, background: stat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}