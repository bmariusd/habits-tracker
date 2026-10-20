import { render, screen } from '@testing-library/react';
import type { Container, ServiceIdentifier } from 'inversify';

import { DIProvider, useInjection } from './di';

interface MessageService {
  message: string;
}

const messageServiceId = Symbol.for(
  '@org/di/test/MessageService',
) as ServiceIdentifier<MessageService>;

function TestComponent() {
  const messageService = useInjection(messageServiceId);
  return <p>{messageService.message}</p>;
}

describe('DIProvider and useInjection', () => {
  it('provides a registered service to a React component', () => {
    const messageService = { message: 'Resolved through the container' };
    const get = jest.fn(() => messageService);

    // The bridge only calls container.get(), so the test can provide that
    // behavior without importing Inversify's runtime code.
    const container = { get } as unknown as Container;

    render(
      <DIProvider container={container}>
        <TestComponent />
      </DIProvider>,
    );

    expect(screen.getByText('Resolved through the container')).toBeTruthy();
    expect(get).toHaveBeenCalledWith(messageServiceId);
  });
});
