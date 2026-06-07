import React from 'react'
import style from './InfluencerLayout.module.css'
import InfluencerRouter from '../../Router/InfluencerRouter'
import Navbar from '../Components/NavBar/Navbar'
import Footer from '../Components/Footer/Footer'

const InfluencerLayout = () => {
  return (
    <div  className={style.layout}>
      <Navbar/>
      <main className={style.router}>
        <InfluencerRouter/>
        </main>
        <Footer/>
    </div>
  )
}

export default InfluencerLayout