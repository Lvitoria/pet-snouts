"use server";
import { apiFetch } from "@/app/lib/api";

export async function getTosasByRange(start: string, end: string) {
  try {
    console.log(`Buscando tosas de ${start} a ${end}  action`);
    const response = await apiFetch(`/tosas/agenda?start=${start}&end=${end}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    // Mapeia os dados para o formato que o react-big-calendar espera
    console.log('data toda os tosas', data);
    return data.map((tosa: any) => ({
      title: `${tosa.atividade} - ${tosa.Animais_tem_clientes.Animais.nome}`,
      start: new Date(tosa.data_hora_inicio),
      end: new Date(tosa.data_hora_fim),
      resource: tosa, // Guarda o objeto original para referência
    }));
  } catch (error) {
    console.error("An error occurred while fetching tosas by range:", error);
    return [];
  }
}
