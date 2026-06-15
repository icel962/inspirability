import "./styles/globals.css";
import "./styles/ui-feedback.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import Toast from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import VisitTracker from "./components/VisitTracker";

export const metadata = {
  title: "Inspirability",
  description: "Inspirability special needs support platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main className="page-animation">{children}</main>
        <Footer />
        <ChatBot />
        <Toast />
        <ConfirmModal />
        <VisitTracker />
      </body>
    </html>
  );
}