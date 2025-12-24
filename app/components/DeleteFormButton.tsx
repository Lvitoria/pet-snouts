'use client';

import { useEffect, useState, useActionState } from 'react';

// Define o tipo para o estado do formulário, esperando uma mensagem opcional.
type FormState = {
  message?: string | null;
};

// Botão de confirmação que exibe estado de carregamento.
function ConfirmButton({ pending }: { pending: boolean }) {

  return (
    <button 
      type="submit" 
      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400" 
      disabled={pending}
    >
      {pending ? 'Excluindo...' : 'Confirmar Exclusão'}
    </button>
  );
}

// Props para o formulário de exclusão genérico.
interface DeleteFormButtonProps {
  id: number | string;
  idFieldName: string;
  action: any;
  // action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export default function DeleteFormButton({ id, idFieldName, action }: DeleteFormButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialState: FormState = { message: null };
  const [formState, dispatch, pending] = useActionState(action, initialState);

  // Efeito para lidar com o resultado da ação do formulário.
  useEffect(() => {
    // Se a exclusão for bem-sucedida (sem mensagem de erro), fecha o modal.
    if (formState?.message === null) {
      setIsModalOpen(false);
    }
    // Se houver uma mensagem de erro, loga no console.
    else if (formState?.message) {
      console.error('Delete Action Error:', formState.message);
      // Aqui você poderia adicionar uma notificação (toast) para o usuário.
    }
  }, [formState]);
  
  return (
    <>
      {/* Botão que aciona o modal */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-md border p-2 hover:bg-gray-100 hover:cursor-pointer"
      >
        <span className="sr-only">Delete</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>

      {/* O Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h2 id="modal-title" className="text-lg font-bold text-gray-900">
              Confirmar Exclusão
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Você tem certeza que deseja excluir este item?
            </p>
            
            {formState?.message && (
              <p className="mt-3 text-sm text-red-600">{formState.message}</p>
            )}

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
              >
                Cancelar
              </button>
              <form action={dispatch}>
                <input type="hidden" name={idFieldName} value={id} />
                <ConfirmButton  pending={pending || false}/>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
