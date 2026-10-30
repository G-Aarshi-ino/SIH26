// AICTE-APAARSutra - National Student Academic Registry & Verification System
// Dataset & Validation Schemas for SIH Problem Statement SIH26263

const AICTE_DATA = {
  nationalStats: {
    totalInstitutions: 8942,
    totalApprovedIntake: 3450200,
    totalEnrolledStudents: 3120450,
    totalSupernumerary: 218940,
    nriOciFnCount: 22890,
    apaarCoveragePct: 98.4,
    anomaliesDetected: 1482,
    anomaliesResolved: 1398,
    activeVerificationsToday: 14230
  },

  institutions: [
    {
      id: "INST-001",
      aicteId: "1-002938171",
      name: "College of Engineering, Pune (COEP Tech Univ)",
      state: "Maharashtra",
      type: "State Technological University",
      status: "AICTE Approved (Accredited NBA/NAAC A++)",
      programs: [
        { id: "P-101", name: "B.Tech Computer Engineering", approvedIntake: 120, enrolled: 120, supernumerary: 18, nri: 4, oci: 2, fn: 3, tfw: 6, ews: 12 },
        { id: "P-102", name: "B.Tech Artificial Intelligence & Data Science", approvedIntake: 60, enrolled: 60, supernumerary: 9, nri: 2, oci: 1, fn: 2, tfw: 3, ews: 6 },
        { id: "P-103", name: "B.Tech Electronics & Telecommunication", approvedIntake: 120, enrolled: 118, supernumerary: 14, nri: 3, oci: 0, fn: 1, tfw: 6, ews: 10 },
        { id: "P-104", name: "B.Tech Mechanical Engineering", approvedIntake: 120, enrolled: 115, supernumerary: 12, nri: 1, oci: 0, fn: 0, tfw: 6, ews: 12 },
        { id: "P-105", name: "M.Tech Data Science & AI", approvedIntake: 30, enrolled: 30, supernumerary: 3, nri: 0, oci: 0, fn: 1, tfw: 0, ews: 3 }
      ]
    },
    {
      id: "INST-002",
      aicteId: "1-004819203",
      name: "Delhi Technological University (DTU)",
      state: "Delhi",
      type: "State University",
      status: "AICTE Approved (NAAC A+)",
      programs: [
        { id: "P-201", name: "B.Tech Software Engineering", approvedIntake: 180, enrolled: 180, supernumerary: 24, nri: 6, oci: 3, fn: 4, tfw: 9, ews: 18 },
        { id: "P-202", name: "B.Tech Information Technology", approvedIntake: 120, enrolled: 120, supernumerary: 16, nri: 4, oci: 1, fn: 2, tfw: 6, ews: 12 },
        { id: "P-203", name: "B.Tech Electrical Engineering", approvedIntake: 120, enrolled: 114, supernumerary: 10, nri: 2, oci: 0, fn: 0, tfw: 6, ews: 12 }
      ]
    },
    {
      id: "INST-003",
      aicteId: "1-009182341",
      name: "Veermata Jijabai Technological Institute (VJTI), Mumbai",
      state: "Maharashtra",
      type: "Autonomous State Institute",
      status: "AICTE Approved",
      programs: [
        { id: "P-301", name: "B.Tech Computer Engineering", approvedIntake: 90, enrolled: 90, supernumerary: 12, nri: 3, oci: 1, fn: 2, tfw: 5, ews: 9 },
        { id: "P-302", name: "B.Tech Information Technology", approvedIntake: 60, enrolled: 60, supernumerary: 8, nri: 2, oci: 0, fn: 1, tfw: 3, ews: 6 }
      ]
    },
    {
      id: "INST-004",
      aicteId: "1-003482719",
      name: "National Institute of Technology (NIT), Tiruchirappalli",
      state: "Tamil Nadu",
      type: "Institute of National Importance",
      status: "AICTE / MoE Recognized",
      programs: [
        { id: "P-401", name: "B.Tech Computer Science & Engineering", approvedIntake: 120, enrolled: 120, supernumerary: 20, nri: 5, oci: 3, fn: 4, tfw: 6, ews: 12 },
        { id: "P-402", name: "B.Tech Electronics & Communication", approvedIntake: 120, enrolled: 120, supernumerary: 18, nri: 4, oci: 2, fn: 3, tfw: 6, ews: 12 }
      ]
    }
  ],

  // Comprehensive Student Directory including Normal, Supernumerary, NRI, FN, and Flagged Anomaly records
  students: [
    {
      apaarId: "2024-8849-1029",
      rollNo: "COEP-24-CS-042",
      name: "Priya Lakshmi Nair",
      fatherName: "K. R. Nair",
      dob: "2005-04-14",
      gender: "Female",
      instituteId: "INST-001",
      instituteName: "College of Engineering, Pune (COEP Tech Univ)",
      aicteId: "1-002938171",
      program: "B.Tech Computer Engineering",
      academicYear: "2024-2028",
      semester: "Sem IV (Year 2)",
      seatType: "Supernumerary (TFW - Tuition Fee Waiver)",
      category: "General - EWS / TFW",
      nriStatus: "No",
      ociStatus: "No",
      fnStatus: "No",
      abcId: "ABC-904-221-998",
      abcCreditsEarned: 78,
      cgpa: "9.42",
      apaarStatus: "Verified & Active",
      tamperProofHash: "0x8fa4c3b981e442df19d08e7ac402b8813fa09c21ef9a826",
      digitalSignatureStatus: "Valid (AICTE National Root CA P-256)",
      nfcUid: "04:A1:8B:22:9F:70:80",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      anomalies: []
    },
    {
      apaarId: "2024-4190-7721",
      rollNo: "COEP-24-AI-018",
      name: "Aryan Vikram Verma",
      fatherName: "Vikram R. Verma",
      dob: "2004-11-20",
      gender: "Male",
      instituteId: "INST-001",
      instituteName: "College of Engineering, Pune (COEP Tech Univ)",
      aicteId: "1-002938171",
      program: "B.Tech Artificial Intelligence & Data Science",
      academicYear: "2024-2028",
      semester: "Sem IV (Year 2)",
      seatType: "Regular (All India Quota)",
      category: "OBC-NCL",
      nriStatus: "No",
      ociStatus: "No",
      fnStatus: "No",
      abcId: "ABC-118-502-331",
      abcCreditsEarned: 64,
      cgpa: "8.85",
      apaarStatus: "CRITICAL ANOMALY: Dual Enrolment Detected",
      tamperProofHash: "0xd90142e8812cfa878643190be99a12c4516709fae489b01",
      digitalSignatureStatus: "Flagged for Audit Review",
      nfcUid: "04:6C:55:E2:10:81:40",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
      anomalies: [
        {
          code: "ERR_DUPLICATE_ENROLMENT",
          severity: "Critical",
          message: "Active enrolment found simultaneously at Veermata Jijabai Technological Institute (VJTI) Roll #VJTI-24-IT-031 for Academic Year 2024-25.",
          detectedAt: "2024-10-18 14:22:10 IST",
          actionRequired: "Issue Show Cause notice to candidate & both institutions to surrender single seat."
        }
      ]
    },
    {
      apaarId: "2024-9102-3844",
      rollNo: "COEP-24-CS-FN-02",
      name: "Michael Chen Jin-Woo",
      fatherName: "Chen Jin-Woo",
      dob: "2004-08-05",
      gender: "Male",
      instituteId: "INST-001",
      instituteName: "College of Engineering, Pune (COEP Tech Univ)",
      aicteId: "1-002938171",
      program: "B.Tech Computer Engineering",
      academicYear: "2024-2028",
      semester: "Sem IV (Year 2)",
      seatType: "Supernumerary (Foreign National - FN 15% Quota)",
      category: "Foreign National",
      nriStatus: "No",
      ociStatus: "No",
      fnStatus: "Yes (Republic of Korea Passport / ICCR Sponsored)",
      abcId: "ABC-884-192-040",
      abcCreditsEarned: 76,
      cgpa: "9.18",
      apaarStatus: "Verified & Active",
      tamperProofHash: "0x3429fae11b409cde876023ea99b45100c8290ae47182da9",
      digitalSignatureStatus: "Valid (MEA & AICTE Clearance Verified)",
      nfcUid: "04:B2:99:14:88:65:20",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      anomalies: []
    },
    {
      apaarId: "2024-6019-4820",
      rollNo: "DTU-24-SE-089",
      name: "Tanya Arundhati Sen",
      fatherName: "Subhash Sen",
      dob: "2005-02-12",
      gender: "Female",
      instituteId: "INST-002",
      instituteName: "Delhi Technological University (DTU)",
      aicteId: "1-004819203",
      program: "B.Tech Software Engineering",
      academicYear: "2024-2028",
      semester: "Sem IV (Year 2)",
      seatType: "Supernumerary (NRI Quota - 5%)",
      category: "NRI Ward (Dubai, UAE)",
      nriStatus: "Yes (Valid Embassy NRI Certificate Attached)",
      ociStatus: "No",
      fnStatus: "No",
      abcId: "ABC-319-901-441",
      abcCreditsEarned: 82,
      cgpa: "9.60",
      apaarStatus: "Verified & Active",
      tamperProofHash: "0x7a83f901cb4e29da485129cba8014e21a0094bce81938fa",
      digitalSignatureStatus: "Valid (AICTE National Root CA P-256)",
      nfcUid: "04:F8:77:21:43:90:12",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      anomalies: []
    },
    {
      apaarId: "2024-1182-9904",
      rollNo: "NIT-24-CSE-005",
      name: "Devendra Ramesh Kulkarni",
      fatherName: "Ramesh G. Kulkarni",
      dob: "2005-07-28",
      gender: "Male",
      instituteId: "INST-004",
      instituteName: "National Institute of Technology (NIT), Tiruchirappalli",
      aicteId: "1-003482719",
      program: "B.Tech Computer Science & Engineering",
      academicYear: "2024-2028",
      semester: "Sem IV (Year 2)",
      seatType: "Regular (Open Merit JoSAA)",
      category: "General",
      nriStatus: "No",
      ociStatus: "No",
      fnStatus: "No",
      abcId: "ABC-774-219-583",
      abcCreditsEarned: 80,
      cgpa: "9.72",
      apaarStatus: "Verified & Active",
      tamperProofHash: "0x51cbe904aa719bc4410294e09f8164ba01948ce716a4901",
      digitalSignatureStatus: "Valid (AICTE National Root CA P-256)",
      nfcUid: "04:33:41:F0:8A:12:90",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      anomalies: []
    },
    {
      apaarId: "2024-3329-8105",
      rollNo: "VJTI-24-IT-031",
      name: "Aryan Vikram Verma",
      fatherName: "Vikram R. Verma",
      dob: "2004-11-20",
      gender: "Male",
      instituteId: "INST-003",
      instituteName: "Veermata Jijabai Technological Institute (VJTI), Mumbai",
      aicteId: "1-009182341",
      program: "B.Tech Information Technology",
      academicYear: "2024-2028",
      semester: "Sem IV (Year 2)",
      seatType: "Regular (State CET Quota)",
      category: "OBC-NCL",
      nriStatus: "No",
      ociStatus: "No",
      fnStatus: "No",
      abcId: "ABC-118-502-331",
      abcCreditsEarned: 64,
      cgpa: "8.85",
      apaarStatus: "CRITICAL ANOMALY: Dual Enrolment Detected",
      tamperProofHash: "0xd90142e8812cfa878643190be99a12c4516709fae489b01",
      digitalSignatureStatus: "Flagged for Audit Review",
      nfcUid: "04:6C:55:E2:10:81:40",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
      anomalies: [
        {
          code: "ERR_DUPLICATE_ENROLMENT",
          severity: "Critical",
          message: "Candidate also claimed enrolment at COEP Pune (Roll #COEP-24-AI-018) for same academic year.",
          detectedAt: "2024-10-18 14:22:10 IST",
          actionRequired: "Surrender verification certificate pending."
        }
      ]
    }
  ],

  // Live Anomaly Radar Feed
  liveAnomalies: [
    {
      id: "ANOM-8921",
      type: "Cross-Institution Duplicate Enrolment",
      severity: "CRITICAL",
      apaarId: "2024-4190-7721",
      studentName: "Aryan Vikram Verma",
      instA: "College of Engineering, Pune (COEP)",
      instB: "Veermata Jijabai Tech Inst (VJTI), Mumbai",
      programs: "B.Tech AI & DS vs B.Tech IT",
      timestamp: "Today, 14:22 IST",
      status: "Notice Issued"
    },
    {
      id: "ANOM-8922",
      type: "Intake Overflow Breach (>100% Cap)",
      severity: "HIGH",
      apaarId: "N/A (Institution Level)",
      studentName: "Admissions Office",
      instA: "Apex Institute of Engg, Greater Noida",
      instB: "AICTE Portal Quota Check",
      programs: "B.Tech CSE (Approved: 180, Admitted: 194 - Breach: +14)",
      timestamp: "Today, 11:45 IST",
      status: "Admissions Locked"
    },
    {
      id: "ANOM-8923",
      type: "Invalid APAAR Checksum / Unregistered ID",
      severity: "MEDIUM",
      apaarId: "2024-0000-9999",
      studentName: "Rajesh Kumar Meena",
      instA: "Jaipur National Technical University",
      instB: "DigiLocker NDEAR Registry",
      programs: "B.Tech Civil Engg",
      timestamp: "Yesterday, 17:10 IST",
      status: "Verification Rejected"
    },
    {
      id: "ANOM-8924",
      type: "Supernumerary NRI Document Discrepancy",
      severity: "MEDIUM",
      apaarId: "2024-7712-4091",
      studentName: "Zoya Fatima",
      instA: "Deccan College of Engineering, Hyderabad",
      instB: "MEA Consular Registry Sync",
      programs: "B.Tech ECE",
      timestamp: "Yesterday, 09:30 IST",
      status: "Pending Affidavit"
    }
  ],

  // Sample CSV batches for instant demonstration of validation engine
  sampleCsvBatches: {
    cleanBatch: `APAAR_ID,STUDENT_NAME,ROLL_NO,DOB,GENDER,PROGRAM,SEAT_TYPE,CATEGORY,NRI,OCI,FN
2024-5510-9921,Aarav Sharma,COEP-24-CS-043,2005-03-11,Male,B.Tech Computer Engineering,Regular,General,No,No,No
2024-7719-8201,Meera Nambiar,COEP-24-CS-044,2005-09-22,Female,B.Tech Computer Engineering,Supernumerary (TFW),General - TFW,No,No,No
2024-8891-2310,Rohan Siddharth Deshmukh,COEP-24-CS-045,2004-12-05,Male,B.Tech Computer Engineering,Regular,OBC-NCL,No,No,No
2024-9920-1144,Fatima Zahra,COEP-24-CS-046,2005-06-19,Female,B.Tech Computer Engineering,Supernumerary (NRI),NRI Ward,Yes,No,No
2024-3401-8899,Karthik Venkatesh,COEP-24-CS-047,2005-01-30,Male,B.Tech Computer Engineering,Regular,SC,No,No,No`,

    anomalyBatch: `APAAR_ID,STUDENT_NAME,ROLL_NO,DOB,GENDER,PROGRAM,SEAT_TYPE,CATEGORY,NRI,OCI,FN
2024-4190-7721,Aryan Vikram Verma,COEP-24-AI-018,2004-11-20,Male,B.Tech Artificial Intelligence,Regular,OBC-NCL,No,No,No
2024-9999,Invalid ID Format,TEST-001,2005-01-01,Male,B.Tech Computer Engineering,Regular,General,No,No,No
2024-8849-1029,Priya Lakshmi Nair,COEP-24-CS-042,2005-04-14,Female,B.Tech Computer Engineering,Supernumerary (TFW),General,No,No,No
2024-1122-3344,Suresh Gupta,COEP-24-CS-199,2004-05-15,Male,B.Tech Computer Engineering,Regular,General,No,No,No
2024-9102-3844,Michael Chen Jin-Woo,COEP-24-CS-FN-02,2004-08-05,Male,B.Tech Computer Engineering,Supernumerary (FN),Foreign National,No,No,Yes`
  }
};

// Export to window
window.AICTE_DATA = AICTE_DATA;
