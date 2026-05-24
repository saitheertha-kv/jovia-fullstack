import React from 'react'
import { Route, Routes } from 'react-router';
import BasicRouter from './BasicRouter';
import AdminLayout from '../Admin/AdminLayout/AdminLayout';
import UserLayout from '../User/UserLayout/UserLayout';
import GuestLayout from '../Guest/GuestLayout/GuestLayout';
import InfluencerLayout from '../Influencer/InfluencerLayout/InfluencerLayout';
import BrandLayout from '../Brand/BrandLayout/BrandLayout';
export const MainRouter = () => {
  return (
    <div>
        <Routes>
        <Route path="admin/*" element={<AdminLayout/>}></Route>
        <Route path="user/*" element={<UserLayout/>}></Route>
        <Route path="/*" element={<GuestLayout/>}></Route>
        <Route path="influencer/*" element={<InfluencerLayout/>}></Route>
        <Route path="brand/*" element={<BrandLayout/>}></Route>
        <Route path="basic/*" element={<BasicRouter/>}></Route>
        </Routes>
    </div>
  )
}
export default MainRouter