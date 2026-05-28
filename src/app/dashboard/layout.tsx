import { Sidebar } from "@/components/layout/Sidebar";
import { Composer } from "@/components/composer/Composer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <Composer />
    </div>
  );
}
