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
    <div>
      <h1 className="font-game text-2xl text-purple-700 mb-1">📚 Каталог игр</h1>
      <p className="text-gray-500 text-sm mb-6">Выбери тему и уровень, нажми на карточку — поехали!</p>

      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap gap-2">
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-colors"
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
              className="px-3 py-1 rounded-lg text-xs font-bold border-2 transition-colors"
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
              {d === 'all' ? 'Все' : d === 'easy' ? '🟢 Лёгкий' : d === 'medium' ? '🟡 Средний' : '🔴 Сложный'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map(game => (
          <div
            key={game.id}
            className="bg-white rounded-xl border-2 border-gray-100 p-5 cursor-pointer hover:border-purple-300 hover:shadow-md transition-all"
            onClick={() => onStartGame(game)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{game.emoji}</span>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyClass[game.difficulty]}`}>
                  {difficultyLabel[game.difficulty]}
                </span>
                {game.type === 'quest' && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">📖 Квест</span>
                )}
                {(game.type === 'match' || game.type === 'sort') && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">🎮 Интерактивная</span>
                )}
                {completedGames.includes(game.id) && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✓ Готово</span>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">{game.title}</h3>
            <p className="text-xs text-gray-400 mb-3">{game.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{game.duration} · {game.grade}</span>
              <span className="font-bold text-yellow-500">⚡ {game.xp} XP</span>
            </div>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <p className="text-center text-gray-400 py-12">Нет игр по выбранным фильтрам</p>
      )}
    </div>
  );
}