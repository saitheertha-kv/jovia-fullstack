import React from "react";
import GuestRouter from "../../Router/GuestRouter";
import Navbar from "../Components/NavBar/Navbar";
import Footer from "../Components/Footer/Footer";
import style from "./GuestLayout.module.css";

const GuestLayout = () => {
  return (
    <div className={style.layout}>
      <Navbar />

      <main className={style.router}>
        <GuestRouter />
      </main>

      <Footer />
    </div>
  );
};

export default GuestLayout;