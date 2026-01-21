from .models import Task


def update_task_status(task):
    """
    Update task status based on dependency statuses.
    """
    dependencies = task.dependencies.select_related('depends_on')

    if not dependencies.exists():
        return

    statuses = [dep.depends_on.status for dep in dependencies]

    if 'blocked' in statuses:
        new_status = 'blocked'
    elif all(status == 'completed' for status in statuses):
        new_status = 'in_progress'
    else:
        new_status = 'pending'

    if task.status != new_status:
        task.status = new_status
        task.save(update_fields=['status'])
