from django.apps import AppConfig
from health_check.plugins import plugin_dir

class CustomUserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'custom_user'

    def ready(self):
        from .custom_checker import MyHealthCheckBackend
        plugin_dir.register(MyHealthCheckBackend)


