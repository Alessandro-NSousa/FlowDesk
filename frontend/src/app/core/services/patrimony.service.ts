import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Patrimony, PatrimonyPayload } from '../models';

export interface PatrimonyFilters {
  sector_id?: string;
  user_id?: string;
  situation?: string;
  condition?: string;
}

export interface PatrimonyListResponse {
  count: number;
  results: Patrimony[];
}

@Injectable({ providedIn: 'root' })
export class PatrimonyService {
  private readonly http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/patrimony`;

  list(filters?: PatrimonyFilters): Observable<PatrimonyListResponse> {
    let params = new HttpParams();
    if (filters?.sector_id) params = params.set('sector_id', filters.sector_id);
    if (filters?.user_id) params = params.set('user_id', filters.user_id);
    if (filters?.situation) params = params.set('situation', filters.situation);
    if (filters?.condition) params = params.set('condition', filters.condition);
    return this.http.get<PatrimonyListResponse>(this.BASE + '/', { params });
  }

  getById(id: string): Observable<Patrimony> {
    return this.http.get<Patrimony>(`${this.BASE}/${id}/`);
  }

  create(data: PatrimonyPayload): Observable<Patrimony> {
    return this.http.post<Patrimony>(this.BASE + '/', data);
  }

  update(id: string, data: Partial<PatrimonyPayload>): Observable<Patrimony> {
    return this.http.patch<Patrimony>(`${this.BASE}/${id}/`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}/`);
  }
}
