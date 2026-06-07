import React from 'react'
import { Route, Routes } from 'react-router'
import Login from '../Guest/Pages/Login/Login'
import Registraction from '../Guest/Pages/Registraction/Registraction'
import Brandreg from '../Guest/Pages/BrandRegistraction/Brandreg'
import InfluencerRegistration from '../Guest/Pages/InfluencerRegistration/InfluencerRegistration'
import GuestDash from '../Guest/Pages/GuestDash/GuestDash'

const GuestRouter = () => {
  return (
    <Routes>
        <Route path="" element={<GuestDash/>}></Route>
        <Route path="login" element={<Login/>}></Route>
        <Route path="registraction" element={<Registraction/>}></Route>
        <Route path="brandreg" element={<Brandreg/>}></Route>
        <Route path="influencerRegistration" element={<InfluencerRegistration/>}></Route>
    </Routes>
  )
}

export default GuestRouter