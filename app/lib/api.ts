import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiFetch(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (defaultHeaders as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: defaultHeaders,
  });

  if (response.status === 401) {
    // Se não for uma rota de login que falhou, redireciona para logout
    // Evita loop de redirecionamento se o login/senha estiverem errados.
    if (!url.includes('/auth/login')) {
      // Redireciona para a rota de logout que limpa os cookies
      redirect('/api/logout');
    }
  }

  return response;
}
