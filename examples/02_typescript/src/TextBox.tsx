import React, { useContext, useEffect, useState } from 'react'

import { register } from 'react-worker-components'
import { Context } from './Context'

console.log('textbox')
export const TextBox = () => {
    const [text, setText] = useState('')
    const [ui, setUi] = useState<JSX.Element>(<>Loading</>)
    const context = useContext(Context)

    useEffect(() => {
        setTimeout(() => {
            const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope

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
        }, 500)
    }, [text])
    return ui
}

register(TextBox, 'TextBox')
