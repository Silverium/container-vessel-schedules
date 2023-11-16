import msToHours from "./msToHours.js";

export default function formatPortCallDuration(ms: number = 0): string {
  const hours = msToHours(ms);
  return `${hours.toFixed(2)}h`;
}
