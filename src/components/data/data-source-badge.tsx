import { Badge } from '@/components/ui/badge';
import { Satellite, Radio, Globe } from 'lucide-react';

type DataSource = 'tempo' | 'pandora' | 'openaq' | 'tolnet' | 'combined';

interface DataSourceBadgeProps {
  source: DataSource;
  showIcon?: boolean;
}

const sourceConfig: Record<
  DataSource,
  {
    label: string;
    icon: typeof Satellite;
    variant: 'default' | 'secondary' | 'outline';
  }
> = {
  tempo: { label: 'TEMPO', icon: Satellite, variant: 'default' },
  pandora: { label: 'Pandora', icon: Radio, variant: 'secondary' },
  openaq: { label: 'OpenAQ', icon: Globe, variant: 'secondary' },
  tolnet: { label: 'TolNet', icon: Radio, variant: 'secondary' },
  combined: { label: 'Combined', icon: Globe, variant: 'outline' },
};

export function DataSourceBadge({
  source,
  showIcon = true,
}: DataSourceBadgeProps) {
  const config = sourceConfig[source];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
