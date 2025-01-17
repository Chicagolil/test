import { Box } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HistoriquePage, HomePage, LoginPage, SettingsPage } from "./Pages";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const socket = io("http://localhost:5050/", {
  reconnection: true,
  reconnectionAttempts: 5, // Nombre d'essais avant de renoncer
  reconnectionDelay: 2000, // Délai de 2 secondes entre chaque tentative
});



const App = () => {
	useEffect(() => {
		// Événements Socket.IO
		socket.on("connect", () => {
		  console.log("Connecté au serveur Socket.IO");
		});
	
		socket.on("disconnect", (reason) => {
		  console.warn("Déconnecté de Socket.IO :", reason);
		});
	
		socket.on("connect_error", (error) => {
		  console.error("Erreur de connexion Socket.IO :", error);
		});
	
		// Écouter les notifications en temps réel
		socket.on("notification", (data) => {
		  if (data.type === "limite_friandise") {
			// Affiche une notification via react-toastify
			toast.warn(data.message, {
			  position: "top-right",
			  autoClose: 5000,
			  hideProgressBar: false,
			  closeOnClick: true,
			  pauseOnHover: true,
			  draggable: true,
			  progress: undefined,
			});
		  }
		});
	
		// Nettoyage des listeners à la destruction du composant
		return () => {
		  socket.off("connect");
		  socket.off("disconnect");
		  socket.off("connect_error");
		  socket.off("notification");
		};
	  }, []);
	

	const router = createBrowserRouter([
		{
			path: "/",
			element: <HomePage />,
		},
		{
			path: "/sign_up",
			element: <LoginPage isSigningUp={true} />,
		},
		{ path: "/login", element: <LoginPage isSigningUp={false} /> },
		{ path: "/historique", element: <HistoriquePage /> },
		{ path: "/settings", element: <SettingsPage /> },
	]);
	return (
		<Box className="h-screen bg-bg">
			<RouterProvider router={router} />
			<ToastContainer />
		</Box>
		
	);
};

export default App;
