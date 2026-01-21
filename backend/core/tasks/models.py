from django.db import models
from django.core.exceptions import ValidationError


class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('blocked', 'Blocked'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class TaskDependency(models.Model):
    task = models.ForeignKey(Task, related_name="dependencies", on_delete=models.CASCADE)
    depends_on = models.ForeignKey(Task, related_name="dependents", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.task == self.depends_on:
            raise ValidationError("A task cannot depend on itself.")

        if self._creates_cycle(self.task, self.depends_on):
            raise ValidationError("Circular dependency detected.")

    def _creates_cycle(self, task, depends_on):
        visited = set()

        def dfs(current):
            if current == task:
                return True
            visited.add(current)

            parents = TaskDependency.objects.filter(task=current)
            for dep in parents:
                if dep.depends_on not in visited:
                    if dfs(dep.depends_on):
                        return True
            return False

        return dfs(depends_on)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.task} depends on {self.depends_on}"
