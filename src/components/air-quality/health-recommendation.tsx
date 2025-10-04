import { AQICategory } from '@/types/air-quality';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getHealthMessage, getHealthActionItems } from '@/lib/health-messages';
import { Heart, Users, Baby, Dumbbell, User } from 'lucide-react';

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
  const actionItems = getHealthActionItems(category);

  const audienceConfig = [
    { value: 'general', label: 'General Public', icon: User },
    { value: 'sensitive', label: 'Sensitive Groups', icon: Heart },
    { value: 'elderly', label: 'Elderly', icon: Users },
    { value: 'children', label: 'Children', icon: Baby },
    { value: 'athletes', label: 'Athletes', icon: Dumbbell },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Recommendations</CardTitle>
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

          {audienceConfig.map(({ value }) => (
            <TabsContent key={value} value={value} className="space-y-4">
              <Alert>
                <AlertDescription>
                  {getHealthMessage(
                    category,
                    value as
                      | 'general'
                      | 'sensitive'
                      | 'elderly'
                      | 'children'
                      | 'athletes'
                  )}
                </AlertDescription>
              </Alert>

              {value === 'general' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">What You Should Do:</h4>
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
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
