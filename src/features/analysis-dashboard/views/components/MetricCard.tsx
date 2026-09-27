type MetricCardProps = { label: string; value: string | number }
export function MetricCard({ label, value }: MetricCardProps) {
  return <article><p>{label}</p><strong>{value}</strong></article>
}
