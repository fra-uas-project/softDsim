import { Flex } from "@chakra-ui/react";
import MarkdownDisplay from "../../MarkdownDisplay";

const Event = (props) => {
    return (
        <Flex>
		<div style={{ width: '585px' }}>
            <MarkdownDisplay markdownText={props.eventText}/>
		</div>
        </Flex>
    )
}

export default Event