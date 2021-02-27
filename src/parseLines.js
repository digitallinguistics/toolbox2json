const lineRegExp = /^\\(?<marker>\S+)\s*(?<data>.*)$/u;

/**
 * Parses a raw line into an object with "marker" and "data" properties.
 * @param  {String} line The raw line from the Toolbox file
 * @return {Object}      Returns an object with "marker" and "data" properties.
 */
function getLineData(line) {
  return lineRegExp.exec(line).groups;
}

/**
 * A no-op method to use when data does not need transforming.
 * @param  {String|Array} data The line data
 * @return {String|Array}      Returns the input
 */
function noTransform(data) {
  return data;
}

/**
 * Parses an array of Toolbox lines into a single JavaScript object
 * @param  {Array}  lines      The array of Toolbox lines for an entry
 * @param  {Object} mappings   An object mapping line markers to property names
 * @param  {Object} transforms An object of transformation methods to apply to lines
 * @return {Object}
 */
export default function parseLines(lines, mappings, transforms) {

  const linesMap = lines
  .map(getLineData)
  .reduce((map, { marker, data: newData }) => {

    const propName        = mappings[marker] ?? marker;
    const transform       = transforms[marker] ?? noTransform;
    const transformedData = transform(newData);

    if (map.has(propName)) {

      const currentData = map.get(propName);
      if (Array.isArray(currentData)) currentData.push(transformedData);
      else map.set(propName, [currentData, transformedData]);

    } else {

      map.set(propName, transformedData);

    }

    return map;

  }, new Map);

  return Object.fromEntries(linesMap);

}
