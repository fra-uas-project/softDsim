import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import ScenarioOverview from "./pages/ScenarioOverview";
import UserOverview from "./pages/UserOverview";
import Simulation from "./pages/Simulation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Help from "./pages/Help";
import GDPR from "./pages/GDPR";
import Imprint from "./pages/Imprint";
import { getCookie } from "./utils/utils";
import NotFoundPage from "./components/NotFoundPage";
import ScenarioStudio from "./pages/ScenarioStudio";

const Routing = () => {
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    const authenticateUser = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_DJANGO_HOST}/api/authenticated`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json"
                },
            })
            return res
        } catch (err) {
            console.log('Error:', err)
        }
    };

    const isAuthenticated = async () => {
        const res = await authenticateUser();
        const resBody = await res.json();
        setCurrentUser(resBody.user)
    };

    useEffect(() => {
        isAuthenticated()
    }, []);

    useEffect(() => {
        if (currentUser !== null) {
            setIsAuthenticating(false);
        }
    }, [currentUser])

    return (
        <Routes>
            <>
                {/* routes which are accessible for every user */}
                <Route path="/gdpr" element={<GDPR />} />
                <Route path="/imprint" element={<Imprint />} />
            </>

            {currentUser ?
                <>
                    {/* routes which are accessible for every logged-in user */}
                    <Route path="/" element={<Navigate to="/scenarios" replace />} />
                    <Route path="/scenarios" element={<ScenarioOverview />} />
                    <Route path="/scenarios/:scn_id" element={<Simulation />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                </>
                :
                <>
                    {/* routes which are accessible for only not logged-in users */}
                    {
                        !isAuthenticating &&
                        <>
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </>
                    }

                </>
            }
            {
                currentUser?.creator &&
                <>
                    {/* adding routes which are accessible for every logged-in user with role creator */}
                    <Route path="/scenario-studio" element={<ScenarioStudio />} />
                </>
            }
            {
                currentUser?.staff &&
                <>
                    {/* adding routes which are accessible for every logged-in user with role staff */}
                    <Route path="/users" element={<UserOverview />} />
                </>
            }
            {
                currentUser?.admin &&
                <>
                    {/* adding routes which are accessible for every logged-in user with role admin */}
                </>
            }
        </Routes>
    )
};

export default Routing;