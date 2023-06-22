import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Flex,
    Heading,
    HStack,
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
    Tag,
    TagLabel,
    TagLeftIcon,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {HiChevronRight, HiOutlineCheck, HiOutlineTrash, HiOutlineX} from "react-icons/hi";
import {RiArrowGoBackLine, RiArrowGoForwardLine} from "react-icons/ri";
import {DragDropContext} from "react-beautiful-dnd";
import React, {useEffect, useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import _ from "lodash";
import ComponentTab from "../components/ScenarionStudio/ComponentTab/ComponentTab";
import {getCookie, iconMap} from "../utils/utils";
import {
    componentEnum,
    editorListHistoryStates,
    editorListStates,
    finalActionList,
    finalComponentList,
    finalQuestionList,
    tabIndexEnum
} from "../components/ScenarionStudio/scenarioStudioData";
import {useImmer} from "use-immer";
import ScenarioStudioAlert from "../components/ScenarionStudio/ScenarioStudioAlert";
import {editorListSchema, validationErrorTypes} from "../components/ScenarionStudio/scenarioValidation";
import ValidationTab from "../components/ScenarionStudio/ValidationTab/ValidationTab";
import {useDidMountEffect, usePrompt} from "../utils/customHooks";
import Editor from "../components/ScenarionStudio/Editor/Editor";
import InspectorTab from "../components/ScenarionStudio/InspectorTab/InspectorTab";

const ScenarioStudio = () => {
    const toast = useToast();

    const [tabIndex, setTabIndex] = useState(tabIndexEnum.COMPONENTS);
    const [editorList, updateEditorList] = useImmer([]);
    const [savedEditorList, setSavedEditorList] = useState(editorList);
    const [editorListState, setEditorListState] = useState(editorListStates.UNCHANGED)

    const [editorListHistory, setEditorListHistory] = useState({
            past: [],
            current: editorList,
            future: []
        }
    )
    window.value = window.value + 10;
    const [editorListHistoryState, setEditorListHistoryState] = useState(editorListHistoryStates.LOG_HIST);

    const [selectedObjectId, setSelectedObjectId] = useState(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState(""); // selected template in modals to load and delete template
    const [currentTemplateId, setCurrentTemplateId] = useState("");

    const [templateScenarios, setTemplateScenarios] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const [validationErrors, setValidationErrors] = useState([]);
    const [validationEnabled, setValidationEnabled] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isPublishedOpen, onOpen: onPublishedOpen, onClose: onPublishedClose } = useDisclosure();
    const { isOpen: isNotSavedOpen, onOpen: onNotSavedOpen, onClose: onNotSavedClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const cancelRef = useRef();

    const editorListIsSaved = _.isEqual(editorList, savedEditorList);

    usePrompt( 'You have unsaved changes. Do you really want to leave the Scenario Studio?', editorListState === editorListStates.MODIFIED );

    const undo = () => {
        setEditorListHistory(prevEditorListHistory => {
            setEditorListHistoryState(editorListHistoryStates.UNDO_REDO)
            const {past, current, future} = prevEditorListHistory;
            const previous = past[past.length - 1]
            updateEditorList(previous)
            return {
                past: past.slice(0, past.length - 1),
                current: previous,
                future: [current, ...future]
            }
        })
    }

    const redo = () => {
        setEditorListHistory(prevEditorListHistory => {
            setEditorListHistoryState(editorListHistoryStates.UNDO_REDO)
            const {past, current, future} = prevEditorListHistory;
            const next = future[0]
            updateEditorList(next)
            return {
                past: [...past, current],
                current: next,
                future: future.slice(1)
            }
        })
    }

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
            toast({
                title: `Add minimum one component to save a scenario`,
                status: 'info',
                duration: 3000,
            });
            return
        }

        try {
            const res = await saveScenarioTemplateApiCall(scenarioId)

            if(!res) {
                toast({
                    title: `An unexpected error occured`,
                    description: "Please try again or ask for help",
                    status: 'error',
                    duration: 5000,
                });
            }

        } catch (e) {
            toast({
                title: `Could not save Scenario Template`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    };

    const saveScenarioTemplateApiCall = async (scenarioId) => {
        if (!scenarioId) {
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
            setEditorListState(editorListStates.SAVED)
            setSavedEditorList(editorList)
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
            setEditorListState(editorListStates.SAVED)
            return scenarioId
        }
    };

    const publishScenarioTemplate = async (scenarioId) => {
        const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/template-scenario/from-studio?studio_template_id=${scenarioId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
        return res
    };

    const saveAndPublishScenarioTemplate = async (scenarioId) => {
        if (editorList.length === 0) {
            toast({
                title: `Empty scenario cannot be published`,
                status: 'info',
                duration: 3000,
            });
            return
        }

        try {
            scenarioId = await saveScenarioTemplateApiCall(scenarioId)
        } catch (e) {
            toast({
                title: `An error occurred`,
                description: `Could not save scenario. Please try again or ask for help.`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
            return
        }

        try {
            const res = await validateScenario(editorList)
            if(res.some(error => error.type === validationErrorTypes.ERROR) ||
                res.some(error => error.type === validationErrorTypes.INTERNAL_ERROR)){
                if(!validationEnabled) {
                    setValidationErrors([])
                }
                toast({
                    title: `Abort publishing`,
                    description: "Scenario saved, but invalid.",
                    status: 'error',
                    duration: 5000,
                });
                return
            } else {
                if(!validationEnabled) {
                    setValidationErrors([])
                }
            }
        } catch (e) {
            toast({
                title: `An unexpected error occurred`,
                description: `Please try again or ask for help.`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
            return
        }

        try {
             // check if also a new scenario id is published
            const res = await publishScenarioTemplate(scenarioId)
            if(res.status === 200) {
                toast({
                    title: `Scenario has been published`,
                    status: 'success',
                    duration: 5000,
                });
            } else {
                toast({
                    title: `Could not publish Scenario`,
                    description: `Please try again or ask for help.`,
                    status: 'error',
                    duration: 5000,
                });
            }
        } catch (e) {
            toast({
                title: `An unexpected error occurred`,
                description: `Please try again or ask for help.`,
                status: 'error',
                duration: 5000,
            });
            console.log(e);
        }
    }

    const handleOnDragEnd = (result) => {

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

            if(movedItem.type === componentEnum.BASE && editorList.find(component => component.type === componentEnum.BASE)) {
            //     Check if base component already in editorList
                toast({
                    title: `Only one Simulation Base Information allowed`,
                    status: 'warning',
                    duration: 3000,
                });
            } else {
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
            }

            // moving from action list to fragment in editor
        } else if (result.source.droppableId === "actionList") {
            const actionListItems = Array.from(finalActionList);
            const [movedAction] = actionListItems.splice(result.source.index, 1);

            // Check if action already exists in action list of target simulation fragment
            const fragmentComponent = editorList.find(fragmentComponent => fragmentComponent.id === result.destination.droppableId)
            if(fragmentComponent.actions.find(action => action.action === movedAction.action)) {
                toast({
                    title: `${movedAction.title} already in action list`,
                    status: 'warning',
                    duration: 3000,
                });
            } else {
                // copy because item needs to be unique
                let movedActionCopy = {...movedAction};
                movedActionCopy.id = uuidv4();

                updateEditorList((draft) => {
                    const fragmentComponent = draft.find(fragmentComponent => fragmentComponent.id === result.destination.droppableId)
                    fragmentComponent.actions.splice(result.destination.index, 0, movedActionCopy)
                })
                setSelectedObjectId(movedActionCopy.id)
            }

            // Reorder actions in same list
        } else if (result.type === "action" && result.source.droppableId === result.destination.droppableId) {
            updateEditorList((draft) => {
                const fragmentComponent = draft.find(fragmentComponent => fragmentComponent.id === result.source.droppableId)
                const [reorderedAction] = fragmentComponent.actions.splice(result.source.index, 1);
                fragmentComponent.actions.splice(result.destination.index, 0, reorderedAction)
            })

            // Remove from one action list and add to another
        } else if (result.type === "action" && result.source.droppableId !== result.destination.droppableId) {

            const sourceFragmentComponent = editorList.find(fragmentComponent => fragmentComponent.id === result.source.droppableId)
            const [reorderedAction] = sourceFragmentComponent.actions.slice(result.source.index, result.source.index + 1);
            const destinationFragmentComponent = editorList.find(fragmentComponent => fragmentComponent.id === result.destination.droppableId)

            // Check if action already exists in action list of target simulation fragment
            if(destinationFragmentComponent.actions.find(action => action.action === reorderedAction.action)) {
                toast({
                    title: `${reorderedAction.title} already in action list`,
                    status: 'warning',
                    duration: 3000,
                });
            } else {
                updateEditorList((draft) => {
                    // Remove from source action list
                    const sourceFragmentComponent = draft.find(fragmentComponent => fragmentComponent.id === result.source.droppableId)
                    const [reorderedAction] = sourceFragmentComponent.actions.splice(result.source.index, 1);

                    // Add to destination action list
                    const destinationFragmentComponent = draft.find(fragmentComponent => fragmentComponent.id === result.destination.droppableId)
                    destinationFragmentComponent.actions.splice(result.destination.index, 0, reorderedAction);
                })
            }
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
        // console.log("e", e)
        // if (e.target.getAttribute("elementid") === "backgroundList") {
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

            setCurrentTemplateId(scenarioId)
            setSelectedTemplateId(scenarioId)

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
            setEditorListHistoryState(editorListHistoryStates.RESET)
            updateEditorList(scenario)
            setSavedEditorList(scenario)
            onClose()
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
            setSavedEditorList(scenario)
            setSelectedTemplateId("")
            setCurrentTemplateId(scenarioTemplateClone.data.id)
            onClose()
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
                setCurrentTemplateId("")
                setSelectedTemplateId("")
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
                    name: templateScenario?.scenario?.find(scenario => scenario.type === "BASE")?.template_name
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
        setEditorListHistoryState(editorListHistoryStates.RESET)
        updateEditorList([]);
        setSavedEditorList([]);
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
            return []
        } catch (e) {
            setValidationErrors([])
            const allErrors = e.inner
            allErrors.sort((a, b) => a.path.localeCompare(b.path))

            console.log(allErrors)

            setValidationErrors(allErrors)
            return allErrors
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
        if (editorList.length === 0) {
            setEditorListState(editorListStates.UNCHANGED)
        }
        else {
            if(editorListIsSaved) {
                setEditorListState(editorListStates.SAVED)
            } else {
                setEditorListState(editorListStates.MODIFIED)
            }
        }
    }, [editorList, editorListIsSaved])

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

    useDidMountEffect(() => {
        if (editorListHistoryState === editorListHistoryStates.LOG_HIST) {
            setEditorListHistory(prevEditorListHistory => (
                {
                    past: [...prevEditorListHistory.past.slice(-500), prevEditorListHistory.current],
                    current: editorList,
                    future: []
                }
            ))
        } else if (editorListHistoryState === editorListHistoryStates.RESET) {
            setEditorListHistory({
                past: [],
                current: editorList,
                future: []
            })
            setEditorListHistoryState(editorListHistoryStates.LOG_HIST)
        } else {
            // when UNDO_REDO
            setEditorListHistoryState(editorListHistoryStates.LOG_HIST)
        }

    }, [editorList])


    // Following useEffects are used only for debugging
    // useEffect(() => {
    //     console.log("editorLHist", editorListHistory)
    // }, [editorListHistory])
    //
    // useEffect(() => {
    //     console.log("curr", currentTemplateId)
    // }, [currentTemplateId])
    //
    // useEffect(() => {
    //     console.log("selected", selectedTemplateId)
    // }, [selectedTemplateId])

    // useEffect(() => {
    //     console.log("editorListState", editorListState)
    // }, [editorListState])

    useEffect(() => {
    console.log(window.value)
        console.log("editorListIsSaved", editorListIsSaved)
    }, [editorListIsSaved])

    return (
        <>
            {/* Load Scenarios */}
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
                                                        if(editorListIsSaved || editorList.length === 0) {
                                                            loadScenarioTemplate(template.scenarioId)
                                                        } else {
                                                            setSelectedTemplateId(template.scenarioId)
                                                            onNotSavedOpen()
                                                        }
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
                                                        setSelectedTemplateId(template.scenarioId)
                                                        onDeleteOpen()
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
                    <HStack>
                        <Heading as="h3" size="md" pr={4}>
                            {editorList.find(component => component.type === componentEnum.BASE) ?
                                editorList.find(component => component.type === componentEnum.BASE).template_name
                                : "Empty Scenario"}
                        </Heading>
                        {editorListState === editorListStates.UNCHANGED ? <></> :
                            editorListState === editorListStates.SAVED ?
                                <Tag size="md" variant="subtle" colorScheme='green'>
                                    <TagLeftIcon boxSize='12px' as={HiOutlineCheck}/>
                                    <TagLabel>Saved</TagLabel>
                                </Tag> :
                                editorListState === editorListStates.MODIFIED ?
                                    <Tag size="md" variant="subtle" colorScheme='red'>
                                        <TagLeftIcon boxSize='12px' as={HiOutlineX}/>
                                        <TagLabel>Unsaved</TagLabel>
                                    </Tag>
                                    : <></>
                        }
                    </HStack>
                    <HStack gap={2}>
                        <IconButton
                            variant='outline'
                            colorScheme='blue'
                            aria-label='Undo'
                            icon={<RiArrowGoBackLine />}
                            onClick={undo}
                            isDisabled={editorListHistory.past.length === 0}
                        />
                        <IconButton
                            variant='outline'
                            colorScheme='blue'
                            aria-label='Redo'
                            icon={<RiArrowGoForwardLine />}
                            onClick={redo}
                            isDisabled={editorListHistory.future.length === 0}
                        />
                        <Button variant="outline"
                                colorScheme="blue"
                                onClick={() => {
                                    if (editorList.length === 0) {
                                        toast({
                                            title: `Scenario is already set up and can be edited`,
                                            status: 'info',
                                            duration: 3000,
                                        });
                                    } else if(editorListState === editorListStates.SAVED) {
                                        resetScenarioStudio()
                                    } else {
                                        onCreateOpen()
                                    }
                                }}>
                            Create new
                        </Button>
                        {/*<Button variant="outline"*/}
                        {/*        colorScheme="blue"*/}
                        {/*        onClick={() => {*/}
                        {/*            validateScenario(editorList)*/}
                        {/*        }*/}
                        {/*        }>*/}
                        {/*    Test*/}
                        {/*</Button>*/}
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
                                onClick={() => {
                                    saveScenarioTemplate(currentTemplateId)
                                }}>
                            Save
                        </Button>
                        <Button variant="outline"
                                colorScheme="blue"
                                onClick={() => {
                                    duplicateScenario(currentTemplateId)
                                }}>
                            Duplicate
                        </Button>
                        <Button variant="solid"
                                colorScheme="blue"
                                onClick={() => {saveAndPublishScenarioTemplate(currentTemplateId)}}>
                                    Save and Publish
                        </Button>
                    </HStack>
                </HStack>
                <Box h={5}></Box>


                <Box backgroundColor="#EDF2F7" borderRadius="2xl" minH="73vh" maxH="73vh" h="73vh">
                    <HStack maxH="full" w="full" h="full" pt={2} spacing={5}
                            onClick={(e) => {handleEditorBackgroundClick(e)}
                    }>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Editor
                                editorList={editorList}
                                selectedObject={selectedObject}
                                handleSelect={handleSelect}
                            />

                            {/*Right Panel*/}
                            <Box maxH="full" h="full" backgroundColor="white" borderRadius="2xl">
                                <Tabs
                                    index={tabIndex}
                                    onChange={handleTabsChange}
                                    // minH="900px"
                                    h="full"
                                    maxH="full"

                                    w="350px"
                                    minW="350px"
                                    maxW="350px"
                                >
                                    <TabList w="100%" >
                                        <Tab fontWeight="bold" color="gray.400" w="full">Inspector</Tab>
                                        <Tab fontWeight="bold" color="gray.400" w="full">Components</Tab>
                                        <Tab fontWeight="bold" color="gray.400" w="full">Validation</Tab>
                                    </TabList>

                                    <TabPanels maxH="calc(100% - 42px)"  h="calc(100% - 42px)">

                                        {/* Inspector Items */}
                                        <TabPanel height="full" maxH="full" overflow="auto">
                                            <InspectorTab
                                                selectedObject={selectedObject}
                                                setSelectedObjectId={setSelectedObjectId}
                                                updateEditorList={updateEditorList}
                                                validationErrors={validationErrors}
                                            />
                                        </TabPanel>

                                        {/* Component Tab */}
                                        <TabPanel pb={0} pt={0} pr={0} height="full" >
                                            <ComponentTab
                                                finalComponentList={finalComponentList}
                                            />
                                        </TabPanel>

                                        <TabPanel pb={0} pt={0} pr={0} height="full">
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
                text="All unsaved changes are discarded.
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
                isOpen={isNotSavedOpen}
                cancelRef={cancelRef}
                onClose={onNotSavedClose}
                title="Unsaved changes"
                text="The current scenario is not saved. All unsaved changes are discarded. Do you want to continue?"
                onCancel={() => {
                    onNotSavedClose()
                    onOpen()
                }
                }
                continueButtonColor="blue"
                onContinueButtonClick={() => {
                    onNotSavedClose()
                    loadScenarioTemplate(selectedTemplateId)
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
                    setSelectedTemplateId("")
                    onPublishedClose()
                    onOpen()
                    }
                }
                continueButtonColor="blue"
                onContinueButtonClick={() => {
                    onPublishedClose()
                    duplicateScenario(selectedTemplateId)
                    }
                }
            />

            <ScenarioStudioAlert
                isOpen={isDeleteOpen}
                cancelRef={cancelRef}
                onClose={onDeleteClose}
                title="Delete scenario"
                text={`Do you want to delete scenario '${getScenarioName(selectedTemplateId)}'? You can't undo this action afterwards.`}
                onCancel={() => {
                    onDeleteClose()
                }
                }
                continueButtonColor="red"
                continueButtonName="Delete"
                onContinueButtonClick={() => {
                    onDeleteClose()
                    deleteScenario(selectedTemplateId)
                }
                }
            />
        </>
    )
};

export default ScenarioStudio