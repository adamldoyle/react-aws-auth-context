import { render } from '@testing-library/react';
import { SignOut } from './';

jest.useFakeTimers();

describe('SignOut', () => {
  let oldWindowLocation;

  beforeEach(() => {
    oldWindowLocation = window.location;
    delete window.location;
    window.location = {
      reload: jest.fn(),
    } as any;
  });

  afterEach(() => {
    window.location = oldWindowLocation;
  });

  const renderComponent = (onSignOut = jest.fn()) => {
    return render(<SignOut onSignOut={onSignOut} />);
  };

  it('renders signing out message', () => {
    const rendered = renderComponent();
    expect(rendered.getByText('Signing out...')).toBeDefined();
  });

  it('calls onSignOut on a delay', async () => {
    const onSignOut = jest.fn();
    renderComponent(onSignOut);
    jest.advanceTimersByTime(500);
    expect(onSignOut).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(onSignOut).toBeCalled();
  });
});
