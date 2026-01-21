from rest_framework import generics
from .models import Task, TaskDependency
from .serializers import TaskSerializer, TaskDependencySerializer


class TaskListCreateAPI(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskUpdateAPI(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskDependencyCreateAPI(generics.CreateAPIView):
    queryset = TaskDependency.objects.all()
    serializer_class = TaskDependencySerializer
