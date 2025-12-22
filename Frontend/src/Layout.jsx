import { Outlet } from "react-router";
import Header from "./Header";
// import FoodOptions from "./components/FoodOptions";
// import IndexPage from "./components/IndexPage";

const Layout = () => {
  return (
    <div>
      <Header />
      {/* <IndexPage /> */}
      {/* <FoodOptions /> */}
      <Outlet />
    </div>
  );
};

export default Layout;
