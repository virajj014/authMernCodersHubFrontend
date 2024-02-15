"use client";
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import styles from '@/styles/navbar.module.css'
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { logIn, logOut } from '@/redux/features/auth-slice';
const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>()
    const auth = useAppSelector((state) => state.authReducer)
    const router = useRouter()
    // const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const pathname = usePathname()

    console.log(auth)

    const checkLogin = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin', {
            method: 'GET',
            credentials: 'include'
        })

        let data = await res.json()
        if (!data.ok) {
            dispatch(logOut())
        }
        else {
            getUserData()
        }

    }
    const getUserData = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/getuser', {
            method: 'GET',
            credentials: 'include'
        })
        let data = await res.json()
        if (data.ok) {
            dispatch(logIn(data.data))
        }
        else {
            dispatch(logOut())
        }
    }

    React.useEffect(() => {
        checkLogin()
    }, [])


    const handleLogout = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/logout', {
            method: 'GET',
            credentials: 'include'
        })
        let data = await res.json()
        if (data.ok) {
            dispatch(logOut())
            router.push('/login')
        }
    }
    return (
        <div className={styles.navbar}>
            <h1
                className={styles.logo}

                onClick={() => router.push('/')}
            >Coders Hub</h1>

            {auth?.isAuth ? (
                <div className={styles.right}>
                    <p
                        onClick={() => router.push('/')}
                        className={pathname === '/' ? styles.active : ''}

                    >Home</p>


                    <p
                        onClick={() => router.push('/profile')}
                        className={pathname === '/profile' ? styles.active : ''}

                    >Profile</p>

                    <p
                        onClick={() => handleLogout()}

                    >Logout</p>
                </div>
            ) : (
                <div className={styles.right}>
                    <p
                        onClick={() => {
                            router.push('/login')
                        }}
                        className={pathname === '/login' ? styles.active : ''}
                    >Login</p>
                    <p
                        className={pathname === '/signup' ? styles.active : ''}

                        onClick={() => {
                            router.push('/signup')
                        }}
                    >Signup</p>
                </div>


            )}
        </div>
    )
}

export default Navbar