import { createContext, useState, useContext, useEffect } from "react"

const UserContext = createContext<any>(undefined)   // Find typing for usercontext

export const UserProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/me', { credentials: "include" })
                const data = await response.json()

                if (data.id) { setUser(data) }
            } catch (err) {
                console.error(err)
            }
        }

        fetchUser()
        setLoading(false)
    }, [])

    return (
        <UserContext.Provider value={{ user, loading, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)