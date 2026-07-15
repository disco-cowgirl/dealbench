import { Link } from "react-router-dom";
import { useDocumentMeta } from "../lib/useDocumentMeta";

export default function NotFound() {
  useDocumentMeta(
    "404 — DealBench",
    "This page isn't in the ledger. Head back to DealBench to browse verified creator payouts.",
  );

  return (
    <section className="notfound-section">
      <div className="container notfound-inner reveal is-visible">
        <p className="eyebrow">· NOT FOUND ·</p>
        <h1>No entry at this row.</h1>
        <p className="sec-sub">
          Whatever you were looking for isn't in the ledger. It happens —
          even a database with 41,000+ deals has gaps.
        </p>
        <Link to="/" className="btn btn-lg">Back to DealBench</Link>
      </div>
    </section>
  );
}
