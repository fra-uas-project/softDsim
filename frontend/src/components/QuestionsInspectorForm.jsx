import {Box, Divider, Editable, EditableInput, EditablePreview} from "@chakra-ui/react";
import MarkdownTextfield from "./MarkdownTextfield";
import InspectorItemSelector from "./InspectorItemSelector";
import {useEffect, useState} from "react";

const QuestionsInspectorForm = (props) => {
    const [displayName, setDisplayName] = useState(props.questionsData.displayName);

    const onChangeDisplayName =  (value) => {
        setDisplayName(value)
    }

    useEffect(() => {
        props.questionsData.displayName = displayName
    }, [displayName])

    return (
        <>
            <Editable value={displayName} w="full" fontWeight="bold" onChange={(value) => onChangeDisplayName(value)}>
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