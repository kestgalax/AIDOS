# Troubleshooting

This document captures operational diagnosis practices for AIDOS.

## Current Scope

During bootstrap, troubleshooting focuses on repository health:

- missing required files;
- broken links between documents;
- missing ADR sections;
- missing traceability fields;
- inconsistent governance instructions;
- premature runtime stack decisions.

## Diagnostic Principles

- Reproduce the issue before changing artifacts.
- Identify which AIDOS layer is affected.
- Check whether the issue is a missing decision, missing documentation, or implementation defect.
- Preserve findings in the appropriate durable artifact.

## Layer-Based Diagnosis

### Product Intent

Symptoms:

- unclear mission;
- conflicting principles;
- ambiguous non-goals.

Resolution:

- update `docs/product-intent.md` with human approval.

### Architecture

Symptoms:

- unclear component boundary;
- undocumented runtime assumption;
- conflict between implementation and structure.

Resolution:

- update `docs/architecture.md`;
- add or supersede an ADR when the decision is durable.

### Decisions

Symptoms:

- repeated debate about the same technical choice;
- stack or framework appears without rationale;
- old decision no longer matches the system.

Resolution:

- add a new ADR;
- mark the old ADR as superseded when needed.

### Execution

Symptoms:

- tasks lack acceptance criteria;
- reviews lack evidence;
- agents skip required reading.

Resolution:

- update `.ai/` role files or `docs/specs/` templates.

### Governance

Symptoms:

- Definition of Done is bypassed;
- security-sensitive action lacks human approval;
- traceability is missing.

Resolution:

- update `.ai/constitution.md` or `.ai/constraints.md`;
- block the change until governance is satisfied.

## Incident Notes

When a significant process failure occurs, record:

- date;
- affected layer;
- symptom;
- root cause;
- corrective action;
- follow-up ADR or documentation change.
