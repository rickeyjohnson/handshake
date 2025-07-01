import { createContext, useState, useContext, useEffect } from "react"

const UserContext = createContext<any>(undefined)   // Find typing for usercontext

export const UserProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/me', { credentials: "include" })
                if (response.ok) {
                    const data = await response.json()
                    setUser(data)
                } else {
                    setUser(null)
                }
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
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