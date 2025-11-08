# Contributing to Warranty Wallet

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation:
> - ⭐ Star the project on GitHub  
> - 🐦 Tweet about it  
> - 📘 Mention Warranty Wallet in your own project's README  
> - 💬 Tell your friends, colleagues, and local meetups about it  

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
- [Commit Messages](#commit-messages)
- [Join The Project Team](#join-the-project-team)
- [Attribution](#attribution)

---

## Code of Conduct

This project and everyone participating in it is governed by the [Warranty Wallet Code of Conduct](./CODE_OF_CONDUCT.md).  
By participating, you are expected to uphold this code. Please report unacceptable behavior to **sap.awengers.team@gmail.com**.

---

## I Have a Question

> Before asking, please read the [README](./README.md) and existing project documentation.

Before opening a new issue, search existing [Issues](../../issues) — your question might already have been answered.  

If you still need clarification:
- Open a new [Issue](../../issues/new) with a **clear title** and **detailed description**.  
- Include context about what you are trying to do and what environment you are using (Node.js version, OS, npm version, etc.).  
- Be patient — maintainers and contributors will respond as soon as possible.  

---

## I Want To Contribute

> ### Legal Notice
> When contributing to Warranty Wallet, you agree that you have authored 100% of the content, have the necessary rights to the content, and that your contributions will be provided under the project’s [MIT License](./LICENSE).

---

### Reporting Bugs

#### Before Submitting a Bug Report

A great bug report helps us help you faster. Please:
- Make sure you’re using the **latest version** of the project.  
- Check whether your issue has already been reported in [existing issues](../../issues?q=label%3Abug).  
- Verify that your bug isn’t due to a misconfiguration (check `.env` files and setup steps).  
- Collect relevant information:  
  - Steps to reproduce  
  - Expected vs. actual results  
  - Stack traces or console logs  
  - OS and browser details  
  - Node.js and npm versions  

#### How Do I Submit a Good Bug Report?

> ⚠️ **Security Note:** Do not report security vulnerabilities publicly. Instead, email **sap.awengers.team@gmail.com** directly.

When ready:
1. Open a new [Issue](../../issues/new).  
2. Provide all collected context.  
3. Include clear reproduction steps so others can confirm the bug.  
4. The team will reproduce and label the issue (`needs-repro`, `bug`, `needs-fix`, etc.).  
5. Once confirmed, fixes may be implemented by any contributor.  

---

### Suggesting Enhancements

This section guides you through submitting suggestions for **new features or improvements** to Warranty Wallet.  

#### Before Submitting an Enhancement

- Ensure you’re using the latest version.  
- Read the [README](./README.md) — maybe the feature already exists.  
- Search existing [issues](../../issues) for similar suggestions.  
- Consider whether your feature fits the project’s scope (open-source, warranty management, user-friendly cloud app).  

#### How Do I Submit a Good Enhancement Suggestion?

- Open a [GitHub issue](../../issues/new) with the label `enhancement`.  
- Use a **clear and descriptive title**.  
- Describe:  
  - The **current behavior** and **desired new behavior**.  
  - Why the enhancement would be useful for most users.  
  - Any relevant screenshots, mockups, or diagrams.  
- If applicable, suggest potential approaches or references (e.g., AWS SNS, React hooks, or MongoDB schema improvements).  

---

### Your First Code Contribution

1. **Fork** the repository  
   ```bash
   git clone https://github.com/YOUR_USERNAME/Warranty-Wallet.git
   cd Warranty-Wallet
   ```

2. Create a feature branch
  ```bash
  git checkout -b feature/my-new-feature
  ```

3. Make your changes (frontend in client/, backend in server/).

4. **Write/Update Tests** (Required for frontend contributions)
   ```bash
   cd frontend
   
   # Run existing tests to ensure nothing is broken
   npm test -- --watchAll=false
   
   # Add tests for new components/features
   # Tests should be placed in the same directory as the component
   # Example: src/Components/NewComponent/NewComponent.test.jsx
   
   # Ensure test coverage remains high
   npm test -- --coverage --watchAll=false
   ```

   **Testing Requirements:**
   - All new components must have corresponding test files
   - Tests should cover main functionality, user interactions, and edge cases
   - Existing tests must continue to pass
   - Follow existing testing patterns (see `TESTING.md` for details)

5. Commit your updates
  ```bash
  git commit -m "Add: description of your feature or fix"
  ```

5. Push your branch
  ```bash
  git push origin feature/my-new-feature
  ```

6. Open a Pull Request to the main branch.


We’ll review your PR, suggest changes if needed, and merge it once approved. 🚀

---

## Improving The Documentation

Improving documentation is one of the most valuable contributions you can make!
You can help by:

- Fixing typos or broken links.
- Adding setup examples, screenshots, or diagrams.
- Enhancing instructions in README.md or adding new guides under /docs.

Submit these improvements just like any other code contribution (via a PR).

## Styleguides

### Code Style

- Use Prettier and ESLint for formatting and linting.
- Follow standard React/Node.js conventions.
- Use clear, self-documenting variable names.

### Testing Guidelines

**Test File Naming:**
- Component tests: `ComponentName.test.jsx`
- Place tests in the same directory as the component

**Test Structure:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  test('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

**What to Test:**
- Component rendering with different props
- User interactions (clicks, form inputs)
- API calls and data loading states
- Error handling and edge cases
- Conditional rendering logic

**Testing Commands:**
```bash
# Run all tests
npm test -- --watchAll=false

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test ComponentName.test.jsx
```

For detailed testing guidelines, see [TESTING.md](./TESTING.md).

---

## Commit Messages

Use a consistent format for clarity:
```bash
Add: new AWS SNS integration
Fix: MongoDB connection bug in backend
Update: README setup instructions
Refactor: React component structure
```

## Join The Project Team

We’re always open to passionate developers who want to help build and maintain Warranty Wallet.
If you’ve made consistent contributions, reach out via email at sap.awengers.team@gmail.com
to discuss joining the core contributor team. 🤝

## Attribution

This guide is based on the contributing.md
template and customized for the Warranty Wallet project.
Thank you for helping us make warranty management effortless and open-source for everyone! 🌟


---

## ✅ How to Use:
1. Copy the entire block above.  
2. Paste it into a new file in your repo: `/CONTRIBUTING.md`.  
3. Commit and push — GitHub will automatically link it on the repository page.  

