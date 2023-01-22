import {
    Box,
    Checkbox,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl, FormErrorMessage, FormHelperText,
    FormLabel,
    VStack
} from "@chakra-ui/react";
import MarkdownTextfield from "./MarkdownTextfield";
import {useEffect, useState} from "react";
import DeleteButton from "./DeleteButton";
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

const ModelSelectionInspectorForm = (props) => {

    const [displayName, setDisplayName] = useState(props.modelSelectionData?.displayName);
    const [models, setModels] = useState(props.modelSelectionData?.models);

    const allModels = ["Kanban", "Scrum", "Waterfall"];

    const onChangeModels = (event) => {
        if(models.includes(event.target.value)) {
            setModels(models.filter((element) => {return element !== event.target.value}))
        }else {
            setModels(prevState => [...prevState, event.target.value])
        }
    }

    const onChangeDisplayName = (value) => {
        setDisplayName(value)
    }

    const onSubmitDisplayName = () => {
        props.updateEditorList(
           (draft) => {
            const component = draft.find((component) => component.id === props.modelSelectionData.id)
            component.displayName = displayName;
        })
    }

    useEffect(() => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.modelSelectionData.id)
                component.models = models;
            })
    }, [models, props])

    return (
        <VStack maxW="300px" alignItems="flex-start">
            <Editable value={displayName} w="full" fontWeight="bold" onChange={(value) => onChangeDisplayName(value)} onSubmit={onSubmitDisplayName}>
                <EditablePreview
                    w="full"
                    _hover={{
                        background: "gray.100",
                        cursor: "pointer",
                    }}
                />
                <EditableInput/>
            </Editable>
            <Divider/>
            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.modelSelectionData.id, "text")}>
                <MarkdownTextfield
                    data={props.modelSelectionData}
                    updateEditorList={props.updateEditorList}
                    errorBorderColor={getErrorColor(props.validationErrors, props.modelSelectionData.id, "text")}
                />
                {isError(props.validationErrors, props.modelSelectionData.id, "text") ?
                    <FormErrorMessage mt={4} color={getErrorColor(props.validationErrors, props.modelSelectionData.id, "text")}>
                        {getErrorMessage(props.validationErrors, props.modelSelectionData.id, "text")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <Box h={3}/>
            <FormControl flexDir="column" display="flex" isInvalid={isError(props.validationErrors, props.modelSelectionData.id, "models")}>
                <FormLabel color="gray.400" htmlFor="">Available Management Models</FormLabel>
                {allModels.map((value, index) => {
                    return <Checkbox key={index} spacing='1rem' mb="0.5rem" value={value} onChange={(event) => onChangeModels(event)} isChecked={models.includes(value)}>{value}</Checkbox> // todo add error border color if needed
                })}
                {isError(props.validationErrors, props.modelSelectionData.id, "models") ?
                    <FormErrorMessage color={getErrorColor(props.validationErrors, props.modelSelectionData.id, "models")}>
                        {getErrorMessage(props.validationErrors, props.modelSelectionData.id, "models")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>
            <DeleteButton
                component={props.modelSelectionData}
                updateEditorList={props.updateEditorList}
                setSelectedObject={props.setSelectedObject}
            />
        </VStack>
    )
}

export default ModelSelectionInspectorForm;