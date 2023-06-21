import { Flex } from "@chakra-ui/react";
import MarkdownDisplay from "../../MarkdownDisplay";

const Event = (props) => {
    const divStyle = {
        border: '1px',
        padding: '10px',
        marginBottom: '20px',
        width: '585px',
        overflow: 'auto'
    };

    return (
        <div style={divStyle}>
            <MarkdownDisplay markdownText={props.eventText} />
        </div>
    );
}

export default Event