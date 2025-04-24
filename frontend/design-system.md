# Insight Agent Dashboard Design System

## Overview
This design system defines the visual language for the Insight Agent dashboard, creating an executive-grade, subtly futuristic interface that balances professionalism with modern design elements. The system draws inspiration from Palantir and OpenAI interfaces, focusing on clean layouts with a data-first hierarchy.

## Color Palette

### Primary Colors
- Primary: `#3b82f6` (Blue 500) - Main brand color
- Primary Dark: `#2563eb` (Blue 600) - Hover/active states
- Primary Light: `#93c5fd` (Blue 300) - Subtle highlights

### Neutral Colors
- Background: `#f9fafb` (Gray 50) - Main background
- Card Background: `#ffffff` (White) - Card/component background
- Border: `#e5e7eb` (Gray 200) - Subtle borders
- Text Primary: `#111827` (Gray 900) - Main text
- Text Secondary: `#6b7280` (Gray 500) - Secondary text
- Text Tertiary: `#9ca3af` (Gray 400) - Disabled/hint text

### Dark Mode Colors
- Dark Background: `#111827` (Gray 900) - Main background
- Dark Card Background: `#1f2937` (Gray 800) - Card/component background
- Dark Border: `#374151` (Gray 700) - Subtle borders
- Dark Text Primary: `#f9fafb` (Gray 50) - Main text
- Dark Text Secondary: `#9ca3af` (Gray 400) - Secondary text
- Dark Text Tertiary: `#6b7280` (Gray 500) - Disabled/hint text

### Accent Colors
- Success: `#10b981` (Emerald 500) - Success states
- Warning: `#f59e0b` (Amber 500) - Warning states
- Error: `#ef4444` (Red 500) - Error states
- Info: `#3b82f6` (Blue 500) - Information states

### Gradient Overlays
- Primary Gradient: `linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))`
- Success Gradient: `linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))`
- Neutral Gradient: `linear-gradient(135deg, rgba(249, 250, 251, 0.7), rgba(243, 244, 246, 0.5))`
- Dark Gradient: `linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.8))`

## Typography

### Font Families
- Primary Font: `'Inter', sans-serif` - For all general text
- Monospace Font: `'IBM Plex Mono', monospace` - For code, metrics, and technical data

### Font Sizes
- xs: `0.75rem` (12px) - Smallest text, footnotes
- sm: `0.875rem` (14px) - Secondary text, labels
- base: `1rem` (16px) - Body text
- lg: `1.125rem` (18px) - Subheadings
- xl: `1.25rem` (20px) - Section headings
- 2xl: `1.5rem` (24px) - Major headings
- 3xl: `1.875rem` (30px) - Page titles

### Font Weights
- normal: `400` - Regular text
- medium: `500` - Emphasized text
- semibold: `600` - Subheadings
- bold: `700` - Headings

## Spacing System
- xs: `0.25rem` (4px)
- sm: `0.5rem` (8px)
- md: `1rem` (16px)
- lg: `1.5rem` (24px)
- xl: `2rem` (32px)
- 2xl: `2.5rem` (40px)
- 3xl: `3rem` (48px)

## Border Radius
- All components: `1rem` (16px) - Consistent 2xl border radius

## Shadows
- sm: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Subtle elevation
- md: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` - Card elevation
- lg: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` - Floating elements
- xl: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` - Modal elevation

## Animations & Transitions
- Default Transition: `all 0.2s ease-in-out` - Smooth, subtle transitions
- Hover Transition: `all 0.15s ease-in-out` - Quick feedback on hover
- Page Transition: `all 0.3s ease-in-out` - Smooth page transitions
- Fade In: `opacity 0.3s ease-in-out` - Fade in elements
- Scale: `transform 0.2s ease-in-out` - Subtle scaling effects

## Component Styles

### Cards
- Background: White (Light) / Gray 800 (Dark)
- Border Radius: 1rem (2xl)
- Shadow: md
- Padding: lg (1.5rem)
- Border: 1px solid Border color

### Buttons
- Primary:
  - Background: Primary
  - Text: White
  - Hover: Primary Dark
  - Padding: sm md (0.5rem 1rem)
  - Border Radius: 2xl
  - Transition: Default

- Secondary:
  - Background: White (Light) / Gray 800 (Dark)
  - Border: 1px solid Border color
  - Text: Text Primary
  - Hover: Background Gray 100 (Light) / Gray 700 (Dark)
  - Padding: sm md (0.5rem 1rem)
  - Border Radius: 2xl
  - Transition: Default

- Tertiary:
  - Background: Transparent
  - Text: Text Secondary
  - Hover: Background Gray 100 (Light) / Gray 700 (Dark)
  - Padding: sm md (0.5rem 1rem)
  - Border Radius: 2xl
  - Transition: Default

### Inputs
- Background: White (Light) / Gray 800 (Dark)
- Border: 1px solid Border color
- Focus: Border Primary
- Border Radius: 2xl
- Padding: sm md (0.5rem 1rem)
- Transition: Default

### Tabs
- Inactive:
  - Text: Text Secondary
  - Border Bottom: Transparent
  - Hover: Text Primary
  - Transition: Default

- Active:
  - Text: Primary
  - Border Bottom: 2px solid Primary
  - Transition: Default

### Tables
- Header:
  - Background: Gray 50 (Light) / Gray 800 (Dark)
  - Text: Text Secondary
  - Font Weight: medium
  - Padding: sm md (0.5rem 1rem)

- Row:
  - Background: White (Light) / Gray 800 (Dark)
  - Alternate Row: Gray 50 (Light) / Gray 700 (Dark)
  - Border Bottom: 1px solid Border color
  - Hover: Background Gray 100 (Light) / Gray 700 (Dark)
  - Padding: sm md (0.5rem 1rem)
  - Transition: Default

### Progress Indicators
- Track:
  - Background: Gray 200 (Light) / Gray 700 (Dark)
  - Height: xs (0.25rem)
  - Border Radius: full

- Indicator:
  - Background: Primary
  - Border Radius: full
  - Transition: width 0.3s ease-in-out

### Tooltips
- Background: Gray 900 (Light) / Gray 200 (Dark)
- Text: White (Light) / Gray 900 (Dark)
- Border Radius: md (0.375rem)
- Padding: xs sm (0.25rem 0.5rem)
- Shadow: sm
- Font Size: xs (0.75rem)

## Component-Specific Designs

### Assignment Upload Panel
- Style: High-end file vault interface
- Background: Card with subtle gradient overlay
- Border: Dashed when in dropzone state
- Icons: Large, centered upload icon
- Hover: Subtle scale transform and shadow increase

### Workflow Status Tracker
- Style: Vertical stepper with hover states
- Active Step: Primary color with filled icon
- Completed Step: Success color with check icon
- Pending Step: Gray with number icon
- Connector Line: Vertical line connecting steps
- Hover: Scale transform and brightness increase

### Insight Viewer
- Style: Clean tabs with clear transitions
- Tab Transition: Smooth fade between content
- Markdown: Custom styling for headers, code blocks, lists
- Code Blocks: Monospace font with syntax highlighting
- Tables: Clean borders and alternating row colors

### Data Artifacts
- Style: Modern data table with card-like padding
- Table: Zebra striping with hover effects
- Visualization Toggle: Smooth transition between views
- Data Cells: Monospace font for numerical values
- Pagination: Clean, minimal controls

### Model Leaderboard
- Style: Metric cards with model highlights
- Best Model: Highlighted with success color accent
- Metrics: Large, easy-to-read numbers with appropriate units
- Expandable Rows: Smooth accordion expansion
- Parameters: Monospace font with code-like formatting

### Agent Console
- Style: Intelligent assistant chat UI
- User Messages: Right-aligned with primary color background
- Agent Messages: Left-aligned with card background
- Input: Clean, prominent text area with send button
- Quick Prompts: Pill-shaped buttons with hover effects
- Typing Indicator: Subtle animation when agent is "thinking"
