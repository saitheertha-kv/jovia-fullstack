import React from 'react'
import SampleUseState from '../Basics/Pages/UseState/SampleUseState'
import { Route, Routes } from 'react-router'
import UseStateWork from '../Basics/Pages/UseState/UseStateWork'
import UseEffectPage from '../Basics/Pages/UseEffect/UseEffect'


const BasicRouter = () => {
  return (
    <div>
        <Routes>
            <Route path="sample" element={<SampleUseState/>}></Route>
            <Route path="work" element={<UseStateWork/>}></Route>
             <Route path="useeffect" element={<UseEffectPage/>}></Route>
        </Routes>
    </div>
  )
}

export default BasicRouter