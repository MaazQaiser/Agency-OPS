"use client";

import { useMemo, useState } from "react";
import { roiDefaults } from "@/data/producerScorecard";
import { calcROI, fmt } from "@/lib/formatting";

export function ROICalculatorTab() {
  const [spend, setSpend] = useState(roiDefaults.spend.value);
  const [cpl, setCpl] = useState(roiDefaults.cpl.value);
  const [closeRate, setCloseRate] = useState(roiDefaults.closeRate.value);
  const [prem, setPrem] = useState(roiDefaults.prem.value);
  const [comm, setComm] = useState(roiDefaults.comm.value);

  const result = useMemo(
    () => calcROI({ spend, cpl, closeRate, prem, comm }),
    [spend, cpl, closeRate, prem, comm]
  );

  return (
    <>
      <div className="section-hdr">
        <div className="sh-label">Internet Lead ROI Calculator: Internal</div>
      </div>
      <div className="roi-section">
        <div className="roi-grid">
          <div>
            <p style={{ fontSize: "var(--font-size-12)", color: "var(--muted)", marginBottom: 18 }}>
              Adjust inputs to see exactly what lead spend is returning: and what improving close rate is worth.
            </p>
            <div className="roi-input-group">
              <label>Monthly Lead Spend <span>${spend.toLocaleString()}</span></label>
              <input type="range" className="roi-slider" min={roiDefaults.spend.min} max={roiDefaults.spend.max} value={spend} step={roiDefaults.spend.step} onChange={(e) => setSpend(+e.target.value)} />
            </div>
            <div className="roi-input-group">
              <label>Cost Per Lead <span>${cpl}</span></label>
              <input type="range" className="roi-slider" min={roiDefaults.cpl.min} max={roiDefaults.cpl.max} value={cpl} step={roiDefaults.cpl.step} onChange={(e) => setCpl(+e.target.value)} />
            </div>
            <div className="roi-input-group">
              <label>Current Close Rate <span>{closeRate}%</span></label>
              <input type="range" className="roi-slider" min={roiDefaults.closeRate.min} max={roiDefaults.closeRate.max} value={closeRate} step={roiDefaults.closeRate.step} onChange={(e) => setCloseRate(+e.target.value)} />
            </div>
            <div className="roi-input-group">
              <label>Avg Annual Premium <span>${prem.toLocaleString()}</span></label>
              <input type="range" className="roi-slider" min={roiDefaults.prem.min} max={roiDefaults.prem.max} value={prem} step={roiDefaults.prem.step} onChange={(e) => setPrem(+e.target.value)} />
            </div>
            <div className="roi-input-group">
              <label>Commission % <span>{comm}%</span></label>
              <input type="range" className="roi-slider" min={roiDefaults.comm.min} max={roiDefaults.comm.max} value={comm} step={roiDefaults.comm.step} onChange={(e) => setComm(+e.target.value)} />
            </div>
          </div>
          <div>
            <div className="roi-result">
              <div style={{ fontSize: "var(--font-size-12)", letterSpacing: 0.03, color: "var(--muted)", marginBottom: 4 }}>Monthly Revenue from Leads</div>
              <div style={{ fontSize: "var(--font-size-32)", fontWeight: 800, color: "var(--primary)" }}>{fmt(result.rev)}</div>
              <div style={{ fontSize: "var(--font-size-12)", color: "var(--muted)", marginTop: 4 }}>{result.sub}</div>
            </div>
            <div className="roi-results-grid">
              <div className="roi-mini"><div className="rml">Leads Purchased</div><div className="rmv" style={{ color: "var(--blue)" }}>{result.leads}</div></div>
              <div className="roi-mini"><div className="rml">Policies Bound</div><div className="rmv" style={{ color: "var(--green)" }}>{result.bound}</div></div>
              <div className="roi-mini"><div className="rml">Commission Earned</div><div className="rmv" style={{ color: "var(--primary)" }}>{fmt(result.commission)}</div></div>
              <div className="roi-mini"><div className="rml">ROI on Ad Spend</div><div className="rmv" style={{ color: "var(--amber)" }}>{result.roi}%</div></div>
              <div className="roi-mini" style={{ gridColumn: "span 2", borderColor: "rgba(39,174,96,0.3)" }}>
                <div className="rml">If close rate hits 25% → Commission</div>
                <div className="rmv" style={{ color: "var(--green)" }}>{fmt(result.upside)} ({result.upsideBound} policies)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
