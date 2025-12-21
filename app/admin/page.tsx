import { cookies } from 'next/headers';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('userName')?.value || 'Usuário';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Painel de Administração</h1>
      <p className="mt-4 text-lg">Seja bem-vindo, {userName}!</p>
    </main>
  );
}
