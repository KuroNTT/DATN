import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IBanner } from "../../core/models/structureData";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BannerService {
  private apiUrl = "http://localhost:3000/api/admin/banners";

  constructor(private http: HttpClient) {}

  getAll(): Observable<IBanner[]> {
    return this.http.get<IBanner[]>(this.apiUrl);
  }
}
