"use server";
import Link from 'next/link';
import { getClients, deleteClient } from './actions';
import ListTable from '../../components/ListTable';

type Client = {
  idClientes: number;
  nome: string;
  documento: number;
  data_nasc: string;
};

export default async function ClientesTable() {
  const clients: Client[] = await getClients();

  return (
    <ListTable createUrl="/admin/clientes/new" labelNew="Adicionar Cliente" title="Clientes">
      <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
            ID
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Nome
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Documento
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Data de Nascimento
          </th>
          <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-900">
        {clients.map((client) => (
          <tr key={client.idClientes} className="group">
            <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
              {client.idClientes}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {client.nome}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {client.documento}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {new Date(client.data_nasc).toLocaleDateString('pt-BR')}
            </td>
            <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
              <div className="flex justify-end gap-3">
                <Link
                  href={`/admin/clientes/${client.idClientes}/edit`}
                  className="rounded-md border p-2 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </Link>
                <form action={deleteClient.bind(null, client.idClientes)}>
                  <button className="rounded-md border p-2 hover:bg-gray-100">
                    <span className="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </ListTable>
  );
}
