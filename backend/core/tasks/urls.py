from django.urls import path
from .api import TaskListCreateAPI, TaskUpdateAPI, TaskDependencyCreateAPI

urlpatterns = [
    path('tasks/', TaskListCreateAPI.as_view()),
    path('tasks/<int:pk>/', TaskUpdateAPI.as_view()),
    path('dependencies/', TaskDependencyCreateAPI.as_view()),
]
