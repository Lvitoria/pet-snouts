"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/app/login/actions';
import { useEffect } from 'react';

const initialState = {
  message: '',
  success: false,
  token: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="w-full px-4 py-2 font-bold text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  useEffect(() => {
    if (state.success) {
      alert('Login bem-sucedido!');
      // Here you would typically store the token and redirect the user
      // For example:
      // localStorage.setItem('token', state.token);
      // window.location.href = '/dashboard';
      console.log('Token:', state.token);
    }
  }, [state]);


  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-lg shadow-md z-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Fucinhos</h1>
        <p className="text-gray-400">Bem-vindo de volta</p>
      </div>
      <form className="space-y-6" action={formAction}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full px-3 py-2 mt-1 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {state?.message && !state.success && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
       
        <div>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}