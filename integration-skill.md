# CoreHR API Integration Skill

This skill defines the exact workflow for safely replacing mock data with the real FaceId API layer. You MUST use this step-by-step process.

## The "Stop and Test" Workflow Loop
For every sub-task or phase, follow this loop exactly:
1. **Analyze:** Read the specific section of `API_INTEGRATION.md` related to your task.
2. **Implement Types:** Add or update `src/types/*.ts` to match the exact backend JSON shapes.
3. **Implement API Call:** Add the endpoint function to the relevant `src/api/*.ts` file or React Query hook.
4. **Wire UI:** Update the component state hook (e.g., swap local mockup hook for React Query hook).
5. **Verify Types:** Run `npm run lint` or `npx tsc --noEmit` locally if possible to ensure you didn't break TS.
6. **STOP AND PROMPT!** Explicitly tell the user: "Phase completed. Please test the UI in your browser and confirm it works before we move on."

## Phase Definition
Always clarify which phase you are currently executing. Do not start a new phase until the user confirms the current one works.
- **Phase 1: Base Client & Auth** (Axios interceptors, Login, Token Persistence)
- **Phase 2: Global Types & Routing** (Updating standard models across the app, applying real RBAC permissions from the auth payload)
- **Phase 3: Dashboard & Lists** (Read-only data, processing `X-Pagination` correctly via headers)
- **Phase 4: CRUD Forms** (Projects, Leave Requests, passing error strings back to Toast notifications)
- **Phase 5: Face Check-in** (`multipart/form-data` handling, file uploads, specific error handling)
- **Phase 6: Full Cleanup** (Deleting `/data` JSON files and mockup API delays)

## Specific Technical Rules
- **Pagination Parsing:** Read the `X-Pagination` header (`JSON.parse(res.headers.get('x-pagination'))`) and map it to your Table pagination state safely. The array payload will be in `res.data.data`.
- **Form Data:** When handling the Face Check-in (`/api/attendance/checkin/initiate`), append the image `File` properly via `FormData` and do NOT set `Content-Type: application/json`.
- **Error Handling:** Form fields that fail validation will return string messages in the `ApiResponse.errors` array. Feed these back to React Hook Form or global Toast UI.
