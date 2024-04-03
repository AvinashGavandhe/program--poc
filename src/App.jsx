import Homepage from "./components/Homepage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import CourseDetail from "./components/CourseDetail.jsx";
import { jwtInterceptor } from "./services/jwtInterceptor.js";
import ExitPage from "./components/ExitPage.jsx";

jwtInterceptor();

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/exit" element={<ExitPage />} />
      </Routes>
    </div>
  );
};

export default App;
