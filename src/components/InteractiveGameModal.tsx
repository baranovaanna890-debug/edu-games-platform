import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import type { Game } from '@/data/games';
import { HEROES } from '@/components/ArcadeGames';

type HeroKey = keyof typeof HEROES;

interface Props {
  activeGame: Game;
  onClose: () => void;
  onFinish: (xpEarned: number) => void;
}

// ════════════════════════════════════════════════════════
// SHARED UI
// ════════════════════════════════════════════════════════
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#f59e0b', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {Array.from({ length: 22 }, (_, i) => (
        <div key={i} className="absolute rounded-sm"
          style={{
            width: 7, height: 7,
            left: `${5 + (i * 4.4) % 90}%`, top: '-8px',
            background: colors[i % colors.length],
            animation: `imCF ${0.5 + (i % 5) * 0.12}s ease ${(i % 7) * 0.05}s forwards`,
            transform: `rotate(${i * 37}deg)`,
          }} />
      ))}
    </div>
  );
}

// Речевой пузырь героя
function HeroBubble({ heroKey, text, side = 'left' }: { heroKey: HeroKey; text: string; side?: 'left' | 'right' }) {
  const h = HEROES[heroKey];
  return (
    <div className={`flex items-end gap-2 ${side === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animation: 'imBubble 0.4s cubic-bezier(.34,1.56,.64,1) both' }}>
      <div className="text-3xl flex-shrink-0" style={{ animation: 'imHeroFloat 2s ease infinite alternate' }}>
        {h.avatar}
      </div>
      <div>
        <div className="text-xs font-bold mb-0.5" style={{ color: h.color }}>{h.name}</div>
        <div className="px-3 py-2 rounded-xl text-sm leading-relaxed"
          style={{ background: h.bg, border: `1px solid ${h.color}33`, color: '#1f2937' }}>
          {text}
        </div>
      </div>
    </div>
  );
}

// Интро-экран перед игрой
function GameIntro({ heroKey, title, sub, task, btnLabel, onStart, accent }: {
  heroKey: HeroKey; title: string; sub: string; task: string;
  btnLabel: string; onStart: () => void; accent: string;
}) {
  const h = HEROES[heroKey];
  return (
    <div className="flex flex-col items-center p-6 gap-4 text-center"
      style={{ animation: 'imSlideIn 0.4s ease both' }}>
      <div className="text-6xl" style={{ animation: 'imHeroFloat 2s ease infinite alternate' }}>{h.avatar}</div>
      <div>
        <div className="text-xs font-bold mb-0.5" style={{ color: accent }}>{h.name}</div>
        <div className="font-game text-xl text-gray-800">{title}</div>
        <div className="text-gray-400 text-xs mt-0.5">{sub}</div>
      </div>
      <div className="rounded-2xl px-5 py-3 text-sm text-gray-700 leading-relaxed max-w-xs"
        style={{ background: h.bg, border: `1px solid ${accent}33` }}>
        {task}
      </div>
      <button onClick={onStart}
        className="px-8 py-3 rounded-xl font-bold text-white text-base hover:scale-105 active:scale-95 transition-transform"
        style={{ background: accent, boxShadow: `0 0 20px ${accent}44` }}>
        {btnLabel}
      </button>
    </div>
  );
}

// Победный экран
function WinScreen({ xp, emoji, title, sub, heroKey, onFinish }: {
  xp: number; emoji: string; title: string; sub: string; heroKey: HeroKey; onFinish: () => void;
}) {
  const [vis, setVis] = useState(false);
  const h = HEROES[heroKey];
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div className={`flex flex-col items-center p-8 text-center gap-3 transition-all duration-500 ${vis ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
      <div className="text-5xl" style={{ animation: 'imWinDance 0.7s ease infinite alternate' }}>{h.avatar}</div>
      <div className="text-5xl" style={{ animation: 'imBounce 0.6s ease infinite alternate' }}>{emoji}</div>
      <div className="font-game text-2xl text-purple-700">{title}</div>
      <div className="text-gray-400 text-sm">{sub}</div>
      <div className="text-xs italic px-4 py-2 rounded-xl" style={{ color: h.color, background: h.bg }}>
        "{h.name}: молодец! 🎉"
      </div>
      <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-50 border-2 border-yellow-200">
        <span className="text-2xl">⚡</span>
        <span className="font-game text-yellow-500 text-xl">+{xp} XP</span>
      </div>
      <button onClick={onFinish}
        className="px-8 py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors hover:scale-105 active:scale-95">
        К каталогу →
      </button>
    </div>
  );
}

// Обёртка-модал
function Modal({ children, onClose, accent = '#7c3aed' }: {
  children: React.ReactNode; onClose: () => void; accent?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(5px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        style={{ border: `2px solid ${accent}33`, maxHeight: '92vh', overflowY: 'auto', animation: 'imSlideIn 0.3s ease both' }}>
        <button onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
          <Icon name="X" size={16} />
        </button>
        {children}
      </div>
      <ModalStyles />
    </div>
  );
}

function ModalHeader({ game, accent }: { game: Game; accent: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b"
      style={{ background: `${accent}08`, borderColor: `${accent}22` }}>
      <span className="text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>{game.emoji}</span>
      <div>
        <p className="font-bold text-gray-800 text-sm">{game.title}</p>
        <p className="text-xs text-gray-400">{game.grade} · {game.duration}</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🔗 СОЕДИНИ ПАРЫ (match)
// ════════════════════════════════════════════════════════
const MATCH_HERO: HeroKey = 'prof';
const MATCH_MSGS = {
  correct: ['Верно! Продолжай!', 'Блестяще!', 'Именно так!'],
  wrong:   ['Не та пара, подумай!', 'Попробуй иначе!', 'Логика подведёт?'],
  done:    'Все пары найдены! Ты настоящий детектив!',
};

function MatchGame({ activeGame, onClose, onFinish }: Props) {
  const pairs = activeGame.matchPairs!;
  const [phase, setPhase] = useState<'intro' | 'play'>('intro');
  const [shuffled] = useState(() => [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongRight, setWrongRight] = useState<string | null>(null);
  const [wrongLeft, setWrongLeft]   = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');
  const [justMatched, setJustMatched] = useState<string | null>(null);
  const h = HEROES[MATCH_HERO];

  function pickLeft(left: string) {
    if (matches[left]) return;
    setSelected(s => s === left ? null : left);
  }

  function pickRight(right: string) {
    if (!selected) return;
    const correct = pairs.find(p => p.left === selected)?.right;
    if (right === correct) {
      const m = { ...matches, [selected]: right };
      setMatches(m); setJustMatched(selected); setTimeout(() => setJustMatched(null), 700);
      const rArr = MATCH_MSGS.correct;
      setHeroMsg(rArr[Math.floor(Math.random() * rArr.length)]);
      setConfetti(true); setTimeout(() => setConfetti(false), 800);
      setSelected(null);
      if (Object.keys(m).length === pairs.length) {
        setHeroMsg(MATCH_MSGS.done);
        setTimeout(() => setDone(true), 900);
      }
    } else {
      const wArr = MATCH_MSGS.wrong;
      setHeroMsg(wArr[Math.floor(Math.random() * wArr.length)]);
      setWrongRight(right); setWrongLeft(selected);
      setTimeout(() => { setWrongRight(null); setWrongLeft(null); setHeroMsg(''); }, 800);
    }
  }

  const usedRights = Object.values(matches);

  return (
    <Modal onClose={onClose} accent={h.color}>
      <ModalHeader game={activeGame} accent={h.color} />
      {done ? (
        <WinScreen xp={activeGame.xp} emoji="🎉" heroKey={MATCH_HERO}
          title="Все пары найдены!" sub={`${pairs.length} пар соединено верно`}
          onFinish={() => onFinish(activeGame.xp)} />
      ) : phase === 'intro' ? (
        <GameIntro heroKey={MATCH_HERO} title="Соедини пары!"
          sub="Информатика — это логика и связи"
          task="Я помогу! Нажимай слово слева, потом подходящее справа. Найди все пары!"
          btnLabel="🔗 Начинаем!" onStart={() => setPhase('play')} accent={h.color} />
      ) : (
        <div className="relative p-5">
          <Confetti active={confetti} />

          {/* Герой-реакция */}
          {heroMsg && (
            <div className="mb-3">
              <HeroBubble heroKey={MATCH_HERO} text={heroMsg} />
            </div>
          )}

          {/* Прогресс */}
          <div className="h-1.5 rounded-full bg-gray-100 mb-4 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(Object.keys(matches).length / pairs.length) * 100}%`, background: h.color }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              {pairs.map((p, i) => {
                const isMatched = !!matches[p.left]; const isSel = selected === p.left; const isWrong = wrongLeft === p.left;
                return (
                  <button key={p.left} onClick={() => pickLeft(p.left)} disabled={isMatched}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                    style={{
                      animation: isWrong ? 'imShake 0.4s ease' : `imOptIn 0.3s ease ${i * 60}ms both`,
                      background: isMatched ? '#d1fae5' : isSel ? `${h.color}18` : '#f9fafb',
                      borderColor: isMatched ? '#10b981' : isSel ? h.color : '#e5e7eb',
                      color: isMatched ? '#065f46' : isSel ? '#1f2937' : '#374151',
                      boxShadow: isSel ? `0 0 0 3px ${h.color}22` : isMatched ? '0 0 0 3px #10b98122' : 'none',
                      transform: isMatched && justMatched === p.left ? 'scale(1.04)' : 'scale(1)',
                    }}>
                    {p.left} {isMatched && '✓'}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              {shuffled.map((r, i) => {
                const isMatched = usedRights.includes(r); const isWrong = wrongRight === r;
                return (
                  <button key={r} onClick={() => pickRight(r)} disabled={isMatched || !selected}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                    style={{
                      animation: isWrong ? 'imShake 0.4s ease' : `imOptIn 0.3s ease ${i * 60}ms both`,
                      background: isMatched ? '#d1fae5' : isWrong ? '#fee2e2' : selected ? '#faf5ff' : '#f9fafb',
                      borderColor: isMatched ? '#10b981' : isWrong ? '#ef4444' : selected ? '#d8b4fe' : '#e5e7eb',
                      color: isMatched ? '#065f46' : isWrong ? '#991b1b' : '#374151',
                    }}>
                    {r} {isMatched && '✓'}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">
            Совпадений: {Object.keys(matches).length} / {pairs.length}
          </p>
        </div>
      )}
    </Modal>
  );
}

// ════════════════════════════════════════════════════════
// 📋 РАССТАВЬ ПО ПОРЯДКУ (sort)
// ════════════════════════════════════════════════════════
const SORT_HERO: HeroKey = 'robot';

function SortGame({ activeGame, onClose, onFinish }: Props) {
  const items = activeGame.sortItems!;
  const [phase, setPhase] = useState<'intro' | 'play'>('intro');
  const [shuffled] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<boolean[]>([]);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');
  const h = HEROES[SORT_HERO];
  const correct = [...items].sort((a, b) => a.order - b.order).map(i => i.value);

  function addItem(v: string) { if (!order.includes(v)) setOrder(prev => [...prev, v]); }
  function removeItem(v: string) { if (checked) return; setOrder(prev => prev.filter(x => x !== v)); }

  function checkAnswer() {
    const res = order.map((v, i) => v === correct[i]);
    setResult(res); setChecked(true);
    if (res.every(Boolean) && order.length === items.length) {
      setConfetti(true);
      setHeroMsg('Порядок восстановлен! Алгоритм работает идеально! 🤖');
    } else {
      setHeroMsg('Что-то не так. Логические цепи требуют перестройки...');
    }
  }

  const allCorrect = checked && result.every(Boolean) && order.length === items.length;
  const available = shuffled.filter(i => !order.includes(i.value));

  return (
    <Modal onClose={onClose} accent={h.color}>
      <ModalHeader game={activeGame} accent={h.color} />
      {allCorrect ? (
        <WinScreen xp={activeGame.xp} emoji="🏆" heroKey={SORT_HERO}
          title="Правильный порядок!" sub="Все шаги расставлены верно"
          onFinish={() => onFinish(activeGame.xp)} />
      ) : phase === 'intro' ? (
        <GameIntro heroKey={SORT_HERO} title="Расставь по порядку!"
          sub="Логика и последовательность"
          task="Расставь элементы в правильном порядке! Нажимай снизу — они встанут по очереди."
          btnLabel="🤖 Расставляем!" onStart={() => setPhase('play')} accent={h.color} />
      ) : (
        <div className="relative p-5">
          <Confetti active={confetti} />

          {heroMsg && (
            <div className="mb-3">
              <HeroBubble heroKey={SORT_HERO} text={heroMsg} />
            </div>
          )}

          {/* Зона порядка */}
          <div className="min-h-[100px] rounded-xl border-2 border-dashed p-3 mb-4"
            style={{ borderColor: `${h.color}55`, background: `${h.color}06` }}>
            <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: h.color }}>Твой порядок</p>
            {order.length === 0
              ? <p className="text-gray-300 text-sm text-center mt-3">Пока пусто...</p>
              : (
                <div className="space-y-1.5">
                  {order.map((v, i) => {
                    const ok = checked ? result[i] : null;
                    return (
                      <div key={i} onClick={() => removeItem(v)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 border-2 transition-all"
                        style={{
                          background: ok === true ? '#d1fae5' : ok === false ? '#fee2e2' : 'white',
                          borderColor: ok === true ? '#10b981' : ok === false ? '#ef4444' : '#e5e7eb',
                          animation: `imOptIn 0.2s ease ${i * 50}ms both`,
                        }}>
                        <span className="text-xs font-bold text-gray-400 w-5">{i + 1}.</span>
                        <span className="text-sm font-medium text-gray-700 flex-1">{v}</span>
                        {ok === true && <span>✅</span>}
                        {ok === false && <span>❌</span>}
                        {!checked && <span className="text-gray-300 text-xs">✕</span>}
                      </div>
                    );
                  })}
                </div>
              )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {available.map((it, i) => (
              <button key={it.value} onClick={() => addItem(it.value)}
                className="px-3 py-2 rounded-xl text-sm font-medium border-2 border-gray-200 bg-white hover:scale-105 active:scale-95 transition-all"
                style={{ animation: `imPopIn 0.25s ease ${i * 50}ms both` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = h.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
                {it.value}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {!checked ? (
              <button onClick={checkAnswer} disabled={order.length !== items.length}
                className="flex-1 py-3 rounded-xl font-bold text-white transition-colors disabled:opacity-40"
                style={{ background: h.color }}>
                Проверить ✓
              </button>
            ) : !allCorrect ? (
              <button onClick={() => { setOrder([]); setChecked(false); setResult([]); setHeroMsg(''); }}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                ↺ Попробовать снова
              </button>
            ) : null}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ════════════════════════════════════════════════════════
// 🔍 НАЙДИ ЛИШНЕЕ (oddone)
// ════════════════════════════════════════════════════════
const ODDONE_HERO: HeroKey = 'doctor';

function OddOneGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.oddOneRounds!;
  const [phase, setPhase] = useState<'intro' | 'play'>('intro');
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');
  const [entering, setEntering] = useState(false);
  const h = HEROES[ODDONE_HERO];
  const round = rounds[idx];

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === round.oddIndex) {
      setConfetti(true); setTimeout(() => setConfetti(false), 800);
      setHeroMsg('Анализ верен! Лишний элемент найден! 🔬');
    } else {
      setErrors(e => e + 1);
      setHeroMsg('Нет, это не лишний. Перепроверяю данные...');
    }
    setTimeout(() => {
      if (idx + 1 >= rounds.length) { setDone(true); return; }
      setEntering(true); setHeroMsg('');
      setTimeout(() => { setIdx(n => n + 1); setChosen(null); setEntering(false); }, 350);
    }, 1300);
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <Modal onClose={onClose} accent={h.color}>
      <ModalHeader game={activeGame} accent={h.color} />
      {done ? (
        <WinScreen xp={xp} emoji="🎯" heroKey={ODDONE_HERO}
          title={errors === 0 ? 'Безупречный анализ!' : 'Исследование завершено!'}
          sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
      ) : phase === 'intro' ? (
        <GameIntro heroKey={ODDONE_HERO} title="Найди лишнее!"
          sub="Три связаны — одно чужое"
          task="Включаю сканер! Три предмета связаны по смыслу, а один — нет. Найди его!"
          btnLabel="🔬 Сканировать!" onStart={() => setPhase('play')} accent={h.color} />
      ) : (
        <div className={`relative p-5 transition-opacity duration-300 ${entering ? 'opacity-0' : 'opacity-100'}`}>
          <Confetti active={confetti} />

          {/* Прогресс */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-1.5">
              {rounds.map((_, i) => (
                <div key={i} className="w-6 h-1.5 rounded-full transition-all"
                  style={{ background: i < idx ? h.color : i === idx ? h.color : '#e5e7eb', opacity: i <= idx ? 1 : 0.3 }} />
              ))}
            </div>
            <span className="text-xs text-gray-400">Ошибок: {errors}</span>
          </div>

          {heroMsg ? (
            <div className="mb-4">
              <HeroBubble heroKey={ODDONE_HERO} text={heroMsg} />
            </div>
          ) : (
            <p className="text-center font-semibold text-gray-700 mb-4 text-sm">
              🔎 Три связаны, одно — лишнее!
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {round.items.map((item, i) => {
              const isChosen = chosen === i; const isOdd = i === round.oddIndex;
              let bg = '#f9fafb', border = '#e5e7eb', color = '#374151';
              if (chosen !== null) {
                if (isOdd) { bg = '#d1fae5'; border = '#10b981'; color = '#065f46'; }
                else if (isChosen) { bg = '#fee2e2'; border = '#ef4444'; color = '#991b1b'; }
                else { bg = '#f3f4f6'; color = '#9ca3af'; }
              }
              return (
                <button key={i} onClick={() => pick(i)}
                  className="py-5 px-3 rounded-xl font-bold text-sm border-2 text-center transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: bg, borderColor: border, color,
                    animation: `imPopIn 0.3s ease ${i * 70}ms both`,
                  }}>
                  {item}
                </button>
              );
            })}
          </div>

          {chosen !== null && (
            <div className="mt-3 px-4 py-3 rounded-xl text-xs leading-relaxed border-2"
              style={{
                background: chosen === round.oddIndex ? '#ecfdf5' : '#fff7ed',
                borderColor: chosen === round.oddIndex ? '#10b981' : '#f59e0b',
                color: chosen === round.oddIndex ? '#065f46' : '#92400e',
                animation: 'imSlideIn 0.3s ease both',
              }}>
              💡 {round.explanation}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

// ════════════════════════════════════════════════════════
// ⌨️ НАПЕЧАТАЙ КОД (typetext)
// ════════════════════════════════════════════════════════
const TYPETEXT_HERO: HeroKey = 'captain';

function TypeTextGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.typeTextRounds!;
  const [phase, setPhase] = useState<'intro' | 'play'>('intro');
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const h = HEROES[TYPETEXT_HERO];
  const round = rounds[idx];

  useEffect(() => {
    setValue(''); setStatus('idle'); setShowHint(false); setHeroMsg('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [idx]);

  function check() {
    if (value.trim() === round.answer) {
      setStatus('correct'); setConfetti(true); setTimeout(() => setConfetti(false), 800);
      setHeroMsg('Код принят на борту! Синтаксис идеален! 🚀');
      setTimeout(() => {
        if (idx + 1 >= rounds.length) setDone(true); else setIdx(n => n + 1);
      }, 1000);
    } else {
      setStatus('wrong'); setErrors(e => e + 1);
      setHeroMsg('Сигнал искажён! Проверь каждый символ!');
      setTimeout(() => { setStatus('idle'); setHeroMsg(''); }, 900);
    }
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <Modal onClose={onClose} accent={h.color}>
      <ModalHeader game={activeGame} accent={h.color} />
      {done ? (
        <WinScreen xp={xp} emoji="✨" heroKey={TYPETEXT_HERO}
          title={errors === 0 ? 'Идеальный синтаксис!' : 'Код написан!'}
          sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
      ) : phase === 'intro' ? (
        <GameIntro heroKey={TYPETEXT_HERO} title="Напечатай код!"
          sub="Тренируй синтаксис пальцами"
          task="С орбиты наблюдаю! Перепечатай строку кода точь-в-точь. Каждый символ важен!"
          btnLabel="🚀 Пишем код!" onStart={() => setPhase('play')} accent={h.color} />
      ) : (
        <div className="relative p-5 space-y-4">
          <Confetti active={confetti} />

          {/* Прогресс */}
          <div className="flex gap-1.5">
            {rounds.map((_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
                style={{ background: i < idx ? h.color : i === idx ? h.color : '#e5e7eb', opacity: i <= idx ? 1 : 0.4 }} />
            ))}
          </div>

          {heroMsg ? (
            <HeroBubble heroKey={TYPETEXT_HERO} text={heroMsg} />
          ) : (
            /* Редактор */
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-900">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-gray-500 text-xs ml-2">main.py</span>
              </div>
              <div className="bg-gray-900 px-4 py-3">
                <p className="text-green-400 text-xs font-mono mb-1"># {round.prompt}</p>
                <p className="text-gray-600 text-xs font-mono"># введи строку ниже</p>
              </div>
            </div>
          )}

          <input ref={inputRef} value={value}
            onChange={e => { setValue(e.target.value); setStatus('idle'); }}
            onKeyDown={e => e.key === 'Enter' && check()}
            spellCheck={false} autoComplete="off"
            placeholder="Напечатай код..."
            className="w-full px-4 py-3 rounded-xl font-mono text-sm border-2 outline-none transition-all"
            style={{
              borderColor: status === 'correct' ? '#10b981' : status === 'wrong' ? '#ef4444' : h.color + '66',
              background: status === 'correct' ? '#d1fae5' : status === 'wrong' ? '#fff1f1' : '#f9fafb',
              animation: status === 'wrong' ? 'imShake 0.4s ease' : undefined,
            }} />

          {showHint && (
            <div className="px-4 py-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800"
              style={{ animation: 'imSlideIn 0.2s ease' }}>
              💡 {round.hint}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={check}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors"
              style={{ background: h.color }}>
              Проверить ↵
            </button>
            <button onClick={() => setShowHint(v => !v)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              💡
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ════════════════════════════════════════════════════════
// ✅ ВЕРНО / НЕВЕРНО (truefalse)
// ════════════════════════════════════════════════════════
const TF_HERO: HeroKey = 'wizard';
const TF_CORRECT = ['Правильно! Магия знаний работает! ✨', 'Верно! Заклинание сработало!', 'Мудрое решение!'];
const TF_WRONG   = ['Увы, заклинание рассеялось...', 'Неверно! Переворачиваю страницу!', 'Хм, не то...'];

function TrueFalseGame({ activeGame, onClose, onFinish }: Props) {
  const cards = activeGame.trueFalseCards!;
  const [phase, setPhase] = useState<'intro' | 'play'>('intro');
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');
  const [entering, setEntering] = useState(false);
  const h = HEROES[TF_HERO];
  const card = cards[idx];
  const isCorrect = answered !== null && answered === card.isTrue;

  function answer(val: boolean) {
    if (answered !== null) return;
    setAnswered(val);
    if (val === card.isTrue) {
      setConfetti(true); setTimeout(() => setConfetti(false), 800);
      setHeroMsg(TF_CORRECT[Math.floor(Math.random() * TF_CORRECT.length)]);
    } else {
      setErrors(e => e + 1);
      setHeroMsg(TF_WRONG[Math.floor(Math.random() * TF_WRONG.length)]);
    }
    setTimeout(() => {
      if (idx + 1 >= cards.length) { setDone(true); return; }
      setEntering(true); setHeroMsg('');
      setTimeout(() => { setIdx(n => n + 1); setAnswered(null); setEntering(false); }, 300);
    }, 1500);
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <Modal onClose={onClose} accent={h.color}>
      <ModalHeader game={activeGame} accent={h.color} />
      {done ? (
        <WinScreen xp={xp} emoji="🧠" heroKey={TF_HERO}
          title={errors === 0 ? 'Всё верно! Эксперт!' : 'Карточки пройдены!'}
          sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
      ) : phase === 'intro' ? (
        <GameIntro heroKey={TF_HERO} title="Верно или Неверно?"
          sub="Проверь свои знания"
          task="Читаю свиток утверждений! Реши быстро: это ПРАВДА или ЛОЖЬ?"
          btnLabel="🧙 Начинаем!" onStart={() => setPhase('play')} accent={h.color} />
      ) : (
        <div className={`relative p-5 space-y-4 transition-opacity duration-200 ${entering ? 'opacity-0' : 'opacity-100'}`}>
          <Confetti active={confetti} />

          {/* Прогресс-точки */}
          <div className="flex justify-center gap-2">
            {cards.map((_, i) => (
              <div key={i} className="rounded-full transition-all"
                style={{
                  width: i === idx ? 12 : 8, height: i === idx ? 12 : 8,
                  background: i < idx ? h.color : i === idx ? h.color : '#e5e7eb',
                  transform: i === idx ? 'scale(1.2)' : 'scale(1)',
                }} />
            ))}
          </div>

          {/* Реакция мага */}
          {heroMsg ? (
            <HeroBubble heroKey={TF_HERO} text={heroMsg} side="right" />
          ) : (
            /* Карточка */
            <div className="min-h-[120px] rounded-2xl border-2 flex flex-col items-center justify-center p-5 text-center transition-all duration-300"
              style={{
                borderColor: answered === null ? '#e5e7eb' : isCorrect ? '#10b981' : '#ef4444',
                background: answered === null ? '#f9fafb' : isCorrect ? '#d1fae5' : '#fee2e2',
                animation: 'imPopIn 0.4s ease both',
              }}>
              <span className="text-3xl mb-2">{idx % 3 === 0 ? '💬' : idx % 3 === 1 ? '🤔' : '📜'}</span>
              <p className="font-semibold text-gray-800 text-base leading-relaxed">{card.statement}</p>
            </div>
          )}

          {/* Объяснение */}
          {answered !== null && !heroMsg && (
            <div className="px-4 py-3 rounded-xl border-2 text-xs leading-relaxed"
              style={{
                background: isCorrect ? '#f0fdf4' : '#fff7ed',
                borderColor: isCorrect ? '#86efac' : '#fde68a',
                color: isCorrect ? '#166534' : '#92400e',
                animation: 'imSlideIn 0.3s ease both',
              }}>
              {isCorrect ? '✅' : '💡'} {card.explanation}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => answer(true)} disabled={answered !== null}
              className="py-4 rounded-xl font-bold text-base border-2 border-green-300 text-green-700 bg-green-50 hover:bg-green-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-60">
              ✅ Верно
            </button>
            <button onClick={() => answer(false)} disabled={answered !== null}
              className="py-4 rounded-xl font-bold text-base border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-60">
              ❌ Неверно
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ════════════════════════════════════════════════════════
// 🔢 ЧИСЛОВОЙ ВВОД (numpad)
// ════════════════════════════════════════════════════════
const NUMPAD_HERO: HeroKey = 'robot';

function NumpadGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.numpadRounds!;
  const [phase, setPhase] = useState<'intro' | 'play'>('intro');
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [heroMsg, setHeroMsg] = useState('');
  const h = HEROES[NUMPAD_HERO];
  const round = rounds[idx];

  useEffect(() => { setValue(''); setStatus('idle'); setShowHint(false); setHeroMsg(''); }, [idx]);

  function tap(d: string) {
    if (status === 'correct') return; setStatus('idle');
    if (d === '⌫') setValue(v => v.slice(0, -1));
    else if (d === 'C') setValue('');
    else if (value.length < 6) setValue(v => v + d);
  }

  function check() {
    if (!value) return;
    if (parseInt(value) === round.answer) {
      setStatus('correct'); setConfetti(true); setTimeout(() => setConfetti(false), 800);
      setHeroMsg('Верно! Вычислительный блок подтверждает! 🤖');
      setTimeout(() => {
        if (idx + 1 >= rounds.length) setDone(true); else setIdx(n => n + 1);
      }, 1000);
    } else {
      setStatus('wrong'); setErrors(e => e + 1);
      setHeroMsg('Ошибка вычисления. Перезапуск...');
      setTimeout(() => { setStatus('idle'); setValue(''); setHeroMsg(''); }, 800);
    }
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);
  const keys = ['7','8','9','4','5','6','1','2','3','C','0','⌫'];

  return (
    <Modal onClose={onClose} accent={h.color}>
      <ModalHeader game={activeGame} accent={h.color} />
      {done ? (
        <WinScreen xp={xp} emoji="🔢" heroKey={NUMPAD_HERO}
          title={errors === 0 ? 'Все числа верны!' : 'Раунды пройдены!'}
          sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
      ) : phase === 'intro' ? (
        <GameIntro heroKey={NUMPAD_HERO} title="Введи число!"
          sub="Знание ключевых констант"
          task="Инициализирую числовой модуль! Введи правильное число с помощью клавиатуры ниже."
          btnLabel="🤖 Считаем!" onStart={() => setPhase('play')} accent={h.color} />
      ) : (
        <div className="relative p-5 space-y-4">
          <Confetti active={confetti} />

          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(idx / rounds.length) * 100}%`, background: h.color }} />
          </div>

          {heroMsg ? (
            <HeroBubble heroKey={NUMPAD_HERO} text={heroMsg} />
          ) : (
            <div className="rounded-xl p-4 text-center"
              style={{ background: `${h.color}12`, border: `2px solid ${h.color}33` }}>
              <p className="font-bold text-sm leading-snug text-gray-800">{round.question}</p>
            </div>
          )}

          <div className="rounded-xl border-2 px-4 py-3 text-center transition-all"
            style={{
              borderColor: status === 'correct' ? '#10b981' : status === 'wrong' ? '#ef4444' : h.color + '66',
              background: status === 'correct' ? '#d1fae5' : status === 'wrong' ? '#fee2e2' : '#f5f3ff',
              animation: status === 'wrong' ? 'imShake 0.4s ease' : undefined,
            }}>
            <span className="font-mono font-bold text-2xl" style={{ color: h.color }}>
              {value || <span style={{ opacity: 0.3 }}>0</span>}
            </span>
            {round.unit && value && <span className="text-sm text-gray-400 ml-2">{round.unit}</span>}
          </div>

          {showHint && (
            <div className="px-4 py-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800"
              style={{ animation: 'imSlideIn 0.2s ease' }}>
              💡 {round.hint}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {keys.map(k => (
              <button key={k} onClick={() => tap(k)}
                className="py-3 rounded-xl font-bold text-sm border-2 border-gray-200 bg-gray-50 hover:scale-105 active:scale-95 transition-all"
                style={{ color: k === 'C' ? '#ef4444' : k === '⌫' ? '#f59e0b' : '#374151' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = h.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
                {k}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={check} disabled={!value}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-40"
              style={{ background: h.color }}>
              Проверить
            </button>
            <button onClick={() => setShowHint(v => !v)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              💡
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ════════════════════════════════════════════════════════
// CSS
// ════════════════════════════════════════════════════════
function ModalStyles() {
  return (
    <style>{`
      @keyframes imBounce   { from{transform:translateY(0) scale(1)} to{transform:translateY(-10px) scale(1.05)} }
      @keyframes imWinDance { from{transform:translateY(0) rotate(-8deg)} to{transform:translateY(-10px) rotate(8deg)} }
      @keyframes imHeroFloat{ from{transform:translateY(0) rotate(-2deg)} to{transform:translateY(-8px) rotate(2deg)} }
      @keyframes imBubble   { from{opacity:0;transform:scale(0.6) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
      @keyframes imSlideIn  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      @keyframes imPopIn    { from{opacity:0;transform:scale(0.5) rotate(-10deg)} to{opacity:1;transform:scale(1) rotate(0)} }
      @keyframes imOptIn    { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
      @keyframes imShake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
      @keyframes imCF       { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(360px) rotate(600deg);opacity:0} }
    `}</style>
  );
}

// ════════════════════════════════════════════════════════
// ROUTER
// ════════════════════════════════════════════════════════
export default function InteractiveGameModal({ activeGame, onClose, onFinish }: Props) {
  if (activeGame.type === 'match')     return <MatchGame     activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'sort')      return <SortGame      activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'oddone')    return <OddOneGame    activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'typetext')  return <TypeTextGame  activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'truefalse') return <TrueFalseGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'numpad')    return <NumpadGame    activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  return null;
}
