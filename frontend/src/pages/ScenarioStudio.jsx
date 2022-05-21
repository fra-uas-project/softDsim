import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Flex,
    Heading,
    HStack,
    Icon,
    ListItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    UnorderedList,
    VStack
} from "@chakra-ui/react";
import {HiChevronRight} from "react-icons/hi";
import {RiDragDropLine} from "react-icons/ri";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {
    MdOutlineAttractions,
    MdOutlineCheckBox,
    MdOutlineInfo,
    MdOutlineRadioButtonChecked,
    MdRule,
    MdTimeline
} from "react-icons/md";
import {v4 as uuidv4} from 'uuid';
import styled from "@emotion/styled";
import {BsLightningCharge} from "react-icons/bs";
import EditorBasicComponent from "../components/EditorBasicComponent";
import EditorFragmentComponent from "../components/EditorFragmentComponent";
import EditorQuestionsComponent from "../components/EditorQuestionsComponent";
import InspectorItemSelector from "../components/InspectorItemSelector";
import ComponentTab from "../components/ComponentTab";
import QuestionInspectorForm from "../components/QuestionInspectorForm";
import BaseInspectorForm from "../components/BaseInspectorForm";
import QuestionsInspectorForm from "../components/QuestionsInspectorForm";

const Clone = styled(ListItem)`
  margin-bottom: 12px;

  + li {
    display: none !important;
    background-color: blueviolet;
  }
`;

const ScenarioStudio = () => {

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
            content: "Define the basisc stats for a new simulation.",
            icon: MdOutlineInfo,
            displayName: "Base Information",
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
            displayName: "() => { return `Simulation Fragment ${this.d.slice(0, 8)}`}",
            actions: []
        },
        {
            id: uuidv4(),
            type: "MODELSELECTION",
            title: "Model Selection",
            content: "Trigger actions like teamevents or training sessions.",
            icon: BsLightningCharge,
            displayName: "Model Selection",
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
            content: "Add events which can occur during the simulation like the illness of an employee.",
            icon: MdOutlineAttractions,
        },
    ]

    const finalActionList = [
        {
            id: uuidv4(),
            type: "ACTION",
            title: "Action",
            icon: BsLightningCharge
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

    const handleSelect = (e) => {
        setSelectedItem(e.currentTarget.getAttribute("elementid"))
        setSelectedObject(editorList.find(component => component.id === e.currentTarget.getAttribute("elementid")))
    }

    const handleTabsChange = (index) => {
        setTabIndex(index)
    };

    const handleEditorBackgroundClick = (e) => {
        if (e.target.getAttribute("role") === "list") {
            setTabIndex(tabIndexEnum.COMPONENTS)
        }
    };

    // If item is selected, switch to inspector tab
    useEffect(() => {
        if (selectedItem) {
            // TODO Not working when deselected and selected again
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
                <HStack w="full" h="full" overflow="hidden" pt={2} spacing={5}
                        onClick={((e) => handleEditorBackgroundClick(e))}>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        {/*Editor*/}
                        <Flex w="full" h="full" justifyContent="center" alignItems="center" backgroundColor="white"
                              borderRadius="2xl">
                            <Droppable droppableId="editor"
                                       type="component" // TODO
                            >
                                {(provided, snapshot) => (
                                    <UnorderedList listStyleType="none"
                                                   m={0}
                                                   p={40}
                                                   transition="background-color 0.2s ease"
                                                   minH="90%"
                                                   minW="90%"
                                                   {...provided.droppableProps}
                                                   ref={provided.innerRef}
                                                   backgroundColor={snapshot.isDraggingOver ? "gray.200" : ""}
                                                   display="flex"
                                                   flexDir="column"
                                                   justifyContent={editorList.length ? "flex-start" : "center"}
                                                   alignItems="center"
                                                   borderRadius="2xl">
                                        {
                                            editorList.length ?
                                                editorList.map((component, index) => {

                                                        if (component.type === componentEnum.BASE) {
                                                            return (
                                                                <EditorBasicComponent
                                                                    key={component.id}
                                                                    backgroundColor={snapshot.isDragging ? "blue.200" : "red.200"}
                                                                    elementid={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    id={component.id}
                                                                    title={component.title}
                                                                    index={index}
                                                                    isSelected={selectedItem === component.id}
                                                                />
                                                            )
                                                        } else if (component.type === componentEnum.FRAGMENT) {
                                                            return (
                                                                <EditorFragmentComponent
                                                                    key={component.id}
                                                                    backgroundColor={snapshot.isDragging ? "blue.200" : "red.200"}
                                                                    elementid={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    id={component.id}
                                                                    title={component.title}
                                                                    index={index}
                                                                    isSelected={selectedItem === component.id}
                                                                    selectedItem={selectedItem}
                                                                    actions={component.actions}
                                                                />
                                                            )
                                                        } else if (component.type === componentEnum.QUESTIONS) {
                                                            return (
                                                                <EditorQuestionsComponent
                                                                    key={component.id}
                                                                    backgroundColor={snapshot.isDragging ? "blue.200" : "red.200"}
                                                                    elementid={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    id={component.id}
                                                                    title={component.title}
                                                                    index={index}
                                                                    isSelected={selectedItem === component.id}
                                                                    selectedItem={selectedItem}
                                                                    actions={component.questions}
                                                                />
                                                            )
                                                        } else {
                                                            // //    TODO Implement other types
                                                            return (
                                                                <EditorBasicComponent
                                                                    key={component.id}
                                                                    backgroundColor={snapshot.isDragging ? "blue.200" : "red.200"}
                                                                    elementid={component.id}
                                                                    onClick={((e) => handleSelect(e))}
                                                                    id={component.id}
                                                                    title={component.title}
                                                                    index={index}
                                                                    isSelected={selectedItem === component.id}
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
                                // defaultIndex={1}
                                minH="900px"
                            >
                                <TabList>
                                    <Tab fontWeight="bold" color="gray.400">Inspector</Tab>
                                    <Tab fontWeight="bold" color="gray.400">Components</Tab>
                                </TabList>

                                <TabPanels minW="350px">

                                    {/* Inspector Tab */}
                                    <TabPanel>
                                        {/* ########### Inspector Items ########### */}
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
                                                    <InspectorItemSelector
                                                        key={selectedObject.id}
                                                        droppableId="actionList"
                                                        itemList={finalActionList}
                                                        type="action"
                                                        headline="Action Types"
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
                                            <Box borderRadius="md" border="1px dashed" borderColor="gray.200" p={2}>
                                                <Text fontSize="sm" fontWeight="500" color="gray.400">
                                                    No components selected. Click on a component to select it.
                                                </Text>
                                            </Box>
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