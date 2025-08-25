import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { register } from "swiper/element/bundle";
import { provideHttpClient, withFetch } from "@angular/common/http"; // ⬅️ cái này cần thiết
import { enableProdMode } from "@angular/core";

register();

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [...(appConfig.providers || []), provideHttpClient(withFetch())],
}).catch((err) => console.error(err));
