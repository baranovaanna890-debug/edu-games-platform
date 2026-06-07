import { useState, useEffect, useRef } from 'react';
import type { Game } from '@/data/games';
import Icon from '@/components/ui/icon';

interface Props {
  activeGame: Game;
  onClose: () => void;
  onFinish: (xp: number) => void;
}

// ─── Общие ────────────────────────────────────────────
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      {children}
    </div>
  );
}

function ArcadeHeader({ game, onClose, right }: { game: Game; onClose: () => void; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xl">{game.emoji}</span>
        <span className="font-bold text-white text-sm leading-tight">{game.title}</span>
      </div>
      <div className="flex items-center gap-3">
        {right}
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={18} />
        </button>
      </div>
    </div>
  );
}

function WinScreen({ xp, title, sub, onFinish }: { xp: number; title: string; sub: string; onFinish: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div className={`flex flex-col items-center justify-center flex-1 p-8 text-center transition-all duration-500 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      <div className="text-7xl mb-3" style={{ animation: 'arcBounce 0.7s ease infinite alternate' }}>🏆</div>
      <div className="text-2xl font-bold text-white mb-1">{title}</div>
      <div className="text-white/60 text-sm mb-5">{sub}</div>
      <div className="flex items-center gap-2 px-6 py-3 rounded-2xl mb-6"
        style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)' }}>
        <span className="text-2xl">⚡</span>
        <span className="text-2xl font-bold text-yellow-300">+{xp} XP</span>
      </div>
      <button onClick={onFinish}
        className="px-8 py-3 rounded-xl font-bold text-gray-900 bg-white hover:scale-105 active:scale-95 transition-transform">
        К каталогу →
      </button>
    </div>
  );
}

// Частицы-конфетти при правильном ответе
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const dots = Array.from({ length: 16 }, (_, i) => i);
  const colors = ['#f59e0b', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {dots.map(i => (
        <div key={i} className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${10 + (i * 6) % 85}%`,
            top: '-8px',
            background: colors[i % colors.length],
            animation: `confettiFall ${0.6 + (i % 4) * 0.15}s ease ${(i % 5) * 0.06}s forwards`,
          }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// 🎯 ПОЙМАЙ ОТВЕТ (catch) — физика + bounce off walls
// ─────────────────────────────────────────────────────
interface Ball {
  id: number; label: string; correct: boolean;
  x: number; y: number; vx: number; vy: number;
  state: 'alive' | 'caught' | 'missed';
  color: string; scale: number;
}

export function CatchGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.catchRounds!;
  const [roundIdx, setRoundIdx] = useState(0);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [roundTransition, setRoundTransition] = useState(false);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const animRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);
  const doneRef = useRef(false);
  const idCounter = useRef(0);

  const CORRECT_COLORS = ['#34d399', '#4ade80'];
  const WRONG_COLORS = ['#f87171', '#fb923c', '#f472b6'];

  function initRound(rIdx: number) {
    const round = rounds[rIdx];
    const spawned: Ball[] = round.items.map(it => {
      idCounter.current++;
      return {
        id: idCounter.current,
        label: it.label, correct: it.correct,
        x: 5 + Math.random() * 80,
        y: -20 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 1.4,
        vy: 0.6 + Math.random() * 0.8,
        state: 'alive',
        color: it.correct ? CORRECT_COLORS[Math.floor(Math.random() * 2)] : WRONG_COLORS[Math.floor(Math.random() * 3)],
        scale: 1,
      };
    });
    ballsRef.current = spawned;
    setBalls(spawned);
    doneRef.current = false;
  }

  useEffect(() => { initRound(0); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(now - last, 50); last = now;
      ballsRef.current = ballsRef.current.map(b => {
        if (b.state !== 'alive') return b;
        let nx = b.x + b.vx * dt * 0.06;
        const ny = b.y + b.vy * dt * 0.06;
        let nvx = b.vx;
        // bounce off walls
        if (nx < 2) { nx = 2; nvx = Math.abs(nvx); }
        if (nx > 88) { nx = 88; nvx = -Math.abs(nvx); }
        const missed = ny > 108;
        return { ...b, x: nx, y: ny, vx: nvx, state: missed ? 'missed' : 'alive' };
      });
      setBalls([...ballsRef.current]);

      // check round end
      if (!doneRef.current) {
        const alive = ballsRef.current.filter(b => b.state === 'alive').length;
        const allHandled = ballsRef.current.every(b => b.state !== 'alive');
        if (alive === 0 && allHandled && ballsRef.current.length > 0) {
          doneRef.current = true;
          setTimeout(() => advanceRound(), 600);
        }
      }
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [roundIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  function advanceRound() {
    setRoundIdx(prev => {
      const next = prev + 1;
      if (next >= rounds.length) { setDone(true); return prev; }
      setRoundTransition(true);
      setTimeout(() => { setRoundTransition(false); initRound(next); }, 400);
      return next;
    });
  }

  function tap(id: number) {
    ballsRef.current = ballsRef.current.map(b => {
      if (b.id !== id || b.state !== 'alive') return b;
      if (!b.correct) setMistakes(m => m + 1);
      else { setConfetti(true); setTimeout(() => setConfetti(false), 700); }
      return { ...b, state: 'caught', scale: 1.5 };
    });
    setBalls([...ballsRef.current]);
  }

  const round = rounds[Math.min(roundIdx, rounds.length - 1)];
  const caughtOk = balls.filter(b => b.caught && b.correct).length;
  const totalOk = round.items.filter(i => i.correct).length;
  const xp = mistakes === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <Overlay>
      <div className="w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#1e1b4b 0%,#312e81 100%)', height: '90vh', maxHeight: 600 }}>
        <ArcadeHeader game={activeGame} onClose={onClose}
          right={<span className="text-red-300 text-xs font-bold">❌ {mistakes}</span>} />

        {done ? (
          <WinScreen xp={xp}
            title={mistakes === 0 ? '🎯 Идеальный улов!' : 'Раунды пройдены!'}
            sub={`Поймано верных: всё. Ошибок: ${mistakes}`}
            onFinish={() => onFinish(xp)} />
        ) : (
          <div className={`flex flex-col flex-1 transition-opacity duration-300 ${roundTransition ? 'opacity-0' : 'opacity-100'}`}>
            <div className="px-4 py-2 text-center flex-shrink-0">
              <p className="text-white font-bold text-sm">{round.question}</p>
              <p className="text-white/40 text-xs">Раунд {roundIdx + 1}/{rounds.length} · поймано {caughtOk}/{totalOk}</p>
            </div>

            <div className="relative flex-1 mx-3 mb-3 rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Confetti active={confetti} />

              {/* Звёзды-фон */}
              {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white/10"
                  style={{ width: 2, height: 2, left: `${(i * 5.1) % 95}%`, top: `${(i * 7.3) % 90}%` }} />
              ))}

              {balls.map(b => (
                b.state === 'missed' ? null :
                <button key={b.id} onClick={() => tap(b.id)}
                  disabled={b.state === 'caught'}
                  className="absolute rounded-full px-3 py-1.5 text-xs font-bold text-gray-900 select-none border-2 border-white/30"
                  style={{
                    left: `${b.x}%`, top: `${b.y}%`,
                    background: b.color,
                    transform: `scale(${b.state === 'caught' ? 0 : 1})`,
                    opacity: b.state === 'caught' ? 0 : 1,
                    transition: b.state === 'caught' ? 'all 0.25s ease' : 'none',
                    boxShadow: `0 0 16px ${b.color}99`,
                    whiteSpace: 'nowrap',
                  }}>
                  {b.label}
                </button>
              ))}

              <div className="absolute bottom-2 left-0 right-0 text-center text-white/20 text-xs pointer-events-none">
                🟢 верное · 🔴 неверное
              </div>
            </div>
          </div>
        )}
      </div>
      <GameStyles />
    </Overlay>
  );
}

// ─────────────────────────────────────────────────────
// 🔤 СОБЕРИ СЛОВО (wordbuild) — анимация разлёта/сборки
// ─────────────────────────────────────────────────────
export function WordBuildGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.wordBuildRounds!;
  const [idx, setIdx] = useState(0);
  const [tiles, setTiles] = useState<{ id: number; char: string; picked: boolean; shake: boolean }[]>([]);
  const [built, setBuilt] = useState<{ id: number; char: string }[]>([]);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [entering, setEntering] = useState(true);

  const round = rounds[idx];

  function mkTiles(word: string) {
    const upper = word.toUpperCase();
    const latin = /^[A-Z]+$/.test(upper);
    const pool = latin
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c => !upper.includes(c))
      : 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ'.split('').filter(c => !upper.includes(c));
    const noise = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(5, upper.length));
    const all = [...upper.split(''), ...noise].sort(() => Math.random() - 0.5);
    return all.map((char, i) => ({ id: i, char, picked: false, shake: false }));
  }

  useEffect(() => {
    setEntering(true);
    setTiles(mkTiles(round.word));
    setBuilt([]);
    setFlash(null);
    const t = setTimeout(() => setEntering(false), 50);
    return () => clearTimeout(t);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  function pick(tile: { id: number; char: string; picked: boolean; shake: boolean }) {
    if (tile.picked || flash === 'correct') return;
    const newBuilt = [...built, { id: tile.id, char: tile.char }];
    setBuilt(newBuilt);
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, picked: true } : t));

    const target = round.word.toUpperCase();
    if (newBuilt.length === target.length) {
      const word = newBuilt.map(b => b.char).join('');
      if (word === target) {
        setFlash('correct');
        setConfetti(true);
        setTimeout(() => setConfetti(false), 800);
        setTimeout(() => {
          if (idx + 1 >= rounds.length) setDone(true);
          else { setIdx(i => i + 1); }
        }, 1000);
      } else {
        setFlash('wrong');
        setErrors(e => e + 1);
        setTiles(prev => prev.map(t => ({ ...t, shake: true })));
        setTimeout(() => {
          setTiles(prev => prev.map(t => ({ ...t, picked: false, shake: false })));
          setBuilt([]);
          setFlash(null);
        }, 700);
      }
    }
  }

  function unpick(id: number) {
    if (flash === 'correct') return;
    setBuilt(prev => prev.filter(b => b.id !== id));
    setTiles(prev => prev.map(t => t.id === id ? { ...t, picked: false } : t));
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <Overlay>
      <div className="w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#052e16 0%,#064e3b 100%)', maxHeight: '90vh' }}>
        <ArcadeHeader game={activeGame} onClose={onClose}
          right={<span className="text-red-300 text-xs">❌ {errors}</span>} />

        {done ? (
          <WinScreen xp={xp} title="📖 Словарный мастер!" sub={`Все слова собраны! Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
        ) : (
          <div className={`flex flex-col p-4 gap-3 transition-opacity duration-300 ${entering ? 'opacity-0' : 'opacity-100'}`}>
            {/* Прогресс */}
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-xs">Слово {idx + 1} / {rounds.length}</span>
              <div className="flex gap-1">
                {rounds.map((_, i) => (
                  <div key={i} className="w-5 h-1.5 rounded-full transition-all"
                    style={{ background: i < idx ? '#34d399' : i === idx ? '#fff' : 'rgba(255,255,255,0.15)' }} />
                ))}
              </div>
            </div>

            {/* Подсказка */}
            <div className="rounded-xl px-4 py-3 text-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <p className="text-yellow-300 text-xs font-semibold mb-0.5">💡 Подсказка</p>
              <p className="text-white font-bold text-sm">{round.clue}</p>
            </div>

            {/* Сборочная зона */}
            <div className="relative min-h-[56px] rounded-xl px-3 py-2 flex flex-wrap gap-1.5 items-center justify-center border-2 transition-all duration-300"
              style={{
                borderColor: flash === 'correct' ? '#34d399' : flash === 'wrong' ? '#f87171' : 'rgba(255,255,255,0.15)',
                background: flash === 'correct' ? 'rgba(52,211,153,0.15)' : flash === 'wrong' ? 'rgba(248,113,113,0.15)' : 'rgba(0,0,0,0.25)',
              }}>
              <Confetti active={confetti} />
              {built.length === 0
                ? <span className="text-white/25 text-xs">кликай буквы снизу →</span>
                : built.map((b, i) => (
                  <button key={i} onClick={() => unpick(b.id)}
                    className="w-9 h-9 rounded-lg font-bold text-sm text-emerald-900 bg-emerald-200 hover:bg-emerald-100 transition-all hover:scale-110 active:scale-90"
                    style={{ animation: `tileIn 0.2s ease both` }}>
                    {b.char}
                  </button>
                ))}
            </div>

            {/* Буквы */}
            <div className="rounded-xl p-3 flex flex-wrap gap-2 justify-center"
              style={{ background: 'rgba(0,0,0,0.2)' }}>
              {tiles.map((t, i) => (
                <button key={t.id} onClick={() => pick(t)}
                  disabled={t.picked}
                  className="w-10 h-10 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: t.picked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                    color: t.picked ? 'transparent' : '#064e3b',
                    transform: t.shake ? 'translateX(4px)' : t.picked ? 'scale(0.75)' : 'scale(1)',
                    opacity: t.picked ? 0.3 : 1,
                    animation: `tileIn 0.25s ease ${i * 40}ms both`,
                  }}>
                  {t.picked ? '' : t.char}
                </button>
              ))}
            </div>

            <button onClick={() => { setTiles(ts => ts.map(t => ({ ...t, picked: false }))); setBuilt([]); setFlash(null); }}
              className="text-center text-white/30 text-xs hover:text-white/60 transition-colors">
              ↺ Сбросить
            </button>
          </div>
        )}
      </div>
      <GameStyles />
    </Overlay>
  );
}

// ─────────────────────────────────────────────────────
// ⚡ ГОНКА ЗНАНИЙ (race) — таймер-дуга + очки
// ─────────────────────────────────────────────────────
const RACE_SEC = 10;

export function RaceGame({ activeGame, onClose, onFinish }: Props) {
  const qs = activeGame.raceQuestions!;
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RACE_SEC);
  const [chosen, setChosen] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [entering, setEntering] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockedRef = useRef(false);

  const q = qs[idx];

  function startTimer() {
    lockedRef.current = false;
    setTimeLeft(RACE_SEC);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (!lockedRef.current) { lockedRef.current = true; handleTimeout(); }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleTimeout() {
    setFlash('bad');
    setChosen(-1);
    setTimeout(() => nextQ(0), 1000);
  }

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current!);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  function pick(i: number) {
    if (chosen !== null || lockedRef.current) return;
    lockedRef.current = true;
    clearInterval(timerRef.current!);
    setChosen(i);
    const pts = i === q.correct ? Math.max(10, Math.ceil(timeLeft * (100 / RACE_SEC))) : 0;
    if (i === q.correct) { setFlash('ok'); setConfetti(true); setTimeout(() => setConfetti(false), 700); }
    else setFlash('bad');
    setTotalScore(s => s + pts);
    setTimeout(() => nextQ(pts), 950);
  }

  function nextQ(_pts: number) {
    setFlash(null); setChosen(null); setEntering(true);
    setTimeout(() => {
      setEntering(false);
      if (idx + 1 >= qs.length) setDone(true);
      else setIdx(i => i + 1);
    }, 200);
  }

  const maxScore = qs.length * 100;
  const pct = Math.round((totalScore / maxScore) * 100);
  const xp = Math.max(Math.floor(activeGame.xp * Math.max(pct, 10) / 100), 10);
  const timerPct = timeLeft / RACE_SEC;
  const timerColor = timerPct > 0.5 ? '#34d399' : timerPct > 0.25 ? '#fbbf24' : '#f87171';

  // SVG дуга-таймер
  const r = 28; const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - timerPct);

  return (
    <Overlay>
      <div className="w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#431407 0%,#7c2d12 100%)', maxHeight: '90vh' }}>
        <ArcadeHeader game={activeGame} onClose={onClose}
          right={<span className="text-yellow-300 font-bold">⭐ {totalScore}</span>} />

        {done ? (
          <WinScreen xp={xp}
            title={pct >= 80 ? '🏁 Чемпион гонки!' : pct >= 50 ? '👏 Хороший результат!' : '💪 В следующий раз быстрее!'}
            sub={`Результат: ${pct}% · Очки: ${totalScore}/${maxScore}`}
            onFinish={() => onFinish(xp)} />
        ) : (
          <div className={`flex flex-col p-4 gap-4 transition-opacity duration-200 ${entering ? 'opacity-0' : 'opacity-100'}`}>
            {/* Верхняя панель: прогресс + таймер */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {qs.map((_, i) => (
                  <div key={i} className="h-1.5 w-6 rounded-full transition-all"
                    style={{ background: i < idx ? '#34d399' : i === idx ? '#fff' : 'rgba(255,255,255,0.15)' }} />
                ))}
              </div>
              {/* Круговой таймер SVG */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" width="64" height="64">
                  <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                  <circle cx="32" cy="32" r={r} fill="none" stroke={timerColor}
                    strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }} />
                </svg>
                <span className="text-xl font-bold" style={{ color: timerColor }}>{timeLeft}</span>
              </div>
            </div>

            {/* Вопрос */}
            <div className="relative rounded-2xl p-5 text-center overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Confetti active={confetti} />
              <p className="text-white/50 text-xs mb-1">Вопрос {idx + 1} / {qs.length}</p>
              <p className="text-white font-bold text-base leading-snug">{q.question}</p>
            </div>

            {/* Варианты */}
            <div className="grid grid-cols-2 gap-2.5">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct;
                const isChosen = i === chosen;
                let bg = 'rgba(255,255,255,0.08)';
                let border = 'rgba(255,255,255,0.15)';
                const textColor = 'white';
                if (chosen !== null) {
                  if (isCorrect) { bg = 'rgba(52,211,153,0.25)'; border = '#34d399'; }
                  else if (isChosen) { bg = 'rgba(248,113,113,0.25)'; border = '#f87171'; }
                }
                const shake = flash === 'bad' && isChosen;
                return (
                  <button key={i} onClick={() => pick(i)} disabled={chosen !== null}
                    className="rounded-xl p-3 font-semibold text-sm text-center border-2 transition-all hover:scale-105 active:scale-95 disabled:cursor-default"
                    style={{ background: bg, borderColor: border, color: textColor, animation: shake ? 'shakeX 0.4s ease' : undefined }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <GameStyles />
    </Overlay>
  );
}

// ─────────────────────────────────────────────────────
// 🧩 ПАЗЛ (puzzle) — сетка открывается по кускам
// ─────────────────────────────────────────────────────
export function PuzzleGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.puzzleRounds!;
  const COLS = 3;
  const ROWS = Math.ceil(rounds.length / COLS);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const [confetti, setConfetti] = useState(false);

  const q = rounds[idx];

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === q.correct) {
      setFlash('ok');
      setConfetti(true); setTimeout(() => setConfetti(false), 700);
      const newRev = new Set(revealed); newRev.add(idx);
      setRevealed(newRev);
      setTimeout(() => {
        setFlash(null); setChosen(null);
        if (idx + 1 >= rounds.length) setDone(true);
        else setIdx(n => n + 1);
      }, 900);
    } else {
      setFlash('bad');
      setErrors(e => e + 1);
      setTimeout(() => { setFlash(null); setChosen(null); }, 800);
    }
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <Overlay>
      <div className="w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#2e1065 0%,#4c1d95 100%)', maxHeight: '90vh' }}>
        <ArcadeHeader game={activeGame} onClose={onClose}
          right={<span className="text-white/50 text-xs">{revealed.size}/{rounds.length} 🧩</span>} />

        {done ? (
          <WinScreen xp={xp} title="🧩 Пазл собран!" sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
        ) : (
          <div className="flex flex-col p-4 gap-3">
            {/* Пазл-сетка */}
            <div className="relative rounded-xl overflow-hidden border border-white/10"
              style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              <Confetti active={confetti} />
              {rounds.map((r, i) => {
                const isRev = revealed.has(i);
                const isCur = i === idx;
                return (
                  <div key={i}
                    className="aspect-square flex items-center justify-center text-3xl border border-white/10 transition-all duration-500"
                    style={{
                      background: isRev ? 'rgba(167,139,250,0.25)' : isCur ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.4)',
                      transform: isRev ? 'scale(1)' : 'scale(0.85)',
                      opacity: isRev ? 1 : isCur ? 0.5 : 0.2,
                    }}>
                    {isRev ? r.emoji : isCur ? '❓' : '⬛'}
                  </div>
                );
              })}
            </div>

            {/* Вопрос */}
            <div className="relative rounded-xl p-4 text-center border-2 transition-all overflow-hidden"
              style={{
                background: flash === 'ok' ? 'rgba(52,211,153,0.18)' : flash === 'bad' ? 'rgba(248,113,113,0.18)' : 'rgba(255,255,255,0.07)',
                borderColor: flash === 'ok' ? '#34d399' : flash === 'bad' ? '#f87171' : 'rgba(255,255,255,0.12)',
              }}>
              <p className="text-white/50 text-xs mb-1">Вопрос {idx + 1} / {rounds.length}</p>
              <p className="text-white font-bold text-sm leading-snug">{q.question}</p>
            </div>

            {/* Варианты */}
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, i) => {
                let bg = 'rgba(255,255,255,0.07)'; let border = 'rgba(255,255,255,0.12)';
                if (chosen !== null) {
                  if (i === q.correct) { bg = 'rgba(52,211,153,0.25)'; border = '#34d399'; }
                  else if (i === chosen) { bg = 'rgba(248,113,113,0.25)'; border = '#f87171'; }
                }
                return (
                  <button key={i} onClick={() => pick(i)} disabled={chosen !== null}
                    className="rounded-xl px-3 py-3 text-white text-sm font-semibold border-2 transition-all hover:scale-105 active:scale-95 disabled:cursor-default"
                    style={{ background: bg, borderColor: border }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <GameStyles />
    </Overlay>
  );
}

// ─── CSS анимации ──────────────────────────────────────
function GameStyles() {
  return (
    <style>{`
      @keyframes arcBounce { from{transform:translateY(0) rotate(-3deg)} to{transform:translateY(-14px) rotate(3deg)} }
      @keyframes tileIn { from{opacity:0;transform:scale(0.4) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0)} }
      @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(320px) rotate(720deg);opacity:0} }
      @keyframes shakeX { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    `}</style>
  );
}

// ─── Роутер ────────────────────────────────────────────
export default function ArcadeGames({ activeGame, onClose, onFinish }: Props) {
  if (activeGame.type === 'catch')     return <CatchGame     activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'wordbuild') return <WordBuildGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'race')      return <RaceGame      activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'puzzle')    return <PuzzleGame    activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  return null;
}