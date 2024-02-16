from django.contrib.auth.models import AbstractUser
from django.db import models



from app.api.security.custom_user_manager import CustomUserManager


class User(AbstractUser):

    # roles = models.TextField(blank=True, null=True, default="student")
    student = models.BooleanField(default=True)
    creator = models.BooleanField(default=False)
    staff = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    # WE WILL NEED THIS IF WE WANT TO SWITCH TO EMAIL AS USERNAME

    # username = None
    # email = models.EmailField("email address", unique=True)
    # USERNAME_FIELD = "email"
    # REQUIRED_FIELDS = []

    # objects = CustomUserManager()

    # pass
    # STUDENT = 1
    # CREATOR = 2
    # STAFF = 3
    # ADMIN = 4
    # #
    # ROLE_CHOICES = (
    #     (STUDENT, "Student"),
    #     (CREATOR, "Creator"),
    #     (STAFF, "Staff"),
    #     (ADMIN, "Admin"),
    # )
    # #
    # role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, blank=True, null=True)


# class UserRoles(models.Model):
#
#     id = models.AutoField(primary_key=True)
#     role = models.TextField(default="student")
#
#     user = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="user_roles",
#         blank=True,
#         null=True,
#     )
