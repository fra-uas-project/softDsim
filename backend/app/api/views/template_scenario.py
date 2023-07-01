import logging
from pprint import pprint

from bson import ObjectId
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.decorators.decorators import allowed_roles, has_access_to_scenario
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
from app.models.event import Event
from app.models.event import EventEffect


class TemplateScenarioView(APIView):

    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator", "staff"])
    def get(self, request, scenario_id=None, format=None):
        try:
            if scenario_id:
                template_scenario = TemplateScenario.objects.get(
                    id=scenario_id)
                serializer = TemplateScenarioSerializer(
                    template_scenario, many=False)
                return Response(serializer.data, status=status.HTTP_200_OK)

            template_scenarios = TemplateScenario.objects.all()
            serializer = TemplateScenarioSerializer(
                template_scenarios, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(
                f"{e.__class__.__name__} occurred in GET template-scenario")
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
            serializer = TemplateScenarioSerializer(
                data=request.data, many=False)
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
            logging.error(
                f"{e.__class__.__name__} occurred in POST template-scenario")
            logging.error(f"{str(e)} occurred in POST template-scenario")
            return Response(
                {"status": "something went wrong internally", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def delete(self, request, scenario_id=None):

        try:
            template_scenario = get_object_or_404(
                TemplateScenario, id=scenario_id)
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


class StudioTemplateScenarioView(APIView):

    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator"])
    def get(self, request, scenario_id=None):
        try:
            config = get_config()
            collection = config.get_mongo_db_scenario_template_collection()

            if scenario_id:
                try:
                    scenario_template = collection.find_one(
                        {"_id": ObjectId(scenario_id)})

                    return Response(
                        dict(status="success", data=serialize_template_scenario(
                            scenario_template)),
                        status=status.HTTP_200_OK
                    )
                except:
                    return Response(
                        dict(status="error",
                             data=f"No matching scenario template found for <scenario_id>: {scenario_id}"),
                        status=status.HTTP_404_NOT_FOUND
                    )

            else:
                # find all
                all_scenario_templates = [dict(id=str(document["_id"]), scenario=document["scenario"])
                                          for document in collection.find({})]

                return Response(dict(status="success", data=all_scenario_templates), status=status.HTTP_200_OK)
        except:
            return Response(dict(status="error", data="An error occurred while fetching all template scenarios"),
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )

    @allowed_roles(["creator", "staff"])
    def put(self, request, scenario_id):
        try:
            config = get_config()
            collection = config.get_mongo_db_scenario_template_collection()

            if scenario_id:
                scenario_template = request.data

                if scenario_template == {}:
                    return Response(
                        dict(status="error",
                             data=f"Scenario Template for <scenario_id> '{scenario_id}' can not be empty"),
                        status=status.HTTP_400_BAD_REQUEST
                    )

                scenario_template_dto = dict(
                    scenario=scenario_template)

                response = collection.replace_one(
                    {"_id": ObjectId(scenario_id)}, scenario_template_dto)

                if response.acknowledged and response.modified_count == 1:
                    return Response(
                        dict(status="success"),
                        status=status.HTTP_200_OK
                    )

                else:
                    return Response(
                        dict(status="error",
                             data=f"Scenario Template for <scenario_id> '{scenario_id}' couldn't be saved"),
                        status=status.HTTP_405_METHOD_NOT_ALLOWED
                    )
            else:
                return Response(
                    dict(
                        status="error", data="Please specify a <scenario_id> as path parameter"),
                    status=status.HTTP_405_METHOD_NOT_ALLOWED
                )

        except Exception as e:
            return Response(
                {"status": "something went wrong internally", "data": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @allowed_roles(["creator", "staff"])
    def post(self, request):
        try:
            config = get_config()
            collection = config.get_mongo_db_scenario_template_collection()

            if "clone" in request.query_params:
                template_scenario = collection.find_one(
                    {"_id": ObjectId(request.query_params.get("clone"))})

                scenario = next(
                    component for component in template_scenario["scenario"] if component["type"] == "BASE")
                scenario["template_name"] = f"{scenario['template_name']} (1)"

                template_scenario_dto = dict(
                    scenario=template_scenario["scenario"])
                template_scenario_result = collection.insert_one(
                    template_scenario_dto)
                duplicate_template_scenario_id = template_scenario_result.inserted_id

                duplicate_template_scenario = collection.find_one(
                    {"_id": duplicate_template_scenario_id})

                return Response(
                    dict(status="success", data=serialize_template_scenario(
                        duplicate_template_scenario)),
                    status=status.HTTP_200_OK
                )

            else:
                scenario_template = request.data

                scenario_template_dto = dict(scenario=scenario_template)

                object_id = collection.insert(scenario_template_dto)

                template_name = [fragment["template_name"]
                                 for fragment in scenario_template if fragment["type"] == "BASE"][0]

                return Response(
                    dict(status="success", data={
                         "name": template_name, "id": str(object_id)}),
                    status=status.HTTP_200_OK
                )

        except Exception as e:
            logging.error(
                f"{e.__class__.__name__} occurred in POST studio/template-scenario")
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

                response = collection.delete_one(
                    {"_id": ObjectId(scenario_id)})

                if response.deleted_count == 0:
                    return Response(
                        dict(status="error",
                             data=f"Scenario for <scenario_id> '{scenario_id}' could not be found"),
                        status=status.HTTP_404_NOT_FOUND
                    )

                return Response(
                    dict(status="success", data={"id": scenario_id}),
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    dict(
                        status="error", data="Please specify a <scenario_id> as path parameter"),
                    status=status.HTTP_400_BAD_REQUEST
                )
        except:
            return Response(
                dict(status="error",
                     data="An error occurred while fetching all scenarios"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TemplateScenarioFromStudioView(APIView):
    permission_classes = (IsAuthenticated,)

    @allowed_roles(["creator"])
    def post(self, request):
        try:

            if "studio_template_id" not in request.query_params:
                return Response(dict(status="error", data="Please provide the query parameter <studio_template_id>"),
                                status=status.HTTP_400_BAD_REQUEST
                                )

            studio_template_id = request.query_params["studio_template_id"]

            config = get_config()
            collection = config.get_mongo_db_scenario_template_collection()
            template_scenario = collection.find_one({"_id": ObjectId(studio_template_id)}, {
                                                    "scenario": 1, "_id": 0})["scenario"]

            template_scenario[0]["studio_template_id"] = studio_template_id

            logging.info("Creating template scenario from studio")
            scenario = TemplateScenario()
            scenario.save()

            caller = {
                "BASE": handle_base,
                "QUESTIONS": handle_question,
                "FRAGMENT": handle_simulation,
                "MODELSELECTION": handle_model,
                "EVENT": handle_event,
            }
            i = 0
            for component in template_scenario:
                try:
                    i = caller[component.get("type", "not-found")](
                        component, scenario, i
                    )
                except KeyError:
                    msg = f"Invalid component type {component.get('type')}"
                    logging.warning(msg)
                    return Response(
                        dict(status="error", data=msg,),
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            scenario.save()
            set_last_fragement(scenario)
            logging.info("Template scenario created with id: " +
                         str(scenario.id))

            # Create Scorecard
            scorecard = ScoreCard(template_scenario=scenario)
            scorecard.save()  # TODO: this should be set by the creator in studio

            return Response(
                dict(status="success", data={"id": scenario.id}),
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            try:
                scenario.delete()
            except Exception:
                logging.warning(
                    "Could not delete scenario after failed creation")
            msg = f"{e.__class__.__name__} occured while creating template scenario from studio"
            logging.error(msg)
            return Response(
                dict(status="error", data=msg),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class StudioTemplateScenarioIsPublishedValidatorView(APIView):
    @allowed_roles(["creator"])
    def get(self, request):
        try:

            if "scenario_id" in request.query_params:
                template_scenarios = TemplateScenario.objects.filter(
                    studio_template_id=request.query_params["scenario_id"])
                if template_scenarios:
                    return Response(
                        dict(status="success", data=True),
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        dict(status="success", data=False),
                        status=status.HTTP_200_OK,
                    )
            else:
                return Response(
                    dict(
                        status="error", data="Please provide the query parameter <scenario_id>"),
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except:
            return Response(
                dict(status="error", data="An error occurred"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def serialize_template_scenario(template_scenario):
    return dict(id=str(template_scenario["_id"]), scenario=template_scenario["scenario"])


def handle_base(data, scenario: TemplateScenario, i):
    scenario.name = data.get("template_name")
    scenario.story = data.get("text", "")
    scenario.studio_template_id = data.get("studio_template_id")
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
    qc = QuestionCollection(
        index=i, template_scenario=scenario, text=data["text"])
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
        waterfall="Waterfall" in data.get("models"),
        kanban="Kanban" in data.get("models"),
        scrum="Scrum" in data.get("models"),
        template_scenario=scenario,
    )

    # We have a minimum requirement. That's why this isn't Necessar (Burak)
    # if not m.waterfall and not m.kanban and not m.scrum:
    # If no model is selected, select all models
    # m.waterfall = True
    # m.scrum = True
    # m.kanban = True

    m.save()
    return i + 1


def handle_event(data, scenario: TemplateScenario, i):
    # Events are not yet implemented
    event = Event()

    event.template_scenario = scenario
    event.text = data['displayName']
    event.trigger_type = data['trigger_type']
    event.trigger_comparator = data['trigger_comparator']

    try:
        event.trigger_value = float(data['trigger_value'])
    except:
        event.trigger_value = 0

    event.save()

    valued_effect_types = [
        'budget',
        'duration',
        'stress',
        'motivation',
        'familiarity'
    ]

    for effect_type in valued_effect_types:
        get_valued_effect(effect_type, data[effect_type], event)

    get_tasks_effects(data, event)

    event.save()

    return i + 1


def get_valued_effect(effect_type: str, value: str, event: Event) -> EventEffect:
    effect: EventEffect = EventEffect()
    effect.event = event

    effect.type = effect_type

    effect.easy_tasks = 0
    effect.medium_tasks = 0
    effect.hard_tasks = 0

    try:
        effect.value = float(value)
    except:
        effect.value = 0

    effect.save()
    return effect


def get_tasks_effects(data, event: Event) -> EventEffect:
    effect: EventEffect = EventEffect()
    effect.event = event
    effect.type = 'tasks'
    effect.value = 0

    try:
        effect.easy_tasks = int(data['easy_tasks'])
    except:
        effect.easy_tasks = 0

    try:
        effect.medium_tasks = int(data['medium_tasks'])
    except:
        effect.medium_tasks = 0

    try:
        effect.hard_tasks = int(data['hard_tasks'])
    except:
        effect.hard_tasks = 0

    effect.save()
    return effect


def get_effect(data, event, effect_type) -> EventEffect:
    event_effect: EventEffect = EventEffect()
    event_effect.event = event
    event_effect.type = effect_type

    try:
        event_effect.value = float(data[effect_type])
    except:
        event_effect.value = 0

    try:
        event_effect.easy_tasks = int(data['easy_tasks'])
    except:
        event_effect.easy_tasks = 0

    try:
        event_effect.medium_tasks = int(data['medium_tasks'])
    except:
        event_effect.medium_tasks = 0

    try:
        event_effect.hard_tasks = int(data['hard_tasks'])
    except:
        event_effect.hard_tasks = 0

    try:
        return event_effect.save()
    except Exception as e:
        logging.error(str(e))

    event_effect.save()
    return event_effect


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

    @allowed_roles(["all"])
    @has_access_to_scenario("scenario_id", False)
    def get(self, request, scenario_id=None, format=None):
        try:
            if scenario_id:
                data = self.get_data_for_single_scenario(
                    scenario_id, request.user.username
                )
                return Response(data, status=status.HTTP_200_OK)

            template_scenarios = TemplateScenario.objects.all()

            data = [
                self.get_data_for_single_scenario(
                    scenario.id, request.user.username)
                for scenario in template_scenarios
            ]
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            logging.error(
                f"{e.__class__.__name__} occurred in GET template-scenario")
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
        serializer = ReducedTemplateScenarioSerializer(
            template_scenario, many=False)
        results = Result.objects.filter(
            user_scenario__user__username=username,
            user_scenario__template__id=template_scenario.id,
        )
        tries = len(results)
        max_score = 0
        if tries:
            max_score = max(map(lambda x: x.total_score, results))
        return {**serializer.data, "tries": tries, "max_score": max_score}
