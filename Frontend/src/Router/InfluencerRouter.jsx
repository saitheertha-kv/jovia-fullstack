import React from 'react'
import { Route, Routes } from 'react-router'
import MyProfile from '../Influencer/Pages/MyProfile/MyProfile'
import EditProfile from '../Influencer/Pages/EditProfile/EditProfile'
import ChangePass from '../Influencer/Pages/ChangePassword/ChangePass'
import Post from '../Influencer/Pages/Post/Post'
import AddLink from '../Influencer/Pages/AddLink/AddLink'
import ViewEvent from '../Influencer/Pages/ViewEvent/ViewEvent'
import ViewRequest from '../Influencer/Pages/ViewRequest/ViewRequest'
import MyPost from '../Influencer/Pages/MyPost/MyPost'
import Chat from '../Influencer/Pages/Chat/Chat'
import AcceptedRequest from '../Influencer/Pages/AcceptedRequest/AcceptedRequest'
import Apply from '../Influencer/Pages/Apply/Apply'
import MyAppliedEvents from '../Influencer/Pages/MyAppliedEvents/MyAppliedEvents'
import InfluencerHomePage from '../Influencer/Pages/InfluencerHomePage/InfluencerHomePage'

const InfluencerRouter = () => {
  return (
    <Routes>
        <Route path='' element={<InfluencerHomePage/>}></Route>
        <Route path='myprofile' element={<MyProfile/>}></Route>
        <Route path='editprofile' element={<EditProfile/>}></Route>
        <Route path='changepass' element={<ChangePass/>}></Route>
        <Route path='post/:pid' element={<Post/>}></Route>
        <Route path='link' element={<AddLink/>}></Route>
        <Route path='mypost' element={<MyPost/>}></Route>
        <Route path='viewevent' element={<ViewEvent/>}></Route>
        <Route path='viewRequest' element={<ViewRequest/>}></Route>
        <Route path="chat/:roomId" element={<Chat />} />
        <Route path="acceptedRequests" element={<AcceptedRequest />} />
        <Route path="apply/:id" element={<Apply />} />
        <Route path="MyApplied" element={<MyAppliedEvents />} />
        
    </Routes>
  )
}

export default InfluencerRouter