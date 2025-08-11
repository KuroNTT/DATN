import "@angular/router";

declare module "@angular/router" {
  interface Route {
    renderMode?: "server" | "client";
  }
}
