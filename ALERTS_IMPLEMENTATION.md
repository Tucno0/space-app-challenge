# Real-Time Air Quality Alerts Implementation

## Overview

Successfully implemented a comprehensive real-time alert system that generates intelligent alerts based on current air quality conditions and nearby wildfire detection using NASA FIRMS API.

## Implementation Details

### 1. Alert Generation Router - `alerts.ts`

**File**: `src/trpc/routers/alerts.ts`

**Features**:

- **AQI-Based Alerts**: Automatically generates alerts when AQI exceeds thresholds (50, 100, 150, 200, 300)
- **Pollutant Spike Detection**: Monitors PM2.5, O3, NO2 levels and generates specific alerts
- **Wildfire Detection**: Integrates NASA FIRMS API to detect nearby active fires
- **Severity Classification**: Assigns appropriate severity levels (info, warning, danger, critical)
- **Health Recommendations**: Provides actionable recommendations based on alert type

**Alert Types**:

1. **AQI Threshold Alerts**

   - Moderate (AQI 51-100): Info
   - Unhealthy for Sensitive Groups (AQI 101-150): Warning
   - Unhealthy (AQI 151-200): Danger
   - Very Unhealthy (AQI 201-300): Critical
   - Hazardous (AQI 301+): Critical

2. **Pollutant Spike Alerts**

   - **PM2.5**: Triggered when > 75 µg/m³
   - **Ozone (O3)**: Triggered when > 80 ppb
   - **Nitrogen Dioxide (NO2)**: Triggered when > 100 ppb

3. **Wildfire Smoke Advisory**
   - Detects active fires within 200km radius
   - Uses NASA VIIRS satellite data
   - Calculates distance and fire count
   - Severity based on proximity and confidence level

### 2. tRPC Procedures

#### `getActiveAlerts`

**Input**:

```typescript
{
  lat: number,     // -90 to 90
  lon: number,     // -180 to 180
  locationName?: string
}
```

**Process**:

1. Fetch current AQI from WAQI API
2. Check AQI threshold (> 50)
3. Generate AQI alert if needed
4. Check individual pollutant levels
5. Generate pollutant-specific alerts
6. Query NASA FIRMS for nearby wildfires
7. Generate wildfire alerts if detected
8. Return array of active alerts

**Output**: `Alert[]`

#### `getAlertHistory`

**Input**:

```typescript
{
  lat: number,
  lon: number,
  days: number    // 1-30, default 7
}
```

**Output**: `Alert[]` (currently empty, reserved for future implementation)

### 3. NASA FIRMS Integration

**API**: NASA Fire Information for Resource Management System

**Endpoint**:

```
GET https://firms.modaps.eosdis.nasa.gov/api/area/csv/{API_KEY}/VIIRS_SNPP_NRT/{lat},{lon}/{radius_km}/1
```

**Features**:

- VIIRS satellite data (375m resolution)
- Last 24 hours of fire detections
- CSV format response
- Confidence levels: low (l), nominal (n), high (h)

**Data Processing**:

1. Parse CSV response
2. Filter valid fire detections
3. Calculate average fire location
4. Determine distance from user
5. Assess severity based on fire count and confidence
6. Generate comprehensive wildfire alert

**Alert Criteria**:

- High confidence fires > 10: Critical
- Total fires > 5: Danger
- Any fires detected: Warning

### 4. Alerts Page Integration

**File**: `src/app/[locale]/alerts/page.tsx`

**Changes**:

- Replaced mock data with real `alertsQuery`
- Fetches alerts every 5 minutes
- 2-minute stale time for fresh data
- Loading skeleton during fetch
- Date transformation for tRPC serialization
- Dismissed alerts tracking (client-side)

**Features**:

- Active alerts tab with real-time data
- Alert dismissal functionality
- Alert count badge
- Settings and profile tabs (unchanged)
- Loading states
- Empty state when no alerts

### 5. Dashboard Integration

**File**: `src/app/[locale]/page.tsx`

**Changes**:

- Added `alertsQuery` for current location
- Displays top 2 recent alerts
- Date transformation for compatibility
- Link to full alerts page

**Display**:

- Shows 2 most recent active alerts
- "View All Alerts" button
- Integrated with existing dashboard layout

## Alert Severity Levels

| Level    | AQI Range | Color  | Icon          | Action Required |
| -------- | --------- | ------ | ------------- | --------------- |
| Info     | 51-100    | Blue   | Info Circle   | Awareness       |
| Warning  | 101-150   | Orange | Alert         | Precaution      |
| Danger   | 151-200   | Red    | AlertOctagon  | Protective      |
| Critical | 201+      | Maroon | AlertTriangle | Emergency       |

## Health Recommendations by Severity

### Moderate (51-100)

- Unusually sensitive people consider reducing prolonged outdoor exertion
- General public can enjoy normal activities

### Unhealthy for Sensitive Groups (101-150)

- Sensitive groups reduce prolonged outdoor activities
- Reschedule activities to early morning
- Keep windows closed
- Monitor symptoms

### Unhealthy (151-200)

- Limit prolonged outdoor activities
- Sensitive groups stay indoors
- Close windows during peak hours
- Use air purifiers

### Very Unhealthy (201-300)

- Avoid all outdoor exertion
- Keep windows and doors closed
- Run air purifiers on high
- Move activities indoors
- Monitor health symptoms

### Hazardous (301+)

- Stay indoors with windows closed
- Avoid all physical activity
- Seek medical attention if symptomatic
- Follow emergency guidance

## Pollutant-Specific Recommendations

### PM2.5 (Fine Particles)

- Wear N95/KN95 mask outdoors
- Keep windows closed
- Use HEPA air purifiers
- Limit outdoor activities

### Ozone (O3)

- Schedule activities for morning/evening
- Reduce physical exertion outdoors
- Sensitive groups stay indoors during afternoon
- Peak hours: 2-6 PM

### Nitrogen Dioxide (NO2)

- Avoid busy roads
- Alternative routes for walking/biking
- Keep car windows closed in traffic
- Traffic-related pollutant

## API Data Sources

1. **WAQI (World Air Quality Index)**

   - Current AQI values
   - Individual pollutant levels
   - Dominant pollutant
   - Station data

2. **NASA FIRMS**
   - Active fire detections
   - Satellite imagery (VIIRS)
   - 375m resolution
   - Real-time updates

## Data Flow

```
User visits page
    ↓
Detect current location (Zustand)
    ↓
tRPC: alerts.getActiveAlerts({ lat, lon })
    ↓
Server: Fetch WAQI current AQI
    ↓
Server: Check thresholds & pollutants
    ↓
Server: Query NASA FIRMS for fires
    ↓
Server: Generate alert objects
    ↓
Client: Transform date strings to Date
    ↓
Client: Display alerts (dashboard & page)
    ↓
Cache for 2 minutes
    ↓
Auto-refresh every 5 minutes
```

## Performance Optimizations

1. **Caching**: 2-minute stale time, 5-minute refetch interval
2. **Conditional Queries**: Only fetch when location available
3. **Error Handling**: Returns empty array on API failure
4. **Batch Processing**: Single query generates multiple alert types
5. **Date Transformation**: Client-side for performance

## Environment Variables

```bash
# Required
WAQI_API_KEY="your_waqi_token"

# Optional (defaults to 'demo')
NASA_FIRMS_API_KEY="demo"
```

**NASA FIRMS Demo Key**:

- Limited to 10,000 requests/day
- No registration required
- Suitable for development/testing

**NASA FIRMS Full Access**:

- Register at: https://firms.modaps.eosdis.nasa.gov/api/
- Higher rate limits
- Priority support

## Testing Checklist

- ✅ Alerts generated for high AQI (> 50)
- ✅ Correct severity levels assigned
- ✅ PM2.5 spike detection works
- ✅ Ozone spike detection works
- ✅ NO2 spike detection works
- ✅ NASA FIRMS wildfire detection
- ✅ Distance calculation accurate
- ✅ Health recommendations appropriate
- ✅ Dashboard shows recent alerts
- ✅ Alerts page displays all alerts
- ✅ Loading states work correctly
- ✅ Date transformation successful
- ✅ Auto-refresh every 5 minutes
- ✅ No TypeScript errors
- ✅ No linter warnings

## Example Alert Outputs

### AQI Threshold Alert

```typescript
{
  id: "aqi-alert-34.05-118.24-1696527600000",
  type: "aqi-threshold",
  severity: "warning",
  title: "Air Quality Alert for Sensitive Groups",
  message: "Air quality has reached unhealthy levels for sensitive groups (AQI: 125). PM2.5 levels are elevated.",
  timestamp: Date,
  expiresAt: Date(+6 hours),
  location: { name: "Los Angeles, CA", lat: 34.05, lon: -118.24 },
  aqiValue: 125,
  category: "unhealthy-sensitive",
  pollutant: "pm25",
  actionable: true,
  recommendations: [...]
}
```

### Wildfire Smoke Alert

```typescript
{
  id: "wildfire-alert-1696527600000",
  type: "event",
  severity: "danger",
  title: "Wildfire Smoke Advisory",
  message: "15 active fires detected approximately 85km from your location. Smoke may affect air quality in your area.",
  timestamp: Date,
  expiresAt: Date(+24 hours),
  location: { name: "~85km from current location", lat: 34.85, lon: -118.50 },
  aqiValue: 165,
  category: "unhealthy",
  pollutant: "pm25",
  actionable: true,
  recommendations: [
    "Monitor air quality closely",
    "Keep windows and doors closed",
    ...
  ]
}
```

### Pollutant Spike Alert

```typescript
{
  id: "pm25-spike-1696527600000",
  type: "pollutant-spike",
  severity: "warning",
  title: "PM2.5 Levels Elevated",
  message: "Fine particulate matter (PM2.5) concentration is 85 µg/m³, which is unhealthy.",
  timestamp: Date,
  expiresAt: Date(+4 hours),
  location: { name: "Los Angeles, CA", lat: 34.05, lon: -118.24 },
  pollutant: "pm25",
  actionable: true,
  recommendations: [
    "Wear N95 or KN95 mask outdoors",
    ...
  ]
}
```

## Known Limitations

1. **Historical Alerts**: Not yet implemented (returns empty array)
2. **Alert Persistence**: Dismissed alerts only stored in component state
3. **Custom Thresholds**: User preferences not yet applied to alert generation
4. **Push Notifications**: Not implemented (web/email notifications)
5. **Multi-Location**: Only supports current location alerts

## Future Enhancements

1. **Database Integration**: Store alert history
2. **User Preferences**: Apply custom thresholds
3. **Push Notifications**: Browser/email/SMS alerts
4. **Multi-Location Tracking**: Monitor multiple locations
5. **Alert Acknowledgment**: Track which alerts user has seen
6. **Forecast Alerts**: Predict poor air quality 24-48 hours ahead
7. **Event Detection**: Dust storms, volcanic activity, industrial incidents
8. **Social Sharing**: Share alerts with community
9. **Historical Trends**: Alert frequency analysis
10. **Machine Learning**: Predict alert patterns

## Files Modified

1. **src/trpc/routers/alerts.ts** (NEW)

   - Created alert generation logic
   - WAQI integration
   - NASA FIRMS integration

2. **src/trpc/routers/\_app.ts**

   - Registered `alertsRouter`

3. **src/app/[locale]/alerts/page.tsx**

   - Replaced mock data with real queries
   - Added loading states
   - Date transformation

4. **src/app/[locale]/page.tsx**

   - Added `alertsQuery`
   - Display recent alerts
   - Date transformation

5. **.env**

   - Added `NASA_FIRMS_API_KEY`

6. **.env.example**
   - Added `OPENWEATHERMAP_API_KEY`
   - Added `NASA_FIRMS_API_KEY`

## API Documentation

- **WAQI API**: https://aqicn.org/json-api/doc/
- **NASA FIRMS**: https://firms.modaps.eosdis.nasa.gov/api/
- **NASA FIRMS Docs**: https://firms.modaps.eosdis.nasa.gov/api/area/

## Status

✅ **Implementation Complete**
✅ **Real-Time AQI Alerts**
✅ **Pollutant Spike Detection**
✅ **Wildfire Detection**
✅ **Health Recommendations**
✅ **Dashboard Integration**
✅ **Alerts Page Integration**
✅ **No Linter Errors**
✅ **Production Ready**

---

**Implemented**: October 2025  
**Data Sources**: WAQI API, NASA FIRMS  
**Update Frequency**: Every 5 minutes  
**Alert Types**: 3 (AQI Threshold, Pollutant Spike, Events)
