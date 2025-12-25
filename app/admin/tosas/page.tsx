"use server";
import Link from 'next/link';
import { getTosas, deleteTosa } from './actions';
import DeleteFormButton from "../../components/DeleteFormButton";
import ListTable from '../../components/ListTable';

type Tosa = {
  idTosas: number;
  data_hora_inicio: string;
  data_hora_fim: string;
  atividade: string;
  Animais_tem_clientes: {
    Animais: { nome: string; };
    clientes: { nome: string; };
  }
};

const formatDateTime = (isoString: string) => {
  return new Date(isoString).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export default async function TosasTable() {
  const tosas: Tosa[] = await getTosas();

  return (
    <ListTable createUrl="/admin/tosas/new" labelNew="Adicionar Agendamento" title="Agendamentos (Tosa)">
      <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-3 py-5 font-medium">
            Animal
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Tutor
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Atividade
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Início
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Fim
          </th>
          <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-900">
        {tosas.map((tosa) => (
          <tr key={tosa.idTosas} className="group">
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {tosa.Animais_tem_clientes?.Animais?.nome || 'N/A'}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {tosa.Animais_tem_clientes?.clientes?.nome || 'N/A'}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {tosa.atividade}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {formatDateTime(tosa.data_hora_inicio)}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {formatDateTime(tosa.data_hora_fim)}
            </td>
            <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
              <div className="flex justify-end gap-3">
                <Link
                  href={`/admin/tosas/${tosa.idTosas}/edit`}
                  className="rounded-md border p-2 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </Link>
                <DeleteFormButton 
                  id={tosa.idTosas} 
                  idFieldName="idTosas" 
                  action={deleteTosa} 
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </ListTable>
  );
}
