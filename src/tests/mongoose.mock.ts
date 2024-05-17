import { mock } from 'jest-mock-extended';
import { Model } from 'mongoose';

export const mongooseMock = {
  model: mock<Model<any>>(),
};
