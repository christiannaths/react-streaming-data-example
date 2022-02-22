let counter = 0;

function uniqueId(prefix = 'id') {
  return `${prefix}-${counter++}`;
}

export default uniqueId;
