export interface StarterAppConfig {
  name: string;
  label: string;
  appSlugs: string[];
}

export interface StarterAppsConfig {
  [starterId: string]: StarterAppConfig;
}

declare module '@/config/starter-apps.json' {
  const starterAppsConfig: StarterAppsConfig;
  export default starterAppsConfig;
}
