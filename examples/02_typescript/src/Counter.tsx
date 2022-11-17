import React, { Suspense, useContext, useMemo, useState } from 'react'

import { wrap } from 'react-worker-components'

import { TextBox } from './TextBox'
import { Label } from './Label'

import { Props as HelloProps } from './Hello.worker'
import { Context } from './Context'

const Hello = wrap<HelloProps>(() => new Worker(new URL('./Hello.worker', import.meta.url)))

console.log('Counter')
const Counter: React.FC = () => {
    const [count, setCount] = useState(1)
    const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
    const n = useMemo(() => Math.random() + '', [])

    return <div>
        {false ? null : <Label label="" />}

        <span>Count: {count}</span>
        <button type="button" onClick={() => {
            const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
            console.log("fibo clicked (isWorker): ", isWorker + '')
            setCount(count + 1)
        }}>+1</button>
        {/* <button type="button" onClick={() => setCount((c) => c - 1)}>-1</button> */}

        <br />
        isWorker: {isWorker + ''}
        <Suspense fallback="Loading...">
            <div>Context: {n}</div>

            <Context.Provider value={n}>
                <Hello count={count}>
                    Chilren
                    <br />

                    isWorker: {isWorker + ''}
                    <br />
                    <TextBox />
                </Hello>
            </Context.Provider>
        </Suspense>
    </div>
}

export default Counter
