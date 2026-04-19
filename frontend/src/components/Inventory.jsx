import { useState } from 'react';

function InventoryRow({ item, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [stock, setStock] = useState(item.stock);
    const [reorder, setReorder] = useState(item.reorder_point);
    const [lead, setLead] = useState(item.lead_days);
    
    const stockNum = Number(item.stock);
    const reorderNum = Number(item.reorder_point);
    
    const isCritical = stockNum <= reorderNum * 0.3;
    const isLow = stockNum > reorderNum * 0.3 && stockNum < reorderNum;
    const isOk = stockNum >= reorderNum;
    const pct = Math.min((stockNum / (reorderNum * 1.5)) * 100, 100);
    
    let color = 'var(--accent-green)';
    let cls = '';
    let badge = <span className="badge ok">✅ OK</span>;
    
    if (isCritical) {
        color = 'var(--accent-red)';
        cls = 'urgent';
        badge = <span className="badge critical">🚨 CRITICAL</span>;
    } else if (isLow) {
        color = 'var(--accent-amber)';
        cls = 'warning';
        badge = <span className="badge warning">⚠️ LOW</span>;
    }

    const handleSave = async () => {
        setIsEditing(false);
        await onSave(item.sku, { stock, reorder, lead });
    };

    if (isEditing) {
        return (
            <div className={`list-card ${cls}`}>
                <div className="inv-row" style={{ alignItems: "flex-end" }}>
                    <div>
                        <div className="inv-name">{item.name}</div>
                        <div className="inv-sku">{item.sku}</div>
                    </div>
                    <div>
                        <label style={{fontSize:"11px", color:"var(--text-muted)"}}>Stock</label>
                        <input type="number" value={stock} onChange={e => setStock(e.target.value)} style={{width:"100%", display:"block", padding:"6px", marginTop:"4px", background:"var(--bg-dark)", color:"var(--text-primary)", border:"1px solid var(--border-light)", borderRadius:"4px"}} />
                    </div>
                    <div style={{display:"flex", gap:"8px"}}>
                        <div style={{flex:1}}>
                            <label style={{fontSize:"11px", color:"var(--text-muted)"}}>Reorder Pt</label>
                            <input type="number" value={reorder} onChange={e => setReorder(e.target.value)} style={{width:"100%", display:"block", padding:"6px", marginTop:"4px", background:"var(--bg-dark)", color:"var(--text-primary)", border:"1px solid var(--border-light)", borderRadius:"4px"}} />
                        </div>
                        <div style={{flex:1}}>
                            <label style={{fontSize:"11px", color:"var(--text-muted)"}}>Lead (d)</label>
                            <input type="number" value={lead} onChange={e => setLead(e.target.value)} style={{width:"100%", display:"block", padding:"6px", marginTop:"4px", background:"var(--bg-dark)", color:"var(--text-primary)", border:"1px solid var(--border-light)", borderRadius:"4px"}} />
                        </div>
                    </div>
                    <div style={{textAlign:"right", paddingBottom:"2px"}}>
                        <button onClick={handleSave} style={{background:"#10B981", color:"#fff", border:"none", padding:"6px 12px", borderRadius:"4px", cursor:"pointer", fontSize:"12px", fontWeight:"600"}}>Save</button>
                        <button onClick={() => setIsEditing(false)} style={{background:"var(--bg-dark)", color:"var(--text-primary)", border:"1px solid var(--border-light)", padding:"5px 12px", borderRadius:"4px", cursor:"pointer", fontSize:"12px", marginLeft:"4px"}}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`list-card ${cls}`}>
            <div className="inv-row">
                <div>
                    <div className="inv-name">{item.name}</div>
                    <div className="inv-sku">{item.sku} &middot; {item.category}</div>
                </div>
                <div>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}>
                        <span className="inv-val" style={{color: color}}>{item.stock}</span>
                        <span style={{fontSize:"11px", color:"var(--text-muted)", alignSelf:"flex-end"}}>/ {item.reorder_point} reorder</span>
                    </div>
                    <div className="stock-bar-bg"><div className="stock-bar-fill" style={{width: `${pct}%`, background: color}}></div></div>
                </div>
                <div>
                    <div style={{fontSize:"11px", color:"var(--text-muted)"}}>Supplier</div>
                    <div style={{fontSize:"12px", fontWeight:"500"}}>{item.supplier}</div>
                    <div style={{fontSize:"11px", color:"#475569"}}>Lead time: {item.lead_days}d</div>
                </div>
                <div style={{textAlign:"right"}}>
                    {badge}
                    <button onClick={() => setIsEditing(true)} style={{display:"block", marginLeft:"auto", marginTop:"8px", background:"var(--bg-dark)", border:"1px solid var(--border-light)", color:"var(--text-primary)", borderRadius:"4px", padding:"4px 8px", fontSize:"11px", cursor:"pointer"}}>Edit</button>
                </div>
            </div>
        </div>
    );
}

function Inventory({ inventoryData, updateInventory }) {
    const handleSave = async (sku, { stock, reorder, lead }) => {
        try {
            const res = await fetch('/api/inventory/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    sku: sku, 
                    stock: parseInt(stock, 10), 
                    reorder_point: parseInt(reorder, 10), 
                    lead_days: parseInt(lead, 10) 
                })
            });
            const data = await res.json();
            if(!data.error) {
                updateInventory(data);
            } else {
                alert(data.error);
            }
        } catch(e) {
            alert("Error updating inventory.");
        }
    };

    return (
        <section id="inventory">
            <div className="section-header">
                <h2>Inventory Operations</h2>
            </div>
            <div className="inventory-grid">
                {inventoryData.map(item => (
                    <InventoryRow key={item.sku} item={item} onSave={handleSave} />
                ))}
            </div>
        </section>
    );
}

export default Inventory;
