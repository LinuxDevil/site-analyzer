export type Nullable<T> = T | undefined | null;
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
Creates a new type by excluding properties that exist in both T and U from T.

@template T - The original type.
@template U - The type to exclude properties from.
@returns A new type with the excluded properties.
*/
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
/**
Represents the exclusive union of T and U.

@template T - The first type.
@template U - The second type.
@returns A new type representing the exclusive union of T and U.
*/
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
