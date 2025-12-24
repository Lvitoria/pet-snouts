'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { createClient, type State } from '../actions';

export default function CreateClientForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch, pending] = useActionState<State, FormData>(createClient, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Client Name */}
        <div className="mb-4">
          <label htmlFor="nome" className="mb-2 block text-sm font-medium">
            Nome do Cliente
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            defaultValue={state.data?.nome || ''}
            placeholder="Digite o nome do cliente"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="nome-error"
          />
          <div id="nome-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nome &&
              state.errors.nome.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Client Document */}
        <div className="mb-4">
          <label htmlFor="documento" className="mb-2 block text-sm font-medium">
            Documento (CPF/CNPJ)
          </label>
          <input
            id="documento"
            name="documento"
            type="text"
            defaultValue={state.data?.documento || ''}
            placeholder="Digite o documento"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="documento-error"
          />
          <div id="documento-error" aria-live="polite" aria-atomic="true">
            {state.errors?.documento &&
              state.errors.documento.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Client Birth Date */}
        <div className="mb-4">
          <label htmlFor="data_nasc" className="mb-2 block text-sm font-medium">
            Data de Nascimento
          </label>
          <input
            id="data_nasc"
            name="data_nasc"
            type="date"
            defaultValue={state.data?.data_nasc ? new Date(state.data.data_nasc).toISOString().split('T')[0] : ''}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="data_nasc-error"
          />
           <div id="data_nasc-error" aria-live="polite" aria-atomic="true">
            {state.errors?.data_nasc &&
              state.errors.data_nasc.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <input
          type="hidden"
          name="Usuarios_internos_idUsuarios_internos"
          value="1"
        />

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/clientes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <button type="submit" 
                className={`flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 ${pending ? 'bg-gray-400 cursor-not-allowed' : ''}`} 
                disabled={pending || false}
        >
          {pending ? 'Criando...' : 'Criar Cliente'}
        </button>
      </div>
    </form>
  );
}
