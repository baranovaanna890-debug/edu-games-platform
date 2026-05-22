import { useState } from 'react';
import { type Game, type Difficulty } from '@/data/games';
import { CatalogSection } from '@/components/CatalogSection';
import { StatsSection, CertificateSection, ContactSection } from '@/components/SideSection';
import GameModal from '@/components/GameModal';
import InteractiveGameModal from '@/components/InteractiveGameModal';

type Section = 'catalog' | 'stats' | 'certificate' | 'contact';

const navItems: { id: Section; label: string }[] = [
  { id: 'catalog', label: '📚 Игры' },
  { id: 'stats', label: '📊 Прогресс' },
  { id: 'certificate', label: '🏆 Сертификат' },
  { id: 'contact', label: '💬 Контакты' },
];

export default function Index() {
  const [section, setSection] = useState<Section>('catalog');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | Difficulty>('all');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [gameStep, setGameStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [completedGames, setCompletedGames] = useState<number[]>([]);
  const [totalXP, setTotalXP] = useState(0);

  function startGame(game: Game) {
    setActiveGame(game);
    setGameStep(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setGameFinished(false);
  }

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (activeGame?.questions && idx === activeGame.questions[gameStep].correct) {
      setScore(s => s + 1);
    }
  }

  function nextQuestion() {
    if (!activeGame?.questions) return;
    const isCorrect = selectedAnswer === activeGame.questions[gameStep].correct;
    const newScore = score + (isCorrect ? 1 : 0);
    if (gameStep + 1 >= activeGame.questions.length) {
      setScore(newScore);
      setGameFinished(true);
      if (!completedGames.includes(activeGame.id)) {
        setCompletedGames(prev => [...prev, activeGame.id]);
        const earned = newScore === activeGame.questions.length ? activeGame.xp : Math.floor(activeGame.xp * 0.6);
        setTotalXP(prev => prev + earned);
      }
    } else {
      setGameStep(s => s + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }

  function handleInteractiveFinish(xpEarned: number) {
    if (activeGame && !completedGames.includes(activeGame.id)) {
      setCompletedGames(prev => [...prev, activeGame.id]);
      setTotalXP(prev => prev + xpEarned);
    }
    setActiveGame(null);
  }

  const isInteractive = activeGame && (activeGame.type === 'match' || activeGame.type === 'sort');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b-2 border-purple-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-game text-purple-700 text-lg">КодоГерой</span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  background: section === item.id ? '#7c3aed' : 'transparent',
                  color: section === item.id ? 'white' : '#6b7280',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-300">
            <span>⚡</span>
            <span className="font-semibold text-sm text-yellow-600">{totalXP} XP</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {section === 'catalog' && (
          <CatalogSection
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            completedGames={completedGames}
            totalXP={totalXP}
            onStartGame={startGame}
            onNavigateToSection={() => {}}
          />
        )}
        {section === 'stats' && (
          <StatsSection completedGames={completedGames} totalXP={totalXP} />
        )}
        {section === 'certificate' && (
          <CertificateSection completedGames={completedGames} totalXP={totalXP} />
        )}
        {section === 'contact' && (
          <ContactSection />
        )}
      </main>

      <footer className="border-t border-gray-200 mt-12 py-4 text-center">
        <p className="text-gray-400 text-sm">КодоГерой · Дидактические игры по информатике · 7-9 класс</p>
      </footer>

      {activeGame && isInteractive && (
        <InteractiveGameModal
          activeGame={activeGame}
          onClose={() => setActiveGame(null)}
          onFinish={handleInteractiveFinish}
        />
      )}

      {activeGame && !isInteractive && (
        <GameModal
          activeGame={activeGame}
          gameStep={gameStep}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          score={score}
          gameFinished={gameFinished}
          onClose={() => setActiveGame(null)}
          onAnswer={handleAnswer}
          onNext={nextQuestion}
          onRestart={() => startGame(activeGame)}
          onGoToCatalog={() => { setActiveGame(null); setSection('catalog'); }}
        />
      )}
    </div>
  );
}
