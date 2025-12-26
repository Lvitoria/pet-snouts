"use server";

import { z } from 'zod';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from '../../lib/api';

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

// Esquema de validação com Zod para Produto
const ProductSchema = z.object({
  id: z.coerce.number().optional(),
  nome_produto: z.string({ message: 'O nome do produto é obrigatório.' })
    .min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
  cod_barras: z.coerce.number().max(2147483647, { message: "O código de barras é muito longo." }).optional().nullable(),
  quantidade: z.coerce.number({ message: 'A quantidade é obrigatória.' }).min(0),
  preco: z.coerce.number({ message: 'O preço é obrigatório.' }).min(0),
  unidade_medida: z.string({ message: 'A unidade de medida é obrigatória.' }),
  Tipo_produto_idTipo_produto: z.coerce.number({ message: 'O tipo de produto é obrigatório.' }),
});

export type State = {
  errors?: {
    nome_produto?: string[];
    cod_barras?: string[];
    quantidade?: string[];
    preco?: string[];
    unidade_medida?: string[];
    Tipo_produto_idTipo_produto?: string[];
  };
  message?: string | null;
  data?: Record<string, any>;
};

// --- Funções de busca ---

export async function getProducts() {
  try {
    const response = await apiFetch('/produtos', { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching products:", error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const response = await apiFetch(`/produtos/${id}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch product with id ${id}.`);
    return await response.json();
  } catch (error) {
    console.error(`An error occurred while fetching product ${id}:`, error);
    throw error;
  }
}

export async function getTipoProdutos() {
  try {
    const response = await apiFetch('/tipo-produto', { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching product types:", error);
    throw error;
  }
}

// --- Actions de Mutação ---

const CreateProduct = ProductSchema.omit({ id: true });

export async function createProduct(prevState: State, formData: FormData) {
  const processedData = processFormData(formData);
  const validatedFields = CreateProduct.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      errors: getFieldErrors(validatedFields.error.issues),
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      data: processedData
    };
  }

  try {
    const response = await apiFetch('/produtos', {
      method: "POST",
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao criar produto.' }));
        return { message: `Erro da API: ${errorData.message}`, data: processedData };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor.", data: processedData };
  }

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

const UpdateProduct = ProductSchema.omit({ id: true });

export async function updateProduct(prevState: State, formData: FormData) {
  const id = Number(formData.get('idProduto'));
  if (isNaN(id)) return { message: "ID inválido." };

  const processedData = processFormData(formData);
  const validatedFields = UpdateProduct.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      errors: getFieldErrors(validatedFields.error.issues),
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      data: processedData
    };
  }

  try {
    const response = await apiFetch(`/produtos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao atualizar produto.' }));
        return { message: `Erro da API: ${errorData.message}`, data: processedData };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor.", data: processedData };
  }

  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProduct(prevState: { message?: string }, formData: FormData) {
  const id = Number(formData.get('idProduto'));
  if (isNaN(id)) return { message: "ID inválido." };

  try {
    const response = await apiFetch(`/produtos/${id}`, { method: "DELETE" });

    if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({ message: 'Falha ao deletar produto.' }));
        return { message: `Erro da API: ${errorData.message}` };
    }
  } catch (error) {
    return { message: "Erro de rede: Não foi possível conectar ao servidor." };
  }

  revalidatePath("/admin/produtos");
  return { message: null };
}