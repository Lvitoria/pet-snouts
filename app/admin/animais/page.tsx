"use server";
import Link from 'next/link';
import { getAnimais, deleteAnimal } from './actions';
import DeleteFormButton from "../../components/DeleteFormButton";
import ListTable from '../../components/ListTable';

type Animal = {
  idAnimais: number;
  nome: string;
  raca: string | null;
  porte: string | null;
  status_vida: boolean | null;
  Animais_tem_clientes: {
    clientes: {
      idClientes: number;
      nome: string;
    }
  }[];
};

export default async function AnimaisTable() {
  const animais: Animal[] = await getAnimais();

  return (
    <ListTable createUrl="/admin/animais/new" labelNew="Adicionar Animal" title="Animais">
      <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
            ID
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Nome
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Raça
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Porte
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Status
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Tutores
          </th>
          <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-900">
        {animais.map((animal) => (
          <tr key={animal.idAnimais} className="group">
            <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
              {animal.idAnimais}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {animal.nome}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {animal.raca || '-'}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {animal.porte || '-'}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {animal.status_vida ? 'Vivo' : 'Não-vivo'}
            </td>
            <td className="whitespace-nowrap bg-white px-3 py-5 text-sm">
              {animal.Animais_tem_clientes.map(atc => atc.clientes.nome).join(', ')}
            </td>
            <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
              <div className="flex justify-end gap-3">
                <Link
                  href={`/admin/animais/${animal.idAnimais}/edit`}
                  className="rounded-md border p-2 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </Link>
                <DeleteFormButton 
                  id={animal.idAnimais} 
                  idFieldName="idAnimais" 
                  action={deleteAnimal} 
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </ListTable>
  );
}
