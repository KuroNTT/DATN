import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { register } from "swiper/element/bundle";
import { provideHttpClient, withFetch } from "@angular/common/http"; // ⬅️ cái này cần thiết

register();

// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );
bootstrapApplication(AppComponent, {
  ...appConfig, // giữ lại cấu hình cũ
  providers: [...(appConfig.providers || []), provideHttpClient(withFetch())],
}).catch((err) => console.error(err));
