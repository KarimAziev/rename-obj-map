/**
 * Rename `Obj` according to `RenameMap`
 * keys renamed according to renameMap
 * @param RenameMap - object of form `{oldKey: newKey}`.
 * @param Obj - object to rename. When some key is not found in the renameMap, then it's passed as-is.
 * @returns The generated type
 */

export type RenameByMap<RenameMap, Obj> = {
  [K in keyof Obj as K extends keyof RenameMap
    ? RenameMap[K] extends string
      ? RenameMap[K]
      : never
    : K]: K extends keyof Obj ? Obj[K] : never;
};

export type Cast<A, B> = A extends B ? A : B;

/**
 * Types that can be directly narrowed when inferred
 */

export type Narrowable = string | number | bigint | boolean;

/**
 * Narrows a generic type that could contain narrowable types
 */
export type Narrow<A> = Cast<
  A,
  [] | (A extends Narrowable ? A : never) | { [K in keyof A]: Narrow<A[K]> }
>;

/**
 * Create a function that returns a new object with the own properties of the provided object, but the
 * keys renamed according to renameMap.
 * @param renameMap - object of form `{oldKey: newKey}`.
 * @example
 * ```ts
 * const myRename = renameKeys({ _id: 'id' });
 * myRename({ _id: 1 }) // RESULT: { id: 1 }
 * ```
 */

export function renameKeys<RenameMap>(renameMap: Narrow<RenameMap>): <Obj>(
  obj: Obj,
) => {
  [K in keyof Obj as K extends keyof RenameMap
    ? RenameMap[K] extends string
      ? RenameMap[K]
      : never
    : K]: K extends keyof Obj ? Obj[K] : never;
};
/**
 * Creates a new object with the own properties of the provided object, but the
 * keys renamed according to renameMap.
 * @param renameMap - object of form `{oldKey: newKey}`.
 * @param obj - object to rename. When some key is not found in the renameMap, then it's passed as-is.
 * @example
 * ```ts
 * const obj = { _id: 1 };
 * renameKeys({ _id: 'id' }, obj); // RESULT: { id: 1 }
 * ```
 */

export function renameKeys<RenameMap, Obj>(
  renameMap: Narrow<RenameMap>,
  obj: Obj,
): {
  [K in keyof Obj as K extends keyof RenameMap
    ? RenameMap[K] extends string
      ? RenameMap[K]
      : never
    : K]: K extends keyof Obj ? Obj[K] : never;
};
/**
 * Rename object `obj` according to `renameMap`. This function is automatically curried.
 *
 * @param renameMap - object of form `{oldKey: newKey}`.
 * @param obj - object to rename.
 * @example
 * ```ts
 * const renameMap = { _id: 'id' }
 * const obj = { _id: 1 };
 * renameKeys(renameMap, obj); // RESULT: { id: 1 }
 * renameKeys(renameMap)(obj); // RESULT: { id: 1 }
 * ```
 */

export function renameKeys<RenameMap, Obj>(
  renameMap: Narrow<RenameMap>,
  obj?: Obj,
) {
  if (arguments.length > 1) {
    return Object.keys((obj as any) || {}).reduce(
      (acc, key) => {
        const newName = (renameMap as any)[key as keyof RenameMap & Obj] || key;
        (acc as Record<any, any>)[newName] = (obj as Record<any, any>)[key];

        return acc;
      },
      {} as {
        [K in keyof Obj as K extends keyof RenameMap
          ? RenameMap[K] extends string
            ? RenameMap[K]
            : never
          : K]: K extends keyof Obj ? Obj[K] : never;
      },
    );
  } else {
    return <Obj>(obj: Obj) => {
      return Object.keys((obj as any) || {}).reduce(
        (acc, key) => {
          const newName =
            (renameMap as any)[key as keyof RenameMap & Obj] || key;
          (acc as Record<any, any>)[newName] = (obj as Record<any, any>)[key];

          return acc;
        },
        {} as {
          [K in keyof Obj as K extends keyof RenameMap
            ? RenameMap[K] extends string
              ? RenameMap[K]
              : never
            : K]: K extends keyof Obj ? Obj[K] : never;
        },
      );
    };
  }
}

export type RenameKeys = typeof renameKeys;

export const curriedRenameKeys = renameKeys;
