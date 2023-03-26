import {
    Box,
    Divider,
    Editable,
    EditableInput,
    EditablePreview,
    FormControl,
    FormErrorMessage,
    FormHelperText
} from "@chakra-ui/react";
import MarkdownTextfield from "./MarkdownTextfield";
import InspectorItemSelector from "./InspectorItemSelector";
import DeleteButton from "./DeleteButton";
import {getErrorColor, getErrorMessage, isError} from "../../../utils/utils";

const QuestionsInspectorForm = (props) => {

    const onChangeDisplayName =  (value) => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.questionsData.id)
                component.displayName = value;
            })
    }

    return (
        <>
            <Editable value={props.questionsData.displayName} w="full" fontWeight="bold"
                      onChange={(value) => onChangeDisplayName(value)}>
                <EditablePreview
                    w="full"
                    _hover={{
                        background: "gray.100",
                        cursor: "pointer",
                    }}
                />
                <EditableInput/>
            </Editable>
            <Divider />

            <Box h={3}/>

            <FormControl isInvalid={isError(props.validationErrors, props.questionsData.id, "text")}>
                <MarkdownTextfield
                    key={props.questionsData.id}
                    data={props.questionsData}
                    updateEditorList={props.updateEditorList}
                    errorBorderColor={getErrorColor(props.validationErrors, props.questionsData.id, "text")}
                />
                {isError(props.validationErrors, props.questionsData.id, "text") ?
                    <FormErrorMessage mt={4} color={getErrorColor(props.validationErrors, props.questionsData.id, "text")}>
                        {getErrorMessage(props.validationErrors, props.questionsData.id, "text")}
                    </FormErrorMessage>
                    : <FormHelperText></FormHelperText>}
            </FormControl>

            <Box h={3}/>

            <InspectorItemSelector
                droppableId="questionList"
                itemList={props.finalQuestionList}
                type="question"
                headline="Question Types"
                parentData={props.questionsData}
                validationErrors={props.validationErrors}
                validationErrorObjectKey="questions"
            />
            <DeleteButton
                component={props.questionsData}
                updateEditorList={props.updateEditorList}
                setSelectedObject={props.setSelectedObject}
            />
        </>
    )
}

export default QuestionsInspectorForm;