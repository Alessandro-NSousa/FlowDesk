# FlowDesk

> *Centralize, organize e resolva — sem fricção.*

Sistema de gestão de chamados internos com backend Django + DRF e frontend Angular.

---

## Estrutura do Projeto

```
flowdesk/
├── backend/                  # Django 5.x + DRF (Clean Architecture)
│   ├── apps/
│   │   ├── users/            # Usuários, autenticação, convites
│   │   │   ├── domain/       # Entidades puras
│   │   │   ├── application/  # Casos de uso
│   │   │   ├── infrastructure/ # Models Django
│   │   │   └── interface/    # Serializers, Views, URLs
│   │   ├── sectors/          # Setores e membros
│   │   └── tickets/          # Chamados e status
│   ├── config/               # Settings, URLs, Celery
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # Angular 19 (standalone components)
│   ├── src/app/
│   │   ├── core/             # Models, Services, Guards, Interceptors
│   │   ├── features/         # auth, dashboard, tickets, sectors
│   │   └── shared/           # ShellComponent (layout)
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── .env.example
```

---

## Pré-requisitos

- Docker + Docker Compose
- Python 3.14 (desenvolvimento local)
- Node 22+ (desenvolvimento local do frontend)

---

## Início Rápido (Docker)

```bash
# 1. Copie e edite as variáveis de ambiente
cp .env.example .env

# 2. Suba todos os serviços
docker compose up --build -d

# 3. Acesse
# Frontend:  http://localhost:4200
# API:       http://localhost:8000/api/v1/
# Docs:      http://localhost:8000/api/docs/
# Admin:     http://localhost:8000/admin/
```

---

## Desenvolvimento Local

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt

# Configure o .env na raiz do projeto
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Celery (notificações assíncronas)

```bash
celery -A config worker --loglevel=info
```

### Frontend

```bash
cd frontend
npm install
npm start   # proxy → http://localhost:8000
```

---

## Endpoints principais

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/api/v1/auth/token/` | Login (JWT) |
| POST | `/api/v1/auth/token/refresh/` | Renovar token |
| POST | `/api/v1/auth/token/logout/` | Logout (blacklist) |
| POST | `/api/v1/auth/pre-register/` | Pré-cadastro (admin) |
| POST | `/api/v1/auth/accept-invite/` | Aceitar convite |
| POST | `/api/v1/auth/password-reset/` | Recuperar senha |
| POST | `/api/v1/auth/password-reset/confirm/` | Confirmar nova senha |
| GET | `/api/v1/auth/me/` | Perfil do usuário |
| GET/POST | `/api/v1/sectors/` | Listar/criar setores |
| POST | `/api/v1/sectors/{id}/members/add/` | Adicionar membro |
| POST | `/api/v1/sectors/{id}/members/remove/` | Remover membro |
| GET/POST | `/api/v1/tickets/` | Listar/criar chamados |
| GET/PATCH | `/api/v1/tickets/{id}/` | Detalhe/atualizar |
| GET/POST | `/api/v1/tickets/statuses/` | Status de chamados |

---

## Arquitetura

O projeto segue **Clean Architecture** com as camadas:

- **Domain** — entidades e regras de negócio (Python puro, sem Django)
- **Application** — casos de uso e tasks Celery
- **Infrastructure** — models Django, migrations, filtros
- **Interface** — serializers DRF, views, URLs

---

## Requisitos atendidos

| RF | Descrição | Implementado |
|----|-----------|:---:|
| RF01–RF03 | Pré-cadastro + convite por e-mail | ✅ |
| RF04 | JWT Authentication | ✅ |
| RF05 | Recuperação de senha | ✅ |
| RF06–RF09 | Permissões baseadas em setor/perfil | ✅ |
| RF10–RF12 | Gestão de setores e membros | ✅ |
| RF13–RF17 | Chamados entre setores | ✅ |
| RF18–RF20 | Status padrão e personalizados | ✅ |
| RF21–RF22 | Notificações por e-mail (Celery) | ✅ |
| RF23–RF24 | Visualização e filtros | ✅ |
| RNF01–RNF02 | Clean Architecture | ✅ |
| RNF03 | Django + DRF | ✅ |
| RNF04 | Angular 19 | ✅ |
| RNF05 | PostgreSQL | ✅ |
| RNF06 | JWT | ✅ |
