export function Explainability({ drivers }: { drivers: string[] }) {
  if (!drivers?.length) {
    return <div className="text-gray-400">No local drivers available.</div>
  }
  return (
    <ul className="space-y-2 text-gray-300">
      {drivers.map((d) => (
        <li key={d} className="rounded-lg bg-gray-800 px-3 py-2">
          {d}
        </li>
      ))}
    </ul>
  )
}
