import ActionElement from "./ActionElement";
import { actionIcon } from "../../ScenarionStudio/scenarioStudioData";
import { Grid, IconButton, Tooltip } from "@chakra-ui/react";
import { HiOutlineChevronDown, HiOutlineChevronLeft } from "react-icons/hi";
import { useState, useEffect } from "react";
import Skilltype from "./Skilltype";
import {FaQuestionCircle} from "react-icons/fa";

const SkilltypeContainer = ({
                              skillTypeReturn,
                              simValues,
                              updateSkillTypeObject,
                            }) => {
  const [actionListExpanded, setActionListExpanded] = useState(false);
  const [skilltypes, setSkilltypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (activeTooltip && !event.target.closest('.tooltip-container')) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [activeTooltip]);

  const handleButtonClick = (tooltip) => {
    setActiveTooltip(tooltip);
  };

  useEffect(() => {
    fetchSkillTypes();
  }, []);

  const fetchSkillTypes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/skill-type`, {
        method: "GET",
        credentials: "include",
      });
      const skilltypesData = await res.json();

      const skillTypeInfoRequests = skilltypesData.data.map(async (skillType) => {
        if (skillType.extra_info) {
          const extraInfoRes = await fetch(
              `${process.env.REACT_APP_DJANGO_HOST}/api/skill-type/${skillType.id}/info`,
              {
                method: "GET",
                credentials: "include",
              }
          );
          const extraInfoData = await extraInfoRes.json();
          skillType.extra_info = extraInfoData.data;
        }
        return skillType;
      });

      const skillTypeInfoData = await Promise.all(skillTypeInfoRequests);

      setSkilltypes(skillTypeInfoData);
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
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Employees
                <div className="tooltip-container" style={{ marginLeft: '8px' }}>
                  <Tooltip
                      label="Choose the necessary amount of the specific skilltype which is needed for the current project"
                      isOpen={activeTooltip === 'employees'}
                  >
                    <button onClick={() => handleButtonClick('employees')}>
                      <FaQuestionCircle size={12} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            }
            secondaryText="Hire employees"
            icon={actionIcon.SKILLTYPE}
        >
          <IconButton
              aria-label="Expand and collapse actions"
              icon={actionListExpanded ? <HiOutlineChevronDown /> : <HiOutlineChevronLeft />}
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
                    const { extra_info: extraInfo } = skillTypeObj;

                    if (extraInfo) {
                      console.log(extraInfo.description);
                    }

                    return (
                        <Tooltip
                            key={index}
                            label={
                              <div>
                                <strong>Cost per day:</strong> ${skillTypeObj.cost_per_day}
                                <br />
                                {extraInfo && extraInfo.min_throughput !== 0 && extraInfo.max_throughput !== 0 && (
                                    <>
                                      <strong>Throughput per Week:</strong> {extraInfo && `[${extraInfo.min_weekly_tasks} ~ ${extraInfo.max_weekly_tasks}]`}
                                      <br />
                                    </>
                                )}
                                {!extraInfo && (
                                    <>
                                      <strong>No Extra Info Available</strong>
                                      <br />
                                    </>
                                )}
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