import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { DATA_READY_HOOK } from '../constants';
import { VisualTest } from '../VisualTest/VisualTest';
import { ChildrenProp } from '../VisualTest/VisualTest.types';
import {
  EyesStorybookOptions,
  SnapperConfiguration,
  SnapProps,
} from './storybook-snapper.types';

const configuration: SnapperConfiguration = {
  dataIgnoreAttr: '',
  dataReadyAttr: '',
};
let currentTest = [];

export function config({
  dataIgnoreAttr,
  dataReadyAttr,
}: SnapperConfiguration) {
  configuration.dataIgnoreAttr = dataIgnoreAttr || configuration.dataIgnoreAttr;
  configuration.dataReadyAttr = dataReadyAttr || configuration.dataReadyAttr;
}

export function visualize(visualName, tests) {
  if (currentTest.length) {
    throw new Error("Previous test didn't end as expected!");
  }

  if (!visualName) {
    throw new Error('Must have a test name');
  }

  currentTest.push(visualName);

  try {
    tests();
  } catch (e) {}

  currentTest = [];
}

export function story(storyName, cb) {
  currentTest.push(storyName);

  try {
    cb();
  } catch (e) {}

  currentTest.pop();
}

function runSnap(props: SnapProps) {
  const {
    snapshotName,
    cb,
    skip = false,
    debug = false,
    eyesConfig = {},
  } = props;
  const eyesStorybookOptions: EyesStorybookOptions = {
    waitBeforeScreenshot: `[${DATA_READY_HOOK}="true"]`,
    ...eyesConfig,
  };
  const fullStoryName = [...currentTest].join('/');

  if (skip) {
    (eyesStorybookOptions as any).ignore = [
      { selector: `[${configuration.dataIgnoreAttr}="true"]` },
    ];
  }

  storiesOf(fullStoryName, module).add(
    snapshotName,
    () => (
      <VisualTest
        ignore={skip}
        debug={debug}
        dataIgnore={configuration.dataIgnoreAttr}
        dataReady={configuration.dataReadyAttr}
      >
        {cb}
      </VisualTest>
    ),
    {
      eyes: eyesStorybookOptions,
    },
  );
}

function createSnapMethod({ debug = false, skip = false }) {
  return (snapshotName: string, cb: ChildrenProp, eyesConfig: any) => {
    runSnap({ snapshotName, cb, debug, skip, eyesConfig });
  };
}

export const snap: any = createSnapMethod({ debug: false, skip: false });
snap.debug = createSnapMethod({ debug: true, skip: false });
snap.skip = createSnapMethod({ debug: false, skip: true });
export const xsnap = snap.skip;
