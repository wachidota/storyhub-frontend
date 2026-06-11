// src/App.jsx

import { Provider } from "react-redux";

import {
    BrowserRouter,
    Routes,
    Route
    
} from "react-router-dom";
import "./App.css";
import { ToastContainer }
from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { store } from "./store/store";

import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import CreateChapterPage from "./Pages/CreateChapterPage";
import DashboardPage from "./Pages/DashboardPage";
import BooksPage from "./Pages/BooksPage";
import BookDetailPage from "./Pages/BookDetailPage";
import ChapterDetailPage from "./Pages/ChapterDetailsPage";
import CreateBookPage from "./Pages/CreateBookPage";
import EditBookPage from "./Pages/EditBookPage";
import EditChapterPage from "./Pages/EditChapterPage";
import ManageCategoriesPage from "./Pages/ManageCategoriesPage";
function App() {

    return (

        <Provider store={store}>

            <BrowserRouter>

                <Routes>

    <Route
        path="/"
        element={<LoginPage />}
    />

    <Route
        path="/registro"
        element={<RegisterPage />}
    />

    <Route
        element={<ProtectedRoute />}
    >

        <Route
            path="/dashboard"
            element={<DashboardPage />}
        />

        <Route
            path="/books"
            element={<BooksPage />}
        />

        <Route
            path="/books/:id"
            element={<BookDetailPage />}
        />

        <Route
            path="/chapters/:id"
            element={<ChapterDetailPage />}
        />

        <Route
            path="/create-book"
            element={<CreateBookPage />}
        />

        <Route
            path="/books/:id/chapters/new"
            element={<CreateChapterPage />}
        />
        <Route
             path="/books/:id/edit"
          element={<EditBookPage />}
            />

        <Route
            path="/chapters/:id/edit"
            element={<EditChapterPage />}
        />

        <Route
            path="/manage-categories"
            element={<ManageCategoriesPage />}
        />

    </Route>

</Routes>

                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    theme="colored"
                />

            </BrowserRouter>

        </Provider>

    );

}

export default App;