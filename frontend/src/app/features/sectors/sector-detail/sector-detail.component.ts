import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SectorService } from '../../../core/services/sector.service';
import { Sector } from '../../../core/models';
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
            <h4>Adicionar membro por ID</h4>
            <div class="add-row">
              <input type="text" [(ngModel)]="newMemberId" placeholder="UUID do usuário" class="form-control" />
              <button (click)="addMember()" class="btn btn-primary" [disabled]="!newMemberId">Adicionar</button>
            </div>
            <div *ngIf="memberError()" class="alert-error">{{ memberError() }}</div>
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
    h3 { font-size:1rem;font-weight:600;margin-bottom:.75rem; }
    .member-list { list-style:none; }
    .member-item { display:flex;justify-content:space-between;align-items:center;padding:.65rem 0;border-bottom:1px solid #f3f4f6; }
    .email { display:block;font-size:.8rem;color:#9ca3af; }
    .btn-remove { background:transparent;border:1px solid #fca5a5;color:#dc2626;padding:.25rem .6rem;border-radius:6px;cursor:pointer;font-size:.8rem; }
    .btn-remove:hover { background:#fee2e2; }
    .add-member { margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #f3f4f6; }
    h4 { font-size:.9rem;font-weight:600;margin-bottom:.75rem; }
    .add-row { display:flex;gap:.75rem; }
    .form-control { flex:1;padding:.55rem .8rem;border:1px solid #d1d5db;border-radius:8px;font-size:.9rem; }
    .btn { padding:.55rem 1.1rem;border:none;border-radius:8px;cursor:pointer;font-weight:600; }
    .btn-primary { background:#4f46e5;color:#fff; }
    .alert-error { background:#fee2e2;color:#dc2626;padding:.5rem;border-radius:6px;margin-top:.5rem;font-size:.85rem; }
  `],
})
export class SectorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sectorService = inject(SectorService);

  sector = signal<Sector | null>(null);
  newMemberId = '';
  memberError = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.sectorService.getById(id).subscribe({ next: (s) => this.sector.set(s) });
  }

  addMember(): void {
    const s = this.sector();
    if (!s) return;
    this.memberError.set('');
    this.sectorService.addMember(s.id, this.newMemberId).subscribe({
      next: (updated) => { this.sector.set(updated); this.newMemberId = ''; },
      error: (err) => this.memberError.set(err?.error?.detail ?? 'Erro ao adicionar membro.'),
    });
  }

  removeMember(userId: string): void {
    const s = this.sector();
    if (!s) return;
    this.sectorService.removeMember(s.id, userId).subscribe({
      next: (updated) => this.sector.set(updated),
      error: (err) => alert(err?.error?.detail ?? 'Erro ao remover membro.'),
    });
  }
}
