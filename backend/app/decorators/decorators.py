from rest_framework import status
from rest_framework.response import Response


def allowed_roles(allowed_roles=[]):
    def decorator(view_class):
        def wrapper_func(self, request, *args, **kwargs):  # Update the parameter list to include 'self'
            if "all" in allowed_roles:
                return view_class(self, request, *args, **kwargs)  # Pass 'self' as the first argument

            user = request.user

            # admin user can call any function
            if user.admin:
                return view_class(self, request, *args, **kwargs)  # Pass 'self' as the first argument

            for role in allowed_roles:
                if getattr(user, role, False):
                    return view_class(self, request, *args, **kwargs)  # Pass 'self' as the first argument

            return Response(
                {
                    "message": f"User is not authorized for this request. Only {allowed_roles} are authorized"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return wrapper_func

    return decorator