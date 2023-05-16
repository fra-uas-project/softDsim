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
  MenuList,
} from "@chakra-ui/react";
import Logo from "../images/logo-simplify.png";
import { HiMenu, HiOutlineLogout, HiOutlineCog } from "react-icons/hi";
import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useCookies } from "react-cookie";
import { getCookie } from "../utils/utils";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [removeCsrfCookie] = useCookies(["csrftoken"]);

  const menuButton = useRef();

  // Workaround to center text in avatar
  useEffect(() => {
    menuButton.current.firstElementChild.style.width = "100%";
  }, []);

  async function handleLogout() {
    // send logout to backend --> deletes local sessionid cookie
    try {
      const res = await fetch(
        `${process.env.REACT_APP_DJANGO_HOST}/api/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
    } catch (err) {
      console.log("Error:", err);
    }
    // delete crsf cookie
    removeCsrfCookie("csrftoken");
    // refresh user object
    // required for refreshing frontend state
    setCurrentUser(null);
  }

  return (
    <Flex w="full" px={16} py={4} borderBottom="1px solid #E2E8F0">
      <Box as={Link} to={"/"}>
        <Image src={Logo} alt="logo" w={14} objectFit="contain" />
      </Box>
      <HStack w="100%" justifyContent="center" gap={14}>
        <Button variant="link" as={Link} to="/scenarios">
          Scenarios
        </Button>

        {currentUser?.creator && (
          <Button variant="link" as={Link} to="/scenario-studio">
            Scenario Studio
          </Button>
        )}
        {currentUser?.staff && (
          <Button variant="link" as={Link} to="/users">
            User Management
          </Button>
        )}

        <Button variant="link" as={Link} to="/help">
          Help
        </Button>
      </HStack>

      <HStack direction="row" spacing={4} justifyContent="flex-end">
        <HStack
          borderRadius="full"
          backgroundColor="white"
          p={3}
          boxShadow="xl"
        >
          <Menu>
            <MenuButton ref={menuButton} size="sm" cursor="pointer">
              <HiOutlineCog />
            </MenuButton>
            <MenuList mt={2}>
              <MenuGroup>
                <MenuItem color="black" as={Link} to="/skill-types">
                  Skill Types
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </HStack>

        <HStack
          direction="row"
          spacing={4}
          justifyContent="flex-end"
          borderRadius="full"
          backgroundColor="white"
          p={3}
          boxShadow="xl"
          marginLeft={4}
        >
          <Menu>
            <MenuButton ref={menuButton} size="sm" cursor="pointer">
              <HiMenu />
            </MenuButton>
            <MenuList mt={2}>
              <MenuGroup>
                <MenuItem
                  icon={<HiOutlineLogout />}
                  color="red"
                  onClick={handleLogout}
                >
                  Logout
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
    </Flex>
  );
};

export default Navbar;