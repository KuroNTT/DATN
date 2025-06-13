import { Routes } from '@angular/router';
import { SignUpComponent } from './client/pages/sign-up/sign-up.component';
import { LogInComponent } from './client/pages/log-in/log-in.component';
import { ContactComponent } from './client/pages/contact/contact.component';

export const routes: Routes = [
    {path:'sign-up', component:SignUpComponent, title:'Đăng ký'},
    {path:'sign-in', component:LogInComponent, title:'Đăng nhập'},
    {path:'contact', component:ContactComponent, title:'Liên hệ'},
    {
    path: "",
    loadChildren: () =>
      import("./client/client.module").then((m) => m.ClientModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  }
];
