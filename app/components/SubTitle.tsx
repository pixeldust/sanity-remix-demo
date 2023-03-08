import React from 'react'
import type {PropsWithChildren} from 'react'

export default function SubTitle(props: PropsWithChildren) {
  return props.children ? (
    <span className="block text-bold max-w-4xl text-xl font-bold tracking-tighter text-red-700 md:text-2xl">
      {props.children}
    </span>
  ) : null
}
