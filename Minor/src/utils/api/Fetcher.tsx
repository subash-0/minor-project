import axios from "axios";
import { toast } from "react-hot-toast";


export const handleSignUp =(email: string, password: string, fullname: string) => {
     axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/signup`, {
        email,
        password,
        fullname
    },
    {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials : true
    }
    ).then(res => {
        if(res.status === 201) {
            return 'Signup successful'
        }
    }).catch(err => {
        if(err.response) {
            return err.response.data.message
        } else {
            return 'An error occurred during signup'
        }
    })
}


export const handleLogout = (navigate: (path: string) => void) =>{
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/logout`, {
        withCredentials: true
    }).then(res => {
        
        if(res.status === 200) {
            navigate('/login')
            toast.success('Logout successful')
 
        }
    }).catch(err => {
        if(err.response) {
            return err.response.data.message
        } else {
            return 'An error occurred during logout'
        }
    })
}

export const handleLogin = (email: string, password: string, navigate: (path: string) => void) => {
    axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`, {
        email,
        password
    },
    {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    }
    ).then(res => {
        if(res.status === 200) {
            navigate('/')
            toast.success('Login successful')
        }
    }).catch(err => {
        if(err.response) {
            toast.error(err.response.data.message)
        } else {
            toast.error('An error occurred during login')
        }
    })
}


export const handlerRedirect = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/go-home`, {
            withCredentials: true,
        });
        if (response.status === 200 && response.data.status === true) {
            return true;
        }
        return false;
    } catch (error : any) {
         toast.error(error.response?.data?.message || error.message);
        console.error('Error during auth check:', error.response?.data?.message || error.message);
        return false; // Explicitly return false on error
    }
};


export const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/v1/auth/google`;
}

export const handleDiscordLogin = () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/v1/auth/discord`;
}