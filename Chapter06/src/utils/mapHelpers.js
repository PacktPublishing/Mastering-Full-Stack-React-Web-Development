const duplicate = (map) => {
  const newMap = new Map();
  map.forEach((item, key) => {
    if(item['_id']) {
      newMap.set(item['_id'], item);
    }
  });
  return newMap;
};

const addMultipleItems = (map, items) => {
  const newMap = duplicate(map);

  Object.keys(items).map((itemIndex) => {
    let item = items[itemIndex];
    if(item['_id']) {
      newMap.set(item['_id'], item);
    }
  });

  return newMap;
};

const addItem = (map, newKey, newItem) => {
  const newMap = duplicate(map);
  newMap.set(newKey, newItem);
  return newMap;
};

const deleteItem = (map, key) => {
  const newMap = duplicate(map);
  newMap.delete(key);

  return newMap;
};

export default {
  addItem,
  deleteItem,
  addMultipleItems
};