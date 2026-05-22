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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(124,58,237,0.25)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl overflow-hidden border-2 border-purple-300 shadow-2xl">
          <div className="p-4 flex items-center justify-between bg-purple-50 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeGame.emoji}</span>
              <div>
                <p className="font-game text-sm text-purple-800">{activeGame.title}</p>
                <p className="text-xs text-gray-400">{activeGame.grade} · {activeGame.duration}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <Icon name="X" size={20} />
            </button>
          </div>

          {gameFinished ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">
                {score === activeGame.questions.length ? '🏆' : score >= 3 ? '⭐' : '💪'}
              </div>
              <h2 className="font-game text-2xl text-purple-700 mb-2">
                {score === activeGame.questions.length ? 'Отлично!' : score >= 3 ? 'Хороший результат!' : 'Продолжай учиться!'}
              </h2>
              <p className="text-gray-500 mb-6">Правильных ответов: <span className="text-yellow-500 font-bold">{score}</span> из {activeGame.questions.length}</p>
              <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                <span className="text-2xl">⚡</span>
                <span className="font-game text-yellow-500 text-lg">+{score === activeGame.questions.length ? activeGame.xp : Math.floor(activeGame.xp * 0.6)} XP</span>
              </div>
              <div className="flex gap-3">
                <button onClick={onRestart} className="flex-1 btn-game py-3 rounded-xl font-game text-sm text-gray-600 bg-gray-100 border-2 border-gray-200">
                  Повторить
                </button>
                <button onClick={onGoToCatalog} className="flex-1 btn-game py-3 rounded-xl font-game text-sm text-white bg-purple-600">
                  К каталогу
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-400">Вопрос {gameStep + 1} / {activeGame.questions.length}</span>
                <div className="flex gap-1">
                  {activeGame.questions.map((_, i) => (
                    <div key={i} className="w-6 h-2 rounded-full transition-all" style={{ background: i < gameStep ? '#10b981' : i === gameStep ? '#7c3aed' : '#e5e7eb' }} />
                  ))}
                </div>
              </div>

              <h3 className="font-body font-bold text-gray-800 text-lg mb-5 leading-snug">{q.question}</h3>

              <div className="space-y-3 mb-4">
                {q.options.map((opt, i) => {
                  let bg = '#f9fafb';
                  let border = '#e5e7eb';
                  let textColor = '#374151';
                  if (selectedAnswer !== null) {
                    if (i === q.correct) { bg = '#d1fae5'; border = '#10b981'; textColor = '#065f46'; }
                    else if (i === selectedAnswer && i !== q.correct) { bg = '#fee2e2'; border = '#ef4444'; textColor = '#991b1b'; }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => onAnswer(i)}
                      className="w-full text-left px-4 py-3 rounded-xl font-body text-sm transition-all border-2"
                      style={{ background: bg, borderColor: border, color: textColor, cursor: selectedAnswer !== null ? 'default' : 'pointer' }}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="rounded-xl p-3 mb-4 text-sm bg-blue-50 border border-blue-200 text-blue-700">
                  <Icon name="Lightbulb" size={14} className="inline mr-1" />
                  {q.explanation}
                </div>
              )}

              {selectedAnswer !== null && (
                <button onClick={onNext} className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors">
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