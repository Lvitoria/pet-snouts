
import { dateFnsLocalizer } from 'react-big-calendar'
import {format} from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import { ptBR } from 'date-fns/locale/pt-BR'

const locales = {
  'pt-BR': ptBR,
}

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
