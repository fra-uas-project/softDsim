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
import copy

from app.models.course import Course

"""
Views for user authentication (login, logout, creation, csrf-token handling)
"""


class UserCreationView(APIView):
    @allowed_roles(["staff"])
    def post(self, request, format=None):
        data = self.request.data

        # Getting data from request
        prefix = data.get("prefix", "user")
        amount = data.get("count", 1)
        pw_len = data.get("pw-length", 8)
        start_index = data.get("start-index", 1)
        course_id = data.get("course_id")

        if start_index < 0:
            start_index = 0

        if pw_len < 5:
            pw_len = 5

        def generate_password():
            return "".join(
                [random.choice(string.ascii_letters + string.digits) for _ in range(pw_len)]
            )

        users = [
            {
                "id": i,
                "username": f"{prefix}{i}",
                "password": generate_password(),
                "course_id": course_id,
            }
            for i in range(start_index, start_index + amount)
        ]

        users_hashedPassword = []

        for user in users:
            user_copy = copy.copy(user)
            user_copy["password"] = make_password(user["password"])
            users_hashedPassword.append(user_copy)

        for user in users:
            if User.objects.filter(username=user.get("username")).exists():
                return Response(
                    {"error": f"Username {user.get('username')} already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        try:
            for user in users_hashedPassword:
                user_obj = User.objects.create(username=user['username'], password=user['password'])
                if course_id is not None:
                    course = get_object_or_404(Course, pk=user['course_id'])
                    course.users.add(user_obj)
        except Exception as e:
            logging.error(f"{e.__class__.__name__} occurred when creating users.")
            return Response(
                {"error": f"{e.__class__.__name__}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            data={"status": "success", "data": users},
            status=status.HTTP_201_CREATED,
        )


