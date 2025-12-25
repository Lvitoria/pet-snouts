"use server";

import { z } from 'zod';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from '../../lib/api';

// Função auxiliar para processar FormData: converte strings vazias em null
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

// Esquema de validação com Zod
const TosaSchema = z.object({
  idTosas: z.coerce.number().optional(),
  data_hora_inicio: z.string().min(1, { message: 'A data e hora de início são obrigatórias.' }),
  data_hora_fim: z.string().min(1, { message: 'A data e hora de fim são obrigatórias.' }),
  atividade: z.string().min(3, { message: 'A atividade precisa ter no mínimo 3 caracteres.' }),
  obs: z.string().nullable().optional(),
  Animais_tem_clientes_id_animais_tem_clientes: z.coerce.number().min(1, { message: 'Selecione um animal.' }),
});
  
export type State = {
  errors?: {
    data_hora_inicio?: string[];
    data_hora_fim?: string[];
    atividade?: string[];
    obs?: string[];
    Animais_tem_clientes_id_animais_tem_clientes?: string[];
  };
  message?: string | null;
  data?: any;
};

// Funções de busca
export async function getTosas() {
  try {
    const response = await apiFetch('/tosas', { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching tosas:", error);
    throw error;
  }
}

export async function getTosaById(id: string) {
  try {
    const response = await apiFetch(`/tosas/${id}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch tosa with id ${id}.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`An error occurred while fetching tosa ${id}:`, error);
    throw error;
  }
}

// Actions de Mutação
const CreateTosa = TosaSchema.omit({ idTosas: true });

export async function createTosa(prevState: State, formData: FormData) {
  const processedData = processFormData(formData);
  const validatedFields = CreateTosa.safeParse(processedData);

  if (!validatedFields.success) {
    const fieldErrors = getFieldErrors(validatedFields.error.issues);
    return {
      errors: fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      data: processedData
    };
  }

  try {
    const response = await apiFetch('/tosas', {
      method: "POST",
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Falha ao criar agendamento.' }));
      console.log('errorData', errorData);
      return { 
        message: `Erro ao criar agendamento: ${errorData.message || 'Falha ao criar agendamento.'}`,
        data: processedData
      };
    }
  } catch (error) {
    console.log('error', error);
    return { 
        message: "Erro ao criar agendamento: Não foi possível conectar ao servidor.",
        data: processedData
      };
  }

  revalidatePath("/admin/tosas");
  redirect("/admin/tosas");
}

const UpdateTosa = TosaSchema.omit({ idTosas: true });

export async function updateTosa(idTosas: number, prevState: State, formData: FormData) {
  const id = Number(formData.get('idTosas'));

  if (isNaN(id)) {
    return { message: "ID inválido." };
  }
  
  const processedData = processFormData(formData);
  const validatedFields = UpdateTosa.safeParse(processedData);

  if (!validatedFields.success) {
    const fieldErrors = getFieldErrors(validatedFields.error.issues);
    return {
      errors: fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      data: processedData
    };
  }

  try {
    const response = await apiFetch(`/tosas/${id}`, {
        method: "PATCH",
        body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao atualizar agendamento.' }));
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

  revalidatePath("/admin/tosas");
  redirect("/admin/tosas");
}

export async function deleteTosa(prevState: { message?: string }, formData: FormData) {
  const id = Number(formData.get('idTosas'));

  if (isNaN(id)) {
    return { message: "ID inválido." };
  }

  try {
    const response = await apiFetch(`/tosas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao deletar agendamento.' }));
        return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/tosas");
  return { message: null };
}
