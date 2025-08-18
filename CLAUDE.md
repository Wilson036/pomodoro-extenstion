# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension for a Pomodoro timer built with React, TypeScript, and Vite. The extension provides a customizable Pomodoro timer with multiple cycles, notifications, and settings persistence.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the extension for production (TypeScript compilation + Vite build)
- `pnpm lint` - Run ESLint on the codebase
- `pnpm lint:fix` - Run ESLint with automatic fixes
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting without making changes
- `pnpm preview` - Preview the built extension

## Architecture

### Chrome Extension Structure
- **Manifest V3**: Uses service worker architecture (`src/background.js`)
- **Popup**: Main timer interface (`src/popup/`)
- **Options Page**: Settings configuration (`src/options/`)
- **Permissions**: `storage`, `notifications`

### Key Components

#### Storage System
- **Chrome Storage Sync**: User settings (cycles, time configurations)
- **Chrome Storage Local**: Timer state persistence (current time, running status)
- Settings are structured as `CycleSettings[]` allowing multiple focus/break time configurations

#### Timer Logic (`src/hooks/useTimeCounter.ts`)
- Centralized timer state management with `TimerState` type
- Persistent timer that survives popup closes/opens
- Automatic state synchronization between background and popup
- Cycle progression: focus → break → next cycle

#### Background Service Worker (`src/background.js`)
- Timer completion notifications
- Badge display for remaining time
- Keyboard shortcuts (Ctrl+Shift+P toggle, Ctrl+Shift+R reset)
- Keep-alive mechanism during active timers

### Technology Stack
- **Frontend**: React 19 + TypeScript + Ant Design
- **Build Tool**: Vite with `@crxjs/vite-plugin` for Chrome extension support
- **Path Aliases**: `@/*` maps to `src/*`

### Type Definitions (`src/types.ts`)
- `TimerState`: Core timer state with cycle tracking
- `TimeSettings`: Minutes/seconds configuration
- `CycleSettings`: Focus/break time pairs
- `PomodoroSettings`: Array of cycle configurations

## Extension Testing

To test the extension:
1. Run `pnpm build` to create the `dist/` folder
2. Load `dist/` as an unpacked extension in Chrome
3. Use popup interface or keyboard shortcuts to test functionality

## Storage Architecture

The extension uses a dual storage approach:
- **Sync Storage**: User preferences that sync across devices
- **Local Storage**: Ephemeral timer state that doesn't need syncing

Timer state includes cycle progression tracking to support multiple focus/break periods with different durations.