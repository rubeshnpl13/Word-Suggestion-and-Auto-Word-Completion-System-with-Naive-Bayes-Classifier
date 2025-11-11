import { RouterProvider } from "react-router-dom";
import router from "router/root";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserContext from "store/context/UserContext";
import useLocalStorage from "hooks/useLocalStorage";

function App() {
    const [user, setUser] = useLocalStorage("user", {});
    return (
        <div>
            <UserContext.Provider value={{ user, setUser }}>
                <RouterProvider router={router} />
            </UserContext.Provider>
            <ToastContainer
                position="top-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default App;