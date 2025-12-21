import { cookies } from 'next/headers';

export default  async function AdminPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('userName')?.value || 'Usuário';

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Painel de Administração</h1>
      <p className="mt-2 text-gray-600">Seja bem-vindo, {userName}!</p>
    </div>
  );
}
