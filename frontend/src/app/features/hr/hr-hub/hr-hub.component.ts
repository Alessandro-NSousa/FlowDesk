import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FeatureService, HR_FEATURES } from '../../../core/services/feature.service';
import { ShellComponent } from '../../../shared/shell/shell.component';

@Component({
  selector: 'fd-hr-hub',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <fd-shell>
      <div class="page">
        <div class="page-header">
          <div>
            <h2>Recursos Humanos</h2>
            <p>Os módulos abaixo ficam visíveis apenas para usuários com acesso ao setor correspondente.</p>
          </div>
          <span class="feature-count">{{ enabledFeatures().length }} módulo(s)</span>
        </div>

        <div *ngIf="enabledFeatures().length; else emptyState" class="feature-grid">
          <article *ngFor="let feature of enabledFeatures()" [attr.id]="feature.slug" class="feature-card">
            <span class="feature-tag">RH</span>
            <h3>{{ feature.label }}</h3>
            <p>{{ feature.description }}</p>
            <span class="feature-slug">{{ feature.slug }}</span>
          </article>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            Nenhum módulo de RH está habilitado para os setores vinculados ao seu usuário.
          </div>
        </ng-template>
      </div>
    </fd-shell>
  `,
  styles: [`
    .page { padding:1.5rem; }
    .page-header { display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1.5rem; }
    .page-header h2 { margin:0 0 .35rem;font-size:1.5rem;font-weight:700;color:#1f2937; }
    .page-header p { margin:0;color:#6b7280;max-width:42rem; }
    .feature-count { display:inline-flex;align-items:center;justify-content:center;padding:.45rem .8rem;border-radius:999px;background:#dbeafe;color:#1d4ed8;font-size:.8rem;font-weight:700;white-space:nowrap; }
    .feature-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem; }
    .feature-card { display:flex;flex-direction:column;gap:.85rem;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem;box-shadow:0 10px 24px rgba(15,23,42,.06);scroll-margin-top:1.5rem; }
    .feature-tag { align-self:flex-start;padding:.2rem .55rem;border-radius:999px;background:#ede9fe;color:#6d28d9;font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase; }
    .feature-card h3 { margin:0;font-size:1.05rem;color:#111827; }
    .feature-card p { margin:0;color:#4b5563;line-height:1.5; }
    .feature-slug { color:#6b7280;font-size:.82rem;font-family:monospace; }
    .empty-state { background:#fff;border:1px dashed #cbd5e1;border-radius:14px;padding:2rem;color:#64748b;text-align:center; }

    @media (max-width: 768px) {
      .page-header { flex-direction:column; }
      .feature-count { align-self:flex-start; }
    }
  `],
})
export class HrHubComponent {
  private readonly authService = inject(AuthService);
  private readonly featureService = inject(FeatureService);

  readonly enabledFeatures = computed(() => {
    if (this.authService.isAdmin()) {
      return [...HR_FEATURES];
    }

    return this.featureService.listEnabledHrFeatures();
  });
}