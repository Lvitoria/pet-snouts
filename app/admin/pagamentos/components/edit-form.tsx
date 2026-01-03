'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { updatePagamento, type State } from '../actions';
import { getClients } from '../../clientes/actions';

type Cliente = {
  idClientes: number;
  nome: string;
};

type Pagamento = {
    idCaixa: number;
    valor: number;
    metodo_pgto: string;
    status: string;
    clientes_idClientes: number;
};

export default function EditPagamentoForm({ pagamento }: { pagamento: Pagamento }) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch, pending] = useActionState<State, FormData>(updatePagamento, initialState);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    async function loadData() {
      const clientesData = await getClients();
      setClientes(clientesData);
    }
    loadData();
  }, []);

  const paymentMethods = ["Cartão de Crédito", "Cartão de Débito", "Dinheiro", "PIX"];
  const paymentStatus = ["pago", "pendente", "cancelado", "estornado"];
  
  return (
    <form action={dispatch}>
      <input type="hidden" name="idPagamento" value={pagamento.idCaixa} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Cliente */}
        <div className="mb-4">
          <label htmlFor="clientes_idClientes" className="mb-2 block text-sm font-medium">Cliente</label>
          <select
            id="clientes_idClientes"
            name="clientes_idClientes"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm bg-gray-400 cursor-not-allowed"
            aria-describedby="clientes_idClientes-error"
            defaultValue={pagamento.clientes_idClientes}
            disabled={true}
          >
            <option value="" disabled>Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.idClientes} value={cliente.idClientes}>{cliente.nome}</option>
            ))}
          </select>
          <div id="clientes_idClientes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.clientes_idClientes?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>

        {/* Valor */}
        <div className="mb-4">
          <label htmlFor="valor" className="mb-2 block text-sm font-medium">Valor</label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            defaultValue={pagamento.valor}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="valor-error"
          />
          <div id="valor-error" aria-live="polite" aria-atomic="true">
            {state.errors?.valor?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="mb-4">
          <label htmlFor="metodo_pgto" className="mb-2 block text-sm font-medium">Método de Pagamento</label>
          <select
            id="metodo_pgto"
            name="metodo_pgto"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="metodo_pgto-error"
            defaultValue={pagamento.metodo_pgto}
          >
            <option value="" disabled>Selecione um método</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <div id="metodo_pgto-error" aria-live="polite" aria-atomic="true">
            {state.errors?.metodo_pgto?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="status-error"
            defaultValue={pagamento.status}
          >
            {paymentStatus.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? <p className="my-2 text-sm text-red-500">{state.message}</p> : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/pagamentos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <button type="submit" 
                className={`flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 ${pending ? 'bg-gray-400 cursor-not-allowed' : ''}`} 
                disabled={pending}
        >
          {pending ? 'Atualizando...' : 'Atualizar Pagamento'}
        </button>
      </div>
    </form>
  );
}
