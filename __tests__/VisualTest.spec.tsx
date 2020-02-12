import * as React from 'react';
import { render } from '@testing-library/react';
import mockConsole from 'jest-mock-console';
import { VisualTest } from '../src/VisualTest';

const delay = ms => new Promise(res => setTimeout(res, ms));

describe('VisualTest', () => {
  describe('async warning', () => {
    let restoreConsole;

    beforeEach(() => {
      restoreConsole = mockConsole();
    });

    afterEach(() => {
      restoreConsole();
    });

    it('should warn when declaring the done argument but not invoking it', async () => {
      const testName = 'VisualTest done';
      const timeout = 1000;
      render(
        <VisualTest timeout={timeout} testName={testName}>
          {done => <div>Hello World</div>}
        </VisualTest>,
      );
      await delay(timeout + 100);
      expect(console.warn).toHaveBeenCalled();
      const warnOutput = (console.warn as jest.MockedFunction<any>).mock
        .calls[0][0] as string;
      expect(
        warnOutput.startsWith(
          `[storybook-snapper]: Visual test ${testName} has reached its maximum timeout of ${timeout}ms`,
        ),
      ).toBeTruthy();
    });

    it("shouldn't warn when invoking the done argument", async () => {
      const testName = 'VisualTest done';
      const timeout = 1000;
      render(
        <VisualTest timeout={timeout} testName={testName}>
          {done => {
            setTimeout(done, timeout / 2);
            return <div>Hello World</div>;
          }}
        </VisualTest>,
      );

      await delay(timeout + 100);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it("shouldn't warn when not declaring the done argument", async () => {
      const testName = 'VisualTest done';
      const timeout = 1000;
      render(
        <VisualTest timeout={timeout} testName={testName}>
          <div>Hello World</div>
        </VisualTest>,
      );

      await delay(timeout + 100);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });
});
