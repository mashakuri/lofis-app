import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { BulletinNote } from '../types';

type Ctx = {
  role: 'student' | 'organizer' | null;
  canSave: boolean;
  canPost: boolean;
  saved: Set<string>;
  toggleSave: (id: string) => void;
  notes: BulletinNote[];
  addNote: (n: BulletinNote) => void;
};

const LofisContext = createContext<Ctx | null>(null);

const DEFAULT_NOTES: BulletinNote[] = [
  { id: 'n1', image: true, title: 'thebutton' },
  { id: 'n2', image: false },
  { id: 'n3', image: false },
  { id: 'n4', image: false },
];

export function LofisProvider({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState(DEFAULT_NOTES);

  const toggleSave = useCallback((id: string) => {
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const addNote = useCallback((n: BulletinNote) => setNotes((p) => [n, ...p.slice(0, 3)]), []);

  const value = useMemo(
    () => ({
      role,
      canSave: role === 'student',
      canPost: role === 'organizer',
      saved,
      toggleSave,
      notes,
      addNote,
    }),
    [role, saved, toggleSave, notes, addNote],
  );

  return <LofisContext.Provider value={value}>{children}</LofisContext.Provider>;
}

export function useLofis() {
  const c = useContext(LofisContext);
  if (!c) throw new Error('useLofis requires LofisProvider');
  return c;
}
