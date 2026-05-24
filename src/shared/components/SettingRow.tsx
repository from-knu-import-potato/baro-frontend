interface SettingRowProps {
  label: string;
  description?: string;
  action: React.ReactNode;
}

const SettingRow = ({ label, description, action }: SettingRowProps) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-sm font-medium">{label}</p>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
    <div className="shrink-0">{action}</div>
  </div>
);

export default SettingRow;
