# Afterimage

> Study a constellation. Watch it disappear. Rebuild it with your hands.

Afterimage is a small, seated, hands-first VR spatial-memory game for Meta Quest.

The player studies three shapes suspended at different depths, rebuilds the pattern
from memory, and receives an identity-matched accuracy score. The complete loop has
been tested with emulated hands in Meta IWER. Physical Quest operation, comfort and
performance remain unverified.

- Source: https://github.com/ayomidedaniel1/AfterImage
- Live application: pending public deployment
- Stack: JavaScript, Meta Immersive Web SDK 1.1.0, WebXR and Vite

## 1. Project status

The current release candidate includes a one-star tutorial, three authored rounds,
five-second observation, hand reconstruction, target outlines, error lines, scoring
and replay. Logic tests, a production build and a full IWER simulator smoke test pass.
See [STATUS.md](STATUS.md) for exact evidence, hashes and unresolved testing gaps.

### Run locally

Requirements: Node.js 20.19 or newer and npm.

```powershell
npm ci --ignore-scripts
npm run dev
```

Open the local URL printed by Vite. A desktop browser shows the scene and compatibility
message but cannot prove immersive hand tracking.

To reproduce the tested production build:

```powershell
node --test game.test.js
npm run build
npm run preview
```

The deployable static site is generated in `dist/`. The IWER smoke test can be run
with `node smoke.mjs`; it requires Microsoft Edge and Git for Windows OpenSSL, or an
`OPENSSL_BIN` environment variable pointing to OpenSSL.

### Deploy to Vercel

This repository is a standard Vite static site and requires no runtime secrets:

1. Import `ayomidedaniel1/AfterImage` into Vercel.
2. Keep the detected framework as **Vite**.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Deploy and confirm the resulting HTTPS URL is public without Vercel Authentication
   or Deployment Protection.
5. Open the URL signed out, verify both license files resolve, and test it in Quest
   Browser with hand tracking if hardware is available.

For the competition submission, keep the verified URL freely available through the
winner announcement. Freeze the submitted deployment and disable automatic production
changes after the deadline.

## 2. Competition context

Based on rules supplied by the entrant:

- Competition: Meta VR Start Developer Competition 2026.
- Proposed track: Gaming.
- Proposed division: New Experience, ONLY if eligible.
- Applications must run on Meta VR devices.
- Hands-first operation is required end-to-end.
- Seated/stationary interaction is encouraged.
- Minimum stated performance criterion: 60 fps on Meta Quest.
- Demo video must be less than three minutes and publicly visible on YouTube or Vimeo.
- Actual Quest or permitted simulator/emulator footage must represent the application honestly.
- Submission materials must be in English.
- Native applications require an APK uploaded to a release channel named "Competition".
- The rules provide a hosted-link submission route for IWSDK/WebXR applications.
- Projects must remain freely accessible to judges until the winner announcement.
- No submission changes are permitted after the deadline.

The supplied deadline is November 18, 2026 at 12:00 PM Pacific.
The supplied expected winner announcement is around December 11, 2026.

VERIFY the current official deadline and submission instructions.
Do not assume the original "three hours remaining" statement is still current.

Joining the Devpost competition does not itself establish Start membership or eligibility.

### Division caution

The New Experience division prohibits repurposing a pre-existing project codebase.
Public SDK/tool usage is permitted under the supplied rules, subject to licensing.

If this repository contains an older application:

- Flag the issue.
- Ask the entrant about its origin.
- Do not silently label it New Experience.
- Do not assume a lightly modified sample application qualifies as original work.

The official rules control over this summary.

## 3. Product promise

A player can:

1. Learn the interaction by moving one star.
2. Observe a small three-dimensional constellation.
3. Rebuild it from memory.
4. See an understandable accuracy reveal.
5. Finish three rounds and replay.

Target session length: approximately two minutes.

### Why VR?

The player remembers and reconstructs positions in a volume, not on a flat grid.
Small head movements expose depth through parallax.
Direct hand placement is the core interaction.

Do not flatten the game into a conventional 2D memory board.

## 4. Minimum viable experience

### A. Tutorial

- Show one draggable star and one outlined destination.
- Display: "Pinch the star. Move it into the outline."
- Accept placement within a forgiving radius.
- Provide clear visual feedback.
- Continue into round one without a complicated menu.

### B. Observe

- Display three stars in a compact three-dimensional frame.
- Make stars distinguishable using shape or symbol, not color alone.
- Show a short countdown, initially around five seconds.
- Disable moving the target stars.
- Explain: "Remember where each star belongs."

### C. Rebuild

- Hide the target constellation.
- Put matching draggable stars in a nearby tray.
- Display: "Rebuild the constellation."
- Let the player move and release each star.
- Released stars stay suspended; do not use gravity.
- Enable a hand-operable "Check" button.

### D. Reveal

- Lock dragging.
- Show outlined targets at the correct positions.
- Draw a line from
- Draw a line from each placed star to its correct target.
- Show the round score.
- Provide a hand-operable "Next" button.

### E. Results

- After three rounds, show the average score.
- Provide a hand-operable "Play again" button.
- If time permits, save a local best score.
- No accounts, server, or network service required.

## 5. Technical design

### State machine

Tutorial -> Observe -> Rebuild -> Reveal -> Results

Reveal transitions to Observe when another round remains.
Results transitions to a clean new session.

Keep state transitions explicit. Avoid scattered booleans that can leave
interaction enabled in the wrong phase.

### Constellation data

Represent each constellation as three positions relative to one puzzle root.

Each star has a stable identity:

- Star A
- Star B
- Star C

Use distinct geometry or symbols to communicate identity.
The score compares each star to its matching target, not whichever target is closest.

Use three authored constellations for the MVP.
Ensure targets do not overlap and are comfortably reachable.

### Scoring

All scoring positions must use the same coordinate space and units.

For each star:

    errorMeters = distance(placedPosition, targetPosition)
    accuracy = clamp(1 - errorMeters / toleranceMeters, 0, 1)

Then:

    roundScore = round(100 * average(starAccuracies))
    sessionScore = round(average(roundScores))

Initial tolerance: 0.15 meters.
This is a playtesting starting point, not a validated difficulty setting.

Make target layouts, observation duration, and tolerance easy to tune.

### Spatial layout

- Keep the puzzle stable relative to the seated play space.
- Do not continuously attach the puzzle to the player's head.
- Keep all essential content in a comfortable forward-facing region.
- Keep direct interactions within comfortable seated reach.
- Use modest depth variation that is visible without leaning or standing.
- Avoid locomotion and camera animation.
- Provide a hand-operable reposition/reset control if placement proves problematic.
- Do not claim persistent anchoring unless it is actually implemented.

### Hand interaction

Prefer established interaction components from the installed SDK.

Requirements:

- Visible hands or clear interaction feedback.
- Grab, move, and release stars.
- Hand-operable buttons.
- No controller requirement anywhere in the application flow.
- Support either hand where practical.
- No custom gesture recognition unless absolutely necessary.

If tracking disappears:

- Avoid accidental scoring or button activation.
- Cancel or safely suspend active dragging.
- Pause observation timing where supported.
- Recover without requiring an application restart.

### Released objects

Stars are kinematic/no-gravity objects.
If released outside the valid play volume, return them to their tray location.
Use a brief visual cue so this behavior does not look like a bug.

### Visual direction

- Dark, uncluttered VR environment.
- Small floating puzzle frame with subtle depth cues.
- Bright, distinguishable stars.
- One consistent accent palette.
- Large, readable instructions.
- Short reveal animation if time permits.
- No dependence on bloom or expensive shaders.

### Sound

Optional:

- Soft grab/release cue.
- Confirmation cue.
- Round-completion cue.

Use original/generated simple tones or clearly authorized assets.
Never make sound the only source of important information.

## 6. Explicit non-goals

Do NOT add:

- Multiplayer.
- AI agents or external language-model APIs.
- Accounts or authentication.
- Backend services.
- Voice recognition.
- Custom hand-tracking infrastructure.
- Procedural constellation generation.
- Persistent spatial anchors.
- Complex progression or achievements.
- Asset-store environments.
- Elaborate trailers.
- Passthrough just for visual decoration.

The MVP is fully virtual.

If passthrough is later considered, it must meaningfully use the real room.
Do not claim scene understanding or MRUK support without implementing and testing it.

## 7. Stack selection

Inspect the environment first.

Prefer:

1. An already functional, eligible native Quest toolchain the entrant knows.
2. An already functional IWSDK/WebXR setup with working hand interaction.
3. A new setup only if neither exists.

Avoid switching engines after proving a working delivery path.

For native development:

- Verify installed engine and SDK versions.
- Verify Android build support.
- Verify device deployment and hand interaction before building the game.
- Use the installed SDK's documented APIs; do not assume component names.
- Start release-channel setup early because upload processing may take time.

For IWSDK/WebXR:

- Verify package versions and supported APIs.
- Use HTTPS hosting.
- Test immersive mode and hand input in Quest Browser.
- Desktop mouse interaction is a development aid, not proof of hands-first operation.
- Verify entry into and exit from the experience with hands.
- Confirm the hosted URL works independently of the development computer.

Do not spend the deadline installing multiple alternative stacks.

## 8. Delivery milestones

These are approximate time budgets from the start of development.
Recalculate them using the actual remaining time.

### Milestone 1: Delivery path — first 20 minutes

- Inspect repository and toolchain.
- Select the stack.
- Run a minimal scene on the target device or permitted simulator.
- Verify one hand interaction.
- Establish the build/deployment path.

### Milestone 2: Complete loop — next 55 minutes

- Tutorial.
- Observe.
- Rebuild.
- Check and reveal.
- Three rounds.
- Results and replay.

### Milestone 3: Reliability — next 30 minutes

- Comfortable layout.
- Tracking-loss recovery.
- Out-of-bounds handling.
- Readable UI.
- Hands-only navigation.

### Milestone 4: Polish and testing — next 20 minutes

- Visual consistency.
- Minimal feedback.
- Cold-start and replay testing.
- Measure hardware performance if hardware is available.

### Milestone 5: Submission — reserve at least 45 minutes

- Build and upload/deploy.
- Capture real gameplay.
- Upload public video.
- Write submission description and testing instructions.
- Submit before the deadline.
- Verify access and preserve the final build.

Cut features before cutting submission time.

## 9. Acceptance checklist

### Core experience

- [ ] Application launches successfully.
- [ ] Tutorial teaches the actual interaction.
- [ ] Three constellations have meaningful depth variation.
- [ ] Targets disappear during reconstruction.
- [ ] Each star can be grabbed and released.
- [ ] Check produces deterministic, understandable scoring.
- [ ] Reveal shows matching targets and placement errors.
- [ ] Three rounds lead to results.
- [ ] Replay resets all session state.

### Hands and comfort

- [ ] The full application flow works without controllers.
- [ ] Either hand can perform essential interactions where supported.
- [ ] Essential controls are comfortably reachable while seated.
- [ ] No required standing, locomotion, or large head movement.
- [ ] Tracking loss does not corrupt the session.
- [ ] Headset removal/resume does not break the application.
- [ ] Color is not the only identity cue.

### Technical

- [ ] No blocking runtime errors.
- [ ] Submitted build/link tested, not only editor preview.
- [ ] Hardware performance measured when possible.
- [ ] Meets the stated 60 fps minimum on tested Quest hardware.
- [ ] No unnecessary network dependencies.
- [ ] Third-party licenses recorded.

If hardware testing is unavailable, explicitly mark hardware performance
and hands-only hardware testing as UNVERIFIED. Do not check these boxes.

## 10. Submission checklist

- [ ] Entrant confirms eligibility and Start membership.
- [ ] Live deadline verified.
- [ ] Correct track selected: Gaming.
- [ ] Correct division selected based on actual project history.
- [ ] Native APK in "Competition" release channel, OR eligible hosted web link.
- [ ] Judge access verified according to organizer instructions.
- [ ] Public YouTube/Vimeo video under three minutes.
- [ ] Video shows actual application footage.
- [ ] Simulator footage identified if used.
- [ ] English description and testing instructions.
- [ ] Inspiration, implementation, future plans, and target launch date included.
- [ ] Screenshots match the submitted build.
- [ ] Devpost entry actually submitted, not only saved.
- [ ] Final source revision and build preserved.
- [ ] Automatic post-deadline deployments disabled.
- [ ] Project remains available through the required judging period.

Do not invent a launch date; ask the entrant to supply one.

## 11. Suggested demonstration

Target length: 60–90 seconds.

1. Open with reconstruction gameplay.
2. Show the one-star tutorial.
3. Show observation and disappearance.
4. Rebuild using hands.
5. Show the accuracy reveal.
6. Show results and replay.
Suggested narration:

"Afterimage turns spatial memory into something you can hold.
Study a constellation, watch it disappear, and rebuild it in three dimensions.
The reveal shows how closely your memory matches the original.
Designed for short, seated sessions using only your hands."

Only describe features that work in the submitted build.

## 12. Handoff files

Maintain these files throughout development:

- README.md — product specification and acceptance criteria.
- AGENTS.md — instructions for coding agents.
- STATUS.md — actual implementation state, blockers, and next steps.
- SUBMISSION.md — draft submission description and testing instructions.
- THIRD_PARTY.md — dependencies, assets, licenses, and attribution requirements.

STATUS.md must distinguish:

- Implemented.
- Tested in editor/browser.
- Tested in simulator.
- Tested on Quest hardware.
- Unverified.
- Known broken.

## 13. Definition of done

A small, complete application that:

- Runs on the intended Meta Quest delivery route.
- Can be played end-to-end with hands.
- Delivers three spatial-memory rounds and an understandable result.
- Has no known blocking bugs.
- Has truthful submission materials.
- Is submitted and accessible before the deadline.

A smaller finished game is preferable to a larger unfinished prototype.
