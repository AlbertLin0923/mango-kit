import { useState, useImperativeHandle, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { Table, Alert, Spin, Empty, App } from 'antd'

import QueryForm from './components/QueryForm'
import { renderTableColumns } from './renderTableColumns'

import type {
  TablePaginationType,
  MangoProTableProps,
  MangoProTableHandle,
  QueryFormValuesType,
} from './type'

export type { MangoProTableProps, MangoProTableHandle }

export const MangoProTable = forwardRef<
  MangoProTableHandle,
  MangoProTableProps
>((props, ref) => {
  const {
    pageType = 'table',
    pageTips,
    queryFormFields,
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

  const [queryFormData, setQueryFormData] = useState<{
    queryFormValues: Record<string, any>
    queryFormOptionData: Record<string, any>
  }>({ queryFormValues: {}, queryFormOptionData: {} })

  const handleQueryFormSubmit = (
    queryFormValues: Record<string, any>,
    queryFormOptionData: Record<string, any>,
    triggerRequest: boolean,
  ) => {
    setQueryFormData(() => ({
      queryFormValues,
      queryFormOptionData,
    }))
    if (triggerRequest) {
      const newTb = { ...tablePagination, page: 1 }
      setTablePagination(() => ({ ...newTb }))
      getList(queryFormValues, newTb)
    }
  }

  const getList = async (
    _queryFormValue: QueryFormValuesType,
    _tablePagination?: TablePaginationType,
  ) => {
    setTableLoading(true)

    if (request?.getList?.api) {
      const {
        data: { list = [], total = 0 },
        success = true,
      } = await request.getList.api({
        ..._queryFormValue,
        ..._tablePagination,
        ...request?.getList?.appendParams,
      })
      setTableLoading(false)
      if (success) {
        setTableData(() => ({ list, total, already: true }))
      } else {
        setTableData(() => ({ list: [], total: 0, already: true }))
      }
    }
  }

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
      getList(queryFormData?.queryFormValues, newTb)
    },
  }

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      if (pageType === 'table') {
        return await getList(queryFormData?.queryFormValues, tablePagination)
      } else if (pageType === 'card') {
        return await getList(queryFormData?.queryFormValues)
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
        {(pageTips || queryFormFields) && (
          <div className="mango-pro-table-query-container">
            {pageTips && (
              <Alert
                className="mango-pro-table-query-tips-container"
                {...pageTips}
              />
            )}

            {queryFormFields && (
              <div className="mango-pro-table-query-form-container">
                <QueryForm
                  queryFormFields={queryFormFields}
                  request={request}
                  onSubmit={handleQueryFormSubmit}
                />
              </div>
            )}
          </div>
        )}
        <div className="mango-pro-table-table-container">
          {toolBarRender && (
            <div className="mango-pro-table-table-toolbar-container">
              {toolBarRender()}
            </div>
          )}
          <Table
            className="mango-pro-table-table"
            columns={
              renderTableColumns(
                columns,
                columnActions,
                queryFormData?.queryFormOptionData,
                navigate,
              ) as any
            }
            dataSource={tableData?.list}
            loading={tableLoading}
            pagination={{ ...paginationConfig }}
            rowKey={(row: any) => row[rowKey]}
            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cx('mango-pro-table-container', 'mango-pro-table-card-theme')}
    >
      <div className="mango-pro-table-query-container">
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
        className={cx('mango-pro-table-table-container', {
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
