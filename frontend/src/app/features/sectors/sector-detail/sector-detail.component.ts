import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SectorService } from '../../../core/services/sector.service';
import { UserService } from '../../../core/services/user.service';
import { Sector, SectorFeature, User } from '../../../core/models';
import { ShellComponent } from '../../../shared/shell/shell.component';

@Component({
  selector: 'fd-sector-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ShellComponent],
  template: `
    <fd-shell>
      <div class="page" *ngIf="sector(); else loading">
        <div class="breadcrumb">
          <a routerLink="/sectors">Setores</a> / {{ sector()!.name }}
        </div>

        <div class="sector-card">
          <h2>{{ sector()!.name }}</h2>
          <p class="desc">{{ sector()!.description || 'Sem descrição.' }}</p>

          <!-- Funcionalidades -->
          <div class="section" *ngIf="availableFeatures().length">
            <h3>Funcionalidades</h3>
            <div class="features-list">
              <label *ngFor="let f of availableFeatures()" class="feature-item">
                <input
                  type="checkbox"
                  [checked]="isSectorFeatureEnabled(f.slug)"
                  [disabled]="f.slug === 'tickets'"
                  (change)="toggleSectorFeature(f.slug, $any($event.target).checked)"
                />
                <span>{{ f.name }}</span>
                <span *ngIf="f.slug === 'tickets'" class="badge-default">padrão</span>
              </label>
            </div>
            <div *ngIf="featuresError()" class="alert-error">{{ featuresError() }}</div>
          </div>

          <h3>Membros ({{ sector()!.members.length }})</h3>
          <ul class="member-list">
            <li *ngFor="let m of sector()!.members" class="member-item">
              <div>
                <strong>{{ m.first_name }} {{ m.last_name }}</strong>
                <span class="email">{{ m.email }}</span>
              </div>
              <button (click)="removeMember(m.id)" class="btn-remove">Remover</button>
            </li>
          </ul>

          <!-- Adicionar membro RF11 -->
          <div class="add-member">
            <h4>Adicionar membro</h4>
            <div class="add-row">
              <select [(ngModel)]="newMemberId" class="form-control">
                <option value="">Selecione um usuário...</option>
                <option *ngFor="let u of availableUsers()" [value]="u.id">
                  {{ u.first_name }} {{ u.last_name }}
                </option>
              </select>
              <button (click)="addMember()" class="btn btn-primary" [disabled]="!newMemberId">Adicionar</button>
            </div>
            <p *ngIf="availableUsers().length === 0" class="no-users">Nenhum usuário disponível para adicionar.</p>
            <div *ngIf="memberError()" class="alert-error">{{ memberError() }}</div>
          </div>

          <!-- Ações -->
          <div class="card-actions">
            <button (click)="cancel()" class="btn btn-outline">Cancelar</button>
            <button (click)="saveFeatures()" class="btn btn-primary" [disabled]="savingFeatures()">
              {{ savingFeatures() ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de sucesso -->
      <div *ngIf="featuresSaved()" class="modal-overlay">
        <div class="modal">
          <div class="modal-icon">✓</div>
          <h3>Setor atualizado com sucesso!</h3>
          <p class="modal-info">As funcionalidades de <strong>{{ sector()?.name }}</strong> foram salvas.</p>
          <div class="modal-actions">
            <button (click)="goToSectors()" class="btn btn-primary">Ver setores</button>
            <a routerLink="/tickets/new" class="btn btn-outline">+ Novo chamado</a>
          </div>
        </div>
      </div>

      <ng-template #loading>
        <div style="padding:3rem;text-align:center;color:#6b7280">Carregando...</div>
      </ng-template>
    </fd-shell>
  `,
  styles: [`
    .page { padding:1.5rem;max-width:700px; }
    .breadcrumb { font-size:.85rem;color:#6b7280;margin-bottom:1.5rem; }
    .breadcrumb a { color:#4f46e5; }
    .sector-card { background:#fff;border-radius:12px;padding:2rem;box-shadow:0 1px 4px rgba(0,0,0,.08); }
    .sector-card h2 { font-size:1.4rem;font-weight:700;margin-bottom:.5rem; }
    .desc { color:#6b7280;margin-bottom:1.5rem; }
    .section { margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid #f3f4f6; }
    h3 { font-size:1rem;font-weight:600;margin-bottom:.75rem; }
    .features-list { display:flex;flex-direction:column;gap:.5rem; }
    .feature-item { display:flex;align-items:center;gap:.5rem;font-weight:400;cursor:pointer; }
    .feature-item input { width:16px;height:16px;cursor:pointer; }
    .feature-item input:disabled { cursor:not-allowed; }
    .badge-default { font-size:.7rem;background:#e0e7ff;color:#4338ca;padding:.1rem .4rem;border-radius:4px; }
    .form-actions { display:flex;align-items:center;gap:.75rem; }
    .saved-ok { font-size:.85rem;color:#16a34a; }
    .member-list { list-style:none; }
    .member-item { display:flex;justify-content:space-between;align-items:center;padding:.65rem 0;border-bottom:1px solid #f3f4f6; }
    .email { display:block;font-size:.8rem;color:#9ca3af; }
    .btn-remove { background:transparent;border:1px solid #fca5a5;color:#dc2626;padding:.25rem .6rem;border-radius:6px;cursor:pointer;font-size:.8rem; }
    .btn-remove:hover { background:#fee2e2; }
    .add-member { margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #f3f4f6; }
    h4 { font-size:.9rem;font-weight:600;margin-bottom:.75rem; }
    .add-row { display:flex;gap:.75rem; }
    .form-control { flex:1;padding:.55rem .8rem;border:1px solid #d1d5db;border-radius:8px;font-size:.9rem; }
    .btn { padding:.55rem 1.1rem;border:none;border-radius:8px;cursor:pointer;font-weight:600;text-decoration:none;display:inline-block; }
    .btn-primary { background:#4f46e5;color:#fff; }
    .btn-primary:disabled { background:#a5b4fc;cursor:not-allowed; }
    .btn-outline { background:#fff;border:1px solid #d1d5db;color:#374151; }
    .btn-outline:hover { background:#f9fafb; }
    .no-users { font-size:.85rem;color:#9ca3af;margin-top:.5rem; }
    .alert-error { background:#fee2e2;color:#dc2626;padding:.5rem;border-radius:6px;margin-top:.5rem;font-size:.85rem; }
    .card-actions { display:flex;justify-content:flex-end;gap:.75rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid #f3f4f6; }
    .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:1000; }
    .modal { background:#fff;border-radius:16px;padding:2.5rem 2rem;max-width:420px;width:90%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.18); }
    .modal-icon { width:56px;height:56px;border-radius:50%;background:#d1fae5;color:#059669;font-size:1.75rem;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem; }
    .modal h3 { font-size:1.2rem;font-weight:700;color:#111827;margin-bottom:.75rem; }
    .modal-info { color:#6b7280;font-size:.9rem;margin-bottom:1.5rem;line-height:1.6; }
    .modal-actions { display:flex;gap:.75rem;justify-content:center; }
  `],
})
export class SectorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sectorService = inject(SectorService);
  private userService = inject(UserService);

  sector = signal<Sector | null>(null);
  availableUsers = signal<User[]>([]);
  availableFeatures = signal<SectorFeature[]>([]);
  newMemberId = '';
  memberError = signal('');
  featuresError = signal('');
  savingFeatures = signal(false);
  featuresSaved = signal(false);

  // cÃ³pia editÃ¡vel dos slugs habilitados no setor
  private enabledFeatureSlugs = new Set<string>();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.sectorService.getById(id).subscribe({
      next: (s) => {
        this.sector.set(s);
        this.enabledFeatureSlugs = new Set((s.features ?? []).map((f) => f.slug));
      },
    });
    this.loadAvailableUsers();
    this.sectorService.listAvailableFeatures().subscribe({
      next: (features) => this.availableFeatures.set(features),
    });
  }

  isSectorFeatureEnabled(slug: string): boolean {
    return this.enabledFeatureSlugs.has(slug);
  }

  toggleSectorFeature(slug: string, checked: boolean): void {
    if (slug === 'tickets') return;
    if (checked) {
      this.enabledFeatureSlugs.add(slug);
    } else {
      this.enabledFeatureSlugs.delete(slug);
    }
    this.featuresSaved.set(false);
  }

  saveFeatures(): void {
    const s = this.sector();
    if (!s) return;
    this.featuresError.set('');
    this.savingFeatures.set(true);
    this.featuresSaved.set(false);
    this.sectorService.update(s.id, { features: Array.from(this.enabledFeatureSlugs) }).subscribe({
      next: (updated) => {
        this.sector.set(updated);
        this.enabledFeatureSlugs = new Set((updated.features ?? []).map((f) => f.slug));
        this.savingFeatures.set(false);
        this.featuresSaved.set(true);
      },
      error: (err) => {
        this.featuresError.set(err?.error?.detail ?? 'Erro ao salvar funcionalidades.');
        this.savingFeatures.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/sectors']);
  }

  goToSectors(): void {
    this.router.navigate(['/sectors']);
  }

  private loadAvailableUsers(): void {
    this.userService.listAvailable().subscribe({ next: (users) => this.availableUsers.set(users) });
  }

  addMember(): void {
    const s = this.sector();
    if (!s) return;
    this.memberError.set('');
    this.sectorService.addMember(s.id, this.newMemberId).subscribe({
      next: (updated) => {
        this.sector.set(updated);
        this.newMemberId = '';
        this.loadAvailableUsers();
      },
      error: (err) => this.memberError.set(err?.error?.detail ?? 'Erro ao adicionar membro.'),
    });
  }

  removeMember(userId: string): void {
    const s = this.sector();
    if (!s) return;
    this.sectorService.removeMember(s.id, userId).subscribe({
      next: (updated) => {
        this.sector.set(updated);
        this.loadAvailableUsers();
      },
      error: (err) => alert(err?.error?.detail ?? 'Erro ao remover membro.'),
    });
  }
}

