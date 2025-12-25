'use client';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, Views } from 'react-big-calendar';
import { localizer } from '@/app/lib/calendar-localizer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getTosasByRange } from './actions';
import EventModal from './components/event-modal';

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  resource?: any;
}

// Helper para obter o range de uma data (semana ou mês) em UTC
const getRange = (date: Date, view: string) => {
    const localDate = new Date(date); // Cria uma cópia para não modificar a data original
    if (view === 'month') {
        console.log('mes')
        const startOfMonth = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), 1));
        const endOfMonth = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth() + 1, 0, 23, 59, 59, 999));
        return { start: startOfMonth, end: endOfMonth };
    }
    console.log('para week ou day')
    // Para 'week' e 'day'
    const startOfWeek = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate() - localDate.getUTCDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);
    return { start: startOfWeek, end: endOfWeek };
};


export default function AgendaPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const lastRangeRef = useRef<{ start: Date, end: Date } | null>(null);


  // Função para buscar os eventos
  const fetchEvents = useCallback(async (range: { start: Date, end: Date }) => {
    const lastRange = lastRangeRef.current;
    // Evita buscas repetidas para o mesmo período
    if (lastRange && lastRange.start.getTime() === range.start.getTime() && lastRange.end.getTime() === range.end.getTime()) {
      return;
    }
    
    console.log(`Buscando tosas de ${range.start.toISOString()} a ${range.end.toISOString()}`);
    lastRangeRef.current = range;
    const data = await getTosasByRange(range.start.toISOString(), range.end.toISOString());
    setEvents(data);
  }, []); // Nenhuma dependência é necessária aqui

  // Função para lidar com a mudança de período no calendário
  const handleRangeChange = useCallback((range: any) => {
    if (typeof range === 'string' || !range) {
        return;
    }
    let start: Date, end: Date;

    if (Array.isArray(range)) { // Visão de semana ou dia
      start = new Date(range[0]);
      end = new Date(range[range.length - 1]);
    } else { // Visão de mês
      start = new Date(range.start);
      end = new Date(range.end);
    }
    
    // Ajusta a data de início para o começo do dia em UTC
    start.setUTCHours(0, 0, 0, 0);
    // Ajusta a data de fim para o final do dia em UTC
    end.setUTCHours(23, 59, 59, 999);

    fetchEvents({ start, end });
  }, [fetchEvents]);
  
  // Efeito para o carregamento inicial
  useEffect(() => {
    const initialRange = getRange(new Date(), 'day');
    fetchEvents(initialRange);
  }, [fetchEvents]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="w-full">
        <h1 className="text-2xl mb-4">Agenda de Serviços</h1>
        <div className="rounded-md bg-gray-50 p-4 md:p-6" style={{ height: '85vh' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView={Views.DAY}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                style={{ height: '100%' }}
                onRangeChange={handleRangeChange}
                onView={handleRangeChange} // Adicionado para lidar com mudança de view (dia/semana/mês)
                onSelectEvent={handleSelectEvent}
                culture="pt-BR"
                messages={{
                    next: "Próximo",
                    previous: "Anterior",
                    today: "Hoje",
                    month: "Mês",
                    week: "Semana",
                    day: "Dia",
                    date: "Data",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "Não há eventos neste período.",
                }}
            />
        </div>
        <EventModal event={selectedEvent} onClose={closeModal} />
    </div>
  );
}
