// import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
// import { Router, NavigationEnd, RouterOutlet } from "@angular/router";
// import { filter } from "rxjs/operators";
// import { isPlatformBrowser } from "@angular/common";

// @Component({
//   selector: "app-root",
//   standalone: true,
//   imports: [RouterOutlet],
//   templateUrl: "./app.component.html",
//   styleUrls: ["./app.component.css"],
// })
// export class AppComponent implements OnInit {
//   title = "Giày Thể Thao TVM";
//   isBrowser: boolean;

//   constructor(
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit(): void {
//     this.router.events
//       .pipe(
//         filter(
//           (event): event is NavigationEnd => event instanceof NavigationEnd
//         )
//       )
//       .subscribe(() => {
//         this.viewport.scrollToPosition([0, 0]); // (không có smooth)
//       });
//   }
// }

import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { Router, NavigationEnd, RouterOutlet } from "@angular/router";
import { filter } from "rxjs/operators";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Giày Thể Thao TVM";
  isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  }
}
