import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { DATA_READY_HOOK } from './hooks';
import {
  ChildrenProp,
  EyesStorybookOptions,
  SnapperConfiguration,
} from './types';
import { VisualTest } from './VisualTest';

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

function runSnap(
  snapshotName: string,
  cb: ChildrenProp,
  ignore: boolean = false,
) {
  const eyesStorybookOptions: EyesStorybookOptions = {
    waitBeforeScreenshot: `[${DATA_READY_HOOK}="true"]`,
  };
  const fullStoryName = [...currentTest].join('/');

  if (ignore) {
    (eyesStorybookOptions as any).ignore = [
      { selector: `[${configuration.dataIgnoreAttr}="true"]` },
    ];
  }

  storiesOf(fullStoryName, module).add(
    snapshotName,
    () => (
      <VisualTest
        ignore={ignore}
        dataIgnore={configuration.dataIgnoreAttr}
        dataReady={configuration.dataReadyAttr}
        testName={`${fullStoryName} ${snapshotName}`}
      >
        {cb}
      </VisualTest>
    ),
    {
      eyes: eyesStorybookOptions,
    },
  );
}

export function snap(snapshotName: string, cb: ChildrenProp) {
  runSnap(snapshotName, cb);
}

export function xsnap(snapshotName: string, cb: ChildrenProp) {
  runSnap(snapshotName, cb, true);
}
