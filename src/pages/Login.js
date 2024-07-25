import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        // Check if the user is already logged in
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/dashboard') // Redirect to dashboard if already logged in
        }
    }, [navigate])

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

   const handleSubmit = async () => {
       try {
           const response = await fetch('http://localhost:4559/api/v1/users/login', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                   email: loginData.email,
                   password: loginData.password
               })
           })
           const data = await response.json()
           if (response.ok) {
            console.log("hello",data.data.accessToken)
               if (data.data.accessToken) {
                   // Check if the response contains a token
                   console.log('Login successful:', data)
                   localStorage.setItem('token', data.data.accessToken)
                   navigate('/dashboard')
               } else {
                   console.log('Unexpected response format:', data)
                   setError('Unexpected response format') // Set error state for displaying in UI
               }
           } else {
               console.log('Login failed:', data)
           }
       } catch (error) {
           console.log('There was an error during login', error)
           setError('Network Error') // Set error state for displaying in UI
       }
   }


    const goTo = (str) => {
        navigate(str)
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl mt-40 flex flex-col w-full md:w-1/3 items-center max-w-4xl mx-auto transition duration-1000 ease-out">
            <h2 className="p-3 text-3xl font-bold text-pink-400">Dashboard</h2>
            <div className="inline-block border-[1px] justify-center w-20 border-blue-400 border-solid"></div>
            <h3 className="text-xl font-semibold text-blue-400 pt-2">Sign In!</h3>
            <div className="flex flex-col items-center justify-center">
                <input
                    name="email"
                    type="email"
                    className="rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    type="password"
                    className="rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange}
                />
                <button
                    className="rounded-2xl m-2 text-white bg-blue-400 w-2/5 px-4 py-2 shadow-md hover:text-blue-400 hover:bg-white transition duration-200 ease-in"
                    onClick={handleSubmit}
                >
                    Sign In
                </button>
            </div>
            <div className="inline-block border-[1px] justify-center w-20 border-blue-400 border-solid"></div>
            <p className="text-blue-400 mt-4 text-sm">Don't have an account?</p>
            <p className="text-blue-400 mb-4 text-sm font-medium cursor-pointer" onClick={() => goTo('/SignUp')}>
                Create a New Account?
            </p>
            {error && <p className="text-red-500">{error}</p>} {/* Display error message if there's an error */}
        </div>
    )
}

export default Login;
