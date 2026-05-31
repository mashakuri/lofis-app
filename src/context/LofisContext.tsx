import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { BulletinNote, Role } from '../types';

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  saved: Set<string>;
  toggleSave: (id: string) => void;
  notes: BulletinNote[];
  addNote: (n: BulletinNote) => void;
};

const LofisContext = createContext<Ctx | null>(null);

const DEFAULT_NOTES: BulletinNote[] = [
  { id: 'n1', color: 'var(--pink)', title: 'ACM Meetup' },
  { id: 'n2', color: 'var(--blue)', title: 'Design Workshop' },
  { id: 'n3', color: 'var(--yellow)', title: 'Study Session' },
  { id: 'n4', color: 'var(--mint)', title: 'Club Social' },
];

export function LofisProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('student');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState(DEFAULT_NOTES);

  const toggleSave = useCallback((id: string) => {
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const addNote = useCallback((n: BulletinNote) => setNotes((p) => [n, ...p]), []);

  const value = useMemo(
    () => ({ role, setRole, saved, toggleSave, notes, addNote }),
    [role, saved, toggleSave, notes, addNote],
  );

  return <LofisContext.Provider value={value}>{children}</LofisContext.Provider>;
}

export function useLofis() {
  const c = useContext(LofisContext);
  if (!c) throw new Error('useLofis requires LofisProvider');
  return c;
}
