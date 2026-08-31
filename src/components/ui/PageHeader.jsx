export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight text-navy-50 sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] text-navy-400">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}