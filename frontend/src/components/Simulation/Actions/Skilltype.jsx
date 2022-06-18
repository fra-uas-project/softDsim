import { Button, Flex, Text } from "@chakra-ui/react"
import { HiPlus, HiMinus } from "react-icons/hi";


const Skilltype = (props) => {

    function updateChange(value) {
        if (!(props.currentCount * -1 > props.countChange + value)) {
            props.onUpdateChange(
                {
                    name: props.skillTypeName,
                    value: value
                }
            )
        }
    }

    return (
        <>
            <Flex _hover={{ boxShadow: '2xl' }} boxShadow='md' rounded='md' bg='gray.100' p='3' flexFlow="column" align="center" justify="center">
                <Flex w="full">
                    <Flex w="50%" align="center" justify="center">{'Currently: ' + props.currentCount}</Flex>
                    <Flex w="50%" align="center" justify="center">{'Change: ' + props.countChange}</Flex>
                </Flex>
                <Flex w="full" mt={2}>
                    <Button w="15%" colorScheme="blue" onClick={() => { updateChange(-1) }}>
                        <HiMinus />
                    </Button>
                    <Text w="70%" p={2}>
                        {props.skillTypeName.charAt(0).toUpperCase() + props.skillTypeName.slice(1)}
                    </Text>
                    <Button w="15%" colorScheme="blue" onClick={() => { updateChange(1) }}>
                        <HiPlus />
                    </Button>
                </Flex>
            </Flex>
        </>
    )
}

export default Skilltype