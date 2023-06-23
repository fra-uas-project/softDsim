import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  Text,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import Logo from "../images/logo-simplify.png";
import { HiMenu, HiOutlineLogout, HiUserCircle  } from "react-icons/hi";
import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useCookies } from "react-cookie";
import { getCookie } from "../utils/utils";
import { HiOutlineCog } from "react-icons/hi";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [csrfCookie, setCsrfCookie, removeCsrfCookie] = useCookies([
    "csrftoken",
  ]);

  const menuButton = useRef();

  const handleClick = () => {
    if (window.value >= 20) {
      const confirmLeave = window.confirm('Are you sure you want to leave this page?');
      if (!confirmLeave) {
        return; // Abbruch, wenn der Benutzer "Abbrechen" geklickt hat
      }
    }
   }

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
      <Box as={Link} to={"/"} onClick={handleClick}>
        <Image src={Logo} alt="logo" w={14} objectFit="contain" />
      </Box>

      {currentUser && (
        <HStack ml={4} spacing={2} alignItems="center">
          <HiUserCircle size={20} />
          <Text fontWeight="bold">{currentUser.username}</Text>
        </HStack>
      )}


      <HStack w="100%" justifyContent="center" gap={14}>
        <Button variant="link" as={Link} to="/scenarios" onClick={handleClick}>
          Scenarios
        </Button>

        {currentUser?.creator && (
        <Button variant="link" as={Link} to="/scenario-studio" onClick={handleClick}>
          Scenario Studio
        </Button>
        )}
        {currentUser?.admin && (
          <Button variant="link" as={Link} to="/users" onClick={handleClick}>
            User Management
          </Button>
        )}
        <Button variant="link" as={Link} to="/help" onClick={handleClick}>
          Help
        </Button>
      </HStack>

      {currentUser?.staff && (
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
                  <MenuItem color="black" as={Link} to="/skill-types" onClick={handleClick}>
                    Skill Types
                  </MenuItem>
                  <MenuItem color="black" as={Link} to="/scenario-config" onClick={handleClick}>
                    Scenario Configurations
                  </MenuItem>
                  <MenuItem color="black" as={Link} to="/courses" onClick={handleClick}>
                    Courses
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      )}

      <HStack justifyContent="flex-end">
        <HStack
          borderRadius="full"
          backgroundColor="white"
          p={3}
          boxShadow="xl"
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
