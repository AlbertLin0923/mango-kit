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
import { matchLabel, parseDate } from '@mango-kit/utils'

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

export type ValueType = 'text' | 'date' | 'dateTime'

export type ColumnsType = {
  title: string
  dataIndex: string
  align?: string
  width?: number | string
  ellipsis?: boolean
  copyable?: boolean
  render?: (text: any, record: any, index: number) => ReactNode
  valueType?: string
  valueEnum?: {
    label: string
    value: string | number
    color: string
    [key: string]: any
  }[]
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
  pageNum: number
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
      api: (data?: any) => Promise<any>
      appendParams?: Record<string, any>
    }
    getList: {
      api: (data: any) => Promise<any>
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
  ellipsis: any,
  copyable: any,
  valueType: string,
  valueEnum: {
    label: string
    value: string | number
    color: string
    [key: string]: any
  }[],
) => {
  if (valueEnum) {
    return <Status map={valueEnum} value={text} />
  }

  if (valueType === 'date') {
    return parseDate(text, 'YYYY-MM-DD')
  }

  if (valueType === 'dateTime') {
    return parseDate(text)
  }

  if (!ellipsis && !copyable) {
    return text
  } else {
    return (
      <Typography.Text
        copyable={copyable}
        ellipsis={ellipsis ? { tooltip: text } : false}
      >
        {text}
      </Typography.Text>
    )
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
    already: false,
    data: [],
  })

  const [tablePagination, setTablePagination] = useState<TablePaginationType>({
    pageSize: 5,
    pageNum: 1,
  })

  const [tableData, setTableData] = useState<{
    rows: any[]
    total: number
    already: boolean
  }>({
    rows: [],
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
      const newTb = { ...tablePagination, pageNum: 1 }
      setTablePagination(() => ({ ...newTb }))
      getList(values, newTb)
    }
  }

  const getSearchOptions = async () => {
    if (request?.getSearchOptions && request?.getSearchOptions?.api) {
      const { code, data } = await request.getSearchOptions.api({
        ...(request?.getSearchOptions?.appendParams ?? {}),
      })
      if (code === 200 && data) {
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
      const { rows = [], total = 0 } = await request.getList.api(delivery)

      console.log(await request.getList.api(delivery))
      setTableLoading(false)
      setTableData(() => ({ rows, total, already: true }))
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
              render: render
                ? render
                : (text: any) =>
                    renderText(text, ellipsis, copyable, valueType, valueEnum),
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
    current: tablePagination.pageNum,
    pageSize: tablePagination.pageSize,
    defaultPageSize: 5,
    total: tableData.total,
    pageSizeOptions: ['5', '8', '10', '15', '20'],
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (pageNum: number, pageSize: number) => {
      const newTb = { pageNum, pageSize }
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
                dataSource={tableData.rows}
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
              {tableData?.rows?.length > 0 ? (
                <div className="mango-pro-table-content">
                  {tableData?.rows?.map((i) => {
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
