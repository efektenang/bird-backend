import { HttpStatus } from '@nestjs/common'
import { IPayloadResponse, Response } from './helper-type.util'
import { TestingModule } from '@nestjs/testing'
import { IRequestMockCallback } from './mock-request'

export const mockResponse = (
  mapping: (statusCode: HttpStatus, responsePayload?: IPayloadResponse) => any
): Partial<Response> => ({
  asJson: jest.fn((x: any, c: any) => {
    return mapping(x, c)
  })
})

export interface ISharedTesting {
  [K: string]: any
  token: string
}

export interface IDepsTesting {
  modules: TestingModule
  getCollection: any
  mockRequest: IRequestMockCallback
}

export interface ISequencePayload {
  getDeps: () => IDepsTesting
  getShared: () => ISharedTesting
  setShared: (key: string, values: any) => void
}

export type TSequentiallyTesting<T = any> = (payload: ISequencePayload) => T
