# rename-obj-map

[![npm](https://img.shields.io/npm/v/rename-obj-map.svg)](https://www.npmjs.com/package/rename-obj-map)
[![codecov](https://codecov.io/gh/KarimAziev/rename-obj-map/branch/main/graph/badge.svg?token=IPLDMATHQU)](https://codecov.io/gh/KarimAziev/rename-obj-map)

Rename object keys with inferable types.

## Install

```bash
npm i rename-obj-map
```

Or

```bash
yarn add rename-obj-map
```

## Usage

### renameKeys (renameMap, obj)

Creates a new `obj` with the own properties of the provided object, but
the keys renamed according to `renameMap`.

```typescript
import { renameKeys } from 'rename-obj-map';

renameKeys({ _id: 'id' }, { _id: 1234578 });
// → { id: 1234578 }
// → infer as { id: number }

enum remapEnums {
  _id = 'id',
}
renameKeys(remapEnums, { _id: 1234578 });
// → { id: 1234578 }
// → infer as { id: number }

const remap = { _id: 'id' } as const;
const obj = { _id: 1234578 };

renameKeys(remap, obj);
// → { id: 1234578 }
// → infer as { id: number }
```

### curriedRenameKeys (renameMap)→(obj)

Curried version of `renameKeys`.

```typescript
import { curriedRenameKeys } from 'rename-obj-map';

const res0 = curriedRenameKeys({ _id: 'id' })({ _id: 1234578 });
// → { id: 1234578 }
// → infer as { id: number }

enum remapEnums {
  _id = 'id',
}
const res1 = curriedRenameKeys(remapEnums)({ _id: 1234578 });
// → { id: 1234578 }
// → infer as { id: number }

const remap = { _id: 'id' } as const;
const obj = { _id: 1234578 };

const res2 = curriedRenameKeys(remap)(obj);
// → { id: 1234578 }
// → infer as { id: number }
```
