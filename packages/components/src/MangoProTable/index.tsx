import {
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { Table, Space, Button, Typography, Alert, Spin, Empty, App } from 'antd'
import dayjs from 'dayjs'
import { matchLabel, parseDate, getLabel } from '@mango-kit/utils'
import { isFunction, isArray, isString } from 'lodash-es'

import Status from './components/Status'
import SearchForm from './components/SearchForm'

import type {
  SearchFormConfigListType,
  SearchFormValueType,
  SearchOptionsType,
} from './components/SearchForm'
import type { NavigateFunction } from 'react-router-dom'
import type { AlertProps } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

export type ValueType = 'text' | 'date' | 'dateTime' | 'status' | 'map'

export type ValueEnum =
  | {
      label: string
      value: string | number
      color: string
      [key: string]: any
    }[]
  | string
  | ((searchOptionsData: any) => {
      label: string
      value: string | number
      color: string
      [key: string]: any
    }[])

export type ColumnsType = {
  title: string
  dataIndex: string
  align?: string
  width?: number | string
  ellipsis?: boolean
  copyable?: boolean
  render?: (text: any, record: any, index: number) => ReactNode
  valueType?: ValueType
  valueEnum?: ValueEnum
}[]

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

export type MangoProTableProps = {
  pageType: 'table' | 'card'
  pageTips?: AlertProps
  searchFormConfigList?: SearchFormConfigListType
  toolBarRender?: () => ReactNode
  columns?: ColumnsType
  columnActions?: ColumnActionsType
  rowKey?: string
  request: {
    getSearchOptions?: {
      api: (
        searchData?: Record<string, any>,
      ) => Promise<{ success: boolean; data: any }>
      appendParams?: Record<string, any>
    }
    getList: {
      api: (queryData: Record<string, any>) => Promise<{
        success: boolean
        data: {
          list: any[]
          total: number
        }
      }>
      appendParams?: Record<string, any>
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

const getInitSearchFormValue = (list: any[] | undefined) => {
  const obj: Record<string, any> = {}

  list?.forEach((r) => {
    r &&
      Array.isArray(r) &&
      r?.forEach((c: any) => {
        obj[c.name] = c.initialValue
      })
  })
  return obj
}

const renderText = (
  text: any,
  ellipsis: boolean,
  copyable: boolean,
  valueType: ValueType,
  valueEnum: ValueEnum,
  searchOptionsData: any,
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
    valueEnumData = valueEnum(searchOptionsData)
  } else if (isArray(valueEnum)) {
    valueEnumData = valueEnum
  } else if (isString(valueEnum)) {
    valueEnumData = searchOptionsData?.[valueEnum] ?? []
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

export const MangoProTable = forwardRef<
  MangoProTableHandle,
  MangoProTableProps
>((props, ref) => {
  const {
    pageType = 'table',
    pageTips,
    searchFormConfigList,
    toolBarRender,
    columns,
    columnActions,
    rowKey = 'id',
    request,
    wrapTableContainer = false,
    renderSearchForm,
    renderTablePrefix,
    renderTableItem,
    renderTableSuffix,
    renderEmpty,
  } = props
  const navigate = useNavigate()
  const { modal, message, notification } = App.useApp()

  const [searchOptions, setSearchOptions] = useState<SearchOptionsType>({
    data: [],
    already: false,
  })

  const [tablePagination, setTablePagination] = useState<TablePaginationType>({
    page: 1,
    pageSize: 5,
  })

  const [tableData, setTableData] = useState<{
    list: any[]
    total: number
    already: boolean
  }>({
    list: [],
    total: 0,
    already: false,
  })

  const [tableLoading, setTableLoading] = useState<boolean>(false)

  const initSearchFormValue = useMemo(() => {
    return getInitSearchFormValue(searchFormConfigList ?? undefined)
  }, [searchFormConfigList])

  const [searchFormValue, setSearchFormValue] =
    useState<SearchFormValueType>(initSearchFormValue)

  const handleSearchFormSubmit = (
    values: SearchFormValueType,
    triggerRequest: boolean,
  ) => {
    setSearchFormValue(() => values)
    if (triggerRequest) {
      const newTb = { ...tablePagination, page: 1 }
      setTablePagination(() => ({ ...newTb }))
      getList(values, newTb)
    }
  }

  const getSearchOptions = async () => {
    if (request?.getSearchOptions && request?.getSearchOptions?.api) {
      const { success, data } = await request.getSearchOptions.api({
        ...(request?.getSearchOptions?.appendParams ?? {}),
      })
      if (success && data) {
        setSearchOptions(() => ({ data, already: true }))
      }
    }
  }

  const getList = async (
    _searchFormValue: SearchFormValueType,
    _tablePagination?: TablePaginationType,
  ) => {
    setTableLoading(true)

    let delivery: Record<string, any> = {}
    Object.entries({
      ..._searchFormValue,
      ...(_tablePagination ?? {}),
    }).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          if (value.every((v) => dayjs.isDayjs(v))) {
            delivery[key] = [value[0].valueOf(), value[1].valueOf()]
          }
        } else {
          delivery[key] = value
        }
      }
    })

    if (request?.getList?.appendParams) {
      delivery = { ...delivery, ...request?.getList?.appendParams }
    }

    if (request?.getList?.api) {
      const {
        data: { list = [], total = 0 },
        success = true,
      } = await request.getList.api(delivery)
      setTableLoading(false)
      if (success) {
        setTableData(() => ({ list, total, already: true }))
      } else {
        setTableData(() => ({ list: [], total: 0, already: true }))
      }
    }
  }

  useEffect(() => {
    getSearchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (pageType === 'table') {
      if (request?.getSearchOptions) {
        searchOptions.already && getList(searchFormValue, tablePagination)
      } else {
        getList(searchFormValue, tablePagination)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions])

  const renderOperationGroup = (record: any) => {
    const { list, showAliasConfig } = columnActions as ColumnActionsType
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
      <Space className="mango-pro-table-column-actions" size="large">
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

  const _columns: any =
    pageType === 'table'
      ? [
          ...(columns?.map((it: any) => {
            const {
              title,
              dataIndex,
              align = 'left',
              width,
              ellipsis = false,
              copyable = false,
              fixed,
              render,
              valueType = 'text',
              valueEnum,
            } = it

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
                      searchOptions?.data,
                    ),
            }
          }) ?? []),
          columnActions
            ? {
                title: '操作',
                key: 'operation',
                width: columnActions.width,
                fixed: 'right',
                align: 'left',
                render: (text: any, record: any) =>
                  renderOperationGroup(record),
              }
            : undefined,
        ].filter(Boolean)
      : []

  const paginationConfig = {
    current: tablePagination.page,
    pageSize: tablePagination.pageSize,
    defaultPageSize: 5,
    total: tableData.total,
    pageSizeOptions: ['5', '8', '10', '15', '20'],
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      const newTb = { page, pageSize }
      setTablePagination(() => ({ ...newTb }))
      getList(searchFormValue, newTb)
    },
  }

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      if (pageType === 'table') {
        return await getList(searchFormValue, tablePagination)
      } else {
        return await getList(searchFormValue)
      }
    },
    modal,
    message,
    notification,
  }))

  if (pageType === 'table') {
    return (
      <div
        className={cx(
          'mango-pro-table-container',
          'mango-pro-table-table-theme',
        )}
      >
        {pageType === 'table' && (
          <>
            {(pageTips || searchFormConfigList) && (
              <div className="mango-pro-table-form-container">
                {pageTips && (
                  <Alert
                    className="mango-pro-table-tips-container"
                    {...pageTips}
                  />
                )}

                {searchFormConfigList && (
                  <div className="mango-pro-table-search-container">
                    {searchOptions.already && (
                      <SearchForm
                        initSearchFormValue={initSearchFormValue}
                        searchFormConfigList={searchFormConfigList}
                        searchOptions={searchOptions}
                        onSubmit={handleSearchFormSubmit}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="mango-pro-table-table-container">
              {toolBarRender && (
                <div className="mango-pro-table-toolbar-container">
                  {toolBarRender()}
                </div>
              )}
              <Table
                columns={_columns}
                dataSource={tableData?.list}
                loading={tableLoading}
                pagination={{ ...paginationConfig }}
                rowKey={(row: any) => row[rowKey]}
                scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
              />
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={cx('mango-pro-table-container', 'mango-pro-table-card-theme')}
    >
      <div className="mango-pro-table-form-container">
        {renderSearchForm &&
          renderSearchForm({
            tableData,
            getList: (s: any) => getList(s),
          })}
      </div>

      {renderTablePrefix &&
        renderTablePrefix({
          tableData,
          getList: (s: any) => getList(s),
        })}

      <div
        className={cx('page-table-container', {
          'mango-pro-table-wrap-table-container': wrapTableContainer,
        })}
      >
        <Spin
          spinning={tableLoading}
          wrapperClassName="mango-pro-table-table-loading-container"
        >
          {tableData?.already ? (
            <>
              {tableData?.list?.length > 0 ? (
                <div className="mango-pro-table-content">
                  {tableData?.list?.map((i) => {
                    return renderTableItem && renderTableItem(i)
                  })}
                </div>
              ) : (
                <div className="mango-pro-table-empty-table-content">
                  {renderEmpty ? (
                    renderEmpty()
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
              )}
            </>
          ) : null}
        </Spin>
      </div>

      {renderTableSuffix &&
        renderTableSuffix({
          tableData,
          getList: (s: any) => getList(s),
        })}
    </div>
  )
})
