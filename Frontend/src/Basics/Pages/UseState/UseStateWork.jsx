import { Style } from '@mui/icons-material'
import React, { useState } from 'react'
import style from './UseStateWork.module.css'

const UseStateWork = () => {
    const[name,setName]=useState('')
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
  return (
    <div className={style.main2}>
    <div className={style.main}>
        <div>Name</div>
        <div><input type="text" onChange={(e)=>{setName(e.target.value)}}/></div>
        <div>Email</div>
        <div><input type="text" onChange={(e)=>{setEmail(e.target.value)}}/></div>
        <div>Password</div>
        <div><input type="text"  onChange={(e)=>{setPassword(e.target.value)}}/></div>
    </div>
    <div>
        <div className={style.main1}>
        <div>Name :</div>
        <div>{name}</div>
        <div>Email :</div>
        <div>{email}</div>
        <div>Password :</div>
        <div>{password}</div>
        </div>
    </div>
</div>

  )
}

export default UseStateWork