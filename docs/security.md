# Security & Privacy Architecture

## 1. Information Security Architecture

1. **Authentication & Password Protection**:
   - Industry-standard bcrypt hashing (10 salt rounds).
   - Signed JSON Web Tokens (JWT) with configurable expiry.
   - Dual-mode operation: Authenticated user mode + Instant Demo mode for frictionless judging.

2. **API Hardening**:
   - `helmet` security middleware for secure HTTP headers.
   - `cors` origin-restricted access control.
   - `express-rate-limit` (300 requests per 15 minutes) mitigating brute-force and DoS risks.
   - Strict request body payload caps (10MB for JSON, 15MB for statement documents).

3. **Privacy-Preserving Document Audit**:
   - Uploaded statements are held temporarily in memory or ephemeral tmp storage only for the duration of text extraction and line-item audit.
   - Temporary files are immediately deleted (`fs.unlinkSync`).
   - Raw document transactions, passwords, or personal credentials are NEVER written to server log streams.

4. **Safe Harbor Phrasing**:
   - Scam alerts use educational phrasing: *"High-risk signals detected. This does not by itself establish fraud."*
   - Generated complaints carry the mandatory advisory: *"AI-generated draft — review and verify all details before submitting."*
