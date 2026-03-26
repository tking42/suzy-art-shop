import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-brand">Tea and Cake Productions</span>
        <div className="footer-links">
          <a href="https://instagram.com/tea.and.cake_productions" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="mailto:hello@teaandcakeproductions.com">
            hello@teaandcakeproductions.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
