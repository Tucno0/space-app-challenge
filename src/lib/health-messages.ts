import { AQICategory, HealthRecommendation } from '@/types/air-quality';

export const healthRecommendations: Record<AQICategory, HealthRecommendation> =
  {
    good: {
      category: 'good',
      general:
        'Air quality is satisfactory, and air pollution poses little or no risk.',
      sensitive: 'Enjoy your outdoor activities.',
      elderly: 'Safe to spend time outdoors.',
      children: 'Great day for outdoor play and activities.',
      athletes: 'Perfect conditions for outdoor exercise and training.',
    },
    moderate: {
      category: 'moderate',
      general:
        'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
      sensitive: 'Consider reducing prolonged or heavy outdoor exertion.',
      elderly: "It's generally safe, but watch for any unusual symptoms.",
      children: 'Reduce prolonged or heavy outdoor activities.',
      athletes: 'Consider reducing the intensity of outdoor workouts.',
    },
    'unhealthy-sensitive': {
      category: 'unhealthy-sensitive',
      general:
        'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
      sensitive:
        'Reduce prolonged or heavy outdoor exertion. Take more breaks during outdoor activities.',
      elderly:
        'Consider moving activities indoors or rescheduling to when air quality is better.',
      children:
        'Reduce prolonged or heavy outdoor activities. Schedule outdoor activities when air quality is better.',
      athletes: 'Reduce the intensity and duration of outdoor exercise.',
    },
    unhealthy: {
      category: 'unhealthy',
      general:
        'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
      sensitive:
        'Avoid prolonged or heavy outdoor exertion. Move activities indoors or reschedule.',
      elderly:
        "Stay indoors and keep activity levels low. Follow your doctor's advice about medication use.",
      children:
        'Avoid prolonged or heavy outdoor activities. Move activities indoors or reschedule.',
      athletes:
        'Move workouts indoors or reschedule to when air quality improves.',
    },
    'very-unhealthy': {
      category: 'very-unhealthy',
      general:
        'Health alert: The risk of health effects is increased for everyone.',
      sensitive:
        'Avoid all physical activity outdoors. Move activities indoors or reschedule.',
      elderly:
        'Remain indoors and keep activity levels low. Consult your doctor if you experience symptoms.',
      children: 'Avoid all physical activity outdoors. Keep children indoors.',
      athletes: 'Avoid all outdoor exercise. Move workouts indoors.',
    },
    hazardous: {
      category: 'hazardous',
      general:
        'Health warning of emergency conditions: everyone is more likely to be affected.',
      sensitive:
        'Remain indoors and keep activity levels low. Follow emergency health protocols.',
      elderly:
        'Remain indoors and keep activity minimal. Seek medical attention if experiencing symptoms.',
      children:
        'Keep children indoors with minimal activity. Ensure proper air filtration if available.',
      athletes:
        'Avoid all outdoor activities. Cancel or postpone outdoor training and events.',
    },
  };

export function getHealthMessage(
  category: AQICategory,
  audienceType:
    | 'general'
    | 'sensitive'
    | 'elderly'
    | 'children'
    | 'athletes' = 'general'
): string {
  return healthRecommendations[category][audienceType];
}

export function getHealthActionItems(category: AQICategory): string[] {
  const actions: Record<AQICategory, string[]> = {
    good: ['Enjoy outdoor activities', 'No restrictions needed'],
    moderate: [
      "Watch for symptoms if you're sensitive",
      'Reduce prolonged heavy exertion if needed',
    ],
    'unhealthy-sensitive': [
      'Sensitive groups should reduce outdoor activity',
      'Take more breaks during outdoor activities',
      'Consider rescheduling strenuous activities',
    ],
    unhealthy: [
      'Everyone should reduce outdoor exertion',
      'Sensitive groups should avoid outdoor activities',
      'Close windows and use air filtration',
    ],
    'very-unhealthy': [
      'Avoid all outdoor physical activities',
      'Stay indoors with windows closed',
      'Use air purifiers if available',
      "Follow your doctor's advice about using rescue inhalers",
    ],
    hazardous: [
      'Remain indoors at all times',
      'Keep activity levels to a minimum',
      'Run air purifiers continuously',
      'Seek medical attention if experiencing symptoms',
      'Follow emergency protocols',
    ],
  };
  return actions[category];
}
