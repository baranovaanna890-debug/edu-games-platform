import { useState, useEffect } from 'react';
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
// РОУТЕР
// ============================================================
export default function InteractiveGameModal({ activeGame, onClose, onFinish }: Props) {
  if (activeGame.type === 'match') return <MatchGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  if (activeGame.type === 'sort') return <SortGame activeGame={activeGame} onClose={onClose} onFinish={onFinish} />;
  return null;
}
