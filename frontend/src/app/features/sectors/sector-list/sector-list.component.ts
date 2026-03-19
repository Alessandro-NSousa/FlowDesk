import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SectorService } from '../../../core/services/sector.service';
import { Sector } from '../../../core/models';
import { ShellComponent } from '../../../shared/shell/shell.component';

@Component({
  selector: 'fd-sector-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ShellComponent],
  template: `
    <fd-shell>
      <div class="page">
        <div class="page-header">
          <h2>Setores</h2>
          <button (click)="showForm.set(true)" class="btn btn-primary">+ Novo setor</button>
        </div>

        <!-- Formulário de criação RF10 -->
        <div class="form-card" *ngIf="showForm()">
          <h3>Novo Setor</h3>
          <div class="form-group">
            <label>Nome</label>
            <input type="text" [(ngModel)]="newSector.name" class="form-control" />
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <textarea [(ngModel)]="newSector.description" rows="3" class="form-control"></textarea>
          </div>
          <div *ngIf="formError()" class="alert-error">{{ formError() }}</div>
          <div class="form-actions">
            <button (click)="showForm.set(false)" class="btn btn-outline">Cancelar</button>
            <button (click)="createSector()" class="btn btn-primary" [disabled]="saving()">
              {{ saving() ? 'Salvando...' : 'Criar' }}
            </button>
          </div>
        </div>

        <div *ngIf="loading()" class="loading">Carregando...</div>

        <div class="sectors-grid" *ngIf="!loading()">
          <div class="sector-card" *ngFor="let s of sectors()">
            <div class="sector-name">{{ s.name }}</div>
            <div class="sector-desc">{{ s.description || 'Sem descrição' }}</div>
            <div class="sector-meta">{{ s.member_count }} membro(s)</div>
            <a [routerLink]="['/sectors', s.id]" class="btn btn-outline btn-sm">Gerenciar</a>
          </div>
          <p *ngIf="!sectors().length" class="empty">Nenhum setor cadastrado.</p>
        </div>
      </div>
    </fd-shell>
  `,
  styles: [`
    .page { padding:1.5rem; }
    .page-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem; }
    .page-header h2 { font-size:1.5rem;font-weight:700; }
    .btn { padding:.5rem 1rem;border:none;border-radius:6px;cursor:pointer;font-weight:600;text-decoration:none;display:inline-block; }
    .btn-primary { background:#4f46e5;color:#fff; }
    .btn-outline { background:#fff;border:1px solid #d1d5db;color:#374151; }
    .btn-sm { font-size:.8rem;padding:.35rem .8rem;margin-top:.5rem; }
    .form-card { background:#fff;border-radius:10px;padding:1.5rem;box-shadow:0 1px 4px rgba(0,0,0,.08);margin-bottom:1.5rem; }
    .form-card h3 { margin-bottom:1rem;font-size:1rem;font-weight:600; }
    .form-group { margin-bottom:1rem; }
    label { display:block;margin-bottom:.35rem;font-weight:500; }
    .form-control { width:100%;padding:.55rem .8rem;border:1px solid #d1d5db;border-radius:8px;font-size:.9rem; }
    .form-actions { display:flex;gap:.75rem;justify-content:flex-end; }
    .alert-error { background:#fee2e2;color:#dc2626;padding:.5rem;border-radius:6px;margin-bottom:.75rem;font-size:.85rem; }
    .sectors-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem; }
    .sector-card { background:#fff;border-radius:10px;padding:1.25rem;box-shadow:0 1px 4px rgba(0,0,0,.08); }
    .sector-name { font-weight:600;color:#1f2937;margin-bottom:.35rem; }
    .sector-desc { font-size:.85rem;color:#6b7280;margin-bottom:.5rem; }
    .sector-meta { font-size:.8rem;color:#9ca3af;margin-bottom:.75rem; }
    .loading,.empty { color:#6b7280;padding:2rem;text-align:center; }
  `],
})
export class SectorListComponent implements OnInit {
  private sectorService = inject(SectorService);

  sectors = signal<Sector[]>([]);
  loading = signal(true);
  showForm = signal(false);
  saving = signal(false);
  formError = signal('');

  newSector = { name: '', description: '' };

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.sectorService.getAll().subscribe({
      next: (res) => { this.sectors.set(res.results); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  createSector(): void {
    if (!this.newSector.name) {
      this.formError.set('O nome é obrigatório.');
      return;
    }
    this.saving.set(true);
    this.sectorService.create(this.newSector).subscribe({
      next: (s) => {
        this.sectors.update((list) => [...list, s]);
        this.newSector = { name: '', description: '' };
        this.showForm.set(false);
        this.saving.set(false);
      },
      error: (err) => {
        this.formError.set(err?.error?.detail ?? 'Erro ao criar setor.');
        this.saving.set(false);
      },
    });
  }
}
