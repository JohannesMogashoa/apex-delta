import { useState } from "react";
import { getSnapshots, runMarketCheck, useAction, useQuery } from "wasp/client/operations";

import "./Main.css";

const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export function MainPage() {
  const { data: snapshots, isLoading, error } = useQuery(getSnapshots);
  const requestMarketCheck = useAction(runMarketCheck);
  const [isRequesting, setIsRequesting] = useState(false);

  async function handleMarketCheck() {
    setIsRequesting(true);
    try {
      await requestMarketCheck(undefined);
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">South Africa · ZAR</p>
          <h1>ApexDelta</h1>
          <p className="lede">Vehicle arbitrage and sweet-spot tracking for your next upgrade.</p>
        </div>
        <button className="primary-button" disabled={isRequesting} onClick={handleMarketCheck}>
          {isRequesting ? "Queuing check…" : "Run market check"}
        </button>
      </header>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Latest intelligence</p>
            <h2>Market snapshots</h2>
          </div>
          <span className="status-pill">Daily · 08:00 SAST</span>
        </div>

        {isLoading && <p className="muted">Loading snapshots…</p>}
        {error && <p className="error">Could not load snapshots: {error.message}</p>}
        {!isLoading && !error && snapshots?.length === 0 && (
          <div className="empty-state">
            <strong>No snapshots yet.</strong>
            <span>Run a market check to populate the tracker.</span>
          </div>
        )}

        <div className="snapshot-grid">
          {snapshots?.map((snapshot) => (
            <article className="snapshot-card" key={snapshot.id}>
              <div className="card-topline">
                <span>{new Date(snapshot.createdAt).toLocaleString("en-ZA")}</span>
                <span className={snapshot.isHighAlert ? "alert-badge" : "ok-badge"}>
                  {snapshot.isHighAlert ? "HIGH ALERT" : "Within range"}
                </span>
              </div>
              <h3>{snapshot.targetModel}</h3>
              <dl>
                <div>
                  <dt>Repaired value</dt>
                  <dd>{zar.format(snapshot.repairedValue)}</dd>
                </div>
                <div>
                  <dt>Lowest target</dt>
                  <dd>{zar.format(snapshot.targetPrice)}</dd>
                </div>
                <div>
                  <dt>Price gap</dt>
                  <dd>{zar.format(snapshot.priceGap)}</dd>
                </div>
              </dl>
              <p className="muted">{snapshot.checkedListings} listings checked</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
