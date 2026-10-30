# AICTE-APAARSutra • National Student Academic Registry & NFC Verification Platform
**Smart India Hackathon Problem Statement SIH26263**

[![AICTE Approved](https://img.shields.io/badge/AICTE-Approved%20Portal-1e3a8a.svg)](https://www.aicte-india.org)
[![APAAR Integrated](https://img.shields.io/badge/APAAR%20NDEAR-v2.6%20Active-10b981.svg)](https://apaar.education.gov.in)
[![Web NFC Supported](https://img.shields.io/badge/Web%20NFC-ISO%2F14443--A-f97316.svg)](#nfc-smart-card-info-reader)

An integrated digital platform using **APAAR ID (Automated Permanent Academic Account Registry / One Nation One Student ID)** as a unique academic identifier for students enrolled in AICTE-approved institutions.

---

## 🚀 Key Features Addressing SIH26263 Requirements

1. **Student Data Upload & Management:**
   - Program Seat Matrix tracking **Approved Intake** vs **Actual Admissions**.
   - Specific data fields for **Supernumerary Seats** (Tuition Fee Waiver - TFW, EWS, PMSSS), **NRI Category**, **OCI Status**, and **Foreign National (FN)** quotas.

2. **Automated Validation & Intelligent Anomaly Detection:**
   - Detects **Cross-Institution Duplicate Enrolment** (e.g. candidate admitted simultaneously to two institutions).
   - Identifies malformed / invalid APAAR format & checksums.
   - Flags admissions exceeding approved intake quotas.
   - Batch CSV processor with instant diagnostic color-coded reporting.

3. **Dual Role Real-Time Dashboards:**
   - **🏛️ AICTE Apex Council Dashboard:** National KPIs, discipline-wise intake fulfillment, supernumerary distribution charts, and live Anomaly Radar with electronic Show-Cause Notice dispatch.
   - **🏫 Institutional Portal:** College-level program matrix, batch uploader, individual student admissions, and active student roster.

4. **📳 Contactless NFC Smart Card Info Reader (Innovation Feature):**
   - Tap/scan student smart cards to decode APAAR ID and student dossier in under 15ms.
   - Web NFC API (`NDEFReader`) integration for physical Android hardware terminals.
   - Interactive 3D contactless card simulator with authentic synthesized audio chimes/buzzers via Web Audio API.

5. **🎓 Verifiable Degree Certificates with APAAR ID:**
   - Display & printing of **12-digit APAAR ID prominently alongside Institutional Student ID / PRN**.
   - Cryptographic QR code, AICTE security watermark, gold seal, and print-to-PDF formatting.

6. **📊 Policy & Regulatory Reporting:**
   - 1-Click certified exports for **NIRF Rankings**, **NAAC Criterion II**, and **AICTE Approval Process Handbook (APH)** compliance.

7. **🛡️ Audit Trail & API Capability:**
   - REST & Webhook endpoints for integration with institutional ERP/SIS.
   - Immutable chronological audit ledger with role-based access control.

---

## 📁 Repository Structure

```
├── index.html          # Semantic single-page application structure
├── css/
│   └── styles.css      # Enterprise design system, dark/light themes, 3D NFC card styling
├── js/
│   ├── app.js          # Core validation engine, charts, CSV parser, modal generator
│   ├── nfc-reader.js   # Contactless NFC reader, Web NFC API, audio synthesizer
│   └── data.js         # AICTE datasets, mock institutions, student records & CSV batches
└── push_to_github.bat  # Automated helper script to push updates
```

---

## 💻 Local Setup & Running

No build steps or dependencies required.

### Option 1: Direct Browser
Open `index.html` directly in any web browser.

### Option 2: Local Python Server
```bash
python -m http.server 8085
```
Open [http://localhost:8085](http://localhost:8085) in your browser.
