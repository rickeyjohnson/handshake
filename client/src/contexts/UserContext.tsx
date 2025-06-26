import { createContext, useState, useContext, useEffect } from "react"

const UserContext = createContext<any>(undefined)   // Find typing for usercontext

export const UserProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/me', { credentials: "include" })
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    setUser(data);
                }
            })
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)