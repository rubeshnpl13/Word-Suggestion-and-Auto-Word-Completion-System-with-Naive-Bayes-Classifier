import { Link } from 'react-router-dom';
import './footer.css';
function Footer() {
  return (
    <div>
      <footer className="bg-dark py-3">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-end">
              <p className="text-white text-right">Follow us on:</p>
              <Link to="https://twitter.com" className="ms-3" target="_blank">
                <i className="bi bi-twitter"></i>
              </Link>
              <Link
                to="https://www.facebook.com/nishanta.nepal.33/"
                className="ms-3"
                target="_blank"
              >
                <i className="bi bi-facebook"></i>
              </Link>
              <Link
                to="https://www.instagram.com/nishantnepal_0/"
                className="ms-3"
                target="_blank"
              >
                <i className="bi bi-instagram"></i>
              </Link>
            </div>
          </div>
          <div className="row text-center">
            <p className="text-white">&copy; 2023; Word Suggestion System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
