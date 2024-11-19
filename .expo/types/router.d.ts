/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/sign-in` | `/(auth)/sign-up` | `/(tabs)` | `/(tabs)/home` | `/(tabs)/profile` | `/(tabs)/recap` | `/(tabs)/track` | `/_sitemap` | `/home` | `/notificationScreen` | `/profile` | `/recap` | `/searchScreen` | `/sign-in` | `/sign-up` | `/track` | `/updateProfileScreen`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
