import { expectTypeOf } from 'expect-type';
import { renameKeys } from '..';

let obj: { _id: number; name: string; age: number; active: boolean };

describe('Testing narrowing with two params', () => {
  beforeEach(() => {
    obj = { _id: 23, name: 'John', age: 23, active: true };
  });
  describe('renameKeys should', () => {
    test('infer inline args', () => {
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

    test('work with variables', () => {
      const remap = { _id: 'id', active: 'status' } as const;
      const remap2 = { _id: 'id' };
      const res1 = renameKeys(remap, obj);
      const res2 = renameKeys<{ _id: 'id' }, typeof obj>(
        remap2 as { _id: 'id' },
        obj,
      );
      const res3 = renameKeys(remap2, obj);
      expectTypeOf(res1).toHaveProperty('id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('status').toBeBoolean();
      expectTypeOf(res2).toBeObject();
      expectTypeOf(res3).toBeObject();
    });

    test('accept generic args', () => {
      const remap2 = { _id: 'id', active: 'status' } as const;
      const res1 = renameKeys<typeof remap2, typeof obj>(remap2, obj);

      expectTypeOf(res1).toHaveProperty('id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('status').toBeBoolean();
    });

    test('accept exact argument types', () => {
      const remap = { _id: 'id', active: 'status' };
      const res1 = renameKeys<{ _id: 'id'; active: 'status' }, typeof obj>(
        remap as { _id: 'id'; active: 'status' },
        obj,
      );
      expectTypeOf(res1).toHaveProperty('id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('status').toBeBoolean();
    });

    test('work with partial props', () => {
      const remap = { _id: 'id', name: 'fullName' } as const;
      const res1 = renameKeys(remap, obj as unknown as Partial<typeof obj>);
      expectTypeOf(res1).toMatchTypeOf<{
        id?: number;
        fullName?: string;
        age?: number;
        active?: boolean;
      }>();
    });

    test('work with missing props', () => {
      expectTypeOf(renameKeys({ unexisting: 'status' }, obj)).toMatchTypeOf<{
        _id: number;
        name: string;
        age: number;
        active: boolean;
      }>();
      const remap = { unexisting: 'status' } as const;
      const res1 = renameKeys(remap, obj);
      expectTypeOf(res1).toHaveProperty('_id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('active').toBeBoolean();
    });

    test('work with both missing and present props', () => {
      expectTypeOf(renameKeys({ _id: 'id', bad: 'ff' }, obj)).toMatchTypeOf<{
        id: number;
        name: string;
        age: number;
        active: boolean;
      }>();
    });

    test('work with partially props', () => {
      const remap = { unexisting: 'status', _id: 'id' } as const;
      const res1 = renameKeys(remap, obj);
      expectTypeOf(res1).toHaveProperty('id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('active').toBeBoolean();
    });

    test('work with enums', () => {
      enum emap {
        _id = 'id',
      }
      expectTypeOf(renameKeys(emap, { _id: 1 }))
        .toHaveProperty(emap._id)
        .toBeNumber();
      expectTypeOf(renameKeys(emap, obj)).toHaveProperty(emap._id).toBeNumber();
    });

    test('work with enums and records', () => {
      enum emap {
        _id = 'id',
      }
      const rObj: Record<'_id', number> = { _id: 1 };
      expectTypeOf(renameKeys(emap, { _id: 1 } as Record<'_id', number>))
        .toHaveProperty(emap._id)
        .toBeNumber();
      expectTypeOf(renameKeys(emap, rObj))
        .toHaveProperty(emap._id)
        .toBeNumber();
    });

    test('work with const and records', () => {
      const emap = {
        _id: 'id',
      };
      const rObj: Record<'_id', number> = { _id: 1 };
      const res = renameKeys(emap, rObj);
      expectTypeOf(res).toMatchTypeOf<{
        [key: string]: number;
      }>();
    });
  });

  describe('curried renameKeys should', () => {
    test('infer inline args', () => {
      expectTypeOf(renameKeys({ _id: 'id' })({ _id: 1234578 })).toEqualTypeOf<{
        id: number;
      }>({ id: 1234578 } as const);

      expectTypeOf(renameKeys({ _id: 'id' })({ _id: 1234578 }))
        .toHaveProperty('id')
        .toBeNumber();
      expectTypeOf(renameKeys({ _id: 'id' })({ _id: 1234578, name: 'bb' }))
        .toHaveProperty('id')
        .toBeNumber();
      expectTypeOf(renameKeys({ _id: 'id' })({ _id: 1234578, name: 'bb' }))
        .toHaveProperty('name')
        .toBeString();
    });

    test('work with variables', () => {
      const remap = { _id: 'id', active: 'status' } as const;
      const remap2 = { _id: 'id' };
      const res1 = renameKeys(remap)(obj);
      const res2 = renameKeys<{ _id: 'id' }>(remap2 as { _id: 'id' })<
        typeof obj
      >(obj);
      const res3 = renameKeys(remap2)(obj);
      expectTypeOf(res1).toHaveProperty('id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('status').toBeBoolean();
      expectTypeOf(res2).toBeObject();
      expectTypeOf(res3).toBeObject();
    });

    test('accept generic args', () => {
      const remap2 = { _id: 'id', active: 'status' } as const;
      const res1 = renameKeys<typeof remap2>(remap2)(obj);

      expectTypeOf(res1).toHaveProperty('id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('status').toBeBoolean();
    });

    test('accept exact argument types', () => {
      const remap = { _id: 'id', active: 'status' };
      const res1 = renameKeys<{ _id: 'id'; active: 'status' }>(
        remap as { _id: 'id'; active: 'status' },
      )(obj);
      expectTypeOf(res1).toHaveProperty('id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('status').toBeBoolean();
    });

    test('work with partial props', () => {
      const remap = { _id: 'id', name: 'fullName' } as const;
      const res1 = renameKeys(remap)(obj as unknown as Partial<typeof obj>);
      expectTypeOf(res1).toMatchTypeOf<{
        id?: number;
        fullName?: string;
        age?: number;
        active?: boolean;
      }>();
    });

    test('work with missing props', () => {
      expectTypeOf(renameKeys({ unexisting: 'status' })(obj)).toMatchTypeOf<{
        _id: number;
        name: string;
        age: number;
        active: boolean;
      }>();
      const remap = { unexisting: 'status' } as const;
      const res1 = renameKeys(remap)(obj);
      expectTypeOf(res1).toHaveProperty('_id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('active').toBeBoolean();
    });

    test('work with both missing and present props', () => {
      expectTypeOf(renameKeys({ _id: 'id', bad: 'ff' })(obj)).toMatchTypeOf<{
        id: number;
        name: string;
        age: number;
        active: boolean;
      }>();
    });

    test('work with partially props', () => {
      const remap = { unexisting: 'status', _id: 'id' } as const;
      const res1 = renameKeys(remap)(obj);
      expectTypeOf(res1).toHaveProperty('id').toBeNumber();
      expectTypeOf(res1).toHaveProperty('name').toBeString();
      expectTypeOf(res1).toHaveProperty('age').toBeNumber();
      expectTypeOf(res1).toHaveProperty('active').toBeBoolean();
    });

    test('work with enums', () => {
      enum emap {
        _id = 'id',
      }
      expectTypeOf(renameKeys(emap)({ _id: 1 }))
        .toHaveProperty(emap._id)
        .toBeNumber();
      expectTypeOf(renameKeys(emap)(obj)).toHaveProperty(emap._id).toBeNumber();
    });

    test('work with enums and records', () => {
      enum emap {
        _id = 'id',
      }
      const rObj: Record<'_id', number> = { _id: 1 };
      expectTypeOf(renameKeys(emap)({ _id: 1 } as Record<'_id', number>))
        .toHaveProperty(emap._id)
        .toBeNumber();
      expectTypeOf(renameKeys(emap)(rObj))
        .toHaveProperty(emap._id)
        .toBeNumber();
    });

    test('work with const and records', () => {
      const emap = {
        _id: 'id',
      };
      const rObj: Record<'_id', number> = { _id: 1 };
      const res = renameKeys(emap)(rObj);
      expectTypeOf(res).toMatchTypeOf<{
        [key: string]: number;
      }>();
    });
  });
});
