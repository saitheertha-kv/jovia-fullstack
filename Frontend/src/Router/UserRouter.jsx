import React from 'react'
import { Route, Routes } from 'react-router'
import MyProfile from '../User/Pages/MyProfile/MyProfile'
import EditProfile from '../User/Pages/EditProfile/EditProfile'
import ChangePass from '../User/Pages/ChangePassword/ChangePass'
import ViewProduct from '../User/Pages/ViewProduct/ViewProduct'
import MyCart from '../User/Pages/MyCart/MyCart'
import ViewPost from '../User/Pages/ViewPost/ViewPost'
import Payment from '../User/Pages/Payment/Payment'
import MyBookings from '../User/Pages/MyBookings/MyBookings'
import ViewMoreProduct from '../User/Pages/ViewMoreProduct/ViewMoreProduct'
import UserHomePage from '../User/Pages/UserHomePage/UserHomePage'
import Explore from '../User/Pages/Explore/Explore'
import InfluencerProfile from '../User/Pages/InfluencerProfile/InfluencerProfile'
import Complaint from '../User/Pages/AddComplaint/AddComplaint'

const UserRouter = () => {
  return (
   <Routes>
    <Route path='' element={<UserHomePage/>}></Route>
    <Route path='myprofile' element={<MyProfile/>}></Route>
    <Route path='editprofile' element={<EditProfile/>}></Route>
    <Route path='changepass' element={<ChangePass/>}></Route>
    <Route path='viewproduct' element={<ViewProduct/>}></Route>
    <Route path='viewpost' element={<ViewPost/>}></Route>
    <Route path='mycart' element={<MyCart/>}></Route>
    <Route path='payment/:bookingid' element={<Payment/>}></Route>
    <Route path='mybooking' element={<MyBookings/>}></Route>
    <Route path='viewmore/:pid' element={<ViewMoreProduct/>}></Route>
    <Route path="explore" element={<Explore />} />
    <Route path="complaints" element={<Complaint />} />
    <Route path="influencer/:iid" element={<InfluencerProfile />} />
    
   </Routes>
  )
}

export default UserRouter