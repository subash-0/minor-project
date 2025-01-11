import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { handlerRedirect } from "../api/Fetcher";

const Protected = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Initially null to indicate loading
   

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await handlerRedirect();
                console.log('Auth response:', res);

                // Assuming res is a boolean, update the state accordingly
                if (res) {
                    setIsLoggedIn(true);  // Set to true if logged in
                } else {
                    setIsLoggedIn(false);  // Set to false if not logged in
                }
            } catch (error) {
                console.error('Error during authentication check:', error);
                setIsLoggedIn(false);  // Set to false in case of error
            }
          
        };

        checkAuth();
    }, []); // This runs once when the component mounts

    useEffect(() => {
        if (isLoggedIn === false) {
            console.log('Not logged in, redirecting...');
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

   

    // Render only if the user is logged in
    return isLoggedIn ? <Outlet /> : null;
};

export default Protected;
