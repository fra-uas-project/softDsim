import logging

from rest_framework import serializers

from app.exceptions import IndexException
from app.models.action import Action
from app.models.answer import Answer
from app.models.management_goal import ManagementGoal
from app.models.question import Question
from app.models.question_collection import QuestionCollection
from app.models.score_card import ScoreCard
from app.models.simulation_end import SimulationEnd
from app.models.simulation_fragment import SimulationFragment
from app.models.template_scenario import TemplateScenario
from app.serializers.management_goal import ManagementGoalSerializer
from app.serializers.question_collection import QuestionCollectionSerializer
from app.serializers.score_card import ScoreCardSerializer
from app.serializers.simulation_fragment import SimulationFragmentSerializer
from app.src.util.scenario_util import check_indexes


class TemplateScenarioSerializer(serializers.ModelSerializer):
    management_goal = ManagementGoalSerializer()
    question_collections = QuestionCollectionSerializer(many=True)
    simulation_fragments = SimulationFragmentSerializer(many=True)
    score_card = ScoreCardSerializer()

    class Meta:
        model = TemplateScenario
        fields = (
            "id",
            "name",
            "management_goal",
            "question_collections",
            "simulation_fragments",
            "score_card",
        )

    def create(self, validated_data, _id=None):
        """
        This custom create method is needed to enable a nested json structure in the post request to create a TemplateScenario.
        The method will create a TemplateScenario and all elementes of it (management_goal, question (action, textblock),...) in the database
        """
        # todo philip: add try/catch

        # check if indexes are correct
        if not check_indexes(validated_data):
            logging.warning("Cannot create TemplateScenario - Indexes are not correct.")
            raise IndexException()

        management_goal_data = validated_data.pop("management_goal")
        question_collection_data = validated_data.pop("question_collections")
        simulation_fragments_data = validated_data.pop("simulation_fragments")
        score_card_data = validated_data.pop("score_card")

        # 0. create template scenario
        # this if is when the create method gets called by the update method
        if _id:
            template_scenario = TemplateScenario.objects.create(
                id=_id, **validated_data
            )
        else:
            template_scenario = TemplateScenario.objects.create(**validated_data)

        # 1. create management_goal
        management_goal = ManagementGoal.objects.create(
            template_scenario=template_scenario, **management_goal_data
        )

        # 2. questions
        for question_collection in question_collection_data:

            questions_data = question_collection.pop("questions")

            # 2.1 create question_collection
            question_collection_object = QuestionCollection.objects.create(
                template_scenario=template_scenario, **question_collection
            )

            # 2.2 create question
            for question in questions_data:

                answers_data = question.pop("answers")

                question_object = Question.objects.create(
                    question_collection=question_collection_object, **question
                )

                # 2.2.1 create answer (should only be one, maybe change to OneToOneField
                for answer_data in answers_data:

                    answer = Answer.objects.create(
                        question=question_object, **answer_data
                    )

        # 3 create simulation_fragments
        for simulation_fragment_data in simulation_fragments_data:

            action_data = simulation_fragment_data.pop("actions")
            simulation_end_data = simulation_fragment_data.pop("simulation_end")

            simulation_fragment = SimulationFragment.objects.create(
                template_scenario=template_scenario, **simulation_fragment_data
            )

            simulation_end = SimulationEnd.objects.create(
                simulation_fragment=simulation_fragment, **simulation_end_data
            )

            # 3.1 create actions for simulation
            for action in action_data:

                action = Action.objects.create(
                    simulation_fragment=simulation_fragment, **action
                )

        # 4. create score card
        score_card = ScoreCard.objects.create(
            template_scenario=template_scenario, **score_card_data
        )

        return template_scenario

    def update(self, instance, validated_data):
        """
        This update method deletes the old TemplateScenario and creates a new one (but keeps the old id)
        """

        instance_id = instance.id

        instance.delete()

        new_template_scenario = self.create(validated_data, instance_id)
        return new_template_scenario
