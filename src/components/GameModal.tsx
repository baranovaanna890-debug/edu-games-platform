import { useState, useEffect } from 'react';
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

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#f59e0b', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} className="absolute rounded-sm"
          style={{
            width: 7, height: 7,
            left: `${5 + (i * 5.3) % 90}%`, top: '-8px',
            background: colors[i % colors.length],
            animation: `gmCF ${0.55 + (i % 5) * 0.1}s ease ${(i % 6) * 0.05}s forwards`,
            transform: `rotate(${i * 41}deg)`,
          }} />
      ))}
    </div>
  );
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
  const [questionKey, setQuestionKey] = useState(0);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => { setQuestionKey(k => k + 1); }, [gameStep]);

  useEffect(() => {
    if (selectedAnswer !== null && activeGame.questions && selectedAnswer === activeGame.questions[gameStep]?.correct) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 800);
    }
  }, [selectedAnswer]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!activeGame.questions) return null;
  const q = activeGame.questions[gameStep];
  const total = activeGame.questions.length;
  const isWin = gameFinished && score === total;
  const xpEarned = score === total ? activeGame.xp : Math.floor(activeGame.xp * (score / total));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(88,28,235,0.18)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-xl" style={{ animation: 'gmIn 0.3s ease both' }}>
        <div className="bg-white rounded-2xl overflow-hidden border-2 border-purple-200 shadow-2xl">

          {/* Шапка */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-purple-100"
            style={{ background: 'linear-gradient(90deg,#f5f3ff,#ede9fe)' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(124,58,237,0.3))' }}>{activeGame.emoji}</span>
              <div>
                <p className="font-game text-sm text-purple-800">{activeGame.title}</p>
                <p className="text-xs text-gray-400">{activeGame.grade} · {activeGame.duration}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors hover:rotate-90 duration-200">
              <Icon name="X" size={20} />
            </button>
          </div>

          {gameFinished ? (
            /* ── Экран результата ── */
            <div className="relative p-8 text-center overflow-hidden">
              <Confetti active={isWin} />
              <div className="text-6xl mb-4" style={{ animation: 'winSpin 0.6s ease both' }}>
                {score === total ? '🏆' : score >= Math.ceil(total / 2) ? '⭐' : '💪'}
              </div>
              <h2 className="font-game text-2xl text-purple-700 mb-2">
                {score === total ? 'Блестяще!' : score >= Math.ceil(total / 2) ? 'Хороший результат!' : 'Продолжай учиться!'}
              </h2>
              <p className="text-gray-500 mb-6">
                Правильных: <span className="text-purple-600 font-bold">{score}</span> из {total}
              </p>

              {/* Статбары */}
              <div className="flex justify-center gap-6 mb-6">
                {[
                  { label: 'Верно', val: score, color: '#10b981' },
                  { label: 'Ошибки', val: total - score, color: '#f87171' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-bold" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-yellow-50 border-2 border-yellow-200">
                <span className="text-2xl">⚡</span>
                <span className="font-game text-yellow-500 text-xl">+{xpEarned} XP</span>
              </div>

              <div className="flex gap-3">
                <button onClick={onRestart}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-gray-600 bg-gray-100 border-2 border-gray-200 hover:bg-gray-200 transition-colors">
                  ↺ Повторить
                </button>
                <button onClick={onGoToCatalog}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                  К каталогу →
                </button>
              </div>
            </div>
          ) : (
            /* ── Вопрос ── */
            <div className="p-5 relative overflow-hidden">
              <Confetti active={confetti} />

              {/* Прогресс */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-gray-400 whitespace-nowrap">{gameStep + 1} / {total}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${((gameStep) / total) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-purple-600">⭐ {score}</span>
              </div>

              {/* Вопрос с анимацией смены */}
              <div key={questionKey} style={{ animation: 'qSlide 0.35s ease both' }}>
                <h3 className="font-bold text-gray-800 text-base mb-5 leading-snug">{q.question}</h3>

                <div className="space-y-2.5 mb-4">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correct;
                    const isChosen = i === selectedAnswer;
                    let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151';
                    let anim = `optIn 0.3s ease ${i * 60}ms both`;
                    if (selectedAnswer !== null) {
                      if (isCorrect) { bg = '#d1fae5'; border = '#10b981'; textColor = '#065f46'; }
                      else if (isChosen) { bg = '#fee2e2'; border = '#ef4444'; textColor = '#991b1b'; anim = 'shake 0.4s ease'; }
                      else { bg = '#f3f4f6'; textColor = '#9ca3af'; }
                    }
                    return (
                      <button key={i} onClick={() => onAnswer(i)} disabled={selectedAnswer !== null}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm border-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-default"
                        style={{ background: bg, borderColor: border, color: textColor, animation: anim }}>
                        <span className="inline-block w-5 h-5 rounded-full text-xs font-bold text-center leading-5 mr-2 flex-shrink-0"
                          style={{ background: selectedAnswer !== null ? 'transparent' : '#ede9fe', color: '#7c3aed', display: 'inline-block' }}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                        {isCorrect && selectedAnswer !== null && <span className="float-right">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="rounded-xl p-3 mb-4 text-sm bg-blue-50 border border-blue-200 text-blue-700"
                    style={{ animation: 'slideUp 0.3s ease both' }}>
                    <Icon name="Lightbulb" size={14} className="inline mr-1.5" />
                    {q.explanation}
                  </div>
                )}

                {selectedAnswer !== null && (
                  <button onClick={onNext}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors hover:scale-[1.02] active:scale-[0.98]"
                    style={{ animation: 'slideUp 0.25s ease both' }}>
                    {gameStep + 1 >= total ? '🏁 Завершить' : 'Следующий →'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gmIn { from{opacity:0;transform:scale(0.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes gmCF { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(350px) rotate(600deg);opacity:0} }
        @keyframes winSpin { from{transform:scale(0) rotate(-30deg)} to{transform:scale(1) rotate(0)} }
        @keyframes optIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes qSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
      `}</style>
    </div>
  );
}
