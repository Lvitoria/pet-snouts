'use server';
import CreateTosaForm from '../components/create-form';
import { getAnimais } from '../../animais/actions';

export default async function NewTosaPage() {
  const animais = await getAnimais();
  console.log('animais', animais);
  return (
    <div>
      <h1 className="text-2xl mb-4">Adicionar Novo Agendamento</h1>
      <CreateTosaForm animais={animais} />
    </div>
  );
}
