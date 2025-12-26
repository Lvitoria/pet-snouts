'use client';

import Link from 'next/link';
import { use, useActionState, useEffect, useState } from 'react';
import { createProduct, getTipoProdutos, type State } from '../actions';

type TipoProduto = {
  idTipo_produto: number;
  nome: string;
};

export default function CreateProductForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch, pending] = useActionState<State, FormData>(createProduct, initialState);
  const [tiposProduto, setTiposProduto] = useState<TipoProduto[]>([]);

  const [valorSelecionado, setValorSelecionado] = useState('');

  useEffect(() => {
    setValorSelecionado(
      state.data?.Tipo_produto_idTipo_produto
        ? String(state.data.Tipo_produto_idTipo_produto)
        : ''
    );
  }, [state.data]);

  useEffect(() => {
    async function loadTiposProduto() {
      const tipos = await getTipoProdutos();
      setTiposProduto(tipos);
    }
    loadTiposProduto();
  }, []);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="nome_produto" className="mb-2 block text-sm font-medium">Nome do Produto</label>
          <input
            id="nome_produto"
            name="nome_produto"
            type="text"
            defaultValue={state.data?.nome_produto || ''}
            placeholder="Digite o nome do produto"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="nome_produto-error"
          />
          <div id="nome_produto-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nome_produto?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>

        {/* Tipo Produto */}
        <div className="mb-4">
          <label htmlFor="Tipo_produto_idTipo_produto" className="mb-2 block text-sm font-medium">Tipo de Produto</label>
          <select
            id="Tipo_produto_idTipo_produto"
            name="Tipo_produto_idTipo_produto"
            value={valorSelecionado}
            onChange={(e) => setValorSelecionado(e.target.value)}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="Tipo_produto_idTipo_produto-error"
          >
            <option value="" disabled>Selecione um tipo</option>
            {tiposProduto.map(tipo => (
              <option key={tipo.idTipo_produto} value={tipo.idTipo_produto}>{tipo.nome}</option>
            ))}
          </select>
          <div id="Tipo_produto_idTipo_produto-error" aria-live="polite" aria-atomic="true">
            {state.errors?.Tipo_produto_idTipo_produto?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>
        
        {/* Price and Unit */}
        <div className="flex gap-4 mb-4">
            <div className="flex-1">
                <label htmlFor="preco" className="mb-2 block text-sm font-medium">Preço</label>
                <input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                    defaultValue={state.data?.preco || ''}
                    placeholder="R$ 0,00"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                    aria-describedby="preco-error"
                />
                <div id="preco-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.preco?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
                </div>
            </div>
            <div className="flex-1">
                <label htmlFor="unidade_medida" className="mb-2 block text-sm font-medium">Unidade de Medida</label>
                <input
                    id="unidade_medida"
                    name="unidade_medida"
                    type="text"
                    defaultValue={state.data?.unidade_medida || ''}
                    placeholder="Ex: kg, Un, L"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                    aria-describedby="unidade_medida-error"
                />
                <div id="unidade_medida-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.unidade_medida?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
                </div>
            </div>
        </div>

        {/* Quantity and Barcode */}
        <div className="flex gap-4 mb-4">
            <div className="flex-1">
                <label htmlFor="quantidade" className="mb-2 block text-sm font-medium">Quantidade</label>
                <input
                    id="quantidade"
                    name="quantidade"
                    type="number"
                    defaultValue={state.data?.quantidade || ''}
                    placeholder="0"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                    aria-describedby="quantidade-error"
                />
                <div id="quantidade-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.quantidade?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
                </div>
            </div>
            <div className="flex-1">
                <label htmlFor="cod_barras" className="mb-2 block text-sm font-medium">Código de Barras</label>
                <input
                    id="cod_barras"
                    name="cod_barras"
                    type="number"
                    defaultValue={state.data?.cod_barras || ''}
                    placeholder="Digite o código de barras"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                    aria-describedby="cod_barras-error"
                />
                <div id="cod_barras-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.cod_barras?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
                </div>
            </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? <p className="my-2 text-sm text-red-500">{state.message}</p> : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/produtos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <button type="submit" 
                className={`flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 ${pending ? 'bg-gray-400 cursor-not-allowed' : ''}`} 
                disabled={pending || false}
        >
          {pending ? 'Criando...' : 'Criar Produto'}
        </button>
      </div>
    </form>
  );
}