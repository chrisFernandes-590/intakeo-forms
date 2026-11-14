# 0002: Form Schema Definition and Storage (JSON Schema vs Custom DSL vs Zod-Derived Schema)

## Status

Accepted - 2026-11-14

## Context

FormFlow requires a persistent schema definition format for forms created in the visual form builder. The schema format must support declarative field declarations, validation constraints (required, regex, numeric ranges, lengths), dynamic conditional visibility, serialization to and from PostgreSQL JSONB columns, client-side rendering (React), and serverside evaluation/validation.

## Decision

We choose **JSON Schema** (standard draft specification) augmented with custom form-field layout attributes (such as `x-formflow-ui`) as the canonical stored format for forms.

## Alternatives Considered

- **Custom DSL**:
  - _Pros_: Tailor-made for our visual canvas; compact syntax.
  - _Cons_: Requires authoring and maintaining bespoke lexers, parsers, AST compilers, documentation, and tooling. Incompatible with standard third-party validators and external API integrations.
- **Zod-Derived Schema**:
  - _Pros_: First-class TypeScript developer experience with built-in runtime parsing.
  - _Cons_: Zod schemas are executable JavaScript functions and cannot be natively serialized to static JSON. Storing intermediate JSON structures to rehydrate dynamic Zod schemas on the fly introduces fragility, version drift across releases, and poor cross-language portability (e.g., if mobile SDKs or external webhooks need to inspect form structure).

## Consequences

### Positive

- Strict industry-standard format with broad cross-platform support and extensive tooling across languages.
- Safe, portable serialization in PostgreSQL `jsonb` columns with native JSON indexing and query capabilities.
- Easily translated into client-side form controls and runtime validators (e.g., converted to Zod or evaluated via Ajv).
- Clear extension points using standard `x-` annotations for UI-specific metadata (layout grids, placeholders, helper text).

### Negative

- Pure JSON Schema lacks native visual layout concepts, necessitating well-specified `x-` extension schemas.
