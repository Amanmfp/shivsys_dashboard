
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import Login from './Login'

// Mocking the navigate function from react-router-dom
const mockedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}))

// Mocking localStorage
const mockedLocalStorageSetItem = jest.fn()
const mockedLocalStorageGetItem = jest.fn()

Object.defineProperty(window, 'localStorage', {
    value: {
        setItem: mockedLocalStorageSetItem,
        getItem: mockedLocalStorageGetItem 
    },
    writable: true
})

// Helper function to render the component within the Router context
const renderLogin = () =>
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    )

describe('Login Component', () => {
    beforeEach(() => {
        // Clear mocks before each test
        mockedNavigate.mockReset()
        mockedLocalStorageSetItem.mockReset()
        mockedLocalStorageGetItem.mockReset()
        global.fetch.mockClear()
    })

    beforeAll(() => {
        // Mock fetch globally
        global.fetch = jest.fn()
    })

    afterAll(() => {
        // Clear mock fetch after all tests
        jest.restoreAllMocks()
    })

    test('renders login form inputs and submit button', () => {
        renderLogin()
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    test('allows users to type in input fields', async () => {
        renderLogin()
        const emailInput = screen.getByPlaceholderText('Email')
        const passwordInput = screen.getByPlaceholderText('Password')

        await userEvent.type(emailInput, 'test@example.com')
        await userEvent.type(passwordInput, 'password')

        expect(emailInput.value).toBe('test@example.com')
        expect(passwordInput.value).toBe('password')
    })

    test('navigates to dashboard and stores token on successful login', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'testToken' })
        })

        renderLogin()

        const emailInput = screen.getByPlaceholderText('Email')
        const passwordInput = screen.getByPlaceholderText('Password')
        const signInButton = screen.getByRole('button', { name: /sign in/i })

        await userEvent.type(emailInput, 'test@example.com')
        await userEvent.type(passwordInput, 'password')
        fireEvent.click(signInButton)
        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/dashboard')
            expect(mockedLocalStorageSetItem).toHaveBeenCalledWith('token', 'testToken')
        })
    })
    test('handles network error during login', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network Error'))

        renderLogin()

        const emailInput = screen.getByPlaceholderText('Email')
        const passwordInput = screen.getByPlaceholderText('Password')
        const signInButton = screen.getByRole('button', { name: /sign in/i })

        await userEvent.type(emailInput, 'test@example.com')
        await userEvent.type(passwordInput, 'password')
        fireEvent.click(signInButton)

        await waitFor(() => {
            expect(mockedNavigate).not.toHaveBeenCalled()
            expect(mockedLocalStorageSetItem).not.toHaveBeenCalled()
            expect(screen.getByText('Network Error')).toBeInTheDocument()
        })
    })

    test('handles unexpected response format during login', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}) // Unexpected empty response
        })

        renderLogin()

        const emailInput = screen.getByPlaceholderText('Email')
        const passwordInput = screen.getByPlaceholderText('Password')
        const signInButton = screen.getByRole('button', { name: /sign in/i })

        await userEvent.type(emailInput, 'test@example.com')
        await userEvent.type(passwordInput, 'password')
        fireEvent.click(signInButton)

        await waitFor(() => {
            expect(mockedNavigate).not.toHaveBeenCalled()
            expect(mockedLocalStorageSetItem).not.toHaveBeenCalled()
            expect(screen.getByText('Unexpected response format')).toBeInTheDocument()
        })
    })
})
