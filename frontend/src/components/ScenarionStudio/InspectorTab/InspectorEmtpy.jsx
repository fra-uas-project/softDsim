import {Box, Text} from "@chakra-ui/react";

const InspectorEmtpy = (props) => {
  return (
      <>
          <Box borderRadius="md" border="1px dashed" borderColor="gray.200" p={2}>
              <Text fontSize="sm" fontWeight="500" color="gray.400" >
                  {props.content}
              </Text>
          </Box>
      </>
  )
}

export default InspectorEmtpy;