---
title: Dotfiles
description: Declarative local machine environment configuration framework using GNU Stow and Devbox for cross-platform consistency.
publishDate: 2024-01-01
tags:
  - Neovim
  - Lua
  - Shell
  - Devbox
  - GNU Stow
github: https://github.com/craftaholic/dotfiles
status: mature
opensource: true
pinned: true
icon: "🛠️"
features:
  - "Unified Configuration Management: GNU Stow manages symlinks from home directory to config files"
  - "Consistent Binary Versions: Devbox ensures same package versions across platforms"
  - "Dual Automation: Both Makefile and Taskfile.yml for CLI scripting"
  - "Single-Command Setup: make setup or task setup to get everything running"
  - "Extensive Neovim configuration with Lua-based plugins"
  - "WSL support with clipboard integration"
---

A framework for declaratively managing local machine environment configurations across multiple platforms and machines. Uses GNU Stow to manage symlinks and Devbox to maintain consistent package versions.

## What's Configured

**Shell & Terminal**
- Zsh shell configuration
- Wezterm terminal emulator
- Tmux multiplexer

**Development**
- Neovim with extensive Lua-based configuration
- Devbox for package management
- Claude AI integration

**System**
- Aerospace (macOS window manager)
