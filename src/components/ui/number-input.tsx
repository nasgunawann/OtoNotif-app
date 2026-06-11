"use client"

import { useState, useEffect, type ComponentProps } from "react"
import { InputGroupInput } from "@/components/ui/input-group"

type NumberInputProps = Omit<ComponentProps<typeof InputGroupInput>, "onChange" | "value"> & {
  value?: number | null
  onChange?: (value: number | null) => void
}

function formatNumber(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return ""
  return value.toLocaleString("id-ID")
}

export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(() => formatNumber(value))

  useEffect(() => {
    const formatted = formatNumber(value)
    if (formatted !== displayValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue(formatted)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9,]/g, "")
    const normalized = raw.replace(/,/g, ".")
    const parsed = parseFloat(normalized)

    if (isNaN(parsed) && raw !== "") return

    if (raw === "") {
      setDisplayValue("")
      onChange?.(null)
      return
    }

    const cursor = e.target.selectionStart ?? 0
    const prevLen = displayValue.length
    const formatted = parsed.toLocaleString("id-ID")

    setDisplayValue(formatted)
    onChange?.(parsed)

    const nextLen = formatted.length
    const newCursor = Math.min(cursor + (nextLen - prevLen), nextLen)
    requestAnimationFrame(() => {
      e.target.setSelectionRange(newCursor, newCursor)
    })
  }

  return (
    <InputGroupInput
      inputMode="numeric"
      {...props}
      value={displayValue}
      onChange={handleChange}
    />
  )
}
