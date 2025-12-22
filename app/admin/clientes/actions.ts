"use server";

import { z } from 'zod';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from '../../lib/api';

// Esquema de validação com Zod
const ClientSchema = z.object({
  id: z.coerce.number().optional(),
  nome: z.string().min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
  documento: z.string().min(11, { message: 'Por favor, insira um número de documento válido.' }).optional(),
  data_nasc: z.string().optional(),
  Usuarios_internos_idUsuarios_internos: z.coerce.number(),
});

export type State = {
  errors?: {
    nome?: string[];
    documento?: string[];
    data_nasc?: string[];
  };
  message?: string | null;
};

// Funções de busca
export async function getClients() {
  try {
    const response = await apiFetch('/clientes', { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching clients:", error);
    throw error;
  }
}

export async function getClientById(id: string) {
  try {
    const response = await apiFetch(`/clientes/${id}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch client with id ${id}.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`An error occurred while fetching client ${id}:`, error);
    throw error;
  }
}

// Actions de Mutação
const CreateClient = ClientSchema.omit({ id: true });

export async function createClient(prevState: State, formData: FormData) {
  const validatedFields = CreateClient.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
    };
  }
  
  const { nome, documento, data_nasc, Usuarios_internos_idUsuarios_internos } = validatedFields.data;
  const data_nasc_iso = data_nasc ? `${data_nasc}T00:00:00` : undefined;

  try {
    const response = await apiFetch('/clientes', {
      method: "POST",
      body: JSON.stringify({ nome, documento, data_nasc: data_nasc_iso, Usuarios_internos_idUsuarios_internos }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao criar cliente.' }));
        return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

const UpdateClient = ClientSchema.omit({ id: true, Usuarios_internos_idUsuarios_internos: true });

export async function updateClient(id: number, prevState: State, formData: FormData) {
  const validatedFields = UpdateClient.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
    };
  }

  const { nome, documento, data_nasc } = validatedFields.data;
  const data_nasc_iso = data_nasc ? `${data_nasc}T00:00:00` : undefined;

  try {
    const response = await apiFetch(`/clientes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ nome, documento, data_nasc: data_nasc_iso }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao atualizar cliente.' }));
        return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}

export async function deleteClient(id: number) {
  try {
    const response = await apiFetch(`/clientes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao deletar cliente.' }));
        return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/clientes");
}