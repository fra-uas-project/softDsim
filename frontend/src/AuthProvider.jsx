import React, {createContext, useMemo, useState} from "react";

export const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);

    const value = useMemo(() => ({currentUser, setCurrentUser}), [currentUser, setCurrentUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}