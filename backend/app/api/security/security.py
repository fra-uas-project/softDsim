from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import get_object_or_404

from app.decorators.decorators import allowed_roles
from app.serializers.user import UserSerializer
from custom_user.models import User

from app.models.course import Course

"""
Views for user authentication (login, logout, creation, csrf-token handling)
"""


class RegisterView(APIView):
    """
    View for registering a new user.
    Has one POST Method.
    Methods are available to anyone.
    """

    permission_classes = (AllowAny,)

    @allowed_roles(["all"])
    def post(self, request, format=None):
        """
        Method for POST-Requests to the /api/register endpoint.
        Creates new user in database (as long as user does not already exist (PK=username))
        Returns: Response with information about user creation, created user and HTTP-Status Code.
        """
        username: str = request.data.get("username", None)
        password = request.data.get("password", None)
        course_id = request.data.get("course_id", None)

        if username is None or username.strip() == "":
            return Response(
                {"error": f"Username is not provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password is None or password.strip() == "":
            return Response(
                {"error": f"Password is not provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        username = username.strip()
        password = password.strip()

        with_course: bool = course_id is not None

        # Check username not taken:
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": f"Username {username} is not available."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course: Course = None

        # check course exists:
        if with_course:
            try:
                course = get_object_or_404(Course, pk=course_id)
            except:
                return Response(
                    {"error": f"Course {course_id} not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        user = User.objects.create_user(username=username, password=password)

        if with_course:
            course.users.add(user)
            course.save()

        user.save()

        serializer = UserSerializer(user)
        return Response(
            {
                "success": "User created successfully",
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    View for logging in an existing user.
    Has one POST Method.
    Methods are available to anyone.
    """

    permission_classes = (AllowAny,)

    @allowed_roles(["all"])
    def post(self, request, format=None):
        """
        Method for POST-Requests to the /api/login endpoint.
        Logs in user if username and password (from json body) match a user in the database.
        Sets a Session Cookie

        Returns: Response with information about login, logged-in user and HTTP-Status Code.
        """

        data = self.request.data
        username = data["username"]
        password = data["password"]

        try:
            # user = User.objects.get(username=username)
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
                        "error": "Could not authenticate user - username or password might be wrong"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            return Response(
                {"error": "Something went wrong (except clause)"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LogoutView(APIView):
    """
    View for logging out a user.
    Has one POST Method.
    Methods are only available to authenticated users.
    """

    permission_classes = (IsAuthenticated,)

    @allowed_roles(["all"])
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


class CheckAuthenticatedView(APIView):
    """
    View to see if user is authenticated.
    Has one GET Method.
    Methods are available to anyone.
    """

    permission_classes = (AllowAny,)

    @allowed_roles(["all"])
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
