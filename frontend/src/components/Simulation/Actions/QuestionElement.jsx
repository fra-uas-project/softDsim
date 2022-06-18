import {Flex, VStack} from "@chakra-ui/react";

const QuestionElement = (props) => {

    return (
        <Flex m="0 auto !important" justifyContent="center"
              _hover={{boxShadow: "rgb(112 144 176 / 12%) 0px 40px 58px -20px"}} borderRadius="xl"
              transition="all 0.2s ease" p={3}>
            <VStack alignItems="start">
                {props.children}
            </VStack>
        </Flex>
    )
}

export default QuestionElement;