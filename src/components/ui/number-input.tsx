"use client"

import { useState, useCallback, type ComponentProps } from "react"
import { Input } from "@/components/ui/input"

type NumberInputProps = Omit<ComponentProps<typeof Input>, "type" | "onChange" | "value"> & {
  value?: number | null
  onChange?: (value: number | null) => void
}

function formatNumber(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return ""
  return value.toLocaleString("id-ID")
}

function parseNumber(str: string): number | null {
  const cleaned = str.replace(/\./g, "").replace(/,/g, ".")
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(() => formatNumber(value))

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.,]/g, "")
      setDisplayValue(raw)
      const parsed = parseNumber(raw)
      if (onChange && parsed !== parseNumber(displayValue)) {
        onChange(parsed)
      }
    },
    [onChange, displayValue],
  )

  const handleBlur = useCallback(() => {
    const parsed = parseNumber(displayValue)
    setDisplayValue(formatNumber(parsed))
    if (onChange) {
      onChange(parsed)
    }
  }, [displayValue, onChange])

  return (
    <Input
      data-slot="input-group-control"
      inputMode="numeric"
      {...props}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}
