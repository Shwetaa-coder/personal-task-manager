# Daymark — Personal Task Manager frontend

A responsive React + Vite frontend for Project 1. It can run in **demo mode** before the Spring Boot backend exists, then switch to API mode later.

## Requirements

- Node.js 20.19+ or 22.12+
- npm (comes with Node.js)

Check:
```bash
node -v
npm -v
```

## Run the frontend

1. Extract this folder.
2. Open the folder in VS Code or IntelliJ.
3. Open the terminal in the project folder.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create your environment file:
   - Copy `.env.example`
   - Name the copy `.env`
6. Keep `VITE_USE_MOCK_API=true` for now.
7. Start Vite:
   ```bash
   npm run dev
   ```
8. Open the local URL shown in the terminal (normally http://localhost:5173).

Demo mode stores tasks in your browser's localStorage. It does not need a backend.

## Switch to Spring Boot later

Once the backend is ready, edit `.env`:
```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8080
```
Stop and restart Vite after changing `.env`.

## Backend API contract

The frontend expects these endpoints:

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/tasks` | Return all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

### JSON shape

Task response:
```json
{
  "id": 1,
  "title": "Revise Java",
  "description": "Practise collections",
  "dueDate": "2026-11-15",
  "priority": "HIGH",
  "completed": false
}
```

Create/update request (the `id` is not needed):
```json
{
  "title": "Revise Java",
  "description": "Practise collections",
  "dueDate": "2026-11-15",
  "priority": "HIGH",
  "completed": false
}
```

Priority values: `LOW`, `MEDIUM`, `HIGH`.

## Folder structure

```text
personal-task-manager-frontend/
├── src/
│   ├── api/
│   │   └── tasks.js
│   ├── components/
│   │   ├── TaskCard.jsx
│   │   └── TaskModal.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Troubleshooting

- `npm` is not recognized: install Node.js LTS, close and reopen the terminal.
- Port 5173 is busy: Vite will offer another port.
- Frontend cannot reach Spring Boot in API mode: check the backend port, `VITE_API_BASE_URL`, and Spring Boot CORS configuration.
- After editing `.env`, restart the Vite development server.
