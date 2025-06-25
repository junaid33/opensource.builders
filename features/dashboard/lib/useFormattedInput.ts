import { useCallback, useState } from 'react'

type ParsedValue<Value> = { kind: 'parsed', value: Value }

type FormatConfig<Value> = {
  format: (props: { value: Value }) => string
  parse: (value: string) => ParsedValue<Value> | string
}

type InputConfig<Value> = {
  value: Value
  onChange: (value: Value) => void
  onBlur?: () => void
}

export function useFormattedInput<Value>(
  formatConfig: FormatConfig<Value>,
  inputConfig: InputConfig<Value>
) {
  const [internalValueState, setInternalValueState] = useState(() =>
    formatConfig.format({ value: inputConfig.value })
  )
  const [isFocused, setIsFocused] = useState(false)

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      const parsed = formatConfig.parse(value)
      setInternalValueState(value)
      if (typeof parsed !== 'string' && parsed.kind === 'parsed') {
        inputConfig.onChange(parsed.value)
      }
    },
    [formatConfig, inputConfig]
  )

  const onFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const onBlur = useCallback(() => {
    setIsFocused(false)
    inputConfig.onBlur?.()
    setInternalValueState(
      formatConfig.format({ value: inputConfig.value })
    )
  }, [formatConfig, inputConfig])

  const value = isFocused
    ? internalValueState
    : formatConfig.format({ value: inputConfig.value })

  return {
    onChange,
    onFocus,
    onBlur,
    value,
  }
} 