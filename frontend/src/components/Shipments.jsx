function Shipments({ shipmentsData }) {
    const statusColors = {'delayed': 'critical', 'on-track': 'ok', 'at-risk': 'warning'};
    const riskColors = {'high': 'critical', 'medium': 'warning', 'low': 'ok'};
    
    return (
        <section id="shipments">
            <div className="section-header">
                <h2>Shipment Tracker & Risk Assessment</h2>
            </div>
            <div className="shipments-grid">
                {shipmentsData.map(s => (
                    <div className={`list-card ${s.status === 'delayed' ? 'urgent' : s.status === 'at-risk' ? 'warning' : ''}`} key={s.shipment_id}>
                        <div style={{display:"flex", justifyContent:"space-between", marginBottom:"12px"}}>
                            <div><span style={{fontFamily:"var(--font-mono)", color:"var(--accent-amber)", fontWeight:"700"}}>{s.shipment_id}</span> <span style={{fontSize:"12px", color:"var(--text-muted)", marginLeft:"8px"}}>{s.carrier}</span></div>
                            <div style={{display:"flex", gap:"8px"}}>
                                <span className={`badge ${riskColors[s.risk.toLowerCase()] || 'ok'}`}>{s.risk} RISK</span>
                                <span className={`badge ${statusColors[s.status] || 'ok'}`}>{s.status}</span>
                            </div>
                        </div>
                        <div style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"16px"}}>
                            <div><div style={{fontSize:"11px", color:"var(--text-muted)"}}>Cargo</div><div style={{fontWeight:"500"}}>{s.item_name}</div></div>
                            <div><div style={{fontSize:"11px", color:"var(--text-muted)"}}>Origin</div><div style={{color:"#94A3B8"}}>{s.origin}</div></div>
                            <div><div style={{fontSize:"11px", color:"var(--text-muted)"}}>Destination</div><div style={{color:"#94A3B8"}}>{s.destination}</div></div>
                            <div><div style={{fontSize:"11px", color:"var(--text-muted)"}}>ETA</div><div style={{fontWeight:"700", fontFamily:"var(--font-mono)"}}>{s.eta}</div></div>
                        </div>
                        {s.delay_reason && (
                            <div style={{marginTop:"12px", padding:"8px 12px", background:"rgba(239, 68, 68, 0.1)", borderLeft:"3px solid var(--accent-red)", borderRadius:"4px", fontSize:"12px", color:"#FCA5A5"}}>
                                ⚠️ {s.delay_reason}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Shipments;
