import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('passes clicks to its caller', () => {
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Add habit</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Add habit' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not allow clicks while disabled', () => {
    const onClick = jest.fn();

    render(<Button disabled onClick={onClick}>Saving</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Saving' }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
