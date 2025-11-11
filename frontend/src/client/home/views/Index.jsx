import { Link } from 'react-router-dom';

import "./index.css";
function Index() {
    return (
        <div class="word-home">
        <h1>Welcome to Word Suggestion</h1>
        <Link className="btn btn-primary mx-2" to="/search">Get Started</Link>
        </div>
    );
}

export default Index;