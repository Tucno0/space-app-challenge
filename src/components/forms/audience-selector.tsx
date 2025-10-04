'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AudienceType } from '@/types/alert';
import { Heart, User, Users, Baby, Dumbbell, Briefcase } from 'lucide-react';

interface AudienceSelectorProps {
  selected: AudienceType;
  onChange: (audience: AudienceType) => void;
}

const audiences: Array<{
  value: AudienceType;
  label: string;
  description: string;
  icon: typeof Heart;
}> = [
  {
    value: 'general',
    label: 'General Public',
    description: 'Standard air quality recommendations',
    icon: User,
  },
  {
    value: 'sensitive',
    label: 'Sensitive Groups',
    description: 'People with respiratory conditions or heart disease',
    icon: Heart,
  },
  {
    value: 'elderly',
    label: 'Elderly',
    description: 'Older adults with increased health risks',
    icon: Users,
  },
  {
    value: 'children',
    label: 'Children',
    description: 'Kids and infants with developing lungs',
    icon: Baby,
  },
  {
    value: 'athletes',
    label: 'Athletes',
    description: 'People engaging in outdoor sports and training',
    icon: Dumbbell,
  },
  {
    value: 'outdoor-workers',
    label: 'Outdoor Workers',
    description: 'Construction, delivery, and other outdoor professions',
    icon: Briefcase,
  },
];

export function AudienceSelector({
  selected,
  onChange,
}: AudienceSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Profile</CardTitle>
        <CardDescription>
          Get personalized air quality recommendations based on your needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selected}
          onValueChange={onChange as (value: string) => void}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <Label
                  key={audience.value}
                  htmlFor={audience.value}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <RadioGroupItem
                    value={audience.value}
                    id={audience.value}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{audience.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {audience.description}
                    </p>
                  </div>
                </Label>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
