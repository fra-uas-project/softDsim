import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
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
    useToast,
    VStack
} from "@chakra-ui/react";
import {HiChevronRight} from "react-icons/hi";
import {RiDragDropLine} from "react-icons/ri";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import EditorListComponent from "../components/ScenarionStudio/Editor/EditorQuestionsComponent";
import ComponentTab from "../components/ScenarionStudio/ComponentTab/ComponentTab";
import QuestionInspectorForm from "../components/ScenarionStudio/InspectorTab/QuestionInspectorForm";
import BaseInspectorForm from "../components/ScenarionStudio/InspectorTab/BaseInspectorForm";
import QuestionsInspectorForm from "../components/ScenarionStudio/InspectorTab/QuestionsInspectorForm";
import EditorBaseComponent from "../components/ScenarionStudio/Editor/EditorBaseComponent";
import FragmentInspectorForm from "../components/ScenarionStudio/InspectorTab/FragmentInspectorForm";
import ActionInspectorForm from "../components/ScenarionStudio/InspectorTab/ActionInspectorForm";
import InspectorEmtpy from "../components/ScenarionStudio/InspectorTab/InspectorEmtpy";
import EventInspectorForm from "../components/ScenarionStudio/InspectorTab/EventInspectorForm";
import ModelSelectionInspectorForm from "../components/ScenarionStudio/InspectorTab/ModelSelectionInspectorForm";
import {getCookie} from "../utils/utils";
import {
    componentEnum,
    finalActionList,
    finalComponentList,
    finalQuestionList,
    questionEnum,
    tabIndexEnum
} from "../components/ScenarionStudio/scenarioStudioData";

const ScenarioStudio = () => {

    const HEIGHT = "900px";
    const toast = useToast();

    const [tabIndex, setTabIndex] = useState(1);
    const [editorList, updateEditorList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedObject, setSelectedObject] = useState(null);

    const saveScenarioTemplate = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(editorList)
            })
            await res.json();
            toast({
                title: `Scenario Template has been saved`,
                status: 'success',
                duration: 5000,
            });
        } catch (e) {
            toast({
                title: `Could not save Scenario Template`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    };

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
    }, [selectedItem]);

    useEffect(() => {
        console.log(editorList)
        console.log("SO", selectedObject)
    }, [selectedItem, editorList, selectedObject])

    return (
        <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
            <Breadcrumb spacing='8px' separator={<HiChevronRight color='gray.500'/>}>
                <BreadcrumbItem>
                    <BreadcrumbLink href=''>Scenarios Studio</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <HStack justifyContent="space-between" mr={3}>
                <Heading>Scenario Studio</Heading>
                <Button variant="solid" colorScheme="blue" onClick={saveScenarioTemplate}>Save Template</Button>
            </HStack>
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