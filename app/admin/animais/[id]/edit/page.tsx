import { getAnimalById } from '../../actions';
import EditAnimalForm from '../../components/edit-form';
import { notFound } from 'next/navigation';
import { getClients } from '../../../clientes/actions';

export default async function EditAnimalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [animal, clients] = await Promise.all([
    getAnimalById(id),
    getClients(),
  ]);

  if (!animal) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Editar Animal</h1>
      <EditAnimalForm animal={animal} clients={clients} />
    </div>
  );
}
