// src/pages/DashboardPage.jsx

import { useEffect, useState } from "react";

import {
    useSelector,
    useDispatch
} from "react-redux";

import { toast } from "react-toastify";

import api from "../api/api";

import {
    dashboardStart,
    dashboardSuccess,
    dashboardFailure
} from "../features/dashboard/dashboardSlice";

import {
    setUser
} from "../features/auth/authSlice";

import Navbar from "../components/layout/Navbar";
import PageContainer from "../components/layout/PageContainer";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import ProfileCard from "../components/dashboard/ProfileCard";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import WrittenBooksSection from "../components/dashboard/WrittenBooksSection";
import ReadBooksSection from "../components/dashboard/ReadBooksSection";

export default function DashboardPage() {
    const dispatch = useDispatch();

    const user = useSelector(
        state => state.auth.user
    );

    const {
        writtenBooks,
        readBooks,
        loading,
        error
    } = useSelector(
        state => state.dashboard
    );

    const [upgradeLoading, setUpgradeLoading] = useState(false);

    const [removingBookId, setRemovingBookId] = useState(null);

    useEffect(() => {
        if (!user?._id) {
            return;
        }

        async function loadDashboard() {
            try {
                dispatch(
                    dashboardStart()
                );

                const [
                    writtenResponse,
                    readResponse
                ] = await Promise.all([
                    api.get(
                        `/usuarios/${user._id}/libros-escritos`
                    ),

                    api.get(
                        `/usuarios/${user._id}/libros-leidos`
                    )
                ]);

                dispatch(
                    dashboardSuccess({
                        writtenBooks:
                            writtenResponse.data.libros || [],

                        readBooks:
                            readResponse.data.libros || []
                    })
                );
            }
            catch (err) {
                console.error(err);

                dispatch(
                    dashboardFailure(
                        "No se pudo cargar el dashboard."
                    )
                );
            }
        }

        loadDashboard();
    }, [user?._id, dispatch]);

    async function handleUpgrade() {
        if (!user?._id) {
            toast.error(
                "No se encontró el usuario logueado."
            );

            return;
        }

        try {
            setUpgradeLoading(true);

            const response = await api.put(
                `/usuarios/${user._id}/premium`
            );

            const updatedUser =
                response.data.usuario || {
                    ...user,
                    premium: true
                };

            localStorage.setItem(
                "usuario",
                JSON.stringify(updatedUser)
            );

            dispatch(
                setUser(updatedUser)
            );

            toast.success(
                "Ahora eres usuario Premium"
            );
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.mensaje ||
                "No se pudo mejorar a Premium"
            );
        }
        finally {
            setUpgradeLoading(false);
        }
    }

    async function handleRemoveReadBook(bookId) {
        const confirmar = window.confirm(
            "¿Seguro que deseas quitar este libro de tu lista de leídos?"
        );

        if (!confirmar) {
            return;
        }

        if (!user?._id) {
            toast.error(
                "No se encontró el usuario logueado."
            );

            return;
        }

        try {
            setRemovingBookId(bookId);

            await api.delete(
                `/usuarios/${user._id}/libros-leidos/${bookId}`
            );

            dispatch(
                dashboardSuccess({
                    writtenBooks,

                    readBooks:
                        readBooks.filter(book =>
                            book._id !== bookId
                        )
                })
            );

            toast.success(
                "Libro quitado de leídos"
            );
        }
        catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.mensaje ||
                "No se pudo quitar el libro de leídos"
            );
        }
        finally {
            setRemovingBookId(null);
        }
    }

    if (loading) {
        return (
            <LoadingState
                text="Cargando dashboard..."
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error}
            />
        );
    }

    return (
        <>
            <Navbar />

            <PageContainer>
                <ProfileCard
                    user={user}
                    onUpgrade={handleUpgrade}
                    upgradeLoading={upgradeLoading}
                />

                <DashboardCharts
                    user={user}
                    writtenBooks={writtenBooks}
                    readBooks={readBooks}
                />

                <WrittenBooksSection
                    books={writtenBooks}
                />

                <ReadBooksSection
                    books={readBooks}
                    onRemoveBook={handleRemoveReadBook}
                    removingBookId={removingBookId}
                />
            </PageContainer>
        </>
    );
}