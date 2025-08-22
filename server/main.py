from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import hashlib
import os
import models
import schemas
from database import get_db

# Get environment - defaults to development
ENV = os.getenv("ENVIRONMENT", "development")

app = FastAPI(title="Todo List API", version="1.0.0")

# Configure CORS based on environment
if ENV == "development":
    cors_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
else:
    # Production origins - add your production URLs here
    cors_origins = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Helper function to get allowed origin for request
def get_cors_headers(origin: str = None):
    # Use the same cors_origins variable that was configured for the middleware
    if origin in cors_origins or "*" in cors_origins:
        return {
            "Access-Control-Allow-Origin": origin if "*" not in cors_origins else "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true"
        }
    else:
        # Return empty headers for unauthorized origins
        return {}

# Add OPTIONS handlers that respect environment configuration
@app.options("/users/")
async def options_users(request: Request):
    origin = request.headers.get("origin")
    headers = get_cors_headers(origin)
    return Response(headers=headers)

@app.options("/users/{user_id}")
async def options_user(user_id: int, request: Request):
    origin = request.headers.get("origin")
    headers = get_cors_headers(origin)
    return Response(headers=headers)

@app.options("/lists/")
async def options_lists(request: Request):
    origin = request.headers.get("origin")
    headers = get_cors_headers(origin)
    return Response(headers=headers)

@app.options("/lists/{list_id}")
async def options_list(list_id: int, request: Request):
    origin = request.headers.get("origin")
    headers = get_cors_headers(origin)
    return Response(headers=headers)

@app.options("/tasks/")
async def options_tasks(request: Request):
    origin = request.headers.get("origin")
    headers = get_cors_headers(origin)
    return Response(headers=headers)

@app.options("/tasks/{task_id}")
async def options_task(task_id: int, request: Request):
    origin = request.headers.get("origin")
    headers = get_cors_headers(origin)
    return Response(headers=headers)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# User endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    hashed_password = hash_password(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user.dict(exclude_unset=True).items():
        if field == "password":
            value = hash_password(value)
            field = "password_hash"
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# List endpoints
@app.post("/lists/", response_model=schemas.ListResponse)
def create_list(list_data: schemas.ListCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == list_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_list = models.List(**list_data.dict())
    db.add(db_list)
    db.commit()
    db.refresh(db_list)
    return db_list

@app.get("/lists/", response_model=List[schemas.ListResponse])
def read_lists(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    lists = db.query(models.List).offset(skip).limit(limit).all()
    return lists

@app.get("/lists/{list_id}", response_model=schemas.ListResponse)
def read_list(list_id: int, db: Session = Depends(get_db)):
    list_item = db.query(models.List).filter(models.List.id == list_id).first()
    if list_item is None:
        raise HTTPException(status_code=404, detail="List not found")
    return list_item

@app.put("/lists/{list_id}", response_model=schemas.ListResponse)
def update_list(list_id: int, list_data: schemas.ListUpdate, db: Session = Depends(get_db)):
    db_list = db.query(models.List).filter(models.List.id == list_id).first()
    if db_list is None:
        raise HTTPException(status_code=404, detail="List not found")
    
    for field, value in list_data.dict(exclude_unset=True).items():
        setattr(db_list, field, value)
    
    db.commit()
    db.refresh(db_list)
    return db_list

@app.delete("/lists/{list_id}")
def delete_list(list_id: int, db: Session = Depends(get_db)):
    list_item = db.query(models.List).filter(models.List.id == list_id).first()
    if list_item is None:
        raise HTTPException(status_code=404, detail="List not found")
    db.delete(list_item)
    db.commit()
    return {"message": "List deleted successfully"}

# Task endpoints
@app.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    list_item = db.query(models.List).filter(models.List.id == task.list_id).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List not found")
    
    db_task = models.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).offset(skip).limit(limit).all()
    return tasks

@app.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for field, value in task.dict(exclude_unset=True).items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

@app.get("/")
def read_root():
    return {"message": "Todo List API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)