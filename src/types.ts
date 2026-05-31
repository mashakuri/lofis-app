export type Role = 'student' | 'organizer';
export type MapFilter = 'All' | 'Clubs' | 'Events' | 'Fairs' | 'Food';

export interface EventPin {
  id: string;
  title: string;
  lat: number;
  lng: number;
  category: MapFilter;
  color: 'red' | 'green' | 'purple' | 'orange';
  club?: string;
}

export interface BulletinNote {
  id: string;
  color: string;
  title?: string;
}
