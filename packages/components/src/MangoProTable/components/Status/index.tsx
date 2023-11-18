import { getLabel, getColor } from '@mango-kit/utils'

type StatusProps = {
  value: string | number
  map: {
    label: string
    value: number | string
    color: string
    [key: string]: any
  }[]
}

const Status: FC<StatusProps> = ({ value, map }) => {
  return (
    <div className={`mango-status-node`}>
      <span
        className={`mango-status-dot`}
        style={{ backgroundColor: getColor(value, map) }}
      />
      <span className={`mango-status-node-text`}>{getLabel(value, map)}</span>
    </div>
  )
}

export default Status
