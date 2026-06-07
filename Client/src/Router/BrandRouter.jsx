import React from 'react'
import { Route, Routes } from 'react-router'
import MyProfile from '../Brand/Pages/MyProfile/MyProfile'
import EditProfile from '../Brand/Pages/EditProfile/EditProfile'
import ChangePass from '../Brand/Pages/ChangePassword/ChangePass'
import Product from '../Brand/Pages/Product/Product'
import AddStock from '../Brand/Pages/AddStock/AddStock'
import SearchInfluencer from '../Brand/Pages/SearchInfluncer/SearchInfluncer'
import AddRequest from '../Brand/Pages/AddRequest/AddRequest'
import AddEvent from '../Brand/Pages/AddEvent/AddEvent'
import ViewPost from '../Brand/Pages/ViewPost/ViewPost'
import BrandHomepage from '../Brand/Pages/Homepage/Homepage'
import ProductImage from '../Brand/Pages/ProductImage/ProductImage'
import ViewBooking from '../Brand/Pages/ViewBooking/ViewBooking'
import Chat from '../Brand/Pages/Chat/Chat'
import MyRequest from '../Brand/Pages/MyRequest/MyRequest'
import ViewApplyEvent from '../Brand/Pages/ViewAppliedEvents/ViewAppliedEvents'
import BrandPayment from '../Brand/Pages/Payment/Payment'


const BrandRouter = () => {
  return (
    <Routes>
      <Route path='' element={<BrandHomepage />}></Route>
      <Route path='myprofile' element={<MyProfile />}></Route>
      <Route path='editprofile' element={<EditProfile />}></Route>
      <Route path='changepass' element={<ChangePass />}></Route>
      <Route path='product' element={<Product />}></Route>
      <Route path='SearchInfluencer' element={<SearchInfluencer />}></Route>
      <Route path='stock/:id' element={<AddStock />}></Route>
      <Route path="/addrequest/:iid" element={<AddRequest />} />
      <Route path="/addevent" element={<AddEvent />}></Route>
      <Route path="viewpost" element={<ViewPost />} />
      <Route path="viewBooking" element={<ViewBooking />} />
      <Route path="productimage/:pid" element={<ProductImage />} />
      <Route path="myRequest" element={<MyRequest />} />
      <Route path="chat/:roomId" element={<Chat />} />
      <Route path="viewApplyEvent/:eid" element={<ViewApplyEvent />} />
      <Route path="payment/:requestid" element={<BrandPayment />} />

    </Routes>
  )
}

export default BrandRouter