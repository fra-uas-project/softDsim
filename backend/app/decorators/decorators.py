from rest_framework import status
from rest_framework.response import Response


def allowed_roles(allowed_roles=[]):
    def decorator(view_class):
        def wrapper_func(request, *args, **kwargs):

            if "all" in allowed_roles:
                return view_class(request, *args, **kwargs)

            user = request.request.user

            # admin user can call any function
            if user.admin:
                return view_class(request, *args, **kwargs)

            for role in allowed_roles:
                if user.__getattr__(role):
                    return view_class(request, *args, **kwargs)

            return Response(
                {
                    "message": f"User is not authorized for this request. Only {allowed_roles} are authorized"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return wrapper_func

    return decorator
