import { createRoot } from 'react-dom/client'
import './index.css'

import AppRouter from './routes/AppRouter.tsx'




import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";



createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppRouter />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </PersistGate>
  </Provider>
);
