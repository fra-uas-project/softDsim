from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

# from . import login_serializers
from app.api.serializers.user_serializers import UserSerializer

"""
Views for user authentication (login, logout, creation, csrf-token handling)
"""


@method_decorator(csrf_protect, name="dispatch")
class SignupView(APIView):
    """
    View for registering a new user.
    Has one POST Method.
    Methods are available to anyone.
    """

    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        """
        Method for POST-Requests to the /api/register endpoint.
        Creates new user in database (as long as user does not already exist (PK=username))
        Returns: Response with information about user creation, created user and HTTP-Status Code.
        """
        data = self.request.data

        username = data["username"]
        password = data["password"]

        try:
            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.create_user(username=username, password=password)

            user.save()

            user = User.objects.get(id=user.id)

            return Response(
                {
                    "success": "User created successfully",
                    "user": {"id": user.id, "username": user.username},
                },
                status=status.HTTP_201_CREATED,
            )

        except:
            return Response(
                {"error": "Something went wrong (except clause)"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):
    """
    View for logging in an existing user.
    Has one POST Method.
    Methods are available to anyone.
    """

    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        """
        Method for POST-Requests to the /api/login endpoint.
        Logs in user if username and password (from json body) match a user in the database.
        Sets new CSRF-Cookie and a Session Cookie

        Returns: Response with information about login, logged-in user and HTTP-Status Code.
        """

        data = self.request.data
        username = data["username"]
        password = data["password"]

        try:
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                user = UserSerializer(user, many=False)
                return Response(
                    {"success": "User authenticated", "user": user.data},
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(
                    {
                        "error": "Could not authenticate user - credentials might be wrong"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            return Response(
                {"error": "Something went wrong (except clause)"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):
    """
    View for logging out a user.
    Has one POST Method.
    Methods are only available to authenticated users.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request, formate=None):
        """
        Method for POST-Requests to the /api/logout endpoint.
        Logs current user out.
        Sets Session-Cookie to ""

        Returns: Response with information about logout, logged-out user and HTTP-Status Code.
        """

        try:
            user = UserSerializer(request.user, many=False)
            logout(request)

            return Response(
                {"success": "Logged Out", "user": {"user": user.data}},
                status=status.HTTP_200_OK,
            )
        except:
            return Response(
                {"error": "Logout failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class GetCSRFToken(APIView):
    """
    View for setting a CSRF-Cookie
    Has one GET Method.
    Methods are available to anyone.
    """

    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        """
        Method for POST-Requests to the /api/csrf-token endpoint.
        Sets a CSRF-Cookie to the client.

        Returns: Response with information about cookie set and HTTP-Status Code.
        """
        return Response({"success": "CSRF cookie set"}, status=status.HTTP_200_OK)


@method_decorator(csrf_protect, name="dispatch")
class CheckAuthenticatedView(APIView):
    """
    View to see if user is authenticated.
    Has one GET Method.
    Methods are available to anyone.
    """

    permission_classes = (AllowAny,)

    def get(self, request, format=None):
        """
        Method for GET-Requests to the /api/authenticated endpoint.

        Returns: Response if user is authenticated, current authenticated user and HTTP-Status Code

        """

        if request.user.is_authenticated:
            user = UserSerializer(request.user, many=False)
            return Response(
                {"authentication-status": "user is authenticated", "user": user.data},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"authentication-status": "user is not authenticated"},
            status=status.HTTP_403_FORBIDDEN,
        )


# X-CSRFToken:
# https://stackoverflow.com/questions/34782493/difference-between-csrf-and-x-csrf-token
# https://www.stackhawk.com/blog/django-csrf-protection-guide/
