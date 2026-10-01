# Reductive Context Workspace SPA

A human-in-the-loop workspace for per-query, human-curated, segment-scoped context selection and bounded LLM inference.

The `Reductive Context Workspace` allows developers to explore a codebase and deliberately construct the context associated with an individual LLM request. Rather than providing an entire file tree as context, the developer selects the relevant folders, files, and, where necessary, individual code segments. This creates a reduced, query-specific context before the request is dispatched for inference.

The frontend is a ReactJS SPA focused on the interactive context-curation workflow, using wizard-based configuration, file and folder selection, and code inspection. The developer remains responsible for confirming which parts of the codebase should be included in the context. The bundle mechanism is effectively a context compiler where the user can specify signature mode and lines of codes to be included with the bundle as well as a final bundle editing before submission to the LLM.

The frontend does not directly access the filesystem or communicate with the LLM. Filesystem traversal, code analysis, tree-sitter extraction, token counting, context assembly, and model communication are handled by the `Reductive Context Workspace Server`.

## Features

- Eliminates complex contexts before dispathing a code bundle to LLMs.
- Keeps the human user in the development loop for configuration and approvals
- File and folder selection
- Wizard-style configuration
- Checkbox-based context selection
- File and code inspection
- Token/context information
- User-controlled context assembly
- Interaction with the backend API

## Current API

| API Command          | Data Parameters                      | Result                                  |
| -------------------- | ------------------------------------ | --------------------------------------- |
| `POST /api/getPaths` | { root, config }                     | returns folders with files under        |
| `POST /api/readFile` | { FileNode }                         | Return file contents                    |
| `POST /api/select`   | { selected folders/files/functions } | returns assembled prompt + IDs          |
| `POST /api/ask`      | { question, prompt }                 | returns raw LLM response + parsed edits |

### Planned Workflow

The intended workflow is:

1. The user provides a project or filesystem root.
2. The backend scans the root and produces a file tree with contextual information and token estimates.
3. Additional scan/configuration options can constrain the amount of content considered.
4. The frontend presents the resulting tree to the user.
5. The user selects the folders and files relevant to the request.
6. For large files, the user can further select individual functions or code segments.
7. The backend assembles the selected content into the context for the request.
8. The backend verifies that the resulting context fits within the configured model constraints.
9. The user submits a question/request together with the selected context.
10. The backend dispatches the request to the configured LLM.
11. The response can be presented to the user for review and, where applicable, proposed code changes can be inspected and merged.

### Tech Stack

- ReactJS,
- React Router,
- TypeScript,
- TanStack Query: server-state management with custom selector-based hook interfaces
- Custom Store: application state management with selector-based access
- Custom Forms with state and presets support
- Monaco Editor for code view and code merges
- Axios API with manifest-driven mock setup and error resolution
- TailwindCSS with custom multi-theme options

### Current Status

This project is in early development.

The filesystem scanning, code analysis, context reduction, token accounting, LLM integration, and response-processing functionality are planned backend components.

## 🧾 License

GNU General Public License (GPL) v3
