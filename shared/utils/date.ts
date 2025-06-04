import { parse, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const parseLocalDate = (ymd?: string) => (ymd ? parse(ymd, 'yyyy-MM-dd', new Date()) : undefined);

const formatYMD = (date?: Date) => (date ? format(date, 'yyyy-MM-dd') : '');

export { parseLocalDate, formatYMD };
