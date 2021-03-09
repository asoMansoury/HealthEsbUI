import React from 'react';
import clsx from 'clsx';
import {makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tooltip  from '@material-ui/core/Tooltip';
import '../pulseDesignStyles/pulseDesignStyles.scss';
import { Form, Row, Col, Button,FormGroup } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { faIR } from '@material-ui/core/locale';
import {GetPrescriptionActivityApi} from '../commonConstants/apiUrls'
import ModalDescription from './Components/ModalDescription';
import { useEffect } from 'react';
import axios from 'axios';
import {CardComponent} from '../component/UI/CardComponent'
import { tableConfig } from '../Config';
import toast, { Toaster } from 'react-hot-toast';
import { toastConfig } from '../Config';
import EnhancedTableHead from '../component/UI/EnhancedTableHead';
import {DatePickerComponent} from '../component/DatePickerComponent/DatePickerComponent';
import moment from 'moment-jalaali';

function createData(rowNumber, patientNationalCode, patientGivenName, patientSurname, 
                  medicalCouncilNumber,physicianSurname,pharmacyGln,createdDate,status,
                  statusMessage,rowData) {
  var fullName = patientGivenName+' '+patientSurname;
  var rowItem = JSON.stringify(rowData);
  createdDate=moment(createdDate).format('jYYYY-jMM-jDD HH:mm:ss');
  return { rowNumber, patientNationalCode, fullName, medicalCouncilNumber, physicianSurname,pharmacyGln,createdDate,
          status,statusMessage,rowItem };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  { id: 'id', numeric: true, disablePadding: true, label: '#' },
  { id: 'title', numeric: false, disablePadding: true, label: 'کدملی' },
  { id: 'description', numeric: false, disablePadding: false, label: 'نام بیمار' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'کد نظام' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'نام پزشک' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'Gin داروخانه' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'تاریخ ثبت' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'کد' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'نتیجه' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'زمان پاسخ' },
  { id: 'createDate', numeric: false, disablePadding: false, label: 'عملیات' },
];

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
    fontSize: "12px !important"
  }
}));
const theme = createMuiTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#8950FC',
    },
    secondary: {
      main: '#8950FC',
    },
  },
}, faIR);


export function PrescriptionBarcodeDetailes(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(tableConfig.rowsPerPageDefault);
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [searchModel,setSearchModel] = React.useState({
    PatientNationalCode:'',
    PharmacyGln:'',
    MedicalCouncilNumber:'',
    UID:'',
    CreatedDate:'',
    TrackingCode:''
  })
  const setFakeData = (count) => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({ id: i });
    }
    setRows(temp);
  }

  const notifySuccess = ()=>toast('عملیات با موفقیت انجام گردید.',{duration:toastConfig.duration,style:toastConfig.successStyle});
  const notifyError = () => toast('خطا در ارتباط با سرور. اطلاعات بارگزاری نشد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });

  useEffect(() => {
    let paginationArrows = Array.from(document.getElementsByTagName('div')).find(x => x.className.includes('MuiTablePagination-actions'));
    paginationArrows.style.position = 'absolute';
  });
  useEffect(() => {
    setFakeData(tableConfig.rowsPerPageDefault);
    getSearchResult();
  }, []);
  useEffect(() => {
    if (props.Is_Edited || props.Is_Deleted_One || props.Is_Added) {
      getSearchResult();
      props.notEdited();
      props.notDeletedOne();
      props.notAdded();
      if (props.Is_Deleted_One)
        setSelected([]);
    }
    else if (props.Is_Deleted_Group) {
      setIsLoading(true);
      getSearchResult();
      props.notDeletedGroup();
      setPage(0);
      setSelected([]);
    }
  }, [props]);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleChangePage(event, newPage) {
    if (isLoading)
      return;
    setFakeData(count);
    setIsLoading(true);
    setPage(newPage);
    getSearchResult();
  }

  function handleChangeRowsPerPage(event) {
    if (isLoading)
      return;
    setFakeData(count);
    setIsLoading(true);
    setRowsPerPage(event.target.value);
    setPage(0);
    getSearchResult();
  }

  function getSearchModel(){
    var model = searchModel;
    var rules=[];
    if(model.PatientNationalCode!=='')
    {
      var obj = {
        field:'PatientNationalCode',
        op:11,
        data:model.PatientNationalCode
      }
      rules.push(obj);
    }
    if(model.PharmacyGln!=''){
      var obj = {
        field:"PharmacyGln",
        op:11,
        data:model.PharmacyGln
      }
      rules.push(obj);
    }
    if(model.MedicalCouncilNumber!=''){
      var obj = {
        field:"MedicalCouncilNumber",
        op:11,
        data:model.MedicalCouncilNumber
      }
      rules.push(obj);
    }
    if(model.CreatedDate!=''){
      var obj = {
        field:"CreatedDate",
        op:11,
        data:model.CreatedDate
      }
      rules.push(obj);
    }
    if(model.TrackingCode!=''){
      var obj = {
        field:"TrackingCode",
        op:11,
        data:model.TrackingCode
      }
      rules.push(obj);
    }
    if(model.UID!=''){
      var obj = {
        field:"Uid",
        op:11,
        data:model.UID
      }
      rules.push(obj);
    }
    var data = {
      groupOp:0,
      groups:null,
      rules:rules
    }
    return JSON.stringify(data);
  }
  function getSearchResult(){
    var model = getSearchModel();
    var data = {
      pageNum: page+1,
      pageSize: rowsPerPage,
      isRequestCount: false,
      Filter:model
    }
    setIsLoading(true);
    axios.post(GetPrescriptionActivityApi,data).then((response)=>{
      let result = response.data.lstPrescriptionActivityRow;
      setCount(response.data.lstCount);
      let temp = [];
      for (let i = 0; i < rowsPerPage * (page - 1); i++) {
        temp.push({});
      }
      result.forEach(item => {
        temp.push(createData(item.id, 
          item.patientNationalCode, 
          item.patientGivenName, 
          item.patientSurname, 
          item.medicalCouncilNumber,
          item.physicianSurname,
          item.pharmacyGln,
          item.createdDate,
          item.status,
          item.statusMessage,
          item
          ));
      });
      setRows(temp);
      setIsLoading(false);
    }).catch((error)=>{
      notifyError();
    })
  }

  function searchBtn(e){
    getSearchResult();
  }

 function handleConfirmModal(){
    getSearchResult();
  }
  const isSelected = id => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <CardComponent>
              <FormGroup>
                <Row>
                    <Col md='2'>
                      <Form.Label className='custom-label marg-t-20 bold'>کد ملی</Form.Label>
                      <Form.Control onChange={(e)=>setSearchModel({...searchModel,PatientNationalCode:e.target.value})}  className='form-control-custom' as="input" />
                    </Col>
                    <Col md='2'>
                      <Form.Label className='custom-label marg-t-20 bold'>GIN داروخانه</Form.Label>
                      <Form.Control onChange={(e)=>setSearchModel({...searchModel,PharmacyGln:e.target.value})}  className='form-control-custom' as="input" />
                    </Col>
                    <Col md='2'>
                      <Form.Label className='custom-label marg-t-20 bold'>نظام پزشکی</Form.Label>
                      <Form.Control onChange={(e)=>setSearchModel({...searchModel,MedicalCouncilNumber:e.target.value})}  className='form-control-custom' as="input" />
                    </Col>
                    <Col md='4'>
                      <Form.Label className='custom-label marg-t-20 bold'>کد اصالت </Form.Label>
                      <Form.Control onChange={(e)=>setSearchModel({...searchModel,UID:e.target.value})}  className='form-control-custom' as="input" />
                    </Col>
                </Row>
                <Row>
                    <Col md='2'>
                      <Form.Label className='custom-label marg-t-20 bold'>تاریخ ثبت از</Form.Label>
                      <DatePickerComponent selectedDate={moment().format('jYYYY-jMM-jDD')} onChange={(e)=>setSearchModel({...searchModel,CreatedDate:e})}></DatePickerComponent>
                    </Col>
                    <Col md='6'>
                      <Form.Label className='custom-label marg-t-20 bold'>ترکینگ آیدی</Form.Label>
                      <Form.Control onChange={(e)=>setSearchModel({...searchModel,TrackingCode:e.target.value})}  className='form-control-custom' as="input" />
                    </Col>
                    <Col md='2'  style={{marginTop: '40px'}}>
                    <Form.Label className='custom-label marg-t-20 bold'></Form.Label>
                      <Button onClick={searchBtn}>جستجو کد اصالت</Button>
                    </Col>
                </Row>
              </FormGroup>
          </CardComponent>
        </div>
      </div>

    <div className={classes.root}>
      <CardComponent>
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
            <Table
              className={classes.table + ' marg-t-10'}
              aria-labelledby="tableTitle"
              size='small'
            >
              <EnhancedTableHead

                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headRows={headRows}
              />
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <>
                        <TableRow

                          hover
                          tabIndex={-1}
                          key={row.id}
                        >
                          <TableCell className={classes.cell_short} padding="none" size='small' align="right">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.rowNumber}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.patientNationalCode}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none',fontSize: '10px !important'  }}>
                              {row.fullName}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.medicalCouncilNumber}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.physicianSurname}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.pharmacyGln}
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              <div className='create-date'>{row.createdDate}</div>
                            </div>
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              <div className='create-date'>{row.status}</div>
                            </div>
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                            {row.statusMessage}                            
                            {/* <Tooltip title={row.statusMessage}>
                              <span style={{fontSize:'16px'}}>{row.statusMessage!=undefined?row.statusMessage.substring(0,row.statusMessage.length-20):''}</span>
                            </Tooltip> */}
                            </div>
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              <div className='create-date'>{row.createDate}</div>
                            </div>
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                          </TableCell>
                          <TableCell className={classes.cell_short} align="right">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                            <ModalDescription handleConfirmModal={handleConfirmModal} row={row.rowItem} dbid={row.id} title="جزئیات" headerTitle="لیست اقلام نسخه" name={row.title} text={row.description} />
                            <div style={{marginTop:'10px'}}></div>
                            <ModalDescription row={row.rowItem}  dbid={row.id} title="ورودیها" headerTitle="ورودیها" name={row.title} text={row.description} />
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows, display: 'none' }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination className='MuiTablePagination-root MuiTypography-root'
            rowsPerPageOptions={tableConfig.rowsPerPageOpt}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </ThemeProvider>
      <Toaster position={toastConfig.position} />
      </CardComponent>
    </div>
  
    </>
  );
}

export default PrescriptionBarcodeDetailes