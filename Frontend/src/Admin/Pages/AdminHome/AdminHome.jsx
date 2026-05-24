import React, { useState } from 'react'
import { Sidebar } from '../../Components/SideBar/Sidebar'
import { Navbar } from '../../Components/NavBar/Navbar'
import style from './AdminHome.module.css'
import AdminRouter from '../../../Router/AdminRouter'

export const AdminHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={style.main}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={style.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${style.sidebar} ${sidebarOpen ? style.sidebarOpen : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className={style.body}>
        <div className={style.navbar}>
          <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />
        </div>
        <main className={style.content}>
          <AdminRouter />
        </main>
      </div>

    </div>
  )
}

export default AdminHome