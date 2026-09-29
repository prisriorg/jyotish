# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

If you discover a security vulnerability in `@prisri/jyotish`, please report it responsibly.

**Do NOT open a public issue for security vulnerabilities.**

Instead, please email the maintainer directly or use [GitHub's private vulnerability reporting](https://github.com/prisriorg/jyotish/security/advisories/new).

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix & Release**: As soon as possible, typically within 2 weeks

## Scope

This library performs astronomical and astrological calculations. While it does not handle authentication, user data, or network requests directly, we take the following seriously:

- **Dependency vulnerabilities**: We monitor `astronomy-engine` and all transitive dependencies
- **Supply chain security**: Published builds match the source code in this repository
- **Code injection**: Input validation for calculation parameters

Thank you for helping keep `@prisri/jyotish` safe! 🔒
