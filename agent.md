# LeadLens Agent Guide (`agent.md`)

Welcome to the AI agent reference document for **LeadLens** — a community-focused mobile & web solution helping families identify potentially hazardous lead water pipes using computer vision, guided inspection, and localized water safety resources.

---

## 🎯 Project Overview & Mission

- **Tagline**: *Know Your Pipes. Protect Your Family.*
- **Core Mission**: Democratize water safety information by enabling homeowners and renters—especially low-income families—to verify their service pipe material using a smartphone camera and guided step-by-step checks.
- **Origin**: Built at the CodeClash Hackathon — Towson University.

---

## 🛠️ Key Capabilities & Workflow

1. **Guided Material Testing Flow**:
   - **Visual Inspection**: Guiding users to capture clear photos of where water pipes enter the building (ahead of the water meter).
   - **Scratch & Magnet Tests**: Prompting users through standard EPA/water utility test steps (e.g. testing with a magnet, gently scratching the pipe surface to inspect color and hardness).
2. **AI & Vision Analysis**:
   - Model-assisted pipe identification (lead vs. copper vs. galvanized steel vs. PVC).
3. **Actionable Recommendations**:
   - Safety steps (filters certified to NSF 53/58, flushing lines).
   - Utility outreach guidance & local replacement program assistance.

---

## 🤖 Instructions for AI Agents & Contributors

When working on this repository, prioritize:
- **Accessibility & Clarity**: Non-technical explanations suitable for diverse user backgrounds.
- **Accuracy & Safety Disclaimers**: Clarify that physical tests and computer vision checks provide risk assessments, not official laboratory water quality certifications.
- **Clean Architecture**: Keep UI flows modular and provide deterministic fallback steps for users without compatible cameras or hardware.

## Git commits

- Use `type(scope): summary` for the first line. Use lowercase types and scopes. Choose `feat` for new behavior, `fix` for a correction, `refactor` for restructuring, `test` for tests, `docs` for documentation, `build` for build tooling, and `chore` for other maintenance. Use a project or area as the scope, such as `statwork`, `recovery-drill`, or `repo`.
- Use a short, imperative summary that names the concrete change. Keep each commit focused on one purpose and review the staged diff before committing.
- Run the applicable tests successfully before committing. Include a `Tests:` section in the commit body with the exact commands used and their results. Include setup commands when needed to reproduce the run. For a negative test, report the expected failure and confirm that it occurred. If a required check is blocked or fails unexpectedly, report it and hold the commit.
- For documentation-only changes, verify the edited instructions and run `git diff --cached --check` after staging. Record that check in the commit body.

```text
docs(repo): define agent commit guidelines

Require a clear purpose and reproducible verification for each commit.

Tests:
- git diff --cached --check (passed)
```
