"use server";

import { z } from 'zod';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from '../../lib/api';



function processFormData(formData: FormData) {
  const data: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value === '' ? null : value;
  }
  return data;
}


// Esquema de validação com Zod
const AnimalSchema = z.object({
  id: z.coerce.number().optional(),
  nome: z.string().min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
  raca: z.string().optional(),
  porte: z.string().optional(),
  status_vida: z.coerce.boolean().optional(),
  clienteIds: z.string().min(1, { message: 'Selecione ao menos um cliente.' }),
});

export type State = {
  errors?: {
    nome?: string[];
    raca?: string[];
    porte?: string[];
    status_vida?: string[];
    clienteIds?: string[];
  };
  message?: string | null;
  data?: any
};

// Funções de busca
export async function getAnimais() {
  try {
    const response = await apiFetch('/animais', { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching animais:", error);
    throw error;
  }
}

export async function getAnimalById(id: string) {
  try {
    const response = await apiFetch(`/animais/${id}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch animal with id ${id}.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`An error occurred while fetching animal ${id}:`, error);
    throw error;
  }
}

// Actions de Mutação
const CreateAnimal = AnimalSchema.omit({ id: true });

export async function createAnimal(prevState: State, formData: FormData) {
  const processedData = processFormData(formData);
  console.log('processedData', processedData);
  const validatedFields = AnimalSchema.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      data: processedData
    };
  }
  
  const { nome, raca, porte, status_vida, clienteIds } = validatedFields.data;
  const clienteIdsArray = clienteIds ? clienteIds.split(',').map(Number) : [];
  console.log('clienteIdsArray', clienteIdsArray);
  try {
    const response = await apiFetch('/animais', {
      method: "POST",
      body: JSON.stringify({ nome, raca, porte, status_vida, clienteIds: clienteIdsArray }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao criar animal.' }));
        return { 
          message: `Erro da API: ${errorData.message}`,
          data: processedData
        };
    }
  } catch (error) {
    return { 
        message: "Erro de rede: Não foi possível conectar ao servidor.",
        data: processedData
      };
  }

  revalidatePath("/admin/animais");
  redirect("/admin/animais");
}

const UpdateAnimal = AnimalSchema.omit({ id: true, clienteIds: true });

export async function updateAnimal(id: number, prevState: State, formData: FormData) {
  const validatedFields = UpdateAnimal.safeParse({
    ...Object.fromEntries(formData.entries()),
    status_vida: formData.get('status_vida') === 'true' ? true : false,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
    };
  }

  try {
    const response = await apiFetch(`/animais/${id}`, {
        method: "PATCH",
        body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao atualizar animal.' }));
        return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/animais");
  redirect("/admin/animais");
}

export async function deleteAnimal(prevState: { message?: string }, formData: FormData) {
  const id = Number(formData.get('idAnimais'));

  if (isNaN(id)) {
    return { message: "ID inválido." };
  }

  try {
    const response = await apiFetch(`/animais/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao deletar animal.' }));
        return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/animais");
  return { message: null };
}
