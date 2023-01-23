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
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    UnorderedList,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import {HiChevronRight, HiOutlineTrash} from "react-icons/hi";
import {RiDragDropLine} from "react-icons/ri";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import React, {useEffect, useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import EditorListComponent from "../components/ScenarionStudio/Editor/EditorListComponent";
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
import {getCookie, iconMap} from "../utils/utils";
import {
    componentEnum,
    finalActionList,
    finalComponentList,
    finalQuestionList,
    questionEnum,
    tabIndexEnum
} from "../components/ScenarionStudio/scenarioStudioData";
import {useImmer} from "use-immer";
import ScenarioStudioAlert from "../components/ScenarionStudio/ScenarioStudioAlert";
import {editorListSchema, validationErrorTypes} from "../components/ScenarionStudio/scenarioValidation";
import ValidationTab from "../components/ScenarionStudio/ValidationTab/ValidationTab";

const ScenarioStudio = () => {
    const toast = useToast();

    const [tabIndex, setTabIndex] = useState(tabIndexEnum.COMPONENTS);
    const [editorList, updateEditorList] = useImmer([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [currentTemplateId, setCurrentTemplateId] = useState("");
    const [oldTemplateId, setOldTemplateId] = useState("");

    const [templateScenarios, setTemplateScenarios] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const [validationErrors, setValidationErrors] = useState([]);
    const [validationEnabled, setValidationEnabled] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isPublishedOpen, onOpen: onPublishedOpen, onClose: onPublishedClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const cancelRef = useRef();

    const selectComponent = (id) => {
        const component = editorList.find(component => component.id === id)

        const fragmentList = editorList.filter(component => component.type === componentEnum.FRAGMENT)
        let actions = []
        for (const fragment of fragmentList) {
            actions = [...actions, ...fragment.actions]
        }
        const action = actions.find(action => action.id === id)

        const questionsList = editorList.filter(component => component.type === componentEnum.QUESTIONS)
        let questions = []
        for (const questionsListElement of questionsList) {
            questions = [...questions, ...questionsListElement.questions]
        }
        const question = questions.find(question => question.id === id)

        if (component) {
            return component
        } else if (action) {
            return action
        } else if (question) {
            return question
        }
    }
    const selectedObject = selectComponent(selectedObjectId)

    const saveScenarioTemplate = async (scenarioId) => {
        if (editorList.length === 0) {
            return
        }

        try {
            await saveScenarioTemplateApiCall(scenarioId)

            toast({
                title: `Scenario has been saved`,
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

    // TODO create a scenario_template_service and store all the api call logic in methods
    const saveScenarioTemplateApiCall = async (scenarioId) => {
        if (scenarioId === "") {
            // Save new scenario
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/studio/template-scenario`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: stringify(editorList)
            })

            const response = await res.json()
            setCurrentTemplateId(response.data.id)
            return response.data.id

        } else {
            // Overwrite existing scenario
            await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/studio/template-scenario/${scenarioId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: stringify(editorList)
            })
            return scenarioId
        }
    };

    const publishScenarioTemplate = async (scenarioId) => {
        await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario/from-studio?studio_template_id=${scenarioId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
    };

    const saveAndPublishScenarioTemplate = async (scenarioId) => {
        if (editorList.length === 0) {
            return
        }

        try {
            validateScenario(editorList)
            if(!validationErrors.some(error => error.error.type === validationErrorTypes.ERROR) &&
                !validationErrors.some(error => error.error.type === validationErrorTypes.INTERNAL_ERROR)){
            //     todo implement toast etc if not valid scenario
            }
        } catch (e) {
            toast({
                title: `Could not validate Scenario Template`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }

        try {
            scenarioId = await saveScenarioTemplateApiCall(scenarioId)
        } catch (e) {
            toast({
                title: `Could not save Scenario Template`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }

        try {
             // check if also a new scenario id is published
             await publishScenarioTemplate(scenarioId)

            toast({
                title: `Scenario '${scenarioId}' has been published`,
                status: 'success',
                duration: 5000,
            });
        } catch (e) {
            toast({
                title: `Could not publish Scenario Template`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    }

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
            if (movedItemCopy.type === componentEnum.BASE) {
                movedItemCopy.template_name += ` ${uuidv4().slice(0, 8)}`
            } else {
                movedItemCopy.displayName += ` ${uuidv4().slice(0, 8)}`
            }
            editorListItems.splice(result.destination.index, 0, movedItemCopy);
            updateEditorList(editorListItems);

            setSelectedObjectId(movedItemCopy.id)

            // moving from action list to fragment in editor
        } else if (result.source.droppableId === "actionList") {
            const actionListItems = Array.from(finalActionList);
            const [movedAction] = actionListItems.splice(result.source.index, 1);

            // copy because item needs to be unique
            let movedActionCopy = {...movedAction};
            movedActionCopy.id = uuidv4();

            updateEditorList((draft) => {
                const fragmentComponent = draft.find(fragmentComponent => fragmentComponent.id === result.destination.droppableId)
                fragmentComponent.actions.splice(result.destination.index, 0, movedActionCopy)
            })

            // Reorder actions in same list
        } else if (result.type === "action" && result.source.droppableId === result.destination.droppableId) {
            updateEditorList((draft) => {
                const fragmentComponent = draft.find(fragmentComponent => fragmentComponent.id === result.source.droppableId)
                const [reorderedAction] = fragmentComponent.actions.splice(result.source.index, 1);
                fragmentComponent.actions.splice(result.destination.index, 0, reorderedAction)
            })

            // Remove from one action list and add to another
        } else if (result.type === "action" && result.source.droppableId !== result.destination.droppableId) {
            updateEditorList((draft) => {
                // Remove from source action list
                const sourceFragmentComponent = draft.find(fragmentComponent => fragmentComponent.id === result.source.droppableId)
                const [reorderedAction] = sourceFragmentComponent.actions.splice(result.source.index, 1);

                // Add to destination action list
                const destinationFragmentComponent = draft.find(fragmentComponent => fragmentComponent.id === result.destination.droppableId)
                destinationFragmentComponent.actions.splice(result.destination.index, 0, reorderedAction);
            })
        }

        // moving from question list to questions component in editor
        else if (result.source.droppableId === "questionList") {
            // copy because item needs to be unique
            const questionsListItems = Array.from(finalQuestionList);
            const [movedQuestion] = questionsListItems.splice(result.source.index, 1);
            let movedQuestionCopy = {...movedQuestion};
            movedQuestionCopy.id = uuidv4();
            movedQuestionCopy.displayName += ` ${uuidv4().slice(0, 8)}`;

            updateEditorList((draft) => {
                const questionsComponent = draft.find(questionsComponent => questionsComponent.id === result.destination.droppableId)
                questionsComponent.questions.splice(result.destination.index, 0, movedQuestionCopy)
            })

            setSelectedObjectId(movedQuestionCopy.id)
        }

        // Reorder questions in same list
        else if (result.type === "question" && result.source.droppableId === result.destination.droppableId) {
            updateEditorList((draft) => {
                const questionsComponent = draft.find(component => component.id === result.source.droppableId)
                const [reorderedAction] = questionsComponent.questions.splice(result.source.index, 1);
                questionsComponent.questions.splice(result.destination.index, 0, reorderedAction)
            })

            // Remove from one question list and add to another
        } else if (result.type === "question" && result.source.droppableId !== result.destination.droppableId) {
            updateEditorList((draft) => {
                // Remove from source questions list
                const sourceQuestionsComponent = draft.find(component => component.id === result.source.droppableId)
                const [reorderedAction] = sourceQuestionsComponent.questions.splice(result.source.index, 1);

                // Add to destination questions list
                const destinationQuestionsComponent = draft.find(component => component.id === result.destination.droppableId)
                destinationQuestionsComponent.questions.splice(result.destination.index, 0, reorderedAction);
            })
        }

        console.log(result)
    };

    const handleSelect = (e) => {
        setTabIndex(tabIndexEnum.INSPECTOR)

        const component = editorList.find(component => component.id === e.currentTarget.getAttribute("elementid"))

        const fragmentList = editorList.filter(component => component.type === componentEnum.FRAGMENT)
        let actions = []
        for (const fragment of fragmentList) {
            actions = [...actions, ...fragment.actions]
        }
        const action = actions.find(action => action.id === e.currentTarget.getAttribute("elementid"))

        const questionsList = editorList.filter(component => component.type === componentEnum.QUESTIONS)
        let questions = []
        for (const questionsListElement of questionsList) {
            questions = [...questions, ...questionsListElement.questions]
        }
        const question = questions.find(question => question.id === e.currentTarget.getAttribute("elementid"))

        if (component) {
            setSelectedObjectId(component.id)
        } else if (action) {
            setSelectedObjectId(action.id)
        } else if (question) {
            setSelectedObjectId(question.id)
        }
    }

    const handleTabsChange = (index) => {
        setTabIndex(index)
    };

    const handleEditorBackgroundClick = (e) => {
        // Deactivated because when dropping action in different list it switched to components tab
        // if (e.target.getAttribute("elementid") === "backgroundList") {
        //     setTabIndex(tabIndexEnum.COMPONENTS)
        //     setSelectedObjectId(null)
        // }
    };

    const loadScenarioTemplate = async (scenarioId) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/studio/template-scenario-is-published-validator?scenario_id=${scenarioId}`, {
                method: 'GET',
                credentials: 'include',
            })
            const isPublished = await res.json();

            setOldTemplateId(currentTemplateId)
            setCurrentTemplateId(scenarioId)

            if (isPublished.data) {
                onPublishedOpen()
            } else {
                await loadScenario(scenarioId)
            }
        } catch (e) {
            toast({
                title: `Could not load scenario template for id '${scenarioId}'. Please try again.`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    };

    const loadScenario = async (scenarioId) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/studio/template-scenario/${scenarioId}`, {
                method: 'GET',
                credentials: 'include',
            })
            const fetchedScenarioTemplate = await res.json();
            const scenario = loadIcons(fetchedScenarioTemplate.data.scenario)
            updateEditorList(scenario)
        } catch (e) {
            toast({
                title: `Could not load selected scenario template. Please try again.`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    };

    const duplicateScenario = async (scenarioId) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/studio/template-scenario?clone=${scenarioId}`, {
                method: 'POST',
                credentials: 'include',
            })
            const scenarioTemplateClone = await res.json();
            const scenario = loadIcons(scenarioTemplateClone.data.scenario)
            updateEditorList(scenario)
            setOldTemplateId(currentTemplateId)
            setCurrentTemplateId(scenarioTemplateClone.data.id)
        } catch (e) {
            toast({
                title: `Could not load selected scenario template. Please try again.`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    };

    const deleteScenario = async (scenarioId) => {
        try {
            await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/studio/template-scenario/${scenarioId}`, {
                method: 'DELETE',
                credentials: 'include',
            })

            await fetchScenarioTemplates()

            // if current scenario template got deleted, clean workspace
            if (scenarioId === currentTemplateId) {
                setOldTemplateId(scenarioId)
                setCurrentTemplateId("")
                updateEditorList([])
            }

            toast({
                title: `Scenario '${getScenarioName(scenarioId)}' has been deleted.`,
                status: 'success',
                duration: 5000,
            });
        } catch (e) {
            toast({
                title: `Could not delete scenario. Please try again.`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    };

    const fetchScenarioTemplates = async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/studio/template-scenario`, {
                method: 'GET',
                credentials: 'include',
            })
            const fetchedScenarioTemplates = await res.json();

            let templateScenarios = []

            for (const templateScenario of fetchedScenarioTemplates.data) {
                const templateDto = {
                    scenarioId: templateScenario.id,
                    name: templateScenario.scenario.find(scenario => scenario.type === "BASE").template_name
                }
                templateScenarios.push(templateDto)
            }
            setTemplateScenarios(templateScenarios)
            setIsLoading(false)
        } catch (e) {
        toast({
            title: `Could not fetch scenario templates. Please try again.`,
            status: 'error',
            duration: 5000,
        });
        console.log(e);
        }
    };

    const resetScenarioStudio = () => {
        updateEditorList([]);
        setCurrentTemplateId("");
    };

    const getScenarioName = (scenarioId) => {
        const scenario = templateScenarios.find(scenario => scenario.scenarioId === scenarioId)
        return scenario?.name
    };

    // Custom stringify to persist icon function as string
    const stringify = (editorList) => {
        return JSON.stringify(editorList, (key, value) => {
            if (key === "icon") {
                return value.name.toString()
            }
            return value
        })
    };

    const loadIcons = (editorList) => {
        for (const component of editorList) {
            deepSearch(component)
        }
        return editorList
    };
    const deepSearch = (component) => {
        if (typeof component === 'object') {
            for (let key in component) {
                if (typeof component[key] === 'object') {
                    deepSearch(component[key]);
                } else {
                    if (key === 'icon') {
                        component[key] = iconMap[component.icon]
                    }
                }
            }
        }
    };

    const validateScenario = async (editorList) => {
        try {
            await editorListSchema.validate(editorList, {abortEarly: false})
            // If no validation errors found, clear all previous
            setValidationErrors([])
        } catch (e) {
            setValidationErrors([])
            const allErrors = e.inner
            // allErrors.sort((a, b) => a.type.localeCompare(b.type))

            console.log(allErrors)

            setValidationErrors(allErrors)
        }

    }

    // If item is selected, switch to inspector tab
    useEffect(() => {
        if (selectedObject) {
            setTabIndex(tabIndexEnum.INSPECTOR);
        } else {
            setTabIndex(tabIndexEnum.COMPONENTS);
        }
    }, [selectedObject]);

    useEffect(() => {
        console.log(editorList)
        console.log("SO", selectedObject)
    }, [editorList, selectedObject])

    useEffect(() => {
        if(validationEnabled) {
            validateScenario(editorList)
        }
    }, [editorList, validationEnabled])

    useEffect(() => {
        if(!validationEnabled) {
            setValidationErrors([])
        }
    }, [validationEnabled])

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Scenarios</ModalHeader>
                    <ModalCloseButton onClick={() => {setTemplateScenarios([])}}/>
                    <ModalBody>
                        {isLoading ?
                            <Flex w="full" justifyContent="center" alignItems="center">
                                <Spinner size='xl'/>
                            </Flex> :
                        <TableContainer overflowY="auto" maxH="60vh">
                            <Table variant='simple' size="lg">
                                <Thead>
                                    <Tr>
                                        <Th color="gray.400">Scenario Id</Th>
                                        <Th color="gray.400">scenario Name</Th>
                                        <Th color="gray.400">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {templateScenarios.map((template, index) => {
                                        return <Tr key={index}>
                                            <Td fontWeight="500">{template.scenarioId}</Td>
                                            <Td fontWeight="500">{template.name}</Td>
                                            <Td fontWeight="500">
                                                <HStack gap={3}>
                                                <Button
                                                    variant='solid'
                                                    colorScheme='blue'
                                                    aria-label='Load scenario'
                                                    onClick={() => {
                                                        loadScenarioTemplate(template.scenarioId)
                                                        onClose()
                                                    }
                                                    }
                                                >
                                                    Load
                                                </Button>
                                                <IconButton
                                                    variant='ghost'
                                                    colorScheme='black'
                                                    aria-label='Delete scenario'
                                                    fontSize='20px'
                                                    icon={<HiOutlineTrash />}
                                                    onClick={() => {
                                                        onDeleteOpen()
                                                        setCurrentTemplateId(template.scenarioId)
                                                        }
                                                    }
                                                />
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        }
                    </ModalBody>
                    <ModalFooter gap={5}>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Flex px={10} pt={2} flexDir="column" flexGrow={1}>
                <Breadcrumb spacing='8px' separator={<HiChevronRight color='gray.500'/>}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href=''>Scenarios Studio</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <HStack justifyContent="space-between" mr={3}>
                    <Heading>Scenario Studio</Heading>
                    <HStack gap={2}>
                        <Button variant="outline"
                                colorScheme="blue"
                                onClick={() => {
                                    if (editorList.length === 0) {

                                    } else {
                                        onCreateOpen()
                                    }
                                }}>
                            Create new
                        </Button>
                        <Button variant="outline"
                                colorScheme="blue"
                                onClick={() => {
                                    validateScenario(editorList)
                                }
                                }>
                            Test
                        </Button>
                        <Button variant="outline"
                                colorScheme="blue"
                                onClick={() => {
                                    fetchScenarioTemplates()
                                    onOpen()
                                }
                                }>
                            Load
                        </Button>
                        <Button variant="outline"
                                colorScheme="blue"
                                onClick={() => {saveScenarioTemplate(currentTemplateId)}}>
                            Save
                        </Button>
                        <Button variant="solid"
                                colorScheme="blue"
                                onClick={() => {saveAndPublishScenarioTemplate(currentTemplateId)}}>
                                    Save and Publish
                        </Button>
                    </HStack>
                </HStack>
                <Box h={5}></Box>
                <Box backgroundColor="#EDF2F7" borderRadius="2xl" minH="70vh" maxH="73vh">
                    <HStack w="full" h="full" overflow="hidden" pt={2} spacing={5}
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
                                                       flexGrow="1"
                                                       elementid="backgroundList"
                                        >
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
                                                                        isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                                    />
                                                                )
                                                            } else if (component.type === componentEnum.FRAGMENT) {
                                                                return (
                                                                    <EditorListComponent
                                                                        key={component.id}
                                                                        elementid={component.id}
                                                                        onClick={((e) => handleSelect(e))}
                                                                        id={component.id}
                                                                        index={index}
                                                                        component={component}
                                                                        droppableType="action"
                                                                        isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                                        selectedItem={selectedObject?.id}
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
                                                                        isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                                        selectedItem={selectedObject?.id}
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
                                                                        isSelected={selectedObject ? selectedObject?.id === component.id : false}
                                                                    />
                                                                )
                                                            } else {
                                                                return (
                                                                    <EditorBaseComponent
                                                                        key={component.id}
                                                                        onClick={((e) => handleSelect(e))}
                                                                        index={index}
                                                                        component={component}
                                                                        isSelected={selectedObject ? selectedObject?.id === component.id : false}
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
                                                        <Text pointerEvents="none" fontSize="xl" mt="20px">(Create a
                                                            complex
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
                                        <Tab fontWeight="bold" color="gray.400">Validation</Tab>
                                    </TabList>

                                    {/* h = full height - tab header */}
                                    <TabPanels minW="350px" h="650px" overflowY="auto">
                                        <TabPanel height="full">
                                            {/* Inspector Items */}
                                            {selectedObject ?
                                                <VStack alignItems="flex-start" pt={2}>
                                                    {selectedObject?.type === componentEnum.BASE &&
                                                        <BaseInspectorForm
                                                            key={selectedObject.id}
                                                            baseData={selectedObject}
                                                            updateEditorList={updateEditorList}
                                                            setSelectedObject={setSelectedObjectId}
                                                            validationErrors={validationErrors.filter(error => error.params.component.type === componentEnum.BASE)}
                                                        />
                                                    }

                                                    {selectedObject?.type === componentEnum.QUESTIONS &&
                                                        <QuestionsInspectorForm
                                                            key={selectedObject.id}
                                                            finalQuestionList={finalQuestionList}
                                                            questionsData={selectedObject}
                                                            updateEditorList={updateEditorList}
                                                            setSelectedObject={setSelectedObjectId}
                                                            validationErrors={validationErrors.filter(error => error.params.component.type === componentEnum.QUESTIONS)}
                                                        />
                                                    }

                                                    {selectedObject?.type === componentEnum.FRAGMENT &&
                                                        <FragmentInspectorForm
                                                            key={selectedObject.id}
                                                            finalActionList={finalActionList}
                                                            fragmentData={selectedObject}
                                                            updateEditorList={updateEditorList}
                                                            setSelectedObject={setSelectedObjectId}
                                                            validationErrors={validationErrors.filter(error => error.params.component.type === componentEnum.FRAGMENT)}
                                                        />
                                                    }

                                                    {selectedObject?.type === componentEnum.EVENT &&
                                                        <EventInspectorForm
                                                            key={selectedObject.id}
                                                            eventData={selectedObject}
                                                            updateEditorList={updateEditorList}
                                                            setSelectedObject={setSelectedObjectId}
                                                            validationErrors={validationErrors.filter(error => error.params.component.type === componentEnum.EVENT)}
                                                        />
                                                    }

                                                    {selectedObject?.type === componentEnum.MODELSELECTION &&
                                                        <ModelSelectionInspectorForm
                                                            key={selectedObject.id}
                                                            modelSelectionData={selectedObject}
                                                            updateEditorList={updateEditorList}
                                                            setSelectedObject={setSelectedObjectId}
                                                            validationErrors={validationErrors.filter(error => error.params.component.type === componentEnum.MODELSELECTION)}
                                                        />
                                                    }

                                                    {selectedObject?.type === "ACTION" &&
                                                        <ActionInspectorForm
                                                            key={selectedObject.id}
                                                            actionData={selectedObject}
                                                            updateEditorList={updateEditorList}
                                                            setSelectedObject={setSelectedObjectId}
                                                        />
                                                    }

                                                    {(selectedObject?.type === questionEnum.SINGLE || selectedObject?.type === questionEnum.MULTI) &&
                                                        <QuestionInspectorForm
                                                            /* key = answers to trigger rerender on answer change*/
                                                            key={selectedObject.answers + selectedObject.id}
                                                            questionData={selectedObject}
                                                            updateEditorList={updateEditorList}
                                                            setSelectedObject={setSelectedObjectId}
                                                            validationErrors={validationErrors.filter(
                                                                error => error.params.component.type === questionEnum.SINGLE ||
                                                                    error.params.component.type === questionEnum.MULTI ||
                                                                    error.params.component.type === "ANSWER"
                                                            )}
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
                                        <TabPanel pb={0} pt={0}>
                                            <ComponentTab
                                                finalComponentList={finalComponentList}
                                            />
                                        </TabPanel>

                                        <TabPanel pb={0} pt={0}>
                                            <ValidationTab
                                                validationErrors={validationErrors}
                                                handleSelect={handleSelect}
                                                validationEnabled={validationEnabled}
                                                setValidationEnabled={setValidationEnabled}
                                                setTabIndex={setTabIndex}
                                            />
                                        </TabPanel>

                                    </TabPanels>
                                </Tabs>
                            </Box>
                        </DragDropContext>
                    </HStack>
                </Box>
            </Flex>

            <ScenarioStudioAlert
                isOpen={isCreateOpen}
                cancelRef={cancelRef}
                onClose={onCreateClose}
                title="Create new scenario"
                text="All changes are discarded if you haven't saved your scenario.
                            Are you sure that you want to continue? You can't undo this action afterwards."
                onCancel={onCreateClose}
                continueButtonColor="blue"
                onContinueButtonClick={() => {
                    resetScenarioStudio()
                    onCreateClose()
                    }
                }
            />

            <ScenarioStudioAlert
                isOpen={isPublishedOpen}
                cancelRef={cancelRef}
                onClose={onPublishedClose}
                title="Duplicate scenario"
                text="The selected scenario is already published. You cannot edit a published scenario, but you can create a duplicate. Do you want to continue?"
                onCancel={() => {
                    setCurrentTemplateId(oldTemplateId)
                    onPublishedClose()
                    }
                }
                continueButtonColor="blue"
                onContinueButtonClick={() => {
                    onPublishedClose()
                    duplicateScenario(currentTemplateId)
                    }
                }
            />

            <ScenarioStudioAlert
                isOpen={isDeleteOpen}
                cancelRef={cancelRef}
                onClose={onDeleteClose}
                title="Delete scenario "
                text={`Do you want to delete scenario '${getScenarioName(currentTemplateId)}'? You can't undo this action afterwards.`}
                onCancel={() => {
                    setCurrentTemplateId(oldTemplateId)
                    onDeleteClose()
                }
                }
                continueButtonColor="red"
                continueButtonName="Delete"
                onContinueButtonClick={() => {
                    onDeleteClose()
                    deleteScenario(currentTemplateId)
                }
                }
            />
        </>
    )
};

export default ScenarioStudio