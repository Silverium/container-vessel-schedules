
export default function msToHours(ms: number = 0): number {
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  return hours;
}
