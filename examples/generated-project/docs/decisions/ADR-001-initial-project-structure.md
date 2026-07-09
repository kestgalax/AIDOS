# ADR-001: Initial Project Structure

## Status

Proposed

## Context

This project needs an explicit structure before implementation starts.

Planned product form: Not selected yet.

Initial stack direction: Not selected yet.

## Decision

Use AIDOS repository artifacts for intent, architecture, decisions, execution, and governance.

## Alternatives

- Start with code only.
  Rationale: rejected because agents need durable context.

## Consequences

- AI agents have a deterministic entry point.
- Project memory is stored with the repository.
