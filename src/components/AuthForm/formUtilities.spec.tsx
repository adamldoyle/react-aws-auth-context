import { fireEvent, RenderResult } from '@testing-library/react';

export function changeInputValue(
  rendered: RenderResult,
  label: string,
  value: string
): void {
  fireEvent.change(rendered.getByLabelText(label), {
    target: { value },
  });
}

describe('formUtilities', () => {
  it('tests nothing on its own', () => {
    expect(true).toBeTruthy();
  });
});
