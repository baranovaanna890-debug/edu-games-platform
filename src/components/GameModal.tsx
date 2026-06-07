import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import type { Game } from '@/data/games';
import { HEROES } from '@/components/ArcadeGames';

type HeroKey = keyof typeof HEROES;

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

// Герои по теме — меняются каждые 3 вопроса
const QUIZ_HEROES: HeroKey[] = ['prof', 'robot', 'wizard', 'captain', 'doctor'];

const QUIZ_CORRECT = [
  'Великолепно! Именно так!',
  'Верно! Ты знаешь материал!',
  'Отличный ответ! Продолжай!',
  'Правильно! Ты молодец! 🎉',
  'Точно! Я впечатлён!',
];
const QUIZ_WRONG = [
  'Эх, не то... Но не сдавайся!',
  'Неверно. Прочитай объяснение!',
  'Подумай ещё раз в следующий раз!',
  'Ошибка! Но мы учимся на них.',
];

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#f59e0b', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="absolute rounded-sm"
          style={{
            width: 7, height: 7,
            left: `${5 + (i * 4.8) % 90}%`, top: '-8px',
            background: colors[i % colors.length],
            animation: `gmCF ${0.55 + (i % 5) * 0.1}s ease ${(i % 6) * 0.05}s forwards`,
            transform: `rotate(${i * 41}deg)`,
          }} />
      ))}
    </div>
  );
}

function HeroBubble({ heroKey, text }: { heroKey: HeroKey; text: string }) {
  const h = HEROES[heroKey];
  return (
    <div className="flex items-end gap-2" style={{ animation: 'gmBubble 0.35s cubic-bezier(.34,1.56,.64,1) both' }}>
      <div className="text-3xl flex-shrink-0" style={{ animation: 'gmHeroFloat 2s ease infinite alternate' }}>
        {h.avatar}
      </div>
      <div>
        <div className="text-xs font-bold mb-0.5" style={{ color: h.color }}>{h.name}</div>
        <div className="px-3 py-2 rounded-xl text-sm leading-relaxed max-w-xs"
          style={{ background: h.bg, border: `1px solid ${h.color}33`, color: '#1f2937' }}>
          {text}
        </div>
      </div>
    </div>
  );
}

export default function GameModal({
  activeGame, gameStep, selectedAnswer, showExplanation,
  score, gameFinished, onClose, onAnswer, onNext, onRestart, onGoToCatalog,
}: GameModalProps) {
  const [questionKey, setQuestionKey] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');
  const [phase, setPhase] = useState<'intro' | 'play'>('intro');

  const heroKey: HeroKey = QUIZ_HEROES[Math.floor(gameStep / 3) % QUIZ_HEROES.length];
  const h = HEROES[heroKey];

  useEffect(() => { setQuestionKey(k => k + 1); setHeroMsg(''); }, [gameStep]);

  useEffect(() => {
    if (!activeGame.questions) return;
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === activeGame.questions[gameStep]?.correct;
      if (isCorrect) {
        setConfetti(true); setTimeout(() => setConfetti(false), 900);
        setHeroMsg(QUIZ_CORRECT[Math.floor(Math.random() * QUIZ_CORRECT.length)]);
      } else {
        setHeroMsg(QUIZ_WRONG[Math.floor(Math.random() * QUIZ_WRONG.length)]);
      }
    }
  }, [selectedAnswer]); // eslint-disable-line

  if (!activeGame.questions) return null;
  const q = activeGame.questions[gameStep];
  const total = activeGame.questions.length;
  const isWin = gameFinished && score === total;
  const xpEarned = score === total ? activeGame.xp : Math.max(Math.floor(activeGame.xp * (score / total)), 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(88,28,235,0.15)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-xl" style={{ animation: 'gmIn 0.3s ease both' }}>
        <div className="bg-white rounded-2xl overflow-hidden border-2 shadow-2xl"
          style={{ borderColor: `${h.color}44` }}>

          {/* Шапка */}
          <div className="px-4 py-3 flex items-center justify-between border-b"
            style={{ background: `${h.color}0a`, borderColor: `${h.color}22` }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}>{activeGame.emoji}</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">{activeGame.title}</p>
                <p className="text-xs text-gray-400">{activeGame.grade} · {activeGame.duration}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Интро-экран с героем */}
          {phase === 'intro' ? (
            <div className="flex flex-col items-center p-8 text-center gap-4"
              style={{ animation: 'gmIn 0.4s ease both' }}>
              <div className="text-6xl" style={{ animation: 'gmHeroFloat 2s ease infinite alternate' }}>{h.avatar}</div>
              <div>
                <div className="text-xs font-bold mb-0.5" style={{ color: h.color }}>{h.name}</div>
                <div className="font-game text-xl text-gray-800">Тест по теме: {activeGame.topic}</div>
                <div className="text-gray-400 text-sm mt-1">{total} вопросов · {activeGame.difficulty === 'easy' ? 'Лёгкий' : activeGame.difficulty === 'medium' ? 'Средний' : 'Сложный'}</div>
              </div>
              <div className="rounded-2xl px-5 py-3 text-sm text-gray-600 leading-relaxed max-w-xs"
                style={{ background: h.bg, border: `1px solid ${h.color}33` }}>
                Я буду комментировать твои ответы. Отвечай внимательно — за каждый верный ответ XP!
              </div>
              <button onClick={() => setPhase('play')}
                className="px-8 py-3 rounded-xl font-bold text-white text-base hover:scale-105 active:scale-95 transition-transform"
                style={{ background: h.color, boxShadow: `0 0 20px ${h.color}44` }}>
                📚 Начать тест!
              </button>
            </div>

          ) : gameFinished ? (
            /* Экран результата */
            <div className="relative p-8 text-center overflow-hidden">
              <Confetti active={isWin} />
              <div className="text-5xl mb-2" style={{ animation: 'gmWinDance 0.7s ease infinite alternate' }}>{h.avatar}</div>
              <div className="text-5xl mb-3" style={{ animation: 'gmBounce 0.6s ease infinite alternate' }}>
                {score === total ? '🏆' : score >= Math.ceil(total / 2) ? '⭐' : '💪'}
              </div>
              <h2 className="font-game text-2xl text-purple-700 mb-2">
                {score === total ? 'Блестяще!' : score >= Math.ceil(total / 2) ? 'Хороший результат!' : 'Продолжай учиться!'}
              </h2>
              <div className="text-xs italic mb-3 px-4 py-2 rounded-xl" style={{ color: h.color, background: h.bg }}>
                "{h.name} {'говорит'}: {score === total ? 'Я горжусь тобой! Идеальный результат!' : score >= Math.ceil(total / 2) ? 'Хорошая работа, не останавливайся!' : 'Повтори материал и попробуй снова!'}"
              </div>
              <p className="text-gray-500 mb-4">
                Правильных: <span className="font-bold" style={{ color: h.color }}>{score}</span> из {total}
              </p>

              {/* Шкала результата */}
              <div className="flex rounded-xl overflow-hidden mb-5 h-3">
                <div className="transition-all duration-1000" style={{ width: `${(score / total) * 100}%`, background: '#10b981' }} />
                <div className="flex-1" style={{ background: '#fee2e2' }} />
              </div>

              <div className="flex items-center justify-center gap-2 mb-5 p-3 rounded-xl bg-yellow-50 border-2 border-yellow-200">
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
            /* Вопрос */
            <div className="p-5 relative overflow-hidden">
              <Confetti active={confetti} />

              {/* Прогресс */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-gray-400 whitespace-nowrap">{gameStep + 1} / {total}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(gameStep / total) * 100}%`, background: h.color }} />
                </div>
                <span className="text-xs font-bold" style={{ color: h.color }}>⭐ {score}</span>
              </div>

              {/* Реакция героя ИЛИ вопрос */}
              {heroMsg && selectedAnswer !== null ? (
                <div className="mb-3">
                  <HeroBubble heroKey={heroKey} text={heroMsg} />
                </div>
              ) : null}

              {/* Вопрос */}
              <div key={questionKey} style={{ animation: 'gmQSlide 0.35s ease both' }}>
                <h3 className="font-bold text-gray-800 text-base mb-4 leading-snug">{q.question}</h3>

                <div className="space-y-2.5 mb-4">
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correct; const isChosen = i === selectedAnswer;
                    let bg = '#f9fafb', border = '#e5e7eb', textColor = '#374151';
                    let anim = `gmOptIn 0.3s ease ${i * 60}ms both`;
                    if (selectedAnswer !== null) {
                      if (isCorrect)       { bg = '#d1fae5'; border = '#10b981'; textColor = '#065f46'; }
                      else if (isChosen)   { bg = '#fee2e2'; border = '#ef4444'; textColor = '#991b1b'; anim = 'gmShake 0.4s ease'; }
                      else                 { bg = '#f3f4f6'; textColor = '#9ca3af'; }
                    }
                    return (
                      <button key={i} onClick={() => onAnswer(i)} disabled={selectedAnswer !== null}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm border-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-default"
                        style={{ background: bg, borderColor: border, color: textColor, animation: anim }}>
                        <span className="inline-flex w-6 h-6 rounded-full text-xs font-bold items-center justify-center mr-2 flex-shrink-0 align-middle"
                          style={{
                            background: selectedAnswer !== null ? 'transparent' : `${h.color}22`,
                            color: h.color,
                          }}>
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
                    style={{ animation: 'gmSlideUp 0.3s ease both' }}>
                    <Icon name="Lightbulb" size={14} className="inline mr-1.5" />
                    {q.explanation}
                  </div>
                )}

                {selectedAnswer !== null && (
                  <button onClick={onNext}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: h.color, animation: 'gmSlideUp 0.25s ease both' }}>
                    {gameStep + 1 >= total ? '🏁 Завершить' : 'Следующий →'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gmIn       { from{opacity:0;transform:scale(0.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes gmCF       { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(360px) rotate(600deg);opacity:0} }
        @keyframes gmBounce   { from{transform:scale(1) rotate(-3deg)} to{transform:scale(1.08) rotate(3deg) translateY(-8px)} }
        @keyframes gmWinDance { from{transform:translateY(0) rotate(-8deg)} to{transform:translateY(-10px) rotate(8deg)} }
        @keyframes gmHeroFloat{ from{transform:translateY(0) rotate(-2deg)} to{transform:translateY(-9px) rotate(2deg)} }
        @keyframes gmBubble   { from{opacity:0;transform:scale(0.6) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes gmQSlide   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gmOptIn    { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gmSlideUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gmShake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
      `}</style>
    </div>
  );
}
