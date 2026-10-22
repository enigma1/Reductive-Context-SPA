# Reductive Context Workspace SPA

A human-in-the-loop workspace for per-query, human-curated, segment-scoped context selection and bounded LLM inference.

The `Reductive Context Workspace` allows developers to explore a codebase and deliberately construct the context associated with an individual LLM request. Rather than providing an entire file tree as context, the developer selects the relevant folders, files, and, where necessary, individual code segments. This creates a reduced, query-specific context before the request is dispatched for inference.

The frontend is a ReactJS SPA focused on the interactive context-curation workflow, using wizard-based configuration, file and folder selection, and code inspection. The developer remains responsible for confirming which parts of the codebase should be included in the context. The bundle mechanism is effectively a context compiler where the user can specify signature mode and lines of codes to be included with the bundle as well as a final bundle editing before submission to the LLM.

The frontend does not directly access the filesystem or communicate with the LLM. Filesystem traversal, code analysis, tree-sitter extraction, token counting, context assembly, and model communication are handled by the `Reductive Context Workspace Server`.

## Support This Project

If you find this application useful, you can support development via PayPal:
[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue)](https://www.paypal.com/donate?hosted_button_id=CRPY96XAY793A)
Thank you for helping keep this project maintained and improving!
written by: Mark Samios [@enigma1](https://github.com/enigma1)

## Features

- Eliminates complex contexts before dispathing a code bundle to LLMs.
- Keeps the human user in the development loop for configuration and approvals
- Supports LLM clarification
- File and folder selection
- Wizard-style configuration
- Checkbox-based context selection
- File and code inspection
- Token/context information
- User-controlled context assembly
- Interaction with the backend API

## Current API

| API Command                    | Data Parameters            | Result                                |
| ------------------------------ | -------------------------- | ------------------------------------- |
| `POST /api/getPaths`           | `{ root, config }`         | Returns folders with files underneath |
| `POST /api/readFile`           | `{ FileNode }`             | Returns file contents                 |
| `POST /api/writeFile`          | `{ FileNode }`             | Writes file contents                  |
| `GET /api/getLanguages`        | n/a                        | Returns supported file languages      |
| `GET /api/getBundleList`       | n/a                        | Returns all bundles from the database |
| `POST /api/getBundle`          | `{ GetBundleRequest }`     | Returns bundle details                |
| `POST /api/createBundle`       | `{ CreateBundleRequest }`  | Creates a new bundle                  |
| `POST /api/setBundle`          | `{ SetBundleRequest }`     | Updates an existing bundle            |
| `POST /api/deleteBundles`      | `{ DeleteBundlesRequest }` | Deletes the specified bundles         |
| `POST /api/submitBundle`       | `{ SubmitBundleRequest }`  | Sends the user bundle to the LLM      |
| `POST /api/resumeBundle`       | `{ ResumeBundleRequest }`  | Resumes bundle processing             |
| `GET /api/getRoleList`         | n/a                        | Returns all roles                     |
| `POST /api/getRole`            | `{ GetRoleRequest }`       | Returns role details                  |
| `POST /api/setRole`            | `{ SetRoleRequest }`       | Creates or updates a role             |
| `POST /api/deleteRoles`        | `{ DeleteRolesRequest }`   | Deletes the specified roles           |
| `POST /api/getTableData`       | `{ GetTableDataRequest }`  | Returns table data                    |
| `GET /api/getOpenRouterModels` | n/a                        | Returns available OpenRouter models   |
| `POST /api/saveSettings`       | `{ SaveSettingsRequest }`  | Saves application settings            |
| `GET /api/loadSettings`        | n/a                        | Loads application settings            |

### Planned Workflow

The intended workflow is:

1. The user selects the required **role** for the LLM.
1. The user provides one or more file folders.
1. The backend scans the paths and produces a file tree with contextual information and token estimates.
1. Additional scan/configuration options can constrain the amount of content considered.
1. The frontend presents the resulting tree to the user.
1. The user selects the folders and files relevant to the request.
1. For large files, the user can further select individual functions or code segments.
1. The backend assembles the selected content into the context for the request.
1. The backend verifies that the resulting context fits within the configured model constraints.
1. The user submits a question/request together with the selected context.
1. The backend dispatches the request to the configured LLM.
1. In case of clarification the user is informed to provide additional information
1. The response can be presented to the user for review and, where applicable, proposed code changes can be inspected and merged.

### Tech Stack

- ReactJS,
- React Router,
- TypeScript,
- TanStack Query: server-state management with custom selector-based hook interfaces
- Custom Store: application state management with selector-based access
- Custom Forms with state and presets support
- Monaco Editor for code view and code merges
- React Markdown for prompts, summary, reasoning
- Axios API with manifest-driven mock setup and error resolution
- TailwindCSS with custom multi-theme options
- Zod for API runtime validation
- Playwright for e2e tests

### Current Status

This project is in development having completed LLM connectivity, basic bundle and database storage requirements for files, prompts and token calculations.

The filesystem scanning, code analysis, context reduction, token accounting, LLM integration, and response-processing functionality are in progress. Proof of concept is being established. Backend is provided here: [Reductive Context Workspace Server](https://github.com/enigma1/Reductive-Context-Server.git)

## 🧾 License

GNU General Public License (GPL) v3
