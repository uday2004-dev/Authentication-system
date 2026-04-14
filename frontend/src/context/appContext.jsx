import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
// import { get } from "mongoose";

export const AppContext = createContext()


export const AppContextProvider = (props) => {
    const backendURL = import.meta.env.VITE_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)

const getAuthState = async () => {
    try {
        const { data } = await axios.get(
            `${backendURL}/api/user/data`,
            { withCredentials: true }
        );

        if (data.success) {
            setUserData(data.userData);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            setUserData(null);
        }

    } catch (error) {
        setIsLoggedIn(false);
        setUserData(null);
    }
};


    const getUserData = async () => {
        try {
            const res = await axios.get(`${backendURL}/api/user/data`, {
                withCredentials: true
            })
            if (res.data.success) {
                setUserData(res.data.userData)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        getAuthState()
    }, [])
    const value = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
    }

    return (

        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )


}
