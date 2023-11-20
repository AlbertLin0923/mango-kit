import { Space, Button, Typography } from 'antd'
import { matchLabel, parseDate, getLabel } from '@mango-kit/utils'
import { isFunction, isArray, isString } from 'lodash-es'

import Status from './components/Status'

import type { NavigateFunction } from 'react-router-dom'
import type { MangoProTableProps, ValueType, ValueEnum } from './type'

const renderText = (
  text: any,
  ellipsis: boolean,
  copyable: boolean,
  valueType: ValueType,
  valueEnum: ValueEnum,
  queryFormOptionData: any,
) => {
  const wrapperText = (_text: ReactNode) => {
    if (!ellipsis && !copyable) {
      return _text
    } else {
      return (
        <Typography.Text
          copyable={copyable}
          ellipsis={ellipsis ? { tooltip: _text } : false}
        >
          {_text}
        </Typography.Text>
      )
    }
  }

  let valueEnumData: {
    label: string
    value: string | number
    color: string
    [key: string]: any
  }[] = []

  if (isFunction(valueEnum)) {
    valueEnumData = valueEnum(queryFormOptionData)
  } else if (isArray(valueEnum)) {
    valueEnumData = valueEnum
  } else if (isString(valueEnum)) {
    valueEnumData = queryFormOptionData?.[valueEnum] ?? []
  } else {
    valueEnumData = []
  }

  switch (valueType) {
    case 'status':
      return wrapperText(<Status map={valueEnumData} value={text} />)
    case 'map':
      return wrapperText(getLabel(text, valueEnumData))
    case 'date':
      return wrapperText(parseDate(text, 'YYYY-MM-DD'))
    case 'dateTime':
      return wrapperText(parseDate(text))
    default:
      return wrapperText(text)
  }
}

const renderOperationGroup = (
  record: any,
  columnActions: MangoProTableProps['columnActions'],
  navigate: NavigateFunction,
) => {
  const { list = [], showAliasConfig = false } = columnActions ?? {}
  let _columnActions = []
  if (showAliasConfig) {
    const { key, map } = showAliasConfig
    _columnActions = list?.filter((it) =>
      !it?.show ? true : matchLabel(record[key], map, it?.show as string[]),
    )
  } else {
    _columnActions = list?.filter((it) =>
      !it?.show ? true : (it.show as any)(record),
    )
  }

  return _columnActions?.length ? (
    <Space className="mango-pro-table-table-column-actions" size="large">
      {_columnActions?.map((i: any) => (
        <Button
          key={i.title}
          size="middle"
          type="link"
          onClick={() => i.action(record, navigate)}
        >
          {i.title}
        </Button>
      ))}
    </Space>
  ) : null
}

export const renderTableColumns = (
  columns: MangoProTableProps['columns'],
  columnActions: MangoProTableProps['columnActions'],
  queryFormOptionData: Record<string, any>,
  navigate: NavigateFunction,
) => {
  return [
    ...(columns?.map(
      ({
        title,
        dataIndex,
        align = 'left',
        width,
        ellipsis = false,
        copyable = false,
        fixed,
        render,
        valueType = 'text',
        valueEnum = [],
        ...rest
      }) => {
        return {
          key: dataIndex,
          title,
          dataIndex,
          align,
          width,
          ellipsis,
          fixed,
          render: render
            ? render
            : (text: any) =>
                renderText(
                  text,
                  ellipsis,
                  copyable,
                  valueType,
                  valueEnum,
                  queryFormOptionData,
                ),
          ...rest,
        }
      },
    ) ?? []),
    columnActions
      ? {
          title: '操作',
          key: 'operation',
          width: columnActions.width,
          fixed: 'right',
          align: 'left',
          render: (text: any, record: any) =>
            renderOperationGroup(record, columnActions, navigate),
        }
      : undefined,
  ].filter(Boolean)
}
