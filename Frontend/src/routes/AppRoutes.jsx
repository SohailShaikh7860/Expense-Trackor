import { Routes, Route } from "react-router-dom";
import { Login, Home, Dashboard, ForgotPage, SignUp,AddTrip, View, EditTrip, Supporters } from "../pages/pages.js";
import ProtectedRoute from "./ProtectedRoute.jsx";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/forgot"
          element={
              <ForgotPage />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-trip"
          element={
            <ProtectedRoute>
              <AddTrip />
            </ProtectedRoute>
          }
        />

        <Route
         path="/trip/:id"
         element={
          <ProtectedRoute>
            <View />
          </ProtectedRoute>
         }
        />  

        <Route
         path="/edit/:id"
         element={
          <ProtectedRoute>
            <EditTrip />
          </ProtectedRoute>
         }
        />

        <Route path='/supporters' element={
            <Supporters />
        }/>
      </Routes>
    </div>
  );
};

export default AppRoutes;
