// This file defines the structure of our translation dictionary for type safety
// It should match the structure in locales/en.json and locales/es.json

export interface Dictionary {
  common: {
    appName: string;
    loading: string;
    error: string;
    save: string;
    cancel: string;
    close: string;
    remove: string;
    add: string;
    edit: string;
    delete: string;
    search: string;
    filter: string;
    viewAll: string;
    viewMore: string;
    learnMore: string;
    accessData: string;
    exportData: string;
    comingSoon: string;
    loadingMap: string;
  };
  navigation: {
    dashboard: string;
    forecast: string;
    alerts: string;
    map: string;
    dataSources: string;
    settings: string;
  };
  home: {
    title: string;
    subtitle: string;
    pollutantLevels: string;
    interactiveMap: string;
    fullScreenMap: string;
    healthRecommendations: string;
    recentAlerts: string;
    viewAllAlerts: string;
    ctaTitle: string;
    ctaDescription: string;
    viewForecast: string;
    configureAlerts: string;
  };
  stats: {
    temperature: string;
    feelsLike: string;
    windSpeed: string;
    humidity: string;
    pressure: string;
    comfortable: string;
    normal: string;
    swDirection: string;
  };
  forecast: {
    title: string;
    subtitle: string;
    forecastAlert: string;
    today: string;
    dayForecast: string;
    averageAQI: string;
    aqiRange: string;
    minToMax: string;
    primaryPollutant: string;
    mostSignificant: string;
    peakHours: string;
    highestAQI: string;
    hourlyForecast: string;
    hourlyDescription: string;
    hourlyConditions: string;
    weekTrend: string;
    weekTrendDescription: string;
  };
  alerts: {
    title: string;
    subtitle: string;
    activeAlerts: string;
    settings: string;
    profile: string;
    noAlerts: string;
    noAlertsDescription: string;
    pastAlerts: string;
    dismissed: string;
    preferencesSaved: string;
    profileChanged: string;
  };
  map: {
    title: string;
    subtitle: string;
    legend: string;
    zoom: string;
    layers: string;
    stations: string;
    satellite: string;
  };
  sources: {
    title: string;
    subtitle: string;
    primarySource: string;
    coverage: string;
    greaterNorthAmerica: string;
    temporalResolution: string;
    hourlyDaylight: string;
    spatialResolution: string;
    cityLevel: string;
    keyPollutants: string;
    orbit: string;
    geostationary: string;
    launchDate: string;
    april2023: string;
    groundStations: string;
    groundDescription: string;
    stations: string;
    dataFrequency: string;
    totalStations: string;
    visitWebsite: string;
    methodology: string;
    dataIntegration: string;
    dataIntegrationText: string;
    qualityAssurance: string;
    qualityAssuranceText: string;
    aqiCalculation: string;
    aqiCalculationText: string;
    forecastModels: string;
    forecastModelsText: string;
    attribution: string;
    attributionText: string;
    attributionList: {
      tempo: string;
      pandora: string;
      tolnet: string;
      openaq: string;
      epa: string;
    };
  };
  settings: {
    title: string;
    subtitle: string;
    preferences: string;
    profile: string;
    locations: string;
    data: string;
    preferencesSaved: string;
    profileUpdated: string;
    locationAdded: string;
    locationRemoved: string;
    dataExportStarted: string;
    savedLocations: string;
    savedLocationsDescription: string;
    addNewLocation: string;
    yourSavedLocations: string;
    accountInfo: string;
    accountInfoDescription: string;
    name: string;
    nameOptional: string;
    namePlaceholder: string;
    email: string;
    emailOptional: string;
    emailPlaceholder: string;
    saveAccountInfo: string;
    dataManagement: string;
    dataManagementDescription: string;
    exportYourData: string;
    exportDescription: string;
    clearLocalData: string;
    clearDataDescription: string;
    clearAllData: string;
    privacy: string;
    privacyText: string;
    units: string;
    metric: string;
    imperial: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    dataRefresh: string;
    showWeatherData: string;
    showStationMarkers: string;
  };
  aqi: {
    categories: {
      good: string;
      moderate: string;
      unhealthySensitive: string;
      unhealthy: string;
      veryUnhealthy: string;
      hazardous: string;
    };
    index: string;
    level: string;
    lastUpdated: string;
  };
  pollutants: {
    o3: string;
    no2: string;
    so2: string;
    formaldehyde: string;
    pm25: string;
    pm10: string;
  };
  health: {
    recommendations: string;
    whatYouShouldDo: string;
    audiences: {
      general: string;
      sensitive: string;
      elderly: string;
      children: string;
      athletes: string;
    };
    messages: {
      good: {
        general: string;
        sensitive: string;
        elderly: string;
        children: string;
        athletes: string;
      };
      moderate: {
        general: string;
        sensitive: string;
        elderly: string;
        children: string;
        athletes: string;
      };
      unhealthySensitive: {
        general: string;
        sensitive: string;
        elderly: string;
        children: string;
        athletes: string;
      };
      unhealthy: {
        general: string;
        sensitive: string;
        elderly: string;
        children: string;
        athletes: string;
      };
      veryUnhealthy: {
        general: string;
        sensitive: string;
        elderly: string;
        children: string;
        athletes: string;
      };
      hazardous: {
        general: string;
        sensitive: string;
        elderly: string;
        children: string;
        athletes: string;
      };
    };
    actions: {
      good: string[];
      moderate: string[];
      unhealthySensitive: string[];
      unhealthy: string[];
      veryUnhealthy: string[];
      hazardous: string[];
    };
  };
  footer: {
    about: string;
    aboutText: string;
    dataSources: string;
    quickLinks: string;
    information: string;
    dashboard: string;
    forecast: string;
    interactiveMap: string;
    aboutLink: string;
    privacy: string;
    terms: string;
    spaceApps: string;
    copyright: string;
    dataProvided: string;
  };
  errors: {
    generic: string;
    noData: string;
    loadingFailed: string;
    locationNotFound: string;
    networkError: string;
  };
  metadata: {
    home: {
      title: string;
      description: string;
    };
    forecast: {
      title: string;
      description: string;
    };
    alerts: {
      title: string;
      description: string;
    };
    map: {
      title: string;
      description: string;
    };
    sources: {
      title: string;
      description: string;
    };
    settings: {
      title: string;
      description: string;
    };
  };
}
