import { AQICategory, HealthRecommendation } from '@/types/air-quality';

export const healthRecommendations: Record<AQICategory, HealthRecommendation> =
  {
    good: {
      category: 'good',
      general:
        'Air quality is satisfactory, and air pollution poses little or no risk. This is an ideal time for all outdoor activities. The air is clean and healthy to breathe, with pollutant levels well below health-based standards.',
      sensitive:
        'Enjoy your outdoor activities without restrictions. This is an excellent time for people with respiratory conditions, heart disease, or other sensitivities to be active outdoors. No special precautions are needed.',
      elderly:
        'Safe to spend time outdoors with no restrictions. This is a great day for walks, gardening, or any outdoor hobbies. The clean air supports healthy breathing and cardiovascular function.',
      children:
        'Great day for outdoor play and activities. Children can safely engage in sports, playground activities, and outdoor games for extended periods. The air quality supports healthy lung development and active play.',
      athletes:
        'Perfect conditions for outdoor exercise and training. You can safely perform high-intensity workouts, long-distance running, or any strenuous outdoor activities. The air quality will not impact athletic performance or recovery.',
    },
    moderate: {
      category: 'moderate',
      general:
        'Air quality is acceptable for most people. However, there may be a risk for some individuals, particularly those who are unusually sensitive to air pollution. Symptoms like coughing or shortness of breath may occur in sensitive individuals during prolonged outdoor activity.',
      sensitive:
        'Consider reducing prolonged or heavy outdoor exertion if you experience symptoms like coughing, chest tightness, or shortness of breath. Take breaks indoors if needed. Those with asthma or COPD should keep rescue medication readily available.',
      elderly:
        "It's generally safe, but watch for any unusual symptoms such as increased fatigue, breathing difficulty, or chest discomfort. If you have heart or lung conditions, consider lighter activities and take frequent breaks.",
      children:
        'Reduce prolonged or heavy outdoor activities, especially for children with asthma or allergies. Limit outdoor sports to 2-3 hours. Watch for symptoms like excessive coughing, wheezing, or fatigue, and move indoors if these occur.',
      athletes:
        'Consider reducing the intensity of outdoor workouts by 10-20%. You can still train outdoors, but avoid peak pollution hours (typically midday). Stay well hydrated and monitor for any respiratory discomfort during high-intensity intervals.',
    },
    'unhealthy-sensitive': {
      category: 'unhealthy-sensitive',
      general:
        'Members of sensitive groups may experience health effects including increased respiratory symptoms, aggravation of heart or lung disease, and decreased lung function. The general public is less likely to be affected, but may experience minor irritation during prolonged outdoor activities.',
      sensitive:
        'Reduce prolonged or heavy outdoor exertion. Take more breaks during outdoor activities, limiting continuous outdoor exposure to 30-60 minutes. Move activities indoors if you experience coughing, shortness of breath, or chest tightness. Use prescribed medications as recommended by your doctor.',
      elderly:
        'Consider moving activities indoors or rescheduling to when air quality is better, particularly if you have heart or lung conditions. Short outdoor trips (15-30 minutes) are generally acceptable, but avoid strenuous activities. Close windows and use air conditioning with clean filters.',
      children:
        'Reduce prolonged or heavy outdoor activities to less than 1 hour at a time. Schedule outdoor activities during early morning or evening when air quality is typically better. Watch for symptoms like persistent coughing, wheezing, or difficulty breathing. Children with asthma should have their inhaler readily available.',
      athletes:
        'Reduce the intensity and duration of outdoor exercise by 30-50%. Consider shifting to indoor training facilities. If training outdoors, choose early morning hours and avoid high-intensity intervals. Allow more recovery time between intense efforts and stay well-hydrated.',
    },
    unhealthy: {
      category: 'unhealthy',
      general:
        'Everyone may begin to experience health effects including difficulty breathing, coughing, and eye irritation. Members of sensitive groups may experience more serious health effects such as aggravation of cardiovascular or respiratory disease. Prolonged outdoor exposure is not recommended.',
      sensitive:
        'Avoid prolonged or heavy outdoor exertion. Move activities indoors or reschedule to a day with better air quality. If you must go outside, keep trips brief (under 15 minutes) and avoid physical activity. Use air purifiers indoors and keep windows closed. Have medications readily accessible.',
      elderly:
        "Stay indoors and keep activity levels low to moderate. Follow your doctor's advice about medication use, and consider increasing doses of prescribed respiratory medications if advised. Close all windows, use air conditioning with HEPA filters, and avoid using fireplaces or candles that could worsen indoor air quality.",
      children:
        'Avoid prolonged or heavy outdoor activities. Keep children indoors with windows closed. Brief outdoor exposure (5-10 minutes) for necessary activities is acceptable, but no running or active play. Watch for symptoms like persistent cough, wheezing, chest pain, or difficulty breathing and seek medical attention if severe.',
      athletes:
        'Move workouts indoors or reschedule to when air quality improves. Any outdoor training should be avoided. Use indoor facilities for cardiovascular and strength training. This is not the time for outdoor competitions or high-intensity training sessions that require elevated breathing rates.',
    },
    'very-unhealthy': {
      category: 'very-unhealthy',
      general:
        'Health alert: The risk of health effects is significantly increased for everyone. Most people will experience difficulty breathing, coughing, chest tightness, and eye irritation. This air quality level may trigger serious health responses in sensitive individuals. Outdoor activity should be minimized for all groups.',
      sensitive:
        'Avoid all physical activity outdoors. Remain indoors with windows and doors closed. Move all activities indoors or postpone until air quality improves. Use air purifiers with HEPA filters. Have emergency medications available and be prepared to seek medical care if symptoms worsen. Consider wearing N95 masks if you must go outside briefly.',
      elderly:
        'Remain indoors and keep activity levels low. Minimize even light physical activity. Consult your doctor if you experience symptoms like increased shortness of breath, chest pain, irregular heartbeat, or extreme fatigue. Keep windows closed, use air conditioning with clean filters, and run air purifiers. Have someone check on you regularly.',
      children:
        "Avoid all physical activity outdoors. Keep children indoors with minimal activity even inside. Cancel all outdoor school activities, sports, and recess. Watch closely for symptoms requiring medical attention: severe coughing, wheezing, rapid breathing, chest pain, or bluish lips. Use air purifiers in children's rooms and keep rescue inhalers accessible.",
      athletes:
        'Avoid all outdoor exercise. Move all workouts indoors using gyms or home equipment. This is not suitable for any outdoor training - even light jogging is not recommended. Focus on indoor strength training, yoga, or low-intensity activities. Postpone competitions and races. Consider this a rest or light training day to allow your body to avoid stress.',
    },
    hazardous: {
      category: 'hazardous',
      general:
        'Health warning of emergency conditions: Everyone is likely to be affected by serious health effects. This represents a public health emergency. Exposure can cause severe respiratory distress, cardiovascular problems, and other serious health impacts. Everyone should remain indoors and minimize all activity.',
      sensitive:
        'Remain indoors and keep activity levels to an absolute minimum. Follow emergency health protocols provided by local authorities. Avoid all outdoor exposure, even brief trips. Use N95 or better respirator masks if evacuation is necessary. Have emergency medications prepared and accessible. Seek immediate medical attention for severe symptoms like severe shortness of breath, chest pain, or confusion.',
      elderly:
        'Remain indoors and keep activity minimal - rest as much as possible. Seek immediate medical attention if experiencing symptoms such as severe breathing difficulty, chest pain, dizziness, or extreme fatigue. Keep all windows and doors sealed. Use air purifiers on maximum settings. Have caregivers check on you frequently. Keep emergency contact numbers readily available.',
      children:
        'Keep children indoors with minimal activity. All schools should be closed. Ensure proper air filtration with HEPA purifiers running continuously. Seal windows and doors with weather stripping if available. Watch for emergency symptoms requiring immediate medical care: severe difficulty breathing, blue-tinted lips or fingernails, severe coughing fits, extreme lethargy, or confusion. Consider evacuation if conditions persist.',
      athletes:
        'Avoid all outdoor activities. Cancel or postpone all outdoor training sessions, events, and competitions immediately. Remain indoors with minimal physical activity - treat this as a mandatory rest day. Do not attempt indoor high-intensity workouts as even elevated breathing rates indoors may be problematic if outdoor air is infiltrating. Focus on light stretching, meditation, or complete rest until conditions improve substantially.',
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

export function getHealthActionItems(
  category: AQICategory,
  audienceType:
    | 'general'
    | 'sensitive'
    | 'elderly'
    | 'children'
    | 'athletes' = 'general'
): string[] {
  const actions: Record<
    AQICategory,
    Record<
      'general' | 'sensitive' | 'elderly' | 'children' | 'athletes',
      string[]
    >
  > = {
    good: {
      general: [
        'Enjoy outdoor activities without restrictions',
        'Perfect day for exercise, sports, and recreation',
        'No special precautions needed',
        'Great time for outdoor gatherings and events',
      ],
      sensitive: [
        'Safe to participate in all outdoor activities',
        'No need for rescue medication today',
        'Excellent conditions for people with respiratory conditions',
        'Feel free to exercise outdoors without concerns',
      ],
      elderly: [
        'Perfect day for walks and outdoor hobbies',
        'Safe for all physical activity levels',
        'Enjoy gardening, walking, or social activities outdoors',
        'No cardiovascular or respiratory concerns today',
      ],
      children: [
        'Let children play outside freely',
        'Perfect for outdoor sports and playground time',
        'No time limits on outdoor activities',
        'Great day for school outdoor activities and recess',
      ],
      athletes: [
        'Ideal for high-intensity training and competitions',
        'No need to adjust workout intensity or duration',
        'Perfect for long-distance running and endurance training',
        'Optimal conditions for outdoor athletic events',
      ],
    },
    moderate: {
      general: [
        'Enjoy outdoor activities as normal for most people',
        'Watch for unusual symptoms during prolonged exertion',
        'Stay hydrated during outdoor activities',
        'No major restrictions for healthy individuals',
      ],
      sensitive: [
        'Monitor for symptoms (coughing, shortness of breath)',
        'Keep rescue inhalers accessible if you have asthma',
        'Take breaks if you experience any discomfort',
        'Consider lighter activities if you feel symptoms',
      ],
      elderly: [
        'Continue normal activities but take regular breaks',
        'Watch for fatigue, chest discomfort, or breathing difficulty',
        'Stay well-hydrated during outdoor time',
        'Consult your doctor if you have concerns',
      ],
      children: [
        'Limit intense outdoor play to 2-3 hours',
        'Watch for excessive coughing or wheezing',
        'Have asthmatic children take breaks more frequently',
        'Bring outdoor play indoors if symptoms appear',
      ],
      athletes: [
        'Reduce workout intensity by 10-20%',
        'Avoid training during peak pollution hours (midday)',
        'Monitor for respiratory discomfort during intervals',
        'Allow slightly longer recovery between hard efforts',
      ],
    },
    'unhealthy-sensitive': {
      general: [
        'Most people can continue light outdoor activities',
        'Avoid prolonged strenuous outdoor exertion',
        'Take frequent breaks during outdoor activities',
        'Move indoors if you experience any discomfort',
      ],
      sensitive: [
        'Limit outdoor time to 30-60 minutes maximum',
        'Use prescribed medications as recommended',
        'Move indoors immediately if symptoms develop',
        'Avoid all strenuous outdoor activities',
      ],
      elderly: [
        'Keep outdoor trips short (15-30 minutes)',
        'Avoid strenuous activities outdoors',
        'Close windows and use air conditioning with filters',
        'Have medications readily available',
      ],
      children: [
        'Limit outdoor play to less than 1 hour',
        'Cancel outdoor sports and reduce recess time',
        'Have asthmatic children keep inhalers nearby',
        'Schedule outdoor time during early morning or evening',
      ],
      athletes: [
        'Reduce training intensity by 30-50%',
        'Move workouts indoors if possible',
        'Train only during early morning hours if outdoors',
        'Skip high-intensity intervals and speed work',
      ],
    },
    unhealthy: {
      general: [
        'Limit all outdoor activities to essential trips only',
        'Keep windows and doors closed',
        'Use HEPA air filtration if available',
        'Avoid outdoor exertion',
      ],
      sensitive: [
        'Stay indoors and avoid all outdoor activities',
        'Have emergency medications readily accessible',
        'Use air purifiers with HEPA filters',
        'Keep outdoor trips under 15 minutes if absolutely necessary',
      ],
      elderly: [
        'Remain indoors with minimal activity',
        "Follow doctor's advice on medication use",
        'Close all windows and use air conditioning with HEPA filters',
        'Avoid fireplaces and candles indoors',
      ],
      children: [
        'Keep children indoors with windows closed',
        'Cancel all outdoor activities and sports',
        'No outdoor recess or playtime',
        'Watch for persistent cough or difficulty breathing',
      ],
      athletes: [
        'Cancel all outdoor training sessions',
        'Move workouts entirely indoors',
        'Postpone outdoor competitions and races',
        'Focus on low-intensity indoor cross-training',
      ],
    },
    'very-unhealthy': {
      general: [
        'Stay indoors with all windows and doors closed',
        'Run air purifiers continuously',
        'Cancel all outdoor plans and events',
        'Limit even indoor physical activity',
      ],
      sensitive: [
        'Remain indoors with minimal activity',
        'Have emergency medications prepared and accessible',
        'Use multiple air purifiers with HEPA filters',
        'Wear N95 mask if you must go outside briefly',
      ],
      elderly: [
        'Stay home and rest as much as possible',
        'Have someone check on you regularly',
        'Keep emergency contact numbers readily available',
        'Seek medical attention for any worsening symptoms',
      ],
      children: [
        'Keep children indoors with quiet activities only',
        "Run air purifiers in children's rooms",
        'Cancel all school outdoor activities',
        'Watch closely for severe coughing or breathing difficulty',
      ],
      athletes: [
        'Treat this as a mandatory rest day',
        'Do not exercise outdoors under any circumstances',
        'Postpone all competitions and events',
        'Focus on stretching, foam rolling, or complete rest',
      ],
    },
    hazardous: {
      general: [
        'This is an emergency - remain indoors at all times',
        'Seal windows and doors to prevent air infiltration',
        'Run multiple air purifiers continuously',
        'Follow emergency protocols from local authorities',
      ],
      sensitive: [
        'Maintain absolute minimum activity even indoors',
        'Have emergency medical plan ready',
        'Use N95 or P100 masks if evacuation is necessary',
        'Seek immediate medical care for severe symptoms',
      ],
      elderly: [
        'Rest completely and minimize all movement',
        'Have caregivers monitor you frequently',
        'Keep emergency services on speed dial',
        'Prepare evacuation supplies if conditions worsen',
      ],
      children: [
        'Keep children in rooms with best air filtration',
        'All schools should be closed',
        'Watch for blue-tinted lips or extreme lethargy',
        'Have evacuation plan ready if needed',
      ],
      athletes: [
        'Complete rest - no training of any kind',
        'Do not exercise even indoors',
        'Cancel and postpone all athletic events immediately',
        'Focus on meditation and mental recovery only',
      ],
    },
  };
  return actions[category][audienceType];
}
