import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'fd-accept-invite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">FlowDesk</h1>
        <h2 class="page-title">Finalize seu cadastro</h2>

        <form (ngSubmit)="onSubmit()" novalidate>
          <div class="form-group">
            <label>Nome</label>
            <input type="text" [(ngModel)]="firstName" name="firstName" required class="form-control" />
          </div>
          <div class="form-group">
            <label>Sobrenome</label>
            <input type="text" [(ngModel)]="lastName" name="lastName" required class="form-control" />
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="8" class="form-control" />
          </div>

          <div *ngIf="error" class="alert alert-error">{{ error }}</div>
          <div *ngIf="success" class="alert alert-success">Conta ativada! Redirecionando...</div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            {{ loading ? 'Salvando...' : 'Ativar conta' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%); }
    .auth-card { background:#fff;border-radius:12px;padding:2.5rem;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.15); }
    .auth-title { font-size:1.8rem;font-weight:700;color:#4f46e5;text-align:center;margin-bottom:.25rem; }
    .page-title { font-size:1.1rem;color:#374151;text-align:center;margin-bottom:1.5rem; }
    .form-group { margin-bottom:1rem; }
    label { display:block;margin-bottom:.35rem;font-weight:500;color:#374151; }
    .form-control { width:100%;padding:.6rem .9rem;border:1px solid #d1d5db;border-radius:8px;font-size:.9rem; }
    .form-control:focus { outline:none;border-color:#4f46e5; }
    .btn { padding:.7rem 1.5rem;border:none;border-radius:8px;cursor:pointer;font-weight:600; }
    .btn-primary { background:#4f46e5;color:#fff; }
    .btn-full { width:100%;margin-top:.5rem; }
    .alert-error { background:#fee2e2;color:#dc2626;padding:.6rem;border-radius:6px;margin-bottom:.75rem;font-size:.85rem; }
    .alert-success { background:#d1fae5;color:#065f46;padding:.6rem;border-radius:6px;margin-bottom:.75rem;font-size:.85rem; }
  `],
})
export class AcceptInviteComponent implements OnInit {
  token = '';
  firstName = '';
  lastName = '';
  password = '';
  loading = false;
  error = '';
  success = false;

  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
  }

  onSubmit(): void {
    if (!this.token || !this.password || !this.firstName) return;
    this.loading = true;
    this.error = '';

    this.auth.acceptInvite(this.token, this.password, this.firstName, this.lastName).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.error = err?.error?.detail ?? 'Token inválido ou expirado.';
        this.loading = false;
      },
    });
  }
}
