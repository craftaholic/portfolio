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

## Philosophy

The core idea is simple: your development environment should be **reproducible**, **version-controlled**, and **portable**. Whether you're setting up a new MacBook, spinning up a Linux VM, or working in WSL, you should be able to run a single command and have your entire environment ready.

## What's Configured

**Shell & Terminal**
- Zsh with custom prompt and aliases
- Wezterm terminal with GPU acceleration
- Tmux with vim-style navigation and custom status bar

**Development**
- Neovim with extensive Lua-based configuration (50+ plugins)
- Native LSP support for Go, TypeScript, Python, Rust
- Telescope for fuzzy finding, Treesitter for syntax highlighting
- Claude AI integration for AI-assisted development

**System**
- Aerospace (macOS tiling window manager)
- Git configuration with delta for diffs
- SSH and GPG key management

## How It Works

```bash
# Clone the repo
git clone https://github.com/craftaholic/dotfiles ~/.dotfiles

# Install everything
cd ~/.dotfiles && make setup
```

GNU Stow creates symlinks from your home directory to the config files in the repo. Devbox ensures you get the exact same package versions regardless of your OS package manager.
