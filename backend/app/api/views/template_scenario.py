import logging

from bson import ObjectId
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.decorators.decorators import allowed_roles
from app.exceptions import IndexException
from app.models.action import Action
from app.models.answer import Answer
from app.models.management_goal import ManagementGoal
from app.models.model_selection import ModelSelection
from app.models.question import Question
from app.models.question_collection import QuestionCollection
from app.models.score_card import ScoreCard
from app.models.simulation_end import SimulationEnd
from app.models.simulation_fragment import SimulationFragment
from app.models.template_scenario import TemplateScenario
from app.serializers.template_scenario import (
    ReducedTemplateScenarioSerializer,
    TemplateScenarioSerializer,
)
from config import get_config
from history.models.result import Result


class TemplateScenarioView(APIView):

    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student", "creator", "staff"])
    def get(self, request, scenario_id=None, format=None):

        try:
            if scenario_id:
                template_scenario = TemplateScenario.objects.get(id=scenario_id)
                serializer = TemplateScenarioSerializer(template_scenario, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)

            template_scenarios = TemplateScenario.objects.all()
            serializer = TemplateScenarioSerializer(template_scenarios, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"{e.__class__.__name__} occurred in GET template-scenario")
            logging.error(f"{str(e)} occurred in GET template-scenario")
            return Response(
                {
                    "error": "something went wrong on server side (except clause)",
                    "data": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def post(self, request):

        try:
            serializer = TemplateScenarioSerializer(data=request.data, many=False)
            if serializer.is_valid():

                # create method of TemplateScenarioSerializer checks if indexes of components are correct
                # if they're not -> create method will throw IndexException -> notify client that their indexes are wrong
                try:
                    serializer.save()
                except IndexException as e:
                    return Response(
                        {"message": str(e)}, status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response(
                    {"status": "Template Scenario saved", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            else:
                logging.error("Data for template scenario is not valid")
                logging.debug(serializer.errors)
                return Response(
                    {"status": "Data is not valid", "error": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            logging.error(f"{e.__class__.__name__} occurred in POST template-scenario")
            logging.error(f"{str(e)} occurred in POST template-scenario")
            return Response(
                {"status": "something went wrong internally", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, scenario_id=None):

        try:
            template_scenario = get_object_or_404(TemplateScenario, id=scenario_id)
            serializer = TemplateScenarioSerializer(template_scenario)
            template_scenario.delete()

            return Response(
                {
                    "status": "delete successful",
                    "data": {"name": serializer.data.get("name")},
                }
            )

        except Exception as e:
            logging.error(
                f"{e.__class__.__name__} occurred in DELETE template-scenario with id {id}"
            )
            return Response(
                {"status": "something went wrong internally"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def patch(self, request, scenario_id=None):

        try:
            template_scenario = TemplateScenario.objects.get(id=scenario_id)
            serializer = TemplateScenarioSerializer(
                template_scenario, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response({"status": "success", "data": serializer.data})
            else:
                logging.error("Could not patch template scenario")
                logging.debug(serializer.errors)
                return Response({"status": "error", "data": serializer.errors})

        except Exception as e:
            logging.error(
                f"{e.__class__.__name__} occurred in PATCH template-scenario with id {id}"
            )
            return Response(
                {"status": "something went wrong internally"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TemplateScenarioFromStudioView(APIView):

    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator"])
    def get(self, request, scenario_id=None):
        try:
            config = get_config()
            collection = config.get_mongo_db_scenario_template_collection()

            # find all
            all_scenario_templates = [dict(id=str(scenario["_id"]), name=scenario["name"])
                                  for scenario in collection.find({}, {"_id": 1, "name": 1})]

            return Response(
                dict(status="success", data=all_scenario_templates),
                status=status.HTTP_200_OK
            )
        except:
            return Response(dict(status="error", data="An error occurred while fetching all template scenarios"),
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )

    @allowed_roles(["creator", "staff"])
    def post(self, request):

        try:
            scenario_template = request.data
            config = get_config()
            collection = config.get_mongo_db_scenario_template_collection()

            object_id = collection.insert(scenario_template)

            return Response(
                {
                    "status": "save successful",
                    "data": {"name": scenario_template["name"],
                             "id": str(object_id)
                             },
                }
            )

        except Exception as e:
            logging.error(f"{e.__class__.__name__} occurred in POST template-scenario/studio")
            logging.error(f"{str(e)} occurred in POST template-scenario")
            return Response(
                {"status": "something went wrong internally", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator"])
    def delete(self, request, scenario_id=None):
        try:
            if scenario_id:
                config = get_config()
                collection = config.get_mongo_db_scenario_template_collection()

                collection.delete_one({"_id": ObjectId(scenario_id)})

                return Response(
                    dict(status="delete successful", data={"id": scenario_id}),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    dict(status="error", data="Please specify a <scenario_id> as path parameter"),
                    status=status.HTTP_405_METHOD_NOT_ALLOWED
                )
        except:
            return Response(dict(status="error", data="An error occurred while fetching all template scenarios"),
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )


    # @allowed_roles(["creator"])
    # def post(self, request):
    #     try:
    #         logging.info("Creating template scenario from studio")
    #         scenario = TemplateScenario()
    #         scenario.save()
    #
    #         caller = {
    #             "BASE": handle_base,
    #             "QUESTIONS": handle_question,
    #             "FRAGMENT": handle_simulation,
    #             "MODELSELECTION": handle_model,
    #             "EVENT": handle_event,
    #         }
    #         i = 0
    #         for component in request.data:
    #             try:
    #                 i = caller[component.get("type", "not-found")](
    #                     component, scenario, i
    #                 )
    #             except KeyError:
    #                 msg = f"Invalid component type {component.get('type')}"
    #                 logging.warning(msg)
    #                 return Response(
    #                     dict(status="error", data=msg,),
    #                     status=status.HTTP_400_BAD_REQUEST,
    #                 )
    #
    #         scenario.save()
    #         set_last_fragement(scenario)
    #         logging.info("Template scenario created with id: " + str(scenario.id))
    #
    #         # Create Scorecard
    #         scorecard = ScoreCard(template_scenario=scenario)
    #         scorecard.save()  # TODO: this should be set by the creator in studio
    #
    #         return Response(
    #             dict(status="success", data={"id": scenario.id}),
    #             status=status.HTTP_200_OK,
    #         )
    #
    #     except Exception as e:
    #         try:
    #             scenario.delete()
    #         except Exception:
    #             logging.warning("Could not delete scenario after failed creation")
    #         msg = f"{e.__class__.__name__} occured while creating template scenario from studio"
    #         logging.error(msg)
    #         return Response(
    #             dict(status="error", data=msg),
    #             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         )


def handle_base(data, scenario: TemplateScenario, i):
    scenario.name = data.get("template_name")
    scenario.story = data.get("text", "")
    # Create Management Goal
    mgoal = ManagementGoal(
        budget=data.get("budget"),
        duration=data.get("duration"),
        easy_tasks=int(data.get("easy_tasks")),
        medium_tasks=int(data.get("medium_tasks")),
        hard_tasks=int(data.get("hard_tasks")),
        tasks_predecessor_p=0.3,  # TODO: this should be set by the creator in studio
        template_scenario=scenario,
    )

    mgoal.save()
    return i


def handle_question(data, scenario: TemplateScenario, i):
    qc = QuestionCollection(index=i, template_scenario=scenario)
    qc.save()
    qi = 0
    for question_data in data.get("questions", []):

        q = Question(
            question_index=qi,
            question_collection=qc,
            text=question_data.get("text", ""),
            multi=question_data.get("type") == "MULTI",
            explanation=question_data.get("explanation", ""),
        )
        q.save()

        for answer_data in question_data.get("answers"):
            a = Answer(
                label=answer_data.get("label"),
                points=int(answer_data.get("points")),
                question=q,
            )
            a.save()
        qi += 1

    return i + 1


def handle_simulation(data, scenario: TemplateScenario, i):
    # Initialize Fragment
    simfragment = SimulationFragment(
        index=i, text=data.get("text", ""), template_scenario=scenario
    )
    simfragment.save()

    # Create Simulation End
    simend_data = data.get("simulation_end")
    simend = SimulationEnd(
        limit=simend_data.get("limit"),
        type=simend_data.get("type"),
        limit_type=simend_data.get("limit_type"),
        simulation_fragment=simfragment,
    )
    simend.save()

    # Create Actions
    for action_data in data.get("actions"):
        action = Action(
            title=action_data.get("action"),
            lower_limit=action_data.get("lower_limit"),
            upper_limit=action_data.get("upper_limit"),
            simulation_fragment=simfragment,
        )
        action.save()

    return i + 1


def handle_model(data, scenario: TemplateScenario, i):
    m = ModelSelection(
        index=i,
        text=data.get("text", ""),
        waterfall="waterfall" in data.get("models"),
        kanban="kanban" in data.get("models"),
        scrum="scrum" in data.get("models"),
        template_scenario=scenario,
    )

    if not m.waterfall and not m.kanban and not m.scrum:
        # If no model is selected, select all models
        m.waterfall = True
        m.scrum = True
        m.kanban = True

    m.save()
    return i + 1


def handle_event(data, scenario: TemplateScenario, i):
    # Events are not yet implemented
    return i


def set_last_fragement(scenario: TemplateScenario):
    # Find all fragements
    fragments = SimulationFragment.objects.filter(template_scenario=scenario).order_by(
        "-index"
    )
    # Set the one with highest index as last fragment
    if fragments.count():
        last_fragment = fragments[0]
        last_fragment.last = True
        last_fragment.save()


class TemplateScenarioUserListView(APIView):

    permission_classes = (IsAuthenticated,)

    @allowed_roles(["student"])
    def get(self, request, scenario_id=None, format=None):

        try:
            if scenario_id:
                data = self.get_data_for_single_scenario(
                    scenario_id, request.user.username
                )
                return Response(data, status=status.HTTP_200_OK)

            template_scenarios = TemplateScenario.objects.all()
            data = [
                self.get_data_for_single_scenario(scenario.id, request.user.username)
                for scenario in template_scenarios
            ]
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            logging.error(f"{e.__class__.__name__} occurred in GET template-scenario")
            logging.error(f"{str(e)} occurred in GET template-scenario")
            return Response(
                {
                    "error": "something went wrong on server side (except clause)",
                    "data": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_data_for_single_scenario(self, scenario_id: int, username: str):
        template_scenario = TemplateScenario.objects.get(id=scenario_id)
        serializer = ReducedTemplateScenarioSerializer(template_scenario, many=False)
        results = Result.objects.filter(
            user_scenario__user__username=username,
            user_scenario__template__id=template_scenario.id,
        )
        tries = len(results)
        max_score = 0
        if tries:
            max_score = max(map(lambda x: x.total_score, results))
        return {**serializer.data, "tries": tries, "max_score": max_score}
