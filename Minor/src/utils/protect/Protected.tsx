import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Protected = () => {
    const navigate = useNavigate();
    const isLoggedIn = false; // Replace with actual login logic

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    // Render only if the user is logged in
    if (!isLoggedIn) {
        return null; // Avoid rendering anything while redirecting
    }

    return <Outlet />;
};

export default Protected;
