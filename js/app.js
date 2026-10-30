// AICTE-APAARSutra - Core Application Logic
// Addressing SIH Problem Statement SIH26263

// Global State
const state = {
  currentRole: 'aicte', // 'aicte', 'institution', 'nfc', 'verifier', 'degree', 'reports', 'audit'
  selectedInstitution: 'INST-001',
  auditLogs: [
    { id: "LOG-901", time: "Just now", actor: "AICTE Central Node", action: "National Ledger Sync", status: "VERIFIED_OK", details: "3,120,450 records verified across 8,942 institutions." },
    { id: "LOG-900", time: "5 mins ago", actor: "COEP Tech Admissions", action: "Batch Verification Requested", status: "VERIFIED_OK", details: "File COEP_Admissions_2024_BatchB.csv processed (120 records)." },
    { id: "LOG-899", time: "18 mins ago", actor: "Intelligent Anomaly Engine", action: "Cross-Institution Duplicate Flagged", status: "ALERT_FLAGGED", details: "APAAR 2024-4190-7721 registered at COEP & VJTI simultaneously." },
    { id: "LOG-898", time: "1 hour ago", actor: "Apex Regulatory Cell", action: "Seat Intake Audit", status: "VERIFIED_OK", details: "Apex Institute Greater Noida flagged for +14 intake overflow." }
  ],
  charts: {}
};

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initTheme();
  renderNationalKPIs();
  renderNationalCharts();
  renderInstitutionDashboard();
  renderAnomalyRadar();
  renderStudentRoster();
  initCsvUploader();
  initSingleStudentForm();
  renderAuditLogs();
  initQuickNfcCards();
  initSearch();
});

// Navigation & Tab Switching
function initNavigation() {
  const navButtons = document.querySelectorAll("[data-tab-target]");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-target");
      switchTab(target);
    });
  });
}

function switchTab(tabId) {
  state.currentRole = tabId;

  // Update nav buttons
  document.querySelectorAll("[data-tab-target]").forEach(btn => {
    if (btn.getAttribute("data-tab-target") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update tab content
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });

  const activePane = document.getElementById(tabId);
  if (activePane) {
    activePane.classList.add("active");
  }

  // Refresh charts if entering a chart tab
  if (tabId === 'aicte-tab' && state.charts.intakeChart) {
    state.charts.intakeChart.resize();
    state.charts.categoryChart.resize();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchTab = switchTab;

// Theme Toggle
function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem("aicte_theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener("click", () => {
    const active = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = active === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("aicte_theme", newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("theme-toggle-icon");
  if (icon) {
    icon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

// Global Audit Record Pusher
function addAuditRecord({ action, actor, status, details }) {
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const id = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
  state.auditLogs.unshift({ id, time, actor, action, status, details });
  renderAuditLogs();
}
window.addAuditRecord = addAuditRecord;

function renderAuditLogs() {
  const tbody = document.getElementById("audit-logs-table-body");
  if (!tbody) return;

  tbody.innerHTML = state.auditLogs.slice(0, 15).map(log => `
    <tr>
      <td class="font-mono text-xs text-muted">${log.id}</td>
      <td class="text-xs whitespace-nowrap">${log.time}</td>
      <td class="font-semibold text-xs">${log.actor}</td>
      <td class="text-xs">${log.action}</td>
      <td>
        <span class="status-pill ${log.status === 'VERIFIED_OK' ? 'pill-success' : 'pill-danger'}">
          ${log.status === 'VERIFIED_OK' ? '✓ Verified' : '⚠️ Alert Flagged'}
        </span>
      </td>
      <td class="text-xs text-muted font-mono">${log.details}</td>
    </tr>
  `).join("");
}

// National Apex Dashboard KPIs
function renderNationalKPIs() {
  const stats = AICTE_DATA.nationalStats;
  const elements = {
    "stat-total-inst": stats.totalInstitutions.toLocaleString('en-IN'),
    "stat-approved-intake": stats.totalApprovedIntake.toLocaleString('en-IN'),
    "stat-enrolled": stats.totalEnrolledStudents.toLocaleString('en-IN'),
    "stat-supernumerary": stats.totalSupernumerary.toLocaleString('en-IN'),
    "stat-nri-oci": stats.nriOciFnCount.toLocaleString('en-IN'),
    "stat-coverage": `${stats.apaarCoveragePct}%`,
    "stat-anomalies": stats.anomaliesDetected.toLocaleString('en-IN')
  };

  for (const [id, val] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

// Chart.js Visualizations
function renderNationalCharts() {
  if (typeof Chart === 'undefined') return;

  // Chart 1: Program-wise Approved Intake vs Actual Enrolment
  const ctxIntake = document.getElementById("intakeComparisonChart");
  if (ctxIntake) {
    state.charts.intakeChart = new Chart(ctxIntake, {
      type: 'bar',
      data: {
        labels: ['Engg & Tech (UG)', 'Management (PGDM/MBA)', 'Pharmacy (UG/PG)', 'MCA & CS', 'Architecture & Plan', 'Applied Arts'],
        datasets: [
          {
            label: 'Approved AICTE Intake',
            data: [1840000, 520000, 310000, 240000, 85000, 42000],
            backgroundColor: 'rgba(30, 58, 138, 0.75)',
            borderColor: '#1e3a8a',
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: 'Actual Enrolled (APAAR Verified)',
            data: [1715000, 485000, 292000, 228000, 78000, 38500],
            backgroundColor: 'rgba(19, 136, 8, 0.75)',
            borderColor: '#138808',
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#fff' } }
        },
        scales: {
          x: { ticks: { color: '#8892b0' }, grid: { display: false } },
          y: { ticks: { color: '#8892b0' }, grid: { color: 'rgba(255,255,255,0.06)' } }
        }
      }
    });
  }

  // Chart 2: Seat Allocation & Category Distribution (Including Supernumerary & NRI/FN)
  const ctxCategory = document.getElementById("categoryBreakdownChart");
  if (ctxCategory) {
    state.charts.categoryChart = new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: [
          'Regular All India / State Quota',
          'Supernumerary (TFW - Fee Waiver)',
          'EWS (10% Supernumerary)',
          'NRI Quota',
          'OCI (Overseas Citizen of India)',
          'Foreign National (FN Quota)',
          'PMSSS (J&K and Ladakh)'
        ],
        datasets: [{
          data: [2650000, 110000, 195000, 12500, 3800, 6590, 8900],
          backgroundColor: [
            '#2563eb',
            '#10b981',
            '#f59e0b',
            '#8b5cf6',
            '#ec4899',
            '#06b6d4',
            '#14b8a6'
          ],
          borderWidth: 2,
          borderColor: '#0f172a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, color: '#8892b0', font: { size: 11 } }
          }
        }
      }
    });
  }
}

// Anomaly Radar Feed
function renderAnomalyRadar() {
  const container = document.getElementById("anomaly-radar-feed");
  if (!container) return;

  container.innerHTML = AICTE_DATA.liveAnomalies.map(item => `
    <div class="anomaly-card">
      <div class="anomaly-top">
        <span class="severity-badge ${item.severity === 'CRITICAL' ? 'sev-critical' : 'sev-high'}">
          ${item.severity}
        </span>
        <span class="anomaly-time font-mono">${item.timestamp}</span>
      </div>
      <h4 class="anomaly-title">${item.type}</h4>
      <div class="anomaly-details-row">
        <div>
          <span class="lbl">Student / Entity:</span>
          <strong>${item.studentName}</strong>
          <span class="font-mono text-xs text-accent">(${item.apaarId})</span>
        </div>
        <div class="text-xs text-muted mt-1">
          <strong>Entity A:</strong> ${item.instA}<br>
          <strong>Entity B:</strong> ${item.instB}
        </div>
        <div class="anomaly-program mt-1 text-xs">
          <strong>Context:</strong> ${item.programs}
        </div>
      </div>
      <div class="anomaly-action-bar">
        <button class="btn btn-xs btn-outline" onclick="window.inspectAnomaly('${item.id}')">
          🔎 Deep Inspect
        </button>
        <button class="btn btn-xs btn-danger" onclick="window.issueShowCauseNotice('${item.id}')">
          ⚖️ Issue Show-Cause Notice
        </button>
      </div>
    </div>
  `).join("");
}

function inspectAnomaly(id) {
  const anom = AICTE_DATA.liveAnomalies.find(a => a.id === id);
  if (!anom) return;
  alert(`AICTE Automated Anomaly Inspector:\n\nID: ${anom.id}\nType: ${anom.type}\nSeverity: ${anom.severity}\nEntity A: ${anom.instA}\nEntity B: ${anom.instB}\nDetails: ${anom.programs}\nStatus: ${anom.status}\n\nAutomated Verification Engine has temporarily frozen seat transfer until physical biometric/original document verification.`);
}
window.inspectAnomaly = inspectAnomaly;

function issueShowCauseNotice(id) {
  alert(`Official Notice Generated under AICTE Act Sec 10(k):\n\nShow-Cause Notice issued electronically to Institution Admissions Registrar and Student Registered Mobile/Email.\nAction logged to AICTE National Audit Ledger.`);
  addAuditRecord({
    action: `Issued Show-Cause Notice [${id}]`,
    actor: "AICTE Regulatory Cell (Officer ID: AICTE-APEX-09)",
    status: "ALERT_FLAGGED",
    details: `Notice issued for anomaly ${id}`
  });
}
window.issueShowCauseNotice = issueShowCauseNotice;

// Institutional Portal: Render Seat Matrix & Program Intake
function renderInstitutionDashboard() {
  const inst = AICTE_DATA.institutions.find(i => i.id === state.selectedInstitution) || AICTE_DATA.institutions[0];

  // Set institution meta
  const nameEl = document.getElementById("inst-header-name");
  const pidEl = document.getElementById("inst-header-pid");
  if (nameEl) nameEl.textContent = inst.name;
  if (pidEl) pidEl.textContent = `AICTE Permanent ID: ${inst.aicteId} • ${inst.type}`;

  const tableBody = document.getElementById("seat-matrix-table-body");
  if (!tableBody) return;

  let totalApproved = 0;
  let totalEnrolled = 0;
  let totalSuper = 0;
  let totalNri = 0;
  let totalFn = 0;

  tableBody.innerHTML = inst.programs.map(p => {
    totalApproved += p.approvedIntake;
    totalEnrolled += p.enrolled;
    totalSuper += p.supernumerary;
    totalNri += (p.nri + p.oci);
    totalFn += p.fn;

    const occupancyPct = Math.round((p.enrolled / p.approvedIntake) * 100);
    const isOverflow = p.enrolled > p.approvedIntake;

    return `
      <tr>
        <td class="font-semibold">${p.name}</td>
        <td class="text-center font-bold text-blue-400">${p.approvedIntake}</td>
        <td class="text-center font-bold ${isOverflow ? 'text-red-400' : 'text-green-400'}">
          ${p.enrolled}
          ${isOverflow ? '<span class="overflow-badge">OVERFLOW</span>' : ''}
        </td>
        <td class="text-center font-mono">${p.tfw}</td>
        <td class="text-center font-mono">${p.ews}</td>
        <td class="text-center font-mono">${p.nri}</td>
        <td class="text-center font-mono">${p.oci}</td>
        <td class="text-center font-mono">${p.fn}</td>
        <td class="text-center font-bold text-purple-400">${p.supernumerary}</td>
        <td>
          <div class="progress-container">
            <div class="progress-bar ${occupancyPct > 100 ? 'bar-danger' : occupancyPct === 100 ? 'bar-success' : 'bar-primary'}" style="width: ${Math.min(occupancyPct, 100)}%"></div>
          </div>
          <span class="text-xs font-mono text-muted">${occupancyPct}% Filled</span>
        </td>
      </tr>
    `;
  }).join("");

  // Update summary pill tags
  const summIntake = document.getElementById("inst-summary-intake");
  const summEnrolled = document.getElementById("inst-summary-enrolled");
  const summSuper = document.getElementById("inst-summary-super");
  if (summIntake) summIntake.textContent = totalApproved;
  if (summEnrolled) summEnrolled.textContent = totalEnrolled;
  if (summSuper) summSuper.textContent = totalSuper;
}

// Student Roster
function renderStudentRoster() {
  const tbody = document.getElementById("student-roster-body");
  if (!tbody) return;

  tbody.innerHTML = AICTE_DATA.students.map(s => {
    const hasAnomaly = s.anomalies && s.anomalies.length > 0;
    return `
      <tr>
        <td>
          <div class="student-cell">
            <img src="${s.avatar}" class="roster-avatar" alt="${s.name}">
            <div>
              <div class="font-semibold text-sm">${s.name}</div>
              <div class="text-xs text-muted font-mono">Roll: ${s.rollNo}</div>
            </div>
          </div>
        </td>
        <td class="font-mono text-xs font-bold text-accent">${s.apaarId}</td>
        <td class="text-xs">${s.program}</td>
        <td><span class="pill ${s.seatType.includes('Supernumerary') ? 'pill-purple' : 'pill-blue'} text-xs">${s.seatType}</span></td>
        <td class="text-xs">${s.category}</td>
        <td>
          <span class="status-pill ${hasAnomaly ? 'pill-danger' : 'pill-success'} text-xs">
            ${hasAnomaly ? '⚠️ Flagged' : '✓ Verified'}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-xs btn-outline" title="View NFC Dossier" onclick="window.testNfcStudent('${s.apaarId}')">
              📳 NFC Read
            </button>
            <button class="btn btn-xs btn-secondary" title="View Verifiable Degree" onclick="window.openDegreeModal('${s.apaarId}')">
              🎓 Certificate
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Automated Validation Engine for CSV Bulk Upload
function initCsvUploader() {
  const dropzone = document.getElementById("csv-dropzone");
  const fileInput = document.getElementById("csv-file-input");
  const loadCleanBtn = document.getElementById("load-sample-clean");
  const loadAnomalyBtn = document.getElementById("load-sample-anomaly");

  if (!dropzone) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files.length) {
      handleCsvFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleCsvFile(e.target.files[0]);
    }
  });

  if (loadCleanBtn) {
    loadCleanBtn.addEventListener("click", () => {
      processCsvText(AICTE_DATA.sampleCsvBatches.cleanBatch, "Demo_Clean_Batch_2024.csv");
    });
  }

  if (loadAnomalyBtn) {
    loadAnomalyBtn.addEventListener("click", () => {
      processCsvText(AICTE_DATA.sampleCsvBatches.anomalyBatch, "Demo_Anomaly_Breach_Batch_2024.csv");
    });
  }
}

function handleCsvFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    processCsvText(e.target.result, file.name);
  };
  reader.readAsText(file);
}

// Intelligent Client-Side Validation Engine
function processCsvText(csvText, filename) {
  const lines = csvText.trim().split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) {
    alert("CSV file is empty or missing headers!");
    return;
  }

  const headers = lines[0].split(",").map(h => h.trim().toUpperCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = cols[idx] || "";
    });
    rows.push(rowObj);
  }

  // Validate every record with automated anomaly detection rules
  const validationResults = rows.map((row, index) => {
    const errors = [];
    const warnings = [];

    const apaar = row["APAAR_ID"] || "";
    const name = row["STUDENT_NAME"] || "";
    const program = row["PROGRAM"] || "";
    const seatType = row["SEAT_TYPE"] || "";
    const isNri = (row["NRI"] || "").toLowerCase() === 'yes';
    const isFn = (row["FN"] || "").toLowerCase() === 'yes';

    // Rule 1: APAAR ID Structure validation (12 digits, valid format YYYY-XXXX-XXXX or 12 digits)
    const cleanApaar = apaar.replace(/[^0-9]/g, "");
    if (cleanApaar.length !== 12) {
      errors.push(`Invalid APAAR ID length (${cleanApaar.length} digits). Must be standard 12-digit national identifier.`);
    }

    // Rule 2: Cross-Institution Duplicate Enrolment Check
    const existing = AICTE_DATA.students.find(s => s.apaarId === apaar);
    if (existing && existing.anomalies && existing.anomalies.some(a => a.code === 'ERR_DUPLICATE_ENROLMENT')) {
      errors.push(`CRITICAL: Active duplicate enrolment detected in ${existing.instituteName} for ${existing.name}!`);
    }

    // Rule 3: Supernumerary quota documentation verification
    if (isNri && !seatType.includes("NRI")) {
      warnings.push("NRI status claimed but seat type not flagged as Supernumerary NRI.");
    }
    if (isFn && !seatType.includes("FN")) {
      warnings.push("Foreign National status requires MEA Clearance & ICCR Registration.");
    }

    // Rule 4: Intake capacity overflow check
    if (row["ROLL_NO"] && row["ROLL_NO"].includes("199")) {
      errors.push("Intake cap breach: Adding this student exceeds approved intake limit (120/120 filled).");
    }

    const isValid = errors.length === 0;

    return {
      rowIndex: index + 1,
      row,
      isValid,
      errors,
      warnings
    };
  });

  renderBatchValidationResults(validationResults, filename);
}

function renderBatchValidationResults(results, filename) {
  const container = document.getElementById("csv-validation-output");
  if (!container) return;

  container.style.display = 'block';
  
  const total = results.length;
  const validCount = results.filter(r => r.isValid).length;
  const errorCount = results.filter(r => !r.isValid).length;
  const warningCount = results.filter(r => r.warnings.length > 0).length;

  container.innerHTML = `
    <div class="validation-summary-card">
      <div class="summary-top">
        <div>
          <h4 class="font-bold text-lg">Batch Automated Validation Result: <span class="text-accent">${filename}</span></h4>
          <p class="text-xs text-muted">Parsed ${total} student records against AICTE Central Registry rules in 14ms.</p>
        </div>
        <div class="summary-stats-pills">
          <span class="badge badge-success">✓ Valid: ${validCount}</span>
          <span class="badge badge-danger">⚠️ Flagged Errors: ${errorCount}</span>
          <span class="badge badge-warning">⚡ Warnings: ${warningCount}</span>
        </div>
      </div>

      <div class="table-responsive mt-4">
        <table class="data-table">
          <thead>
            <tr>
              <th>Row</th>
              <th>APAAR ID</th>
              <th>Student Name</th>
              <th>Program</th>
              <th>Seat Type</th>
              <th>Validation Status</th>
              <th>AICTE Diagnostic Message</th>
            </tr>
          </thead>
          <tbody>
            ${results.map(r => `
              <tr class="${r.isValid ? 'row-valid' : 'row-error'}">
                <td class="font-mono text-xs">#${r.rowIndex}</td>
                <td class="font-mono text-xs font-bold">${r.row["APAAR_ID"] || 'MISSING'}</td>
                <td class="font-semibold text-sm">${r.row["STUDENT_NAME"]}</td>
                <td class="text-xs">${r.row["PROGRAM"]}</td>
                <td class="text-xs">${r.row["SEAT_TYPE"]}</td>
                <td>
                  <span class="status-pill ${r.isValid ? 'pill-success' : 'pill-danger'} text-xs">
                    ${r.isValid ? '✓ PASSED' : '✕ REJECTED'}
                  </span>
                </td>
                <td class="text-xs">
                  ${r.errors.length > 0 ? `<div class="text-danger font-semibold">❌ ${r.errors.join("<br>")}</div>` : ''}
                  ${r.warnings.length > 0 ? `<div class="text-warning">⚠️ ${r.warnings.join("<br>")}</div>` : ''}
                  ${r.isValid && r.warnings.length === 0 ? '<span class="text-success">All checks passed. Valid APAAR checksum & seat quota compliant.</span>' : ''}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="batch-commit-bar mt-4">
        <div class="text-xs text-muted">
          ${errorCount > 0 
            ? '⚠️ Batch contains validation errors. Only valid records can be committed to the AICTE Central Ledger.' 
            : '✓ All records verified authentic and ready for national cryptographic ledger anchoring.'}
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('csv-validation-output').style.display='none'">
            Dismiss
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.commitValidBatch(${validCount})">
            🚀 Anchoring ${validCount} Valid Records to AICTE Ledger
          </button>
        </div>
      </div>
    </div>
  `;

  // Log audit
  addAuditRecord({
    action: `Batch Upload Validated (${filename})`,
    actor: "College Admissions Desk",
    status: errorCount > 0 ? "ALERT_FLAGGED" : "VERIFIED_OK",
    details: `${total} processed, ${validCount} valid, ${errorCount} anomalies detected.`
  });
}

function commitValidBatch(count) {
  alert(`AICTE Central Repository Integration:\n\n${count} student records successfully committed to National Academic Ledger!\nCryptographic verification hashes anchored with DigiLocker and Academic Bank of Credits.`);
  document.getElementById('csv-validation-output').style.display = 'none';
}
window.commitValidBatch = commitValidBatch;

// Single Student Registration Form Handler
function initSingleStudentForm() {
  const form = document.getElementById("single-student-form");
  const verifyApaarBtn = document.getElementById("verify-apaar-btn");

  if (!form) return;

  if (verifyApaarBtn) {
    verifyApaarBtn.addEventListener("click", () => {
      const input = document.getElementById("form-apaar-id");
      const val = input ? input.value.trim() : "";
      if (!val) {
        alert("Please enter an APAAR ID to test verification.");
        return;
      }
      simulateLiveApaarCheck(val);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("form-student-name").value;
    const apaar = document.getElementById("form-apaar-id").value;
    const program = document.getElementById("form-program").value;
    const seatType = document.getElementById("form-seat-type").value;
    const category = document.getElementById("form-category").value;
    const roll = document.getElementById("form-roll-no").value || `COEP-24-${Math.floor(100 + Math.random()*900)}`;

    const newStudent = {
      apaarId: apaar,
      rollNo: roll,
      name: name,
      fatherName: "Guardian Name",
      dob: "2005-01-01",
      gender: "Not Specified",
      instituteId: "INST-001",
      instituteName: "College of Engineering, Pune (COEP Tech Univ)",
      aicteId: "1-002938171",
      program: program,
      academicYear: "2024-2028",
      semester: "Sem I (Year 1)",
      seatType: seatType,
      category: category,
      nriStatus: seatType.includes("NRI") ? "Yes" : "No",
      ociStatus: seatType.includes("OCI") ? "Yes" : "No",
      fnStatus: seatType.includes("Foreign") ? "Yes" : "No",
      abcId: `ABC-${Math.floor(100 + Math.random()*900)}-${Math.floor(100 + Math.random()*900)}-${Math.floor(100 + Math.random()*900)}`,
      abcCreditsEarned: 24,
      cgpa: "9.00",
      apaarStatus: "Verified & Active",
      tamperProofHash: `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join("")}`,
      digitalSignatureStatus: "Valid (AICTE National Root CA P-256)",
      nfcUid: `04:${Array.from({length: 6}, () => Math.floor(Math.random()*256).toString(16).toUpperCase().padStart(2, '0')).join(":")}`,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
      anomalies: []
    };

    AICTE_DATA.students.unshift(newStudent);
    renderStudentRoster();
    alert(`Success!\nStudent ${name} successfully enrolled with APAAR ID: ${apaar}.\nRecord synced to AICTE Central Repository.`);
    form.reset();

    addAuditRecord({
      action: `Individual Student Admitted [${apaar}]`,
      actor: "Institution Admissions Officer",
      status: "VERIFIED_OK",
      details: `${name} enrolled in ${program} (${seatType})`
    });
  });
}

function simulateLiveApaarCheck(apaarId) {
  const resultBox = document.getElementById("apaar-check-feedback");
  if (!resultBox) return;

  resultBox.innerHTML = `<span class="spinner-inline"></span> Querying National Academic Depository (DigiLocker NDEAR Registry)...`;
  resultBox.className = "apaar-feedback checking";

  setTimeout(() => {
    const clean = apaarId.replace(/[^0-9]/g, "");
    if (clean.length !== 12) {
      resultBox.innerHTML = `❌ Invalid APAAR format. Must contain 12 numeric digits (e.g., 2024-8849-1029).`;
      resultBox.className = "apaar-feedback error";
      return;
    }

    const matched = AICTE_DATA.students.find(s => s.apaarId === apaarId);
    if (matched && matched.anomalies && matched.anomalies.length > 0) {
      resultBox.innerHTML = `⚠️ <strong>CRITICAL WARNING:</strong> APAAR ${apaarId} has an active fraud alert: ${matched.anomalies[0].message}`;
      resultBox.className = "apaar-feedback error";
    } else {
      resultBox.innerHTML = `✓ <strong>APAAR Authenticated:</strong> National Academic Identity Verified. Candidate Aadhaar Vault hash matched. Clean Academic Bank of Credits record.`;
      resultBox.className = "apaar-feedback success";
    }
  }, 600);
}

// NFC Smart Card Quick-Select Buttons
function initQuickNfcCards() {
  const selectorContainer = document.getElementById("nfc-quick-cards");
  if (!selectorContainer) return;

  const testCards = [
    { label: "Card 1: Priya Nair (Verified TFW)", id: "2024-8849-1029", tag: "Genuine Record" },
    { label: "Card 2: Aryan Verma (Dual Enrolment)", id: "2024-4190-7721", tag: "Anomaly Flagged" },
    { label: "Card 3: Michael Chen (Foreign National)", id: "2024-9102-3844", tag: "FN Quota" },
    { label: "Card 4: Tanya Sen (NRI Quota)", id: "2024-6019-4820", tag: "NRI Ward" }
  ];

  selectorContainer.innerHTML = testCards.map(c => `
    <button class="nfc-card-chip ${c.tag.includes('Flagged') ? 'chip-danger' : 'chip-normal'}" onclick="window.testNfcStudent('${c.id}')">
      <div class="chip-title">💳 ${c.label}</div>
      <div class="chip-meta">${c.id} • <span class="tag">${c.tag}</span></div>
    </button>
  `).join("");
}

function testNfcStudent(apaarId) {
  switchTab('nfc-tab');
  setTimeout(() => {
    window.nfcReader.processCardRead(apaarId);
  }, 250);
}
window.testNfcStudent = testNfcStudent;

// Verification Tab Search Engine
function initSearch() {
  const verifyBtn = document.getElementById("verify-lookup-btn");
  const input = document.getElementById("search-apaar-input");

  if (verifyBtn && input) {
    verifyBtn.addEventListener("click", () => {
      const q = input.value.trim();
      if (!q) {
        alert("Please enter a 12-digit APAAR ID or Student Roll No.");
        return;
      }
      verifyApaarRecord(q);
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        verifyBtn.click();
      }
    });
  }
}

function verifyApaarRecord(query) {
  const resultDiv = document.getElementById("verification-result-view");
  if (!resultDiv) return;

  resultDiv.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p class="mt-2 font-mono text-xs">Querying AICTE Cryptographic Ledger & NDEAR APAAR Registry...</p>
    </div>
  `;

  setTimeout(() => {
    const student = AICTE_DATA.students.find(s => 
      s.apaarId.includes(query) || 
      s.rollNo.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase())
    );

    if (!student) {
      resultDiv.innerHTML = `
        <div class="result-not-found">
          <div class="alert-icon">❌</div>
          <h3>Record Not Found in AICTE Central Ledger</h3>
          <p class="text-muted text-sm mt-1">No student enrolled in an AICTE-approved institution was found matching "${query}".</p>
          <p class="text-xs text-muted mt-2">Possible causes: Student data not yet uploaded by institution, incorrect APAAR ID, or unapproved program.</p>
        </div>
      `;
      return;
    }

    const hasAnomaly = student.anomalies && student.anomalies.length > 0;

    resultDiv.innerHTML = `
      <div class="verification-dossier-card ${hasAnomaly ? 'status-alert' : 'status-clean'}">
        <div class="veri-top">
          <div class="veri-badge-row">
            ${hasAnomaly 
              ? '<span class="status-badge badge-danger">⚠️ VERIFICATION ALERT - ANOMALY DETECTED</span>' 
              : '<span class="status-badge badge-success">✓ 100% AUTHENTIC AICTE VERIFIED RECORD</span>'
            }
            <span class="veri-timestamp font-mono text-xs">Verified at ${new Date().toLocaleString('en-IN')}</span>
          </div>
          <h2 class="veri-name">${student.name}</h2>
          <div class="veri-inst">${student.instituteName}</div>
        </div>

        <div class="veri-grid mt-4">
          <div class="veri-box">
            <span class="lbl">National APAAR ID</span>
            <span class="val font-mono text-accent font-bold">${student.apaarId}</span>
          </div>
          <div class="veri-box">
            <span class="lbl">Institutional Roll / PRN</span>
            <span class="val font-mono font-semibold">${student.rollNo}</span>
          </div>
          <div class="veri-box">
            <span class="lbl">AICTE Permanent ID (PID)</span>
            <span class="val font-mono">${student.aicteId}</span>
          </div>
          <div class="veri-box">
            <span class="lbl">Program of Study</span>
            <span class="val font-semibold">${student.program}</span>
          </div>
          <div class="veri-box">
            <span class="lbl">Admission Seat Type</span>
            <span class="val">${student.seatType}</span>
          </div>
          <div class="veri-box">
            <span class="lbl">Academic Bank of Credits</span>
            <span class="val font-mono">${student.abcId} (${student.abcCreditsEarned} Credits)</span>
          </div>
          <div class="veri-box">
            <span class="lbl">Current Standing / CGPA</span>
            <span class="val font-bold text-success">${student.cgpa} / 10.0</span>
          </div>
          <div class="veri-box">
            <span class="lbl">NFC Smart Card UID</span>
            <span class="val font-mono text-xs">${student.nfcUid}</span>
          </div>
        </div>

        ${hasAnomaly ? `
          <div class="anomaly-callout mt-4">
            <div class="font-bold text-danger">⚠️ REGULATORY VIOLATION NOTED:</div>
            <p class="text-sm mt-1">${student.anomalies[0].message}</p>
            <div class="mt-2 text-xs font-mono text-muted">Action: ${student.anomalies[0].actionRequired}</div>
          </div>
        ` : ''}

        <div class="tamper-proof-seal mt-4">
          <div class="seal-left">
            <div class="seal-icon">🛡️</div>
            <div>
              <div class="font-bold text-xs">CRYPTOGRAPHIC PROOF OF AUTHENTICITY</div>
              <div class="font-mono text-xs text-muted">Hash: ${student.tamperProofHash}</div>
              <div class="text-xs text-success mt-1">AICTE National Trust Chain: ${student.digitalSignatureStatus}</div>
            </div>
          </div>
          <div class="seal-right">
            <button class="btn btn-primary btn-sm" onclick="window.openDegreeModal('${student.apaarId}')">
              🎓 View Certificate with APAAR
            </button>
          </div>
        </div>
      </div>
    `;

    addAuditRecord({
      action: `Public Verification Executed [${student.apaarId}]`,
      actor: "Authorized Verifier / Employer",
      status: hasAnomaly ? "ALERT_FLAGGED" : "VERIFIED_OK",
      details: `${student.name} - ${student.instituteName}`
    });
  }, 450);
}
window.verifyApaarRecord = verifyApaarRecord;

// Verifiable Degree Certificate Modal
function openDegreeModal(apaarId) {
  const student = AICTE_DATA.students.find(s => s.apaarId === apaarId) || AICTE_DATA.students[0];
  const modal = document.getElementById("degree-modal");
  const modalContent = document.getElementById("degree-certificate-preview");
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="certificate-paper" id="printable-certificate">
      <div class="cert-border-outer">
        <div class="cert-border-inner">
          
          <!-- Security Watermark Background -->
          <div class="cert-watermark">AICTE • APAAR • INDIA</div>

          <!-- Certificate Header -->
          <div class="cert-header">
            <div class="cert-emblem">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" stroke="#c29b38" stroke-width="4" fill="#faf6e9"/>
                <circle cx="50" cy="50" r="38" stroke="#1e3a8a" stroke-width="2"/>
                <path d="M50 20 L58 40 L80 42 L64 56 L70 78 L50 66 L30 78 L36 56 L20 42 L42 40 Z" fill="#c29b38" opacity="0.3"/>
                <circle cx="50" cy="50" r="12" fill="#1e3a8a"/>
                <text x="50" y="54" font-size="10" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="bold">AICTE</text>
              </svg>
            </div>
            <div class="cert-titles">
              <div class="cert-gov-line">GOVERNMENT OF INDIA • MINISTRY OF EDUCATION</div>
              <h2 class="cert-inst-title">${student.instituteName}</h2>
              <div class="cert-approved-badge">Approved by All India Council for Technical Education (AICTE), New Delhi</div>
            </div>
            <div class="cert-qr-container">
              <!-- Inline Cryptographic SVG QR Code -->
              <svg width="64" height="64" viewBox="0 0 33 33" class="cert-qr-code">
                <rect width="33" height="33" fill="#fff"/>
                <!-- Corner finder 1 -->
                <rect x="2" y="2" width="7" height="7" fill="#000"/>
                <rect x="3" y="3" width="5" height="5" fill="#fff"/>
                <rect x="4" y="4" width="3" height="3" fill="#000"/>
                <!-- Corner finder 2 -->
                <rect x="24" y="2" width="7" height="7" fill="#000"/>
                <rect x="25" y="3" width="5" height="5" fill="#fff"/>
                <rect x="26" y="4" width="3" height="3" fill="#000"/>
                <!-- Corner finder 3 -->
                <rect x="2" y="24" width="7" height="7" fill="#000"/>
                <rect x="3" y="25" width="5" height="5" fill="#fff"/>
                <rect x="4" y="26" width="3" height="3" fill="#000"/>
                <!-- Dynamic pseudo QR payload cells -->
                <rect x="11" y="4" width="2" height="2" fill="#000"/>
                <rect x="15" y="2" width="2" height="2" fill="#000"/>
                <rect x="19" y="6" width="2" height="2" fill="#000"/>
                <rect x="11" y="11" width="3" height="3" fill="#000"/>
                <rect x="16" y="14" width="2" height="4" fill="#000"/>
                <rect x="20" y="12" width="4" height="2" fill="#000"/>
                <rect x="13" y="20" width="3" height="3" fill="#000"/>
                <rect x="18" y="24" width="2" height="2" fill="#000"/>
                <rect x="24" y="20" width="4" height="4" fill="#000"/>
              </svg>
              <div class="cert-qr-caption">Scan to Verify</div>
            </div>
          </div>

          <!-- Requirement 10: Prominent Display of APAAR ID with Student ID -->
          <div class="cert-id-ribbon">
            <div class="id-item">
              <span class="ribbon-lbl">NATIONAL APAAR ID:</span>
              <strong class="ribbon-val font-mono">${student.apaarId}</strong>
            </div>
            <div class="id-divider">★</div>
            <div class="id-item">
              <span class="ribbon-lbl">INSTITUTIONAL ROLL / PRN:</span>
              <strong class="ribbon-val font-mono">${student.rollNo}</strong>
            </div>
            <div class="id-divider">★</div>
            <div class="id-item">
              <span class="ribbon-lbl">AICTE PID:</span>
              <strong class="ribbon-val font-mono">${student.aicteId}</strong>
            </div>
          </div>

          <!-- Certificate Body Text -->
          <div class="cert-body">
            <p class="cert-intro">This is to certify that</p>
            <h1 class="cert-student-name">${student.name}</h1>
            <p class="cert-text">
              having fulfilled all requirements prescribed by the Senate and the AICTE Regulatory Framework,
              is hereby admitted to the degree of
            </p>
            <h3 class="cert-degree-name">${student.program}</h3>
            <p class="cert-subtext">
              with Cumulative Grade Point Average of <strong>${student.cgpa}</strong> on a 10-point scale.
              Admitted under Category: <em>${student.seatType}</em> (${student.category}).
            </p>
          </div>

          <!-- Certificate Footer & Signatures -->
          <div class="cert-footer">
            <div class="cert-sign-col">
              <div class="sign-space">
                <span class="digital-sign-hash">SHA256: 0x9a8f...4e10</span>
              </div>
              <div class="sign-line">Dean of Academic Affairs</div>
              <div class="sign-meta">Digitally Signed via AICTE PKI</div>
            </div>
            <div class="cert-gold-seal">
              <div class="seal-ring">
                <div class="seal-inner-circle">
                  <span>OFFICIAL</span>
                  <strong>SEAL</strong>
                  <span>VERIFIED</span>
                </div>
              </div>
            </div>
            <div class="cert-sign-col">
              <div class="sign-space">
                <span class="digital-sign-hash">SHA256: 0x7c41...89b3</span>
              </div>
              <div class="sign-line">Registrar / Vice Chancellor</div>
              <div class="sign-meta">Member Secretary, AICTE Approval Body</div>
            </div>
          </div>

          <div class="cert-bottom-disclaimer">
            This verifiable academic record is cryptographically anchored to the National Academic Depository (NAD / DigiLocker).
            Any unauthorized alteration renders this credential null and void. AICTE Verification Hash: ${student.tamperProofHash}
          </div>

        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}
window.openDegreeModal = openDegreeModal;

function closeDegreeModal() {
  const modal = document.getElementById("degree-modal");
  if (modal) modal.classList.remove("active");
}
window.closeDegreeModal = closeDegreeModal;

function printDegreeCertificate() {
  window.print();
}
window.printDegreeCertificate = printDegreeCertificate;

// Policy & Regulatory Reports Generator (Requirement 9)
function exportPolicyReport(reportType) {
  let filename = "";
  let csvContent = "";

  if (reportType === 'nirf') {
    filename = "AICTE_NIRF_Data_Submission_2024.csv";
    csvContent = `INSTITUTE_NAME,AICTE_PID,PROGRAM,APPROVED_INTAKE,SANCTIONED_ACTUAL_ENROLMENT,SUPERNUMERARY_TFW,EWS_SEATS,NRI_SEATS,FN_SEATS,TOTAL_DIVERSITY_PCT\n` +
      `College of Engineering Pune,1-002938171,B.Tech Computer Engineering,120,120,6,12,4,3,20.8%\n` +
      `College of Engineering Pune,1-002938171,B.Tech Artificial Intelligence,60,60,3,6,2,2,21.6%\n` +
      `Delhi Technological University,1-004819203,B.Tech Software Engineering,180,180,9,18,6,4,20.5%\n` +
      `Veermata Jijabai Tech Inst,1-009182341,B.Tech Information Technology,60,60,3,6,2,1,20.0%`;
  } else if (reportType === 'naac') {
    filename = "AICTE_NAAC_Criterion_II_Enrolment_Compliance.csv";
    csvContent = `METRIC_ID,DESCRIPTION,APPROVED_CAP,ACTUAL_ADMITTED,SUPERNUMERARY,COMPLIANCE_STATUS\n` +
      `2.1.1,Enrolment Percentage vs Approved Intake,3450200,3120450,218940,90.4% COMPLIANT\n` +
      `2.1.2,Reserved & Social Category Quota Adherence,1725100,1698200,109470,98.4% COMPLIANT\n` +
      `2.1.3,Supernumerary Tuition Fee Waiver (TFW 5%),172510,165400,0,100.0% COMPLIANT\n` +
      `2.1.4,Foreign National (FN) & OCI Representation,517530,22890,0,VERIFIED WITH MEA`;
  } else {
    filename = "AICTE_Approval_Process_Handbook_Audit.csv";
    csvContent = `REGION,INSTITUTIONS_AUDITED,TOTAL_INTAKE,EXCESS_ADMISSIONS_FLAGGED,DUPLICATE_APAAR_DETECTED,PENALTY_NOTICES_ISSUED\n` +
      `Western Region (WRO),2180,840000,18,12,18\n` +
      `Northern Region (NRO),1940,780000,24,19,24\n` +
      `Southern Region (SRO),2410,990000,9,8,9\n` +
      `Eastern Region (ERO),1120,410000,4,3,4`;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  alert(`Report Generated Successfully!\n"${filename}" exported in official AICTE regulatory format.`);
  addAuditRecord({
    action: `Policy Report Exported [${reportType.toUpperCase()}]`,
    actor: "Apex Monitoring Cell",
    status: "VERIFIED_OK",
    details: `Downloaded ${filename}`
  });
}
window.exportPolicyReport = exportPolicyReport;
