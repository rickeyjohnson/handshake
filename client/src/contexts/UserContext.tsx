import { createContext, useState, useContext, useEffect } from "react"

const UserContext = createContext<any>(undefined)   // Find typing for usercontext

export const UserProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            await fetch('/api/me', { credentials: "include" })
                .then((response) => response.json())
                .then((data) => {
                    if (data.id) {
                        setUser(data)
                    }
                })
                .catch(err => {
                    console.log('Failed to fetch user: ', err)
                })
                .finally(() => setLoading(false))
        }

        fetchUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, loading, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)