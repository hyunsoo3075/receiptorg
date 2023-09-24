import { getCustData } from "../../services/common.services";
import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';

const currencySort = (a, b) => Number(a.replace(/[^0-9.-]+/g, "")) - Number(b.replace(/[^0-9.-]+/g, ""));
function Customers(props) {
  const { id } = useParams();
  const columns = [
    {
      field: 'Name',
      headerName: 'Customer Name',
      width: 170
    },
    {
      field: 'CustomerId',
      headerName: 'Customer Id',
      width: 120,
      editable: true,
    },
    {
      field: 'totalSpent',
      headerName: 'Total Spent',
      width: 160,
      sortComparator: currencySort
    },
    {
      field: 'visitCount',
      headerName: 'Visit Count',
      width: 160,

    }

  ];
  const [prodData, setprodData] = useState([]);
  const [selectedCt, setSelectedCt] = useState(0);
  useEffect(() => {
    fetch('/content/receipts.json')
      .then(response => response.json())
      .then(data => getCustData(data))
      .then(prodData => setprodData(prodData));
  }, []);



  return (
    <Box sx={{ height: '100%', width: '700px', margin: 'auto' }}>
      <DataGrid
        rows={prodData}
        //onRowClick={handleRowClick} {...prodData}
        getRowId={(row) => row.CustomerId}
        sx={{
          "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
            display: "none"
          }
        }}
        columns={columns}
        isRowSelectable={(row) => selectedCt < 3}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setSelectedCt(newRowSelectionModel.length);
        }}
        pageSizeOptions={[5]}
        checkboxSelection={false}

      />
    </Box>
  );
}

export default Customers;