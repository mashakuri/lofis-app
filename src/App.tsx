import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LofisProvider } from './context/LofisContext';
import { PhoneLayout } from './layout/PhoneLayout';
import { MapScreen } from './screens/MapScreen';
import { BulletinScreen } from './screens/BulletinScreen';
import { BulletinFiltersScreen } from './screens/BulletinFiltersScreen';
import { BulletinCreateScreen } from './screens/BulletinCreateScreen';
import { BulletinEditorScreen } from './screens/BulletinEditorScreen';
import { BulletinPublishScreen } from './screens/BulletinPublishScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CalendarMonthScreen } from './screens/CalendarMonthScreen';
import { CalendarStackedScreen } from './screens/CalendarStackedScreen';
import { CalendarDayScreen } from './screens/CalendarDayScreen';
import { CalendarDayDetailScreen } from './screens/CalendarDayDetailScreen';

export default function App() {
  return (
    <LofisProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PhoneLayout />}>
            <Route index element={<Navigate to="/map" replace />} />
            <Route path="map" element={<MapScreen />} />
            <Route path="bulletin" element={<BulletinScreen />} />
            <Route path="bulletin/filters" element={<BulletinFiltersScreen />} />
            <Route path="bulletin/create" element={<BulletinCreateScreen />} />
            <Route path="bulletin/editor" element={<BulletinEditorScreen />} />
            <Route path="bulletin/publish" element={<BulletinPublishScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="calendar" element={<CalendarMonthScreen />} />
            <Route path="calendar/stacked" element={<CalendarStackedScreen />} />
            <Route path="calendar/day" element={<CalendarDayScreen />} />
            <Route path="calendar/day/detail" element={<CalendarDayDetailScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LofisProvider>
  );
}
