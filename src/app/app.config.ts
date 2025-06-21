import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http"; // ✅ THÊM DÒNG NÀY
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(HttpClientModule), // ✅ THÊM DÒNG NÀY
  ],
};
