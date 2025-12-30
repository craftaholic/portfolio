---
title: Infrastructure Engine
description: Self-service platform for managing infrastructure-as-code pipelines through a unified GitOps interface.
publishDate: 2024-01-01
tags:
  - Go
  - Terraform
  - GitOps
  - Platform Engineering
  - CloudFormation
github: https://github.com/craftaholic/infrastructure-engine
status: wip
opensource: true
icon: "⚙️"
features:
  - "Multi-tool support: Works with Terraform, Ansible, and CloudFormation"
  - "GitOps workflow: Infrastructure changes tracked and managed via Git"
  - "Self-service provisioning: Deploy resources without manual intervention"
  - "Scalable architecture: Designed to grow with organizational needs"
  - "NATS message queues for async operations"
  - "Git provider integrations"
---

A self-service platform enabling teams to manage infrastructure-as-code pipelines through a unified interface. Applies GitOps principles to automate and version-control infrastructure changes across multiple IaC tools.

## Why This Exists

In enterprise environments, infrastructure provisioning is often a bottleneck. Developers wait days for a VM or database because everything goes through a ticket queue. This project aims to provide a self-service layer on top of existing IaC tools.

## Architecture

Built with Clean Architecture principles for maintainability and testability:

```
┌─────────────────────────────────────────┐
│              API Layer                   │
│         (HTTP/gRPC endpoints)            │
├─────────────────────────────────────────┤
│           Controller Layer               │
│      (Request handling, validation)      │
├─────────────────────────────────────────┤
│            Use Case Layer                │
│          (Business logic)                │
├─────────────────────────────────────────┤
│           Repository Layer               │
│        (Data access abstraction)         │
├─────────────────────────────────────────┤
│         Infrastructure Layer             │
│   (Git, Terraform, NATS, Databases)      │
└─────────────────────────────────────────┘
```

## How It Works

1. **Request**: User requests infrastructure through API or UI
2. **Validate**: Engine validates request against policies
3. **Generate**: Creates IaC code (Terraform/CloudFormation)
4. **Commit**: Pushes to Git repository (GitOps)
5. **Apply**: CI/CD pipeline applies the changes
6. **Notify**: User receives status updates via NATS

## Tech Stack

- **Language**: Go 1.23+
- **Build**: Earthly for reproducible builds, GitHub Actions for CI
- **Dev Tools**: Devbox, Task runner
- **Messaging**: NATS for async operations and notifications
- **Storage**: PostgreSQL for state, Git for IaC code

## Current Status

This project is in active development. Core features implemented:
- Git provider integration (GitHub, GitLab)
- Terraform plan/apply workflow
- Basic API endpoints
- NATS message queue setup

Coming soon:
- CloudFormation support
- Policy engine (OPA)
- Web UI dashboard
