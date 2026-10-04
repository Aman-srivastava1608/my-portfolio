import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <Link className="wordmark" href="/" aria-label="Aman Kumar home">Aman Kumar</Link>
      <div className="not-found-art" aria-hidden="true">404</div>
      <p className="eyebrow">A SMALL DETOUR</p>
      <h1>This page took<br />a different path.</h1>
      <p>The page you're looking for isn't here.<br />There's plenty to explore back at the portfolio.</p>
      <Link className="button primary" href="/">Back to the portfolio <FiArrowUpRight /></Link>
    </main>
  );
}
