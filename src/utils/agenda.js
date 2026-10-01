export const consultaConfirmada = (status) => ['confirmada', 'aguardando', 'em_atendimento', 'realizada'].includes(status);
export const consultaPendente = (status) => status === 'agendada';
export function chaveDia(valor) {
  const data = new Date(valor);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}
