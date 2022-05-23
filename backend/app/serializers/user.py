from rest_framework import serializers


from custom_user.models import User


# class UserRolesSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserRoles
#         fields = ["role"]


class UserSerializer(serializers.ModelSerializer):

    # user_roles = UserRolesSerializer(many=True)

    class Meta:
        model = User
        # fields = "__all__"  # serialize all the fields
        fields = ["id", "username", "student", "creator", "staff", "admin"]
