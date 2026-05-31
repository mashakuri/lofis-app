import type { EventPin } from '../types';

export const UCSD: [number, number] = [32.8801, -117.234];

export const PINS: EventPin[] = [
  { id: '1', title: 'Eng Expo', lat: 32.8822, lng: -117.2378, category: 'Events', color: 'red', club: 'ACM' },
  { id: '2', title: 'Robotics', lat: 32.8818, lng: -117.2332, category: 'Clubs', color: 'green' },
  { id: '3', title: 'Club Fair', lat: 32.8796, lng: -117.2312, category: 'Fairs', color: 'purple' },
  { id: '4', title: 'Food Trucks', lat: 32.8808, lng: -117.232, category: 'Food', color: 'orange' },
  { id: '5', title: 'Design Co', lat: 32.8782, lng: -117.2352, category: 'Clubs', color: 'green' },
  { id: '6', title: 'Study Mixer', lat: 32.8792, lng: -117.2382, category: 'Events', color: 'red' },
];

export const PIN_HEX: Record<EventPin['color'], string> = {
  red: '#ef4444',
  green: '#22c55e',
  purple: '#a855f7',
  orange: '#f97316',
};
