export function inicioDaSemana(data = new Date()) {
  const d = new Date(data);
  const diff = (d.getDay() + 6) % 7; // segunda = 0
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}