import React from "react";
import style from "./BrandLayout.module.css";
import BrandRouter from "../../Router/BrandRouter";
import Navbar from "../Components/NavBar/Navbar";
import Footer from "../Components/Footer/Footer";

const BrandLayout = () => {
  return (
    <div className={style.layout}>
      <Navbar />

      <main className={style.router}>
        <BrandRouter />
      </main>

      <Footer />
    </div>
  );
};

export default BrandLayout;