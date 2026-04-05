import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { PaginatedResponse, Sector, SectorFeature } from '../models';

@Injectable({ providedIn: 'root' })
export class SectorService {
  private readonly http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/sectors`;

  getAll(): Observable<PaginatedResponse<Sector>> {
    return this.http.get<PaginatedResponse<Sector>>(this.BASE + '/');
  }

  getMine(): Observable<PaginatedResponse<Sector>> {
    return this.http.get<PaginatedResponse<Sector>>(`${this.BASE}/mine/`);
  }

  getById(id: string): Observable<Sector> {
    return this.http.get<Sector>(`${this.BASE}/${id}/`);
  }

  create(data: { name: string; description?: string; features?: string[] }): Observable<Sector> {
    return this.http.post<Sector>(this.BASE + '/', data);
  }

  update(id: string, data: { name?: string; description?: string; features?: string[] }): Observable<Sector> {
    return this.http.patch<Sector>(`${this.BASE}/${id}/`, data);
  }

  listAvailableFeatures(): Observable<SectorFeature[]> {
    return this.http.get<SectorFeature[]>(`${this.BASE}/features/`).pipe(
      map((res: any) => Array.isArray(res) ? res : (res.results ?? []))
    );
  }

  addMember(sectorId: string, userId: string): Observable<Sector> {
    return this.http.post<Sector>(`${this.BASE}/${sectorId}/members/add/`, { user_id: userId });
  }

  removeMember(sectorId: string, userId: string): Observable<Sector> {
    return this.http.post<Sector>(`${this.BASE}/${sectorId}/members/remove/`, { user_id: userId });
  }
}
