---
title: "Learning Rust: Smart Pointers"
date: "2023-03-10"
tags: ['rust']
draft: false
summary: "A look at Box, Rc, RefCell"
---

I just wanted to write something quickly about smart pointers and hope that playing around with them a little bit will help solidify their concepts.

## `Box<T>`
Allows us to store the referenced data on the heap. A sample use case is the ability to create recursive structs:

```rust
use::crate::List::{Cons, Nil};

enum List {
    Cons(i32, Box<List>),
    Nil,
}
```

Without using the `Box` here, the compilier wouldn't be able to determine List's size, because it's recursively defined. Box has a known size of a pointer, pointing at the value contained within itself.

There can only be one owner. There can only be one thread.

## `Rc<T>`

Allows us to create multiple immutable owners of the referenced data in a single threaded context.

Using ```Rc::clone()``` increases the strong reference count, and does not make a deep clone of the referenced data, but adds another owner to the data. Once this is zero the data is cleaned up.

Using ```Rc::downgrade()``` increases the weak reference count, which can be greater than zero when the data is deconstructed.

## `RefCell<T>`

Allows us to create interior mutability. Keeps track of how many `Ref<T>` and `RefMut<T>` smart pointers are currently active. Like all other data in Rust, many immutable references are allowed or only one mutable reference.

The main difference being these smart pointers are checked at runtime for their validity. Having more than one ```RefMut``` active at once will cause the program to panic.

## Putting it all together

```rust
use anyhow::Result;
use std::cell::RefCell;
use std::rc::{Rc, Weak};

fn main() -> Result<()> {
    let weak_node = RefCell::new(Weak::new());

    let std_rc = Rc::new(0);

    *weak_node.borrow_mut() = Rc::downgrade(&std_rc);

    println!("{}", Rc::strong_count(&std_rc)); // 1
    println!("{}", Rc::weak_count(&std_rc)); // 1

    Ok(())
}
```
I create a RefCell containing an empty weak Rc.

I then create an Rc holding 0.

I then assign the std_rc as a weak reference inside the weak_node RefCell. And then you can see there's one strong reference and and weak reference. The one strong being the std_rc itself, the first owner.
