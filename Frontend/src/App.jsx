import axios from "axios";
import "./App.css";
import { UserContextProvider } from "./useContext";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Signup from "./pages/Signup";
import IndexPage from "./components/IndexPage";
import Login from "./pages/LoginPage";

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
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
