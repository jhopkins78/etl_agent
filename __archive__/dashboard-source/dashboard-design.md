# Insight Dashboard Design Document

## Overview
This document outlines the design for a minimalist, data-science-focused dashboard for an AI-powered Insight Agent. The dashboard will help data scientists and analysts monitor the lifecycle of automated assignments and research tasks completed by multi-agent systems.

## Design Philosophy
- **Clean, no-frills UX**: Professional, streamlined, focused on utility
- **Transparency-focused**: Highlight which stages of analysis are complete or pending
- **Integrated workflow view**: From raw data to final insight report
- **Export-oriented**: Users should be able to download the generated report

## Color Scheme & Typography
- **Colors**: Neutral tones (slate grays, soft blues) with accent colors for status indicators
  - Primary: #334155 (slate-700)
  - Secondary: #64748b (slate-500)
  - Background: #f8fafc (slate-50)
  - Success: #10b981 (emerald-500)
  - Warning: #f59e0b (amber-500)
  - Error: #ef4444 (red-500)
  - Pending: #6366f1 (indigo-500)
- **Typography**:
  - Headings: Inter (sans-serif)
  - Body: Inter (sans-serif)
  - Code/Monospace: JetBrains Mono or Fira Code

## Layout Structure
The dashboard will use a responsive grid layout with the following main sections:

### 1. Header
- Logo/Title: "Insight Agent Dashboard"
- Navigation: Tabs for different views (if needed)

### 2. Main Content Area (Grid Layout)
The main content area will be divided into four main sections arranged in a grid:

#### 2.1 Assignment Overview (Top Left)
- Upload area for .md file with problem description
- Display parsed tasks (EDA, Modeling, Evaluation, Reporting)
- Assignment metadata (name, date, status)

#### 2.2 Workflow Status Panel (Top Right)
- Step-by-step ETL + Analysis flow visualization
- Status indicators (✅, ⏳, ❌) for each step
- Action buttons to manually trigger/override each phase
- Progress bar for overall completion

#### 2.3 Insight Viewer (Bottom Left)
- Tabbed interface for "EDA", "Modeling", "Evaluation", "Full Report"
- Markdown renderer for displaying report content
- Download buttons for .md and .pdf formats
- Syntax highlighting for code blocks

#### 2.4 Data Artifacts Panel (Bottom Right)
- Data preview table (first 20 rows)
- Tabs for different visualizations:
  - Histograms
  - Correlation matrices
  - Feature importance plots
  - Other relevant visualizations
- Expandable/collapsible sections for detailed views

### 3. Agent Console (Optional MVP+) (Bottom Panel)
- Chat interface with input field and message history
- Connection to GPT reasoning engine
- Example queries displayed as suggestions
- Response area with markdown support for rich responses

## Component Hierarchy
```
App
├── Header
├── MainContent
│   ├── AssignmentOverview
│   │   ├── UploadArea
│   │   └── TaskList
│   ├── WorkflowStatusPanel
│   │   ├── WorkflowSteps
│   │   └── ProgressIndicator
│   ├── InsightViewer
│   │   ├── TabNavigation
│   │   ├── MarkdownRenderer
│   │   └── DownloadOptions
│   └── DataArtifactsPanel
│       ├── DataPreview
│       └── VisualizationTabs
└── AgentConsole (Optional)
    ├── ChatInput
    ├── MessageHistory
    └── SuggestionChips
```

## Responsive Design Considerations
- Desktop: Full grid layout with all panels visible
- Tablet: 2x2 grid with scrollable panels
- Mobile: Stacked panels with collapsible sections

## Interactive Elements
- Drag and drop file upload
- Clickable workflow steps to view details
- Tabbed navigation for report sections
- Expandable data visualizations
- Downloadable reports
- Chat interface with the agent

## Status Indicators
- ✅ Complete: Green checkmark
- ⏳ In Progress: Blue spinning indicator
- ❌ Error/Failed: Red X mark
- ⚪ Not Started: Gray circle

This design aims to create a clean, functional dashboard that prioritizes data visibility and workflow transparency while maintaining a minimalist aesthetic suitable for professional data science work.
