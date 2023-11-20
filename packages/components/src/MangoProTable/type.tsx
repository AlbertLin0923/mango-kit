import type { NavigateFunction } from 'react-router-dom'
import type { AlertProps, SelectProps } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'
import type { InputProps, FormItemProps } from 'antd'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'
import type { ColumnType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'

type InputFieldType = {
  name: string
  type: 'input'
  label?: string
  placeholder?: string
  initialValue?: string | number
  maxLength?: number
  immediate?: boolean
  extraRawFieldProps?: Omit<InputProps, 'placeholder' | 'maxLength'>
  extraFormFieldProps?: Omit<
    FormItemProps,
    'name' | 'label' | 'placeholder' | 'initialValue'
  >
}

type SelectFieldType = {
  name: string
  type: 'select'
  optionFilter:
    | string
    | ((data: any) => { label: string; value: string | number }[])
  label?: string
  placeholder?: string
  initialValue?: string | number
  immediate?: boolean
  extraRawFieldProps?: Omit<SelectProps, 'placeholder' | 'options'>
  extraFormFieldProps?: Omit<
    FormItemProps,
    'name' | 'label' | 'placeholder' | 'initialValue'
  >
}

type DatePickerFieldType = {
  name: string
  type: 'date-picker'
  picker: DatePickerProps['picker']
  label?: string
  initialValue?: Dayjs[]
  immediate?: boolean
  extraRawFieldProps?: DatePickerProps
  extraFormFieldProps?: Omit<
    FormItemProps,
    'name' | 'label' | 'placeholder' | 'initialValue'
  >
}

type DateRangePickerFieldType = {
  name: string
  type: 'date-range-picker'
  picker: RangePickerProps['picker']
  label?: string
  initialValue?: Dayjs[]
  immediate?: boolean
  extraRawFieldProps?: RangePickerProps
  extraFormFieldProps?: Omit<
    FormItemProps,
    'name' | 'label' | 'placeholder' | 'initialValue'
  >
}

type RadioFieldType = {
  name: string
  type: 'radio'
  optionFilter:
    | string
    | ((data: any) => { label: string; value: string | number }[])
  label?: string
  placeholder?: string
  initialValue?: string | number
  immediate?: boolean
  extraRawFieldProps?: Record<string, any>
  extraFormFieldProps?: Omit<
    FormItemProps,
    'name' | 'label' | 'placeholder' | 'initialValue'
  >
}

type TextFieldType = {
  name: string
  type: 'text'
  label?: string
  initialValue?: string | number
  immediate?: boolean
  extraRawFieldProps?: Record<string, any>
  extraFormFieldProps?: Omit<
    FormItemProps,
    'name' | 'label' | 'placeholder' | 'initialValue'
  >
}

type QueryFormFieldType =
  | InputFieldType
  | SelectFieldType
  | SelectFieldType
  | DatePickerFieldType
  | DateRangePickerFieldType
  | RadioFieldType
  | TextFieldType

export type QueryFormFieldsType = QueryFormFieldType[][]

// ----------------------------------------------------------------

export type ValueType = 'text' | 'date' | 'dateTime' | 'status' | 'map'

export type ValueEnum =
  | {
      label: string
      value: string | number
      color: string
      [key: string]: any
    }[]
  | string
  | ((queryFormOptionData: any) => {
      label: string
      value: string | number
      color: string
      [key: string]: any
    }[])

export type ColumnsType = ({
  title: string
  dataIndex: string
  align?: string
  width?: number | string
  ellipsis?: boolean
  copyable?: boolean
  fixed?: boolean | string
  render?: (text: any, record: any, index: number) => ReactNode
  valueType?: ValueType
  valueEnum?: ValueEnum
} & ColumnType<Record<string, any>>)[]

export type ColumnActionsType = {
  width?: string | number
  list: {
    show?: string[] | ((record: any) => boolean)
    title: string
    action: (record: any, navigate: NavigateFunction) => void
  }[]
  showAliasConfig?: {
    key: string
    map: {
      label: string
      value: string | number
      [key: string]: any
    }[]
  }
}

export type TablePaginationType = {
  page: number
  pageSize: number
}

export type QueryFormValuesType = Record<string, any>

export type AppendParamsType = Record<string, any> | undefined

export type MangoProTableProps = {
  pageType: 'table' | 'card'
  pageTips?: AlertProps
  queryFormFields?: QueryFormFieldsType
  toolBarRender?: () => ReactNode
  columns?: ColumnsType
  columnActions?: ColumnActionsType
  rowKey?: string
  request: {
    getQuery?: {
      api: (
        queryFormOptionData?: Record<string, any>,
      ) => Promise<{ success: boolean; data: any }>
      appendParams?: AppendParamsType
    }
    getList: {
      api: (
        query: Partial<
          QueryFormValuesType & TablePaginationType & AppendParamsType
        >,
      ) => Promise<{
        success: boolean
        data: {
          list: any[]
          total: number
        }
      }>
      appendParams?: AppendParamsType
    }
  }
  wrapTableContainer?: boolean
  renderSearchForm?: ({
    tableData,
    getList,
  }: {
    tableData: any
    getList: (data: any) => Promise<any>
  }) => ReactNode

  renderTablePrefix?: ({
    tableData,
    getList,
  }: {
    tableData: any
    getList: (data: any) => Promise<any>
  }) => ReactNode
  renderTableItem?: (i: any) => ReactNode
  renderTableSuffix?: ({
    tableData,
    getList,
  }: {
    tableData: any
    getList: (data: any) => Promise<any>
  }) => ReactNode
  renderEmpty?: () => ReactNode
}

export type MangoProTableHandle = {
  refresh: () => Promise<any>
  message: MessageInstance
  modal: Omit<ModalStaticFunctions, 'warn'>
  notification: NotificationInstance
}
