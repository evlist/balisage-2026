const axes = ["x", "y", "z"];

export function resolveImpressCoordinates(html) {
  const position = { x: 0, y: 0, z: 0 };
  const delta = { x: 0, y: 0, z: 0 };
  const stepTagPattern = /<([a-zA-Z][\w:-]*)(\s[^<>]*\bclass\s*=\s*["'][^"']*\bstep\b[^"']*["'][^<>]*)>/g;

  return html.replace(stepTagPattern, (tag) => {
    let resolvedTag = tag;

    for (const axis of axes) {
      const absolute = getAttribute(resolvedTag, `data-${axis}`);
      const nextDelta = getAttribute(resolvedTag, `data-delta-${axis}`);

      if (nextDelta !== null) {
        delta[axis] = parseCoordinate(nextDelta, `data-delta-${axis}`);
      }

      if (absolute !== null) {
        position[axis] = parseCoordinate(absolute, `data-${axis}`);
        continue;
      }

      if (delta[axis] !== 0) {
        position[axis] += delta[axis];
        resolvedTag = setAttribute(resolvedTag, `data-${axis}`, formatCoordinate(position[axis]));
      }
    }

    return resolvedTag;
  });
}

function getAttribute(tag, name) {
  const pattern = new RegExp(`\\s${escapeRegExp(name)}\\s*=\\s*(["'])(.*?)\\1`, "i");
  const match = tag.match(pattern);
  return match ? match[2] : null;
}

function setAttribute(tag, name, value) {
  const pattern = new RegExp(`(\\s${escapeRegExp(name)}\\s*=\\s*)(["'])(.*?)\\2`, "i");

  if (pattern.test(tag)) {
    return tag.replace(pattern, `$1"${value}"`);
  }

  return tag.replace(/>$/, ` ${name}="${value}">`);
}

function parseCoordinate(value, attributeName) {
  const coordinate = Number(value);

  if (!Number.isFinite(coordinate)) {
    throw new Error(`${attributeName} must be a finite number, got "${value}".`);
  }

  return coordinate;
}

function formatCoordinate(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
