export declare interface BetterObjectConstructor extends ObjectConstructor {
  fromEntries<T, U extends string>(
    entries: Iterable<readonly [U, T]>
  ): { [P in U]: T };

  entries<T extends string | number | symbol, U>(object: { [P in T]?: U }): [
    T,
    U
  ][];
}
