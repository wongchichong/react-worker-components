import React, { useContext, useEffect, useState } from 'react'

import { register } from 'react-worker-components'
import { Context } from './Context'

console.log('textbox')
export const TextBox = () => {
    const [text, setText] = useState('')
    const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
    const [ui, setUi] = useState<JSX.Element>(<>Loading</>)
    const context = useContext(Context)

    useEffect(() => {
        setTimeout(() => {
            setUi(<div>
                <div>isWorker: {isWorker + ''}</div>
                <div>Context: {context}</div>
                <br />
                <span>Text: {text.split('').join('.')}</span>
                <input value={text} onChange={(event) => {
                    // console.log(window, document)
                    setText(event.target.value)
                }} />
            </div>)
        }, 3000)
    }, [])
    return ui
}

register(TextBox, 'TextBox')
