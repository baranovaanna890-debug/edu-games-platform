import { useState } from 'react';
import { type Game, type Difficulty } from '@/data/games';
import Navbar from '@/components/Navbar';
import GameModal from '@/components/GameModal';
import { CatalogSection, GamesSection } from '@/components/CatalogSection';
import { StatsSection, CertificateSection, RatingSection, ContactSection } from '@/components/SideSection';

type Section = 'catalog' | 'games' | 'stats' | 'certificate' | 'rating' | 'contact';

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

  return (
    <div className="min-h-screen grid-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar
        section={section}
        setSection={setSection}
        totalXP={totalXP}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {section === 'catalog' && (
          <CatalogSection
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            completedGames={completedGames}
            totalXP={totalXP}
            onStartGame={startGame}
            onNavigateToSection={setSection}
          />
        )}

        {section === 'games' && (
          <GamesSection
            completedGames={completedGames}
            totalXP={totalXP}
            setSelectedDifficulty={setSelectedDifficulty}
            setSection={setSection}
          />
        )}

        {section === 'stats' && (
          <StatsSection completedGames={completedGames} totalXP={totalXP} />
        )}

        {section === 'certificate' && (
          <CertificateSection completedGames={completedGames} totalXP={totalXP} />
        )}

        {section === 'rating' && (
          <RatingSection completedGames={completedGames} totalXP={totalXP} />
        )}

        {section === 'contact' && (
          <ContactSection />
        )}
      </main>

      <footer className="border-t-2 border-purple-100 mt-16 py-6 text-center bg-white">
        <p className="text-gray-400 text-sm">🎓 КодоГерой · Дидактические игры по информатике · 7-9 класс</p>
      </footer>

      {activeGame && (
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