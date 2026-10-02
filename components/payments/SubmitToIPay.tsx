'use client'

import { useEffect, useRef } from 'react'

/** Sends the browser to iPay's checkout by submitting the signed form. */
export default function SubmitToIPay({ action, fields }: { action: string; fields: Record<string, string> }) {
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    formRef.current?.submit()
  }, [])
  return (
    <form ref={formRef} action={action} method="post">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <p className="text-gray-700">Taking you to iPay to pay…</p>
      <noscript>
        <button type="submit" className="mt-3 underline">Continue to iPay</button>
      </noscript>
    </form>
  )
}
