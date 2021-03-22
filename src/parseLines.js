const lineRegExp = /^\\(?<marker>\S+)\s*(?<data>.*)$/u;

/**
 * Parses a raw line into an object with "marker" and "data" properties.
 * @param  {String} line The raw line from the Toolbox file
 * @return {Object}      Returns an object with "marker" and "data" properties.
 */
function getLineData(line) {
  return lineRegExp.exec(line.trim()).groups;
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
  .reduce((map, { marker, data }) => {

    const propName = mappings[marker] ?? marker;

    if (map.has(propName)) {

      const currentData = map.get(propName);
      if (Array.isArray(currentData)) currentData.push(data);
      else map.set(propName, [currentData, data]);

    } else {

      map.set(propName, data);

    }

    return map;

  }, new Map);

  Object.entries(transforms).forEach(([marker]) => {

    const propName  = mappings[marker] ?? marker;
    const transform = transforms[marker] ?? noTransform;
    const data      = linesMap.get(propName);

    linesMap.set(propName, transform(data));

  });

  return Object.fromEntries(linesMap);

}
