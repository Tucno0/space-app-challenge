'use client';

import { AQICategory } from '@/types/air-quality';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Users, Baby, Dumbbell, User } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface HealthRecommendationProps {
  category: AQICategory;
  defaultAudience?:
    | 'general'
    | 'sensitive'
    | 'elderly'
    | 'children'
    | 'athletes';
}

export function HealthRecommendation({
  category,
  defaultAudience = 'general',
}: HealthRecommendationProps) {
  const { dictionary: dict } = useTranslation();

  const categoryKey = category.replace(
    /-/g,
    ''
  ) as keyof typeof dict.health.messages;

  const audienceConfig = [
    { value: 'general', label: dict.health.audiences.general, icon: User },
    { value: 'sensitive', label: dict.health.audiences.sensitive, icon: Heart },
    { value: 'elderly', label: dict.health.audiences.elderly, icon: Users },
    { value: 'children', label: dict.health.audiences.children, icon: Baby },
    {
      value: 'athletes',
      label: dict.health.audiences.athletes,
      icon: Dumbbell,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.health.recommendations}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultAudience} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {audienceConfig.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1"
                title={label}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{value}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {audienceConfig.map(({ value }) => {
            const audienceType =
              value as keyof typeof dict.health.messages.good;
            const message =
              dict.health.messages[categoryKey]?.[audienceType] || '';

            // Get audience-specific action items
            const actionItems =
              dict.health.actions[categoryKey]?.[audienceType] || [];

            return (
              <TabsContent key={value} value={value} className="space-y-4">
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>

                {actionItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      {dict.health.whatYouShouldDo}
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
