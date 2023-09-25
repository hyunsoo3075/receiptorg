import { createProdDataset } from "../../services/common.services";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart } from '@mui/x-charts/LineChart';
import { alignProperty } from "@mui/material/styles/cssUtils";
const currencySort = (a, b) => Number(a.replace(/[^0-9.-]+/g,""))-Number(b.replace(/[^0-9.-]+/g,""));
function Products(props) {
  useEffect(() => {
    fetch('/content/receipts.json')
      .then(response => response.json())
      .then(data => createProdDataset(data))
      .then(prodData => setprodData(prodData));
  }, []);

  const columns = [
    {
      field: 'Item',
      headerName: 'Product Name',
      width: 130
    },
    {
      field: 'ItemPrice',
      headerName: 'Price',
      width: 150,
      editable: true,
      sortComparator: currencySort
    },
    {
      field: 'AmountSold',
      headerName: 'Amount Sold',
      width: 160,
    },
    {
      field: 'ProdGross',
      headerName: 'Product Gross',
      width: 160,
      sortComparator: currencySort
    },
    {
      field: 'TimesSold',
      headerName: 'Times Sold',
      width: 160,
    }

  ];
  const [prodData, setprodData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [xAxis, setxAxis] = useState([]);
  const [yAxis, setyAxis] = useState([]);
  
  const valueFormatter = (date) =>
    date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
    });
  const xAxisCommon = {
    data: xAxis,
    scaleType: 'time',
    valueFormatter,
  };

  
  function handleRowClick(param) {
    var index = prodData.map(function (item) { return item.Item; }).indexOf(param.row.Item);
    if (index != -1) {
      let xHead = prodData[index].SoldHistory.map(function (soldHis) { return new Date(soldHis.DateSold.getYear(), soldHis.DateSold.getMonth(), soldHis.DateSold.getDay()) })
      let yHead = prodData[index].SoldHistory.map(function (soldHis) { return Number(soldHis.QuantitySoldPerDate) })
      if (xHead && yHead) {
        setxAxis(xHead);
        setyAxis(yHead);
        setShowChart(true);
      }
    }
    else {
      console.log('error at handlerow');
    }
  }

  return (
    <Box sx={{ height: '100%', width: '700px', margin: 'auto' }}>
      <div className="graphContainer" style={{ display: 'block', maxHeight: '300px', width: '700px', margin: 'auto' }}>
        {showChart ? <LineChart
          alignItems="center"
          justifyContent="center"
          xAxis={[{
            ...xAxisCommon,
            tickMinStep: 3600 * 1000 * 24,
          }]}
          series={[
            {
              data: yAxis,
            },
          ]}
          width={500}
          height={300}

        /> : <p>Click on any product to see its purchase trend</p>}

      </div>
      <DataGrid
        rows={prodData}
        onRowClick={handleRowClick} {...prodData}
        getRowId={(row) => row.Item}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection={false}

      />
    </Box>
  );
}

export default Products;
