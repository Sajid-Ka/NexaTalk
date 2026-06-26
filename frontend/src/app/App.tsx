import AppRouter from "./router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1D2D",
            color: "#fff",
            border: "1px solid #3B82F6",
          },
        }}
      />
      <AppRouter />
    </>
  );
}
export default App;
