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
 * Parses an array of Toolbox lines into a single JavaScript object
 * @param  {Array}  lines The array of Toolbox lines for an entry
 * @return {Object}
 */
export default function parseLines(lines, mappings) {

  const linesMap = lines
  .map(getLineData)
  .reduce((map, { marker, data: newData }) => {

    const propName = mappings[marker] ?? marker;

    if (map.has(propName)) {

      const currentData = map.get(propName);
      if (Array.isArray(currentData)) currentData.push(newData);
      else map.set(propName, [currentData, newData]);

    } else {

      map.set(propName, newData);

    }

    return map;

  }, new Map);

  return Object.fromEntries(linesMap);

}
