import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

const SettingsSection = ({
  title,
  description,
  icon,
  headerAction,
  children,
}: SettingsSectionProps) => (
  <Card>
    <CardHeader className="border-b">
      <div className="flex items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            {icon && (
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                {icon}
              </span>
            )}
            {title}
          </CardTitle>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>
    </CardHeader>
    <CardContent className="space-y-5">{children}</CardContent>
  </Card>
);

export default SettingsSection;
