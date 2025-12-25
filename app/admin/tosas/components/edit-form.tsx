'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { updateTosa, type State } from '../actions';

type Animal = {
  idAnimais: number;
  nome: string;
  raca: string;
  porte: string;
  status_vida: boolean;
  Animais_tem_clientes: {
    id_animais_tem_clientes: number;
    Animais_idAnimais: number;
    clientes_idClientes: number;
    clientes: {
      idClientes: number;
      nome: string;
      documento: string;
      data_nasc: string;
      Usuarios_internos_idUsuarios_internos: number;
    };
  }[];
};

type Tosa = {
  idTosas: number;
  data_hora_inicio: string;
  data_hora_fim: string;
  atividade: string;
  obs: string | null;
  Animais_tem_clientes_id_animais_tem_clientes: number;
};

// Helper to format ISO string to 'YYYY-MM-DDTHH:mm' for datetime-local input
const formatDateTimeForInput = (isoString: string) => {
  if (!isoString) return '';
  return new Date(isoString).toISOString().slice(0, 16);
};

export default function EditTosaForm({ tosa, animais }: { tosa: Tosa, animais: Animal[] }) {
  const initialState: State = { message: null, errors: {}, data: null };
  const [state, dispatch, pending] = useActionState<State, FormData>(updateTosa, initialState);

  const opcoesAnimais = animais.flatMap((animal) =>
    animal.Animais_tem_clientes.map((relacao) => ({
      id: relacao.id_animais_tem_clientes,
      nomeAnimal: animal.nome,
      nomeTutor: relacao.clientes.nome,
    }))
  );

  const [valorSelecionado, setValorSelecionado] = useState(
    String(tosa.Animais_tem_clientes_id_animais_tem_clientes)
  );

  useEffect(() => {
    if (state.data?.Animais_tem_clientes_id_animais_tem_clientes) {
      setValorSelecionado(String(state.data.Animais_tem_clientes_id_animais_tem_clientes));
    }
  }, [state.data]);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Animal e Tutor */}
        <div className="mb-4">
          <label htmlFor="Animais_tem_clientes_id_animais_tem_clientes" className="mb-2 block text-sm font-medium">
            Animal (Tutor)
          </label>
          <select
            id="Animais_tem_clientes_id_animais_tem_clientes"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 cursor-not-allowed bg-gray-900 text-white"
            value={valorSelecionado}
            onChange={(e) => setValorSelecionado(e.target.value)}
            aria-describedby="animal-error"
            required
            disabled={true}
          >
            <option value="" disabled>Selecione um animal</option>
            {opcoesAnimais.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.nomeAnimal} - {item.nomeTutor}
              </option>
            ))}
          </select>
          <div id="animal-error" aria-live="polite" aria-atomic="true">
            {state.errors?.Animais_tem_clientes_id_animais_tem_clientes &&
              state.errors.Animais_tem_clientes_id_animais_tem_clientes.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <input type="hidden" name="Animais_tem_clientes_id_animais_tem_clientes" value={tosa.Animais_tem_clientes_id_animais_tem_clientes} />

        {/* Atividade */}
        <div className="mb-4">
          <label htmlFor="atividade" className="mb-2 block text-sm font-medium">
            Atividade
          </label>
          <input
            id="atividade"
            name="atividade"
            type="text"
            defaultValue={state.data?.atividade || tosa.atividade}
            placeholder="Ex: Banho e Tosa"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="atividade-error"
          />
          <div id="atividade-error" aria-live="polite" aria-atomic="true">
            {state.errors?.atividade &&
              state.errors.atividade.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        
        {/* Data e Hora de Início */}
        <div className="mb-4">
          <label htmlFor="data_hora_inicio" className="mb-2 block text-sm font-medium">
            Início do Atendimento
          </label>
          <input
            id="data_hora_inicio"
            name="data_hora_inicio"
            type="datetime-local"
            defaultValue={formatDateTimeForInput(state.data?.data_hora_inicio || tosa.data_hora_inicio)}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="data_hora_inicio-error"
          />
          <div id="data_hora_inicio-error" aria-live="polite" aria-atomic="true">
            {state.errors?.data_hora_inicio &&
              state.errors.data_hora_inicio.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Data e Hora de Fim */}
        <div className="mb-4">
          <label htmlFor="data_hora_fim" className="mb-2 block text-sm font-medium">
            Fim do Atendimento
          </label>
          <input
            id="data_hora_fim"
            name="data_hora_fim"
            type="datetime-local"
            defaultValue={formatDateTimeForInput(state.data?.data_hora_fim || tosa.data_hora_fim)}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="data_hora_fim-error"
          />
          <div id="data_hora_fim-error" aria-live="polite" aria-atomic="true">
            {state.errors?.data_hora_fim &&
              state.errors.data_hora_fim.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Observações */}
        <div className="mb-4">
          <label htmlFor="obs" className="mb-2 block text-sm font-medium">
            Observações
          </label>
          <textarea
            id="obs"
            name="obs"
            rows={3}
            defaultValue={state.data?.obs || tosa.obs || ''}
            placeholder="Alguma observação sobre o animal ou serviço?"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          />
        </div>

        <input type="hidden" name="idTosas" value={tosa.idTosas} />

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/tosas"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <button 
            type="submit" 
            className={`flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 ${pending ? 'bg-gray-400 cursor-not-allowed' : ''}`} 
            disabled={pending || false}
        >
          {pending ? 'Atualizando...' : 'Atualizar Agendamento'}
        </button>
      </div>
    </form>
  );
}
