import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import type { Game } from '@/data/games';

interface Props {
  activeGame: Game;
  onClose: () => void;
  onFinish: (xpEarned: number) => void;
}

// ── Shared ──────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#f59e0b', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="absolute rounded-sm"
          style={{
            width: 6, height: 6,
            left: `${5 + (i * 4.8) % 90}%`, top: '-8px',
            background: colors[i % colors.length],
            animation: `cfFall ${0.5 + (i % 5) * 0.12}s ease ${(i % 7) * 0.05}s forwards`,
            transform: `rotate(${i * 37}deg)`,
          }} />
      ))}
    </div>
  );
}

function WinScreen({ xp, emoji, title, sub, onFinish }: { xp: number; emoji: string; title: string; sub: string; onFinish: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="text-6xl mb-3" style={{ animation: 'winBounce 0.8s ease infinite alternate' }}>{emoji}</div>
      <h2 className="font-game text-2xl text-purple-700 mb-1">{title}</h2>
      <p className="text-gray-400 text-sm mb-5">{sub}</p>
      <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-50 border-2 border-yellow-200 mb-6">
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

function ModalShell({ children, onClose, title, emoji, grade, duration, accent = '#7c3aed' }:
  { children: React.ReactNode; onClose: () => void; title: string; emoji: string; grade: string; duration: string; accent?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        style={{ border: `2px solid ${accent}44`, maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Шапка */}
        <div className="flex items-center justify-between px-4 py-3 border-b"
          style={{ background: `${accent}12`, borderColor: `${accent}22` }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{emoji}</span>
            <div>
              <p className="font-bold text-gray-800 text-sm">{title}</p>
              <p className="text-xs text-gray-400">{grade} · {duration}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>
        {children}
      </div>
      <style>{`
        @keyframes winBounce { from{transform:translateY(0) scale(1)} to{transform:translateY(-10px) scale(1.05)} }
        @keyframes cfFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(340px) rotate(540deg);opacity:0} }
        @keyframes popIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes pulse-green { 0%,100%{box-shadow:0 0 0 0 #34d39940} 50%{box-shadow:0 0 0 8px #34d39900} }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// 🔗 СОЕДИНИ ПАРЫ (match)
// ══════════════════════════════════════════════════════
function MatchGame({ activeGame, onClose, onFinish }: Props) {
  const pairs = activeGame.matchPairs!;
  const [shuffled] = useState(() => [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrongRight, setWrongRight] = useState<string | null>(null);
  const [wrongLeft, setWrongLeft] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [justMatched, setJustMatched] = useState<string | null>(null);

  function pickLeft(left: string) {
    if (matches[left]) return;
    setSelected(s => s === left ? null : left);
  }

  function pickRight(right: string) {
    if (!selected) return;
    const correct = pairs.find(p => p.left === selected)?.right;
    if (right === correct) {
      const m = { ...matches, [selected]: right };
      setMatches(m);
      setJustMatched(selected);
      setTimeout(() => setJustMatched(null), 600);
      setSelected(null);
      if (Object.keys(m).length === pairs.length) {
        setConfetti(true);
        setTimeout(() => setDone(true), 700);
      }
    } else {
      setWrongRight(right); setWrongLeft(selected);
      setTimeout(() => { setWrongRight(null); setWrongLeft(null); }, 600);
    }
  }

  const usedRights = Object.values(matches);

  return (
    <ModalShell onClose={onClose} title={activeGame.title} emoji={activeGame.emoji}
      grade={activeGame.grade} duration={activeGame.duration} accent="#7c3aed">
      {done ? (
        <WinScreen xp={activeGame.xp} emoji="🎉" title="Все пары найдены!"
          sub={`Соединено ${pairs.length} из ${pairs.length} пар`}
          onFinish={() => onFinish(activeGame.xp)} />
      ) : (
        <div className="relative p-5">
          <Confetti active={confetti} />
          <p className="text-center text-sm text-gray-500 mb-4">
            Нажми слово слева → затем подходящее справа
          </p>

          {/* Прогресс-бар */}
          <div className="h-1.5 rounded-full bg-gray-100 mb-5 overflow-hidden">
            <div className="h-full rounded-full bg-purple-500 transition-all duration-500"
              style={{ width: `${(Object.keys(matches).length / pairs.length) * 100}%` }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Левая колонка */}
            <div className="space-y-2">
              {pairs.map((p, i) => {
                const isMatched = !!matches[p.left];
                const isSel = selected === p.left;
                const isWrong = wrongLeft === p.left;
                return (
                  <button key={p.left} onClick={() => pickLeft(p.left)} disabled={isMatched}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                    style={{
                      animation: isMatched && justMatched === p.left ? 'popIn 0.3s ease' : isWrong ? 'shake 0.4s ease' : `slideUp 0.3s ease ${i * 60}ms both`,
                      background: isMatched ? '#d1fae5' : isSel ? '#ede9fe' : '#f9fafb',
                      borderColor: isMatched ? '#10b981' : isSel ? '#7c3aed' : '#e5e7eb',
                      color: isMatched ? '#065f46' : isSel ? '#5b21b6' : '#374151',
                      boxShadow: isSel ? '0 0 0 3px #7c3aed22' : isMatched ? '0 0 0 3px #10b98122' : 'none',
                    }}>
                    {p.left} {isMatched && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Правая колонка */}
            <div className="space-y-2">
              {shuffled.map((r, i) => {
                const isMatched = usedRights.includes(r);
                const isWrong = wrongRight === r;
                return (
                  <button key={r} onClick={() => pickRight(r)} disabled={isMatched || !selected}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                    style={{
                      animation: isMatched ? 'popIn 0.3s ease' : isWrong ? 'shake 0.4s ease' : `slideUp 0.3s ease ${i * 60}ms both`,
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
    </ModalShell>
  );
}

// ══════════════════════════════════════════════════════
// 📋 РАССТАВЬ ПО ПОРЯДКУ (sort)
// ══════════════════════════════════════════════════════
function SortGame({ activeGame, onClose, onFinish }: Props) {
  const items = activeGame.sortItems!;
  const [shuffled] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<boolean[]>([]);
  const [confetti, setConfetti] = useState(false);

  const correct = [...items].sort((a, b) => a.order - b.order).map(i => i.value);

  function addItem(v: string) {
    if (!order.includes(v)) setOrder(prev => [...prev, v]);
  }
  function removeItem(v: string) {
    if (checked) return;
    setOrder(prev => prev.filter(x => x !== v));
  }

  function checkAnswer() {
    const res = order.map((v, i) => v === correct[i]);
    setResult(res);
    setChecked(true);
    if (res.every(Boolean) && order.length === items.length) {
      setConfetti(true);
    }
  }

  const allCorrect = checked && result.every(Boolean) && order.length === items.length;
  const available = shuffled.filter(i => !order.includes(i.value));

  return (
    <ModalShell onClose={onClose} title={activeGame.title} emoji={activeGame.emoji}
      grade={activeGame.grade} duration={activeGame.duration} accent="#0891b2">
      {allCorrect ? (
        <WinScreen xp={activeGame.xp} emoji="🏆" title="Правильный порядок!"
          sub="Все шаги расставлены верно" onFinish={() => onFinish(activeGame.xp)} />
      ) : (
        <div className="relative p-5">
          <Confetti active={confetti} />
          <p className="text-center text-sm text-gray-500 mb-4">Нажимай элементы снизу — они встанут по порядку</p>

          {/* Зона порядка */}
          <div className="min-h-[120px] rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50 p-3 mb-4">
            <p className="text-xs font-bold text-cyan-600 mb-2 uppercase tracking-wide">Твой порядок</p>
            {order.length === 0
              ? <p className="text-cyan-300 text-sm text-center mt-4">Пока пусто...</p>
              : (
                <div className="space-y-1.5">
                  {order.map((v, i) => {
                    const ok = checked ? result[i] : null;
                    return (
                      <div key={i} onClick={() => removeItem(v)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all hover:opacity-80"
                        style={{
                          background: ok === true ? '#d1fae5' : ok === false ? '#fee2e2' : 'white',
                          border: `2px solid ${ok === true ? '#10b981' : ok === false ? '#ef4444' : '#e5e7eb'}`,
                          animation: `slideUp 0.2s ease ${i * 50}ms both`,
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
              )
            }
          </div>

          {/* Доступные элементы */}
          <div className="flex flex-wrap gap-2 mb-4">
            {available.map((it, i) => (
              <button key={it.value} onClick={() => addItem(it.value)}
                className="px-3 py-2 rounded-xl text-sm font-medium border-2 border-gray-200 bg-white hover:border-cyan-400 hover:bg-cyan-50 transition-all hover:scale-105 active:scale-95"
                style={{ animation: `popIn 0.25s ease ${i * 50}ms both` }}>
                {it.value}
              </button>
            ))}
          </div>

          {/* Кнопки */}
          <div className="flex gap-2">
            {!checked ? (
              <button onClick={checkAnswer} disabled={order.length !== items.length}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors disabled:opacity-40">
                Проверить ✓
              </button>
            ) : !allCorrect ? (
              <button onClick={() => { setOrder([]); setChecked(false); setResult([]); }}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                ↺ Попробовать снова
              </button>
            ) : null}
          </div>
        </div>
      )}
    </ModalShell>
  );
}

// ══════════════════════════════════════════════════════
// 🔍 НАЙДИ ЛИШНЕЕ (oddone)
// ══════════════════════════════════════════════════════
function OddOneGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.oddOneRounds!;
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [entering, setEntering] = useState(false);

  const round = rounds[idx];

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i !== round.oddIndex) setErrors(e => e + 1);
    else { setConfetti(true); setTimeout(() => setConfetti(false), 700); }
    setTimeout(() => {
      if (idx + 1 >= rounds.length) { setDone(true); return; }
      setEntering(true);
      setTimeout(() => { setIdx(n => n + 1); setChosen(null); setEntering(false); }, 350);
    }, 1200);
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <ModalShell onClose={onClose} title={activeGame.title} emoji={activeGame.emoji}
      grade={activeGame.grade} duration={activeGame.duration} accent="#ea580c">
      {done ? (
        <WinScreen xp={xp} emoji="🎯" title={errors === 0 ? 'Ни одной ошибки!' : 'Раунды пройдены!'}
          sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
      ) : (
        <div className={`relative p-5 transition-opacity duration-300 ${entering ? 'opacity-0' : 'opacity-100'}`}>
          <Confetti active={confetti} />

          {/* Прогресс */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-1.5">
              {rounds.map((_, i) => (
                <div key={i} className="w-6 h-1.5 rounded-full transition-all"
                  style={{ background: i < idx ? '#f97316' : i === idx ? '#f97316' : '#e5e7eb', opacity: i <= idx ? 1 : 0.3 }} />
              ))}
            </div>
            <span className="text-xs text-gray-400">Ошибок: {errors}</span>
          </div>

          <p className="text-center font-semibold text-gray-700 mb-5 text-sm">
            🔎 Три связаны, одно — лишнее. Найди его!
          </p>

          <div className="grid grid-cols-2 gap-3">
            {round.items.map((item, i) => {
              const isChosen = chosen === i;
              const isOdd = i === round.oddIndex;
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
                    animation: `popIn 0.3s ease ${i * 70}ms both`,
                    transform: chosen !== null && !isOdd && !isChosen ? 'scale(0.95)' : undefined,
                  }}>
                  {item}
                </button>
              );
            })}
          </div>

          {chosen !== null && (
            <div className="mt-4 px-4 py-3 rounded-xl text-xs leading-relaxed border-2"
              style={{
                background: chosen === round.oddIndex ? '#ecfdf5' : '#fff7ed',
                borderColor: chosen === round.oddIndex ? '#10b981' : '#f59e0b',
                color: chosen === round.oddIndex ? '#065f46' : '#92400e',
                animation: 'slideUp 0.3s ease both',
              }}>
              💡 {round.explanation}
            </div>
          )}
        </div>
      )}
    </ModalShell>
  );
}

// ══════════════════════════════════════════════════════
// ⌨️ НАПЕЧАТАЙ КОД (typetext)
// ══════════════════════════════════════════════════════
function TypeTextGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.typeTextRounds!;
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const round = rounds[idx];

  useEffect(() => {
    setValue(''); setStatus('idle'); setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [idx]);

  function check() {
    if (value.trim() === round.answer) {
      setStatus('correct');
      setConfetti(true); setTimeout(() => setConfetti(false), 700);
      setTimeout(() => {
        if (idx + 1 >= rounds.length) setDone(true);
        else setIdx(n => n + 1);
      }, 900);
    } else {
      setStatus('wrong');
      setErrors(e => e + 1);
      setTimeout(() => setStatus('idle'), 800);
    }
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <ModalShell onClose={onClose} title={activeGame.title} emoji={activeGame.emoji}
      grade={activeGame.grade} duration={activeGame.duration} accent="#0891b2">
      {done ? (
        <WinScreen xp={xp} emoji="✨" title={errors === 0 ? 'Идеальный синтаксис!' : 'Код написан!'}
          sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
      ) : (
        <div className="relative p-5 space-y-4">
          <Confetti active={confetti} />

          {/* Прогресс */}
          <div className="flex gap-1.5 justify-center">
            {rounds.map((_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
                style={{ background: i < idx ? '#06b6d4' : i === idx ? '#06b6d4' : '#e5e7eb', opacity: i <= idx ? 1 : 0.4 }} />
            ))}
          </div>

          {/* Редактор */}
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

          <input ref={inputRef} value={value}
            onChange={e => { setValue(e.target.value); setStatus('idle'); }}
            onKeyDown={e => e.key === 'Enter' && check()}
            spellCheck={false} autoComplete="off"
            placeholder="Напечатай код..."
            className="w-full px-4 py-3 rounded-xl font-mono text-sm border-2 outline-none transition-all"
            style={{
              borderColor: status === 'correct' ? '#10b981' : status === 'wrong' ? '#ef4444' : '#e5e7eb',
              background: status === 'correct' ? '#d1fae5' : status === 'wrong' ? '#fff1f1' : '#f9fafb',
              animation: status === 'wrong' ? 'shake 0.4s ease' : undefined,
            }} />

          {showHint && (
            <div className="px-4 py-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800"
              style={{ animation: 'slideUp 0.2s ease both' }}>
              💡 {round.hint}
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={check}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-cyan-600 hover:bg-cyan-700 transition-colors">
              Проверить ↵
            </button>
            <button onClick={() => setShowHint(h => !h)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm">
              💡
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

// ══════════════════════════════════════════════════════
// ✅ ВЕРНО / НЕВЕРНО (truefalse)
// ══════════════════════════════════════════════════════
function TrueFalseGame({ activeGame, onClose, onFinish }: Props) {
  const cards = activeGame.trueFalseCards!;
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [entering, setEntering] = useState(false);

  const card = cards[idx];
  const isCorrect = answered !== null && answered === card.isTrue;

  function answer(val: boolean) {
    if (answered !== null) return;
    setAnswered(val);
    if (val !== card.isTrue) setErrors(e => e + 1);
    else { setConfetti(true); setTimeout(() => setConfetti(false), 700); }
    setTimeout(() => {
      if (idx + 1 >= cards.length) { setDone(true); return; }
      setEntering(true);
      setTimeout(() => { setIdx(n => n + 1); setAnswered(null); setEntering(false); }, 300);
    }, 1400);
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <ModalShell onClose={onClose} title={activeGame.title} emoji={activeGame.emoji}
      grade={activeGame.grade} duration={activeGame.duration} accent="#16a34a">
      {done ? (
        <WinScreen xp={xp} emoji="🧠" title={errors === 0 ? 'Всё верно! Эксперт!' : 'Карточки пройдены!'}
          sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
      ) : (
        <div className={`relative p-5 space-y-4 transition-opacity duration-200 ${entering ? 'opacity-0' : 'opacity-100'}`}>
          <Confetti active={confetti} />

          {/* Прогресс-точки */}
          <div className="flex justify-center gap-2">
            {cards.map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full transition-all"
                style={{ background: i < idx ? '#16a34a' : i === idx ? '#16a34a' : '#e5e7eb', transform: i === idx ? 'scale(1.3)' : 'scale(1)' }} />
            ))}
          </div>

          {/* Карточка */}
          <div className="min-h-[130px] rounded-2xl border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300"
            style={{
              borderColor: answered === null ? '#e5e7eb' : isCorrect ? '#10b981' : '#ef4444',
              background: answered === null ? '#f9fafb' : isCorrect ? '#d1fae5' : '#fee2e2',
              animation: 'popIn 0.35s ease both',
            }}>
            <span className="text-3xl mb-3">{idx % 2 === 0 ? '💬' : '🤔'}</span>
            <p className="font-semibold text-gray-800 text-base leading-relaxed">{card.statement}</p>
          </div>

          {/* Объяснение */}
          {answered !== null && (
            <div className="px-4 py-3 rounded-xl border-2 text-xs leading-relaxed"
              style={{
                background: isCorrect ? '#f0fdf4' : '#fff7ed',
                borderColor: isCorrect ? '#86efac' : '#fde68a',
                color: isCorrect ? '#166534' : '#92400e',
                animation: 'slideUp 0.3s ease both',
              }}>
              {isCorrect ? '✅' : '💡'} {card.explanation}
            </div>
          )}

          {/* Кнопки */}
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
    </ModalShell>
  );
}

// ══════════════════════════════════════════════════════
// 🔢 ЧИСЛОВОЙ ВВОД (numpad)
// ══════════════════════════════════════════════════════
function NumpadGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.numpadRounds!;
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const round = rounds[idx];

  useEffect(() => { setValue(''); setStatus('idle'); setShowHint(false); }, [idx]);

  function tap(d: string) {
    if (status === 'correct') return;
    setStatus('idle');
    if (d === '⌫') setValue(v => v.slice(0, -1));
    else if (d === 'C') setValue('');
    else if (value.length < 6) setValue(v => v + d);
  }

  function check() {
    if (!value) return;
    if (parseInt(value) === round.answer) {
      setStatus('correct');
      setConfetti(true); setTimeout(() => setConfetti(false), 700);
      setTimeout(() => {
        if (idx + 1 >= rounds.length) setDone(true);
        else setIdx(n => n + 1);
      }, 900);
    } else {
      setStatus('wrong');
      setErrors(e => e + 1);
      setTimeout(() => { setStatus('idle'); setValue(''); }, 700);
    }
  }

  const xp = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);
  const keys = ['7','8','9','4','5','6','1','2','3','C','0','⌫'];

  return (
    <ModalShell onClose={onClose} title={activeGame.title} emoji={activeGame.emoji}
      grade={activeGame.grade} duration={activeGame.duration} accent="#4f46e5">
      {done ? (
        <WinScreen xp={xp} emoji="🔢" title={errors === 0 ? 'Все числа верны!' : 'Раунды пройдены!'}
          sub={`Ошибок: ${errors}`} onFinish={() => onFinish(xp)} />
      ) : (
        <div className="relative p-5 space-y-4">
          <Confetti active={confetti} />

          {/* Прогресс */}
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${(idx / rounds.length) * 100}%` }} />
          </div>

          {/* Вопрос */}
          <div className="rounded-xl bg-indigo-50 border-2 border-indigo-100 p-4 text-center">
            <p className="text-indigo-800 font-bold text-sm leading-snug">{round.question}</p>
          </div>

          {/* Дисплей */}
          <div className="rounded-xl border-2 px-4 py-3 text-center transition-all"
            style={{
              borderColor: status === 'correct' ? '#10b981' : status === 'wrong' ? '#ef4444' : '#c7d2fe',
              background: status === 'correct' ? '#d1fae5' : status === 'wrong' ? '#fee2e2' : '#f5f3ff',
              animation: status === 'wrong' ? 'shake 0.4s ease' : undefined,
            }}>
            <span className="font-mono font-bold text-2xl text-indigo-700">
              {value || <span className="text-indigo-200">0</span>}
            </span>
            {round.unit && value && <span className="text-sm text-gray-400 ml-2">{round.unit}</span>}
          </div>

          {showHint && (
            <div className="px-4 py-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800"
              style={{ animation: 'slideUp 0.2s ease' }}>
              💡 {round.hint}
            </div>
          )}

          {/* Нампад */}
          <div className="grid grid-cols-3 gap-2">
            {keys.map(k => (
              <button key={k} onClick={() => tap(k)}
                className="py-3 rounded-xl font-bold text-sm border-2 border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 hover:scale-105 active:scale-95 transition-all"
                style={{ color: k === 'C' ? '#ef4444' : k === '⌫' ? '#f59e0b' : '#374151' }}>
                {k}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={check} disabled={!value}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-40">
              Проверить
            </button>
            <button onClick={() => setShowHint(h => !h)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              💡
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

// ══════════════════════════════════════════════════════
// РОУТЕР
// ══════════════════════════════════════════════════════
export default function InteractiveGameModal({ activeGame, onClose, onFinish }: Props) {
  if (activeGame.type === 'match')     return <MatchGame     activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'sort')      return <SortGame      activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'oddone')    return <OddOneGame    activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'typetext')  return <TypeTextGame  activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'truefalse') return <TrueFalseGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'numpad')    return <NumpadGame    activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  return null;
}
