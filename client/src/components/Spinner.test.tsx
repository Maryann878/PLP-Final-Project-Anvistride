import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  it('should render spinner', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.animate-float')).toBeInTheDocument();
  });

  it('should apply size classes correctly', () => {
    const { container: smContainer } = render(<Spinner size="sm" />);
    expect(smContainer.querySelector('.h-8')).toBeInTheDocument();

    const { container: mdContainer } = render(<Spinner size="md" />);
    expect(mdContainer.querySelector('.h-12')).toBeInTheDocument();

    const { container: lgContainer } = render(<Spinner size="lg" />);
    expect(lgContainer.querySelector('.h-16')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Spinner className="custom-spinner" />);
    const spinner = container.querySelector('.custom-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should render logo image', () => {
    const { container } = render(<Spinner />);
    const img = container.querySelector('img[alt="Anvistride"]');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/Anvistride_logo.png');
  });
});

