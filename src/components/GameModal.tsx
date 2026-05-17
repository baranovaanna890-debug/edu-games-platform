import Icon from '@/components/ui/icon';
import type { Game } from '@/data/games';

interface GameModalProps {
  activeGame: Game;
  gameStep: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  score: number;
  gameFinished: boolean;
  onClose: () => void;
  onAnswer: (idx: number) => void;
  onNext: () => void;
  onRestart: () => void;
  onGoToCatalog: () => void;
}

export default function GameModal({
  activeGame,
  gameStep,
  selectedAnswer,
  showExplanation,
  score,
  gameFinished,
  onClose,
  onAnswer,
  onNext,
  onRestart,
  onGoToCatalog,
}: GameModalProps) {
  if (!activeGame.questions) return null;
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
            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
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
                <button onClick={onRestart} className="flex-1 btn-game py-3 rounded-xl font-game text-sm text-white" style={{ background: 'hsl(var(--muted))' }}>
                  Повторить
                </button>
                <button onClick={onGoToCatalog} className="flex-1 btn-game py-3 rounded-xl font-game text-sm text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
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
                      onClick={() => onAnswer(i)}
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
                <button onClick={onNext} className="w-full btn-game py-3 rounded-xl font-game text-sm text-white animate-fade-in" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
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
