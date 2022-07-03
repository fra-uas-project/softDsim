from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from app.decorators.decorators import allowed_roles

from custom_user.models import User

import random
import string
import logging

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

        if start_index < 0:
            start_index = 0

        if pw_len < 5:
            pw_len = 5

        def generate_password():
            return "".join(
                [
                    random.choice(string.ascii_letters + string.digits)
                    for _ in range(pw_len)
                ]
            )

        users = [
            {"username": f"{prefix}{i}", "password": generate_password()}
            for i in range(start_index, start_index + amount)
        ]

        for user in users:
            if User.objects.filter(username=user.get("username")).exists():
                return Response(
                    {"error": f"Username {user.get('username')} already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        try:
            for user in users:
                User.objects.create(**user)
        except Exception as e:
            logging.error(f"{e.__class__.__name__} occured when creating users.")
            return Response(
                {"error": f"{e.__class__.__name__}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            data={"status": "success", "data": users}, status=status.HTTP_201_CREATED
        )

