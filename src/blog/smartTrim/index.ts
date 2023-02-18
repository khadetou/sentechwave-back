export const smartrim = (
  str: string,
  length: number,
  delim: string,
  appendix: string,
) => {
  if (str.length <= length) return str;

  let trimmedStr = str.substring(0, length + delim.length);

  const lastDelimIndex = trimmedStr.lastIndexOf(delim);
  if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substring(0, lastDelimIndex);
  if (trimmedStr) trimmedStr += appendix;
  return trimmedStr;
};
