import { Table } from 'antd';

const AntTable = (props) =>{
  const {
    data,
    columns,
    expandedData,
    currentPage,
    handlePageChange,
    setLimit,
    setCurrentPage,
    isExpand,
    isPaginate,
  } = props;

  return (
    <Table
      size="small"
      dataSource={data?.data || []}
      columns={columns}
      pagination={
        isPaginate && {
          pageSize: data?.perPage || 5,
          total: data?.total || 0,
          current: currentPage,
          onChange: handlePageChange,
          showSizeChanger: false,
          pageSizeOptions: ['10', '25', '50', '100'],
          onShowSizeChange: (current, newSize) => {
            setLimit(newSize);
            setCurrentPage(currentPage);
          },
        }
      }
      expandable={
        isExpand && {
          rowExpandable: (record) => true,
          expandedRowRender: (record) => expandedData(record),
        }
      }
    />
  );
}

export default AntTable;