from rest_framework import serializers
from .models import Task, TaskDependency


class TaskDependencySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskDependency
        fields = ['id', 'task', 'depends_on']


class TaskSerializer(serializers.ModelSerializer):
    dependencies = TaskDependencySerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'status',
            'created_at',
            'updated_at',
            'dependencies'
        ]
