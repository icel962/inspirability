"use client";
import Link from "next/link";
import "./clubdetails.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ClubPage() {
  return (
    <>

      <section className="club">

        <div className="container">

          {/* LEFT SIDE */}
          <div className="left">

            <img src="/clubs/ahly.png" className="logo" />

            <div className="details">
              <h1>Ahly Club</h1>

              <p><b>special support:</b> physical</p>
              <p><b>distance:</b> 5km-10km</p>
              <p><b>review:</b> ⭐⭐⭐⭐⭐</p>

              <br />

              <p><b>sessions availability :</b> private session</p>
              <p className="green">special coach availability</p>
              <p><b>Email:</b> alahlyplatforms@gmail.com</p>
              <p><b>Fees:</b> 2,500 EGP / Month</p>

              <h2>Coach :</h2>

              <div className="coach">
                <img src="/coach1.jpg" />
                <img src="/coach2.jpg" />
                <img src="/coach3.jpg" />
              </div>

              <Link href="/appointment" className="appointment">
                Make Appointment
              </Link>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="right">

            <h2>Ahly contact media</h2>

            <button className="btn whatsapp">Whats app</button>
            <button className="btn facebook">Facebook</button>
            <button className="btn call">Call</button>
            <button className="btn instagram">Instagram</button>
            <button className="btn feedback">Add Feedback</button>

          </div>

        </div>

      </section>

    </>
  );
}