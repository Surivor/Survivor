# Contributing Guidelines

This document outlines the teamwork rules for this repository to ensure clean code, a readable history, and optimal organization.

## 1. Branch Naming

All new features or bug fixes must be developed on an isolated branch off `main`. Use the following format: `type/feature-name` (lowercase, separated by dashes).

* **New feature**: `feat/add-authentication`
* **Bug fix**: `fix/crash-main-loop`
* **Documentation**: `docs/update-readme`

## 2. Commit Conventions

To maintain a clean and traceable history, every commit message must follow this structure:
`type(scope): brief description of the change`

**Allowed types:**
* `feat`: A new feature.
* `fix`: A bug fix.
* `docs`: Documentation-only changes.
* `style`: Changes that do not affect the logic of the code (formatting, missing semi-colons, etc.).
* `refactor`: A code change that neither fixes a bug nor adds a feature.
* `test`: Adding missing tests or correcting existing tests.
* `chore`: Changes to the build process, configuration files, or GitHub Actions.

**Examples:**
> feat(network): implement client-server connection
> fix(parsing): resolve segfault on invalid arguments
> chore(ci): configure automated mirroring workflow

## 3. Workflow and Pull Requests (PR)

1. **Never push directly to the `main` branch.**
2. Push your branch to the remote repository: `git push origin branch-name`.
3. Open a Pull Request (PR) against `main` on GitHub.
4. Fill out the PR description briefly explaining the changes (why and how).
5. Request a review from at least one other team member.
6. Once approved, the PR can be merged and the development branch deleted.