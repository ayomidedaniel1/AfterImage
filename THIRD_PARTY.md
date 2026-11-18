# Third-party records

| Component | Use in this candidate | Notice |
| --- | --- | --- |
| Meta IWSDK Core 1.1.0 and its XR input package | World, WebXR session and standard pinch/grab handling | MIT, Meta Platforms, Inc. and affiliates |
| super-three 0.185.0 | SDK renderer, geometry and scene objects | MIT; see the generated package notice |
| WebXR Input Profiles generic-hand | Unmodified right.glb and left.glb fetched by the SDK from jsDelivr for visible hands | MIT, copyright 2019 Amazon, upstream assets package |
| Vite 7.3.8 | Build tool | MIT |
| Playwright Test 1.65.1 and IWER 2.8.0 | Browser verification and labeled simulator capture | Apache-2.0 and MIT respectively |
| Playwright FFmpeg helper | Local screen encoding for the demo | Development/capture tooling only |

The board, target data, geometric puzzle pieces, text and game logic are authored in this project. The recording uses the running game and emulator. It contains no added music or stock imagery.

Preserve both notices beside index.html when hosting. Vite produces THIRD-PARTY-LICENSES.md from the resolved production bundle, including transitive packages, copyright notices and license text. WebXR-input-assets-LICENSE.txt is copied from public/ and covers the externally served hand visuals. package-lock.json pins the JavaScript dependencies. On the recorded build, both generic-hand GLBs loaded over HTTPS with HTTP 200. Availability when the CDN is unreachable remains unverified.

[WebXR input assets and licensing](https://github.com/immersive-web/webxr-input-profiles/tree/main/packages/assets) · [Upstream hand asset license](https://raw.githubusercontent.com/immersive-web/webxr-input-profiles/main/packages/assets/LICENSE.md)
