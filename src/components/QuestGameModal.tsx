import { useState, useEffect, useRef } from 'react';
import type { Game, QuestScene } from '@/data/games';
import Icon from '@/components/ui/icon';

interface Props {
  activeGame: Game;
  onClose: () => void;
  onFinish: (xpEarned: number) => void;
}

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    function tick() {
      i++;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        ref.current = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    }
    ref.current = setTimeout(tick, speed);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [text, speed]);

  function skip() {
    if (ref.current) clearTimeout(ref.current);
    setDisplayed(text);
    setDone(true);
  }

  return { displayed, done, skip };
}

export default function QuestGameModal({ activeGame, onClose, onFinish }: Props) {
  const quest = activeGame.quest!;
  const [sceneId, setSceneId] = useState(quest.startId);
  const [response, setResponse] = useState<string | null>(null);
  const [showChoices, setShowChoices] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const scene: QuestScene = quest.scenes.find(s => s.id === sceneId)!;
  const { displayed, done, skip } = useTypewriter(response ?? scene.text);

  useEffect(() => {
    setResponse(null);
    setShowChoices(false);
  }, [sceneId]);

  useEffect(() => {
    if (done && !response) {
      const t = setTimeout(() => setShowChoices(true), 200);
      return () => clearTimeout(t);
    }
  }, [done, response]);

  function handleChoice(choice: { label: string; correct: boolean; nextId: string; response: string }) {
    if (choice.correct) setScore(s => s + 1);
    else setWrongCount(w => w + 1);
    setResponse(choice.response);
    const t = setTimeout(() => {
      setResponse(null);
      setShowChoices(false);
      setSceneId(choice.nextId);
    }, 1800);
    return () => clearTimeout(t);
  }

  function handleNext() {
    if (scene.isEnd) {
      setFinished(true);
      return;
    }
    if (scene.nextId) {
      setShowChoices(false);
      setSceneId(scene.nextId);
    }
  }

  const xpEarned = wrongCount === 0 ? activeGame.xp : Math.max(Math.floor(activeGame.xp * 0.6), 20);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
    >
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border-2 border-purple-300 shadow-2xl overflow-hidden">

        {/* Шапка */}
        <div className="flex items-center justify-between px-4 py-3 bg-purple-700">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeGame.emoji}</span>
            <span className="text-white font-semibold text-sm">{activeGame.title}</span>
          </div>
          <button onClick={onClose} className="text-purple-200 hover:text-white">
            <Icon name="X" size={18} />
          </button>
        </div>

        {finished ? (
          /* Экран завершения */
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">{wrongCount === 0 ? '🏆' : '⭐'}</div>
            <h2 className="font-game text-2xl text-purple-700 mb-2">
              {wrongCount === 0 ? 'Безупречно!' : 'Квест пройден!'}
            </h2>
            <p className="text-gray-500 mb-2 text-sm">
              {wrongCount === 0
                ? 'Ты ответил на все вопросы с первой попытки!'
                : `Допущено ошибок: ${wrongCount}. Попробуй ещё раз для полного результата!`}
            </p>
            <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <span className="text-2xl">⚡</span>
              <span className="font-game text-yellow-500 text-xl">+{xpEarned} XP</span>
            </div>
            <button
              onClick={() => onFinish(xpEarned)}
              className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Вернуться к каталогу
            </button>
          </div>
        ) : (
          <div>
            {/* Сцена с персонажем */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 min-h-[180px] flex flex-col gap-3">

              {/* Аватар + имя */}
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-2xl border-2 border-purple-300 bg-white shadow"
                >
                  {scene.avatar}
                </div>
                <span className="font-bold text-purple-800 text-sm">{scene.character}</span>
              </div>

              {/* Пузырь с текстом */}
              <div
                className="relative bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow border border-purple-100 cursor-pointer select-none"
                onClick={() => { if (!done) skip(); }}
              >
                <p className="text-gray-800 text-sm leading-relaxed min-h-[48px]">
                  {displayed}
                  {!done && <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 align-middle" style={{ animation: 'blink 0.8s step-end infinite' }} />}
                </p>
                {!done && (
                  <span className="absolute bottom-2 right-3 text-xs text-gray-300">нажми чтобы пропустить</span>
                )}
              </div>

            </div>

            {/* Варианты ответов / кнопка далее */}
            <div className="px-4 pb-4 pt-3 space-y-2 bg-white">
              {scene.type === 'result' && done && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Завершить квест 🎉
                </button>
              )}

              {scene.type === 'choice' && showChoices && !response && (
                <div className="space-y-2">
                  {scene.choices!.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(c)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm border-2 border-gray-200 bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-all font-medium text-gray-700"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              {scene.type === 'dialog' && done && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors text-sm"
                >
                  Продолжить →
                </button>
              )}

              {response && (
                <div
                  className="px-4 py-3 rounded-xl text-sm font-medium border-2"
                  style={{
                    background: response.startsWith('✅') ? '#d1fae5' : '#fee2e2',
                    borderColor: response.startsWith('✅') ? '#10b981' : '#ef4444',
                    color: response.startsWith('✅') ? '#065f46' : '#991b1b',
                  }}
                >
                  {response}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
