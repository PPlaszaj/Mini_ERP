import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "./components/Main";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
