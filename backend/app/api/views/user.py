from django.contrib.auth.mixins import PermissionRequiredMixin

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.decorators.decorators import allowed_roles
from app.serializers.user import UserSerializer
from custom_user.models import User


@method_decorator(csrf_protect, name="dispatch")
class UserView(APIView):  # PermissionRequiredMixin,
    """
    `UserView` is the view for the user model, that implements basic CRUD
    functionality for users.
    These functions are called over the /api/user endpoint.
    The POST method to create a new user is in security_view in the register method.
    All functions in `UserView` are only available to an admin user.
    """

    # for authentication
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["staff"])
    def get(self, request, username=None, format=None):
        """
        Method for GET-Requests to the /api/user endpoint.
        Retrieves users from the database.
        Returns one user if a username is specified as an url parameter (example: /api/user/Mario)
        Returns all users if no url parameter is given.

        Returns: Response with requested user/users and HTTP-Status Code
        """

        if username:
            user = User.objects.get(username=username)
            user = UserSerializer(user, many=False)
            return Response(user.data, status=status.HTTP_200_OK)

        users = User.objects.all()
        users = UserSerializer(users, many=True)

        return Response(users.data, status=status.HTTP_200_OK)

    @allowed_roles(["staff"])
    def delete(self, requests, username=None, format=None):
        """
        Method for DELETE-Requests to the /api/user endpoint.
        Deletes user (in the database) that is specified as an url parameter (example: /api/user/Mario)

        Returns: Response with information about delete and HTTP-Status Code
        """
        try:
            user_tuple = User.objects.filter(username=username).delete()

            return Response(
                {
                    "success": "User deleted successfully",
                    "user": {"username": username},
                },
                status=status.HTTP_200_OK,
            )

        except:
            return Response(
                {"error": "User was not deleted"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["staff"])
    def patch(self, request, username=None, format=None):
        """
        Method for PATCH-Requests to the /api/user endpoint.
        Updates User in database with information in json body.

        Returns: Response with updated user and HTTP-Status Code
        """

        # only admins can create new admins
        if request.data.get("admin") and not request.user.admin:
            return Response(
                {"status": "error", "message": "Only admins can create new admins!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # when user is set to admin, grant all roles
        # todo philip: quick fix - maybe find nicer solution
        if request.data.get("admin") and request.user.admin:
            request.data["staff"] = True
            request.data["creator"] = True
            request.data["student"] = True

        user = User.objects.get(username=username)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["all"])
    def post(self, request):
        """
        The POST for /user is currently handled by the register method in security_view

        Returns: A message to the client which informs, that this request is handled by /register
        """

        return Response(
            {
                "message": "This endpoint has no function currently. To create a new user, use the /register endpoint!"
            },
            status=status.HTTP_200_OK,
        )
