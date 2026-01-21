# Task Dependency Manager

A full-stack application to manage tasks with dependencies, detect circular dependencies, and visualize task graphs.

## Features
- Create tasks
- Add task dependencies
- Detect circular dependencies using DFS
- Auto-update task status based on dependencies
- Visualize task dependency graph using Canvas
- Django Admin + REST API + Vanilla JS frontend

## Tech Stack
- Backend: Django, Django REST Framework
- Frontend: HTML, CSS, JavaScript
- Database: SQLite

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
