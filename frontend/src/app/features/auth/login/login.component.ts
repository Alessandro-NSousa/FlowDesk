import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FeatureService } from '../../../core/services/feature.service';

@Component({
  selector: 'fd-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">FlowDesk</h1>
        <p class="auth-subtitle">Centralize, organize e resolva — sem fricção.</p>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" novalidate>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              placeholder="seu@email.com"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              id="password"
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="8"
              placeholder="••••••••"
              class="form-control"
            />
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">{{ errorMessage }}</div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="auth-links">
          <a routerLink="/auth/reset-password">Esqueci minha senha</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }
    .auth-card {
      background: #fff;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .auth-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #4f46e5;
      text-align: center;
      margin-bottom: 0.25rem;
    }
    .auth-subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 2rem;
      font-size: 0.85rem;
    }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.35rem; font-weight: 500; color: #374151; }
    .form-control {
      width: 100%;
      padding: 0.6rem 0.9rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: border-color 0.2s;
    }
    .form-control:focus { outline: none; border-color: #4f46e5; }
    .btn { padding: 0.7rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-primary:disabled { background: #a5b4fc; cursor: not-allowed; }
    .btn-full { width: 100%; margin-top: 0.5rem; }
    .alert-error { background: #fee2e2; color: #dc2626; padding: 0.6rem; border-radius: 6px; margin-bottom: 0.75rem; font-size: 0.85rem; }
    .auth-links { margin-top: 1.25rem; text-align: center; font-size: 0.85rem; }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  private auth = inject(AuthService);
  private router = inject(Router);
  private featureService = inject(FeatureService);

  onSubmit(): void {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.featureService.loadUserFeatures().subscribe({
          complete: () => this.router.navigate(['/dashboard']),
          error: () => this.router.navigate(['/dashboard']),
        });
      },
      error: () => {
        this.errorMessage = 'E-mail ou senha inválidos.';
        this.loading = false;
      },
    });
  }
}
