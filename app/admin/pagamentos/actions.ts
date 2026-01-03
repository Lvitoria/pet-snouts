"use server";

import { z } from 'zod';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from '@/app/lib/api';

// Função auxiliar para processar FormData
function processFormData(formData: FormData) {
  const data: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value === '' ? null : value;
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

// Esquema de validação com Zod para Pagamento
const PagamentoSchema = z.object({
  id: z.coerce.number().optional(),
  valor: z.coerce.number({ message: 'O valor é obrigatório.' }).min(0),
  metodo_pgto: z.string({ message: 'O método de pagamento é obrigatório.' }),
  status: z.string({ message: 'O status é obrigatório.' }),
  clientes_idClientes: z.coerce.number({ message: 'O cliente é obrigatório.' }),
});

export type State = {
  errors?: {
    valor?: string[];
    metodo_pgto?: string[];
    status?: string[];
    clientes_idClientes?: string[];
  };
  message?: string | null;
  data?: Record<string, any>;
};

// --- Funções de busca ---

export async function getPagamentos() {
  try {
    const response = await apiFetch('/pagamentos', { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching payments:", error);
    throw error;
  }
}

export async function getPagamentoById(id: string) {
  try {
    const response = await apiFetch(`/pagamentos/${id}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch payment with id ${id}.`);
    return await response.json();
  } catch (error) {
    console.error(`An error occurred while fetching payment ${id}:`, error);
    throw error;
  }
}

// --- Actions de Mutação ---

const CreatePagamento = PagamentoSchema.omit({ id: true });

export async function createPagamento(prevState: State, formData: FormData) {
  const processedData = processFormData(formData);
  const validatedFields = CreatePagamento.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      errors: getFieldErrors(validatedFields.error.issues),
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      data: processedData
    };
  }

  try {
    const response = await apiFetch('/pagamentos', {
      method: "POST",
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao criar pagamento.' }));
        return { message: `Erro da API: ${errorData.message}`, data: processedData };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor.", data: processedData };
  }

  revalidatePath("/admin/pagamentos");
  redirect("/admin/pagamentos");
}

const UpdatePagamento = PagamentoSchema.omit({ id: true, clientes_idClientes: true });

export async function updatePagamento(prevState: State, formData: FormData) {
  const id = Number(formData.get('idPagamento'));
  if (isNaN(id)) return { message: "ID inválido." };

  console.log("form" , formData);
  const processedData = processFormData(formData);
  const validatedFields = UpdatePagamento.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      errors: getFieldErrors(validatedFields.error.issues),
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      data: processedData
    };
  }

  try {
    const response = await apiFetch(`/pagamentos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao atualizar pagamento.' }));
        return { message: `Erro da API: ${errorData.message}`, data: processedData };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor.", data: processedData };
  }

  revalidatePath("/admin/pagamentos");
  redirect("/admin/pagamentos");
}

export async function deletePagamento(prevState: { message?: string }, formData: FormData) {
  const id = Number(formData.get('idPagamento'));
  if (isNaN(id)) return { message: "ID inválido." };

  try {
    const response = await apiFetch(`/pagamentos/${id}`, { method: "DELETE" });

    if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao deletar pagamento.' }));
        return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/pagamentos");
  return { message: null };
}
