import React from "react";
import style from "./UserLayout.module.css";
import UserRouter from "../../Router/UserRouter";
import Navbar from "../Components/NavBar/Navbar";
import Footer from "../Components/Footer/Footer";

const UserLayout = () => {
  return (
    <div className={style.layout}>
      <Navbar />

      <main className={style.content}>
        <UserRouter />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;