import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import type { Game } from '@/data/games';

interface Props {
  activeGame: Game;
  onClose: () => void;
  onFinish: (xpEarned: number) => void;
}

// ============================================================
// ИГРА «СОЕДИНИ ПАРЫ» (type: match)
// ============================================================
function MatchGame({ activeGame, onClose, onFinish }: Props) {
  const pairs = activeGame.matchPairs!;
  const rights = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5);

  const [shuffled] = useState(rights);
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function pickLeft(left: string) {
    if (matches[left]) return;
    setSelected(left);
  }

  function pickRight(right: string) {
    if (!selected) return;
    const correctRight = pairs.find(p => p.left === selected)?.right;
    if (right === correctRight) {
      const newMatches = { ...matches, [selected]: right };
      setMatches(newMatches);
      setSelected(null);
      if (Object.keys(newMatches).length === pairs.length) {
        setTimeout(() => setDone(true), 400);
      }
    } else {
      setWrong(right);
      setTimeout(() => { setWrong(null); }, 800);
    }
  }

  const usedRights = Object.values(matches);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl border-2 border-purple-300 shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between bg-purple-50 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeGame.emoji}</span>
            <div>
              <p className="font-semibold text-purple-800">{activeGame.title}</p>
              <p className="text-xs text-gray-400">{activeGame.grade} · {activeGame.duration}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <Icon name="X" size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-game text-2xl text-purple-700 mb-2">Все пары найдены!</h2>
            <p className="text-gray-500 mb-6">Отлично справился! Все {pairs.length} пар соединены верно.</p>
            <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <span className="text-2xl">⚡</span>
              <span className="font-game text-yellow-500 text-lg">+{activeGame.xp} XP</span>
            </div>
            <button onClick={() => onFinish(activeGame.xp)} className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600">
              К каталогу
            </button>
          </div>
        ) : (
          <div className="p-5">
            <p className="text-sm text-gray-500 mb-4 text-center">Нажми на левую карточку, затем на подходящую правую</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase text-center mb-1">Устройство</p>
                {pairs.map(pair => {
                  const isMatched = !!matches[pair.left];
                  const isSelected = selected === pair.left;
                  return (
                    <button
                      key={pair.left}
                      onClick={() => pickLeft(pair.left)}
                      disabled={isMatched}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm border-2 transition-all"
                      style={{
                        background: isMatched ? '#d1fae5' : isSelected ? '#ede9fe' : '#f9fafb',
                        borderColor: isMatched ? '#10b981' : isSelected ? '#7c3aed' : '#e5e7eb',
                        color: isMatched ? '#065f46' : '#374151',
                        opacity: isMatched ? 0.7 : 1,
                      }}
                    >
                      {pair.left} {isMatched && '✓'}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase text-center mb-1">Назначение</p>
                {shuffled.map(right => {
                  const isMatched = usedRights.includes(right);
                  const isWrong = wrong === right;
                  return (
                    <button
                      key={right}
                      onClick={() => pickRight(right)}
                      disabled={isMatched}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm border-2 transition-all"
                      style={{
                        background: isMatched ? '#d1fae5' : isWrong ? '#fee2e2' : '#f9fafb',
                        borderColor: isMatched ? '#10b981' : isWrong ? '#ef4444' : '#e5e7eb',
                        color: isMatched ? '#065f46' : isWrong ? '#991b1b' : '#374151',
                        opacity: isMatched ? 0.7 : 1,
                      }}
                    >
                      {right} {isMatched && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-400">
              Совпадений: {Object.keys(matches).length} / {pairs.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ИГРА «РАССТАВЬ ПО ПОРЯДКУ» (type: sort)
// ============================================================
function SortGame({ activeGame, onClose, onFinish }: Props) {
  const items = activeGame.sortItems!;
  const [shuffled] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<boolean[]>([]);

  function addItem(value: string) {
    if (order.includes(value)) return;
    setOrder(prev => [...prev, value]);
  }

  function removeItem(value: string) {
    if (checked) return;
    setOrder(prev => prev.filter(v => v !== value));
  }

  function checkAnswer() {
    const correct = [...items].sort((a, b) => a.order - b.order).map(i => i.value);
    const res = order.map((v, i) => v === correct[i]);
    setResult(res);
    setChecked(true);
  }

  const allCorrect = checked && result.every(Boolean) && order.length === items.length;
  const available = shuffled.filter(i => !order.includes(i.value));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl border-2 border-purple-300 shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between bg-purple-50 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeGame.emoji}</span>
            <div>
              <p className="font-semibold text-purple-800">{activeGame.title}</p>
              <p className="text-xs text-gray-400">{activeGame.grade} · {activeGame.duration}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <Icon name="X" size={20} />
          </button>
        </div>

        {allCorrect ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="font-game text-2xl text-purple-700 mb-2">Правильно!</h2>
            <p className="text-gray-500 mb-6">Все шаги расставлены в верном порядке!</p>
            <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <span className="text-2xl">⚡</span>
              <span className="font-game text-yellow-500 text-lg">+{activeGame.xp} XP</span>
            </div>
            <button onClick={() => onFinish(activeGame.xp)} className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600">
              К каталогу
            </button>
          </div>
        ) : (
          <div className="p-5">
            <p className="text-sm text-gray-500 mb-3 text-center">Нажимай на шаги снизу, чтобы выстроить их в правильном порядке</p>

            <div className="mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Твой порядок:</p>
              <div className="min-h-[120px] border-2 border-dashed border-purple-200 rounded-xl p-2 space-y-1.5 bg-purple-50">
                {order.length === 0 && (
                  <p className="text-center text-gray-300 text-sm py-4">Нажми на шаги ниже ↓</p>
                )}
                {order.map((value, i) => (
                  <div
                    key={value}
                    onClick={() => removeItem(value)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border-2 cursor-pointer"
                    style={{
                      background: checked ? (result[i] ? '#d1fae5' : '#fee2e2') : '#ffffff',
                      borderColor: checked ? (result[i] ? '#10b981' : '#ef4444') : '#e5e7eb',
                      color: checked ? (result[i] ? '#065f46' : '#991b1b') : '#374151',
                    }}
                  >
                    <span className="font-bold text-gray-400 w-5">{i + 1}.</span>
                    {value}
                    {!checked && <span className="ml-auto text-gray-300 text-xs">✕</span>}
                    {checked && (result[i] ? <span className="ml-auto">✓</span> : <span className="ml-auto">✗</span>)}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Доступные шаги:</p>
              <div className="space-y-1.5">
                {available.map(item => (
                  <button
                    key={item.value}
                    onClick={() => addItem(item.value)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm border-2 border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    {item.value}
                  </button>
                ))}
              </div>
            </div>

            {!checked && order.length === items.length && (
              <button onClick={checkAnswer} className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600">
                Проверить ответ
              </button>
            )}

            {checked && !allCorrect && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                  Не совсем верно — красные позиции не на своём месте. Попробуй ещё раз!
                </div>
                <button onClick={() => { setOrder([]); setChecked(false); setResult([]); }} className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600">
                  Попробовать снова
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ШАПКА — общий компонент
// ============================================================
function GameHeader({ activeGame, onClose }: { activeGame: Game; onClose: () => void }) {
  return (
    <div className="p-4 flex items-center justify-between bg-purple-50 border-b border-purple-100">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{activeGame.emoji}</span>
        <div>
          <p className="font-semibold text-purple-800">{activeGame.title}</p>
          <p className="text-xs text-gray-400">{activeGame.grade} · {activeGame.duration}</p>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
        <Icon name="X" size={20} />
      </button>
    </div>
  );
}

// ============================================================
// ЭКРАН ПОБЕДЫ — общий компонент
// ============================================================
function WinScreen({ xp, onFinish, label = 'Отличная работа!' }: { xp: number; onFinish: () => void; label?: string }) {
  return (
    <div className="p-8 text-center">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="font-game text-2xl text-purple-700 mb-2">{label}</h2>
      <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
        <span className="text-2xl">⚡</span>
        <span className="font-game text-yellow-500 text-lg">+{xp} XP</span>
      </div>
      <button onClick={onFinish} className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors">
        К каталогу
      </button>
    </div>
  );
}

// ============================================================
// ИГРА «НАЙДИ ЛИШНЕЕ» (type: oddone)
// ============================================================
function OddOneGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.oddOneRounds!;
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);

  const round = rounds[idx];

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i !== round.oddIndex) setErrors(e => e + 1);
    setTimeout(() => {
      if (idx + 1 >= rounds.length) {
        setDone(true);
      } else {
        setIdx(n => n + 1);
        setChosen(null);
      }
    }, 1200);
  }

  const xpEarned = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl border-2 border-orange-300 shadow-2xl w-full max-w-md overflow-hidden">
        <GameHeader activeGame={activeGame} onClose={onClose} />

        {done ? (
          <WinScreen xp={xpEarned} onFinish={() => onFinish(xpEarned)} label={errors === 0 ? 'Ни одной ошибки! 🎯' : 'Раунды пройдены!'} />
        ) : (
          <div className="p-6">
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>Раунд {idx + 1} из {rounds.length}</span>
              <span>Ошибок: {errors}</span>
            </div>
            <p className="text-center text-gray-700 font-semibold mb-5 text-sm">Найди лишнее — три связаны, одно чужое</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {round.items.map((item, i) => {
                const isChosen = chosen === i;
                const isCorrect = i === round.oddIndex;
                let bg = '#f9fafb', border = '#e5e7eb', color = '#374151';
                if (isChosen && isCorrect) { bg = '#d1fae5'; border = '#10b981'; color = '#065f46'; }
                else if (isChosen && !isCorrect) { bg = '#fee2e2'; border = '#ef4444'; color = '#991b1b'; }
                else if (chosen !== null && isCorrect) { bg = '#d1fae5'; border = '#10b981'; color = '#065f46'; }

                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    className="py-4 px-3 rounded-xl font-semibold text-sm border-2 transition-all text-center"
                    style={{ background: bg, borderColor: border, color }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {chosen !== null && (
              <div
                className="mt-2 px-4 py-3 rounded-xl text-xs leading-relaxed border-2"
                style={{
                  background: chosen === round.oddIndex ? '#d1fae5' : '#fff7ed',
                  borderColor: chosen === round.oddIndex ? '#10b981' : '#f59e0b',
                  color: chosen === round.oddIndex ? '#065f46' : '#92400e',
                }}
              >
                💡 {round.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ИГРА «НАПЕЧАТАЙ КОД» (type: typetext)
// ============================================================
function TypeTextGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.typeTextRounds!;
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const round = rounds[idx];

  useEffect(() => {
    setValue('');
    setStatus('idle');
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [idx]);

  function check() {
    const trimmed = value.trim();
    if (trimmed === round.answer) {
      setStatus('correct');
      setTimeout(() => {
        if (idx + 1 >= rounds.length) setDone(true);
        else setIdx(n => n + 1);
      }, 900);
    } else {
      setStatus('wrong');
      setErrors(e => e + 1);
    }
  }

  const xpEarned = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.65), 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl border-2 border-cyan-300 shadow-2xl w-full max-w-lg overflow-hidden">
        <GameHeader activeGame={activeGame} onClose={onClose} />

        {done ? (
          <WinScreen xp={xpEarned} onFinish={() => onFinish(xpEarned)} label={errors === 0 ? 'Идеальный синтаксис! ✨' : 'Код написан!'} />
        ) : (
          <div className="p-6">
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>Задание {idx + 1} из {rounds.length}</span>
              <span>Ошибок: {errors}</span>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <p className="text-cyan-300 text-xs font-mono mb-1"># {round.prompt}</p>
              <p className="text-gray-400 text-xs font-mono"># Напечатай правильную строку ниже</p>
            </div>

            <input
              ref={inputRef}
              value={value}
              onChange={e => { setValue(e.target.value); setStatus('idle'); }}
              onKeyDown={e => { if (e.key === 'Enter') check(); }}
              placeholder="Введи код здесь..."
              spellCheck={false}
              className="w-full px-4 py-3 rounded-xl font-mono text-sm border-2 outline-none transition-colors mb-3"
              style={{
                borderColor: status === 'correct' ? '#10b981' : status === 'wrong' ? '#ef4444' : '#e5e7eb',
                background: status === 'correct' ? '#d1fae5' : status === 'wrong' ? '#fff1f1' : '#f9fafb',
              }}
            />

            {status === 'wrong' && (
              <p className="text-red-500 text-xs mb-3">Не совсем точно — проверь каждый символ, включая скобки и кавычки</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={check}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
              >
                Проверить (Enter)
              </button>
              <button
                onClick={() => setShowHint(h => !h)}
                className="px-4 py-2.5 rounded-xl text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                💡
              </button>
            </div>

            {showHint && (
              <div className="mt-3 px-4 py-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
                Подсказка: {round.hint}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ИГРА «ВЕРНО / НЕВЕРНО» (type: truefalse)
// ============================================================
function TrueFalseGame({ activeGame, onClose, onFinish }: Props) {
  const cards = activeGame.trueFalseCards!;
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);

  const card = cards[idx];

  function answer(val: boolean) {
    if (answered !== null) return;
    setAnswered(val);
    if (val !== card.isTrue) setErrors(e => e + 1);
    setTimeout(() => {
      if (idx + 1 >= cards.length) setDone(true);
      else { setIdx(n => n + 1); setAnswered(null); }
    }, 1400);
  }

  const isCorrect = answered !== null && answered === card.isTrue;
  const xpEarned = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.65), 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl border-2 border-green-300 shadow-2xl w-full max-w-md overflow-hidden">
        <GameHeader activeGame={activeGame} onClose={onClose} />

        {done ? (
          <WinScreen xp={xpEarned} onFinish={() => onFinish(xpEarned)} label={errors === 0 ? 'Всё верно! Эксперт! 🧠' : 'Карточки пройдены!'} />
        ) : (
          <div className="p-6">
            <div className="flex justify-between text-xs text-gray-400 mb-5">
              <span>Карточка {idx + 1} из {cards.length}</span>
              <span>Ошибок: {errors}</span>
            </div>

            {/* Карточка */}
            <div
              className="min-h-[130px] rounded-2xl border-2 flex items-center justify-center p-6 mb-6 text-center transition-all"
              style={{
                borderColor: answered === null ? '#d1d5db' : isCorrect ? '#10b981' : '#ef4444',
                background: answered === null ? '#f9fafb' : isCorrect ? '#d1fae5' : '#fee2e2',
              }}
            >
              <p className="font-semibold text-gray-800 text-base leading-relaxed">
                {card.statement}
              </p>
            </div>

            {answered !== null && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-xs border-2"
                style={{
                  background: isCorrect ? '#ecfdf5' : '#fff7ed',
                  borderColor: isCorrect ? '#10b981' : '#f59e0b',
                  color: isCorrect ? '#065f46' : '#92400e',
                }}
              >
                {isCorrect ? '✅' : '💡'} {card.explanation}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => answer(true)}
                disabled={answered !== null}
                className="py-4 rounded-xl font-bold text-lg border-2 border-green-300 text-green-700 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                ✅ Верно
              </button>
              <button
                onClick={() => answer(false)}
                disabled={answered !== null}
                className="py-4 rounded-xl font-bold text-lg border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                ❌ Неверно
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ИГРА «ЧИСЛОВОЙ ВВОД» (type: numpad)
// ============================================================
function NumpadGame({ activeGame, onClose, onFinish }: Props) {
  const rounds = activeGame.numpadRounds!;
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [errors, setErrors] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const round = rounds[idx];

  useEffect(() => {
    setValue('');
    setStatus('idle');
    setShowHint(false);
  }, [idx]);

  function tap(digit: string) {
    if (status === 'correct') return;
    setStatus('idle');
    if (digit === '⌫') setValue(v => v.slice(0, -1));
    else if (digit === 'C') setValue('');
    else setValue(v => v + digit);
  }

  function check() {
    const num = parseInt(value);
    if (num === round.answer) {
      setStatus('correct');
      setTimeout(() => {
        if (idx + 1 >= rounds.length) setDone(true);
        else setIdx(n => n + 1);
      }, 900);
    } else {
      setStatus('wrong');
      setErrors(e => e + 1);
    }
  }

  const xpEarned = errors === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 15);
  const numpadKeys = ['7','8','9','4','5','6','1','2','3','C','0','⌫'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl border-2 border-indigo-300 shadow-2xl w-full max-w-sm overflow-hidden">
        <GameHeader activeGame={activeGame} onClose={onClose} />

        {done ? (
          <WinScreen xp={xpEarned} onFinish={() => onFinish(xpEarned)} label={errors === 0 ? 'Все числа верны! 🔢' : 'Раунды пройдены!'} />
        ) : (
          <div className="p-5">
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>Вопрос {idx + 1} из {rounds.length}</span>
              <span>Ошибок: {errors}</span>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-700 text-sm font-semibold leading-snug">{round.question}</p>
            </div>

            {/* Дисплей */}
            <div
              className="rounded-xl border-2 px-5 py-3 mb-4 text-center text-2xl font-mono font-bold transition-colors"
              style={{
                borderColor: status === 'correct' ? '#10b981' : status === 'wrong' ? '#ef4444' : '#c7d2fe',
                background: status === 'correct' ? '#d1fae5' : status === 'wrong' ? '#fee2e2' : '#f5f3ff',
                color: status === 'correct' ? '#065f46' : status === 'wrong' ? '#991b1b' : '#4338ca',
              }}
            >
              {value || <span className="text-gray-300">0</span>}
              {round.unit && value && <span className="text-base font-normal text-gray-400 ml-2">{round.unit}</span>}
            </div>

            {status === 'wrong' && (
              <p className="text-red-500 text-xs text-center mb-2">Неверно, попробуй ещё раз</p>
            )}

            {/* Нампад */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {numpadKeys.map(k => (
                <button
                  key={k}
                  onClick={() => tap(k)}
                  className="py-3 rounded-xl font-bold text-sm border-2 border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                  style={{ color: k === 'C' ? '#ef4444' : k === '⌫' ? '#f59e0b' : '#374151' }}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={check}
                disabled={!value}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-40"
              >
                Проверить
              </button>
              <button
                onClick={() => setShowHint(h => !h)}
                className="px-4 py-2.5 rounded-xl text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                💡
              </button>
            </div>

            {showHint && (
              <div className="mt-3 px-4 py-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
                Подсказка: {round.hint}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// РОУТЕР
// ============================================================
export default function InteractiveGameModal({ activeGame, onClose, onFinish }: Props) {
  if (activeGame.type === 'match') return <MatchGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'sort') return <SortGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'oddone') return <OddOneGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'typetext') return <TypeTextGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'truefalse') return <TrueFalseGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'numpad') return <NumpadGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  return null;
}