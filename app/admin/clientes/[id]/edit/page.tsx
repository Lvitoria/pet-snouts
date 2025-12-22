import { getClientById } from '../../actions';
import EditClientForm from '../../components/edit-form';
import { notFound } from 'next/navigation';

export default async function EditClientePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Editar Cliente</h1>
      <EditClientForm client={client} />
    </div>
  );
}
