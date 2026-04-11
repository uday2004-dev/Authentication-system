import React from 'react'
import {assets} from "../assets/asset/assets"
import{ useNavigate }from "react-router-dom"
import { useContext } from 'react'
import { AppContext } from '../context/appContext'
const NavBar = () => {
  const navigate=useNavigate()
  const {userData,backendURL,setUserData,setIsLoggedin}=useContext(AppContext)
  return (
    <div className='w-full flex justify-between  items-center p-4 sm:p-6 sm:px-24 absolute top-0'>

        <img src={assets.logo}alt=""   className='w-28 sm:w-32'/>
        {
          userData?
          <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
        
          {userData?.name?.charAt(0)?.toUpperCase()}
          <div className='absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg w-40 z-10 text-black'>

            <ul>
              <li>Verify email</li>
              <li>Logout</li>
            </ul>
          </div>
          </div>: <button onClick={()=>{
          navigate('/login')
        }} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt="" /></button>
        }
       
    </div>
  )
}

export default NavBar