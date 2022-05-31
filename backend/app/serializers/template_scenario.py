from rest_framework import serializers

from app.models.decision import Decision
from app.models.action import Action
from app.models.answer import Answer
from app.models.management_goal import ManagementGoal
from app.models.score_card import ScoreCard
from app.models.simulation import Simulation
from app.models.template_scenario import TemplateScenario
from app.models.text_block import TextBlock
from app.serializers.decision import DecisionSerializer
from app.serializers.management_goal import ManagementGoalSerializer
from app.serializers.simulation import SimulationSerializer


class TemplateScenarioSerializer(serializers.ModelSerializer):
    management_goal = ManagementGoalSerializer()
    decisions = DecisionSerializer(many=True)
    simulation = SimulationSerializer()

    class Meta:
        model = TemplateScenario
        fields = ("id", "name", "management_goal", "decisions", "simulation")

    def create(self, validated_data, _id=None):
        """
        This custom create method is needed to enable a nested json structure in the post request to create a TemplateScenario.
        The method will create a TemplateScenario and all elementes of it (management_goal, decision (action, textblock),...) in the database
        """
        # todo philip: add try/catch

        management_goal_data = validated_data.pop("management_goal")
        decision_data = validated_data.pop("decisions")
        simulation_data = validated_data.pop("simulation")

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

        # 2. create decision
        for data in decision_data:

            text_block_data = data.pop("text_block")
            action_data = data.pop("actions")

            # 2.1 create decision
            decision = Decision.objects.create(
                template_scenario=template_scenario, **data
            )

            # 2.2 create actions for decision
            for action in action_data:

                answers_data = action.pop("answers")

                action = Action.objects.create(decision=decision, **action)

                # 2.2.1 create answers for action for decision
                for answer in answers_data:
                    Answer.objects.create(action=action, **answer)

            # 2.3 create text_blocks for decision
            for text_block in text_block_data:
                TextBlock.objects.create(decision=decision, **text_block)

        # 3. create simulation
        text_block_data = simulation_data.pop("text_block")
        action_data = simulation_data.pop("actions")
        score_card_data = simulation_data.pop("score_card")

        # 3.1 create simulation
        simulation = Simulation.objects.create(
            template_scenario=template_scenario, **simulation_data
        )
        # 3.2 create actions for simulation
        for action in action_data:

            answers_data = action.pop("answers")

            action = Action.objects.create(simulation=simulation, **action)

            # 3.2.1 create answers for action for simulation
            for answer in answers_data:
                Answer.objects.create(action=action, **answer)

        # 3.3 create text_blocks for simulation
        for text_block in text_block_data:
            TextBlock.objects.create(simulation=simulation, **text_block)

        # 3.4 create score_card for simulation
        score_card = ScoreCard.objects.create(simulation=simulation, **score_card_data)

        return template_scenario

    def update(self, instance, validated_data):
        """
        This update method deletes the old TemplateScenario and creates a new one (but keeps the old id)
        """

        instance_id = instance.id

        instance.delete()

        new_template_scenario = self.create(validated_data, instance_id)
        return new_template_scenario
