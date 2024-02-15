"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import Link from 'next/link'
import styles from '@/styles/auth.module.css'
import { toast } from 'react-toastify'

interface FormData {
  email: string,
  password: string,
}


const Page = () => {
  const Router = useRouter()
  const [imageFile, setImageFiles] = useState<File | null>(null)

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [otp, setOtp] = React.useState('')


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value })
  }

  const [sendingOtp, setSendingOtp] = useState(false)
  const sendOtp = async () => {
    setSendingOtp(true)

    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/sendotp', {
      method: 'POST',
      body: JSON.stringify({ email: formData.email }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    let data = await res.json()
    setSendingOtp(false)
    if (data.ok) {
      toast.success('OTP sent')
    }
    else {
      toast.error(data.message)
    }
  }
  const handleSubmit = async () => {
    console.log(formData, imageFile, otp)

    if ( formData.email == "" || formData.password == "" || otp == "") {
      toast.error('All fields are required')
      return
    }


    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/changepassword', {
      method: 'POST',
      body: JSON.stringify({
      
        email: formData.email,
        password: formData.password,
        otp: otp
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })


    let data = await res.json()
    if (data.ok) {
      toast.success('Password changed')
      Router.push('/login')
    }

    else {
      toast.error(data.message)
    }
  }
  return (
    <div className={styles.authpage}>
      <div className={styles.authcontainer}>
        <h1>Forgot Password</h1>



        <div className={styles.inputcontaner1}>
          <label htmlFor="email">Email</label>
          <div className={styles.inputrow}>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} />
            {
              !sendingOtp ?
              <button
              onClick={sendOtp}
            >Send Otp</button>
            :
            <button style={{
              backgroundColor: 'gray',
              cursor: 'not-allowed'
            }}>Sending OTP</button>
            }
          </div>

        </div>

        <div className={styles.inputcontaner}>
          <label htmlFor="otp">Otp</label>
          <input type='number' name="otp" id='otp' value={otp} onChange={(e) => {
            setOtp(e.target.value)
          }} />
        </div>


        <div className={styles.inputcontaner}>
          <label htmlFor="password">Password</label>
          <input type='password' name="password" id='password' value={formData.password} onChange={handleInputChange} />
        </div>

        <button
          className={styles.button1}
          type="button"
          onClick={handleSubmit}
        >
          Change Password
        </button>


        <Link href="/login">
          Already have an account?
        </Link>
      </div>
    </div>
  )
}

export default Page