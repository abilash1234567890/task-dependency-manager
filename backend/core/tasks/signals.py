from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Task, TaskDependency
from .services import update_task_status


@receiver(post_save, sender=TaskDependency)
def on_dependency_added(sender, instance, **kwargs):
    update_task_status(instance.task)


@receiver(post_save, sender=Task)
def on_task_status_change(sender, instance, **kwargs):
    # Update tasks that depend on this task
    for dep in instance.dependents.all():
        update_task_status(dep.task)
