import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Difficulty } from '@/data/games';

type Section = 'catalog' | 'games' | 'stats' | 'certificate' | 'rating' | 'contact';

interface NavbarProps {
  section: Section;
  setSection: (s: Section) => void;
  totalXP: number;
  selectedDifficulty: 'all' | Difficulty;
  setSelectedDifficulty: (d: 'all' | Difficulty) => void;
}

const navItems: { id: Section; label: string; emoji: string }[] = [
  { id: 'catalog', label: 'Каталог', emoji: '📚' },
  { id: 'games', label: 'Игры', emoji: '🎮' },
  { id: 'stats', label: 'Статистика', emoji: '📊' },
  { id: 'certificate', label: 'Сертификат', emoji: '🏆' },
  { id: 'rating', label: 'Рейтинг', emoji: '👑' },
  { id: 'contact', label: 'Контакты', emoji: '💬' },
];

export default function Navbar({ section, setSection, totalXP }: NavbarProps) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b-2 border-purple-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-purple-600 text-white">
            🎓
          </div>
          <div>
            <span className="font-game text-purple-700 text-lg">КодоГерой</span>
            <span className="block text-xs text-gray-400 -mt-0.5">Информатика 7-9 класс</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className="px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: section === item.id ? '#7c3aed' : 'transparent',
                color: section === item.id ? 'white' : '#6b7280',
              }}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-300">
            <span>⚡</span>
            <span className="font-game text-sm text-yellow-600">{totalXP} XP</span>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-purple-600">
            <Icon name={mobileMenu ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden border-t border-purple-100 px-4 py-3 space-y-1 bg-white">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setMobileMenu(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: section === item.id ? '#ede9fe' : 'transparent',
                color: section === item.id ? '#7c3aed' : '#6b7280',
              }}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}