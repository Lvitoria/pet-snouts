
'use server';

import { cookies } from 'next/headers';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      const cookiesStore = await cookies();
      cookiesStore.set('token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      if (data.name) {
       cookiesStore.set('userName', data.name, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
      }
      return { success: true, redirect: true, message: 'Login bem-sucedido.' };
    } 
    const errorData = await res.json();
    console.error('Login failed:', errorData);  
    return { success: false, redirect: false, message: errorData.message || 'Falha no login.' };
  } catch (err) {
    console.error('Login error:', err);
    if (err instanceof Error) {
      return { success: false, redirect: false, message: 'Ocorreu um erro de rede.' };
    }
    return { success: false, redirect: false, message: 'Ocorreu um erro desconhecido.' };
  }
}
