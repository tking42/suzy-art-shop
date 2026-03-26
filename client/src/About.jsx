import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <h1>About</h1>

      <div className="about-intro">
        <p>Tea and Cake Productions is a small independent art studio based in the UK, creating original works that explore colour, texture, and the quiet moments of everyday life.</p>
      </div>

      <div className="about-sections">
        <section className="about-section">
          <h2>The Journey</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </section>

        <section className="about-section">
          <h2>The Work</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.</p>
          <p>Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.</p>
        </section>

        <section className="about-section">
          <h2>The Studio</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris.</p>
          <p>Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus.</p>
        </section>
      </div>
    </div>
  );
};

export default About;
