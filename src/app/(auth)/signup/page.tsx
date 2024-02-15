"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import Link from 'next/link'
import styles from '@/styles/auth.module.css'
import { toast } from 'react-toastify'

interface FormData {
  name: string,
  email: string,
  password: string,
}


const Page = () => {
  const Router = useRouter()
  const [imageFile, setImageFiles] = useState<File | null>(null)

  const [formData, setFormData] = useState<FormData>({
    name: '',
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

  const generatepostobjecturl = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/generatepostobjecturl', {
      method: 'GET',
      credentials: 'include',
    })
    let data = await res.json()
    if (data.ok) {
      console.log(data.data.signedUrl)
      return data.data
    }
    else {
      return null
    }
  }

  const uploadtos3byurl = async (url: any) => {
    const options = {
      method: 'PUT',
      body: imageFile
    }

    let res = await fetch(url, options)
    if (res.ok) {
      // toast.success('Profile pic uploaded')
      return true
    }

    else {
      // toast.error('Failed to upload profile pic')
      return false
    }
  }
  const handleSignup = async () => {
    //  if (formData.name == "" || formData.email == "" || formData.password == "" || otp == "") {
    //   toast.error('All fields are required')
    //   return
    // }
    let uploadedImageKey = null

    if (imageFile) {
      let s3_makanKaPlot = await generatepostobjecturl()

      if (!s3_makanKaPlot) {
        toast.error('Failed to upload profile pic')
      }

      let filekey = s3_makanKaPlot.filekey;
      let s3url = s3_makanKaPlot.signedUrl;

      console.log(s3url, filekey)

      let uploaded = await uploadtos3byurl(s3url)

      if (!uploaded) {
        toast.error('Failed to upload profile pic')
        return
      }

      uploadedImageKey = filekey
    }

    // console.log(formData, imageFile, otp)




    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: otp,
        profilePic: uploadedImageKey
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })


    let data = await res.json()
    if (data.ok) {
      toast.success('Signup successful')
      Router.push('/login')
    }

    else {
      toast.error(data.message)
    }
  }
  return (
    <div className={styles.authpage}>
      <div className={styles.authcontainer}>
        <h1>Signup</h1>


        <div className={styles.inputcontaner}>
          <label htmlFor="name">Name</label>
          <input type='text' name="name" id='name' value={formData.name} onChange={handleInputChange} />
        </div>


        <div className={styles.inputcontaner}>
          <label htmlFor="profile">Profile Pic</label>
          <input type='file' name="profile" id='profile' onChange={(e) => {
            if (e.target.files) {
              setImageFiles(e.target.files[0])
            }
          }} />
        </div>

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
          onClick={handleSignup}
        >
          Signup
        </button>


        <Link href="/login">
          Already have an account?
        </Link>
      </div>
    </div>
  )
}

export default Page