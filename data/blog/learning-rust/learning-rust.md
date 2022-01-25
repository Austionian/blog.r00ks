---
title: "Learning Rust: Strings and Immutables"
date: "2022-01-23"
tags: ['rust']
draft: false
summary: "A simple post about what I've learned so far."
---

I'm currently reading [*The Rust Programming Language*](https://doc.rust-lang.org/book/) (this [paper copy](https://nostarch.com/Rust2018) specifically) and it's been a great resource so far. This post will just cover a few useful things.

## A Quick Note About Strings (and Comparing Them)

When comparing a string literal to a String, use .trim() to remove the new line character from the String. For example, inside of a loop I want to continually ask the user for string until they enter "quit." The following code won't work:
```rust
println!("Give me a number: (enter 'quit' when all numbers entered)");

let mut n = String::new();

io::stdin().read_line(&mut n).expect("Failed to read line.");

if n == "quit" {
    break;
}
```

The String::new() adds a newline character to the end, so for that to be "quit" instead of "quit/n", it needs to be trimmed:
```rust
println!("Give me a number: (enter 'quit' when all numbers entered)");

let mut n = String::new();

io::stdin().read_line(&mut n).expect("Failed to read line.");

if n.trim() == "quit" {
    break;
}
```

## Arrays and Vectors

Variables are immutable by default. Arrays' size are immutable. Vectors are what other programming languages would noramlly call an ```array``` (JS) or ```list``` (Python). 