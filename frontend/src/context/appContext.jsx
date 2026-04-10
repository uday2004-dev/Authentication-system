import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext()


export const AppContextProvider = (props) => {
    const backendURL = import.meta.env.VITE_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState=async () => {
        try {

            const {data}=await axios.get(`${backendURL}/api/auth/userAuth`)
            if(data.success){
                setIsLoggedIn(true  )
            }
            
        } catch (error) {
            toast.error(data.message)
            
        }
        
    }


    const getUserData = async () => {
        try {
            const res = await axios.get(`${backendURL}/api/user/data`,{withCredentials:true})
            res.data.success ? setUserData(res.data.userData) : toast.error(data.message)
        } catch (error) {
          
  toast.error(error.response?.data?.message || error.message)
}
       

    }

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
