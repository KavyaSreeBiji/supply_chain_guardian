function Market({ marketData }) {
    return (
        <section id="market">
            <div className="section-header">
                <h2>Market Intelligence</h2>
            </div>
            <div className="market-grid">
                {marketData.map((m, idx) => {
                    const isUp = m.trend.startsWith('+');
                    const color = isUp ? 'var(--accent-red)' : 'var(--accent-green)';
                    const signalClass = m.signal === 'high' ? 'critical' : m.signal === 'buy' ? 'ok' : 'warning';
                    const signalEmoji = m.signal === 'buy' ? '📉 Buy Signal' : m.signal === 'high' ? '📈 Price Alert' : '👀 Monitor';
                    
                    return (
                        <div className="list-card" key={idx}>
                            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"8px"}}>
                                <div style={{fontWeight:"700"}}>{m.item}</div>
                                <div style={{fontSize:"18px", fontWeight:"800", fontFamily:"var(--font-mono)", color: color}}>{m.trend}</div>
                            </div>
                            <div style={{fontSize:"12px", color:"var(--text-muted)", lineHeight:"1.5", marginBottom:"12px"}}>{m.action}</div>
                            <span className={`badge ${signalClass}`}>{signalEmoji}</span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Market;
