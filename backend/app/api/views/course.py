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
    def get(self, request, id=None, format=None):
        try:
            if id:
                course = get_object_or_404(Course, id=id)
                serializer = CourseNameSerializer(course)
                return Response(serializer.data, status=status.HTTP_200_OK)

            courses = Course.objects.all()
            serializer = CourseNameSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except:
            return Response(
                {"error": "Something went wrong on the server side."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def post(self, request, format=None):
        serializer = CourseNameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, id=None, format=None):
        course = get_object_or_404(Course, id=id)
        course.delete()
        return Response(
            {"status": "Course deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )

    @allowed_roles(["creator", "staff"])
    def put(self, request, id=None, format=None):
        course = get_object_or_404(Course, id=id)
        serializer = CourseNameSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


class Course_UserView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        course_id = request.query_params.get('course_id')
        user_id = request.query_params.get('user_id')
        if course_id and user_id:
            course = get_object_or_404(Course, id=course_id)
            course.users.add(user_id)
            return Response({"status": "User added to the course successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid course ID or user ID."}, status=status.HTTP_400_BAD_REQUEST)

    @allowed_roles(["creator", "staff"])
    def delete(self, request):
        course_id = request.query_params.get('course_id')
        user_id = request.query_params.get('user_id')
        if course_id and user_id:
            course = get_object_or_404(Course, id=course_id)
            course.users.remove(user_id)
            return Response({"status": "User removed from the course successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid course ID or user ID."}, status=status.HTTP_400_BAD_REQUEST)

    @allowed_roles(["creator", "staff"])
    def get(self, request):
        course_id = request.query_params.get('course_id')
        if course_id:
            course = get_object_or_404(Course, id=course_id)
            users = course.users.all()
            user_ids = [user.id for user in users]
            return Response({"users": user_ids}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid course ID."}, status=status.HTTP_400_BAD_REQUEST)


class Course_ScenarioView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        course_id = request.query_params.get('course_id')
        scenario_id = request.query_params.get('scenario_id')
        if course_id and scenario_id:
            course = get_object_or_404(Course, id=course_id)
            course.scenarios.add(scenario_id)
            return Response({"status": "Scenario added to the course successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid course ID or scenario ID."}, status=status.HTTP_400_BAD_REQUEST)

    @allowed_roles(["creator", "staff"])
    def delete(self, request):
        course_id = request.query_params.get('course_id')
        scenario_id = request.query_params.get('scenario_id')
        if course_id and scenario_id:
            course = get_object_or_404(Course, id=course_id)
            course.scenarios.remove(scenario_id)
            return Response({"status": "Scenario removed from the course successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid course ID or scenario ID."}, status=status.HTTP_400_BAD_REQUEST)

    @allowed_roles(["creator", "staff"])
    def get(self, request):
        course_id = request.query_params.get('course_id')
        if course_id:
            course = get_object_or_404(Course, id=course_id)
            scenarios = course.scenarios.all()
            scenario_ids = [scenario.id for scenario in scenarios]
            return Response({"scenarios": scenario_ids}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid course ID."}, status=status.HTTP_400_BAD_REQUEST)
