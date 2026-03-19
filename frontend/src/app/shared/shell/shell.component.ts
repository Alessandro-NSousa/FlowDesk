import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'fd-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="logo">
          <span class="logo-text">FlowDesk</span>
        </div>
        <nav class="nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span>Dashboard</span>
          </a>
          <a routerLink="/tickets" routerLinkActive="active" class="nav-item">
            <span>Chamados</span>
          </a>
          <a *ngIf="isAdmin()" routerLink="/sectors" routerLinkActive="active" class="nav-item">
            <span>Setores</span>
          </a>
          <a *ngIf="isAdmin()" routerLink="/users" routerLinkActive="active" class="nav-item">
            <span>Membros</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <span class="user-name">{{ userName() }}</span>
          <button (click)="logout()" class="btn-logout">Sair</button>
        </div>
      </aside>

      <main class="main-content">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    .app-shell { display:flex;min-height:100vh; }
    .sidebar { width:220px;background:#1e1b4b;color:#c7d2fe;display:flex;flex-direction:column;padding:1.5rem 0;flex-shrink:0; }
    .logo { padding:0 1.25rem 1.5rem; }
    .logo-text { font-size:1.4rem;font-weight:700;color:#fff; }
    .nav { flex:1; }
    .nav-item { display:block;padding:.65rem 1.25rem;color:#c7d2fe;text-decoration:none;font-size:.9rem;border-left:3px solid transparent;transition:all .2s; }
    .nav-item:hover { background:#312e81;color:#fff; }
    .nav-item.active { background:#312e81;color:#fff;border-left-color:#818cf8; }
    .sidebar-footer { padding:1.25rem;border-top:1px solid #312e81; }
    .user-name { display:block;font-size:.8rem;color:#a5b4fc;margin-bottom:.5rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
    .btn-logout { background:transparent;border:1px solid #4f46e5;color:#a5b4fc;padding:.35rem .75rem;border-radius:6px;cursor:pointer;font-size:.8rem;width:100%; }
    .btn-logout:hover { background:#312e81;color:#fff; }
    .main-content { flex:1;overflow-y:auto;background:#f5f7fb; }
  `],
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  userName(): string {
    const u = this.auth.getCurrentUser();
    return u?.full_name ?? u?.email ?? 'Usuário';
  }

  logout(): void {
    this.auth.logout();
  }
}
