'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { updateClient, type State } from '../actions';

// Define the type for the client prop
type Client = {
    idClientes: number;
    nome: string;
    documento: number | null;
    data_nasc: string | null;
};

export default function EditClientForm({ client }: { client: Client }) {
  const initialState: State = { message: null, errors: {} };
  // We need to bind the client's ID to the server action
  const updateClientWithId = updateClient.bind(null, client.idClientes);
  const [state, dispatch] = useFormState(updateClientWithId, initialState);
  
  // The date from the API is a full ISO string, we need to format it to YYYY-MM-DD for the input
  const dateForInput = client.data_nasc ? new Date(client.data_nasc).toISOString().split('T')[0] : '';

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
            defaultValue={client.nome}
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
            type="number"
            defaultValue={client.documento || ''}
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
            defaultValue={dateForInput}
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
        <button type="submit" className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500">
          Atualizar Cliente
        </button>
      </div>
    </form>
  );
}
