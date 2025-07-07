import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { NgIf, NgFor } from "@angular/common";
import { RouterModule } from "@angular/router";
interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: "app-breadcrumb",
  imports: [NgIf, NgFor, RouterModule],
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.css"],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { label: "Trang chủ", url: "/" },
    { label: "Sản phẩm", url: "/san-pham" },
    { label: "Chi tiết", url: "" },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumb(this.route.root);
      });
  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children = route.children;

    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      const routeURL = child.snapshot.url
        .map((segment) => segment.path)
        .join("/");
      if (routeURL !== "") {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data["breadcrumb"];
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.buildBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
