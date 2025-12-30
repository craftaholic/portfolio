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

## Architecture

Built with a layered design pattern:
- **API Layer**: HTTP endpoints for external interactions
- **Controller Layer**: Request handling and routing
- **Use Case Layer**: Business logic
- **Repository Layer**: Data access abstraction
- **Infrastructure Layer**: External service integrations

## Tech Stack

- **Language**: Go 1.23+
- **Build**: Earthly, GitHub Actions
- **Dev Tools**: Devbox, Task runner
- **Messaging**: NATS
