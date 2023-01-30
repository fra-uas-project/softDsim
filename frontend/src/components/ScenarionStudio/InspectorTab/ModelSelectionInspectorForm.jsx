import {
    Box,
    Checkbox,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    VStack
} from "@chakra-ui/react";
import MarkdownTextfield from "./MarkdownTextfield";
import DeleteButton from "./DeleteButton";
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

const ModelSelectionInspectorForm = (props) => {

    const allModels = ["Kanban", "Scrum", "Waterfall"];

    const onChangeModels = (event) => {
        if (props.modelSelectionData.models.includes(event.target.value)) {
            props.updateEditorList(
                (draft) => {
                    const component = draft.find((component) => component.id === props.modelSelectionData.id)
                    component.models = component.models.filter((element) => {
                        return element !== event.target.value
                    });
                }
            )
        } else {
            props.updateEditorList(
                (draft) => {
                    const component = draft.find((component) => component.id === props.modelSelectionData.id)
                    component.models = [...component.models, event.target.value]
                }
            )
        }
    }

    const onChangeDisplayName = (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.modelSelectionData.id)
                component.displayName = value;
            })
    }

    return (
        <VStack maxW="300px" alignItems="flex-start">
            <Editable value={props.modelSelectionData.displayName} w="full" fontWeight="bold" onChange={(value) => onChangeDisplayName(value)}>
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
                    return <Checkbox key={index}
                                     spacing='1rem'
                                     mb="0.5rem"
                                     value={value}
                                     onChange={(event) => onChangeModels(event)}
                                     isChecked={props.modelSelectionData.models.includes(value)}>{value}
                    </Checkbox> // todo add error border color if needed
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