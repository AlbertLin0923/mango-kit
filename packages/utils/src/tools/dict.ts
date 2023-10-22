export const getLabel = (
  value: string | number,
  map: { label: string; value: number | string; [key: string]: any }[],
) => map.find((i) => i.value === value)?.label ?? ''

export const getColor = (
  value: string | number,
  map: {
    label: string
    value: number | string
    color: string
    [key: string]: any
  }[],
) => map.find((i) => i.value === value)?.color ?? ''

export const matchLabel = (
  value: string | number,
  map: { label: string; value: number | string; [key: string]: any }[],
  labelList: string[],
) => {
  return labelList.includes(getLabel(value, map))
}
