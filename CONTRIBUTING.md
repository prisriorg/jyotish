# Contributing to @prisri/jyotish

Thank you for your interest in contributing to **@prisri/jyotish**! We welcome contributions from the community.

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/jyotish.git
   cd jyotish
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Build** the project:
   ```bash
   npm run build
   ```

## 🔧 Development Workflow

### Project Structure

```
jyotish/
├── src/
│   ├── core/           # Core astronomical calculations
│   ├── kundli/          # Birth chart & divisional charts
│   ├── ashtakavarga/    # Ashtakavarga system
│   ├── matching/        # Kundli matching (Ashtakoota Milan)
│   ├── predictions/     # Life predictions & guidance
│   ├── transit/         # Transit calculations
│   ├── i18n/            # Internationalization
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Main entry point
├── dist/                # Compiled output (auto-generated)
├── package.json
└── tsconfig.json
```

### Building

```bash
npm run build
```

### Running Tests

```bash
# Run the test file
npx ts-node test.ts
```

## 📝 How to Contribute

### Reporting Bugs

- Open an [issue](https://github.com/prisriorg/jyotish/issues) with a clear description
- Include steps to reproduce the bug
- Include expected vs actual behavior
- Add relevant birth chart data or calculation inputs if applicable

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the Jyotish concept or calculation you'd like added
- Include references to classical texts (BPHS, Jataka Parijata, etc.) if applicable

### Submitting Pull Requests

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes following the code style of the project
3. Ensure the project builds successfully: `npm run build`
4. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add XYZ calculation for ABC chart"
   ```
5. Push to your fork and open a Pull Request

### Commit Message Guidelines

We follow a simple convention:

- `feat:` — New feature or calculation
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring without behavior change
- `test:` — Adding or updating tests

## 🧮 Jyotish-Specific Guidelines

- All planetary calculations should use **sidereal** coordinates (not tropical)
- Support multiple Ayanamsas where applicable (Lahiri, KP, Raman)
- Reference classical texts when implementing new features
- Ensure degree calculations handle the 360°/0° boundary correctly
- Use precise ephemeris via `astronomy-engine` — avoid approximations

## 📜 Code Style

- Write in **TypeScript** with proper type annotations
- Export types from `src/types/`
- Keep functions pure where possible
- Add JSDoc comments for public-facing APIs
- Follow existing naming conventions (camelCase for functions, PascalCase for types)

## 📄 License

By contributing, you agree that your contributions will be licensed under the [ISC License](./LICENSE).

---

Thank you for helping make Vedic astrology accessible to developers worldwide! 🙏
