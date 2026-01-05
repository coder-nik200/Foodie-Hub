import "./App.css";
import axios from "axios";
import { UserContextProvider } from "./useContext";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Signup from "./pages/Signup";
import IndexPage from "./components/IndexPage";
import Login from "./pages/LoginPage";
import FoodDetails from "./pages/FoodDetails";
import ViewAllHitsPage from "./pages/ViewAllHitsPage";
import SweetDetails from "./pages/SweetDetails";
import DrinksDetails from "./pages/DrinksDetails";

//CORS
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="/foods/category/:id" element={<FoodDetails />} />
          <Route
            path="/foods/view-all-hits/:id"
            element={<ViewAllHitsPage />}
          />

          <Route path="/foods/sweet" element={<SweetDetails />} />
          <Route path="/foods/drinks" element={<DrinksDetails />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
