import { useState, useEffect, useRef, useCallback } from 'react';
import type { Game } from '@/data/games';
import Icon from '@/components/ui/icon';

interface Props {
  activeGame: Game;
  onClose: () => void;
  onFinish: (xp: number) => void;
}

// ─────────────────────────────────────────────
// Общие компоненты
// ─────────────────────────────────────────────
function Header({ game, onClose, extra }: { game: Game; onClose: () => void; extra?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{game.emoji}</span>
        <span className="font-bold text-white text-sm">{game.title}</span>
      </div>
      <div className="flex items-center gap-3">
        {extra}
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
          <Icon name="X" size={18} />
        </button>
      </div>
    </div>
  );
}

function WinScreen({ xp, label, onFinish }: { xp: number; label: string; onFinish: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
      <div className="text-7xl mb-4" style={{ animation: 'bounce 0.6s ease infinite alternate' }}>🏆</div>
      <h2 className="text-2xl font-bold text-white mb-2">{label}</h2>
      <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 mb-6">
        <span className="text-2xl">⚡</span>
        <span className="text-2xl font-bold text-yellow-300">+{xp} XP</span>
      </div>
      <button
        onClick={onFinish}
        className="px-8 py-3 rounded-xl font-bold text-gray-800 bg-white hover:bg-gray-100 transition-colors"
      >
        К каталогу →
      </button>
      <style>{`@keyframes bounce { from{transform:translateY(0)} to{transform:translateY(-12px)} }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// 🎯 ИГРА «ПОЙМАЙ ОТВЕТ» (catch)
// ─────────────────────────────────────────────
interface FlyingItem {
  id: number;
  label: string;
  correct: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  caught: boolean;
  missed: boolean;
  color: string;
}

const COLORS_CORRECT = ['#34d399', '#4ade80', '#86efac'];
const COLORS_WRONG   = ['#f87171', '#fb923c', '#f472b6'];

export function CatchGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.catchRounds!;
  const [roundIdx, setRoundIdx] = useState(0);
  const [items, setItems] = useState<FlyingItem[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [roundDone, setRoundDone] = useState(false);
  const animRef = useRef<number>(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const round = rounds[roundIdx];

  const spawnItems = useCallback(() => {
    const spawned: FlyingItem[] = round.items.map((it) => {
      idRef.current++;
      return {
        id: idRef.current,
        label: it.label,
        correct: it.correct,
        x: 10 + Math.random() * 75,
        y: -15 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.25,
        vy: 0.18 + Math.random() * 0.18,
        caught: false,
        missed: false,
        color: it.correct
          ? COLORS_CORRECT[Math.floor(Math.random() * 3)]
          : COLORS_WRONG[Math.floor(Math.random() * 3)],
      };
    });
    setItems(spawned);
  }, [round]);

  useEffect(() => { spawnItems(); }, [spawnItems]);

  useEffect(() => {
    let last = performance.now();
    function tick(now: number) {
      const dt = now - last; last = now;
      setItems(prev => {
        const next = prev.map(it => {
          if (it.caught || it.missed) return it;
          const ny = it.y + it.vy * dt * 0.1;
          const nx = it.x + it.vx * dt * 0.1;
          const missed = ny > 110;
          return { ...it, x: Math.max(2, Math.min(93, nx)), y: ny, missed };
        });
        return next;
      });
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [roundIdx]);

  // Проверяем конец раунда
  useEffect(() => {
    if (items.length === 0) return;
    const allGone = items.every(it => it.caught || it.missed);
    if (allGone && !roundDone) {
      setRoundDone(true);
      setTimeout(() => {
        if (roundIdx + 1 >= rounds.length) {
          setDone(true);
        } else {
          setRoundIdx(i => i + 1);
          setRoundDone(false);
        }
      }, 800);
    }
  }, [items, roundDone, roundIdx, rounds.length]);

  function catchItem(id: number) {
    setItems(prev => prev.map(it => {
      if (it.id !== id || it.caught || it.missed) return it;
      if (it.correct) { setScore(s => s + 1); }
      else { setMistakes(m => m + 1); }
      return { ...it, caught: true };
    }));
  }

  const correctCount = round.items.filter(i => i.correct).length;
  const caughtCorrect = items.filter(i => i.caught && i.correct).length;
  const xpEarned = mistakes === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', maxHeight: '90vh' }}>

        <Header game={activeGame} onClose={onClose} extra={
          <span className="text-white/70 text-xs">Ошибок: {mistakes}</span>
        } />

        {done ? (
          <WinScreen xp={xpEarned} label={mistakes === 0 ? 'Идеальный улов! 🎯' : 'Раунды пройдены!'} onFinish={() => onFinish(xpEarned)} />
        ) : (
          <div className="flex flex-col flex-1">
            <div className="px-4 py-2 text-center">
              <p className="text-white/90 font-bold text-sm">{round.question}</p>
              <p className="text-white/50 text-xs mt-0.5">Раунд {roundIdx + 1}/{rounds.length} · поймано {caughtCorrect}/{correctCount}</p>
            </div>

            {/* Игровое поле */}
            <div ref={areaRef} className="relative flex-1 mx-4 mb-4 rounded-xl overflow-hidden"
              style={{ minHeight: 320, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>

              {items.map(item => {
                if (item.missed && !item.caught) return null;
                return (
                  <button
                    key={item.id}
                    onClick={() => catchItem(item.id)}
                    className="absolute px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 select-none"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      background: item.color,
                      transform: item.caught ? 'scale(1.4)' : 'scale(1)',
                      opacity: item.caught ? 0 : 1,
                      transition: item.caught ? 'all 0.3s ease' : 'opacity 0.1s',
                      pointerEvents: item.caught ? 'none' : 'auto',
                      boxShadow: `0 2px 12px ${item.color}80`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Подсказка */}
              <div className="absolute bottom-2 left-0 right-0 text-center text-white/30 text-xs pointer-events-none">
                зелёные = верные · красные = ложные
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 🔤 ИГРА «СОБЕРИ СЛОВО» (wordbuild)
// ─────────────────────────────────────────────
interface LetterTile {
  id: number;
  char: string;
  picked: boolean;
  x: number;
  y: number;
  delay: number;
}

export function WordBuildGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.wordBuildRounds!;
  const [idx, setIdx] = useState(0);
  const [tiles, setTiles] = useState<LetterTile[]>([]);
  const [built, setBuilt] = useState<{ id: number; char: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);

  const round = rounds[idx];

  function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    const word = round.word.toUpperCase();
    // Добавляем 3-4 лишние буквы
    const extra = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ'
      .split('').filter(c => !word.includes(c));
    const noise = shuffle(extra).slice(0, Math.min(4, word.length));
    const allChars = shuffle([...word.split(''), ...noise]);

    setTiles(allChars.map((char, i) => ({
      id: i,
      char,
      picked: false,
      x: (i % 5) * 20 + Math.random() * 5,
      y: Math.floor(i / 5) * 30 + Math.random() * 8,
      delay: i * 60,
    })));
    setBuilt([]);
    setStatus('idle');
  }, [idx, round.word]);

  function pickTile(tile: LetterTile) {
    if (tile.picked || status === 'correct') return;
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, picked: true } : t));
    setBuilt(prev => [...prev, { id: tile.id, char: tile.char }]);
  }

  function unpick(id: number) {
    if (status === 'correct') return;
    setBuilt(prev => prev.filter(b => b.id !== id));
    setTiles(prev => prev.map(t => t.id === id ? { ...t, picked: false } : t));
  }

  useEffect(() => {
    const word = round.word.toUpperCase();
    const current = built.map(b => b.char).join('');
    if (current.length < word.length) return;
    if (current === word) {
      setStatus('correct');
      setTimeout(() => {
        if (idx + 1 >= rounds.length) setDone(true);
        else setIdx(i => i + 1);
      }, 900);
    } else {
      setStatus('wrong');
      setErrors(e => e + 1);
      setTimeout(() => {
        setTiles(prev => prev.map(t => ({ ...t, picked: false })));
        setBuilt([]);
        setStatus('idle');
      }, 700);
    }
  }, [built, round.word, idx, rounds.length]);

  const xpEarned = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#064e3b,#065f46)', maxHeight: '90vh' }}>

        <Header game={activeGame} onClose={onClose} extra={
          <span className="text-white/70 text-xs">Ошибок: {errors}</span>
        } />

        {done ? (
          <WinScreen xp={xpEarned} label={errors === 0 ? 'Словарный мастер! 📖' : 'Все слова собраны!'} onFinish={() => onFinish(xpEarned)} />
        ) : (
          <div className="flex flex-col p-4 gap-4 flex-1">
            <div className="text-center">
              <p className="text-white/50 text-xs mb-1">Слово {idx + 1} / {rounds.length}</p>
              <p className="text-white font-bold text-base">{round.clue}</p>
            </div>

            {/* Поле сборки */}
            <div
              className="min-h-[52px] rounded-xl px-3 py-2 flex flex-wrap gap-2 items-center justify-center border-2 transition-all"
              style={{
                borderColor: status === 'correct' ? '#34d399' : status === 'wrong' ? '#f87171' : 'rgba(255,255,255,0.2)',
                background: status === 'correct' ? 'rgba(52,211,153,0.15)' : status === 'wrong' ? 'rgba(248,113,113,0.15)' : 'rgba(0,0,0,0.2)',
              }}
            >
              {built.length === 0
                ? <span className="text-white/30 text-sm">← кликай буквы снизу</span>
                : built.map((b, i) => (
                  <button key={i} onClick={() => unpick(b.id)}
                    className="w-9 h-9 rounded-lg font-bold text-sm flex items-center justify-center transition-transform hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.9)', color: '#064e3b' }}
                  >{b.char}</button>
                ))
              }
            </div>

            {/* Буквы вразброс */}
            <div className="relative rounded-xl overflow-hidden flex flex-wrap gap-2 p-4 justify-center"
              style={{ background: 'rgba(0,0,0,0.2)', minHeight: 120 }}>
              {tiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => pickTile(tile)}
                  disabled={tile.picked}
                  className="w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all"
                  style={{
                    background: tile.picked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                    color: tile.picked ? 'transparent' : '#064e3b',
                    transform: tile.picked ? 'scale(0.8)' : 'scale(1)',
                    animation: `tileIn 0.3s ease ${tile.delay}ms both`,
                    cursor: tile.picked ? 'default' : 'pointer',
                  }}
                >
                  {tile.picked ? '' : tile.char}
                </button>
              ))}
            </div>

            <button onClick={() => { setTiles(t => t.map(ti => ({ ...ti, picked: false }))); setBuilt([]); }}
              className="text-white/40 hover:text-white/70 text-xs text-center transition-colors">
              Сбросить
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes tileIn { from{opacity:0;transform:translateY(20px) scale(0.7)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// ⚡ ИГРА «ГОНКА ЗНАНИЙ» (race)
// ─────────────────────────────────────────────
const RACE_TIME = 12; // секунд на вопрос

export function RaceGame({ activeGame, onClose, onFinish }: Props) {
  const questions = activeGame.raceQuestions!;
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RACE_TIME);
  const [chosen, setChosen] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = questions[idx];

  useEffect(() => {
    setTimeLeft(RACE_TIME);
    setChosen(null);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setTimeout(() => advance(null), 800);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function advance(ans: number | null) {
    clearInterval(timerRef.current!);
    const pts = ans === q.correct ? Math.ceil(timeLeft * (100 / RACE_TIME)) : 0;
    setTotalScore(s => s + pts);
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true);
      else setIdx(i => i + 1);
    }, 900);
  }

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i !== q.correct) { setShake(true); setTimeout(() => setShake(false), 500); }
    advance(i);
  }

  const maxScore = questions.length * 100;
  const pct = Math.round((totalScore / maxScore) * 100);
  const timerPct = (timeLeft / RACE_TIME) * 100;
  const timerColor = timerPct > 50 ? '#34d399' : timerPct > 25 ? '#fbbf24' : '#f87171';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#7c2d12,#9a3412)', maxHeight: '90vh' }}>

        <Header game={activeGame} onClose={onClose} extra={
          <span className="text-yellow-300 font-bold text-sm">⭐ {totalScore}</span>
        } />

        {done ? (
          <WinScreen
            xp={Math.max(Math.floor(activeGame.xp * pct / 100), 10)}
            label={pct >= 80 ? 'Чемпион гонки! 🏁' : pct >= 50 ? 'Хороший результат!' : 'В следующий раз быстрее!'}
            onFinish={() => onFinish(Math.max(Math.floor(activeGame.xp * pct / 100), 10))}
          />
        ) : (
          <div className="flex flex-col p-4 gap-4 flex-1">
            {/* Таймер-бар */}
            <div>
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>Вопрос {idx + 1} / {questions.length}</span>
                <span style={{ color: timerColor }} className="font-bold text-base">{timeLeft}с</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${timerPct}%`, background: timerColor, boxShadow: `0 0 8px ${timerColor}` }} />
              </div>
            </div>

            {/* Вопрос */}
            <div className={`rounded-xl p-4 text-center transition-all ${shake ? 'animate-pulse' : ''}`}
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="text-white font-bold text-base leading-snug">{q.question}</p>
            </div>

            {/* Варианты */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {q.options.map((opt, i) => {
                let bg = 'rgba(255,255,255,0.1)';
                let border = 'rgba(255,255,255,0.2)';
                if (chosen !== null) {
                  if (i === q.correct) { bg = 'rgba(52,211,153,0.3)'; border = '#34d399'; }
                  else if (i === chosen && i !== q.correct) { bg = 'rgba(248,113,113,0.3)'; border = '#f87171'; }
                }
                return (
                  <button key={i} onClick={() => pick(i)}
                    disabled={chosen !== null}
                    className="rounded-xl p-3 font-semibold text-sm text-white text-center border-2 transition-all hover:scale-105 active:scale-95"
                    style={{ background: bg, borderColor: border }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 🧩 ИГРА «ПАЗЛ» (puzzle)
// ─────────────────────────────────────────────
const GRID = 3; // 3×2 = 6 частей

export function PuzzleGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.puzzleRounds!;
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);

  const q = rounds[idx];
  // Какую ячейку открывать за этот вопрос
  const cellToReveal = idx; // 0..5

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === q.correct) {
      setFlash('correct');
      setRevealed(prev => [...prev, cellToReveal]);
      setTimeout(() => {
        setFlash(null);
        if (idx + 1 >= rounds.length) { setDone(true); return; }
        setIdx(n => n + 1);
        setChosen(null);
      }, 900);
    } else {
      setFlash('wrong');
      setErrors(e => e + 1);
      setTimeout(() => { setFlash(null); setChosen(null); }, 800);
    }
  }

  const xpEarned = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  // Рисуем пазл 3×2
  const cells = Array.from({ length: GRID * 2 }, (_, i) => i);
  const emojis = rounds.map(r => r.emoji);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#4c1d95,#5b21b6)', maxHeight: '90vh' }}>

        <Header game={activeGame} onClose={onClose} extra={
          <span className="text-white/70 text-xs">{revealed.length}/{rounds.length} открыто</span>
        } />

        {done ? (
          <WinScreen xp={xpEarned} label={errors === 0 ? 'Пазл собран! 🧩' : 'Картинка открыта!'} onFinish={() => onFinish(xpEarned)} />
        ) : (
          <div className="flex flex-col p-4 gap-4">
            {/* Пазл-сетка */}
            <div className="rounded-xl overflow-hidden border-2 border-white/20"
              style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
              {cells.map(i => {
                const isRevealed = revealed.includes(i);
                const emoji = emojis[i] ?? '🏆';
                return (
                  <div key={i}
                    className="aspect-square flex items-center justify-center text-3xl transition-all duration-500"
                    style={{
                      background: isRevealed ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.5)',
                      borderRight: i % GRID !== GRID - 1 ? '1px solid rgba(255,255,255,0.1)' : undefined,
                      borderBottom: i < GRID ? '1px solid rgba(255,255,255,0.1)' : undefined,
                      transform: isRevealed ? 'scale(1)' : 'scale(0.8)',
                      opacity: isRevealed ? 1 : 0.1,
                    }}
                  >
                    {isRevealed ? emoji : '?'}
                  </div>
                );
              })}
            </div>

            {/* Вопрос */}
            <div
              className="rounded-xl p-4 text-center border-2 transition-all"
              style={{
                background: flash === 'correct' ? 'rgba(52,211,153,0.2)' : flash === 'wrong' ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.08)',
                borderColor: flash === 'correct' ? '#34d399' : flash === 'wrong' ? '#f87171' : 'rgba(255,255,255,0.15)',
              }}
            >
              <p className="text-white/60 text-xs mb-1">Вопрос {idx + 1} / {rounds.length}</p>
              <p className="text-white font-bold text-sm leading-snug">{q.question}</p>
            </div>

            {/* Варианты */}
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, i) => {
                let bg = 'rgba(255,255,255,0.08)';
                let border = 'rgba(255,255,255,0.2)';
                if (chosen !== null) {
                  if (i === q.correct) { bg = 'rgba(52,211,153,0.25)'; border = '#34d399'; }
                  else if (i === chosen) { bg = 'rgba(248,113,113,0.25)'; border = '#f87171'; }
                }
                return (
                  <button key={i} onClick={() => pick(i)}
                    disabled={chosen !== null}
                    className="rounded-xl px-3 py-3 text-white text-sm font-semibold border-2 transition-all hover:scale-105 active:scale-95"
                    style={{ background: bg, borderColor: border }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// РОУТЕР
// ─────────────────────────────────────────────
export default function ArcadeGames({ activeGame, onClose, onFinish }: Props) {
  if (activeGame.type === 'catch')     return <CatchGame     activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'wordbuild') return <WordBuildGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'race')      return <RaceGame      activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'puzzle')    return <PuzzleGame    activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  return null;
}