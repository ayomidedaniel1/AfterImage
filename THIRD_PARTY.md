# Afterimage dependencies

The scene geometry and UI are generated in main.js and index.html. Meta IWSDK Core 1.1.0 (MIT) provides the world, renderer and grab interactions. Its XR input implementation can request hand model assets from the WebXR input profiles CDN. Offline hand visuals need verification.

The production build emits bundled package notices to dist/THIRD-PARTY-LICENSES.md. Keep this file with the deployed assets. package-lock.json records the exact dependency tree.

Vite 7.3.8 (MIT), Playwright Test 1.65.1 (Apache-2.0) and Meta IWER 2.8.0 (MIT) are development dependencies. The smoke test injects the emulator into the test browser.
