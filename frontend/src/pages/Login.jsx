import React, { useState } from 'react'
import { assets } from '../assets/asset/assets'
import{ useNavigate }from "react-router-dom"

const Login = () => {
  const [state, setState] = useState("Sign Up")
  const [name, setName] = useState(" ")
  const [email, setEmail] = useState(" ")
  const [password, setPassword] = useState()

  const navigate=useNavigate()

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

      <img onClick={()=>{
        navigate("/")
      }} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "Sign Up" ? "Create account" : "Login"}</h2>
        <p className='text-center text-sm mb-6'>{state === "Sign Up" ? "Create your account" : "Login to your account"}</p>
        <form>
          {
            state === "Sign Up" && (
              <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                <img src={assets.person_icon} alt="" />
                <input
                  onChange={e => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder='Fullname'
                  required className='bg-transparent outline-none text-gray-200' />
              </div>
            )
          }

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              onChange={e => setEmail(e.target.value)}
              value={email}
              placeholder='Enter email here'
              required className='bg-transparent outline-none text-gray-200' />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder='Enter password'
              required className='bg-transparent outline-none text-gray-200' />
          </div>
          <p onClick={()=>{
            navigate("/resetpassword")
          }} className='mb-4 text-indigo-500 cursor-pointer'>Forget Password?</p>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>{state}</button>
        </form>
        {
          state === "Sign Up" ? (
            <p className='text-gray-400 text-center text-xs mt-4'>Already have an account ? {'  '}
              <span onClick={() => {
                setState("Login")
              }} className='cursor-pointer text-blue-400 underline'>Login Here</span>
            </p>
          )
            :
            (
              <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account ? {'  '}
                <span
                  onClick={() => {
                    setState("Sign Up")
                  }}
                  className='cursor-pointer text-blue-400 underline' >Register Here</span>
              </p>
            )
        }



      </div>
    </div>
  )
}

export default Login