# Payer Policy Surveillance — Interactive Portfolio Prototype

A sanitized, interview-ready UI prototype inspired by an AI-powered payer policy surveillance workflow.

## Product flow
Targeted source configuration → Policy identification → Policy Updates → Policy Analysis & Review → Billing Rules Review handoff → Analytics

## Included
- Scalable payer/source configuration list (4 sample payers) with visible configured URLs, purpose, and source type
- Policy Updates work queue with search/filter concepts
- Policy ID-driven Policy Analysis & Review
- Source URL + downloaded policy document references
- Evidence with page references
- Standardized taxonomy with positive and negative signals
- Human validation with mandatory free-text feedback when incorrect
- Downstream "Billing Rules Review" handoff concept
- Business / Operational / Quality analytics
- MVP / Phase 2 feature labeling inside source configuration details

## Portfolio safety
This is a fictional/sanitized prototype. It contains no proprietary code, customer data, production URLs, credentials, or copied company UI.

## Run
Open `index.html` in a browser. No build step or dependencies are required.


### Business-indicative practice rule metric
The prototype includes an illustrative comparison between an annual baseline of 2,500 practice-reported rules and the current selected-period volume. Practice-reported rules can be imported from XLS with Jira references so each reported issue can be compared with rules detected by Payer Surveillance. This is explicitly a business-indicative metric, not the product North Star.

## Analytics structure
Analytics is split into **Business Metrics** and **Operational Metrics** so additional future metrics can be added without overcrowding one page. **Model & Coverage Quality** remains a separate quality page.

The Business Metrics page includes a business-indicative **Practice-Reported Rules** comparison: 2025 annual baseline of 2,500 rules, 2026 YTD activity, same-period baseline/run-rate comparison, Jira-linked references, and tool-detected vs potentially missed rules. Practice-reported rules are explicitly not the product North Star.

**Report Missed Policy** is intentionally available from the **Policy Updates** operational work queue, where the operations team can submit missed policies/documents for coverage review.


## Production identity and auditability
Authentication is intentionally simulated in this portfolio prototype. For production, enterprise SSO should provide authenticated user identity and role-based access. Every assignment, reassignment, escalation, review, feedback submission, status transition, and downstream handoff should be attributable to a user and timestamped for auditability.
