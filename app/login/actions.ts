
'use server';

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
      // On a real app, you'd set a cookie here, not return the token
      return { success: true, message: 'Login bem-sucedido!', token: data.access_token };
    } else {
      const errorData = await res.json();
      return { success: false, message: errorData.message || 'Falha no login.' };
    }
  } catch (err) {
    if (err instanceof Error) {
      return { success: false, message: 'Ocorreu um erro de rede.' };
    }
    return { success: false, message: 'Ocorreu um erro desconhecido.' };
  }
}
