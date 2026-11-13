# Personal Task Manager

A full-stack task management application built using React, Spring Boot, and PostgreSQL.

## Features

- Create new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Undo task completion
- Set task priorities (Low, Medium, High)
- Add task descriptions and due dates
- View pending and completed tasks
- Search and filter tasks
- Store tasks permanently in PostgreSQL

## Technologies Used

### Frontend
- React
- JavaScript
- Vite
- CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Database
- PostgreSQL

## How to Run the Project

### Backend
1. Open the Taskmanager project in IntelliJ IDEA.
2. Configure your PostgreSQL database.
3. Run `TaskmanagerApplication.java`.

### Frontend
1. Open the frontend folder in the terminal.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:5173/` in your browser.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

## Project Status

Core features implemented and tested locally.

## Author

BCA Student | Aspiring Software Developer