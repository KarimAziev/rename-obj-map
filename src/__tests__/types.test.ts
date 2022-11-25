import { expectTypeOf } from 'expect-type';
import { renameKeys, curriedRenameKeys } from '..';

let obj: { _id: number };

describe('Testing narrowing', () => {
  beforeEach(() => {
    obj = { _id: 1234578 };
  });
  test('renameKeys should infer inline args', () => {
    expectTypeOf(renameKeys({ _id: 'id' }, { _id: 1234578 })).toEqualTypeOf<{
      id: number;
    }>({ id: 1234578 } as const);

    expectTypeOf(renameKeys({ _id: 'id' }, { _id: 1234578 }))
      .toHaveProperty('id')
      .toBeNumber();
    expectTypeOf(renameKeys({ _id: 'id' }, { _id: 1234578, name: 'bb' }))
      .toHaveProperty('id')
      .toBeNumber();
    expectTypeOf(renameKeys({ _id: 'id' }, { _id: 1234578, name: 'bb' }))
      .toHaveProperty('name')
      .toBeString();
  });

  test('renameKeys should work with variables', () => {
    const remap = { _id: 'id' } as const;
    const remap2 = { _id: 'id' };
    expectTypeOf(renameKeys(remap, obj)).toHaveProperty('id').toBeNumber();
    expectTypeOf(renameKeys(remap2, obj)).toBeObject();
  });

  test('renameKeys should work with variables', () => {
    enum emap {
      _id = 'id',
    }
    expectTypeOf(renameKeys(emap, { _id: 1 }))
      .toHaveProperty(emap._id)
      .toBeNumber();
    expectTypeOf(renameKeys(emap, obj)).toHaveProperty(emap._id).toBeNumber();
  });

  test('curriedRenameKeys should infer inline args', () => {
    expectTypeOf(
      curriedRenameKeys({ _id: 'id' })({ _id: 1234578 })
    ).toEqualTypeOf<{
      id: number;
    }>({ id: 1234578 } as const);

    expectTypeOf(curriedRenameKeys({ _id: 'id' })({ _id: 1234578 }))
      .toHaveProperty('id')
      .toBeNumber();
    expectTypeOf(curriedRenameKeys({ _id: 'id' })({ _id: 1234578, name: 'sf' }))
      .toHaveProperty('id')
      .toBeNumber();
    expectTypeOf(curriedRenameKeys({ _id: 'id' })({ _id: 1234578, name: 'bb' }))
      .toHaveProperty('name')
      .toBeString();
  });

  test('curriedRenameKeys should work with variables', () => {
    const remap = { _id: 'id' } as const;
    const remap2 = { _id: 'id' };
    expectTypeOf(curriedRenameKeys(remap)(obj))
      .toHaveProperty('id')
      .toBeNumber();
    expectTypeOf(curriedRenameKeys(remap2)(obj)).toBeObject();
  });

  test('curriedRenameKeys should work with variables', () => {
    enum emap {
      _id = 'id',
    }
    expectTypeOf(curriedRenameKeys(emap)({ _id: 1 }))
      .toHaveProperty(emap._id)
      .toBeNumber();
    expectTypeOf(curriedRenameKeys(emap)(obj))
      .toHaveProperty(emap._id)
      .toBeNumber();
  });
});
