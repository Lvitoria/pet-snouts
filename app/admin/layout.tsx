import NavMenu from './components/nav-menu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="md:flex min-h-screen">
        <NavMenu />
        <main className="flex-grow p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
