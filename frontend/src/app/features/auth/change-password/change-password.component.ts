import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'fd-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card">
        <div class="card-header">
          <h1>Definir nova senha</h1>
          <p>Para sua segurança, você precisa criar uma senha pessoal antes de continuar.</p>
        </div>

        <div class="field">
          <label for="current">Senha temporária</label>
          <input
            id="current"
            [(ngModel)]="form.current_password"
            type="password"
            placeholder="Senha recebida por e-mail"
            class="input"
          />
        </div>

        <div class="field">
          <label for="new">Nova senha</label>
          <input
            id="new"
            [(ngModel)]="form.new_password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            class="input"
          />
        </div>

        <div class="field">
          <label for="confirm">Confirmar nova senha</label>
          <input
            id="confirm"
            [(ngModel)]="form.confirm_password"
            type="password"
            placeholder="Repita a nova senha"
            class="input"
          />
        </div>

        <div *ngIf="error()" class="alert alert-error">{{ error() }}</div>
        <div *ngIf="success()" class="alert alert-success">{{ success() }}</div>

        <button
          (click)="submit()"
          [disabled]="loading()"
          class="btn btn-primary"
        >
          {{ loading() ? 'Salvando...' : 'Salvar nova senha' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 2rem;
      width: 400px;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 4px 20px rgba(0,0,0,.08);
    }
    .card-header h1 { font-size: 1.35rem; font-weight: 700; margin: 0 0 .25rem; color: #111827; }
    .card-header p { font-size: .875rem; color: #6b7280; margin: 0; }
    .field { display: flex; flex-direction: column; gap: .3rem; }
    .field label { font-size: .85rem; font-weight: 600; color: #374151; }
    .input { padding: .55rem .75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: .9rem; }
    .input:focus { outline: 2px solid #4f46e5; border-color: transparent; }
    .btn { padding: .65rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: .9rem; }
    .btn-primary { background: #4f46e5; color: #fff; width: 100%; margin-top: .25rem; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .alert { padding: .6rem .75rem; border-radius: 6px; font-size: .85rem; }
    .alert-error { background: #fee2e2; color: #991b1b; }
    .alert-success { background: #d1fae5; color: #065f46; }
  `],
})
export class ChangePasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  form = { current_password: '', new_password: '', confirm_password: '' };
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  submit(): void {
    this.error.set(null);
    this.success.set(null);

    if (!this.form.current_password || !this.form.new_password || !this.form.confirm_password) {
      this.error.set('Preencha todos os campos.');
      return;
    }
    if (this.form.new_password !== this.form.confirm_password) {
      this.error.set('As senhas não coincidem.');
      return;
    }
    if (this.form.new_password.length < 8) {
      this.error.set('A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }

    this.loading.set(true);
    this.authService
      .changePassword({ current_password: this.form.current_password, new_password: this.form.new_password })
      .subscribe({
        next: () => {
          this.success.set('Senha alterada! Faça login novamente com sua nova senha.');
          this.loading.set(false);
          // Limpa tokens e redireciona para login para emitir novo JWT sem must_change_password
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }, 1500);
        },
        error: (err) => {
          this.error.set(err.error?.detail ?? err.error?.current_password?.[0] ?? 'Erro ao alterar senha.');
          this.loading.set(false);
        },
      });
  }
}
