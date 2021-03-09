import React,{useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import {makeStyles } from '@material-ui/core/styles';
import { Button,Col,Form,Row } from 'react-bootstrap';
import { useState } from 'react';
import {GetPrescriptionBarcodeForActivationApi,
        ReActiveByPrescriptionIdApi} from '../../commonConstants/apiUrls';
import { Preloader, Oval } from 'react-preloader-icon';
import axios from 'axios';
import { toastConfig } from '../../Config';
import toast, { Toaster } from 'react-hot-toast';
import {TableRow,TableCell,Table,TableBody} from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';
import EnhancedTableHead from '../../component/UI/EnhancedTableHead';
import {CardComponent} from '../../component/UI/CardComponent'
const headRows = [
    { id: 'id', numeric: true, disablePadding: true, label: '#' },
    { id: 'title', numeric: false, disablePadding: true, label: 'کد جنریک' },
    { id: 'description', numeric: false, disablePadding: false, label: 'کدآیارسی' },
    { id: 'amount', numeric: false, disablePadding: false, label: 'تعداد' },
    { id: 'uid', numeric: false, disablePadding: false, label: 'یوآیدی' },
    { id: 'englishName', numeric: false, disablePadding: false, label: 'نام انگلیسی دارو' },
    { id: 'trackingCode', numeric: false, disablePadding: false, label: 'کد یکتا' },
    { id: 'status', numeric: false, disablePadding: false, label: 'نتیجه عملیات' },
    { id: 'statusMessage', numeric: false, disablePadding: false, label: 'نتیجه اکتیو سازی' },
  ];

  function createData(rowNumber, generalCode,irc,amount,uid,englishName,trackingCode,statusMessage ,prescriptionBarcodeStatusName  ) {
return { rowNumber,generalCode,irc,amount,uid,englishName ,trackingCode,statusMessage ,prescriptionBarcodeStatusName };
}

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      maxWidth:'2000px',
      marginTop: theme.spacing(3),
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    cell_short: {
      fontSize: "14px !important"
    }
    
  }));
function ModalDescription(props) {
    const classes = useStyles();
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [item,setItem]=useState();
    const [rows,setRows] = useState([]);
    const handleClose = () => {
        setShow(false);
    }
    const notifySuccess = ()=>toast('عملیات با موفقیت انجام گردید.',{duration:toastConfig.duration,style:toastConfig.successStyle});
    const notifyError = () => toast('خطا در ارتباط با سرور. اطلاعات بارگزاری نشد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    const notifyInfo = (title) => toast(title, { duration: toastConfig.duration, style: toastConfig.infoStyle });

    const activeList =() =>{
        axios.post(ReActiveByPrescriptionIdApi,{PrescriptionId:item.prescriptionId})
        .then((response)=>{
            notifyInfo(response.data.errorMessage);
            props.handleConfirmModal();
            setShow(false);
        }).catch((error)=>{
            notifyError();
        });
    }
    const handleShow = () => {
        setIsLoading(true);
        axios.post(GetPrescriptionBarcodeForActivationApi,{PrescriptionId:item.prescriptionId})
        .then((response)=>{
            var tmp =[];
            response.data.lstPrescriptionActivityRow.map((item,index)=>{
              tmp.push(createData(1,
                item.genericCode,
                item.irc,
                item.amount,
                item.uid,
                item.englishName,
                item.trackingCode,
                item.statusMessage,
                item.prescriptionBarcodeStatusName));
            });
            setRows(tmp);
            notifySuccess();
            setIsLoading(false);
        })
        setShow(true);
    };

    useEffect(()=>{
        if(props.row!=undefined){
            setItem(JSON.parse(props.row));
        }
    },props);

    
    return (
        <>

            <span onClick={handleShow} className='pointer label label-lg label-light-success label-inline btn-height'>{props.title}</span>

            <Modal dialogClassName="modal-90w"
                    show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span className='modal-header-desc'>{props.headerTitle} </span>
                        <span className='modal-header-desc'>{props.name}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='description-modal'>
                    <div className={classes.tableWrapper}>
                    <CardComponent>
            <Table
              className={classes.table + ' marg-t-10'}
              aria-labelledby="tableTitle"
              size='small'
            >
              <EnhancedTableHead
                rowCount={rows.length}
                headRows={headRows}
              />
              <TableBody>
                {rows.map((row, index) => {
                    console.log(row)
                    return (
                      <>
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.id}
                        >
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.rowNumber}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.generalCode}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.irc}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.amount}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.uid}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.englishName}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.trackingCode}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.statusMessage}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} padding="none" size='small' align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.prescriptionBarcodeStatusName}
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
              </TableBody>
            </Table>
            </CardComponent>
          </div>
                    </div>
                </Modal.Body>
                    <Row >
                        <Col md='4'></Col>
                        <Col md='4'>
                            <Button variant="primary" onClick={activeList}>
                                اکتیو کن همه اقلام بالا را
                            </Button>
                        </Col>
                    </Row>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        بستن
                    </Button>
                </Modal.Footer>
            </Modal>
 
        </>
    );
}
export default ModalDescription;