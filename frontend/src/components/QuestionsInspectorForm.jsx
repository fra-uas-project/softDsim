import {Box, Divider, Editable, EditableInput, EditablePreview} from "@chakra-ui/react";
import MarkdownTextfield from "./MarkdownTextfield";
import InspectorItemSelector from "./InspectorItemSelector";

const QuestionsInspectorForm = (props) => {

    return (
        <>
            <Editable defaultValue={`Questions ${props.questionsData.id.slice(0, 8)}`} w="full" fontWeight="bold">
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
                questionsData={props.questionsData}
            />
            <Box h={3}/>
            <InspectorItemSelector
                droppableId="questionList"
                itemList={props.finalQuestionList}
                type="question"
                headline="Question Types"
            />
        </>
    )
}

export default QuestionsInspectorForm;