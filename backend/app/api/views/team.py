import logging
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.decorators.decorators import allowed_roles
from app.serializers.team import MemberSerializer, SkillTypeSerializer, TeamSerializer, SkillTypeInfoSerializer
from django.core.exceptions import ObjectDoesNotExist

from app.models.team import SkillType, Team, Member, SkillTypeInfo


class TeamViews(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            logging.error("Could not create team")
            logging.debug(serializer.errors)
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, id=None):
        logging.info("Received GET request for endpoint Team")
        if id:
            try:
                item = Team.objects.get(id=id)
                serializer = TeamSerializer(item)
                return Response(
                    {"status": "success", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            except ObjectDoesNotExist:
                msg = f"Team with id {id} does not exist in database"
                logging.error(msg)
                return Response(
                    {"status": "error", "data": msg}, status=status.HTTP_404_NOT_FOUND,
                )

        items = Team.objects.all()
        serializer = TeamSerializer(items, many=True)
        return Response(
            {"status": "success", "data": serializer.data}, status=status.HTTP_200_OK
        )

    @allowed_roles(["creator", "staff"])
    def patch(self, request, id=None):
        logging.info(f"Received PATCH request for endpoint Team with id {id}")
        item = Team.objects.get(id=id)
        serializer = TeamSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data})
        else:
            logging.error(serializer.error_messages)
            return Response({"status": "error", "data": serializer.errors})

    @allowed_roles(["creator", "staff"])
    def delete(self, request, id=None):
        logging.info(f"Received DELETE request for endpoint Team with id {id}")
        item = get_object_or_404(Team, id=id)
        item.delete()
        logging.info(f"Team with id {id} deleted")
        return Response({"status": "success", "data": "Item Deleted"})


class MemberView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        try:
            # Getting skill type from DB
            skill_type_str = request.data.get("skill_type")
            skill_type = SkillType.objects.get(name=skill_type_str)
        except ObjectDoesNotExist:
            msg = f"'{skill_type_str}' is not a name of an existing skill-type in the database."
            logging.error(msg)
            return Response(
                {"status": "error", "data": {"skill_type": msg}, },
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = MemberSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            # Adding skill type to object
            member.skill_type = skill_type
            member.save()
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            logging.error("Could not create member")
            logging.debug(serializer.errors)
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @allowed_roles(["creator", "staff"])
    def get(self, request, id=None):
        if id:
            try:
                item = Member.objects.get(id=id)
                serializer = MemberSerializer(item)
                return Response(
                    {"status": "success", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            except ObjectDoesNotExist:
                msg = f"Member with id {id} does not exist in database"
                logging.error(msg)
                return Response(
                    {"status": "error", "data": serializer.data},
                    status=status.HTTP_404_NOT_FOUND,
                )

        items = Member.objects.all()
        serializer = MemberSerializer(items, many=True)
        return Response(
            {"status": "success", "data": serializer.data}, status=status.HTTP_200_OK
        )

    @allowed_roles(["creator", "staff"])
    def patch(self, request, id=None):
        item = Member.objects.get(id=id)
        serializer = MemberSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logging.info("Member patched")
            return Response({"status": "success", "data": serializer.data})
        else:
            logging.debug(serializer.errors)
            return Response({"status": "error", "data": serializer.errors})

    def delete(self, request, id=None):
        item = get_object_or_404(Member, id=id)
        item.delete()
        logging.info(f"Member with id {id} deleted")
        return Response({"status": "success", "data": "Item Deleted"})


class SkillTypeView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        serializer = SkillTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            logging.error("Could not create skill-type")
            logging.debug(serializer.errors)
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, id=None):
        if id:
            item = SkillType.objects.get(id=id)
            serializer = SkillTypeSerializer(item)
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        items = SkillType.objects.all()
        serializer = SkillTypeSerializer(items, many=True)
        return Response(
            {"status": "success", "data": serializer.data}, status=status.HTTP_200_OK
        )

    @allowed_roles(["creator", "staff"])
    def patch(self, request, id=None):
        item = SkillType.objects.get(id=id)
        serializer = SkillTypeSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data})
        else:
            return Response({"status": "error", "data": serializer.errors})

    @allowed_roles(["creator", "staff"])
    def delete(self, request, id=None):
        item = get_object_or_404(SkillType, id=id)
        item.delete()
        logging.info(f"Skill-type with id {id} deleted")
        return Response({"status": "success", "data": "Item Deleted"})


class SkillTypeInfoView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request, skilltype_id=None):

        if skilltype_id is None:
            return Response(
                {"status": "error", "data": "Skilltype Id is missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        skill_type: SkillType = None

        try:
            skill_type = SkillType.objects.get(id=skilltype_id)
        except SkillType.DoesNotExist:
            return Response(
                {"status": "error", "data": f"Skilltype {skilltype_id} does not exists."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer: SkillTypeInfoSerializer = SkillTypeInfoSerializer(
            data=request.data
        )

        if serializer.is_valid():

            if skill_type.extra_info:
                SkillTypeInfo.delete(skill_type.extra_info)

            skill_type.extra_info = serializer.save()
            skill_type.save()

            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        else:
            logging.error("Could not create skill-type-info")
            return Response(
                {"status": "error", "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, skilltype_id=None):
        if skilltype_id is None:
            return Response(
                {"status": "error", "data": "Skilltype Id is missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        skill_type: SkillType = None

        try:
            skill_type = SkillType.objects.get(id=skilltype_id)
        except SkillType.DoesNotExist:
            return Response(
                {"status": "error", "data": f"Skilltype {skilltype_id} does not exists."},
                status=status.HTTP_404_NOT_FOUND
            )

        extra_info: SkillTypeInfo = skill_type.extra_info

        data = None

        if extra_info:
            serializer = SkillTypeInfoSerializer(extra_info)
            data = serializer.data

        return Response(
            {"status": "success", "data": data}, status=status.HTTP_200_OK
        )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, skilltype_id=None):
        if skilltype_id is None:
            return Response(
                {"status": "error", "data": "Skilltype Id is missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        skill_type: SkillType = None

        try:
            skill_type = SkillType.objects.get(id=skilltype_id)
        except SkillType.DoesNotExist:
            return Response(
                {"status": "error", "data": f"Skilltype {skilltype_id} does not exists."},
                status=status.HTTP_404_NOT_FOUND
            )

        SkillTypeInfo.delete(skill_type.extra_info)
        skill_type.extra_info = None
        skill_type.save()

        logging.info(f"extra infos from Skill-type with id {id} deleted.")
        return Response({"status": "success", "data": "Skilltype infos Deleted"})
