import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import ReminderBanner from '@/components/ReminderBanner';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 ml-[220px] p-6 lg:p-8 overflow-auto">
        <ReminderBanner />
        <Outlet />
      </main>
    </div>
  );
}
