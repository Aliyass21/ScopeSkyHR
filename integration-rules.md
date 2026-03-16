# CoreHR API Integration Rules

These rules MUST be followed exactly when replacing mockup data with the real FaceId Attendance Backend API. This file is designed to prevent context rotting and broken code during the integration.

## 🚨 CRITICAL GUARDRAILS (DO NOT IGNORE)
1. **No Hallucinations:** Use ONLY the types, endpoints, and response formats defined in `API_INTEGRATION.md`. If an endpoint or field is missing from that document, DO NOT invent it. Ask the user for clarification.
2. **Phase Isolation:** Do NOT attempt to integrate multiple phases or modules at once. Complete ONE phase, ensure it compiles, and ask the user to test before proceeding. Context rotting will occur if you touch too many files simultaneously.
3. **Keep the Design Intact:** Your task is strictly wiring up data and logic. DO NOT change Tailwind classes, Shadcn UI layouts, or CSS variables unless explicitly necessary to display the data properly (e.g., adding a loading spinner).
4. **Strict TypeScript:** Do not use `any` unless absolutely forced. Use the strict interfaces described in `API_INTEGRATION.md`. Fix type errors as you create them.
5. **Preserve i18n:** Never hardcode text into components. Always use the `useTranslation()` hook.

## Architecture Rules
1. **API Client:** All requests must go through a centralized, configured Axios/Fetch wrapper. Do not use random inline `fetch()` calls in components.
2. **State Management:** Use TanStack Query (React Query) for server state handling (caching, loading states, error states). Use Zustand ONLY for global client state (e.g., the User's Auth Token, UI toggles).
3. **Data Wrapping:** Always check `.succeeded` on the `ApiResponse<T>` wrapper before consuming `.data`.
4. **Headers:** Ensure `X-App-Platform: web` and `Authorization: Bearer <token>` are attached to every non-auth request automatically via an interceptor.

## Rollback Policy
If you break a component and cannot fix the TypeScript errors within 1 attempt, REVERT the component back to its mock state and ask the user to check `.api` definitions instead of forcing a broken component.
