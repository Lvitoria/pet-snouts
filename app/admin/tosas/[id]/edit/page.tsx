import { getTosaById } from '../../actions';
import EditTosaForm from '../../components/edit-form';
import { notFound } from 'next/navigation';
import { getAnimais } from '../../../animais/actions';

export default async function EditTosaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
 
  const [tosa, animais] = await Promise.all([
    getTosaById(id),
    getAnimais(),
  ]);


  if (!tosa) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Editar Agendamento</h1>
      <EditTosaForm tosa={tosa} animais={animais} />
    </div>
  );
}
