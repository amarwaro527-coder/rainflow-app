# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability within Rainflow, please follow these steps:

1.  **DO NOT** open a public issue on GitHub.
2.  Email the details to **security@rainflow.app** (or the maintainer's email).
3.  Include steps to reproduce the vulnerability.

We will acknowledge your report within 48 hours and provide an estimated timeline for a fix.

### Critical Areas
Please pay special attention to:
*   **API Key Handling**: Ensure keys are never logged or exposed.
*   **OAuth2 Tokens**: Verify token storage security in the database.
*   **Input Validation**: Check for injection vulnerabilities in job payloads.

Thank you for helping keep Rainflow secure.
