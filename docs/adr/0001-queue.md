# 0001: Background Queue Architecture (BullMQ vs pg-boss)

## Status

Accepted - 2026-11-14

## Context

FormFlow processes incoming form submissions through an asynchronous processing pipeline, including notification emails via SMTP, outbound webhook deliveries, rate limiting, spam detection, and heavy headless-browser rendering (exporting submissions to PDF or screenshot previews). We need a resilient background job queue system for Node.js that supports delayed jobs, retries with exponential backoff, concurrency controls, and high throughput bursts without impacting OLTP database operations.

## Decision

We choose **BullMQ** backed by **Redis 7** for the background job processing pipeline in `apps/worker`.

## Alternatives Considered

- **pg-boss (PostgreSQL-backed queue)**:
  - _Pros_: Leverages our existing Postgres instance; no secondary datastore (Redis) required; transactional enqueueing alongside form submissions.
  - _Cons_: Heavy burst traffic (e.g., viral campaigns generating thousands of concurrent submissions) introduces table bloat, write amplification, vacuuming overhead, and row-level lock contention on PostgreSQL OLTP tables. Lacks low-latency real-time pub/sub metrics without heavy polling.
- **AWS SQS / RabbitMQ**:
  - _Pros_: Scalable enterprise message brokers.
  - _Cons_: High operational complexity for local development; introduces cloud vendor lock-in (SQS) or complex protocol configuration (AMQP).

## Consequences

### Positive

- Redis in-memory execution delivers sub-millisecond job enqueue and dequeue latency.
- Native support for parent-child job dependency chains, token-bucket rate limiting, stalled job detection, and exponential backoff retries.
- Redis pub/sub enables instant event notification and live dashboard monitoring.
- Completely decouples high-throughput submission pipeline traffic from relational PostgreSQL transaction pools.

### Negative

- Requires maintaining Redis in local development (`infra/docker-compose.dev.yml`) and in production environments.
