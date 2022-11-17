import React from 'react'
import { register } from 'react-worker-components'

console.log('Label')
export const Label = (props: { label: string }) => <div>{props.label}</div>

register(Label, 'Label')
