import { JsonNode, JsonObject } from '../types';


let storage: JsonObject = {}

/**
 * Gets a path by dot notation. E.g. on a storage '{"foo": {"bar": 0}}', this would be the returns:
 * getFromStorage([]) => {"foo": {"bar": 0}}
 * getFromStorage(["foo"]) => {"bar": 0}
 * getFromStorage(["foo", "bar"]) => 0
 * getFromStorage(["foo", "baz"]) => undefined
 * getFromStorage(["foo", "baz", "bar"]) => ERROR
 * @param storagePath
 */
export const getFromStorage = (storagePath: Array<string>): JsonNode => {
  return storagePath.reduce(
    (storageObj: JsonNode, pathElement: string) => (storageObj as JsonObject)[pathElement],
    storage
  )
}

const isObject = (value: any) => Object.prototype.toString.call(value) === '[object Object]';

export const writeToStorage = (path: Array<string>, content: JsonNode): JsonNode => {
  if (path.length > 0) {
    return writeToSubpath(path, content, storage)
  }

  if (!isObject(content)) {
    throw new Error("Can only save objects as root")
  }

  storage = content as JsonObject
  return storage
}

const writeToSubpath = (path: Array<string>, content: JsonNode, storageItem: JsonObject = storage ): JsonNode => {
  if (path.length === 1) {
      storageItem[path[0]] = content;
      return storageItem[path[0]]
    } else {
      if (storageItem[path[0]] === undefined) {
        storageItem[path[0]] = {};
      }

      return writeToSubpath(path.slice(1), content, (storageItem[path[0]] as JsonObject));
    }
}