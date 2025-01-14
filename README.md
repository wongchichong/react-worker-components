# react-worker-components

[![CI](https://img.shields.io/github/workflow/status/dai-shi/react-worker-components/CI)](https://github.com/dai-shi/react-worker-components/actions?query=workflow%3ACI)
[![npm](https://img.shields.io/npm/v/react-worker-components)](https://www.npmjs.com/package/react-worker-components)
[![size](https://img.shields.io/bundlephobia/minzip/react-worker-components)](https://bundlephobia.com/result?p=react-worker-components)
[![discord](https://img.shields.io/discord/627656437971288081)](https://discord.gg/MrQdmzd)

React Worker Components simplify using Web Workers

## Introduction

This is an experimental project inspired by
[React Server Component](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html).

I've been developing several libraries to interact with Web Workers.

*   [react-hooks-worker](https://github.com/dai-shi/react-hooks-worker)
*   [redux-in-worker](https://github.com/dai-shi/redux-in-worker)
*   [react-suspense-worker](https://github.com/dai-shi/react-suspense-worker)

While they provide various interfaces with good abstraction,
RSC style would be another approach which is useful for Web Workers.

RWC is a library to provide RSC-like interface for Web Workers.
It serializes React elements keeping their referential identities
as much as possible.
If a React component is "registered", it will be referenced by string names,
and it can be used at the both ends.

Project Status: Experimental but basic examples are working. Welcome to try realistic examples.

## Install

```bash
npm install react-worker-components
```

## Usage

### `TextBox.js`

This is a component that can be used in the RWC tree.
`register` is important to enable serialization.

```js
import React, { useState } from 'react';

import { register } from 'react-worker-components';

export const TextBox = () => {
  const [text, setText] = useState('');
  return (
    <div>
      <span>Text: {text}</span>
      <input value={text} onChange={(event) => setText(event.target.value)} />
    </div>
  );
};

register(TextBox, 'TextBox');
```

### `Hello.worker.js`

This is a component that runs only on web workers.
`expose` is necessary to communicate with the main thread.

```js
import React from 'react';

import { expose } from 'react-worker-components';

import { TextBox } from './TextBox';

const fib = (i) => (i <= 1 ? i : fib(i - 1) + fib(i - 2));

const Hello = ({ count, children }) => {
  const fibNum = fib(count);
  return (
    <div>
      <div>Hello from worker: {fibNum}</div>
      <h1>Main TextBox</h1>
      {children}
      <h1>Worker TextBox</h1>
      <TextBox />
    </div>
  );
};

expose(Hello);
```

### `App.js`

This is the entry point component in the main thread.
`wrap` is to communicate with the worker thread.

```js
import React, { Suspense, useState } from 'react';

import { wrap } from 'react-worker-components';

import { TextBox } from './TextBox';

const Hello = wrap(() => new Worker(new URL('./Hello.worker', import.meta.url)));

export const App = () => {
  const [count, setCount] = useState(1);
  return (
    <div>
      <span>Count: {count}</span>
      <button type="button" onClick={() => setCount(count + 1)}>+1</button>
      <button type="button" onClick={() => setCount((c) => c - 1)}>-1</button>
      <Suspense fallback="Loading...">
        <Hello count={count}>
          <TextBox />
        </Hello>
      </Suspense>
    </div>
  );
};
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### expose

Expose a React function component from web workers.

#### Parameters

*   `Component` **React.FC\<Props>** 
*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 

#### Examples

```javascript
// foo.worker.js
import { expose } from 'react-worker-components';

const Foo = () => {
  return <h1>Foo</h1>;
};

expose(Foo);
```

### register

Register a component with a string name

This allows serializing components between main and worker threads.

#### Parameters

*   `component` **AnyComponent** 
*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 

#### Examples

```javascript
import { register } from 'react-worker-components';

const Counter = () => {
  const [count, setCount] = useState(0);
  return <div>{count}<button onClick={() => setCount(1)}>1</button></div>;
};

register(Counter, 'Counter');
```

### wrap

Wrap an exposed component in main thread

This will connect the component in the worker thread.
Requires Suspense.

It will create a dedicated worker for each createWorker function reference.

#### Parameters

*   `createWorker` **any** 
*   `key` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)?** 

#### Examples

```javascript
import { wrap } from 'react-worker-components';

const Foo = wrap(() => new Worker(new URL('./Foo.worker', import.meta.url)));
```

## Examples

The [examples](examples) folder contains working examples.
You can run one of them with

```bash
PORT=8080 npm run examples:01_minimal
```

and open <http://localhost:8080> in your web browser.
