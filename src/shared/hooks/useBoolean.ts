import { useCallback, useState } from 'react'
export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue((currentValue) => !currentValue), [])
  return { setValue, toggle, value }
}
