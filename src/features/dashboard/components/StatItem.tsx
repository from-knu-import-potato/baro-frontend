interface StatItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  subtitle: React.ReactNode;
}

const StatItem = ({ label, value, icon, iconBg, subtitle }: StatItemProps) => (
  <div className="flex-1 min-w-0 rounded-xl border p-4 flex items-start justify-between gap-3">
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-bold tracking-tight md:text-2xl">{value}</span>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      {icon}
    </div>
  </div>
);

export default StatItem;
