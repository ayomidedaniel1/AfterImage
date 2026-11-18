# Afterimage — Status

## Last updated

- November 18, 2026, 19:42 WAT (Africa/Lagos). About 1h18m until the official close at 21:00 WAT / noon PST. Keep 20:15–21:00 WAT for delivery and submission. [Official rules](https://start-developer-competition-26.devpost.com/rules)
- RC gameplay source matches master at 85a9e24f1109a307ed3df139336739dbc349eab0. The previous status predates Git initialization. Release notices, expanded test assertions and submission records are working-tree additions. No new commit or push was made by this release pass.
- Main bundle assets/index-BEvlVPsm.js, SHA-256 ea50fa109bc9868fe13656faa9a4b25055d7392c1db4a342bb7598d76eb48a25.
- Preserved upload artifact: release/rc-85a9e24/afterimage-site.zip, 7,447,283 bytes, SHA-256 8b113b3a3ad241b49a99b663e5a63766456acfd17efca1aef252b4296b2a3545. All 37 zipped files compared byte-for-byte with dist/. Media hashes are in release/rc-85a9e24/SHA256SUMS.txt.

## Environment

Windows, Node 24.18.0, npm 11.6.4, IWSDK Core 1.1.0, Vite 7.3.8. Tested in headless Microsoft Edge using Playwright Test 1.65.1 and IWER 2.8.0 (Quest 3 profile). Target is Quest Browser over HTTPS. Entrant has no physical Quest.

## What works

One-star tutorial, three authored constellations, five-second observation, hand rebuilding, identity-matched target outlines and error lines, three round scores, final average and replay. SDK one-hand grabs operate the three shapes and fixed controls. The board stays at its initial pose. Authored interaction centers are 0.406–0.485 m from the initial viewer position; physical reach awaits headset testing.

During the reliability pass, disconnecting a hand over the tutorial target reproduced a stale release instruction. The RC cancels the drag, restores the star and explains recovery. Session visibility changes also cancel held input when rendering may be suspended. Returning hands re-arm after the SDK reports an open hand.

## Verification

| Evidence | Result |
| --- | --- |
| Automated tests | PASS at 19:38 WAT. node --test game.test.js passed 6/6. Exact, intermediate, tolerance and beyond-tolerance scores, swapped identities, average, invalid/duplicate transitions, active time and replay reset. |
| Static checks / build | PASS at 19:39 WAT. node --check on main.js, game.js, game.test.js, smoke.mjs and vite.config.js. npm.cmd run build succeeded. Existing bundle-size and third-party annotation warnings. |
| Editor/browser | PASS in a fresh Edge context against the built site on local HTTPS. Desktop fallback appeared and Enter VR was disabled without immersive support. No editor test applicable. |
| Simulator | PASS again at 19:40 WAT. node smoke.mjs exercised tutorial, right-hand disconnection over the goal with the other hand tracked, hidden session during a drag, countdown pause/resume after >5 seconds hidden or both hands disconnected, three rounds, a second-hand Check while a star was held, held-button suppression, out-of-bounds return, left-hand recovery, results, replay, session exit and re-entry. Scores 100/0/7 averaged to 36%. No uncaught page errors. Browser entry was automation-clicked; in-session actions used emulated hands. |
| RC integrity | PASS at 19:41 WAT. All 37 files in release/rc-85a9e24/afterimage-site.zip match the fresh dist/ build byte-for-byte. ZIP and main-bundle SHA-256 values match those recorded above. |
| Capture review | PASS. Five labeled 960×720 screenshots visually checked against the RC. Tutorial text, three distinct targets, tray/Check, 76% reveal/Next and 76% results/Play again are visible. Capture used deliberate offsets. FFmpeg reported a 63.80-second 960×720 VP9 WebM. |
| Quest hardware / performance | UNVERIFIED. No headset, physical hand input, headset frame-rate sample or on-device permission-flow evidence. |
| Public deployment / judge access | NOT RUN. Local HTTPS used a temporary test certificate. Independent public access remains pending. |

## Release candidate audit

Audited November 18, 2026 at approximately 19:42 WAT against the [official requirements](https://start-developer-competition-26.devpost.com/) and [official rules](https://start-developer-competition-26.devpost.com/rules). The official deadline is November 18 at 12:00 PM PST / 21:00 WAT. Blocking results are public delivery, required public materials and completed submission.

| Item | Result | Evidence |
| --- | --- | --- |
| Final revision correspondence | PASS | Gameplay source is unchanged from 85a9e24; the fresh build matches all 37 files in the preserved ZIP and its recorded SHA-256. |
| Intended delivery launch | FAIL | The production artifact launches over local HTTPS in IWER, but no public HTTPS IWSDK URL exists or has been launched independently. |
| Core loop and replay | PASS | Fresh node tests and the production IWER smoke test completed tutorial, three rounds, results and replay. |
| Essential hand interactions | UNVERIFIED | Emulated hands completed the in-session flow; physical Quest hands-only entry, reach, interruption handling and performance have no hardware evidence. The gap is disclosed. |
| Judge access | FAIL | Official IWSDK delivery requires an accessible hosted link. No judge URL or signed-out access check exists. |
| Required materials | FAIL | Local RC, 63.80-second recorded emulator video, screenshots and draft copy exist. Public YouTube/Vimeo and play URLs, target launch date, completed form and submission confirmation are missing. |
| Claim accuracy | PASS | Submission copy labels emulator footage and explicitly discloses missing Quest, comfort, permission and performance evidence. No 60 fps claim is made. |
| Licenses/attribution | PASS | THIRD-PARTY-LICENSES.md and WebXR-input-assets-LICENSE.txt are present in the verified ZIP; THIRD_PARTY.md records the dependencies and CDN hand assets. |
| Credentials/private data | PASS | Pattern scans found no credentials in the repository content or built artifact and no entrant name/email in dist/. Git author metadata is not shipped in the artifact-only deployment plan. |
| Deadline/submission evidence | FAIL | The official deadline is confirmed, but there is no Devpost submitted-state, project URL, confirmation or timestamp evidence. |

## How to run

From the project root use npm.cmd ci --ignore-scripts for a fresh install, then npm.cmd run dev. For the release version use npm.cmd run preview after building and open its printed loopback URL. The emulator test requires Edge and Git for Windows OpenSSL (or OPENSSL_BIN).

## How to build/deploy

Run node --test game.test.js, npm.cmd run build and node smoke.mjs. Output is dist/. Deploy the verified ZIP contents at the HTTPS site root. Check the ZIP using Get-FileHash release/rc-85a9e24/afterimage-site.zip -Algorithm SHA256. SUBMISSION.md has ordered GitHub Pages, video, signed-out access and Devpost instructions. No running preview server, capture process or unfinished edit.

## Known issues and reproduction steps

1. **Quest hands-only entry and comfort — UNVERIFIED.** Cold-open the trusted HTTPS URL in Quest Browser with controllers set aside. Pinch Enter VR and grant permissions while seated. Expect a readable tutorial and a stable board, tray and buttons reachable with either hand.
2. **Physical tracking interruption and headset removal — UNVERIFIED.** Hold the tutorial diamond over its outline and move the holding hand out of view before releasing. Expect the star back in the tray and tutorial still active. Complete the tutorial, remove the headset during Observe for six seconds, then put it back. For a continuing XR session expect the countdown to resume. If the OS ended the session, enter VR again and expect a clean tutorial.
3. **Hardware replay and frame rate — UNVERIFIED.** Rebuild a round, hold Check through the reveal, release, then pinch Next. Finish three rounds and replay. Expect one score per check, suspended stars and a fresh tutorial. Measure on-device frame rate through observation, dragging and reveal; record model, browser version, RC hash, measurement tool, interval and observed range.
4. **Hand visuals depend on CDN availability.** The SDK fetched generic-hand/left.glb and right.glb with HTTP 200 in the observed online run. To exercise offline degradation, block cdn.jsdelivr.net before a cold XR launch, clear browser cache and inspect both hand visuals and feedback. Offline results remain unverified.
5. **Public access — NOT RUN.** Once authorized and published, open both play and video URLs signed out on a separate device. Expect an accessible game, matching entry bundle and playable public video. Record actual URLs and time.

## Next three actions

1. Entrant supplies the public launch date and verifies membership, developer access and eligibility details before using the copy.
2. With explicit authorization, publish the preserved site and simulator video, verify both URLs signed out and replace the URL placeholders.
3. Eligible entrant reviews and submits the Devpost entry before 21:00 WAT. Retain organizer confirmation and keep the frozen build accessible through the winner announcement.

## Decisions and assumptions

Gaming is the proposed track. Entrant explicitly confirmed fresh project provenance and in-window conception. The answer about the upcoming submission did not provide a public launch date. Account entitlements were not independently inspected. The hosted IWSDK route is specifically provided in the official rules; GitHub Pages is the documented release path here. Simulator capture is labeled throughout gameplay; official acceptance and hardware performance are unverified.

Phase interaction policy is explicit in main.js: draggable gameplay meshes are visible only during Tutorial/Rebuild, so they are disabled during Observe and Reveal; the fixed control remains visible during Reveal as Next and during Results as Play again. Do not globally disable all interactions by phase, because that would block phase-appropriate controls.

## Submission status

- Build/link: verified local ZIP; public play URL pending.
- Video: release/rc-85a9e24/media/afterimage-iwer-demo.webm; public YouTube/Vimeo link pending.
- Screenshots: five local, reviewed emulator captures. A separate 1254×1254 generated submission thumbnail is saved at submission-assets/afterimage-thumbnail.png; it is not part of the frozen game ZIP. Description, inspiration, judge instructions, plans, recording outline and checklist: SUBMISSION.md. Target public launch date: entrant placeholder.
- Judge access: UNVERIFIED. Submitted: no confirmation. Evidence of submission: none. No upload, public publishing, account change or submission performed.

## Changed files

main.js contains input recovery; smoke.mjs covers interruptions, duplicate activation and fixed expected scores. SUBMISSION.md, THIRD_PARTY.md and STATUS.md contain the handoff. public/WebXR-input-assets-LICENSE.txt ships with the generated package notices. release/rc-85a9e24/ preserves the deployable ZIP, media and SHA-256 manifest. submission-assets/afterimage-thumbnail.png is a separate competition thumbnail and does not modify the RC.
