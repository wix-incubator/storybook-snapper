import { ChildrenProp } from '../VisualTest/VisualTest.types';

export interface EyesStorybookOptions {
  ignore?: boolean;
  waitBeforeScreenshot?: string | number;
}

export interface SnapperConfiguration {
  dataIgnoreAttr?: string;
  dataReadyAttr?: string;
}

export interface SnapProps {
  snapshotName: string;
  cb: ChildrenProp;
  skip?: boolean;
  debug?: boolean;
  eyesConfig?: EyesStorybookOptions & any;
}
