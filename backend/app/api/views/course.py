from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from app.decorators.decorators import allowed_roles
from app.models.course import Course
from app.serializers.course import CourseNameSerializer

class CourseView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, id=None):
        try:
            if id:
                course = get_object_or_404(Course, id=id)
                serializer = CourseNameSerializer(course)
                response_data = {
                    "id": course.id,
                    "name": serializer.data['name']
                }
                return Response(response_data, status=status.HTTP_200_OK)

            courses = Course.objects.all()
            serializer = CourseNameSerializer(courses, many=True)
            response_data = {
                "data": [{
                    "id": course.id,
                    "name": course.name
                } for course in courses]
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_404_NOT_FOUND,
            )

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        course_name = request.data.get('name')
        if Course.objects.filter(name=course_name).exists():
            return Response(
                {"error": "A course with the same name already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CourseNameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, id):
        if id:
            try:
                course = Course.objects.get(id=id)
                course.delete()
                return Response(
                    {"status": "Course deleted successfully."},
                    status=status.HTTP_204_NO_CONTENT
                )
            except Course.DoesNotExist:
                return Response(
                    {"error": "Course not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "Invalid course ID."},
                status=status.HTTP_400_BAD_REQUEST
            )

    @allowed_roles(["creator", "staff"])
    def put(self, request, id):
        try:
            course = Course.objects.get(id=id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        course_name = request.data.get('name')
        if course_name:
            course.name = course_name
            course.save()
            serializer = CourseNameSerializer(course)
            response_data = {
                "id": course.id,
                "name": serializer.data['name']
            }
            return Response(response_data, status=status.HTTP_200_OK)

        return Response(
            {"error": "Invalid course name."},
            status=status.HTTP_400_BAD_REQUEST
        )

class CourseUserView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request, course_id):
        user_id = request.data.get('user_id')
        if user_id:
            course = get_object_or_404(Course, id=course_id)
            if course.users.filter(id=user_id).exists():
                return Response(
                    {"error": "User with the same ID already exists in the course."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            course.users.add(user_id)
            return Response(
                {"status": "User added to the course successfully."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid user ID."},
                status=status.HTTP_400_BAD_REQUEST
            )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, course_id):
        user_id = request.data.get('user_id')
        if user_id:
            try:
                course = get_object_or_404(Course, id=course_id)
                if course.users.filter(id=user_id).exists():
                    course.users.remove(user_id)
                    return Response(
                        {"status": "User removed from the course successfully."},
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {"error": "User does not exist in the course."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Course.DoesNotExist:
                return Response(
                    {"error": "Course not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "Invalid user ID."},
                status=status.HTTP_400_BAD_REQUEST
            )

    @allowed_roles(["creator", "staff"])
    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        users = course.users.all()
        user_ids = [user.id for user in users]
        return Response({"users": user_ids}, status=status.HTTP_200_OK)


class CourseScenarioView(APIView):
    permission_classes = (IsAuthenticated,)
    @allowed_roles(["creator", "staff"])
    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        scenarios = course.scenarios.all()
        scenario_ids = [scenario.id for scenario in scenarios]
        return Response({"scenarios": scenario_ids}, status=status.HTTP_200_OK)

    @allowed_roles(["creator", "staff"])
    def post(self, request, course_id):
        scenario_id = request.data.get('scenario_id')
        if scenario_id:
            course = get_object_or_404(Course, id=course_id)
            if course.users.filter(id=scenario_id).exists():
                return Response(
                    {"error": "Scenario with the same ID already exists in the course."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            course.scenarios.add(scenario_id)
            return Response(
                {"status": "Scenario added to the course successfully."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid user ID."},
                status=status.HTTP_400_BAD_REQUEST
            )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, course_id):
        scenario_id = request.data.get('scenario_id')
        if scenario_id:
            try:
                course = get_object_or_404(Course, id=course_id)
                if course.scenarios.filter(id=scenario_id).exists():
                    course.scenarios.remove(scenario_id)
                    return Response(
                        {"status": "Scenario removed from the course successfully."},
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {"error": "Scenario does not exist in the course."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except Course.DoesNotExist:
                return Response(
                    {"error": "Course not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "Invalid Scenario ID."},
                status=status.HTTP_400_BAD_REQUEST
            )




