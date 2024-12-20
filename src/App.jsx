import "./App.css";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import SignUp from "./pages/signup/signup";
import Login from "./pages/login/Login";
import OtpVerification from "./pages/otp/otpVerification";
import './pages/styles/auth.css';
import Home from "./pages/home/Home";
import VideoUpload from "./pages/admin/VideoUpload";
import AdminSignUp from "./pages/admin/AdminSignUp";

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/verify-otp" element={<OtpVerification/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/upload-media" element={<VideoUpload/>}/>
        <Route path="/admin-signup" element={<AdminSignUp/>}/>
      </Routes>
  );
}

export default App;
