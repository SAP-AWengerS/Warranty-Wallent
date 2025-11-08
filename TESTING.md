# Testing Guide

This document provides comprehensive information about testing in the Warranty Wallet application.

## Overview

The Warranty Wallet frontend uses a modern testing stack to ensure code quality and reliability:

- **Jest** - JavaScript testing framework
- **React Testing Library** - Simple and complete testing utilities for React components
- **Jest DOM** - Custom Jest matchers for asserting on DOM elements

## Test Structure

### File Organization

Tests are co-located with their components following React best practices:

```
src/
├── Pages/
│   └── Dashboard/
│       ├── Dashboard.js
│       └── Dashboard.test.jsx
├── Components/
│   └── Filters/
│       ├── Filters.js  
│       └── Filters.test.jsx
└── setupTests.js              # Global test configuration
```

### Naming Conventions

- Test files: `ComponentName.test.jsx`
- Test suites: `describe('ComponentName', () => {...})`
- Test cases: `test('should do something', () => {...})`

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode
npm test

# Run tests once (CI/CD mode)
npm test -- --watchAll=false

# Run with coverage report
npm test -- --coverage --watchAll=false

# Run specific test file
npm test Dashboard.test.jsx

# Run tests matching pattern
npm test -- --testNamePattern="renders"
```

### Advanced Options

```bash
# Run tests with verbose output
npm test -- --verbose

# Update snapshots (if using snapshot testing)
npm test -- --updateSnapshot

# Run tests in specific directory
npm test -- --testPathPattern="Pages"
```

## Test Coverage

### Current Coverage

The test suite currently covers:

**Dashboard Component** (`Dashboard.test.jsx`)
- ✅ Loading spinner display
- ✅ API data fetching and rendering
- ✅ Warranty card rendering
- ✅ Empty state handling
- ✅ Search/filter functionality
- ✅ API error handling

**Filters Component** (`Filters.test.jsx`)
- ✅ Input field rendering
- ✅ Icon display
- ✅ Search input functionality
- ✅ Category button rendering
- ✅ User interaction handling

### Coverage Reports

Generate detailed coverage reports:

```bash
npm test -- --coverage --watchAll=false
```

Coverage reports will be generated in the `coverage/` directory and include:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

## Writing Tests

### Basic Test Structure

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks();
  });

  test('should render component correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('should handle user interaction', async () => {
    render(<YourComponent />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Result')).toBeInTheDocument();
    });
  });
});
```

### Mocking Dependencies

#### API Calls
```javascript
jest.mock('../../Config/Axios/Axios', () => ({
  Axios: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));
```

#### React Contexts
```javascript
const mockUser = { userId: 101, name: 'Test User' };

render(
  <UserContext.Provider value={{ user: mockUser }}>
    <YourComponent />
  </UserContext.Provider>
);
```

#### External Libraries
```javascript
jest.mock('antd', () => ({
  message: {
    useMessage: () => [jest.fn(), <div key="toast" />],
  },
  Spin: () => <div data-testid="loading">Loading...</div>,
}));
```

### Testing Patterns

#### Testing Component Rendering
```javascript
test('renders component with props', () => {
  const props = { title: 'Test Title', items: [] };
  render(<Component {...props} />);
  
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

#### Testing User Interactions
```javascript
test('handles button click', () => {
  const mockHandler = jest.fn();
  render(<Button onClick={mockHandler} />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(mockHandler).toHaveBeenCalledTimes(1);
});
```

#### Testing Async Operations
```javascript
test('loads data from API', async () => {
  const mockData = [{ id: 1, name: 'Item 1' }];
  Axios.get.mockResolvedValueOnce({ data: mockData });
  
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
```

#### Testing Error States
```javascript
test('handles API error gracefully', async () => {
  Axios.get.mockRejectedValueOnce(new Error('Network Error'));
  
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Best Practices

### Do's ✅

1. **Test behavior, not implementation**
   ```javascript
   // ✅ Good - tests behavior
   expect(screen.getByText('Welcome')).toBeInTheDocument();
   
   // ❌ Avoid - tests implementation
   expect(component.state.showWelcome).toBe(true);
   ```

2. **Use accessible queries**
   ```javascript
   // ✅ Preferred order
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText(/email/i)
   screen.getByPlaceholderText(/enter email/i)
   screen.getByText(/welcome/i)
   
   // ❌ Less preferred
   screen.getByTestId('submit-button')
   ```

3. **Mock external dependencies**
   - Always mock API calls
   - Mock third-party libraries
   - Mock complex React contexts

4. **Clean up after tests**
   ```javascript
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

### Don'ts ❌

1. **Don't test implementation details**
2. **Don't test third-party library code**
3. **Don't write tests that duplicate functionality**
4. **Don't forget to handle async operations properly**

## Debugging Tests

### Common Issues

#### Test fails with "Unable to find element"
```javascript
// Solution: Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Dynamic Content')).toBeInTheDocument();
});
```

#### Mock not working
```javascript
// Ensure mocks are placed before imports
jest.mock('./module', () => ({...}));
import Component from './Component';
```

#### Tests timeout
```javascript
// Increase timeout for slow operations
test('slow operation', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Debug Tools

```javascript
// Print current DOM structure
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Use logRoles to see available roles
import { logRoles } from '@testing-library/dom';
logRoles(container);
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --coverage --watchAll=false
```

## Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles/)

## Contributing Tests

When contributing new features:

1. **Write tests for new components**
2. **Update existing tests when modifying components**
3. **Ensure all tests pass before submitting PR**
4. **Maintain test coverage above 80%**
5. **Follow existing testing patterns and conventions**

---

For questions about testing, please check the existing test files or reach out to the development team.