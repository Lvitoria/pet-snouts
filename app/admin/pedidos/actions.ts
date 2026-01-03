"use server";

import { z } from 'zod';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from '@/app/lib/api';

// Função auxiliar para processar FormData
function processFormData(formData: FormData) {
  const data: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (key === 'produtos') {
      data[key] = JSON.parse(value as string);
    } else {
      data[key] = value === '' ? null : value;
    }
  }
  return data;
}

function getFieldErrors(issues: z.ZodIssue[]) {
  const fieldErrors: Record<string, string[]> = {};
  issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  });
  return fieldErrors;
}

// Esquema de validação com Zod para Pedido
const PedidoSchema = z.object({
  id: z.coerce.number().optional(),
  valor: z.coerce.number({ message: 'O valor do pedido é obrigatório.' }).min(0, { message: "O valor deve ser positivo." }),
  clientes_idClientes: z.coerce.number({ message: 'O cliente é obrigatório.' }),
  produtos: z.array(z.object({
    produtoId: z.coerce.number(),
    quantidade: z.coerce.number().min(1, { message: "A quantidade deve ser de no mínimo 1." })
  })).min(1, { message: "O pedido deve ter pelo menos um produto." })
});

export type State = {
  errors?: {
    valor?: string[];
    clientes_idClientes?: string[];
    produtos?: string[];
  };
  message?: string | null;
  data?: Record<string, any>;
};

// --- Funções de busca ---

export async function getPedidos() {
  try {
    const response = await apiFetch('/pedidos', { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching orders:", error);
    throw error;
  }
}

export async function getPedidoById(id: string) {
  try {
    const response = await apiFetch(`/pedidos/${id}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch order with id ${id}.`);
    return await response.json();
  } catch (error) {
    console.error(`An error occurred while fetching order ${id}:`, error);
    throw error;
  }
}

// --- Actions de Mutação ---

const CreatePedido = PedidoSchema.omit({ id: true });

export async function createPedido(prevState: State, formData: FormData) {
  const processedData = processFormData(formData);
  const validatedFields = CreatePedido.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      errors: getFieldErrors(validatedFields.error.issues),
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      data: processedData
    };
  }

  try {
    const response = await apiFetch('/pedidos', {
      method: "POST",
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Falha ao criar pedido.' }));
      return { message: `Erro da API: ${errorData.message}`, data: processedData };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor.", data: processedData };
  }

  revalidatePath("/admin/pedidos");
  redirect("/admin/pedidos");
}

export async function deletePedido(prevState: { message?: string }, formData: FormData) {
  const id = Number(formData.get('idPedido'));
  if (isNaN(id)) return { message: "ID inválido." };

  try {
    const response = await apiFetch(`/pedidos/${id}`, { method: "DELETE" });

    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({ message: 'Falha ao deletar pedido.' }));
      return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/pedidos");
  return { message: null };
}
