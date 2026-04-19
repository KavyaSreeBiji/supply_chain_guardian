function Dashboard({ inventoryData, shipmentsData, marketData }) {
    const criticalItems = inventoryData.filter(i => Number(i.stock) <= Number(i.reorder_point) * 0.3);
    const delayed = shipmentsData.filter(s => s.status !== "on-track");
    
    let resilience = 0;
    if (inventoryData.length > 0 && shipmentsData.length > 0) {
        resilience = Math.round(((inventoryData.filter(i => Number(i.stock) >= Number(i.reorder_point)).length / inventoryData.length) * 0.5 +
        (shipmentsData.filter(s => s.status === "on-track").length / shipmentsData.length) * 0.5) * 100);
    }

    return (
        <section id="dashboard">
            <div className="dashboard-grid">
                <div className="metric-card" id="metric-critical">
                    <span className="metric-label">CRITICAL ITEMS</span>
                    <div className="metric-value">{criticalItems.length}</div>
                    <span className="metric-sub">below reorder point</span>
                </div>
                <div className="metric-card" id="metric-delayed">
                    <span className="metric-label">DELAYED SHIPMENTS</span>
                    <div className="metric-value">{delayed.length}</div>
                    <span className="metric-sub">need attention</span>
                </div>
                <div className="metric-card" id="metric-total">
                    <span className="metric-label">TOTAL SKUS</span>
                    <div className="metric-value">{inventoryData.length}</div>
                    <span className="metric-sub">tracked items</span>
                </div>
                <div className="metric-card" id="metric-resilience">
                    <span className="metric-label">RESILIENCE SCORE</span>
                    <div className="metric-value">{resilience}%</div>
                    <span className="metric-sub">supply chain health</span>
                </div>
            </div>

            <div id="dashboard-alerts-container">
            {criticalItems.length > 0 && (
                <div style={{background:"var(--bg-critical)", border:"1px solid #7F1D1D", borderRadius:"10px", padding:"16px", marginBottom:"20px"}}>
                    <div style={{color:"var(--accent-red)", fontWeight:"700", fontSize:"13px", marginBottom:"10px"}}>🚨 CRITICAL STOCK ALERTS &mdash; {criticalItems.length} items require immediate action</div>
                    {criticalItems.map(item => (
                        <div key={item.sku} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #2D1515"}}>
                            <div><span style={{color:"#FCA5A5", fontWeight:"600"}}>{item.name}</span> <span style={{color:"var(--text-muted)", fontSize:"12px", marginLeft:"8px"}}>{item.sku}</span></div>
                            <div style={{textAlign:"right"}}><span style={{color:"var(--accent-red)", fontFamily:"var(--font-mono)", fontWeight:"700"}}>{item.stock} {item.unit}</span> <span style={{color:"var(--text-muted)", fontSize:"12px"}}>/ {item.reorder_point} reorder</span></div>
                        </div>
                    ))}
                </div>
            )}
            </div>

            <div className="dashboard-columns">
                <div className="dashboard-panel">
                    <h3>Active Shipments</h3>
                    <div className="list-container">
                        {shipmentsData.slice(0, 5).map(s => (
                            <div className="dash-item" key={s.shipment_id}>
                                <div><div className="dash-item-title">{s.shipment_id}</div><div className="dash-item-sub">{s.item_name}</div></div>
                                <div style={{textAlign:"right"}}>
                                    <div style={{fontSize:"11px", color:"var(--text-muted)", marginBottom:"4px"}}>ETA {s.eta}</div>
                                    <span className={`badge ${s.status==='on-track'?'ok':s.status==='delayed'?'critical':'warning'}`}>{s.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="dashboard-panel">
                    <h3>Market Signals</h3>
                    <div className="list-container">
                        {marketData.slice(0, 5).map(m => (
                            <div className="dash-item" key={m.item}>
                                <div><div className="dash-item-title">{m.item}</div><div className="dash-item-sub">{m.action}</div></div>
                                <div style={{fontSize:"12px", fontWeight:"700", fontFamily:"var(--font-mono)", color:m.trend.startsWith('+')?'var(--accent-red)':'var(--accent-green)'}}>{m.trend}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;
