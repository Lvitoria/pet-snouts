import CreateAnimalForm from '../components/create-form';
import { getClients } from '../../clientes/actions';

export default async function NewAnimalPage() {
  const clients = await getClients();
  return (
    <div>
      <h1 className="text-2xl mb-4">Adicionar Novo Animal</h1>
      <CreateAnimalForm clients={clients} />
    </div>
  );
}
