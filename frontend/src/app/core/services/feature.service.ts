import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { Sector, SectorFeature } from '../models';

export interface SectorModuleFeature {
  slug: string;
  label: string;
  description: string;
}

export const HR_FEATURES: readonly SectorModuleFeature[] = [
  {
    slug: 'hr-employees',
    label: 'Colaboradores',
    description: 'Consulta rápida dos colaboradores vinculados ao setor de Recursos Humanos.',
  },
  {
    slug: 'hr-recruitment',
    label: 'Recrutamento e Seleção',
    description: 'Acompanha o pipeline inicial de vagas e processos seletivos do RH.',
  },
  {
    slug: 'hr-leave',
    label: 'Férias e Ausências',
    description: 'Centraliza o acompanhamento de férias, folgas e ausências planejadas.',
  },
  {
    slug: 'hr-performance',
    label: 'Avaliação de Desempenho',
    description: 'Organiza ciclos de avaliação e acompanhamento de desempenho do time.',
  },
  {
    slug: 'hr-training',
    label: 'Treinamento e Desenvolvimento',
    description: 'Lista os módulos habilitados para capacitação e desenvolvimento interno.',
  },
];

export const HR_FEATURE_SLUGS = HR_FEATURES.map((feature) => feature.slug);

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/sectors`;

  private readonly _userFeatureSlugs = signal<Set<string>>(new Set());

  hasFeature(slug: string): boolean {
    return this._userFeatureSlugs().has(slug);
  }

  hasAnyFeature(slugs: readonly string[]): boolean {
    const userFeatureSlugs = this._userFeatureSlugs();
    return slugs.some((slug) => userFeatureSlugs.has(slug));
  }

  listEnabledHrFeatures(): SectorModuleFeature[] {
    const userFeatureSlugs = this._userFeatureSlugs();
    return HR_FEATURES.filter((feature) => userFeatureSlugs.has(feature.slug));
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
