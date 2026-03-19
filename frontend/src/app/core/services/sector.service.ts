import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PaginatedResponse, Sector } from '../models';

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

  create(data: { name: string; description?: string }): Observable<Sector> {
    return this.http.post<Sector>(this.BASE + '/', data);
  }

  update(id: string, data: { name?: string; description?: string }): Observable<Sector> {
    return this.http.patch<Sector>(`${this.BASE}/${id}/`, data);
  }

  addMember(sectorId: string, userId: string): Observable<Sector> {
    return this.http.post<Sector>(`${this.BASE}/${sectorId}/members/add/`, { user_id: userId });
  }

  removeMember(sectorId: string, userId: string): Observable<Sector> {
    return this.http.post<Sector>(`${this.BASE}/${sectorId}/members/remove/`, { user_id: userId });
  }
}
