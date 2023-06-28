from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404


from app.decorators.decorators import allowed_roles

from custom_user.models import User

import random
import string
import logging

from app.models.course import Course

"""
Views for user authentication (login, logout, creation, csrf-token handling)
"""


class UserCreationView(APIView):
    @allowed_roles(["staff"])
    def post(self, request, format=None):
        data = request.data

        # Getting data from request
        prefix = data.get("prefix", "user")
        amount = data.get("count", 1)
        pw_len = data.get("pw-length", 8)
        start_index = data.get("start-index", 1)
        course_id = data.get("course_id", None)

        with_course: bool = course_id is not None

        course: Course = None

        if with_course:
            try:
                course = get_object_or_404(Course, pk=course_id)
            except:
                return Response(
                    {"error": f"Course {course_id} not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Check index
        if start_index < 0:
            start_index = 0

        # Chack password length
        if pw_len < 5:
            pw_len = 5

        def generate_password():
            """
            Generates a password.
            """
            return "".join(
                [random.choice(string.ascii_letters + string.digits)
                 for _ in range(pw_len)]
            )

        usernames: set[str] = set()
        rejected_username: set[str] = set()

        for i in range(start_index, start_index + amount):
            username: str = f"{prefix}{i}"
            # If an username is taken skip it
            if User.objects.filter(username=username).exists():
                rejected_username.add(username)
            else:
                usernames.add(username)

        users: list[User] = [
            {
                "username": username,
                "password": generate_password(),
            }
            for username in usernames
        ]

        try:
            for user in users:
                user_obj = User.objects.create(
                    username=user['username'],
                    password=make_password(user['password'])
                )
                if with_course:
                    course.users.add(user_obj)

            for username in rejected_username:
                users.append({
                    "username": username,
                    "password": "REJECTED USERNAME",
                })
        except Exception as e:
            logging.error(
                f"{e.__class__.__name__} occurred when creating users.")
            return Response(
                {"error": f"{e.__class__.__name__}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            data={"status": "success", "data": users},
            status=status.HTTP_201_CREATED,
        )
