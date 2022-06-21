import {
    Box,
    Button,
    Flex,
    HStack,
    Image,
    Menu,
    MenuButton,
    MenuGroup,
    MenuItem,
    MenuList
} from "@chakra-ui/react"
import Logo from "../images/logo-simplify.png"
import { HiMenu, HiOutlineLogout } from "react-icons/hi";
import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { useCookies } from 'react-cookie'
import { getCookie } from "../utils/utils"


const Navbar = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [csrfCookie, setCsrfCookie, removeCsrfCookie] = useCookies(['csrftoken']);

    const menuButton = useRef();

    // Workaround to center text in avatar
    useEffect(() => {
        menuButton.current.firstElementChild.style.width = "100%"
    }, [])

    async function handleLogout() {
        // send logout to backend --> deletes local sessionid cookie
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json"
                },
            })
            console.log(res)
        } catch (err) {
            console.log('Error:', err)
        }
        // delete crsf cookie
        removeCsrfCookie('csrftoken')
        // refresh user object
        // required for refreshing frontend state
        setCurrentUser(null)
    }

    return (
        <Flex
            w="full"
            px={16}
            py={4}
            borderBottom="1px solid #E2E8F0"
        >
            <Box as={Link} to={"/"}>
                <Image src={Logo} alt="logo" w={14} objectFit="contain" />
            </Box>
            <HStack
                w="100%"
                justifyContent="center"
                gap={14}
            >
                <Button variant='link' as={Link} to="/scenarios">
                    Scenarios
                </Button>
                <Button variant='link' as={Link} to="/scenario-studio">
                    Scenario Studio
                </Button>
                {currentUser?.creator &&
                    <Button variant='link' as={Link} to="/users">
                        User Management
                    </Button>}
                <Button variant='link' as={Link} to="/help">
                    Help
                </Button>

            </HStack>
            <HStack
                justifyContent="flex-end"
            >
                <HStack borderRadius="full" backgroundColor="white" p={3} boxShadow='xl'>
                    <Menu>
                        <MenuButton ref={menuButton} size="sm" cursor="pointer">
                            <HiMenu />
                        </MenuButton>
                        <MenuList mt={2}>
                            <MenuGroup>
                                <MenuItem icon={<HiOutlineLogout />} color="red" onClick={handleLogout}>Logout</MenuItem>
                            </MenuGroup>
                        </MenuList>
                    </Menu>
                </HStack>
            </HStack>
        </Flex>
    )
}

export default Navbar;