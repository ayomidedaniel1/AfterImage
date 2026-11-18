# Afterimage — Status

## Last updated

- November 18, 2026, 17:34 WAT (Africa/Lagos). No Git repository or revision. Production entry bundle is index-iEoO_a-p.js.
- Official close is November 18 at noon PST, 21:00 WAT. About 3h26m remained at this update. Reserve 20:15–21:00 WAT for capture, hosting and submission.
- [Entrant-supplied official rules](https://start-developer-competition-26.devpost.com/rules)

## Environment

- Fresh project confirmed by entrant. Only README.md and AGENTS.md existed. No prior STATUS.md, application, dependency manifest or build commands.
- Windows, Node 24.18.0, npm 11.6.4, Git 2.47.0. Android platform-tools installed; adb devices -l listed zero devices. No Unity editor found in standard locations.
- Meta IWSDK Core 1.1.0, Vite 7.3.8, IWER 2.8.0, Playwright Test 1.65.1. Versions locked in package-lock.json.
- Target is Quest Browser. Entrant has no Quest. Local static HTTPS delivery tested in desktop Edge.

## What works

The immersive session anchors a unit-scale board once relative to the initial viewer pose. Matching the tutorial diamond starts three authored rounds. Each round shows a five-second constellation, hides it, and presents a diamond, cube and pyramid in the tray. Released shapes stay suspended. Check freezes the placements and reveals the corresponding outlines, error lines and round accuracy. Next advances to the following round or final average. Play again resets scores, timer, objects and tutorial.

Star positions and targets use the same board-local meters. Each identity scores linearly from 100% at zero error to 0% at 0.15 m. The state machine accepts Check once per rebuild. Fixed pinch controls use the SDK grab handle and require a fresh press. A short post-release guard prevents accidental activation. Observation uses elapsed active time and pauses when the session is obscured or no wrist pose is available.

## Verification

- Static checks PASS. node --check game.js, node --check main.js, node --check smoke.mjs and node --check vite.config.js.
- Unit tests PASS. node --test game.test.js passed six tests covering exact, intermediate and capped errors, swapped identities, rounded session average, duplicate transitions, countdown and replay.
- Build PASS. npm.cmd run build produced dist/index.html, hashed assets and bundled license notices. Vite reported dependency annotation and chunk-size warnings. Main bundle about 1.69 MB gzip.
- Simulator PASS. node smoke.mjs opened the production build over local HTTPS in headless Edge with IWER's Quest 3 profile. Desktop fallback, tutorial, each shape moved to its target in round one (100%), two tray-only rounds, all Check/Next actions, final average and replay passed without uncaught page errors. A sustained pinch across the Check/Next change produced one action. After replay the left hand grabbed the tutorial diamond, released it beyond the board, recovered it from the tray and completed the tutorial again. Entry into VR used a browser automation click.
- Quest hardware and performance UNVERIFIED. No headset available. Public deployment and judge access NOT RUN.

## How to run

From the project directory, run npm.cmd ci --ignore-scripts followed by npm.cmd run dev. Open the localhost URL Vite prints. Desktop displays the scene and compatibility message. Use a device with immersive VR and hand tracking for native input.

## How to build/deploy

1. Run npm.cmd run build. Output is dist/. For a manual desktop preview run npm.cmd run preview and open the printed address.
2. Run node smoke.mjs after building. The test uses installed Microsoft Edge and Git for Windows OpenSSL (or set OPENSSL_BIN to its executable). It starts a private loopback HTTPS server with an ephemeral self-signed certificate, accepts that certificate in the test browser, and shuts both down.
3. After entrant authorization, upload the contents of dist/ to an HTTPS static host with index.html at the entry path. Verify from a separate device, without account credentials, then test in Quest Browser if available. Public hosting and trusted certificate delivery remain unverified.

## Known issues

- Hardware comfort, frame rate and cold-start behavior remain the largest verification gaps.
- Tracking interruption, suspension/resume and real hand visuals need further testing. SDK hand visuals may fetch external assets.
- The README's original three-hour estimate was historical. The rules name IWSDK (WebXR) for hosted entries, permit alternative hosting, and also refer to a GitHub page in the entry checklist. Verify the final link in Devpost. The reveal section has a truncated duplicate bullet.
- The official rules specify hands-first Gaming, project-history divisions, a public demo video under three minutes and a project description. Fresh project confirmed; membership and individual eligibility unverified.

## Next three actions

1. Exercise tracking interruption and headset/session suspension in the emulator.
2. If a Quest becomes available, please run the hands-only checklist in SUBMISSION.md and measure headset frame rate. Otherwise capture and label emulator footage.
3. Reserve the final 45 minutes to deploy with authorization, check independent judge access, capture representative footage and complete entrant submission.

## Decisions and assumptions

Selected IWSDK because Node was available, no native project existed, and the official rules explicitly list IWSDK hosting. Use SDK OneHandGrabbable and Grabbed. The emulator runs only in the test browser. Keep the board at unit scale with meter-based local coordinates.

## Submission status

- Build/link: local dist/ only. Video: absent. Description: gameplay draft in SUBMISSION.md.
- Judge access: UNVERIFIED. Submitted: no. Evidence of submission: none.

## Changed files

- index.html and main.js implement browser entry, the spatial board, grab controls and phase presentation. game.js holds authored data, state transitions, timing and scoring. game.test.js checks the game logic.
- package.json, package-lock.json, vite.config.js and .gitignore define the locked build and output notices.
- smoke.mjs verifies the full production loop in the emulator.
- STATUS.md, SUBMISSION.md and THIRD_PARTY.md record evidence, manual checks and dependencies.
- README.md and AGENTS.md preserved. No partial edits, development server or emulator left running. The Android debugging daemon was started for device discovery.


