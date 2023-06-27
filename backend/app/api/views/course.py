from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from app.decorators.decorators import allowed_roles
from app.models.course import Course
from app.serializers.course import CourseNameSerializer, CourseSerializer
from custom_user.models import User
from app.models.template_scenario import TemplateScenario

from app.serializers.template_scenario import TemplateScenarioSerializer


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
                    status=status.HTTP_200_OK
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
        username = request.data.get('username')
        try:
            course_id = int(course_id)
            if course_id < 1 or course_id is None:
                raise ValueError("Course Id is not valid or missing.")

            if username is None:
                raise ValueError("Username is not valid or missing.")

        except Exception as e:
            return Response(
                {"status": "error", "error-message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course: Course = get_object_or_404(Course, id=course_id)

        if course.users.filter(username=username).exists():
            return Response(
                {"error": f"User {username} is already assigned to the course {course_id}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user: User = User.objects.filter(username=username).first()

        if user is None:
            return Response(
                {"error": f"User {username} not exixsts."},
                status=status.HTTP_404_NOT_FOUND
            )

        course.users.add(user)
        course.save()

        return Response(
            {"status": f"User {username} added to the course successfully."},
            status=status.HTTP_200_OK
        )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, course_id: int):
        """
        Remove a user from course by username.
        """
        username = request.data.get('username')

        try:
            course_id = int(course_id)
            if course_id < 1 or course_id is None:
                raise ValueError("Course Id is not valid or missing.")

            if username is None:
                raise ValueError("Username is not valid or missing.")

        except Exception as e:
            return Response(
                {"status": "error", "error-message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course: Course = None
        user: User = None

        # does the course exists
        try:
            course = get_object_or_404(Course, id=course_id)
        except Exception:
            return Response(
                {"error": f"Course {course_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # does the user exists
        try:
            user = get_object_or_404(User, username=username)
        except:
            return Response(
                {"error": f"User {username} not exists."},
                status=status.HTTP_404_NOT_FOUND
            )

        # is the user in the course
        if not course.users.filter(username=username).exists():
            return Response(
                {"error": f"User {username} is not assiegned course {course_id}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        course.users.remove(user)
        course.save()

        return Response(
            {"status": f"User {user} removed from the course {course_id} successfully."},
            status=status.HTTP_200_OK
        )

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, course_id: int):
        try:
            course_id = int(course_id)
            if course_id < 1 or course_id is None:
                raise ValueError("Course Id is not valid or missing.")
        except Exception as e:
            return Response(
                {"status": "error", "error-message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            course = get_object_or_404(Course, id=course_id)
        except:
            return Response(
                {"error": f"Course {course_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        users = course.users.all()

        response_data = [{
            "id": user.id,
            "username": user.username
        } for user in users]

        return Response(response_data, status=status.HTTP_200_OK)


class CourseScenarioView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, course_id):
        """
        Get all the scenarios in course by course id.
        """
        course: Course = Course.objects.filter(id=course_id).first()

        if course is None:
            return Response(
                {"error": f"Course {course_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        scenarios: list[TemplateScenario] = course.scenarios.all()

        reponse_data = [{
            "id": scenario.id,
            "name": scenario.name
        } for scenario in scenarios]

        return Response(reponse_data, status=status.HTTP_200_OK)

    @allowed_roles(["creator", "staff"])
    def post(self, request, course_id):
        scenario_id = request.data.get('scenario_id')

        try:
            scenario_id = int(scenario_id)
            if scenario_id < 1:
                raise ValueError(
                    f"Scenario id {scenario_id} is not valid or missing.")
        except Exception as e:
            return Response(
                {"status": "error", "error-message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course = Course.objects.filter(id=course_id).first()

        if course is None:
            return Response(
                {"error": f"Course {course_id} is not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if course.scenarios.filter(id=scenario_id).exists():
            return Response(
                {"error": f"Scenario {scenario_id} already available for course {course_id}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        scenario: TemplateScenario = TemplateScenario.objects.filter(
            id=scenario_id).first()

        if scenario is None:
            return Response(
                {"error": f"Scenario {scenario_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        course.scenarios.add(scenario)

        return Response(
            {"status": f"Scenario {scenario_id} is available for course {course_id}."},
            status=status.HTTP_200_OK
        )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, course_id):
        scenario_id = request.data.get('scenario_id')

        try:
            scenario_id = int(scenario_id)
            if scenario_id < 1:
                raise ValueError(
                    f"Scenario id {scenario_id} is not valid or missing.")

            course_id = int(course_id)
            if course_id < 1:
                raise ValueError(
                    f"Scenario id {course_id} is not valid or missing.")
        except Exception as e:
            return Response(
                {"status": "error", "error-message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course: Course = None

        try:
            course = get_object_or_404(Course, id=course_id)
        except:
            return Response(
                {"error": f"Course {course_id} not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if course.scenarios.filter(id=scenario_id).exists():
            course.scenarios.remove(scenario_id)
            return Response(
                {"status": f"Scenario {scenario_id} removed from the course {course_id} successfully."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": f"Scenario {scenario_id} was not available for the course {course_id}."},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserCoursesView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request):
        user = request.user

        courses = Course.objects.filter(users=user)
        scenario_set = set()

        for course in courses:
            scenarios = course.scenarios.all()
            scenario_set.update(scenarios)

        scenario_list: list[TemplateScenario] = list(scenario_set)

        serialized_template_scenarios = TemplateScenarioSerializer(
            scenario_list, many=True).data

        return Response(
            serialized_template_scenarios,
            status=status.HTTP_200_OK
        )
