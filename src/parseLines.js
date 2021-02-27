const markerRegExp = /^\\(?<marker>\S+)/u;

function getMarker(line) {
  return markerRegExp.exec(line).groups.marker;
}

/**
 * Parses an array of Toolbox lines into a single JavaScript object
 * @param  {Array}  lines The array of Toolbox lines for an entry
 * @return {Object}
 */
export default function parseLines(lines) {

  const markers = lines.map(getMarker);

  return lines;

}
