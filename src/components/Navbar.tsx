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
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(10,8,20,0.92)', backdropFilter: 'blur(12px)', borderColor: 'hsl(var(--border))' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl glow-purple" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>🚀</div>
          <div>
            <span className="font-game text-white text-lg">КодоГерой</span>
            <span className="block text-xs text-muted-foreground -mt-0.5">Информатика 7-9 класс</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className="px-3 py-2 rounded-lg text-sm font-body font-semibold transition-all"
              style={{
                background: section === item.id ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'transparent',
                color: section === item.id ? 'white' : 'hsl(var(--muted-foreground))',
                boxShadow: section === item.id ? '0 0 15px rgba(124,58,237,0.4)' : 'none',
              }}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span>⚡</span>
            <span className="font-game text-sm text-game-yellow">{totalXP} XP</span>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-white">
            <Icon name={mobileMenu ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: 'hsl(var(--border))' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setMobileMenu(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: section === item.id ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'transparent',
                color: section === item.id ? 'white' : 'hsl(var(--muted-foreground))',
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
