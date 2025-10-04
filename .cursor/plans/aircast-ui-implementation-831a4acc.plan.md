<!-- 831a4acc-e839-4685-934e-6d1d18e8cc8f 3608496c-343a-422a-864b-0917e0143310 -->
# AirCast UI Implementation Plan

## 1. Core Layout & Navigation

### App Layout Enhancement

- Update `src/app/layout.tsx` with proper metadata (title, description, OpenGraph)
- Add theme provider (dark/light mode support)
- Integrate Toaster for notifications (Sonner already installed)

### Main Navigation Component

- Create `src/components/layout/header.tsx` - App header with navigation
- Create `src/components/layout/footer.tsx` - Footer with data attribution
- Create `src/components/layout/navigation.tsx` - Responsive nav menu
- Include: Logo, main nav links, location selector, theme toggle, language selector

## 2. Main Pages & Routes

### Home/Dashboard Page (`src/app/page.tsx`)

- Hero section with current location air quality overview
- Large interactive map with air quality overlay
- Current AQI indicator card (prominent display)
- Quick stats cards (O₃, NO₂, SO₂, Formaldehyde levels)
- Recent alerts section
- "How's your air?" call-to-action

### Forecast Page (`src/app/forecast/page.tsx`)

- Multi-day forecast view (24h, 48h, 7-day)
- Hourly breakdown with charts
- Predicted AQI trends
- Weather integration (wind, temperature, humidity)
- Event warnings (fires, dust storms)

### Alerts Page (`src/app/alerts/page.tsx`)

- Alert history timeline
- Active alerts list
- Alert configuration form
- Notification preferences
- Threshold customization by user type (general, sensitive groups, athletes)

### Map Page (`src/app/map/page.tsx`)

- Full-screen interactive map
- Multiple layer toggles (O₃, NO₂, SO₂, formaldehyde, weather)
- Ground station markers
- TEMPO satellite data overlay
- Heat map visualization
- Time slider for historical data

### Data Sources Page (`src/app/sources/page.tsx`)

- Information about TEMPO satellite
- Ground station network (Pandora, OpenAQ)
- Meteorological data sources
- Data attribution and credits
- Scientific methodology explanation

### Settings Page (`src/app/settings/page.tsx`)

- Location preferences
- User profile (audience type selection)
- Notification settings
- Units preferences (metric/imperial)
- Language selection
- Privacy preferences

## 3. Reusable Components

### Air Quality Components (`src/components/air-quality/`)

- `aqi-badge.tsx` - Color-coded AQI indicator
- `aqi-card.tsx` - Detailed AQI display with breakdown
- `pollutant-card.tsx` - Individual pollutant level display
- `health-recommendation.tsx` - Health advice based on AQI
- `aqi-scale.tsx` - Visual AQI scale reference

### Map Components (`src/components/map/`)

- `air-quality-map.tsx` - Main interactive Leaflet map
- `map-controls.tsx` - Map layer toggles and controls
- `map-legend.tsx` - Color scale legend for air quality
- `station-marker.tsx` - Ground station map markers
- `location-search.tsx` - Search box for map

### Chart Components (`src/components/charts/`)

- `trend-chart.tsx` - Time series chart (Recharts line/area)
- `pollutant-breakdown.tsx` - Bar chart for multiple pollutants
- `forecast-chart.tsx` - Multi-line forecast visualization
- `historical-comparison.tsx` - Compare historical periods
- `weather-overlay-chart.tsx` - Combined air quality + weather

### Alert Components (`src/components/alerts/`)

- `alert-card.tsx` - Individual alert display
- `alert-banner.tsx` - Top banner for urgent alerts
- `alert-config-form.tsx` - Alert preference configuration
- `notification-toggle.tsx` - Enable/disable notifications

### Location Components (`src/components/location/`)

- `location-selector.tsx` - Dropdown/search for location
- `location-autocomplete.tsx` - Location search with suggestions
- `current-location-button.tsx` - Geolocation detector
- `saved-locations.tsx` - User's saved locations list

### Data Display Components (`src/components/data/`)

- `stat-card.tsx` - Statistical display card
- `metric-display.tsx` - Individual metric with icon
- `data-source-badge.tsx` - Source attribution tag
- `loading-skeleton.tsx` - Loading states
- `error-display.tsx` - Error handling UI
- `no-data-message.tsx` - Empty state display

### Event Components (`src/components/events/`)

- `event-card.tsx` - Wildfire, dust storm, etc. display
- `event-map-overlay.tsx` - Event visualization on map
- `event-timeline.tsx` - Historical events timeline

### Form Components (`src/components/forms/`)

- `preferences-form.tsx` - User preferences form
- `audience-selector.tsx` - User type selection (general, sensitive, athlete, etc.)
- `threshold-config.tsx` - Custom alert thresholds

## 4. Type Definitions & Mock Data

### Types (`src/types/`)

- `air-quality.ts` - AQI, pollutant types
- `location.ts` - Location, coordinates types
- `forecast.ts` - Forecast data types
- `alert.ts` - Alert types
- `weather.ts` - Weather data types
- `station.ts` - Ground station types

### Mock Data (`src/lib/mock-data/`)

- `air-quality-data.ts` - Sample AQI readings
- `forecast-data.ts` - Sample forecast data
- `stations-data.ts` - Ground station locations
- `alerts-data.ts` - Sample alerts
- `weather-data.ts` - Sample weather data
- `events-data.ts` - Sample events (fires, storms)

## 5. Utilities & Helpers

### Utils (`src/lib/`)

- `aqi-calculator.ts` - AQI calculation and categorization
- `color-scales.ts` - Color mapping for AQI levels
- `health-messages.ts` - Health recommendations by AQI
- `date-formatters.ts` - Date/time formatting utilities
- `geolocation.ts` - Geolocation helpers
- `unit-conversion.ts` - Metric/imperial conversions

## 6. Dependencies to Install

```bash
bun add leaflet react-leaflet @types/leaflet
bun add date-fns-tz
```

## 7. Configuration Updates

### Tailwind Custom Colors

- Add AQI-specific color palette to `src/app/globals.css`
- Colors: Good (green), Moderate (yellow), Unhealthy for Sensitive (orange), Unhealthy (red), Very Unhealthy (purple), Hazardous (maroon)

## 8. Responsive Design Considerations

- Mobile-first approach
- Collapsible navigation on mobile
- Touch-friendly map controls
- Stacked charts on small screens
- Bottom navigation for mobile
- Optimized data loading for mobile networks

## Key Files to Create/Modify

**Modified:**

- `src/app/layout.tsx` - Enhanced with providers
- `src/app/page.tsx` - Complete dashboard
- `src/app/globals.css` - Custom AQI colors

**New Pages (8):**

- `src/app/forecast/page.tsx`
- `src/app/alerts/page.tsx`
- `src/app/map/page.tsx`
- `src/app/sources/page.tsx`
- `src/app/settings/page.tsx`

**New Components (~35 components across categories)**

**New Types & Utils (~15 files)**

This creates a production-ready, beautiful, and functional UI that fulfills all requirements from the NASA Space Apps Challenge while remaining modular and extensible for future API integration.

### To-dos

- [ ] Create core layout components (header, footer, navigation) with responsive design
- [ ] Build all main pages (home/dashboard, forecast, alerts, map, sources, settings)
- [ ] Create air quality display components (AQI badge, cards, pollutant displays, health recommendations)
- [ ] Implement interactive map with Leaflet, layer controls, markers, and legends
- [ ] Build chart components with Recharts for trends, forecasts, and historical data
- [ ] Create alert components and notification system UI
- [ ] Implement location selector, autocomplete, and geolocation features
- [ ] Define TypeScript types and create comprehensive mock data for all features
- [ ] Build utility functions (AQI calculator, color scales, formatters, conversions)
- [ ] Configure custom AQI color palette, theme provider, and ensure responsive design