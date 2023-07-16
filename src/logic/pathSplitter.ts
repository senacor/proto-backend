const PATH_SEPARATOR = "/"

function removeTrailingAndLeadingPathSeparators(path: string) {
  if (path.startsWith(PATH_SEPARATOR)) {
    path = path.slice(PATH_SEPARATOR.length);
  }

  if (path.endsWith(PATH_SEPARATOR)) {
    path = path.slice(0, path.length - PATH_SEPARATOR.length);
  }
  return path;
}

export const splitPath = (path: string): Array<string> => {
  path = removeTrailingAndLeadingPathSeparators(path);

  if (path.length === 0) {
    return []
  }

  return path.split(PATH_SEPARATOR)
}