import { Button, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import landing_bg from "../images/landing_bg.svg"


const ResetPassword = () => {

    // email input
    const [mailInput, setMailInput] = useState('')

    // regulate button status
    const [resetValidation, setResetValidation] = useState(false)

    // set error message status
    const [resetSuccess, setResetSuccess] = useState('none')

    // validate input
    function validateInput(event) {
        setMailInput(event.target.value)
        const mailDomain = new RegExp(/^\S+\.fra-uas\.de\s*$/)
        if (mailDomain.test(String(event.target.value).toLowerCase())) {
            setResetValidation(true)
        } else {
            setResetValidation(false)
        }
    }

    // reset API call
    function ResetPassword() {
        setResetSuccess('attempting')
        if (resetValidation) {
            // TODO: Implement API call once available in backend
            console.log('API CALL', mailInput)
            setResetSuccess('none')
        } else {
            setResetSuccess('invalid')
        }
    }

    return (<>
        <Flex align="center" justify="center" flexGrow="1" backgroundImage={landing_bg} backgroundPosition="center" backgroundSize="cover" backgroundRepeat="no-repeat">
            <Flex justify="center" p="10" w="40vw" maxW="400px" bg='white' rounded="2xl" flexFlow="column"
                shadow="xl">
                {/* input field */}
                <Stack spacing={5}>
                    <Heading as="h3" textAlign="center">Reset Password</Heading>
                    <Input type="text" placeholder="User ID" size='lg' bg='#efefef' onChange={validateInput} />
                </Stack>
                {/* Failed reset message */}
                <Flex align="center" justify="center" h="40px">
                    {resetSuccess === 'invalid' ?
                        <Text textColor="red.500">Incorrect input!</Text> : <></>}
                    {resetSuccess === 'unknown' ?
                        <Text textColor="red.500">Unknown Error - Please try again!</Text> : <></>}
                </Flex>
                {/* reste button */}
                <Button colorScheme={resetValidation ? 'blue' : 'blackAlpha'}
                    isDisabled={!resetValidation} size='lg'
                    isLoading={resetSuccess === 'attempting' ? true : false}
                    onClick={ResetPassword}>
                    Request Reset
                </Button>
            </Flex>
        </Flex>
    </>)
}

export default ResetPassword