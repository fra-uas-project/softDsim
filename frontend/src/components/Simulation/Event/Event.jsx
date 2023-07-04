import { Flex } from "@chakra-ui/react";
import MarkdownDisplay from "../../MarkdownDisplay";

const Event = (props) => {
  const divStyle = {
    border: '1px',
    padding: '10px',
    marginBottom: '20px',
    width: '100%', // Adjusted width to take full width of the container
    overflow: 'auto'
  };

  return (
    <Flex justify="center">
      <div style={divStyle}>
        <MarkdownDisplay markdownText={props.eventText} />
      </div>
    </Flex>
  );
}

export default Event;