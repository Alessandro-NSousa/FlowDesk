import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'fd-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">FlowDesk</h1>
        <h2 class="page-title">Recuperar senha</h2>

        <form (ngSubmit)="onSubmit()" novalidate>
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" [(ngModel)]="email" name="email" required class="form-control" />
          </div>
          <div *ngIf="sent" class="alert alert-success">
            Se o e-mail existir em nossa base, você receberá um link em breve.
          </div>
          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading || sent">
            {{ loading ? 'Enviando...' : 'Enviar link' }}
          </button>
        </form>
        <div class="auth-links"><a routerLink="/auth/login">Voltar ao login</a></div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%); }
    .auth-card { background:#fff;border-radius:12px;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.15); }
    .auth-title { font-size:1.8rem;font-weight:700;color:#4f46e5;text-align:center;margin-bottom:.25rem; }
    .page-title { font-size:1.1rem;color:#374151;text-align:center;margin-bottom:1.5rem; }
    .form-group { margin-bottom:1rem; }
    label { display:block;margin-bottom:.35rem;font-weight:500; }
    .form-control { width:100%;padding:.6rem .9rem;border:1px solid #d1d5db;border-radius:8px; }
    .btn { padding:.7rem 1.5rem;border:none;border-radius:8px;cursor:pointer;font-weight:600; }
    .btn-primary { background:#4f46e5;color:#fff; }
    .btn-full { width:100%;margin-top:.5rem; }
    .alert-success { background:#d1fae5;color:#065f46;padding:.6rem;border-radius:6px;margin-bottom:.75rem;font-size:.85rem; }
    .auth-links { margin-top:1.25rem;text-align:center;font-size:.85rem; }
  `],
})
export class ResetPasswordComponent {
  email = '';
  loading = false;
  sent = false;

  private auth = inject(AuthService);

  onSubmit(): void {
    if (!this.email) return;
    this.loading = true;
    this.auth.requestPasswordReset(this.email).subscribe({
      next: () => { this.sent = true; this.loading = false; },
      error: () => { this.sent = true; this.loading = false; },
    });
  }
}
