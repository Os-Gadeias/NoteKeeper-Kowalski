# Notely

Notely is a full-stack personal note management application for capturing ideas and organizing information in one place. Users can manage their own notes, associate them with custom categories, and separate active work from archived content.

The interface uses the Notely brand; source directories, .NET projects, and the database retain the NoteKeeper name.

## Features

- User registration, sign-in, and sign-out with JWT revocation.
- Create, view, update, and delete personal notes.
- Create, list, update, and delete custom categories with icons.
- Associate multiple categories with a note, or leave it uncategorized.
- Change note status between **Active** and **Archived**.
- Filter the note list by **All**, **Active**, or **Archived** on the client.
- Keep notes and categories scoped to the authenticated account.

## Architecture

### Frontend

The Angular application uses standalone components and lazy-loaded routes, organized by feature under `components/`: authentication, notes, categories, and Home, alongside navigation and footer components.

- **HTTP services:** `service/users`, `service/notes`, and `service/categories` encapsulate API calls using `HttpClient` and RxJS Observables. Their `models.ts` files define typed request and response contracts.
- **Presentation models:** component-local form interfaces and `CategoryViewModel` describe UI data separately from API contracts.
- **State and forms:** Angular `signal`, `computed`, and `effect` manage component and session state. `toSignal` and `toObservable` bridge HTTP streams and reactive state. Signal Forms provide form bindings and validation.
- **Routing:** `app.routes.ts` defines feature routes and legacy redirect aliases. Functional guards restrict note/category pages to authenticated users and authentication pages to anonymous users.
- **Authentication:** token and username are stored in browser `sessionStorage` and exposed through readonly signals. An HTTP interceptor attaches the Bearer token only to requests targeting the configured API. Guards check local session presence; the API validates the token and enforces access control.
- **Errors:** shared API error extraction converts HTTP errors into messages displayed by components.

### Backend

The ASP.NET Core API separates responsibilities across four projects:

| Layer | Responsibility |
| --- | --- |
| `Api` | Controllers, HTTP request contracts, dependency composition, JWT issuance/validation, CORS, OpenAPI, and ProblemDetails responses. |
| `Aplicacao` | Use cases implemented as MediatR commands/queries and handlers; DTO mapping and FluentResults-based results. |
| `Dominio` | Note/category entities, validation rules, status values, repository interfaces, and authentication abstractions. |
| `Infraestrutura` | EF Core repositories, SQL Server mappings and migrations, ASP.NET Core Identity, and persisted token revocation. |

Controllers delegate use cases to handlers, which depend on domain abstractions implemented by infrastructure. Notes and categories have a many-to-many relationship through `NotaCategoria`. Repository queries scope data by user ID.

Identity manages accounts and passwords. JWTs are signed with HMAC-SHA256, expire after 60 minutes by default, and are checked against persisted revocations. Protected endpoints require authentication through a fallback authorization policy. There is no refresh-token flow; users sign in again after expiration.

## Technologies

Versions below are declared in `package.json` and the .NET project files; npm ranges are preserved.

| Area | Technology | Version |
| --- | --- | --- |
| UI | Angular, Router, Signals, Signal Forms | `^22.2.0` |
| Frontend tooling | Angular CLI / Build | `^22.2.4` |
| Language | TypeScript | `~6.0.2` |
| Reactive streams | RxJS | `~7.8.0` |
| Styling | Tailwind CSS / Tailwind PostCSS plugin | `^4.1.12` |
| Icons | Bootstrap Icons | `^1.13.2` |
| Frontend test tooling | Vitest / jsdom | `^5.0.0` / `^30.0.0` |
| API | C# / ASP.NET Core | .NET 10 (`net10.0`) |
| Authentication | JWT Bearer / Identity EF Core | `10.0.13` |
| Persistence | EF Core SQL Server / Design | `10.0.13` |
| Database | Microsoft SQL Server | Server version not pinned |
| Use cases | MediatR / FluentResults | `14.2.0` / `4.0.0` |
| API documentation | ASP.NET Core OpenAPI / Swagger UI | `10.0.13` / `10.3.1` |
| Backend tests | xUnit / Moq | `2.9.3` / `4.20.72` |

## Requirements

- **Node.js:** `^22.22.3`, `^24.15.0`, or `>=26.0.0`, as required by the Angular tooling in `package-lock.json`. The application has no separate Node version pin.
- **npm:** `11.19.0`, declared in the frontend `packageManager` field.
- **Angular CLI:** installed locally with npm dependencies; a global installation is unnecessary.
- **.NET SDK 10:** all backend projects target `net10.0`; no SDK patch version is pinned through `global.json`.
- **SQL Server:** a reachable instance and a connection string for an account permitted to apply migrations. The development configuration targets `localhost,1433` and database `NoteKeeperDb`.
- **Git** for cloning the repository.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Os-Gadeias/NoteKeeper-Kowalski.git
cd NoteKeeper-Kowalski
```

Run the backend commands below from the repository root.

### 2. Configure the API

Replace the placeholders with your SQL Server connection string and a private signing key containing at least **32 UTF-8 bytes**:

```bash
dotnet user-secrets set "ConnectionStrings:SqlServer" "<your-sql-server-connection-string>" --project server/src/Api/NoteKeeper.Api.csproj
dotnet user-secrets set "Jwt:SigningKey" "<your-private-signing-key>" --project server/src/Api/NoteKeeper.Api.csproj
```

The API already declares a User Secrets ID. `Jwt:SigningKey` is absent from the committed settings and must be supplied. The connection secret overrides the checked-in development connection; configure it for your own SQL Server instance.

`Jwt:Issuer`, `Jwt:Audience`, and `Jwt:ExpiresInMinutes` are defined in `server/src/Api/appsettings.json`. Environment-variable equivalents for the connection and signing key are `ConnectionStrings__SqlServer` and `Jwt__SigningKey`.

MediatR registration also reads `LuckyPenny:LicenseKey`. If your MediatR license requires a key, configure your own through User Secrets:

```bash
dotnet user-secrets set "LuckyPenny:LicenseKey" "<your-license-key>" --project server/src/Api/NoteKeeper.Api.csproj
```

### 3. Start the backend

Ensure SQL Server is running, then restore and launch the API:

```bash
dotnet restore server/NoteKeeper.slnx
dotnet run --project server/src/Api/NoteKeeper.Api.csproj --launch-profile NoteKeeper.Api
```

The launch profile selects **Development** and serves the API at `http://localhost:5146`. EF Core applies committed SQL Server migrations automatically during development startup; the database connection must be available at that point.

To apply migrations explicitly, use the committed EF tool manifest:

```bash
dotnet tool restore --tool-manifest server/dotnet-tools.json
dotnet tool run dotnet-ef --tool-manifest server/dotnet-tools.json -- database update --project server/src/Infraestrutura/NoteKeeper.Infraestrutura.csproj --startup-project server/src/Api/NoteKeeper.Api.csproj
```

The design-time database factory reads User Secrets and environment variables, so use the same connection override for both startup and migration commands.

### 4. Configure and start the frontend

The API base URL is defined in `client/NoteKeeper/src/app/enviroments/enviroment.develolment.ts` (the spelling matches the repository):

```ts
export const environment = {
  urlApi: 'http://localhost:5146',
};
```

Update `urlApi` if the API runs elsewhere. This file is imported directly by the `URL_API` injection token; no production environment replacement is configured. The backend CORS setup permits `http://localhost:4200`; serving the frontend from another origin requires updating the CORS setup in `Program.cs` and its configuration.

In a separate terminal:

```bash
cd client/NoteKeeper
npm ci
npm start
```

Open `http://localhost:4200/`, create an account, and sign in. Registration automatically signs the user in. API documentation is available at `http://localhost:5146/swagger`, with the OpenAPI document at `http://localhost:5146/openapi/v1.json`.

## API Reference

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/cadastro` | Public | Register an account. |
| `POST` | `/auth/login` | Public | Authenticate and obtain a JWT. |
| `GET` | `/auth/me` | Bearer | Retrieve the current user. |
| `POST` | `/auth/logout` | Bearer | Revoke the current JWT. |
| `GET`, `POST` | `/categorias` | Bearer | List or create categories. |
| `GET`, `PUT`, `DELETE` | `/categorias/{id}` | Bearer | Retrieve, update, or delete a category. |
| `GET`, `POST` | `/notas` | Bearer | List or create notes. |
| `GET`, `PUT`, `DELETE` | `/notas/{id}` | Bearer | Retrieve, update, or delete a note. |

API field names remain in Portuguese. Active and Archived correspond to `Ativa` and `Arquivada` in note responses and update requests.

Example HTTP requests are provided in `server/src/Api/NoteKeeper.Api.http`.

`GET /notas?categoriaIds=<id1>&categoriaIds=<id2>` returns notes associated with **all** specified categories. Omitting the parameter returns all notes for the account. This API category filter is separate from the client-side status filter.

### Validation and behavior

- Passwords require at least eight characters, including a digit and a special character; account emails must be unique.
- Note and category titles contain 2–100 characters and are unique per user after trimming and case normalization.
- Note descriptions support up to 300 characters. The API accepts an omitted description; the current frontend requires one.
- New notes start as Active. Categories are optional, and note updates replace the category list; `categoriaIds: []` removes all associations.
- Deleting a category preserves its notes and removes the associations.
- API errors use ProblemDetails, with field-level messages for validation failures.

## Project Structure

```text
.
├── client/NoteKeeper/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/                 # Shared HTTP error extraction
│   │   ├── app/
│   │   │   ├── auth/            # Session state, guards, interceptor, API token
│   │   │   ├── components/      # Feature pages and shared UI
│   │   │   ├── enviroments/     # API base URL configuration
│   │   │   ├── service/         # HTTP services and request/response interfaces
│   │   │   ├── app.config.ts    # Application providers
│   │   │   └── app.routes.ts    # Routes and access guards
│   │   └── styles.css           # Tailwind theme and global styling
│   └── angular.json            # Build, serve, and test configuration
├── server/
│   ├── src/
│   │   ├── Api/                 # HTTP endpoints and application startup
│   │   ├── Aplicacao/           # Use-case handlers and DTOs
│   │   ├── Dominio/             # Entities, rules, and interfaces
│   │   └── Infraestrutura/      # Persistence, migrations, and Identity
│   ├── tests/NoteKeeper.Tests/  # Domain and application unit tests
│   ├── dotnet-tools.json        # EF Core CLI tool manifest
│   └── NoteKeeper.slnx          # Backend solution
└── README.md
```

## Build and Tests

From the repository root:

```bash
dotnet build server/NoteKeeper.slnx --configuration Release
dotnet test server/NoteKeeper.slnx
```

From `client/NoteKeeper`:

```bash
npm run build
npm test
```

The frontend production build is written to `client/NoteKeeper/dist/NoteKeeper`. The backend includes xUnit tests for entities and authentication, category, and note handlers, using Moq. The frontend configures Vitest through Angular's unit-test builder, but currently contains no test specifications.
