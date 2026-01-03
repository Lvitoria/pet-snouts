'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { createPedido, type State } from '../actions';
import { getProducts } from '../../produtos/actions';
import { getClients } from '../../clientes/actions';

type Product = {
  idProduto: number;
  nome_produto: string;
  preco: number;
  quantidade: number;
};

type Cliente = {
  idClientes: number;
  nome: string;
};

type CartItem = {
  produtoId: number;
  nome_produto: string;
  quantidade: number;
  preco: number;
};

export default function CreatePedidoForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch, pending] = useActionState<State, FormData>(createPedido, initialState);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      const [productsData, clientesData] = await Promise.all([getProducts(), getClients()]);
      setProducts(productsData);
      setClientes(clientesData);
    }
    loadData();
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    setTotal(newTotal);
  }, [cart]);

  const addProductToCart = (product: Product) => {
    if (product.quantidade <= 0) {
      alert("Este produto não tem estoque disponível.");
      return;
    }
  
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.produtoId === product.idProduto);
      if (existingItem) {
        if (existingItem.quantidade < product.quantidade) {
          return currentCart.map(item =>
            item.produtoId === product.idProduto ? { ...item, quantidade: item.quantidade + 1 } : item
          );
        } else {
          alert("A quantidade selecionada excede o estoque disponível.");
          return currentCart;
        }
      } else {
        return [...currentCart, {
          produtoId: product.idProduto,
          nome_produto: product.nome_produto,
          quantidade: 1,
          preco: product.preco
        }];
      }
    });
  };

  const updateQuantity = (produtoId: number, newQuantity: number) => {
    const product = products.find(p => p.idProduto === produtoId);
    if (product && newQuantity > product.quantidade) {
      alert("A quantidade selecionada excede o estoque disponível.");
      return; // Não atualiza o carrinho
    }

    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.produtoId !== produtoId));
    } else {
      setCart(cart.map(item => item.produtoId === produtoId ? { ...item, quantidade: newQuantity } : item));
    }
  };
  
  const removeFromCart = (produtoId: number) => {
    setCart(cart.filter(item => item.produtoId !== produtoId));
  };
  
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        
        {/* Cliente */}
        <div className="mb-4">
          <label htmlFor="clientes_idClientes" className="mb-2 block text-sm font-medium">Cliente</label>
          <select
            id="clientes_idClientes"
            name="clientes_idClientes"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            aria-describedby="clientes_idClientes-error"
            defaultValue=""
          >
            <option value="" disabled>Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.idClientes} value={cliente.idClientes}>{cliente.nome}</option>
            ))}
          </select>
          <div id="clientes_idClientes-error" aria-live="polite" aria-atomic="true">
            {state.errors?.clientes_idClientes?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>

        {/* Product Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Adicionar Produtos ao Pedido</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.idProduto} className="p-4 border rounded-md bg-white shadow-sm">
                <p className="font-semibold">{product.nome_produto}</p>
                <p className="text-sm text-gray-600">Preço: R$ {product.preco.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Estoque: {product.quantidade}</p>
                <button 
                  type="button"
                  onClick={() => addProductToCart(product)}
                  className="mt-2 w-full text-white bg-blue-600 hover:bg-blue-700 rounded-md py-1"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Carrinho</h2>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.produtoId} className="flex items-center justify-between p-2 border rounded-md">
                <span>{item.nome_produto}</span>
                <div className="flex items-center gap-2">
                   <input
                    type="number"
                    value={item.quantidade}
                    onChange={(e) => updateQuantity(item.produtoId, parseInt(e.target.value, 10))}
                    className="w-16 text-center border rounded-md"
                  />
                  <span>x R$ {item.preco.toFixed(2)}</span>
                  <button type="button" onClick={() => removeFromCart(item.produtoId)} className="text-red-500 hover:text-red-700">
                    Remover
                  </button>
                </div>
              </div>
            ))}
             {state.errors?.produtos?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>
        
        {/* Hidden inputs for form submission */}
        <input type="hidden" name="valor" value={total} />
        <input type="hidden" name="produtos" value={JSON.stringify(cart.map(p => ({ produtoId: p.produtoId, quantidade: p.quantidade })))} />

        {/* Total */}
        <div className="mb-4 text-right">
          <p className="text-lg font-bold">Total do Pedido: R$ {total.toFixed(2)}</p>
          <div id="valor-error" aria-live="polite" aria-atomic="true">
            {state.errors?.valor?.map((error: string) => <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>)}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? <p className="my-2 text-sm text-red-500">{state.message}</p> : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin/pedidos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <button type="submit" 
                className={`flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 ${pending ? 'bg-gray-400 cursor-not-allowed' : ''}`} 
                disabled={pending || cart.length === 0}
        >
          {pending ? 'Criando...' : 'Criar Pedido'}
        </button>
      </div>
    </form>
  );
}
