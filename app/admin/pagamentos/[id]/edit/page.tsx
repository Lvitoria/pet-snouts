import { getPagamentoById } from '../../actions';
import EditPagamentoForm from '../../components/edit-form';
import { notFound } from 'next/navigation';

export default async function EditPagamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pagamento = await getPagamentoById(id);

  if (!pagamento) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Editar Pagamento</h1>
      <EditPagamentoForm pagamento={pagamento} />
    </div>
  );
}
