import {Box, Divider, Editable, EditableInput, EditablePreview} from "@chakra-ui/react";
import MarkdownTextfield from "./MarkdownTextfield";
import InspectorItemSelector from "./InspectorItemSelector";
import {useState} from "react";
import DeleteButton from "./DeleteButton";

const QuestionsInspectorForm = (props) => {
    const [displayName, setDisplayName] = useState(props.questionsData.displayName);

    const onChangeDisplayName =  (value) => {
        setDisplayName(value)
    }

    const onSubmitDisplayName = () => {
        props.updateEditorList(
            (draft) => {
                const component = draft.find((component) => component.id === props.questionsData.id)
                component.displayName = displayName;
            })
    }

    return (
        <>
            <Editable value={displayName} w="full" fontWeight="bold"
                      onChange={(value) => onChangeDisplayName(value)}
                      onSubmit={onSubmitDisplayName}>
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
            <MarkdownTextfield
                key={props.questionsData.id}
                data={props.questionsData}
                updateEditorList={props.updateEditorList}
            />
            <Box h={3}/>
            <InspectorItemSelector
                droppableId="questionList"
                itemList={props.finalQuestionList}
                type="question"
                headline="Question Types"
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