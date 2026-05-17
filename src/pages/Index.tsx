import { useState } from 'react';
import { games, topics, type Game, type Difficulty } from '@/data/games';
import Icon from '@/components/ui/icon';

type Section = 'catalog' | 'games' | 'stats' | 'certificate' | 'rating' | 'contact';

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

export default function Index() {
  const [section, setSection] = useState<Section>('catalog');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Difficulty>('all');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [gameStep, setGameStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [completedGames, setCompletedGames] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [certName, setCertName] = useState('');
  const [certSurname, setCertSurname] = useState('');
  const [certShown, setCertShown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems: { id: Section; label: string; emoji: string }[] = [
    { id: 'catalog', label: 'Каталог', emoji: '📚' },
    { id: 'games', label: 'Игры', emoji: '🎮' },
    { id: 'stats', label: 'Статистика', emoji: '📊' },
    { id: 'certificate', label: 'Сертификат', emoji: '🏆' },
    { id: 'rating', label: 'Рейтинг', emoji: '👑' },
    { id: 'contact', label: 'Контакты', emoji: '💬' },
  ];

  const filteredGames = games.filter(g => {
    const topicMatch = selectedTopic === 'all' || g.topic === selectedTopic;
    const diffMatch = selectedDifficulty === 'all' || g.difficulty === selectedDifficulty;
    return topicMatch && diffMatch;
  });

  function startGame(game: Game) {
    setActiveGame(game);
    setGameStep(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setGameFinished(false);
  }

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (activeGame?.questions && idx === activeGame.questions[gameStep].correct) {
      setScore(s => s + 1);
    }
  }

  function nextQuestion() {
    if (!activeGame?.questions) return;
    const isCorrect = selectedAnswer === activeGame.questions[gameStep].correct;
    const newScore = score + (isCorrect ? 1 : 0);
    if (gameStep + 1 >= activeGame.questions.length) {
      setScore(newScore);
      setGameFinished(true);
      if (!completedGames.includes(activeGame.id)) {
        setCompletedGames(prev => [...prev, activeGame.id]);
        const earned = newScore === activeGame.questions.length ? activeGame.xp : Math.floor(activeGame.xp * 0.6);
        setTotalXP(prev => prev + earned);
      }
    } else {
      setGameStep(s => s + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }

  function renderGameModal() {
    if (!activeGame || !activeGame.questions) return null;
    const q = activeGame.questions[gameStep];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
        <div className="w-full max-w-xl animate-scale-in">
          <div className="card-game rounded-2xl overflow-hidden" style={{ border: '2px solid hsl(var(--primary))' }}>
            <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #7c3aed22, #06b6d422)' }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeGame.emoji}</span>
                <div>
                  <p className="font-game text-sm text-white">{activeGame.title}</p>
                  <p className="text-xs text-muted-foreground">{activeGame.grade} · {activeGame.duration}</p>
                </div>
              </div>
              <button onClick={() => setActiveGame(null)} className="text-muted-foreground hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            {gameFinished ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce-slow">
                  {score === activeGame.questions.length ? '🏆' : score >= 3 ? '⭐' : '💪'}
                </div>
                <h2 className="font-game text-2xl text-white mb-2">
                  {score === activeGame.questions.length ? 'Отлично!' : score >= 3 ? 'Хороший результат!' : 'Продолжай учиться!'}
                </h2>
                <p className="text-muted-foreground mb-6">Правильных ответов: <span className="text-game-yellow font-bold">{score}</span> из {activeGame.questions.length}</p>
                <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.15)' }}>
                  <span className="text-2xl">⚡</span>
                  <span className="font-game text-game-yellow text-lg">+{score === activeGame.questions.length ? activeGame.xp : Math.floor(activeGame.xp * 0.6)} XP</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startGame(activeGame)} className="flex-1 btn-game py-3 rounded-xl font-game text-sm text-white" style={{ background: 'hsl(var(--muted))' }}>
                    Повторить
                  </button>
                  <button onClick={() => { setActiveGame(null); setSection('catalog'); }} className="flex-1 btn-game py-3 rounded-xl font-game text-sm text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                    К каталогу
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">Вопрос {gameStep + 1} / {activeGame.questions.length}</span>
                  <div className="flex gap-1">
                    {activeGame.questions.map((_, i) => (
                      <div key={i} className="w-6 h-1.5 rounded-full transition-all" style={{ background: i < gameStep ? '#10b981' : i === gameStep ? '#7c3aed' : '#334155' }} />
                    ))}
                  </div>
                </div>

                <h3 className="font-body font-bold text-white text-lg mb-5 leading-snug">{q.question}</h3>

                <div className="space-y-3 mb-4">
                  {q.options.map((opt, i) => {
                    let bg = 'hsl(var(--muted))';
                    let border = 'transparent';
                    let textColor = 'hsl(var(--foreground))';
                    if (selectedAnswer !== null) {
                      if (i === q.correct) { bg = 'rgba(16,185,129,0.15)'; border = '#10b981'; textColor = '#10b981'; }
                      else if (i === selectedAnswer && i !== q.correct) { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; textColor = '#ef4444'; }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="w-full text-left px-4 py-3 rounded-xl font-body text-sm transition-all"
                        style={{ background: bg, border: `1.5px solid ${border}`, color: textColor, cursor: selectedAnswer !== null ? 'default' : 'pointer' }}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="rounded-xl p-3 mb-4 text-sm animate-fade-in" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}>
                    <Icon name="Lightbulb" size={14} className="inline mr-1" />
                    {q.explanation}
                  </div>
                )}

                {selectedAnswer !== null && (
                  <button onClick={nextQuestion} className="w-full btn-game py-3 rounded-xl font-game text-sm text-white animate-fade-in" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                    {gameStep + 1 >= activeGame.questions.length ? 'Завершить' : 'Следующий вопрос →'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(10,8,20,0.92)', backdropFilter: 'blur(12px)', borderColor: 'hsl(var(--border))' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl glow-purple" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>🚀</div>
            <div>
              <span className="font-game text-white text-lg">КодоГерой</span>
              <span className="block text-xs text-muted-foreground -mt-0.5">Информатика 7-9 класс</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className="px-3 py-2 rounded-lg text-sm font-body font-semibold transition-all"
                style={{
                  background: section === item.id ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'transparent',
                  color: section === item.id ? 'white' : 'hsl(var(--muted-foreground))',
                  boxShadow: section === item.id ? '0 0 15px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <span>⚡</span>
              <span className="font-game text-sm text-game-yellow">{totalXP} XP</span>
            </div>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white">
              <Icon name={mobileMenu ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: 'hsl(var(--border))' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setMobileMenu(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: section === item.id ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'transparent',
                  color: section === item.id ? 'white' : 'hsl(var(--muted-foreground))',
                }}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ===== CATALOG ===== */}
        {section === 'catalog' && (
          <div className="animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden mb-8 p-8 md:p-12" style={{ background: 'linear-gradient(135deg, #1e0a3c 0%, #0a1628 50%, #0a2a1a 100%)' }}>
              <div className="absolute inset-0 stars-bg opacity-60" />
              <div className="absolute top-4 right-4 text-6xl animate-float opacity-30">🤖</div>
              <div className="absolute bottom-4 left-1/3 text-4xl animate-float opacity-20" style={{ animationDelay: '1s' }}>💡</div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)', color: '#c4b5fd' }}>
                  🎓 Информатика · 7-9 класс · 30 игр
                </div>
                <h1 className="font-game text-3xl md:text-5xl text-white mb-3">
                  Стань <span className="shimmer-text">КодоГероем!</span>
                </h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-6">
                  Учи информатику через игры, зарабатывай XP и получай сертификаты. Алгоритмы, программирование, сети — всё в формате игры!
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { emoji: '🎮', label: '30 игр' },
                    { emoji: '⭐', label: '3 уровня сложности' },
                    { emoji: '🏆', label: 'Сертификаты' },
                    { emoji: '📈', label: 'Рейтинг' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'rgba(255,255,255,0.08)' }}>
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
                    className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
                    style={{
                      background: selectedTopic === t.id ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'hsl(var(--muted))',
                      color: selectedTopic === t.id ? 'white' : 'hsl(var(--muted-foreground))',
                      boxShadow: selectedTopic === t.id ? '0 0 12px rgba(124,58,237,0.4)' : 'none',
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
                    className="px-3 py-1 rounded-full text-xs font-bold transition-all text-white"
                    style={{
                      background: selectedDifficulty === d
                        ? d === 'easy' ? '#10b981' : d === 'medium' ? '#f59e0b' : d === 'hard' ? '#ef4444' : '#7c3aed'
                        : 'hsl(var(--muted))',
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
                  style={{ animationDelay: `${idx * 0.05}s`, border: '1px solid hsl(var(--border))' }}
                  onClick={() => startGame(game)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'hsl(var(--muted))' }}>
                        {game.emoji}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${difficultyClass[game.difficulty]}`}>
                          {difficultyLabel[game.difficulty]}
                        </span>
                        {completedGames.includes(game.id) && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#10b981' }}>✓ Пройдено</span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-game text-sm text-white mb-1 leading-tight">{game.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>⏱ {game.duration}</span>
                        <span>📚 {game.grade}</span>
                      </div>
                      <span className="text-xs font-bold text-game-yellow">⚡ {game.xp} XP</span>
                    </div>
                  </div>
                  <div className="game-card-overlay absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(124,58,237,0.3)', backdropFilter: 'blur(2px)' }}>
                    <div className="px-6 py-2 rounded-full font-game text-sm text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                      Играть! 🎮
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== GAMES ===== */}
        {section === 'games' && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="font-game text-3xl text-white mb-2">🎮 Игровой Зал</h2>
              <p className="text-muted-foreground">Выбери уровень и начни прокачку знаний!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                <div key={diff} className="card-game rounded-2xl p-6 text-center hover-lift cursor-pointer" style={{ border: '1px solid hsl(var(--border))' }} onClick={() => { setSelectedDifficulty(diff); setSection('catalog'); }}>
                  <div className="text-5xl mb-4">{diff === 'easy' ? '🌱' : diff === 'medium' ? '⚔️' : '🔥'}</div>
                  <h3 className="font-game text-xl text-white mb-2">{difficultyLabel[diff]}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{diff === 'easy' ? '10 игр · 40-60 XP за игру' : diff === 'medium' ? '10 игр · 75-95 XP за игру' : '10 игр · 140-200 XP за игру'}</p>
                  <div className="text-xs font-semibold px-3 py-1 rounded-full inline-block" style={{
                    background: diff === 'easy' ? 'rgba(16,185,129,0.2)' : diff === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                    color: diff === 'easy' ? '#10b981' : diff === 'medium' ? '#f59e0b' : '#ef4444',
                  }}>
                    {diff === 'easy' ? '7 класс' : diff === 'medium' ? '8 класс' : '9 класс'}
                  </div>
                </div>
              ))}
            </div>

            <div className="card-game rounded-2xl p-6" style={{ border: '1px solid hsl(var(--border))' }}>
              <h3 className="font-game text-lg text-white mb-4">🏅 Твой прогресс</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Игр пройдено', value: completedGames.length, max: 30, color: '#7c3aed', emoji: '🎮' },
                  { label: 'Набрано XP', value: totalXP, max: 3750, color: '#f59e0b', emoji: '⚡' },
                  { label: 'Уровень', value: Math.floor(totalXP / 500) + 1, max: 10, color: '#10b981', emoji: '🌟' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl mb-1">{stat.emoji}</div>
                    <div className="font-game text-2xl text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mb-2">{stat.label}</div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%`, background: stat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== STATS ===== */}
        {section === 'stats' && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="font-game text-3xl text-white mb-2">📊 Статистика и Достижения</h2>
              <p className="text-muted-foreground">Следи за своим прогрессом</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { emoji: '🎮', label: 'Игр пройдено', value: completedGames.length, total: 30, color: '#7c3aed' },
                { emoji: '⚡', label: 'Всего XP', value: totalXP, total: 3750, color: '#f59e0b' },
                { emoji: '🔥', label: 'Дней подряд', value: 3, total: 30, color: '#ef4444' },
                { emoji: '🏆', label: 'Достижений', value: Math.floor(completedGames.length / 3), total: 10, color: '#10b981' },
              ].map(s => (
                <div key={s.label} className="card-game rounded-2xl p-5 text-center hover-lift" style={{ border: '1px solid hsl(var(--border))' }}>
                  <div className="text-4xl mb-2">{s.emoji}</div>
                  <div className="font-game text-3xl text-white mb-1">{s.value}</div>
                  <div className="text-xs text-muted-foreground mb-3">{s.label}</div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min((s.value / s.total) * 100, 100)}%`, background: s.color }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.value} / {s.total}</div>
                </div>
              ))}
            </div>

            <div className="card-game rounded-2xl p-6 mb-6" style={{ border: '1px solid hsl(var(--border))' }}>
              <h3 className="font-game text-lg text-white mb-4">🏅 Достижения</h3>
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
                  <div key={ach.title} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{ background: ach.earned ? 'rgba(124,58,237,0.15)' : 'hsl(var(--muted))', border: ach.earned ? '1px solid rgba(124,58,237,0.4)' : '1px solid transparent', opacity: ach.earned ? 1 : 0.5 }}>
                    <span className="text-3xl">{ach.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm text-white">{ach.title} {ach.earned && '✓'}</div>
                      <div className="text-xs text-muted-foreground">{ach.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {completedGames.length > 0 && (
              <div className="card-game rounded-2xl p-6" style={{ border: '1px solid hsl(var(--border))' }}>
                <h3 className="font-game text-lg text-white mb-4">✅ Пройденные игры</h3>
                <div className="space-y-2">
                  {completedGames.map(id => {
                    const g = games.find(game => game.id === id);
                    if (!g) return null;
                    return (
                      <div key={id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'hsl(var(--muted))' }}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{g.emoji}</span>
                          <div>
                            <div className="font-semibold text-sm text-white">{g.title}</div>
                            <div className="text-xs text-muted-foreground">{g.topic}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${difficultyClass[g.difficulty]}`}>{difficultyLabel[g.difficulty]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== CERTIFICATE ===== */}
        {section === 'certificate' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="font-game text-3xl text-white mb-2">🏆 Сертификат</h2>
              <p className="text-muted-foreground">Введи имя и фамилию для создания сертификата</p>
            </div>

            <div className="card-game rounded-2xl p-6 mb-6" style={{ border: '1px solid hsl(var(--border))' }}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Имя</label>
                  <input
                    value={certName}
                    onChange={e => setCertName(e.target.value)}
                    placeholder="Введи своё имя..."
                    className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-muted-foreground outline-none transition-all"
                    style={{ background: 'hsl(var(--muted))', border: '1.5px solid hsl(var(--border))' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white mb-2 block">Фамилия</label>
                  <input
                    value={certSurname}
                    onChange={e => setCertSurname(e.target.value)}
                    placeholder="Введи свою фамилию..."
                    className="w-full px-4 py-3 rounded-xl font-body text-sm text-white placeholder:text-muted-foreground outline-none transition-all"
                    style={{ background: 'hsl(var(--muted))', border: '1.5px solid hsl(var(--border))' }}
                  />
                </div>
                <button
                  onClick={() => { if (certName && certSurname) setCertShown(true); }}
                  disabled={!certName || !certSurname}
                  className="w-full btn-game py-3 rounded-xl font-game text-sm text-white transition-all"
                  style={{ background: certName && certSurname ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'hsl(var(--muted))', opacity: certName && certSurname ? 1 : 0.5, cursor: certName && certSurname ? 'pointer' : 'not-allowed' }}
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

                  <div className="text-4xl mb-4">🚀</div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400 mb-2">Образовательная платформа</p>
                  <h2 className="font-game text-3xl text-white mb-1">КодоГерой</h2>
                  <div className="w-24 h-0.5 mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }} />

                  <p className="text-yellow-200/80 text-sm mb-2">Настоящим подтверждается, что</p>
                  <h3 className="font-game text-2xl md:text-3xl text-yellow-300 mb-2">{certName} {certSurname}</h3>
                  <p className="text-yellow-200/80 text-sm mb-6">успешно прошёл(а) курс дидактических игр по информатике для 7-9 классов</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="font-game text-2xl text-yellow-300">{completedGames.length}</div>
                      <div className="text-xs text-yellow-200/60">игр пройдено</div>
                    </div>
                    <div className="text-center">
                      <div className="font-game text-2xl text-yellow-300">{totalXP}</div>
                      <div className="text-xs text-yellow-200/60">XP набрано</div>
                    </div>
                    <div className="text-center">
                      <div className="font-game text-2xl text-yellow-300">7-9</div>
                      <div className="text-xs text-yellow-200/60">классы</div>
                    </div>
                  </div>

                  <div className="certificate-seal w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl mb-4">🏆</div>
                  <p className="text-xs text-yellow-200/40">{new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">Распечатай сертификат или сделай скриншот! 📸</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== RATING ===== */}
        {section === 'rating' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="font-game text-3xl text-white mb-2">👑 Рейтинг Игроков</h2>
              <p className="text-muted-foreground">Топ КодоГероев школы</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8 items-end">
              {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((player, i) => {
                const pos = [2, 1, 3][i];
                const colors = ['#C0C0C0', '#FFD700', '#CD7F32'];
                const sizes = ['text-4xl', 'text-5xl', 'text-3xl'];
                return (
                  <div key={player.name} className={`flex flex-col items-center card-game rounded-2xl p-4 ${i === 1 ? 'order-2' : i === 0 ? 'order-1' : 'order-3'}`} style={{ border: `2px solid ${colors[i]}33` }}>
                    <div className={`${sizes[i]} mb-2`}>{player.avatar}</div>
                    <div className="font-game text-xl mb-1" style={{ color: colors[i] }}>{pos === 1 ? '🥇' : pos === 2 ? '🥈' : '🥉'}</div>
                    <div className="font-semibold text-xs text-white text-center">{player.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">{player.grade}</div>
                    <div className="font-game text-xs text-game-yellow">⚡ {player.xp}</div>
                  </div>
                );
              })}
            </div>

            <div className="card-game rounded-2xl overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
              {mockLeaderboard.map((player, idx) => (
                <div
                  key={player.name}
                  className="flex items-center gap-4 px-5 py-4 transition-all"
                  style={{ borderBottom: idx < mockLeaderboard.length - 1 ? '1px solid hsl(var(--border))' : 'none' }}
                >
                  <div className="w-8 text-center font-game text-lg" style={{ color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'hsl(var(--muted-foreground))' }}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                  </div>
                  <div className="text-2xl">{player.avatar}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-white">{player.name}</div>
                    <div className="text-xs text-muted-foreground">{player.grade} · {player.games} игр</div>
                  </div>
                  <div className="text-right">
                    <div className="font-game text-sm text-game-yellow">⚡ {player.xp} XP</div>
                    <div className="text-xs text-game-yellow mt-0.5">{'⭐'.repeat(Math.min(Math.floor(player.xp / 1000), 5))}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 card-game rounded-xl p-4 text-center" style={{ border: '1px solid hsl(var(--border))' }}>
              <p className="text-sm text-muted-foreground mb-1">Твой результат сейчас:</p>
              <p className="font-game text-lg text-white">⚡ {totalXP} XP · {completedGames.length} игр пройдено</p>
            </div>
          </div>
        )}

        {/* ===== CONTACT ===== */}
        {section === 'contact' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="font-game text-3xl text-white mb-2">💬 Контакты и Поддержка</h2>
              <p className="text-muted-foreground">Есть вопрос? Мы поможем!</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {[
                { emoji: '📧', title: 'Электронная почта', desc: 'info@kodo-hero.ru', sub: 'Ответим в течение 24 часов' },
                { emoji: '📱', title: 'Телефон учителя', desc: '+7 (000) 000-00-00', sub: 'Пн-Пт с 8:00 до 17:00' },
                { emoji: '🏫', title: 'Кабинет информатики', desc: 'Кабинет №204', sub: '2 этаж, главный корпус' },
              ].map(c => (
                <div key={c.title} className="card-game rounded-xl p-4 flex items-center gap-4 hover-lift" style={{ border: '1px solid hsl(var(--border))' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(124,58,237,0.2)' }}>
                    {c.emoji}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{c.title}</div>
                    <div className="text-sm font-semibold" style={{ color: '#7c3aed' }}>{c.desc}</div>
                    <div className="text-xs text-muted-foreground">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-game rounded-2xl p-6 mb-6" style={{ border: '1px solid hsl(var(--border))' }}>
              <h3 className="font-game text-lg text-white mb-4">📝 Написать нам</h3>
              <div className="space-y-3">
                <input placeholder="Твоё имя" className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-muted-foreground outline-none" style={{ background: 'hsl(var(--muted))', border: '1.5px solid hsl(var(--border))' }} />
                <input placeholder="Email или телефон" className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-muted-foreground outline-none" style={{ background: 'hsl(var(--muted))', border: '1.5px solid hsl(var(--border))' }} />
                <textarea placeholder="Опиши свой вопрос..." rows={4} className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-muted-foreground outline-none resize-none" style={{ background: 'hsl(var(--muted))', border: '1.5px solid hsl(var(--border))' }} />
                <button className="w-full btn-game py-3 rounded-xl font-game text-sm text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                  Отправить сообщение 🚀
                </button>
              </div>
            </div>

            <div className="card-game rounded-xl p-5" style={{ border: '1px solid hsl(var(--border))' }}>
              <p className="font-game text-sm text-white mb-3">❓ Частые вопросы</p>
              {[
                { q: '🎮 Сколько игр доступно?', a: '30 игр по информатике для 7-9 классов, три уровня сложности.' },
                { q: '🏆 Как получить сертификат?', a: 'Перейди в раздел «Сертификат», введи имя и фамилию — создаётся мгновенно!' },
                { q: '⚡ Что такое XP?', a: 'Очки опыта, которые ты зарабатываешь за прохождение игр. Чем больше правильных ответов — тем больше XP!' },
              ].map(faq => (
                <div key={faq.q} className="mb-3 p-3 rounded-xl" style={{ background: 'hsl(var(--muted))' }}>
                  <div className="font-semibold text-sm text-white mb-1">{faq.q}</div>
                  <div className="text-xs text-muted-foreground">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-16 py-6 text-center" style={{ borderColor: 'hsl(var(--border))' }}>
        <p className="text-muted-foreground text-sm">🚀 КодоГерой · Дидактические игры по информатике · 7-9 класс</p>
      </footer>

      {activeGame && renderGameModal()}
    </div>
  );
}
