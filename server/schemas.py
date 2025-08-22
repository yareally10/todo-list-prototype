from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# User schemas
class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# List schemas
class ListBase(BaseModel):
    name: str
    description: Optional[str] = None

class ListCreate(ListBase):
    user_id: int

class ListUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ListResponse(ListBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Task schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: int = 0
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    list_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[int] = None
    due_date: Optional[datetime] = None

class Task(TaskBase):
    id: int
    list_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True