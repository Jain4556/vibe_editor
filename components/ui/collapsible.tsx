"use client"

import * as React from "react"

function Collapsible({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

function CollapsibleTrigger({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return <button onClick={onClick}>{children}</button>
}

function CollapsibleContent({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }