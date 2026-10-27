# React dependency injection

This library provides `DIProvider` and `useInjection`, a small bridge between React and Inversify.

The app registers concrete services in `apps/web/src/app/container.ts` and provides that container near the root of the React tree. Feature components request interfaces through tokens instead of constructing HTTP clients themselves.
