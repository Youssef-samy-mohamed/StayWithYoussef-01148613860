

import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import {  Footer } from "../../components/common";
import "react-toastify/dist/ReactToastify.css";



const MainLayout = () => {
  return (
    <div className="">
      <Header />
      <div className="container mx-auto px-4 md:px-8 mt-16">
        <div className="text-center text-xl font-bold ">
        </div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;