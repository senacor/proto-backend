import {expect, test} from '@jest/globals';
import { getFromStorage, writeToStorage } from './storage';

test('verify storage functionality', () => {
  const obj = {"oneNode": {"twoNode": "value"}}
  writeToStorage(["foo", "bar"], obj)

  expect(getFromStorage(["foo"])).toEqual({bar: obj})
  expect(getFromStorage(["foo", "bar"])).toEqual(obj)
  expect(getFromStorage(["foo", "bar", "oneNode", "twoNode"])).toEqual("value")
})

test('verify empty storage functionality', () => {
  expect(getFromStorage([])).toEqual({})
})