import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="grid min-h-screen place-items-center px-6 text-center"
      style={{ background: "var(--surface-0)", color: "var(--ink-1)" }}
    >
      <div>
        <p className="font-mono-data text-sm" style={{ color: "var(--brand)" }}>
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold">This parcel isn't on the map</h1>
        <p className="mt-2" style={{ color: "var(--ink-2)" }}>
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full px-5 py-2.5 text-sm font-semibold"
          style={{ background: "var(--brand)", color: "var(--surface-1)" }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
