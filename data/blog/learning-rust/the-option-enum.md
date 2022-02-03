---
title: "Learning Rust: The Option Enum"
date: "2022-02-02"
tags: ['rust', 'python', 'javascript']
draft: false
summary: "Rust has made me reconsider the null value and has made me appreciate safe code."
---

## A Learning Opportunity
Last night I was working through another chapter of the [*The Rust Programming Language*](https://doc.rust-lang.org/book/) on closures (which themselves are really neat, but I'm not going to write about them right now). There was an example using a struct of a type bound closure and a cached value of its result. The closure was expected to contain an expensive operation that took awhile to complete. So if say we'd already given a value to that expensive operation, cache it, so we don't have to run it again. 

The exercies was to use a hashmap to store to the cached values that had already been run. The initial version only and could only cache the result of a single value. It looked like this:
```rust
// ...
struct Cacher<T>
where
    T: Fn(u32) -> u32,
{
    calculation: T,
    value: Option<u32>,
}

impl<T> Cacher<T>
where
    T: Fn(u32) -> u32,
{
    fn new(calculation: T) -> Cacher<T> {
        Cacher {
            calculation,
            value: None,
        }
    }

    fn value(&mut self, arg: u32) -> u32 {
        match self.value.get(&arg) {
            Some(v) => v,
            None => {
                let v = (self.calculation)(arg);
                self.value = Some(v);
                v
            }
        }
    }
}

fn generate_workout(intensity: u32, random_number: u32) {
    let mut expensive_result = Cacher::new(|num| {
        println!("Calculating slowly...");
        thread::sleep(Duration::from_secs(2));
        intensity
    });

    if intensity < 25 {
        // If the intensity value given, hasn't already been calculated the expensive_result Cacher 
        // will calculate it, otherwise it will just return the cached result
        println!("Today, do {} pushups!", expensive_result.value(intensity));
        println!("Next, do {} situps!", expensive_result.value(intensity));
    } else {
        if random_number == 3 {
            println!("Take a break today!");
        } else {
            println!(
                "Today, run for {} minutes",
                expensive_result.value(intensity)
            );
        }
    }
}

```

So I added the 
```rust 
use std::collections::Hashmap;
```
to the top. I changed the struct defintion and implementation to something like this:
```rust
// struct
{
    calculation: T,
    value: Hashmap<u32, Option<u32>>,
}

// impl
{
    fn new(calculation: T) -> Cacher<T> {
        Cacher {
            calculation,
            value: Hashmap::new(),
        }
    }
```

So far so good, but as I was trying to implement the ```value``` method that returns the cached value if it exists or does the expensive calculation and then caches that value and returns the value, I was getting mismatched type errors. My ```value``` method look something like this:
```rust
fn value(&mut self, arg: u32) -> u32 {
        match self.value.get(&arg) {
            Some(v) => v, 
            None => {
                let v = (self.calculation)(arg);
                self.value.insert(arg, v);
                v
            }
        }
    }
``` 

It took me a little while of tinkering before I realized, I don't need to wrap the value in the key, value pair of the hashmap in an Option! This sounds really dumb in hindsight, but it wasn't obivous that the hashmap comes out of the box like that. The ```v``` was already something like Some(Some(v)) and when I returned v, I was really returning Some(v), which doesn't match the expected value of u32.

:palm-to-face:

The correct looking struct defintion is just:
```rust
struct Cacher<T>
where
    T: Fn(u32) -> u32,
{
    calculation: T,
    value: HashMap<u32, u32>, // no Option needed!
}
```

And the correct ```value``` method, was just as simple:
```rust
fn value(&mut self, arg: u32) -> u32 {
        match self.value.get(&arg) {
            Some(v) => *v,
            None => {
                let v = (self.calculation)(arg);
                self.value.insert(arg, v);
                v
            }
        }
    }
```

The interesting thing here though was that I did have to dereference the v on returning it.

## Null Values in Python and JavaScript
This got me thinking, in every programming language I've ever written I've encountered a time when I forgot to check for a null value before attempting to access a null value. I spot the error and fix it, but it always feel like a workaround--there never seems to be a clean way.

Rust doesn't have a null value. The Option enum looks like this:
```rust
pub enum Option<T> {
    Some(T),
    None
}
```

It's that genius of an enum with a None that makes all the difference in giving the compiler the ability to ensure the None is always accounted for.

So I thought I'd write a post about the way other programming languages deal with this. 

### Python's None Object

In Python ```None``` is used to define a null variable or object and is itself an object of the NoneType class. 

```python
None == False # False
None == '' # False
None == 0 # False
```

* ```None``` is not the same as False.
* ```None``` is not 0.
* ```None``` is not an empty string.
* Comparing ```None``` to anything will always return False except ```None``` itself.

None is an object, but there's no Some equivilant like in Rust. It's implicitly assumed, unless explicitly ```None```. Which means checking needs to be done to prevent the application from panicing. (I also very much love Rust's ```panic!```.)

```python
if x is not None:
    # do something
```

With Python you need to use the idomatic if statement above using ```is``` rather than ```==```. And I really like this as it's obvious what's it's doing and why, and it's simple to read. And then it's simple to add an ```else:``` if you want to handle the null case.

But null values values are nefarious because we exist and we assume other things exist when thinking about them. The whole fact that the world exists and is not none is mind blowing the more you think about it. That there is something and not nothing. Programming with null values in mind isn't really harmonious with how we think. With how it's fundamental that we think.

And so we find *optional* ways to account for nulls.

To access a dict key you can use the ```getattr``` method. Something like:

```python
class Car:
    year = 2003
    make = "Toyota"

car = Car()

make = getattr(car, make)
model = getattr(car, model) # This throws an AttributeError!

model = getattr(car, model, "Camry") # model is now Camry
```

For the model example you need to give the getattr an default fallback if the key doesn't exist. I don't think anyone would write it that way though, as this is probably more typical:

```python
make = car.get(make)
model = car.gat(model)
```

In the above there's no AttributeError at this point, BUT there will be if you try to do anything with ```model```!! So you have to use the idomatic ```if``` above whenever accessing model.

You could try using a ```try {} catch {}``` block, so the program doesn't crash at least.

That's easy to overlook and Python will run merrily along until you try to access that model. I get it that this is a difference between compiled and interpreted languages, but clearly here Rust enforces that one makes sure every enum's case is handled before compiling. 

### Javascript's null
Everyone's done this and JavaScript makes it even more difficult with the fact that ```undefined``` is a thing wholly separate from ```null```.

To check something that's not null simply use code like:
```javascript
if (x !== null) { //...
```

If it strictly isn't null I'm fine to use x in some way

But oh wait, zooming out:

```javascript
let x;

//...
if (x !== null) { // This is evaluated to true
``` 

X is undefined which isn't null. OK, so let's just add one more condition:

```javascript
if (x !== null && x !== undefined) { //...

// OR

if (!x) { //...
```

Since null and undefined are truthy false values that would kind of work. But there are a lot of truthy values in JS, e.g. empty strings, NaN, 0.

There we go, but how annoying is that. 

Javascript has the optional chaining operator ```?```. So something that would throw an error:

```javascript
let model = car.model.name;
```

Can instead be written as:

```javascript
let model = car.model?.name; // ie if model is undefined or null don't try to access its name.
```
