import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Question from "../components/Simulation/Actions/Question";
import Action from "../components/Simulation/Actions/Action";
import Event from "../components/Simulation/Event/Event";
import ModelSelection from "../components/ModelSelection";
import Result from "../components/Simulation/Result/Result";
import { getCookie } from "../utils/utils";
import Dashboard from "../components/Simulation/Dashboard/Dashboard";
import MarkdownDisplay from "../components/MarkdownDisplay";
import SkilltypeContainer from "../components/Simulation/Actions/SkilltypeContainer";

import { Spinner } from '@chakra-ui/react';

const Simulation = () => {
  const location = useLocation();

  // scenario template data
  const { state } = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isStoryOpen, onOpen: onStoryOpen, onClose: onStoryClose } = useDisclosure();

  // current simulation play id
  const [currentSimID, setCurrentSimID] = useState();

  // current simulation type (eg. model, question, segment, event)
  const [currentType, setCurrentType] = useState();

  // validation status of user selected data
  const [dataValidationStatus, setDataValidationStatus] = useState(false);

  // values for simulation
  const [simValues, setSimValues] = useState({});

  // sim values before
  const [simValuesBefore, setSimValuesBefore] = useState({});

  const [story, setStory] = useState("");

  // contains the values that should be sent to the next endpoint
  const [returnValues, setReturnValues] = useState();

  const [scenarioIsLoading, setScenarioIsLoading] = useState(true);

  // loading state while new data is loaded, so react doesnt crash
  const [nextIsLoading, setNextIsLoading] = useState(false);

  // rerender function for actions
  const [rerender, setRerender] = useState(0);

  // rerender function for skilltypes
  const [rerenderSkill, setRerenderSkill] = useState(0);

  // define simulation fragment values
  const [simFragmentActions, setSimFragmentActions] = useState();

  // save all available skilltypes
  const [skillTypes, setSkillTypes] = useState([]);

  // save skilltype return object
  const [skillTypeReturn, setSkillTypeReturn] = useState([]);

  // save maximum number of task
  const [tasksMax, setTasksMax] = useState(0);

  // default values for actions
  const [actionDefaultValues, setActionDefaultValues] = useState({
    bugfix: false,
    unittest: false,
    integrationtest: false,
  });

  const scenarioPath = () => {
    const url = location.pathname;
    const newUrl = url.slice(0, url.lastIndexOf("/"));
    return newUrl;
  };

  async function handleSelection(event) {
    if (currentType === "MODEL") {
      setReturnValues({
        scenario_id: currentSimID,
        type: currentType,
        model: event,
      });
      setDataValidationStatus(true);
    } else if (currentType === "QUESTION") {
      const tempReturnValues = {
        scenario_id: currentSimID,
        type: currentType,
        question_collection: event,
      };
      setReturnValues(tempReturnValues);
      setDataValidationStatus(true);
    } else if (currentType === "SIMULATION") {
      var tempSimFragmentActions = simFragmentActions;

      // write new value into action fragment
      tempSimFragmentActions[event.type] = event.value;

      // write new default values
      if (event.type === "bugfix" || event.type === "unittest" || event.type === "integrationtest") {
        // create copy of state
        var tempActionDefaultValues = actionDefaultValues;

        // change default values in copy
        tempActionDefaultValues[event.type] = event.value;

        // write copy into state
        setActionDefaultValues(tempActionDefaultValues);
      }

      // set fragment state
      setSimFragmentActions(tempSimFragmentActions);

      const tempReturnValues = {
        scenario_id: currentSimID,
        type: currentType,
        actions: tempSimFragmentActions,
        members: skillTypeReturn,
      };

      setReturnValues(tempReturnValues);
      setDataValidationStatus(true);
    }
  }

  function createSkillTypeObject(skillTypesList) {
    // create list that can be returned to next endpoint
    var list = [];
    for (const type of skillTypesList) {
      list.push({
        skill_type: type,
        change: 0,
      });
    }
    // set state
    setSkillTypeReturn(list);
    return list;
  }

  function resetSkillTypeObject() {
    // reset change values for each skill type, required for displaying on frontend after clicking next
    var tempSKillTypeList = skillTypeReturn;
    for (const type in tempSKillTypeList) {
      tempSKillTypeList[type].change = 0;
    }

    setSkillTypeReturn(tempSKillTypeList);
  }

  function updateSkillTypeObject(skill, value) {
    // get index of skill that will be updates
    const skillIndex = skillTypeReturn.findIndex((object) => {
      return object.skill_type === skill;
    });

    // create temporary object to overwrite current one
    var tempSkillTypeReturn = skillTypeReturn;

    // update change value
    tempSkillTypeReturn[skillIndex].change = tempSkillTypeReturn[skillIndex].change + value;

    const tempReturnValues = {
      scenario_id: currentSimID,
      type: currentType,
      actions: simFragmentActions,
      members: tempSkillTypeReturn,
    };

    setReturnValues(tempReturnValues);

    // update state
    setSkillTypeReturn(tempSkillTypeReturn);
    setRerenderSkill(rerenderSkill + 50);
  }

  function getSkillTypeCount(skill) {
    var skillTypeCount = 0;
    for (const type of simValues.members) {
      if (type.skill_type.name === skill) {
        skillTypeCount = skillTypeCount + 1;
      }
    }
    return skillTypeCount;
  }

  async function startScenario() {
    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/sim/start`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ "template-id": state.id, "config-id": 1 }),
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
        },
      });

      const scenario = await res.json();
      console.log("scenario", scenario);
      setCurrentSimID(scenario.data.id);
      await handleNext(scenario.data.id);
      setScenarioIsLoading(false);

      // get skilltypes
      const resSkill = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/skill-type`, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
        },
      });

      // create empty list for skill types in scenario
      var skillTypesList = [];

      const resSkillReturn = await resSkill.json();

      // create skilltype array
      for (const type of resSkillReturn.data) {
        skillTypesList.push(type.name);
      }

      // write skilltype array into state
      setSkillTypes(skillTypesList);
      createSkillTypeObject(skillTypesList);
    } catch (err) {
      console.log(err);
    }
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  async function handleNext(simID) {
    setNextIsLoading(true);
    setDataValidationStatus(false);
    var nextValues = {};
    // check if return values exist, if not, the project has just started and the type START is required
    // otherwise the created returnvalues from state should be used
    if (returnValues === undefined) {
      nextValues = { scenario_id: simID, type: "START" };
    } else {
      console.log("rv", returnValues);
      nextValues = returnValues;
    }
    // api next call with values required to anvance simulation
    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/sim/next`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(nextValues),
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
        },
      });

      const nextData = await res.json();
      console.log("NextData:", nextData);

      // get total tasks
      if (tasksMax === 0) {
        setTasksMax(nextData.tasks.tasks_todo);
      }

      // set type
      setCurrentType(nextData.type);
      // set data
      if (nextData.type === "QUESTION") {
        console.log("Questionsssss");
        console.log(nextData);
        for (const question of nextData.question_collection.questions) {
          question.answers = shuffleArray(question.answers);
        }
        console.log("------");
        console.log(nextData);
        setSimValues(nextData);
        setDataValidationStatus(true);
      } else if (nextData.type === "MODEL") {
        setSimValues(nextData);
      } else if (nextData.type === "SIMULATION") {
        setSimValues(nextData);
        setDataValidationStatus(true);
        let tempActions = {};

        // get all actions from next data object
        for (const action of nextData.actions) {
          if (action.action === "bugfix") {
            tempActions.bugfix = actionDefaultValues.bugfix;
          } else if (action.action === "unittest") {
            tempActions.unittest = actionDefaultValues.unittest;
          } else if (action.action === "integrationtest") {
            tempActions.integrationtest = false;
          } else if (action.action === "meetings") {
            tempActions.meetings = action.lower_limit;
          } else if (action.action === "teamevent") {
            tempActions.teamevent = false;
          } else if (action.action === "training") {
            tempActions.training = action.lower_limit;
          } else if (action.action === "salary") {
            tempActions.salary = 1;
          } else if (action.action === "overtime") {
            tempActions.overtime = 0;
          }
        }

        // set action values with default values
        setSimFragmentActions(tempActions);

        // returnvalues if no user input was registered
        const tempReturnValues = {
          scenario_id: simID,
          type: nextData.type,
          actions: tempActions,
          members: skillTypeReturn,
        };
        setReturnValues(tempReturnValues);

        // quick and dirty solution for rerendering, please don't judge
        resetSkillTypeObject();
        setRerender(rerender + 20);
        setRerenderSkill(rerenderSkill + 50);
      } else if (nextData.type === "EVENT") {
        setDataValidationStatus(true);
        setSimValues(nextData);

        const tempReturnValues = {
          scenario_id: simID,
          type: nextData.type,
        };
        setReturnValues(tempReturnValues);
      } else if (nextData.type === "RESULT") {
        setDataValidationStatus(true);
        setSimValues(nextData);
      }

      setNextIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  // end simulation on user request
  async function manualEndSimulation() {
    setNextIsLoading(true);

    // values for ending the project
    const nextValues = { scenario_id: currentSimID, type: "END" };

    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/sim/next`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(nextValues),
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
        },
      });

      const nextData = await res.json();
      console.log("NextData:", nextData);

      // set type
      setCurrentType(nextData.type);

      // set validation status to true so all buttons are available
      setDataValidationStatus(true);

      // set sim values to new return values
      setSimValues(nextData);

      // set loading state to false to show data
      setNextIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("skRet", skillTypeReturn);
  }, [skillTypeReturn]);

  useEffect(() => {
    setStory(state.story);
    onOpen();
  }, [onOpen]);

  useEffect(() => {
    setSimValuesBefore(simValues);
    // open story only if there is a story and if it is not the same story as before
    if (simValues.text && simValues.text !== simValuesBefore.text) {
      onStoryOpen();
      setStory(story + "\n\n---\n\n" + simValues.text);
    }
  }, [simValues]);

  const [actionListExpanded, setActionListExpanded] = useState(false);

  const toggleActionList = () => {
    setActionListExpanded(!actionListExpanded);
  };

  return (
    <>
      <Modal isOpen={isOpen} closeOnOverlayClick={false} isCentered size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Story</ModalHeader>
          <ModalBody>
            <MarkdownDisplay markdownText={story} />
          </ModalBody>

          <ModalFooter gap={5}>
            <Button colorScheme="blue" variant="ghost" as={Link} to="/scenarios">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                onClose();
                startScenario();
              }}
            >
              Start Simulation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isStoryOpen} isCentered size="3xl" closeOnOverlayClick={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Story</ModalHeader>
          <ModalBody>
            <MarkdownDisplay markdownText={simValues.text} />
          </ModalBody>
          <ModalFooter gap={5}>
            <Button colorScheme="blue" onClick={onStoryClose}>
              Close Story
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex px={10} pt={2} flexDir="column" flexGrow={0}>
        <Breadcrumb spacing="8px" separator={<HiChevronRight color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={scenarioPath()}>
              Scenarios
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="">{state.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex flexDir="column" flexGrow={1}>
          <Heading p="5">Active Scenario: {state.name}</Heading>

          <Container maxW="container.2xl" h="full">
            <Flex h="full" flexDir={{ md: "column", lg: "row" }}>
              {scenarioIsLoading ? (
               <Spinner />
              ) : (
                <>
                  <Box w={{ md: "100%", lg: "62%" }} mb={{ md: 5, lg: 0 }}>
                    <Dashboard data={simValues} story={story} />
                  </Box>
                  <Spacer />
                  {/* right side of simulation studio */}
                  <Box p="3" w={{ md: "100%", lg: "36%" }} h="full" borderRadius="2xl" bg="white" textAlign="center">
                    <p>
                      {/* change heading depending on dataset */}
                      <Heading size="lg" mt={3}>
                        {currentType === "QUESTION"
                          ? "Questions"
                          : currentType === "SIMULATION"
                          ? "Actions"
                          : currentType === "MODEL"
                          ? "Model Selection"
                          : currentType === "EVENT"
                          ? "Event"
                          : currentType === "RESULT"
                          ? "Result"
                          : ""}
                      </Heading>
                    </p>
                    <Grid gap={4} p="5" justify="flex-end">
                      {/* Question Collection */}
                      {currentType === "QUESTION" ? (
                        <>
                          <Question
                            onSelect={(event) => handleSelection(event)}
                            question_collection={simValues.question_collection}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                      {/* Simulation Fragment */}
                      {currentType === "SIMULATION" ? (
                        <>
                          <SkilltypeContainer
                            skillTypeReturn={skillTypeReturn}
                            simValues={simValues}
                            updateSkillTypeObject={updateSkillTypeObject}
                          />
                          {simValues.actions.map((action, index) => {
                            return (
                              <Action
                                onSelectAction={(event) => handleSelection(event)}
                                key={index + rerender}
                                action={action}
                                actionDefaultValues={actionDefaultValues}
                              />
                            );
                          })}
                        </>
                      ) : (
                        <></>
                      )}
                      {/* Model Selection */}
                      {currentType === "MODEL" ? (
                        <>
                          <ModelSelection onSelectModel={(event) => handleSelection(event)} models={simValues.models} />
                        </>
                      ) : (
                        <></>
                      )}
                      {/* Event */}
                      {currentType === "EVENT" ? (
                        <>
                          <Event eventText={simValues.text} />
                        </>
                      ) : (
                        <></>
                      )}
                      {/* Result page */}
                      {currentType === "RESULT" ? (
                        <>
                          <Result resultParams={simValues} />
                        </>
                      ) : (
                        <></>
                      )}
                      <GridItem colSpan={1}>
                        {/* end simulation button */}
                        {!(currentType === "RESULT") &&
                        tasksMax > 0 &&
                        (simValues.tasks.tasks_bug +
                          simValues.tasks.tasks_done +
                          simValues.tasks.tasks_integration_tested +
                          simValues.tasks.tasks_unit_tested) /
                          tasksMax >=
                          0.8 ? (
                          //Button to confirm that you want to deliver the project
                          <Button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to deliver the Project?")) {
                                manualEndSimulation();
                              }
                            }}
                            colorScheme="blue"
                            size="lg"
                            mt={3}
                            mr={5}
                            w="35%"
                            isLoading={nextIsLoading}
                          >
                            <Tooltip
                              label={
                                "The simulation can be finished early, after completing 80% of tasks. This might be useful, when a project is more time reliant."
                              }
                              aria-label="A tooltip"
                              placement="top"
                            >
                              Deliver Project
                            </Tooltip>
                          </Button>
                        ) : (
                          <></>
                        )}
                        {/* Finish and Next buttons */}
                        {currentType === "RESULT" ? (
                          <>
                            <Button colorScheme="blue" size="lg" mt={3}>
                              <Link to={{ pathname: "/" }}>
                                <Tooltip
                                  label={"Finish the simulation and go back to the scenario overview."}
                                  aria-label="A tooltip"
                                  placement="top"
                                >
                                  Finish
                                </Tooltip>
                              </Link>
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => {
                              dataValidationStatus
                                ? handleNext(currentSimID, skillTypes)
                                : console.log("data status:", dataValidationStatus);
                            }}
                            colorScheme={dataValidationStatus ? "blue" : "gray"}
                            size="lg"
                            mt={3}
                            w="35%"
                            isLoading={nextIsLoading}
                          >
                            {currentType === "SIMULATION" ? "Next Week" : "Next"}
                          </Button>
                        )}
                      </GridItem>
                    </Grid>
                  </Box>
                </>
              )}
            </Flex>
          </Container>
        </Flex>
      </Flex>
    </>
  );
};

export default Simulation;
