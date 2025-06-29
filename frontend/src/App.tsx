import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import RootLayout from "./components/layout/RootLayout";

import { SidebarProvider } from "./components/ui/sidebar";
import ChatPage from "./pages/ChatPage";
import MainChat from "./pages/MainChat";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./auth/LoginForm";

function App() {
    const router = createBrowserRouter([
        {
            path: "/chatpage",
            element: (
                <RootLayout>
                    <ChatPage />
                </RootLayout>
            ),
        },
        {
            path: "/login",
            element: <LoginForm />,
        },
        {
            path: "/chat/:threadId",
            element: (
                <RootLayout>
                    <MainChat />
                </RootLayout>
            ),
        },
    ]);
    return (
        <Provider store={store}>
            <AuthProvider>
                <SidebarProvider>
                    <RouterProvider router={router} />
                </SidebarProvider>
            </AuthProvider>
        </Provider>
    );
}

export default App;
