from django.shortcuts import render
from health_check.views import MainView
from django.http import HttpResponse, JsonResponse
# Create your views here.

class HealthCheckCustomView(MainView):
    template_name = 'myapp/health_check_dashboard.html'  # customize the used templates

    def get(self, request, *args, **kwargs):
        plugins = []
        status = 200 # needs to be filled status you need
        
        if 'application/json' in request.META.get('HTTP_ACCEPT', ''):
            return self.render_to_response_json(plugins, status)
        return self.render_to_response(plugins, status)

    def render_to_response(self, plugins, status):       # customize HTML output
        return HttpResponse('Working' if status == 200 else 'Problem', status=status)

    def render_to_response_json(self, plugins, status):  # customize JSON output
        return JsonResponse(
            {str(p.identifier()): 'Working' if status == 200 else 'Problem' for p in plugins},
            status=status
        )