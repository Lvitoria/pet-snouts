'use client';

import Link from 'next/link';
import { createAnimal, type State } from '../actions';
import { useActionState, useState } from 'react';

type Client = {
  idClientes: number;
  nome: string;
};

export default function CreateAnimalForm({ clients }: { clients: Client[] }) {
  const initialState: State = { message: null, errors: {}, data: null };
  const [state, dispatch, pending] = useActionState<State, FormData>(createAnimal, initialState);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [statusVida, setStatusVida] = useState(true);


  const filteredClients = searchTerm
    ? clients.filter(client =>
        client.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const addClient = (client: Client) => {
    if (!selectedClients.find(c => c.idClientes === client.idClientes)) {
      setSelectedClients([...selectedClients, client]);
    }
    setSearchTerm('');
  };

  const removeClient = (client: Client) => {
    setSelectedClients(selectedClients.filter(c => c.idClientes !== client.idClientes));
  };

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Animal Name */}
        <div className="mb-4">
          <label htmlFor="nome" className="mb-2 block text-sm font-medium">
            Nome do Animal
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            defaultValue={state.data?.nome || ''}
            placeholder="Digite o nome do animal"
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

        {/* Raça */}
        <div className="mb-4">
          <label htmlFor="raca" className="mb-2 block text-sm font-medium">
            Raça
          </label>
          <input
            id="raca"
            name="raca"
            type="text"
            defaultValue={state.data?.raca || ''}
            placeholder="Digite a raça"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        {/* Porte */}
        <div className="mb-4">
          <label htmlFor="porte" className="mb-2 block text-sm font-medium">
            Porte
          </label>
            <select 
              id="porte"
              name="porte"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
            </select>
        </div>

        {/* Status Vida */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="flex gap-4">
            <label>
              <input type="radio" name="status_vida" value="true" checked={statusVida === true} onChange={() => setStatusVida(true)} />
              Vivo
            </label>
            <label>
              <input type="radio" name="status_vida" value="false" checked={statusVida === false} onChange={() => setStatusVida(false)} />
              Não-vivo
            </label>
          </div>
        </div>
        
        {/* Client Search */}
        <div className="mb-4">
          <label htmlFor="cliente" className="mb-2 block text-sm font-medium">
            Tutor
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            {searchTerm && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1">
                {filteredClients.map(client => (
                  <li
                    key={client.idClientes}
                    onClick={() => addClient(client)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {client.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {selectedClients.map(client => (
              <div key={client.idClientes} className="flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1 text-sm">
                <span>{client.nome}</span>
                <button type="button" onClick={() => removeClient(client)} className="text-red-500 hover:text-red-700">
                  &times;
                </button>
              </div>
            ))}
          </div>
          <input type="hidden" name="clienteIds" value={selectedClients.map(client => client.idClientes).join(',') || ''} />
          <div id="clienteIds-error" aria-live="polite" aria-atomic="true">
            {state.errors?.clienteIds &&
              state.errors.clienteIds.map((error: string) => (
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
          href="/admin/animais"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <button 
            type="submit" 
            className={`flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 ${pending ? 'bg-gray-400 cursor-not-allowed' : ''}`} 
            disabled={pending || false}
        >
          {pending ? 'Criando...' : 'Criar Animal'}
        </button>
      </div>
    </form>
  );
}
