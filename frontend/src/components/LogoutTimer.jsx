import { useContext, useState, useEffect } from 'react';
import { getCookie } from "../utils/utils";
import { useCookies } from "react-cookie";
import { AuthContext } from "../context/AuthProvider";

const LogoutTimer = () => {
  const [timer, setTimer] = useState(60*60);
  const [csrfCookie, setCsrfCookie, removeCsrfCookie] = useCookies(["csrftoken"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
    }

    removeCsrfCookie('csrftoken');
    setIsLoggedIn(false);
    setCurrentUser(null);
    alert("You have been logged off due to inactivity.");
  };

  const resetTimer = () => {
    setTimer(60*60);
  };

  const handleUserInteraction = () => {
    resetTimer();
  };

  useEffect(() => {
    setIsLoggedIn(currentUser !== null);
  }, [currentUser, setIsLoggedIn]);

  useEffect(() => {
    let intervalId = null;

    const decrementTimer = () => {
      setTimer(prevTimer => {
        const updatedTimer = prevTimer - 1;
        return updatedTimer;
      });
    };

    const clearTimer = () => {
      clearInterval(intervalId);
      intervalId = null;
    };

    const startTimer = () => {
      intervalId = setInterval(() => {
        decrementTimer();
      }, 1000);
    };

    if (isLoggedIn) {
      startTimer();
      document.addEventListener('mousemove', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('scroll', handleUserInteraction);
    }

    return () => {
      clearTimer();
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (timer <= 0 && isLoggedIn) {
      handleLogout();
    }
  }, [timer, isLoggedIn, handleLogout]);

  useEffect(() => {
    if (!isLoggedIn) {
      setTimer(60*60);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLogoutMessage(true);
      const timerId = setTimeout(() => {
        setShowLogoutMessage(false);
      }, 3000);
      return () => clearTimeout(timerId);
    }
  }, [isLoggedIn]);



};

export default LogoutTimer;