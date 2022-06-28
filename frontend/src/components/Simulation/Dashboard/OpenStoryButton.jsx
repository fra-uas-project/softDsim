import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Icon,
    Text,
    useDisclosure,
    VStack, Tooltip,
} from "@chakra-ui/react";
import {HiOutlineBookOpen} from "react-icons/hi";
import MarkdownDisplay from "../../MarkdownDisplay";

const OpenStoryButton = ({story}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
        <VStack borderRadius="2xl" backgroundColor="white" p={5} cursor="pointer" transition="all 0.2s ease"
                _hover={{boxShadow: 'xl'}}
                onClick={onOpen}
        >
            <Flex borderRadius="100%" backgroundColor="blue.100" p={2}>
                <Icon w={10} h={10} as={HiOutlineBookOpen} color="blue.600" />
            </Flex>
            <Text fontWeight="semibold" color="gray.400" fontSize="sm" whiteSpace="nowrap"><Tooltip label={ 'You can check the given story at any time here'}>Open Story</Tooltip></Text>
        </VStack>

            <Drawer onClose={onClose} isOpen={isOpen} placement="left" size="lg">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Story</DrawerHeader>
                    <DrawerBody>
                        <MarkdownDisplay markdownText={story} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default OpenStoryButton;