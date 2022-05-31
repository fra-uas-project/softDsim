import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
    Heading,
    HStack,
    Icon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    UnorderedList,
    VStack
} from "@chakra-ui/react";
import {HiChevronRight, HiUserGroup} from "react-icons/hi";
import {RiDragDropLine} from "react-icons/ri";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {
    MdAlarm,
    MdIntegrationInstructions,
    MdLocalBar,
    MdMiscellaneousServices,
    MdOutlineAttachMoney,
    MdOutlineAttractions,
    MdOutlineBugReport,
    MdOutlineCheckBox,
    MdOutlineInfo,
    MdOutlineRadioButtonChecked,
    MdRule,
    MdSchool,
    MdTimeline
} from "react-icons/md";
import {v4 as uuidv4} from 'uuid';
import {BsLightningCharge} from "react-icons/bs";
import EditorListComponent from "../components/EditorQuestionsComponent";
import ComponentTab from "../components/ComponentTab";
import QuestionInspectorForm from "../components/QuestionInspectorForm";
import BaseInspectorForm from "../components/BaseInspectorForm";
import QuestionsInspectorForm from "../components/QuestionsInspectorForm";
import EditorBaseComponent from "../components/EditorBaseComponent";
import FragmentInspectorForm from "../components/FragmentInspectorForm";
import ActionInspectorForm from "../components/ActionInspectorForm";
import InspectorEmtpy from "../components/InspectorEmtpy";
import EventInspectorForm from "../components/EventInspectorForm";
import ModelSelectionInspectorForm from "../components/ModelSelectionInspectorForm";

const ScenarioStudio = () => {

    const HEIGHT = "900px";

    const tabIndexEnum = {
        "INSPECTOR": 0,
        "COMPONENTS": 1
    };

    const componentEnum = {
        "BASE": "BASE",
        "FRAGMENT": "FRAGMENT",
        "MODELSELECTION": "MODELSELECTION",
        "QUESTIONS": "QUESTIONS",
        "EVENT": "EVENT"
    }

    const questionEnum = {
        "SINGLE": "SINGLE",
        "MULTI": "MULTI",
    }

    const finalComponentList = [
        {
            id: uuidv4(),
            type: "BASE",
            title: "Simulation Base Information",
            content: "Define the basic stats for a new simulation.",
            icon: MdOutlineInfo,
            displayName: "Base Information",
            text: "",
            budget: "0",
            duration: "0",
            easy_tasks: "0",
            medium_tasks:  "0",
            hard_tasks: "0",
        },
        {
            id: uuidv4(),
            type: "FRAGMENT",
            title: "Simulation Fragment",
            content: "Control the simulation by defining fragments.",
            icon: MdTimeline,
            displayName: `Simulation ${uuidv4().slice(0, 8)}`,
            actions: [],
            simulation_end: {}
        },
        {
            id: uuidv4(),
            type: "MODELSELECTION",
            title: "Model Selection",
            content: "Change between different project management methods.",
            icon: BsLightningCharge,
            displayName: "Model Selection",
            text: "",
            models: [],
        },
        {
            id: uuidv4(),
            type: "QUESTIONS",
            title: "Questions",
            content: "Create questions which need to be answered.",
            icon: MdRule,
            displayName: `Questions ${uuidv4().slice(0, 8)}`,
            text: "",
            questions: [],

        },
        {
            id: uuidv4(),
            type: "EVENT",
            title: "Event",
            displayName: `Event ${uuidv4().slice(0, 8)}`,
            content: "Add events that have an impact on the management objectives.",
            text: "",
            icon: MdOutlineAttractions,
            trigger: {},
            budget: "0",
            duration: "0",
            easy_tasks: "0",
            medium_tasks:  "0",
            hard_tasks: "0",
            stress: "0",
            motivation: "0"
        },
    ]

    const finalActionList = [
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Bug Fixing",
            icon: MdOutlineBugReport,
            displayName: "Bug Fixing",
            action: "bugfix",
        },
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Unit Testing",
            icon: MdIntegrationInstructions,
            displayName: "Unit Testing",
            action: "unittest",
        },
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Integration Testing",
            icon: MdMiscellaneousServices,
            displayName: "Integration Testing",
            action: "integrationtest",
        },
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Meetings",
            icon: HiUserGroup,
            displayName: "Meetings",
            action: "meetings",
            lower_limit: "0",
            upper_limit: "1",
        },
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Team Event",
            icon: MdLocalBar,
            displayName: "Team Event",
            action: "teamevent",
        },
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Training",
            icon: MdSchool,
            displayName: "Training",
            action: "training",
            lower_limit: "0",
            upper_limit: "1",
        },
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Salary",
            icon: MdOutlineAttachMoney,
            displayName: "Salary",
            action: "salary",
        },
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Overtime",
            icon: MdAlarm,
            displayName: "Overtime",
            action: "overtime",
        },
    ];

    const finalQuestionList = [
        {
            id: uuidv4(),
            type: "SINGLE",
            title: "Single Answer",
            icon: MdOutlineRadioButtonChecked,
            displayName: `Question ${uuidv4().slice(0, 8)}`,
            text: "",
            answers: []
        },
        {
            id: uuidv4(),
            type: "MULTI",
            title: "Multiple Answers",
            icon: MdOutlineCheckBox,
            displayName: `Question ${uuidv4().slice(0, 8)}`,
            text: "",
            answers: []
        },
    ];

    const [tabIndex, setTabIndex] = useState(1);
    const [editorList, updateEditorList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);

    const handleOnDragEnd = (result) => {
        // TODO deconstruct result

        // handle moving outside droppables
        if (!result.destination) return;

        // moving in the editor list
        if (result.source.droppableId === "editor" && result.destination.droppableId === "editor") {
            const items = Array.from(editorList);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            // console.log("test", editorList[result.source.index])
            // setSelectedItem(editorList[result.source.index].id)
            updateEditorList(items);

            // moving from component list to editor list
        } else if (result.source.droppableId === "componentList" && result.destination.droppableId === "editor") {
            const componentListItems = Array.from(finalComponentList);
            const [movedItem] = componentListItems.splice(result.source.index, 1);

            const editorListItems = Array.from(editorList);
            // copy because item needs to be unique
            let movedItemCopy = {...movedItem};
            movedItemCopy.id = uuidv4();
            editorListItems.splice(result.destination.index, 0, movedItemCopy);
            updateEditorList(editorListItems);

            setSelectedItem(movedItemCopy.id)
            setSelectedObject(movedItemCopy)
            // setTabIndex(tabIndexEnum.INSPECTOR) // Deactivated for demonstration purposes

            // moving from action list to fragment in editor
        } else if (result.source.droppableId === "actionList") {
            const actionListItems = Array.from(finalActionList);
            const [movedAction] = actionListItems.splice(result.source.index, 1);

            // copy because item needs to be unique
            let movedActionCopy = {...movedAction};
            movedActionCopy.id = uuidv4();

            // get fragment which needs to be updated
            const editorListItems = Array.from(editorList);
            const fragment = editorListItems.find(fragment => fragment.id === result.destination.droppableId)
            const fragmentActions = Array.from(fragment.actions);

            fragmentActions.splice(result.destination.index, 0, movedActionCopy);
            fragment.actions = fragmentActions

            updateEditorList(editorListItems);

            // Reorder actions in same list
        } else if (result.type === "action" && result.source.droppableId === result.destination.droppableId) {

            // Get fragment which actions need to be changed
            const editorListItems = Array.from(editorList);
            const fragment = editorListItems.find(fragment => fragment.id === result.source.droppableId)

            // Update actions
            const fragmentActions = Array.from(fragment.actions);
            const [reorderedAction] = fragmentActions.splice(result.source.index, 1);
            fragmentActions.splice(result.destination.index, 0, reorderedAction);

            fragment.actions = fragmentActions
            updateEditorList(editorListItems);


            // Remove from one action list and add to another
        } else if (result.type === "action" && result.source.droppableId !== result.destination.droppableId) {
            const editorListItems = Array.from(editorList);

            // Change source fragment action list
            const sourceFragment = editorListItems.find(fragment => fragment.id === result.source.droppableId)
            const sourceFragmentActions = Array.from(sourceFragment.actions);
            const [reorderedAction] = sourceFragmentActions.splice(result.source.index, 1);

            // Change destination fragment action list
            const destinationFragment = editorListItems.find(fragment => fragment.id === result.destination.droppableId)
            const destinationFragmentActions = Array.from(destinationFragment.actions);
            destinationFragmentActions.splice(result.destination.index, 0, reorderedAction);

            sourceFragment.actions = sourceFragmentActions
            destinationFragment.actions = destinationFragmentActions
            updateEditorList(editorListItems);
        }

        // moving from action list to fragment in editor
        else if (result.source.droppableId === "questionList") {
            const questionsListItems = Array.from(finalQuestionList);
            const [movedQuestion] = questionsListItems.splice(result.source.index, 1);

            // copy because item needs to be unique
            let movedQuestionCopy = {...movedQuestion};
            movedQuestionCopy.id = uuidv4();

            // get fragment which needs to be updated
            const editorListItems = Array.from(editorList);
            const questionsComponent = editorListItems.find(questionsComponent => questionsComponent.id === result.destination.droppableId)
            const questionsComponentQuestions = Array.from(questionsComponent.questions);

            questionsComponentQuestions.splice(result.destination.index, 0, movedQuestionCopy);
            questionsComponent.questions = questionsComponentQuestions

            updateEditorList(editorListItems);
        }

        // Reorder questions in same list
        else if (result.type === "question" && result.source.droppableId === result.destination.droppableId) {

            // Get fragment which actions need to be changed
            const editorListItems = Array.from(editorList);
            const questionsComponent = editorListItems.find(questionsComponent => questionsComponent.id === result.source.droppableId)

            // Update actions
            const questionsComponentQuestions = Array.from(questionsComponent.questions);
            const [reorderedQuestions] = questionsComponentQuestions.splice(result.source.index, 1);
            questionsComponentQuestions.splice(result.destination.index, 0, reorderedQuestions);

            questionsComponent.questions = questionsComponentQuestions
            updateEditorList(editorListItems);


            // Remove from one question list and add to another
        } else if (result.type === "question" && result.source.droppableId !== result.destination.droppableId) {
            const editorListItems = Array.from(editorList);

            // Change source fragment action list
            const sourceQuestionsComponent = editorListItems.find(component => component.id === result.source.droppableId)
            const sourceQuestionsComponentQuestions = Array.from(sourceQuestionsComponent.questions);
            const [reorderedQuestion] = sourceQuestionsComponentQuestions.splice(result.source.index, 1);

            // Change destination fragment action list
            const destinationQuestionsComponent = editorListItems.find(component => component.id === result.destination.droppableId)
            const destinationQuestionsComponentQuestions = Array.from(destinationQuestionsComponent.questions);
            destinationQuestionsComponentQuestions.splice(result.destination.index, 0, reorderedQuestion);

            sourceQuestionsComponent.questions = sourceQuestionsComponentQuestions
            destinationQuestionsComponent.questions = destinationQuestionsComponentQuestions
            updateEditorList(editorListItems);
        }

        console.log(result)
    };

    const findComponent = (componentId) => {
        return (editorList.find(component => component.id === componentId))
    };

    const findQuestion = (questionId) => {
        const questionsList = editorList.filter(component => component.type === componentEnum.QUESTIONS)

        let questions = []
        for (const questionsListElement of questionsList) {
            questions = [...questions, ...questionsListElement.questions]
        }

        return (questions.find(question => question.id === questionId))
    };

    const findAction = (actionId) => {
        const fragmentList = editorList.filter(component => component.type === componentEnum.FRAGMENT)

        let actions = []
        for (const fragment of fragmentList) {
            actions = [...actions, ...fragment.actions]
        }

        return (actions.find(action => action.id === actionId))
    }

    const handleSelect = (e) => {
        setSelectedItem(e.currentTarget.getAttribute("elementid"))
        setSelectedObject(editorList.find(component => component.id === e.currentTarget.getAttribute("elementid")))
    }

    const handleTabsChange = (index) => {
        setTabIndex(index)
    };

    const handleEditorBackgroundClick = (e) => {
        // if (e.target.getAttribute("role") === "list") {
        //     setTabIndex(tabIndexEnum.COMPONENTS)
        //     setSelectedItem("")
        //     setSelectedObject(null)
        // }
    };

    // If item is selected, switch to inspector tab
    useEffect(() => {
        if (selectedItem) {
            setTabIndex(tabIndexEnum.INSPECTOR);
        }
    }, [selectedItem, tabIndexEnum.INSPECTOR]);

    useEffect(() => {
        console.log(editorList)
        console.log("SO", selectedObject)
    }, [selectedItem])

    return (
        <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
            <Breadcrumb spacing='8px' separator={<HiChevronRight color='gray.500'/>}>
                <BreadcrumbItem>
                    <BreadcrumbLink href=''>Scenarios Studio</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Heading>Scenario Studio</Heading>
            <Box h={5}></Box>
            <Box backgroundColor="#EDF2F7" borderRadius="2xl" minH="70vh">
                <HStack w="full" h={HEIGHT} overflow="hidden" pt={2} spacing={5}
                        onClick={((e) => handleEditorBackgroundClick(e))}>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        {/*Editor*/}
                        <Flex w="full" h="full" justifyContent="center" alignItems="center" backgroundColor="white"
                              borderRadius="2xl" overflowX="auto" p={10}>
                            <Droppable droppableId="editor"
                                       type="component"
                            >
                                {(provided, snapshot) => (
                                    <UnorderedList listStyleType="none"
                                                   m={0}
                                                   mt="auto"
                                                   transition="background-color 0.2s ease"
                                                   minH="full"
                                                   // h="full"
                                                   minW="90%"
                                                   {...provided.droppableProps}
                                                   ref={provided.innerRef}
                                                   backgroundColor={snapshot.isDraggingOver ? "gray.200" : ""}
                                                   display="flex"
                                                   flexDir="column"
                                                   justifyContent={editorList.length ? "flex-start" : "center"}
                                                   alignItems="center"
                                                   borderRadius="2xl"
                                    flexGrow="1">
                                        {
                                            editorList.length ?
                                                editorList.map((component, index) => {

                                                        if (component.type === componentEnum.BASE) {
                                                            return (
                                                                <EditorBaseComponent
                                                                    key={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    index={index}
                                                                    component={component}
                                                                    isSelected={selectedItem === component.id}
                                                                    selectedItem={selectedItem}
                                                                />
                                                            )
                                                        } else if (component.type === componentEnum.FRAGMENT) {
                                                            return (
                                                                <EditorListComponent
                                                                    key={component.id}
                                                                    elementid={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    id={component.id}
                                                                    title={component.title}
                                                                    index={index}
                                                                    component={component}
                                                                    droppableType="action"
                                                                    isSelected={selectedItem === component.id}
                                                                    selectedItem={selectedItem}
                                                                    actions={component.actions}
                                                                />
                                                            )
                                                        } else if (component.type === componentEnum.QUESTIONS) {
                                                            return (
                                                                <EditorListComponent
                                                                    key={component.id}
                                                                    elementid={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    id={component.id}
                                                                    title={component.title}
                                                                    index={index}
                                                                    component={component}
                                                                    droppableType="question"
                                                                    isSelected={selectedItem === component.id}
                                                                    selectedItem={selectedItem}
                                                                    actions={component.questions}
                                                                />
                                                            )
                                                        } else if (component.type === componentEnum.EVENT) {
                                                            return (
                                                                <EditorBaseComponent
                                                                    key={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    index={index}
                                                                    component={component}
                                                                    isSelected={selectedItem === component.id}
                                                                    selectedItem={selectedItem}
                                                                />
                                                            )
                                                        } else {
                                                            // //    TODO Implement other types
                                                            return (
                                                                <EditorBaseComponent
                                                                    key={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    index={index}
                                                                    component={component}
                                                                    isSelected={selectedItem === component.id}
                                                                    selectedItem={selectedItem}
                                                                />
                                                            )
                                                        }

                                                    }
                                                )
                                                :
                                                <VStack color="gray.200">
                                                    <Icon as={RiDragDropLine} w={20} h={20} mb={6}/>
                                                    <Heading size="lg" pointerEvents="none">Drag a component
                                                        here</Heading>
                                                    <Text pointerEvents="none" fontSize="xl" mt="20px">(Create a complex
                                                        scenario by drag and dropping different components)</Text>
                                                </VStack>
                                        }
                                        {provided.placeholder}
                                    </UnorderedList>
                                )}
                            </Droppable>

                        </Flex>


                        {/*Right Panel*/}
                        <Box h="full" backgroundColor="white" borderRadius="2xl">
                            <Tabs
                                index={tabIndex}
                                onChange={handleTabsChange}
                                minH="900px"
                            >
                                <TabList>
                                    <Tab fontWeight="bold" color="gray.400">Inspector</Tab>
                                    <Tab fontWeight="bold" color="gray.400">Components</Tab>
                                </TabList>

                                {/* h = full height - tab header */}
                                <TabPanels minW="350px" h="850px" overflow="auto">
                                    <TabPanel height="full">
                                        {/* Inspector Items */}
                                        {selectedItem ?
                                            <VStack alignItems="flex-start" pt={2}>
                                                {selectedObject?.type === componentEnum.BASE &&
                                                    <BaseInspectorForm
                                                        key={selectedObject.id}
                                                        baseData={findComponent(selectedItem)}
                                                    />
                                                }

                                                {selectedObject?.type === componentEnum.QUESTIONS &&
                                                    <QuestionsInspectorForm
                                                        key={selectedObject.id}
                                                        finalQuestionList={finalQuestionList}
                                                        questionsData={selectedObject}
                                                    />
                                                }

                                                {selectedObject?.type === componentEnum.FRAGMENT &&
                                                    <FragmentInspectorForm
                                                        key={selectedObject.id}
                                                        finalActionList={finalActionList}
                                                        fragmentData={findComponent(selectedItem)}
                                                    />
                                                }

                                                {selectedObject?.type === componentEnum.EVENT &&
                                                    <EventInspectorForm
                                                        key={selectedObject.id}
                                                        eventData={findComponent(selectedItem)}
                                                    />
                                                }

                                                {selectedObject?.type === componentEnum.MODELSELECTION &&
                                                    <ModelSelectionInspectorForm
                                                        key={selectedObject.id}
                                                        modelSelectionData={selectedObject}
                                                    />
                                                }

                                                {findAction(selectedItem)?.type === "ACTION" &&
                                                    <ActionInspectorForm
                                                        key={findAction(selectedItem).id}
                                                        actionData={findAction(selectedItem)}
                                                    />
                                                }

                                                {(findQuestion(selectedItem)?.type === questionEnum.SINGLE || findQuestion(selectedItem)?.type === questionEnum.MULTI) &&
                                                    <QuestionInspectorForm
                                                        key={findQuestion(selectedItem).id}
                                                        questionData={findQuestion(selectedItem)}
                                                    />
                                                }
                                            </VStack>
                                            :
                                            <InspectorEmtpy
                                                content="No components selected. Click on a component to select it."
                                                />
                                        }

                                    </TabPanel>

                                    {/* Component Tab */}
                                    <TabPanel>
                                        <ComponentTab
                                            finalComponentList={finalComponentList}
                                        />
                                    </TabPanel>

                                </TabPanels>
                            </Tabs>
                        </Box>
                    </DragDropContext>
                </HStack>
            </Box>
        </Flex>
    )
};

export default ScenarioStudio