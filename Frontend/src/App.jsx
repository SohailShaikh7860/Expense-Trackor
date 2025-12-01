import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TripProvider } from "./context/TripContext";
import { RazorpayProvider } from "./context/razorpayContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <RazorpayProvider>
          <AppRoutes />
          </RazorpayProvider>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
