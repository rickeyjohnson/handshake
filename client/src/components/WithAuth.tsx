import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export const WithAuth = (WrappedComponent: React.ComponentType<object>) => {
    return function ProtectedComponent(props: object) {
        const { user, initialized } = useUser()
        const navigate = useNavigate()

        useEffect(() => {
            if (initialized && !user) {
                console.log('Not logged in')
                navigate("/login");
            }
        }, [user, navigate]);

        if (!user) {
            return <p>Loading...</p>;
        }

        return <WrappedComponent {...props} />;
    }
}