import React, { useEffect } from 'react';
import deleteImage from '../pulseDesignImages/delete.svg';
import CategoryModalDelete from './UsersModalDelete';
import CategoryModalEdit from '../Category/CategoryModalEdit';
import {CardComponent} from '../component/UI/CardComponent'
import Skeleton from 'react-loading-skeleton';
import editImage from '../pulseDesignImages/edit1.svg';
import { Form, Row, Col, Button,FormGroup } from 'react-bootstrap';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { faIR } from '@material-ui/core/locale';
import Checkbox from '@material-ui/core/Checkbox';
import { Preloader, Oval } from 'react-preloader-icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EnhancedTableHead from '../component/UI/EnhancedTableHead';
import { tableConfig,toastConfig } from '../Config';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {AdminUsergetUsersApi} from '../commonConstants/apiUrls';
import { Show_add, Show_edit, Is_not_edited, Is_not_deleted_one, Is_not_deleted_group, Is_not_added } from '../_redux/Actions/usersActions';
import { useDispatch, useSelector } from "react-redux";
import UsersModalDeleteGroup from './UsersModalDeleteGroup';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import checkRequests from '../component/ErrroHandling';
import {CreateUserAction,getUsersAsyncAction, UpdateUserAction} from '../commonConstants/ClaimsConstant'

const headRows = [
  { id: 'id', numeric: true, disablePadding: true, label: 'شناسه' },
  { id: 'description', numeric: false, disablePadding: false, label: 'نام کاربری' },
  { id: 'mobile', numeric: true, disablePadding: false, label: 'ایمیل' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'عملگر ها' },
];
  
  
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
  

  const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: '#8950FC',
          backgroundColor: '#f3f6f9',
        }
        : {
          color: '#8950FC',
          backgroundColor: '#f3f6f9',
        },
    spacer: {
      flex: '1 1 100%',
    },
    title: {
      flex: '0 0 auto',
    },
  }));
  
  const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    const addCategoryShow = props.onAddClick;
    const actionPermisstion = useSelector(state=>state.tokenReducer.TokenObject.userInfo.claims);
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} مورد انتخاب شده است
            </Typography>
          ) : (
              <Typography variant="h6" id="tableTitle">
                <span className='tabelhead'>لیست کاربران</span>
              </Typography>
            )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <UsersModalDeleteGroup selected={props.selected} />
          )
            :
            actionPermisstion.find(z=>z.id==CreateUserAction)!==undefined?(<Button onClick={addCategoryShow} className='btn-height2 create-btn' variant="info">افزودن کاربر</Button>):<></>
          }
        </div>
      </Toolbar>
    );
  };

  const useStyles = makeStyles(theme => ({
    divider: {
      height: theme.spacing(2),
    },
    root: {
      width: '100%',
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


  
  export function UsersList(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isLoading, setIsLoading] = React.useState(true);
    const [inSrch, setInSrch] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const [isEditingOrDeletingOneOrAdding, setIsEditingOrDeletingOneOrAdding] = React.useState(false);
    const [srchTitle, setSrchTitle] = React.useState('');
    const reduxProps = useSelector(state=>state.users);
    const [isDeletingGroup, setIsDeletingGroup] = React.useState(false);
    const actionPermisstion = useSelector(state=>state.tokenReducer.TokenObject.userInfo.claims);
    const [searchModel,setSearchModel] = React.useState({
      UserName:'',
    })
    const dispatch = useDispatch();
    function getSearchModel(){
      var model = searchModel;
      var rules=[];
      if(model.UserName!=='')
      {
        var obj = {
          field:'UserName',
          op:11,
          data:model.UserName
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
    const notifyError = () => toast('خطا در ارتباط با سرور. اطلاعات بارگزاری نشد.', { duration: toastConfig.duration, style: toastConfig.errorStyle });
    function createData(id, userName,email) {
      return {  id,userName,email};
    }

    const setFakeData = (count) => {
      const temp = [];
      for (let i = 0; i < count; i++) {
        temp.push({ id: i });
      }
      setRows(temp);
    }
    useEffect(() => {
      setFakeData(tableConfig.rowsPerPageDefault);
      getData(tableConfig.rowsPerPageDefault, 1, '', false, false, false);
    }, []);

    useEffect(() => {
      if (reduxProps.Is_Edited || reduxProps.Is_Deleted_One || reduxProps.Is_Added) {
        setIsEditingOrDeletingOneOrAdding(true);
        getData(rowsPerPage, page + 1, srchTitle, false, true, false);
        dispatch(Is_not_edited());
        dispatch(Is_not_deleted_one());
        dispatch(Is_not_deleted_group());
        if (reduxProps.Is_Deleted_One)
          setSelected([]);
      }
      else if (reduxProps.Is_Deleted_Group) {
        setIsDeletingGroup(true);
        setIsLoading(true);
        getData(rowsPerPage, 1, '', false, false, true);
        dispatch(Is_not_deleted_one())
        setPage(0);
        setSelected([]);
      }
    }, [reduxProps]);


    function setKeyUpSrch(e) {
      if (isEditingOrDeletingOneOrAdding)
        return;
      setSrchTitle(e.target.value);
      setInSrch(true);
      setPage(0);
      getData(rowsPerPage, 1, e.target.value, true, false, false);
    }
    
    function handleRequestSort(event, property) {
      const isDesc = orderBy === property && order === 'desc';
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(property);
    }
  
    function handleSelectAllClick(event) {
      if (event.target.checked) {
        const newSelecteds = rows.map(n => n.id);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    }
  

    function handleChangePage(event, newPage) {
      if (isLoading)
      return;
      setFakeData(count);
      setIsLoading(true);
      setPage(newPage);
      getData(rowsPerPage, newPage + 1, srchTitle, false, false, false);
    }
  
    function handleChangeRowsPerPage(event) {
      if (isLoading)
      return;
      setFakeData(count);
      setIsLoading(true);
      setRowsPerPage(event.target.value);
      setPage(0);
      getData(event.target.value, 1, srchTitle, false, false, false);
    }

  
    function showAddSlider() {
      dispatch(Show_add());
    }
    function editShowSlider(e) {
      let row = e.currentTarget.getAttribute('userRow');
      let rowJson=JSON.parse(row);
      dispatch(Show_edit({row:rowJson}));
    }

    const isSelected = id => selected.indexOf(id) !== -1;
  
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
    const getData = (nRows, page, title, inSearch, iseditingORdeletingORadding, isdeletinggroup) => {
      var data = {
        PageNum:page,
        PageSize:nRows,
        Filter:getSearchModel(),
        IsRequestCount :true
      }
      axios.post(AdminUsergetUsersApi,data)
        .then(res=>{
          let result = res.data.users;
          setCount(res.data.lstCount);
          let temp = [];
          for (let i = 0; i < nRows * (page - 1); i++) {
            temp.push({});
          }
          result.forEach(item => {
            temp.push(createData(item.id,item.userName,item.email))
          });
          setRows(temp);
          setIsLoading(false);
          
          
        if (inSearch) {
          setTimeout(() => {
            setInSrch(false);
          }, 1000);
        }
        if (iseditingORdeletingORadding) {
          setTimeout(() => {
            setIsEditingOrDeletingOneOrAdding(false);
          }, 1000);
        }
        if (isdeletinggroup) {
          setTimeout(() => {
            setIsDeletingGroup(false);
          }, 1000);
        }
        })
        .catch(error => {
          notifyError();
          setIsLoading(true);
          setIsEditingOrDeletingOneOrAdding(false);
          setInSrch(false);
          setIsDeletingGroup(false);
        });
    }

    const btnSearch=(e)=>{
      getData(tableConfig.rowsPerPageDefault, 1, '', false, false, false);
      setPage(0);
    }
    
    return (
      <>
    {
      actionPermisstion.find(z=>z.id==getUsersAsyncAction)!==undefined?
        <div className="row">
        <div className="col-md-12">
          <CardComponent>
              <FormGroup>

                  <Row>
                    <Col md='4'>
                      <Form.Label className='custom-label marg-t-20 bold'>نام کاربری</Form.Label>
                      <Form.Control onChange={(e)=>setSearchModel({...searchModel,UserName:e.target.value})}  className='form-control-custom' as="input" />
                    </Col>
                    <Col md='2'  style={{marginTop: '40px'}}>
                    <Form.Label className='custom-label marg-t-20 bold'></Form.Label>
                      <Button onClick={(e)=>{btnSearch()}}>جستجو</Button>
                    </Col>
                </Row>
              </FormGroup>
          </CardComponent>
        </div>
      </div>
      :<></>
    }

      <div className={classes.root}>
      <CardComponent>
        <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} selected={selected}   onAddClick={showAddSlider}/>
          {
              actionPermisstion.find(z=>z.id==getUsersAsyncAction)!==undefined?

          <div className={classes.tableWrapper}>

            <Table
              className={classes.table + ' marg-t-10'}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
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
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={index + 'usersList'}
                          selected={isItemSelected}
                        >
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.id}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.userName}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {row.email}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Skeleton duration={1} style={{ width: '100%', display: isLoading ? 'block' : 'none', height: '20px' }} />
                            <div style={{ display: !isLoading ? 'block' : 'none' }}>
                              {
                                actionPermisstion.find(z=>z.id==UpdateUserAction)!==undefined?
                                <div className="delete-img-con btn-for-select" dbid={row.id}  userRow={JSON.stringify(row)} onClick={editShowSlider} ><img className='edit-img btn-for-select' src={editImage} /></div>
                                :<></>
                              }
                              <CategoryModalDelete dbid={row.id} name={row.title} />
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
          :<></>
        }
          {
            actionPermisstion.find(z=>z.id==getUsersAsyncAction)!==undefined?

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
            onChangeRowsPerPage={handleChangeRowsPerPage}/>
            
            :<></>
          }
        </Paper>
      </ThemeProvider>
      </CardComponent>
      <Toaster position={toastConfig.position} />
    </div>
  
      </>

    );
  }



export default checkRequests(UsersList,axios);