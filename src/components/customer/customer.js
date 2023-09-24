import { getCustHist } from "../../services/common.services";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import { Collapse } from '@mui/material';
import Button from '@mui/material/Button';
import { getProductDets } from '../../services/common.services';
import { Link } from 'react-router-dom';
function NestedRow(props) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const { nestedRow } = props;
    const [openModal, setOpenModal] = useState(false);
    const [totalSold, setTotalSold] = useState(0);
    const [gross, setTotalgross] = useState('');
    const handleClose = () => setOpenModal(false);
    function onItemClick(event, item) {
        let respObj = getProductDets(props.receipts, item)
        setTotalSold(respObj.prodTotSold);
        setTotalgross(respObj.totalGross);
        setOpenModal(true);

    }

    return (
        <React.Fragment>
            <TableRow key={nestedRow.key}>
                <TableCell scope="row">
                    <Button onClick={(e) => {
                        onItemClick(e, nestedRow.Item);
                    }}>{nestedRow.Item}</Button>
                </TableCell>
                <TableCell>{nestedRow.ItemPrice}</TableCell>
                <TableCell align="right">{nestedRow.Quantity}</TableCell>
            </TableRow>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {nestedRow.Item} details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Cost: {nestedRow.ItemPrice}<br />
                        You have sold the {nestedRow.Item.toLowerCase()} {totalSold} times.<br />
                        At a gross of {gross}.
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>);

}
function Row(props) {
    //each row has to be a component to have its own useState to open one at a time
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.OrderId}
                </TableCell>
                <TableCell align="right">{row.CustomerId}</TableCell>
                <TableCell align="right">{row.CustomerName}</TableCell>
                <TableCell align="right">{row.Total}</TableCell>
                <TableCell align="right">{row.Date}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Items
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell>ItemPrice</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.Items.map((itemRow, index) => (
                                        <NestedRow nestedRow={itemRow} key={index} receipts={props.receipts}></NestedRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
function Customer(props) {
    const { id } = useParams();
    const [custData, setCustData] = useState({
        custHis: [],
        custName: '',
    });
    useEffect(() => {
        if (id != undefined) {
            fetch('/content/receipts.json')
                .then(response => response.json())
                .then(data => getCustHist(id, data))
                .then(prodData => setCustData({custHis:prodData, custName: prodData[0].CustomerName}))
                
        }
    }, []);

    return (
        <Box sx={{ height: '100%', width: '700px', margin: 'auto' }}>
            <p>{custData.custName}'s past orders</p>
            <TableContainer component={Paper} sx={{ width: '100%', margin: 'auto' }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Receipt Id </TableCell>
                            <TableCell align="right">Customer Id</TableCell>
                            <TableCell align="right">Customer Name</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {custData.custHis.map((row, index) => (
                            <Row key={index} row={row} receipts={custData.custHis} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Customer;