---
title: "Learning Rust: Smart Pointers"
date: "2022-02-10"
tags: ['rust']
draft: true
summary: "A look at Box, Rc, RefCell"
---

## `Box<T>`
Allows us to store the referenced data on the heap. Get use case is the ability to create recursive structs:

```rust
use::crate::List::{Cons, Nil};

enum List {
    Cons(i32, Box<List>),
    Nil,
}
```

Without using the smartpointer here, the compilier would see an infinite loop in determining how much space the List enum would need.

## `Rc<T>`

Allows us to create multiple immutable owners of the referenced data.

Using ```Rc::clone()``` increases the strong reference count, and does not make a deep clone of the referenced data.

## `RefCell<T>`

Allows us to create interior mutability. Keeps track of how many `Ref<T>` and `RefMut<T>` smart pointers are currently active. Like all other data in Rust, many immutable references are allowed and only one mutable reference.

