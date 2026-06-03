import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LofisProvider } from './context/LofisContext';
import { RequireAuth } from './components/RequireAuth';
import { PhoneLayout } from './layout/PhoneLayout';
import { LoginScreen } from './screens/LoginScreen';
import { MapScreen } from './screens/MapScreen';
import { BulletinScreenV2 } from './screens/BulletinScreenV2';
import { BulletinFiltersScreen } from './screens/BulletinFiltersScreen';
import { BulletinCreateScreen } from './screens/BulletinCreateScreen';
import { BulletinTemplateScreen } from './screens/BulletinTemplateScreen';
import { BulletinUploadScreen } from './screens/BulletinUploadScreen';
import { BulletinEditorScreen } from './screens/BulletinEditorScreen';
import { BulletinDescriptionScreen } from './screens/BulletinDescriptionScreen';
import { BulletinPublishScreen } from './screens/BulletinPublishScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CalendarMonthScreen } from './screens/CalendarMonthScreen';
import { CalendarStackedScreen } from './screens/CalendarStackedScreen';
import { CalendarDayScreen } from './screens/CalendarDayScreen';
import { CalendarDayDetailScreen } from './screens/CalendarDayDetailScreen';

export default function App() {
  return (
    <AuthProvider>
      <LofisProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<LoginScreen />} />
            <Route
              element={
                <RequireAuth>
                  <PhoneLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="/map" replace />} />
              <Route path="map" element={<MapScreen />} />
              <Route path="bulletin" element={<BulletinScreenV2 />} />
              <Route path="bulletin/filters" element={<BulletinFiltersScreen />} />
              <Route path="bulletin/create" element={<BulletinCreateScreen />} />
              <Route path="bulletin/create/template" element={<BulletinTemplateScreen />} />
              <Route path="bulletin/create/upload" element={<BulletinUploadScreen />} />
              <Route path="bulletin/create/description" element={<BulletinDescriptionScreen />} />
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
    </AuthProvider>
  );
}
