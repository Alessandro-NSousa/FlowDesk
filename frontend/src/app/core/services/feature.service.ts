import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { Sector, SectorFeature } from '../models';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/sectors`;

  private readonly _userFeatureSlugs = signal<Set<string>>(new Set());

  hasFeature(slug: string): boolean {
    return this._userFeatureSlugs().has(slug);
  }

  loadUserFeatures(): Observable<unknown> {
    return this.http.get<{ count: number; results: Sector[] }>(`${this.API}/mine/`).pipe(
      tap((res) => {
        const slugs = new Set<string>();
        for (const sector of res.results) {
          for (const feature of sector.features ?? []) {
            slugs.add(feature.slug);
          }
        }
        this._userFeatureSlugs.set(slugs);
      }),
    );
  }
}
