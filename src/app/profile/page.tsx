"use client";
import { logIn, logOut } from '@/redux/features/auth-slice'
import { AppDispatch } from '@/redux/store'
import React from 'react'
import { useDispatch } from 'react-redux'
import styles from '@/styles/profile.module.css'
import Image from 'next/image';
interface User {
    name: string,
    email: string,
    profilePic: string

}

const Page = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [userdata, setUserData] = React.useState<User>({
        name: '',
        email: '',
        profilePic: ''
    })

    const geturlbykey = async (key: string) => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/gets3urlbykey/' + key, {
            method: 'GET',
            credentials: 'include'
        })

        let data = await res.json()
        if (data.ok) {
            let signedUrl = data.data.signedUrl
            return signedUrl
        }
        else {
            return null
        }
    }
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

            // setUserData(data.data)


            let signedUrl = await geturlbykey(data.data.profilePic)

            let user = {
                name: data.data.name,
                email: data.data.email,
                profilePic: signedUrl
            }
            setUserData(user)
            console.log(user)
        }
        else {
            dispatch(logOut())
        }
    }

    React.useEffect(() => {
        checkLogin()
    }, [])

    // {"_id":"65ce5e55a6c6f8e9aff3b0a9",
    // "name":"Harshal Jain",
    // "email":"virajj014@gmail.com",
    // "profilePic":"1708023381144",
    // "createdAt":"2024-02-15T18:56:21.900Z",
    // "updatedAt":"2024-02-15T18:56:21.900Z","__v":0}

    return (
        <div className={styles.profilepage}>
            <h1>Profile Page</h1>
            <Image src={userdata.profilePic} alt="profile pic" width={200} height={200} />
            <h2>{userdata.name}</h2>
            <h2>{userdata.email}</h2>

        </div>
    )
}

export default Page