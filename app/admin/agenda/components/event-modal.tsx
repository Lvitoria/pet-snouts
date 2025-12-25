"use client";

import Link from 'next/link';
import { CalendarEvent } from '../page';

type EventModalProps = {
  event: CalendarEvent | null;
  onClose: () => void;
};

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  const { resource: tosa } = event;

  console.log('event', event.resource);

  // Função para parar a propagação de eventos de clique
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        onClick={onClose} // Fecha o modal ao clicar no fundo
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg transform transition-all"
        onClick={handleModalContentClick} // Impede que o clique feche o modal
      >
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">{event.title}</h2>
        
        <div className="space-y-3">
            <p><strong>Atividade:</strong> {tosa.atividade || 'Não especificada'}</p>
            <p><strong>Animal:</strong> {tosa.Animais_tem_clientes.Animais.nome || 'Não especificado'}</p>
            <p><strong>Cliente:</strong> {tosa.Animais_tem_clientes.clientes.nome || 'Não especificado'}</p>
            <p><strong>Início:</strong> {new Date(tosa.data_hora_inicio).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
            <p><strong>Fim:</strong> {new Date(tosa.data_hora_fim).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
            {tosa.obs && <p><strong>Observações:</strong> {tosa.obs}</p>}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
            <Link 
                href={`/admin/tosas/${tosa.id}/edit`} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={(e) => e.stopPropagation()} // Impede que o clique no link feche o modal
            >
                Editar
            </Link>
            <button 
                onClick={onClose} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
}
