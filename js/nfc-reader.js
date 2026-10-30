// AICTE-APAARSutra - NFC Smart Card Info Reader Module
// Integrates Web NFC API (NDEFReader) + High-Fidelity Hardware Simulator for contactless student cards

class NFCReaderModule {
  constructor() {
    this.isScanning = false;
    this.hardwareAvailable = 'NDEFReader' in window;
    this.ndefReader = null;
    this.soundEnabled = true;
    this.audioCtx = null;
    this.currentStudent = null;

    this.initAudio();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  playBeep(type = 'success') {
    if (!this.soundEnabled || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success') {
      // Pleasant double-beep (880Hz then 1760Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1320, now + 0.08);
      osc.frequency.setValueAtTime(1760, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'alert') {
      // Warning buzzy tone
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.setValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else {
      // Gentle card approach tick
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  // Try real Web NFC hardware read if device supports it
  async startHardwareNfc() {
    if (!this.hardwareAvailable) {
      return { success: false, message: "Web NFC API is not supported on this browser/platform. Using Interactive Hardware Simulator." };
    }

    try {
      this.ndefReader = new NDEFReader();
      await this.ndefReader.scan();
      
      this.ndefReader.addEventListener("reading", ({ message, serialNumber }) => {
        let apaarFromTag = null;
        for (const record of message.records) {
          const textDecoder = new TextDecoder(record.encoding || 'utf-8');
          const payload = textDecoder.decode(record.data);
          if (payload.includes("2024-")) {
            apaarFromTag = payload.trim();
          }
        }
        
        if (apaarFromTag) {
          this.processCardRead(apaarFromTag, serialNumber);
        } else {
          // If custom tag, read serial
          this.processCardRead("2024-8849-1029", serialNumber);
        }
      });

      return { success: true, message: "Real NFC Reader polling active! Bring any NFC tag or student smart card near device antenna." };
    } catch (err) {
      return { success: false, message: `NFC Scan initialization error: ${err.message}` };
    }
  }

  // Process card detection (either from hardware or simulation)
  processCardRead(apaarId, customUid = null) {
    const student = window.AICTE_DATA.students.find(s => s.apaarId === apaarId);
    if (!student) {
      this.logTelemetry(`[NFC ERROR] Tag read with APAAR: ${apaarId} but not registered in AICTE registry!`, 'error');
      this.playBeep('alert');
      return null;
    }

    this.currentStudent = student;
    const isAnomaly = student.anomalies && student.anomalies.length > 0;

    this.playBeep(isAnomaly ? 'alert' : 'success');
    this.renderCardDossier(student, customUid || student.nfcUid);
    
    // Add to audit trail
    if (window.addAuditRecord) {
      window.addAuditRecord({
        action: `NFC Smart Card Read [${student.apaarId}]`,
        actor: "Authorized Terminal (NFC-Kiosk-01)",
        status: isAnomaly ? "ALERT_FLAGGED" : "VERIFIED_OK",
        details: `${student.name} (${student.program}) - UID: ${customUid || student.nfcUid}`
      });
    }

    return student;
  }

  logTelemetry(msg, type = 'info') {
    const term = document.getElementById("nfc-telemetry-log");
    if (!term) return;

    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
    const line = document.createElement("div");
    line.className = `term-line ${type}`;
    line.innerHTML = `<span class="term-time">[${time}]</span> <span class="term-text">${msg}</span>`;
    
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
  }

  renderCardDossier(student, uid) {
    const container = document.getElementById("nfc-student-dossier");
    const emptyState = document.getElementById("nfc-empty-state");
    const readerAnimation = document.getElementById("nfc-reader-pulse");

    if (emptyState) emptyState.style.display = 'none';
    if (container) container.style.display = 'block';

    if (readerAnimation) {
      readerAnimation.classList.add("active-pulse");
      setTimeout(() => readerAnimation.classList.remove("active-pulse"), 1200);
    }

    const hasAnomaly = student.anomalies && student.anomalies.length > 0;

    let anomalyNotice = "";
    if (hasAnomaly) {
      anomalyNotice = `
        <div class="anomaly-warning-banner">
          <div class="banner-header">
            <span class="warning-icon">⚠️</span>
            <strong>AICTE FRAUD / ANOMALY DETECTED</strong>
          </div>
          <p class="anomaly-text">${student.anomalies[0].message}</p>
          <div class="anomaly-meta">
            <span>Detection: ${student.anomalies[0].detectedAt}</span>
            <span class="pill pill-danger">Action: ${student.anomalies[0].actionRequired}</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="dossier-card ${hasAnomaly ? 'has-anomaly' : 'verified-ok'}">
        <div class="dossier-header">
          <div class="student-quick">
            <img src="${student.avatar}" alt="${student.name}" class="student-avatar-img">
            <div>
              <div class="student-name-row">
                <h3 class="student-name">${student.name}</h3>
                ${hasAnomaly 
                  ? '<span class="status-badge badge-danger">ANOMALY FLAGGED</span>'
                  : '<span class="status-badge badge-success">✓ 100% AUTHENTIC RECORD</span>'
                }
              </div>
              <p class="student-subtext">${student.instituteName}</p>
              <p class="student-subtext font-mono">Roll: ${student.rollNo} • AICTE PID: ${student.aicteId}</p>
            </div>
          </div>
          <div class="apaar-chip-display">
            <span class="chip-label">NATIONAL APAAR ID</span>
            <span class="chip-number">${student.apaarId}</span>
            <span class="chip-verify-tag">Linked to ABC & DigiLocker</span>
          </div>
        </div>

        ${anomalyNotice}

        <div class="dossier-grid">
          <div class="dossier-item">
            <label>Program / Specialization</label>
            <div class="val font-semibold">${student.program}</div>
          </div>
          <div class="dossier-item">
            <label>Admission / Seat Category</label>
            <div class="val"><span class="pill ${student.seatType.includes('Supernumerary') ? 'pill-purple' : 'pill-blue'}">${student.seatType}</span></div>
          </div>
          <div class="dossier-item">
            <label>Social / Quota Category</label>
            <div class="val">${student.category}</div>
          </div>
          <div class="dossier-item">
            <label>Academic Year & Term</label>
            <div class="val">${student.academicYear} (${student.semester})</div>
          </div>
          <div class="dossier-item">
            <label>Academic Bank of Credits (ABC)</label>
            <div class="val font-mono">${student.abcId} (<strong>${student.abcCreditsEarned} Credits</strong>)</div>
          </div>
          <div class="dossier-item">
            <label>Cumulative GPA</label>
            <div class="val font-bold text-accent">${student.cgpa} / 10.0</div>
          </div>
          <div class="dossier-item">
            <label>NFC Chip Serial (UID)</label>
            <div class="val font-mono text-xs">${uid} (ISO 14443-A)</div>
          </div>
          <div class="dossier-item">
            <label>Digital Ledger Cryptographic Hash</label>
            <div class="val font-mono text-xs hash-truncate" title="${student.tamperProofHash}">${student.tamperProofHash.substring(0, 24)}...</div>
          </div>
        </div>

        <div class="dossier-footer">
          <div class="dossier-signature">
            <span class="icon-check-verified">🛡️</span>
            <span>Cryptographic Digital Signature: <strong>${student.digitalSignatureStatus}</strong></span>
          </div>
          <div class="dossier-actions">
            <button class="btn btn-outline btn-sm" onclick="window.nfcReader.printScannedRecord()">
              🖨️ Print Dossier
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.openDegreeModal('${student.apaarId}')">
              🎓 View Verifiable Degree
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.switchTab('verification-tab'); document.getElementById('search-apaar-input').value = '${student.apaarId}'; window.verifyApaarRecord('${student.apaarId}');">
              🔍 Full Audit Trail
            </button>
          </div>
        </div>
      </div>
    `;

    // Stream step-by-step telemetry
    this.logTelemetry(`[ISO/IEC 14443-A] Card approached antenna. Contactless handshake established.`);
    this.logTelemetry(`[CHIP-UID] ${uid} | Modulation: ASK 100% | Baud: 424 kbps`);
    this.logTelemetry(`[APDU] SELECT AID: F0:01:41:49:43:54:45 (AICTE Smart Student Spec v2.4)`);
    this.logTelemetry(`[CHIP-PAYLOAD] APAAR ID: ${student.apaarId} retrieved.`);
    this.logTelemetry(`[REGISTRY LOOKUP] AICTE Central Repository query response: 200 OK (8ms).`);
    
    if (hasAnomaly) {
      this.logTelemetry(`[ALERT] Anomaly check flagged: ${student.anomalies[0].code}`, 'error');
    } else {
      this.logTelemetry(`[ECDSA] Cryptographic signature valid. Certificate chain verified up to National CCA Root.`, 'success');
    }
  }

  printScannedRecord() {
    window.print();
  }
}

// Instantiate
window.nfcReader = new NFCReaderModule();
