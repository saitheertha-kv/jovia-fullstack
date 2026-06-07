import React from 'react'

import District from '../Admin/Pages/District/District'
import { Route, Routes } from 'react-router'
import Dashboard from '../Admin/Pages/DashBoard/Dashboard'
import Category from '../Admin/Pages/Category/Category'
import Subcategory from '../Admin/Pages/Subcategory/Subcategory'
import Place from '../Admin/Pages/Place/Place'
import BrandVerification from '../Admin/Pages/BrandVerification/BrandVerification'
import VerifyInfluncer from '../Admin/Pages/VerifyInfluncer/VerifyInfluncer'
import ViewComplaint from '../Admin/Pages/ViewComplaint/ViewComplaint'

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="" element={<Dashboard />}></Route>
      <Route path="category" element={<Category />}></Route>
      <Route path="subcategory" element={<Subcategory/>}></Route>
      <Route path="district" element={<District />}></Route>
      <Route path="place" element={<Place/>}></Route>
      <Route path="BrandVerification" element={<BrandVerification/>}></Route>
      <Route path="VerifyInfluncer" element={<VerifyInfluncer/>}></Route>
      <Route path="ViewComplaint" element={<ViewComplaint/>}></Route>
    </Routes>
  )
}
export default AdminRouter
