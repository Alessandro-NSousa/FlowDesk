import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      return this.router.createUrlTree(['/auth/login']);
    }
    // Usuário autenticado mas com senha temporária → forçar troca
    if (this.auth.mustChangePassword()) {
      return this.router.createUrlTree(['/auth/change-password']);
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (this.auth.isAuthenticated() && this.auth.isAdmin()) {
      return true;
    }
    return this.router.createUrlTree(['/dashboard']);
  }
}

/** Usado na rota /auth/change-password: só permite acesso se mustChangePassword ou se o usuário quiser trocar voluntariamente. */
@Injectable({ providedIn: 'root' })
export class ChangePasswordGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    return this.router.createUrlTree(['/auth/login']);
  }
}
