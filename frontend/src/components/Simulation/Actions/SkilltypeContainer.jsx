import ActionElement from "./ActionElement";
import { actionIcon } from "../../ScenarionStudio/scenarioStudioData";
import { Grid, IconButton, Tooltip } from "@chakra-ui/react";
import { HiOutlineChevronDown, HiOutlineChevronLeft } from "react-icons/hi";
import { useState, useEffect } from "react";
import Skilltype from "./Skilltype";

const SkilltypeContainer = ({
  skillTypeReturn,
  simValues,
  updateSkillTypeObject,
}) => {
  const [actionListExpanded, setActionListExpanded] = useState(false);
  const [skilltypes, setSkilltypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSkillTypes();
  }, []);

  const fetchSkillTypes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/skill-type`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const skilltypesData = await res.json();
      setSkilltypes(skilltypesData.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const toggleActionList = () => {
    setActionListExpanded(!actionListExpanded);
  };

  function getSkillTypeCount(skill) {
    var skillTypeCount = 0;
    for (const type of simValues.members) {
      if (type.skill_type.name === skill) {
        skillTypeCount = skillTypeCount + 1;
      }
    }
    return skillTypeCount;
  }

  return (
    <Grid borderRadius="xl">
      <ActionElement
        title="Employees"
        secondaryText="Hire employees"
        icon={actionIcon.SKILLTYPE}
        tooltip={
          "Choose the necessary amount of the specific skilltype which is needed for the current project"
        }
      >
        <IconButton
          aria-label="Expand and collapse actions"
          icon={
            actionListExpanded ? (
              <HiOutlineChevronDown />
            ) : (
              <HiOutlineChevronLeft />
            )
          }
          variant="ghost"
          size="md"
          onClick={toggleActionList}
        />
      </ActionElement>
      {actionListExpanded && (
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          {isLoading ? (
            <div>Loading skill types...</div>
          ) : (
            skillTypeReturn.map((skilltype, index) => {
              const skillTypeObj = skilltypes.find(
                (st) => st.name === skilltype.skill_type
              );

              if (!skillTypeObj) {
                return null;
              }

              return (
                <Tooltip
                  key={index}
                  label={
                    <div>
                      <strong>Cost per day:</strong> ${skillTypeObj.cost_per_day}
                      <br />
                      <strong>Error rate:</strong> {skillTypeObj.error_rate}
                      <br />
                      <strong>Management quality:</strong>{" "}
                      {skillTypeObj.management_quality}
                      <br />
                      <strong>Development quality:</strong>{" "}
                      {skillTypeObj.development_quality}
                      <br />
                      <strong>Signing bonus:</strong>{" "}
                      ${skillTypeObj.signing_bonus}
                    </div>
                  }
                >
                  <div>
                    <Skilltype
                      onUpdateChange={(event) => {
                        updateSkillTypeObject(event.name, event.value);
                      }}
                      skillTypeName={skilltype.skill_type}
                      currentCount={getSkillTypeCount(skilltype.skill_type)}
                      countChange={skilltype.change}
                    />
                  </div>
                </Tooltip>
              );
            })
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default SkilltypeContainer;