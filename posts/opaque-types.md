---
title: 'Opaque types'
published: true
slug: 'opaque-types'
date: '2023-03-31'
---

As a software engineer, one of the most important aspects of writing code is ensuring that it accurately reflects the domain it represents. In domain-driven design (DDD), this is achieved by modeling domain concepts as closely as possible, using the language of the domain to define types, functions, and operations.

One way to achieve this is through the use of opaque types, a powerful technique that can help improve the safety, clarity, flexibility, and readability of your code. In this article, we'll explore the benefits of opaque types in DDD and show you how to use them in your TypeScript code.

## What are Opaque Types?

An opaque type is a type that provides a unique abstraction over an underlying type, without exposing its implementation details. It is used to enforce type safety and prevent invalid values from being used in a program.

Here's an example:

```typescript
type ProductId = { readonly __brand: unique symbol } & string;
declare const getProductById = (id: ProductId) => Product;
```

In this example, we've defined a new type `ProductId` that is compatible with the `string` type, but is not assignable to or from it. We've achieved this by intersecting the `string` type with a unique symbol, effectively creating a new type that is distinct from `string`.

## Benefits of Opaque Types in DDD

Opaque types offer several benefits when used in domain-driven design:

### Improved Type Safety

By defining opaque types for domain concepts, you can ensure that only valid values are used in your application. This helps improve type safety by catching errors at compile-time, rather than at runtime. In the example above, by defining a ProductId type, we ensure that only valid product IDs are passed to functions that expect them, reducing the risk of bugs caused by invalid values.

### Improved Clarity

Opaque types can also improve the readability of your code by making it easier to identify the purpose and intent of different types and functions. By using opaque types to represent domain concepts, you can give meaningful names to the types and functions in your code, making it easier to understand their purpose and behavior, and communicate the meaning and purpose of these concepts more clearly to other developers, making it easier for them to understand and modify your code.

### Improved Flexibility

Opaque types can also improve the flexibility of your code by allowing you to change the definition of a domain concept without affecting the rest of your codebase. For example, if you decide to change the definition of a product ID from a string to a number, you can do so by changing the definition of the ProductId type, without needing to update all the functions and operations that use it.
