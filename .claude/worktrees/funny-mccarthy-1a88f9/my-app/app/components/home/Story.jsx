import "../../styles/story.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function Story() {
  return (
    <section className="story">
      <h2>Take a turn towards our inspiring story</h2>
      <p className="subtitle">
        We merge four services consulting and brilliant Services for the parent
        who searches for specified and unique kind of service for his child
        customized by his own preferences
      </p>

      <div className="story-cards">
        <div className="story-card">
          <img src="/images/story1.png" alt="Our goals" />
          <h3>Our goals</h3>
          <p>To give you best options</p>
          <button>Know more -&gt;</button>
        </div>
        <div className="story-card">
          <img src="/images/story2.png" alt="Our vision" />
          <h3>Our vision</h3>
          <p>Trust us for your loved ones</p>
          <button>Know more -&gt;</button>
        </div>
        <div className="story-card">
          <img src="/images/story3.png" alt="Our mission" />
          <h3>Our mission</h3>
          <p>Provided the best choices</p>
          <button>Know more -&gt;</button>
        </div>
        <div className="story-card">
          <img src="/images/story4.png" alt="Our story" />
          <h3>Our Story</h3>
          <p>Best surgeon cardiologist</p>
          <button>Know more -&gt;</button>
        </div>
      </div>
    </section>
  );
}
