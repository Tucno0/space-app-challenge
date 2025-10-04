<!-- 26807ed8-3a96-4e22-8c89-987eb6acbee8 2f196759-a4b5-4aac-a6be-4ce01e51361d -->
# i18n Implementation for AirCast

## Configuration Setup

**Create i18n configuration file** (`i18n-config.ts`)

- Define supported locales: 'en' and 'es'
- Set default locale as 'en'
- Export locale type and configuration

**Create locale detection utilities** (`lib/locale-detection.ts`)

- Implement Geo-IP detection using Vercel headers (x-vercel-ip-country, x-vercel-ip-continent)
- Implement browser Accept-Language header parsing
- Create locale resolution logic with priority: saved preference > geo-IP > browser > default
- Add locale cookie management functions

**Create middleware** (`middleware.ts`)

- Detect user locale from geo-IP headers, browser, and cookies
- Redirect root path to appropriate locale sub-path (e.g., / → /en or /es)
- Set locale cookie for persistence
- Handle locale switching requests
- Configure matcher to include all routes except static assets and API

## Translation Files

**Create English translation file** (`locales/en.json`)

- Organize by sections: common, navigation, pages, components, health, errors
- Include all UI text from pages, components, navigation, footer
- Include AQI categories, pollutant names, health recommendations
- Include form labels, buttons, alerts, toast messages

**Create Spanish translation file** (`locales/es.json`)

- Mirror English file structure with Spanish translations
- Translate all UI strings maintaining context
- Use proper Spanish terminology for air quality terms (e.g., "Calidad del Aire", "Pronóstico")

**Create dictionary loader** (`lib/get-dictionary.ts`)

- Async function to load locale JSON files
- Type-safe dictionary access
- Error handling for missing translations

## App Structure Migration

**Update app directory structure**

- Move all current routes into `app/[locale]` folder
- Migrate: page.tsx, layout.tsx, forecast/page.tsx, alerts/page.tsx, map/page.tsx, sources/page.tsx, settings/page.tsx
- Create new root layout that handles locale parameter

**Create locale-aware root layout** (`app/[locale]/layout.tsx`)

- Accept locale parameter from URL
- Load dictionary for the locale
- Update html lang attribute dynamically
- Update metadata generation to be locale-aware
- Wrap with LanguageProvider for client components

**Create locale params type** (`types/locale.ts`)

- Define PageProps type with locale parameter
- Export for type safety across pages

## Page Updates

**Update all pages to accept locale parameter**

- Update HomePage (Dashboard)
- Update ForecastPage
- Update AlertsPage
- Update MapPage
- Update SourcesPage
- Update SettingsPage

**Replace hardcoded text with dictionary lookups**

- Use t() function for translations
- Convert all page titles, descriptions, labels, buttons
- Convert all card titles and content
- Convert error messages and empty states

## Component Updates

**Create Language Switcher component** (`components/layout/language-switcher.tsx`)

- Dropdown or toggle for EN/ES selection
- Show current locale with flag or text
- Update locale cookie and navigate to new locale path
- Use router.push with new locale

**Create i18n Context** (`contexts/language-context.tsx`)

- Provide current locale and dictionary
- Provide function to change locale
- Handle client-side locale switching

**Create useTranslation hook** (`hooks/use-translation.ts`)

- Access dictionary from context
- Type-safe translation function
- Support for nested keys (e.g., "common.buttons.save")

**Update Header component**

- Add LanguageSwitcher to header
- Make navigation labels use translations
- Update logo and brand text if needed

**Update Navigation component**

- Use dictionary for nav item labels
- Maintain locale in navigation links

**Update Footer component**

- Translate all footer sections
- Translate copyright and attribution text
- Update link labels

**Update Health Recommendations component**

- Move health messages to translation files
- Create translation keys for all audience types and AQI categories
- Update getHealthMessage to use i18n

**Update AQI utility functions** (`lib/aqi-calculator.ts`)

- Add translation support for category labels
- Add translation support for pollutant names
- Accept locale parameter or use context

**Update form components**

- Translate all form labels, placeholders, validation messages
- Update PreferencesForm, AlertConfigForm, AudienceSelector

## Settings Page Enhancement

**Add language preference to settings**

- Add language selector in preferences form
- Save language preference to localStorage
- Sync with locale cookie

## Metadata Updates

**Create locale-aware metadata generator** (`lib/metadata.ts`)

- Generate metadata based on locale
- Translate page titles, descriptions
- Set proper og:locale tags
- Support alternate language links

**Update all page metadata exports**

- Use generateMetadata function with locale
- Include translated titles and descriptions

## Type Safety

**Create translation types** (`types/translations.ts`)

- Define interface matching translation JSON structure
- Export for type checking in components

## Testing Checklist

- Test locale detection from different countries (via header simulation)
- Test manual language switching
- Test locale persistence across navigation
- Test all pages in both languages
- Test that links maintain locale
- Test metadata in both languages
- Verify no hardcoded strings remain
- Test fallback to default locale

## Key Files to Create/Modify

**New Files:**

- `i18n-config.ts`
- `middleware.ts`
- `locales/en.json`
- `locales/es.json`
- `lib/get-dictionary.ts`
- `lib/locale-detection.ts`
- `lib/metadata.ts`
- `contexts/language-context.tsx`
- `hooks/use-translation.ts`
- `components/layout/language-switcher.tsx`
- `types/locale.ts`
- `types/translations.ts`

**Modified Files:**

- Move `app/layout.tsx` → `app/[locale]/layout.tsx`
- Move `app/page.tsx` → `app/[locale]/page.tsx`
- Move all pages to `app/[locale]/*`
- Update `components/layout/header.tsx`
- Update `components/layout/navigation.tsx`
- Update `components/layout/footer.tsx`
- Update `lib/aqi-calculator.ts`
- Update `lib/health-messages.ts`
- Update all page components

## Implementation Notes

- Use dynamic imports for locale files to optimize bundle size
- Implement proper SEO with alternate language links
- Ensure all user-facing text is translated
- Maintain English as the default/fallback language
- Keep translation keys organized by feature/section
- Use nested objects in JSON for better organization
- Consider using a translation key naming convention like `section.component.field`

### To-dos

- [ ] Create i18n configuration, locale detection utilities, and middleware for routing
- [ ] Create comprehensive English and Spanish translation JSON files with all UI strings
- [ ] Migrate app directory to [locale] structure and update root layout
- [ ] Create language context, translation hooks, and language switcher component
- [ ] Update all pages to accept locale parameter and use translations
- [ ] Update all components (Header, Footer, Navigation, Health, AQI utilities) to use translations
- [ ] Implement locale-aware metadata generation and SEO optimization