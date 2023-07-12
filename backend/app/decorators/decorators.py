from app.models.course import Course
from app.models.template_scenario import TemplateScenario
from custom_user.models import User
from rest_framework import status
from rest_framework.response import Response


def allowed_roles(allowed_roles=[]):
    def decorator(view_class):
        # Update the parameter list to include 'self'
        def wrapper_func(self, request, *args, **kwargs):
            if "all" in allowed_roles:
                # Pass 'self' as the first argument
                return view_class(self, request, *args, **kwargs)

            user = request.user

            # admin user can call any function
            if user.admin:
                # Pass 'self' as the first argument
                return view_class(self, request, *args, **kwargs)

            for role in allowed_roles:
                if getattr(user, role, False):
                    # Pass 'self' as the first argument
                    return view_class(self, request, *args, **kwargs)

            return Response(
                {
                    "message": f"User is not authorized for this request. Only {allowed_roles} are authorized"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return wrapper_func

    return decorator


def has_access_to_scenario(field_name: str = None, template_id_in_request_data: bool = True):
    """
    Checks if the current user is alloed to access a scenario
    """
    def decorator(view_class):
        def wrapper_func(self, request, *args, **kwargs):
            user: User = request.user

            if user is None:
                return Response(
                    {
                        "message": f"User is not authenticated. Please login first with username and password."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            has_role: bool = user.admin or user.staff or user.creator

            if has_role:
                return view_class(self, request, *args, **kwargs)

            template_id: str = None

            if template_id_in_request_data:
                template_id = request.data.get(field_name.strip(), None)
            elif field_name.strip() in kwargs:
                template_id = kwargs[field_name.strip()]

            if template_id is None:
                return Response(
                    {
                        "message": "Template Id is not provided."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            is_allowed: bool = Course.objects.filter(
                users__id=user.id, scenarios__id=template_id
            ).exists()

            if is_allowed:
                return view_class(self, request, *args, **kwargs)
            else:
                return Response(
                    {
                        "message": f"User {user.username} is not authorized to access scenario {template_id}."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        return wrapper_func
    return decorator
