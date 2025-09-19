# Backend

## Setup

1. Copie `.env.example` para `.env` e ajuste o MySQL com suas credenciais e `OPENWEATHER_API_KEY`.
2. Execute o SQL em `sql/init.sql` para criar o banco e as tabelas.
3. Instalar dependencias:
   ```bash
   cd backend
   npm install
   ```
4. Iniciar o servidor:
   ```bash
   npm run dev
   ```
5. API endpoints:
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/appointments
   - GET  /api/appointments 
