const today = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date())

export function DashboardPage() {
  return (
    <section>
      <p className="text-sm font-semibold text-indigo-600">{today}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Good morning</h1>
      <p className="mt-2 text-slate-600">
        See today&apos;s room activity and upcoming meetings at a glance.
      </p>
    </section>
  )
}
