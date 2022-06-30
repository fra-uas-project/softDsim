import { Flex } from "@chakra-ui/react";
import MarkdownDisplay from "../../MarkdownDisplay";

const Event = (props) => {
    return (
        <Flex>
            <MarkdownDisplay markdownText={props.eventText}/>
        </Flex>
    )
}

export default Event