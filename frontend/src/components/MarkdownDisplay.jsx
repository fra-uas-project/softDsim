import styled from "@emotion/styled";
import SimpleMDE from "react-simplemde-editor";
import {useCallback} from "react";

const MarkdownDisplay = ({markdownText}) => {
  // necessary because chakra ui resets all basic styles
  const MDE = styled(SimpleMDE)`
  all: revert;

  .editor-preview * {
    all: revert;
  }
  
  table {
    border-collapse: collapse !important;
  }
  
  th, td {
    border: 1px solid #ddd !important;
    padding: 5px !important;
  }

  .EasyMDEContainer .CodeMirror {
    border-radius: 10px;
    height: 80vh;
  }
  
  .editor-toolbar {
    border: none;
  }
`;

  const getMdeInstanceCallback = useCallback((simpleMde) => {
    simpleMde.togglePreview()
  }, []);

  return (
        <MDE
            options={{
              toolbar: false,
              spellChecker: false,
              status: false,
              minHeight: "100%"
            }}
            getMdeInstance={getMdeInstanceCallback}
            value={markdownText}
        />
  )
}

export default MarkdownDisplay;