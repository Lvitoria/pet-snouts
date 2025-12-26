import { getProductById } from '../../actions';
import EditProductForm from '../../components/edit-form';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Editar Produto</h1>
      <EditProductForm product={product} />
    </div>
  );
}
