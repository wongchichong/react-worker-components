import React, { ReactNode, useContext, useMemo } from 'react'

import { expose } from 'react-worker-components'
import { Label } from './Label'

import { TextBox } from './TextBox'

const fib = (i: number): number => (i <= 1 ? i : fib(i - 1) + fib(i - 2))

export type Props = {
    count: number
    children: ReactNode | ReactNode[]
}

const Hello: React.FC<Props> = ({ count, children }) => {
    const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope

    const fibNum = fib(count)
    return <div /* onClick={e => console.log("worker clicked")} */>
        <Label label="LABEL" />
        <div>Fibo: {fibNum}</div>
        <h1>Worker TextBox isWorker: {isWorker + ''}</h1>

        <TextBox />

        {children}

    </div>
}

expose(Hello)
