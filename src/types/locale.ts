import { Locale } from '../../i18n-config';

export type PageProps<T = Record<string, never>> = {
  params: Promise<{ locale: Locale } & T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};
