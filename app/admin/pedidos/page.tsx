"use server";
import Link from 'next/link';
import { getPedidos, deletePedido } from './actions';
import DeleteFormButton from "../../components/DeleteFormButton";
import ListTable from '../../components/ListTable';

type Pedido = {
  idPedido: number;
  valor: number;
  data_criacao: string;
  clientes: {
    nome: string;
  };
  Pedido_has_Produto: {
    Produto: {
      nome_produto: string;
    };
    quantidade: number;
  }[];
};

export default async function PedidosTable() {
  const pedidos: Pedido[] = await getPedidos();

  return (
    <ListTable createUrl="/admin/pedidos/new" labelNew="Adicionar Pedido" title="Pedidos">
      <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">ID</th>
          <th scope="col" className="px-3 py-5 font-medium">Cliente</th>
          <th scope="col" className="px-3 py-5 font-medium">Valor</th>
          <th scope="col" className="px-3 py-5 font-medium">Produtos</th>
          <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-900 md:divide-none">
        {pedidos.map((pedido) => (
          <tr key={pedido.idPedido} className="group w-full">
            <td data-label="ID" className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6 md:bg-transparent md:p-2">
              {pedido.idPedido}
            </td>
            <td data-label="Cliente" className="whitespace-nowrap bg-white px-3 py-5 text-sm md:bg-transparent md:p-2">
              {pedido.clientes?.nome || '-'}
            </td>
            <td data-label="Valor" className="whitespace-nowrap bg-white px-3 py-5 text-sm md:bg-transparent md:p-2">
              {pedido.valor ? `R$ ${Number(pedido.valor).toFixed(2)}` : '-'}
            </td>
            <td data-label="Produtos" className="whitespace-nowrap bg-white px-3 py-5 text-sm md:bg-transparent md:p-2">
              {pedido.Pedido_has_Produto && Array.isArray(pedido.Pedido_has_Produto)
                ? pedido.Pedido_has_Produto.map(p => `${p.Produto.nome_produto}`).join(', ')
                : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </ListTable>
  );
}
