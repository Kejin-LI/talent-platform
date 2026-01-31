# Kejin AI - Expert Data Annotation Platform PRD

## 1. Product Overview
**Kejin AI** is a specialized recruitment and management platform connecting high-end algorithm/evaluation teams (Demand) with domain experts (Supply). The platform focuses on high-quality, domain-specific data annotation and evaluation tasks.

## 2. Demand Side (Algorithm/Evaluation Teams)

### 2.1 Registration & Authentication
*   **Enterprise Certification:** Upload business license/organization code.
*   **Team Verification:** Corporate email verification required.
*   **Role Management:** Admin (Billing/Org settings) vs. PM (Project posting).

### 2.2 Requirement Publishing
*   **Dynamic Wizard:**
    *   *Step 1 Basic Info:* Project Name, Domain (Medical, Legal, Finance, Coding), Language.
    *   *Step 2 Specifications:* Data type (Text, Image, Audio), Annotation Rules, Output Format (JSON, CSV).
    *   *Step 3 Quality & Quantity:* Sample size, Acceptance criteria (Accuracy > 98%), Double-blind requirements.
    *   *Step 4 Logistics:* Budget per item/hour, Deadline, NDA requirement.

### 2.3 Expert Screening & Matching
*   **Search Engine:** Filter by Domain Expertise, Years of Experience, Language Proficiency.
*   **Smart Matching:** "Match Score" algorithm based on expert's historical accuracy and skill tags.
*   **Expert Cards:** Anonymized profiles showing "Completed Tasks", "Avg. Quality Score", "Response Time".

### 2.4 Project Management
*   **Kanban Board:** Pending -> In Progress -> Under Review -> Accepted/Rejected.
*   **Quality Control:** Random sampling tool for validation. Rejection with comment flow.
*   **Communication:** Context-aware chat (linked to specific task items).

### 2.5 Data Security
*   **Privacy:** PII Masking options before data display.
*   **Access Control:** Read-only views, download restrictions (Watermarking).
*   **Audit Logs:** Track all data views and exports.

## 3. Supply Side (Domain Experts)

### 3.1 Registration & Certification
*   **Profile Setup:** Education background, Professional experience.
*   **Verification:** Upload Degrees/Certificates (OCR verification), LinkedIn integration.
*   **Domain Tests:** Mandatory entrance exams for specific tags (e.g., "Python Coding", "Clinical Medicine").

### 3.2 Task Square
*   **Recommendation Engine:** "Best Match" feed based on skills.
*   **Advanced Filters:** High Price, Short-term/Long-term, NDA required.
*   **Task Details:** Preview sample data (blurred), Price per unit, Estimated time.

### 3.3 Workbench (Execution)
*   **Annotation Tool:** Embedded web-based editor (Text highlighting, Classification, Markdown editor).
*   **Collaboration:** Query tool to ask clarifying questions to the Demand side.
*   **Progress:** Real-time counter (Completed / Total), "Time Remaining" alerts.

### 3.4 Personal Center & Earnings
*   **Dashboard:** Skills Radar Chart, Reputation Score (5-star system).
*   **Wallet:**
    *   *Pending:* Funds in escrow (Task submitted).
    *   *Available:* Funds approved (Task accepted).
    *   *Withdrawal:* Monthly/Weekly payout to Bank/PayPal.

## 4. Technical Architecture Highlights
*   **Frontend:** React/Vue, Tailwind CSS for responsive design.
*   **Backend:** Node.js/Python, PostgreSQL for relational data.
*   **Security:** JWT Auth, AES-256 for sensitive data storage.
