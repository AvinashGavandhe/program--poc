import Homepage from "./components/Homepage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import ExitPage from "./components/ExitPage";
import { jwtInterceptor } from "./services/jwtInterceptor.js";

jwtInterceptor();

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/complete" element={<ExitPage />} />
      </Routes>
    </div>
  );
};

export default App;
