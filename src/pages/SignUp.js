
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: ''
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async () => {
        try {
            console.log('Sending data:', formData) 
            const response = await fetch('http://localhost:4559/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName:formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            })
            const data = await response.json()
            console.log('Response data:', data) 

            if (response.ok) {
                navigate('/')
            } else {
                console.log('Registration failed:', data)
            }
        } catch (error) {
            console.error('There was an error registering the user', error)
        }
    }


    return (
        <div className="bg-blue-400 mt-40 text-white rounded-2xl shadow-2xl flex flex-col w-full md:w-1/3 items-center max-w-4xl mx-auto">
            <h2 className="p-3 text-3xl font-bold text-white">Dashboard</h2>
            <div className="inline-block border-[1px] justify-center w-20 border-white border-solid"></div>
            <h3 className="text-xl font-semibold text-white pt-2">Create Account!</h3>

            <div className="flex flex-col items-center justify-center text-black mt-2">
                <input
                    name="fullName"
                    type="text"
                    className="rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none"
                    placeholder="Name"
                    value={formData.fullName}
                    onChange={handleChange}
                />
                <input
                    name="email"
                    type="email"
                    className="rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    type="password"
                    className="rounded-2xl px-2 py-1 w-4/5 md:w-full border-[1px] border-blue-400 m-1 focus:shadow-md focus:border-pink-400 focus:outline-none focus:ring-0"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button
                    className="rounded-2xl m-4 text-blue-400 bg-white w-3/5 px-4 py-2 shadow-md hover:text-white hover:bg-blue-400 transition duration-200 ease-in"
                    onClick={handleSubmit}
                >
                    Sign Up
                </button>
            </div>

            <div className="inline-block border-[1px] justify-center w-20 border-white border-solid"></div>
            <p className="text-white mt-4 text-sm">Already have an account?</p>
            <p className="text-white mb-4 text-sm font-medium cursor-pointer">
                <button onClick={() => navigate('/')}> Sign In to your Account?</button>
            </p>
        </div>
    )
}

export default SignUp
