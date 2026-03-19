import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SectorService } from '../../../core/services/sector.service';
import { TicketService } from '../../../core/services/ticket.service';
import { Sector } from '../../../core/models';
import { ShellComponent } from '../../../shared/shell/shell.component';

@Component({
  selector: 'fd-ticket-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <fd-shell>
      <div class="page">
        <h2 class="page-title">Novo Chamado</h2>

        <div class="form-card">
          <form (ngSubmit)="onSubmit()" novalidate>
            <div class="form-group">
              <label>Título *</label>
              <input type="text" [(ngModel)]="form.title" name="title" required maxlength="200" class="form-control" />
            </div>

            <div class="form-group">
              <label>Descrição *</label>
              <textarea [(ngModel)]="form.description" name="description" required rows="5" class="form-control"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Setor solicitante *</label>
                <select [(ngModel)]="form.requesting_sector_id" name="requestingSector" required class="form-control">
                  <option value="">Selecione...</option>
                  <option *ngFor="let s of sectors()" [value]="s.id">{{ s.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Setor responsável *</label>
                <select [(ngModel)]="form.responsible_sector_id" name="responsibleSector" required class="form-control">
                  <option value="">Selecione...</option>
                  <option *ngFor="let s of sectors()" [value]="s.id">{{ s.name }}</option>
                </select>
              </div>
            </div>

            <div *ngIf="error()" class="alert alert-error">{{ error() }}</div>

            <div class="form-actions">
              <button type="button" (click)="cancel()" class="btn btn-outline">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="loading()">
                {{ loading() ? 'Criando...' : 'Criar Chamado' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </fd-shell>
  `,
  styles: [`
    .page { padding:1.5rem;max-width:720px; }
    .page-title { font-size:1.5rem;font-weight:700;margin-bottom:1.5rem; }
    .form-card { background:#fff;border-radius:12px;padding:2rem;box-shadow:0 1px 4px rgba(0,0,0,.08); }
    .form-group { margin-bottom:1.25rem; }
    .form-row { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
    label { display:block;margin-bottom:.4rem;font-weight:500;color:#374151; }
    .form-control { width:100%;padding:.6rem .9rem;border:1px solid #d1d5db;border-radius:8px;font-size:.9rem; }
    .form-control:focus { outline:none;border-color:#4f46e5; }
    textarea.form-control { resize:vertical; }
    .form-actions { display:flex;justify-content:flex-end;gap:.75rem;margin-top:1.5rem; }
    .btn { padding:.6rem 1.25rem;border:none;border-radius:8px;cursor:pointer;font-weight:600; }
    .btn-primary { background:#4f46e5;color:#fff; }
    .btn-primary:disabled { background:#a5b4fc;cursor:not-allowed; }
    .btn-outline { background:#fff;border:1px solid #d1d5db;color:#374151; }
    .alert-error { background:#fee2e2;color:#dc2626;padding:.6rem;border-radius:6px;margin-bottom:.75rem;font-size:.85rem; }
  `],
})
export class TicketFormComponent implements OnInit {
  private sectorService = inject(SectorService);
  private ticketService = inject(TicketService);
  private router = inject(Router);

  sectors = signal<Sector[]>([]);
  loading = signal(false);
  error = signal('');

  form = {
    title: '',
    description: '',
    requesting_sector_id: '',
    responsible_sector_id: '',
  };

  ngOnInit(): void {
    this.sectorService.getMine().subscribe({
      next: (res) => this.sectors.set(res.results),
    });
  }

  onSubmit(): void {
    if (!this.form.title || !this.form.description || !this.form.requesting_sector_id || !this.form.responsible_sector_id) {
      this.error.set('Preencha todos os campos obrigatórios.');
      return;
    }
    this.loading.set(true);
    this.error.set('');

    this.ticketService.create(this.form).subscribe({
      next: (ticket) => this.router.navigate(['/tickets', ticket.id]),
      error: (err) => {
        this.error.set(err?.error?.detail ?? 'Erro ao criar chamado.');
        this.loading.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/tickets']);
  }
}
