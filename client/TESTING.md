# Testing Guide

This project uses **Vitest** and **React Testing Library** for testing.

## Test Setup

- **Test Framework**: Vitest
- **Testing Library**: React Testing Library
- **Environment**: jsdom (for DOM simulation)
- **Setup File**: `src/test/setup.ts`

## Running Tests

### Run all tests once
```bash
npm test -- --run
```

### Run tests in watch mode
```bash
npm test
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Files

### Current Test Coverage

1. **Utils Tests** (`src/lib/utils.test.ts`)
   - Tests for the `cn` utility function
   - Class name merging and Tailwind class handling

2. **Button Component** (`src/components/ui/button.test.tsx`)
   - Rendering tests
   - Click event handling
   - Disabled state
   - Variant and size props
   - Custom className support

3. **Card Component** (`src/components/ui/card.test.tsx`)
   - Card rendering
   - CardHeader and CardTitle
   - CardContent and CardFooter
   - Custom className support

4. **Input Component** (`src/components/ui/input.test.tsx`)
   - Input rendering
   - Value change handling
   - Disabled state
   - Different input types
   - Custom className support

5. **Spinner Component** (`src/components/Spinner.test.tsx`)
   - Spinner rendering
   - Size variants
   - Logo image rendering
   - Custom className support

## Test Results

✅ **All 24 tests passing**
- 5 test files
- 24 test cases
- 0 failures

## Writing New Tests

### Example Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries** (getByRole, getByLabelText, etc.)
3. **Test accessibility** where applicable
4. **Keep tests simple and focused**
5. **Use descriptive test names**

## Adding More Tests

To add tests for new components:

1. Create a `*.test.tsx` or `*.test.ts` file next to your component
2. Import necessary testing utilities
3. Write test cases following the existing patterns
4. Run `npm test` to verify

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipelines
- Before deploying to production

