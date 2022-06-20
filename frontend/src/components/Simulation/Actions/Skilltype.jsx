import {Flex, IconButton, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack} from "@chakra-ui/react"
import {HiMinus, HiPlus} from "react-icons/hi";


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
        <Flex borderRadius="2xl" p='3' flexFlow="column" align="center" justify="center"
              _hover={{boxShadow: "rgb(112 144 176 / 12%) 0px 40px 58px -20px"}}>
            <VStack spacing={0}>
                <Text
                    fontWeight="bold">{props.skillTypeName.charAt(0).toUpperCase() + props.skillTypeName.slice(1)}</Text>
                <Flex w="full" alignItems="center">
                    <IconButton colorScheme="blue" variant="outline" icon={<HiMinus/>} onClick={() => {
                        updateChange(-1)
                    }} aria-label="Remove employee"/>
                    <VStack spacing={0}>
                        <Stat>
                            <StatLabel color="gray.400">Curr. employed</StatLabel>
                            <StatNumber>{props.currentCount}</StatNumber>
                            <StatHelpText>
                                {props.countChange !== 0 ?
                                    <StatArrow type={props.countChange > 0 ? "increase" : "decrease"}/> : <></>}
                                {props.countChange}
                            </StatHelpText>
                        </Stat>
                    </VStack>
                    <IconButton colorScheme="blue" variant="outline" icon={<HiPlus/>} onClick={() => {
                        updateChange(1)
                    }} aria-label="Add employee"/>
                </Flex>
            </VStack>
        </Flex>
    )
}

export default Skilltype