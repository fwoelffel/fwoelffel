---
title: 'Monads'
published: false
slug: 'monads'
date: '2023-04-01'
---

In functional programming, a monad is a design pattern that provides a way to encapsulate common patterns of computation. Specifically, a monad is a type constructor that provides a way to chain computations together in a composable and modular way.

One of the primary benefits of monads is that they allow for a separation of concerns between the specific details of a computation and the way that computation is combined with other computations. This can lead to code that is easier to understand, easier to modify, and less prone to errors.

There are many different types of monads, each with their own specific properties and use cases. Some common examples include the Maybe monad, the List monad, and the Reader monad.

## The formal definition of monads

Given any well-defined, basic types _T_, _U_, a monad consists of three parts:

- A type constructor _M_ that builds up a monadic type _M<T>_
- A type converter, often called _unit_ or _return_, that embeds a value in the monad:  
  `unit: T → M<T>`
- A combinator, typically called _bind_ and represented with an infix operator _>>=_ or a method called _flatMap_, that unwraps a monadic variable, then inserts it into a monadic function, resulting in a new monadic value:  
  `(>>=): (M<T>, T → M<U>) → M<U>`

These three components work together to define the behavior of a monad, allowing it to be used in a wide range of contexts and computations.

## The monads' laws

The laws of monads ensure that the behavior of the monad is consistent and predictable, making it a powerful tool for working with abstract computations. The laws are:

- Left identity: The _unit_ function acts as a left-identity for the _bind_ function, ensuring that the monadic structure is preserved while applying a function to a value inside the monad `unit(x) >>= f ↔ f(x)`
- Right identity: The _unit_ function also acts as a right-identity for the _bind_ function, ensuring that the monadic structure is preserved while extracting a value from the monad. `m >>= unit ↔ m`
- Associativity: The _bind_ function is associative, ensuring that the order in which monadic operations are performed does not affect the final result. `m >>= ((x) → f(x) >>= g) ↔ (m >>= f) >>= g`

These laws are essential for monads to be useful in practice, as they ensure that monads behave consistently and can be composed in predictable ways.

## Example: The Maybe monad

In languages like TypeScript, monads can be implemented using techniques like higher-order functions and currying.

```typescript
type Maybe<T> = {
  map: <R>(fn: (value: T) => Nullable<R>) => Maybe<R>;
  flatMap: <R>(fn: (value: T) => Maybe<R>) => Maybe<R>;
  value: Nullable<T>;
};

const Just = <T>(value: T): Maybe<T> => ({
  map: (fn) => Maybe(fn(value)),
  flatMap: (fn) => fn(value),
  value,
});

const Nothing = <T>(): Maybe<T> => ({
  map: () => Nothing(),
  flatMap: () => Nothing(),
  value: null,
});

const Maybe = <T>(value: Nullable<T>): Maybe<T> =>
  value != null ? Just(value) : Nothing();

// Example usage
const maybeValue = Maybe(5)
  .map((value) => value * 2)
  .flatMap((value) => Maybe(value + 1))
  .map((value) => value.toString());

console.log(maybeValue.value); // Outputs "11"
```

The left identity law states that calling the unit function on a value _a_, and then calling _flatMap_ with a function _f_, should be equivalent to calling _f_ directly on _a_.

```ts
const a = 5;
const f = (x: number) => Just(x * 2);

const leftIdentity1 = Just(a).flatMap(f); // Just(10)
const leftIdentity2 = f(a); // Just(10)
```

The right identity law states that calling _flatMap_ on a monad with the unit function should return the same monad.

```ts
const m = Just(5);

const rightIdentity1 = m.flatMap(Just); // Just(5)
const rightIdentity2 = m; // Just(5)
```

The associativity law states that calling _flatMap_ twice, with two different functions _f_ and _g_, is equivalent to calling _flatMap_ once with a function that returns another function that calls flatMap with _g_ on the result of _f_.

```ts
const m = Just(5);
const f = (x: number) => Just(x * 2);
const g = (x: number) => Just(x + 1);

const associativity1 = m.flatMap(f).flatMap(g); // Just(11)
const associativity2 = m.flatMap((x) => f(x).flatMap(g)); // Just(11)
```

In these examples, we can see that the monad laws hold true for the Maybe monad, as they do for all monads.
