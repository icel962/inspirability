import "../../styles/hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="overlay"></div>
      <div className="hero-content">
        <h1>Welcome to Inspirability</h1>
        <div className="icons">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-instagram"></i>
          <i className="fas fa-phone"></i>
        </div>
      </div>
    </section>
  );
}
