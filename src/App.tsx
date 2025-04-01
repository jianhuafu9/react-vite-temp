import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "@/pages/about";
import "./styles/App.less";
import Home from "@/pages/home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/about"
          element={<About />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
