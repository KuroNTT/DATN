// import { Component, OnInit } from "@angular/core";
// import { Router, NavigationEnd, RouterOutlet } from "@angular/router";
// import { filter } from "rxjs/operators";

// @Component({
//   selector: "app-root",
//   standalone: true,
//   imports: [RouterOutlet],
//   templateUrl: "./app.component.html",
//   styleUrls: ["./app.component.css"], // sửa styleUrl -> styleUrls
// })
// export class AppComponent implements OnInit {
//   title = "Giày Thể Thao TVM";

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     this.router.events
//       .pipe(filter((event) => event instanceof NavigationEnd))
//       .subscribe(() => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       });
//   }
// }
// khắc phục lỗi window
import { Component, OnInit } from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { Router, NavigationEnd, RouterOutlet } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "Giày Thể Thao TVM";
  constructor(private router: Router, private viewport: ViewportScroller) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.viewport.scrollToPosition([0, 0]); // (không có smooth)
      });
  }
}
