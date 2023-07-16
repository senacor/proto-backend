import { JsonNode, JsonObject } from '../types';


const storage: JsonObject = {}

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

export const writeToStorage = (path: Array<string>, content: JsonNode, storageItem: JsonObject = storage ): JsonNode => {
    if (path.length === 1) {
      storageItem[path[0]] = content;
      return storageItem[path[0]]
    } else {
      if (storageItem[path[0]] === undefined) {
        storageItem[path[0]] = {};
      }

      return writeToStorage(path.slice(1), content, (storageItem[path[0]] as JsonObject));
    }
}