import { useState, useEffect, useRef } from 'react';
import type { Game } from '@/data/games';
import Icon from '@/components/ui/icon';

interface Props {
  activeGame: Game;
  onClose: () => void;
  onFinish: (xp: number) => void;
}

// ════════════════════════════════════════════════════════
// SHARED HEROES UNIVERSE
// ════════════════════════════════════════════════════════
export const HEROES = {
  prof:    { name: 'Профессор Байт',  avatar: '🧑‍🏫', color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
  captain: { name: 'Капитан Код',     avatar: '🧑‍🚀', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  doctor:  { name: 'Доктор Дата',     avatar: '🧑‍🔬', color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
  robot:   { name: 'Робот Алго',      avatar: '🤖',    color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  wizard:  { name: 'Маг Алгоритм',    avatar: '🧙',    color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};
type HeroKey = keyof typeof HEROES;

// Пузырь диалога героя
function HeroBubble({ heroKey, text, side = 'right', small = false }: {
  heroKey: HeroKey; text: string; side?: 'left' | 'right'; small?: boolean;
}) {
  const h = HEROES[heroKey];
  return (
    <div className={`flex items-end gap-2 ${side === 'right' ? 'flex-row' : 'flex-row-reverse'}`}
      style={{ animation: 'bubbleIn 0.4s cubic-bezier(.34,1.56,.64,1) both' }}>
      <div className={`${small ? 'text-3xl' : 'text-4xl'} flex-shrink-0`}
        style={{ animation: 'heroFloat 2.5s ease infinite alternate' }}>
        {h.avatar}
      </div>
      <div className="relative max-w-[80%]">
        <div className={`${small ? 'text-xs' : 'text-sm'} font-semibold mb-0.5`} style={{ color: h.color }}>
          {h.name}
        </div>
        <div className={`${small ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} rounded-2xl leading-relaxed`}
          style={{ background: h.bg, border: `1px solid ${h.color}33`, color: 'rgba(255,255,255,0.9)' }}>
          {text}
        </div>
      </div>
    </div>
  );
}

// Общий интро-экран с героем
function HeroIntro({ heroKey, title, subtitle, task, btnLabel, onStart, accent }: {
  heroKey: HeroKey; title: string; subtitle: string; task: string;
  btnLabel: string; onStart: () => void; accent?: string;
}) {
  const h = HEROES[heroKey];
  const col = accent ?? h.color;
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-5 text-center gap-4"
      style={{ animation: 'fadeSlideIn 0.4s ease both' }}>
      <div className="text-6xl" style={{ animation: 'heroFloat 2s ease infinite alternate' }}>{h.avatar}</div>
      <div>
        <div className="text-xs font-bold mb-0.5" style={{ color: col }}>{h.name}</div>
        <div className="text-white font-bold text-lg">{title}</div>
        <div className="text-white/50 text-xs mt-0.5">{subtitle}</div>
      </div>
      <div className="rounded-2xl px-5 py-3 text-white text-sm leading-relaxed max-w-xs"
        style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${col}33` }}>
        {task}
      </div>
      <button onClick={onStart}
        className="px-8 py-3 rounded-xl font-bold text-gray-900 text-base hover:scale-105 active:scale-95 transition-transform"
        style={{ background: col, boxShadow: `0 0 24px ${col}55` }}>
        {btnLabel}
      </button>
    </div>
  );
}

// Победный экран с анимированным героем
function WinScreen({ xp, title, sub, heroKey, onFinish }: {
  xp: number; title: string; sub: string; heroKey?: HeroKey; onFinish: () => void;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, []);
  const h = heroKey ? HEROES[heroKey] : null;
  return (
    <div className={`flex flex-col items-center justify-center flex-1 p-8 text-center gap-3 transition-all duration-500 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      {h && (
        <div className="text-6xl" style={{ animation: 'winDance 0.6s ease infinite alternate' }}>{h.avatar}</div>
      )}
      <div className="text-6xl" style={{ animation: 'arcBounce 0.7s ease infinite alternate' }}>🏆</div>
      <div className="text-2xl font-bold text-white">{title}</div>
      <div className="text-white/50 text-sm">{sub}</div>
      {h && (
        <div className="text-xs italic px-4 py-2 rounded-xl" style={{ color: h.color, background: h.bg }}>
          "{h.name} гордится тобой!"
        </div>
      )}
      <div className="flex items-center gap-2 px-6 py-3 rounded-2xl mt-1"
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

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' }}>
      {children}
    </div>
  );
}

function ArcadeHeader({ game, onClose, right }: { game: Game; onClose: () => void; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xl">{game.emoji}</span>
        <span className="font-bold text-white text-sm">{game.title}</span>
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

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#f59e0b', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
      {Array.from({ length: 22 }, (_, i) => (
        <div key={i} className="absolute rounded-sm"
          style={{
            width: 7, height: 7,
            left: `${5 + (i * 4.4) % 90}%`, top: '-8px',
            background: colors[i % colors.length],
            animation: `confettiFall ${0.5 + (i % 5) * 0.12}s ease ${(i % 7) * 0.05}s forwards`,
            transform: `rotate(${i * 37}deg)`,
          }} />
      ))}
    </div>
  );
}

// Обратный отсчёт
function Countdown({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <div className="text-white/40 text-lg">приготовься...</div>
      <div key={count}
        className="font-bold"
        style={{
          fontSize: count === 0 ? '72px' : '96px',
          color: count === 1 ? '#f87171' : count === 2 ? '#fbbf24' : '#34d399',
          animation: 'countPop 0.55s cubic-bezier(.34,1.56,.64,1) both',
          textShadow: `0 0 50px currentColor`,
          lineHeight: 1,
        }}>
        {count === 0 ? 'GO!' : count}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🎯 ПОЙМАЙ ОТВЕТ (catch)
// ════════════════════════════════════════════════════════
interface Ball {
  id: number; label: string; correct: boolean;
  x: number; y: number; vx: number; vy: number;
  state: 'alive' | 'caught' | 'missed';
  color: string; popAnim: boolean;
}

const CATCH_HEROES: { key: HeroKey; phrase: (q: string) => string }[] = [
  { key: 'prof',    phrase: q => `Внимание, студент! ${q}` },
  { key: 'captain', phrase: q => `Задание с орбиты: ${q}` },
  { key: 'doctor',  phrase: q => `Анализирую данные... ${q}` },
];

type CatchPhase = 'intro' | 'countdown' | 'play' | 'roundend';

export function CatchGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.catchRounds!;
  const [roundIdx, setRoundIdx] = useState(0);
  const [phase, setPhase] = useState<CatchPhase>('intro');
  const [countdown, setCountdown] = useState(3);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [caughtOkCount, setCaughtOkCount] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [lastCaught, setLastCaught] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);
  const doneRef = useRef(false);
  const idRef = useRef(0);

  const CORRECT_COLORS = ['#34d399', '#4ade80', '#a3e635'];
  const WRONG_COLORS   = ['#f87171', '#fb923c', '#f472b6'];
  const heroData = CATCH_HEROES[roundIdx % CATCH_HEROES.length];
  const hero = HEROES[heroData.key];

  function startCountdown() { setPhase('countdown'); setCountdown(3); }

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) { spawnBalls(roundIdx); setPhase('play'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 900);
    return () => clearTimeout(t);
  }, [phase, countdown]); // eslint-disable-line

  function spawnBalls(rIdx: number) {
    const round = rounds[rIdx];
    const spawned: Ball[] = round.items.map(it => {
      idRef.current++;
      return {
        id: idRef.current, label: it.label, correct: it.correct,
        x: 8 + Math.random() * 76, y: -12 - Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.18 + Math.random() * 0.16,
        state: 'alive',
        color: it.correct ? CORRECT_COLORS[Math.floor(Math.random() * 3)] : WRONG_COLORS[Math.floor(Math.random() * 3)],
        popAnim: false,
      };
    });
    ballsRef.current = spawned; setBalls(spawned); doneRef.current = false; setCaughtOkCount(0);
  }

  useEffect(() => {
    if (phase !== 'play') return;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min(now - last, 40); last = now;
      let anyAlive = false;
      ballsRef.current = ballsRef.current.map(b => {
        if (b.state !== 'alive') return b;
        let nx = b.x + b.vx * dt * 0.06;
        const ny = b.y + b.vy * dt * 0.06;
        let nvx = b.vx;
        if (nx < 3)  { nx = 3;  nvx =  Math.abs(nvx); }
        if (nx > 87) { nx = 87; nvx = -Math.abs(nvx); }
        if (ny > 108) return { ...b, state: 'missed' as const };
        anyAlive = true;
        return { ...b, x: nx, y: ny, vx: nvx };
      });
      setBalls([...ballsRef.current]);
      if (!doneRef.current) {
        const stillAlive = ballsRef.current.some(b => b.state === 'alive');
        if (!stillAlive && ballsRef.current.length > 0) {
          doneRef.current = true;
          setTimeout(() => endRound(), 500);
        }
      }
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, roundIdx]); // eslint-disable-line

  function endRound() {
    if (roundIdx + 1 >= rounds.length) { setDone(true); return; }
    setPhase('roundend');
    setTimeout(() => { setRoundIdx(i => i + 1); setPhase('intro'); }, 1400);
  }

  function tap(id: number) {
    let label = ''; let wasCorrect = false;
    ballsRef.current = ballsRef.current.map(b => {
      if (b.id !== id || b.state !== 'alive') return b;
      label = b.label; wasCorrect = b.correct;
      return { ...b, state: 'caught' as const, popAnim: true };
    });
    setBalls([...ballsRef.current]);
    setLastCaught(label); setTimeout(() => setLastCaught(null), 900);
    if (wasCorrect) { setConfetti(true); setTimeout(() => setConfetti(false), 800); setCaughtOkCount(c => c + 1); }
    else setMistakes(m => m + 1);
  }

  const round = rounds[Math.min(roundIdx, rounds.length - 1)];
  const totalOk = round.items.filter(i => i.correct).length;
  const xp = mistakes === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <Overlay>
      <div className="w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#0f172a 0%,#1e1b4b 60%,#312e81 100%)', height: '92vh', maxHeight: 620 }}>
        <ArcadeHeader game={activeGame} onClose={onClose} right={
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Раунд {roundIdx + 1}/{rounds.length}</span>
            <span className="text-red-300 text-xs font-bold">❌ {mistakes}</span>
          </div>
        } />

        {done ? (
          <WinScreen xp={xp} heroKey={heroData.key}
            title={mistakes === 0 ? '🎯 Мастер-ловец!' : 'Раунды пройдены!'}
            sub={`Ошибок: ${mistakes}`} onFinish={() => onFinish(xp)} />

        ) : phase === 'intro' ? (
          <HeroIntro heroKey={heroData.key}
            title="Поймай верные ответы!"
            subtitle={`Раунд ${roundIdx + 1} из ${rounds.length}`}
            task={heroData.phrase(round.question)}
            btnLabel="🎯 Готов ловить!" onStart={startCountdown}
            accent={hero.color} />

        ) : phase === 'countdown' ? (
          <Countdown count={countdown} />

        ) : phase === 'roundend' ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-6 gap-3"
            style={{ animation: 'fadeSlideIn 0.3s ease both' }}>
            <div className="text-5xl" style={{ animation: 'winDance 0.8s ease infinite alternate' }}>{hero.avatar}</div>
            <div className="text-white font-bold text-lg">Раунд завершён!</div>
            <div className="text-sm px-4 py-2 rounded-xl" style={{ color: hero.color, background: hero.bg }}>
              Отличная работа! Следующий раунд...
            </div>
          </div>

        ) : (
          <div className="flex flex-col flex-1">
            <div className="px-4 pt-2 pb-1 text-center flex-shrink-0">
              <p className="text-white font-bold text-sm">{round.question}</p>
              <p className="text-white/40 text-xs">поймано {caughtOkCount}/{totalOk} верных</p>
            </div>
            <div className="relative flex-1 mx-3 mb-3 rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${hero.color}22` }}>
              <Confetti active={confetti} />
              {[...Array(24)].map((_, i) => (
                <div key={i} className="absolute rounded-full"
                  style={{ width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2,
                    left: `${(i * 4.2) % 97}%`, top: `${(i * 3.9 + 5) % 94}%`,
                    background: 'white', opacity: 0.06 + (i % 5) * 0.03 }} />
              ))}
              <div className="absolute bottom-3 left-1/2 pointer-events-none z-10"
                style={{ transform: 'translateX(-50%)', animation: 'heroIdle 1.8s ease infinite alternate' }}>
                <div className="text-3xl">{hero.avatar}</div>
              </div>
              {lastCaught && (
                <div className="absolute top-1/3 left-1/2 z-20 pointer-events-none"
                  style={{ transform: 'translate(-50%,-50%)', animation: 'catchPop 0.8s ease both' }}>
                  <span className="text-xl font-bold text-white bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
                    ✓ {lastCaught}
                  </span>
                </div>
              )}
              {balls.map(b => b.state === 'missed' ? null : (
                <button key={b.id} onClick={() => tap(b.id)} disabled={b.state === 'caught'}
                  className="absolute select-none font-bold text-gray-900 border-2 border-white/40"
                  style={{
                    left: `${b.x}%`, top: `${b.y}%`, padding: '5px 10px', borderRadius: '999px', fontSize: '11px',
                    background: b.color,
                    transform: b.state === 'caught' ? 'scale(0) translateY(-20px)' : 'scale(1)',
                    opacity: b.state === 'caught' ? 0 : 1,
                    transition: b.state === 'caught' ? 'all 0.3s ease' : 'none',
                    boxShadow: `0 0 18px ${b.color}bb`,
                    whiteSpace: 'nowrap', zIndex: 5,
                  }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <ArcadeStyles />
    </Overlay>
  );
}

// ════════════════════════════════════════════════════════
// 🔤 СОБЕРИ СЛОВО (wordbuild)
// ════════════════════════════════════════════════════════
const WORD_HEROES: { key: HeroKey; intro: string; correct: string; wrong: string }[] = [
  { key: 'wizard',  intro: 'Заклинание рассыпалось на буквы! Собери слово!',       correct: 'Магия слова! ✨',       wrong: 'Не то заклинание, попробуй ещё!' },
  { key: 'robot',   intro: 'Данные перемешались. Восстанови термин.',              correct: 'Данные восстановлены!',  wrong: 'Ошибка! Перезапуск...' },
  { key: 'prof',    intro: 'Задание на сегодня: собери правильный термин.',        correct: 'Отлично! Зачтено!',      wrong: 'Пересдача! Пробуй снова.' },
];

type WordPhase = 'intro' | 'play';

export function WordBuildGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.wordBuildRounds!;
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<WordPhase>('intro');
  const [tiles, setTiles] = useState<{ id: number; char: string; picked: boolean; shake: boolean }[]>([]);
  const [built, setBuilt] = useState<{ id: number; char: string }[]>([]);
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');

  const heroData = WORD_HEROES[idx % WORD_HEROES.length];
  const hero = HEROES[heroData.key];
  const round = rounds[idx];

  function mkTiles(word: string) {
    const upper = word.toUpperCase();
    const latin = /^[A-Z]+$/.test(upper);
    const pool = (latin
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      : 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ').split('').filter(c => !upper.includes(c));
    const noise = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(5, upper.length));
    return [...upper.split(''), ...noise].sort(() => Math.random() - 0.5)
      .map((char, i) => ({ id: i, char, picked: false, shake: false }));
  }

  useEffect(() => {
    setTiles(mkTiles(round.word));
    setBuilt([]); setFlash(null); setHeroMsg('');
  }, [idx]); // eslint-disable-line

  function pick(tile: { id: number; char: string; picked: boolean; shake: boolean }) {
    if (tile.picked || flash === 'correct') return;
    const newBuilt = [...built, { id: tile.id, char: tile.char }];
    setBuilt(newBuilt);
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, picked: true } : t));
    const target = round.word.toUpperCase();
    if (newBuilt.length === target.length) {
      const word = newBuilt.map(b => b.char).join('');
      if (word === target) {
        setFlash('correct'); setConfetti(true); setTimeout(() => setConfetti(false), 800);
        setHeroMsg(heroData.correct);
        setTimeout(() => {
          if (idx + 1 >= rounds.length) setDone(true); else setIdx(i => i + 1);
        }, 1100);
      } else {
        setFlash('wrong'); setErrors(e => e + 1);
        setHeroMsg(heroData.wrong);
        setTiles(prev => prev.map(t => ({ ...t, shake: true })));
        setTimeout(() => {
          setTiles(prev => prev.map(t => ({ ...t, picked: false, shake: false })));
          setBuilt([]); setFlash(null); setHeroMsg('');
        }, 800);
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
          <WinScreen xp={xp} heroKey={heroData.key}
            title="📖 Словарный мастер!"
            sub={`Все слова собраны! Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />

        ) : phase === 'intro' ? (
          <HeroIntro heroKey={heroData.key}
            title="Собери слово!"
            subtitle="Кликай буквы в правильном порядке"
            task={heroData.intro}
            btnLabel="🔤 Начинаем!" onStart={() => setPhase('play')}
            accent={hero.color} />

        ) : (
          <div className="flex flex-col p-4 gap-3 overflow-hidden">
            {/* Прогресс */}
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-xs">Слово {idx + 1}/{rounds.length}</span>
              <div className="flex gap-1">
                {rounds.map((_, i) => (
                  <div key={i} className="w-5 h-1.5 rounded-full transition-all"
                    style={{ background: i < idx ? '#34d399' : i === idx ? '#fff' : 'rgba(255,255,255,0.15)' }} />
                ))}
              </div>
            </div>

            {/* Герой — реакция */}
            {heroMsg ? (
              <div style={{ animation: 'bubbleIn 0.35s ease both' }}>
                <HeroBubble heroKey={heroData.key} text={heroMsg} side="left" small />
              </div>
            ) : (
              <div className="rounded-xl px-4 py-3 text-center"
                style={{ background: 'rgba(255,255,255,0.07)' }}>
                <p className="text-yellow-300 text-xs font-semibold mb-0.5">💡 {hero.name} подсказывает</p>
                <p className="text-white font-bold text-sm">{round.clue}</p>
              </div>
            )}

            {/* Зона сборки */}
            <div className="relative min-h-[52px] rounded-xl px-3 py-2 flex flex-wrap gap-1.5 items-center justify-center border-2 transition-all duration-300"
              style={{
                borderColor: flash === 'correct' ? '#34d399' : flash === 'wrong' ? '#f87171' : 'rgba(255,255,255,0.15)',
                background: flash === 'correct' ? 'rgba(52,211,153,0.15)' : flash === 'wrong' ? 'rgba(248,113,113,0.15)' : 'rgba(0,0,0,0.25)',
              }}>
              <Confetti active={confetti} />
              {built.length === 0
                ? <span className="text-white/25 text-xs">кликай буквы снизу →</span>
                : built.map((b, i) => (
                  <button key={i} onClick={() => unpick(b.id)}
                    className="w-9 h-9 rounded-lg font-bold text-sm text-emerald-900 bg-emerald-200 hover:scale-110 active:scale-90 transition-transform"
                    style={{ animation: 'tileIn 0.2s ease both' }}>
                    {b.char}
                  </button>
                ))}
            </div>

            {/* Буквы */}
            <div className="rounded-xl p-3 flex flex-wrap gap-2 justify-center"
              style={{ background: 'rgba(0,0,0,0.2)' }}>
              {tiles.map((t, i) => (
                <button key={t.id} onClick={() => pick(t)} disabled={t.picked}
                  className="w-10 h-10 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: t.picked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                    color: t.picked ? 'transparent' : '#064e3b',
                    transform: t.shake ? 'translateX(4px)' : t.picked ? 'scale(0.75)' : 'scale(1)',
                    opacity: t.picked ? 0.3 : 1,
                    animation: `tileIn 0.25s ease ${i * 35}ms both`,
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
      <ArcadeStyles />
    </Overlay>
  );
}

// ════════════════════════════════════════════════════════
// ⚡ ГОНКА ЗНАНИЙ (race)
// ════════════════════════════════════════════════════════
const RACE_SEC = 10;

const RACE_HEROES = [
  { key: 'captain' as HeroKey, intro: 'Полный вперёд! Отвечай быстрее чем сгорит время!', correct: ['Быстро! Отлично!', 'Мощь! Продолжай!', 'Реакция — топ! 🚀'], wrong: ['Эх, промах!', 'Не сдавайся!', 'Бывает, жми дальше!'] },
  { key: 'robot'   as HeroKey, intro: 'Инициирую режим турбо-ответа. Реагируй быстрее!',  correct: ['Процессор одобряет!', 'Оптимально!', 'Скорость: MAX!'],  wrong: ['Сбой! Не то.', 'Перезагружаюсь!', 'Следующий!'] },
];

type RacePhase = 'intro' | 'play';

export function RaceGame({ activeGame, onClose, onFinish }: Props) {
  const qs = activeGame.raceQuestions!;
  const [phase, setPhase] = useState<RacePhase>('intro');
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(RACE_SEC);
  const [chosen, setChosen] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockedRef = useRef(false);

  const heroData = RACE_HEROES[idx % RACE_HEROES.length];
  const hero = HEROES[heroData.key];
  const q = qs[idx];

  function startTimer() {
    lockedRef.current = false; setTimeLeft(RACE_SEC);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); if (!lockedRef.current) { lockedRef.current = true; doTimeout(); } return 0; }
        return t - 1;
      });
    }, 1000);
  }

  function doTimeout() {
    const wArr = heroData.wrong;
    setHeroMsg(wArr[Math.floor(Math.random() * wArr.length)]);
    setFlash('bad'); setChosen(-1);
    setTimeout(() => nextQ(0), 1200);
  }

  useEffect(() => {
    if (phase !== 'play') return;
    startTimer();
    return () => clearInterval(timerRef.current!);
  }, [idx, phase]); // eslint-disable-line

  function pick(i: number) {
    if (chosen !== null || lockedRef.current) return;
    lockedRef.current = true; clearInterval(timerRef.current!);
    setChosen(i);
    const pts = i === q.correct ? Math.max(10, Math.ceil(timeLeft * (100 / RACE_SEC))) : 0;
    if (i === q.correct) {
      const cArr = heroData.correct;
      setHeroMsg(cArr[Math.floor(Math.random() * cArr.length)]);
      setFlash('ok'); setConfetti(true); setTimeout(() => setConfetti(false), 800);
    } else {
      const wArr = heroData.wrong;
      setHeroMsg(wArr[Math.floor(Math.random() * wArr.length)]);
      setFlash('bad');
    }
    setTotalScore(s => s + pts);
    setTimeout(() => nextQ(pts), 1100);
  }

  function nextQ(_pts: number) {
    setFlash(null); setChosen(null); setHeroMsg('');
    if (idx + 1 >= qs.length) setDone(true); else setIdx(i => i + 1);
  }

  const maxScore = qs.length * 100;
  const pct = Math.round((totalScore / maxScore) * 100);
  const xp = Math.max(Math.floor(activeGame.xp * Math.max(pct, 10) / 100), 10);
  const timerPct = timeLeft / RACE_SEC;
  const timerColor = timerPct > 0.5 ? '#34d399' : timerPct > 0.25 ? '#fbbf24' : '#f87171';
  const r = 28; const circ = 2 * Math.PI * r;

  return (
    <Overlay>
      <div className="w-full max-w-md flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#431407 0%,#7c2d12 100%)', maxHeight: '90vh' }}>
        <ArcadeHeader game={activeGame} onClose={onClose}
          right={<span className="text-yellow-300 font-bold">⭐ {totalScore}</span>} />

        {done ? (
          <WinScreen xp={xp} heroKey={heroData.key}
            title={pct >= 80 ? '🏁 Чемпион гонки!' : pct >= 50 ? '👏 Хороший результат!' : '💪 В следующий раз!'}
            sub={`Результат: ${pct}% · Очки: ${totalScore}/${maxScore}`} onFinish={() => onFinish(xp)} />

        ) : phase === 'intro' ? (
          <HeroIntro heroKey={heroData.key}
            title="Гонка знаний!"
            subtitle="Быстрее отвечаешь — больше очков"
            task={heroData.intro}
            btnLabel="⚡ На старт!" onStart={() => setPhase('play')}
            accent={hero.color} />

        ) : (
          <div className="flex flex-col p-4 gap-3">
            {/* Прогресс + таймер */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 flex-1">
                {qs.map((_, i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
                    style={{ background: i < idx ? '#34d399' : i === idx ? '#fff' : 'rgba(255,255,255,0.15)' }} />
                ))}
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center ml-3">
                <svg className="absolute inset-0 -rotate-90" width="64" height="64">
                  <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                  <circle cx="32" cy="32" r={r} fill="none" stroke={timerColor}
                    strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={circ * (1 - timerPct)}
                    style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }} />
                </svg>
                <span className="text-xl font-bold" style={{ color: timerColor }}>{timeLeft}</span>
              </div>
            </div>

            {/* Реакция героя */}
            {heroMsg && (
              <div style={{ animation: 'bubbleIn 0.35s ease both' }}>
                <HeroBubble heroKey={heroData.key} text={heroMsg} side="left" small />
              </div>
            )}

            {/* Вопрос */}
            <div className="relative rounded-2xl p-4 text-center overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Confetti active={confetti} />
              <p className="text-white/50 text-xs mb-1">Вопрос {idx + 1} / {qs.length}</p>
              <p className="text-white font-bold text-base leading-snug">{q.question}</p>
            </div>

            {/* Варианты */}
            <div className="grid grid-cols-2 gap-2.5">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct; const isChosen = i === chosen;
                let bg = 'rgba(255,255,255,0.08)', border = 'rgba(255,255,255,0.15)';
                if (chosen !== null) {
                  if (isCorrect) { bg = 'rgba(52,211,153,0.25)'; border = '#34d399'; }
                  else if (isChosen) { bg = 'rgba(248,113,113,0.25)'; border = '#f87171'; }
                }
                return (
                  <button key={i} onClick={() => pick(i)} disabled={chosen !== null}
                    className="rounded-xl p-3 font-semibold text-sm text-white text-center border-2 transition-all hover:scale-105 active:scale-95 disabled:cursor-default"
                    style={{ background: bg, borderColor: border,
                      animation: flash === 'bad' && isChosen ? 'shakeX 0.4s ease' : `optIn 0.3s ease ${i * 50}ms both` }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ArcadeStyles />
    </Overlay>
  );
}

// ════════════════════════════════════════════════════════
// 🧩 ПАЗЛ (puzzle)
// ════════════════════════════════════════════════════════
const PUZZLE_HEROES = [
  { key: 'doctor' as HeroKey, intro: 'Разгадай все вопросы — открой секретную картинку!', correct: 'Ячейка открыта! Исследование продолжается!', wrong: 'Гипотеза не подтвердилась. Попробуй снова!' },
  { key: 'wizard' as HeroKey, intro: 'Каждый верный ответ — новая часть магического пазла!', correct: 'Заклинание работает! Ещё кусочек!', wrong: 'Неверное слово! Маги не сдаются!' },
];

type PuzzlePhase = 'intro' | 'play';

export function PuzzleGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.puzzleRounds!;
  const COLS = 3;
  const [phase, setPhase] = useState<PuzzlePhase>('intro');
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');

  const heroData = PUZZLE_HEROES[idx % PUZZLE_HEROES.length];
  const hero = HEROES[heroData.key];
  const q = rounds[idx];

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === q.correct) {
      setFlash('ok'); setConfetti(true); setTimeout(() => setConfetti(false), 800);
      setHeroMsg(heroData.correct);
      setRevealed(prev => { const n = new Set(prev); n.add(idx); return n; });
      setTimeout(() => {
        setFlash(null); setChosen(null); setHeroMsg('');
        if (idx + 1 >= rounds.length) setDone(true); else setIdx(n => n + 1);
      }, 1100);
    } else {
      setFlash('bad'); setErrors(e => e + 1);
      setHeroMsg(heroData.wrong);
      setTimeout(() => { setFlash(null); setChosen(null); setHeroMsg(''); }, 900);
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
          <WinScreen xp={xp} heroKey={heroData.key}
            title="🧩 Пазл собран!" sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />

        ) : phase === 'intro' ? (
          <HeroIntro heroKey={heroData.key}
            title="Открой картинку!"
            subtitle="Ответь верно — получи кусочек пазла"
            task={heroData.intro}
            btnLabel="🧩 Поехали!" onStart={() => setPhase('play')}
            accent={hero.color} />

        ) : (
          <div className="flex flex-col p-4 gap-3">
            {/* Пазл-сетка */}
            <div className="relative rounded-xl overflow-hidden border border-white/10"
              style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
              <Confetti active={confetti} />
              {rounds.map((r, i) => {
                const isRev = revealed.has(i); const isCur = i === idx;
                return (
                  <div key={i}
                    className="aspect-square flex items-center justify-center text-3xl border border-white/10 transition-all duration-600"
                    style={{
                      background: isRev ? `${hero.color}22` : isCur ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.45)',
                      transform: isRev ? 'scale(1)' : isCur ? 'scale(0.9)' : 'scale(0.8)',
                      opacity: isRev ? 1 : isCur ? 0.7 : 0.15,
                      boxShadow: isRev ? `inset 0 0 20px ${hero.color}33` : 'none',
                    }}>
                    {isRev ? r.emoji : isCur ? '❓' : '⬛'}
                  </div>
                );
              })}
            </div>

            {/* Реакция героя */}
            {heroMsg ? (
              <div style={{ animation: 'bubbleIn 0.35s ease both' }}>
                <HeroBubble heroKey={heroData.key} text={heroMsg} side="right" small />
              </div>
            ) : (
              <div className="rounded-xl p-3 text-center border-2 transition-all"
                style={{
                  background: flash === 'ok' ? 'rgba(52,211,153,0.15)' : flash === 'bad' ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.07)',
                  borderColor: flash === 'ok' ? '#34d399' : flash === 'bad' ? '#f87171' : 'rgba(255,255,255,0.12)',
                }}>
                <p className="text-white/50 text-xs mb-1">Вопрос {idx + 1} / {rounds.length}</p>
                <p className="text-white font-bold text-sm leading-snug">{q.question}</p>
              </div>
            )}

            {/* Варианты */}
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, i) => {
                let bg = 'rgba(255,255,255,0.07)', border = 'rgba(255,255,255,0.12)';
                if (chosen !== null) {
                  if (i === q.correct) { bg = 'rgba(52,211,153,0.25)'; border = '#34d399'; }
                  else if (i === chosen) { bg = 'rgba(248,113,113,0.25)'; border = '#f87171'; }
                }
                return (
                  <button key={i} onClick={() => pick(i)} disabled={chosen !== null}
                    className="rounded-xl px-3 py-3 text-white text-sm font-semibold border-2 transition-all hover:scale-105 active:scale-95 disabled:cursor-default"
                    style={{ background: bg, borderColor: border,
                      animation: `optIn 0.3s ease ${i * 60}ms both` }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <ArcadeStyles />
    </Overlay>
  );
}

// ════════════════════════════════════════════════════════
// CSS ANIMATIONS
// ════════════════════════════════════════════════════════
function ArcadeStyles() {
  return (
    <style>{`
      @keyframes arcBounce    { from{transform:translateY(0) rotate(-3deg)} to{transform:translateY(-14px) rotate(3deg)} }
      @keyframes winDance     { from{transform:translateY(0) rotate(-8deg) scale(1)} to{transform:translateY(-10px) rotate(8deg) scale(1.1)} }
      @keyframes heroFloat    { from{transform:translateY(0) rotate(-2deg)} to{transform:translateY(-10px) rotate(2deg)} }
      @keyframes heroIdle     { from{transform:translateX(-50%) translateY(0)} to{transform:translateX(-50%) translateY(-6px)} }
      @keyframes bubbleIn     { from{opacity:0;transform:scale(0.7) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
      @keyframes tileIn       { from{opacity:0;transform:scale(0.4) rotate(-20deg)} to{opacity:1;transform:scale(1) rotate(0)} }
      @keyframes countPop     { from{opacity:0;transform:scale(2.2)} to{opacity:1;transform:scale(1)} }
      @keyframes catchPop     { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.4)} 40%{opacity:1;transform:translate(-50%,-60%) scale(1.2)} 100%{opacity:0;transform:translate(-50%,-90%) scale(0.9)} }
      @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(360px) rotate(720deg);opacity:0} }
      @keyframes fadeSlideIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes optIn        { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
      @keyframes shakeX       { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 60%{transform:translateX(7px)} 80%{transform:translateX(-3px)} }
    `}</style>
  );
}

// ════════════════════════════════════════════════════════
// ROUTER
// ════════════════════════════════════════════════════════
export default function ArcadeGames({ activeGame, onClose, onFinish }: Props) {
  if (activeGame.type === 'catch')     return <CatchGame     activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'wordbuild') return <WordBuildGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'race')      return <RaceGame      activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'puzzle')    return <PuzzleGame    activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  return null;
}
