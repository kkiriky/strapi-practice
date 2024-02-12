const isObject = (data) => typeof data === 'object' && data !== null;
const isArray = (data) => Array.isArray(data);

function flattenAttributes(data) {
  if (!data.attributes) return data;

  return {
    id: data.id,
    ...data.attributes,
  };
}

export function flattenResponse(data) {
  if (isArray(data)) {
    return data.map((item) => flattenResponse(item));
  }

  if (isObject(data)) {
    if (isArray(data.data)) {
      data = [...data.data];
    } else if (isObject(data.data)) {
      data = flattenAttributes(data.data);
    } else if (data.data === null) {
      data = null;
    } else {
      data = flattenAttributes(data);
    }

    for (const key in data) {
      data[key] = flattenResponse(data[key]);
    }

    return data;
  }

  return data;
}
