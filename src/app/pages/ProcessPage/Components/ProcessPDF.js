import React, { useEffect, useRef, useState } from 'react';
import { SideBarConfig, toastConfig } from '../../Config';
import { Form, Row, Col, Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {  makeStyles } from '@material-ui/core/styles';
import { CardComponentReport } from '../../component/UI/CardComponentReport'
import { useHistory } from 'react-router-dom';
import {processListPath} from '../../commonConstants/RouteConstant';
import {ProcessGetByIDApi} from '../../commonConstants/ApiConstants';
import {addCommas} from 'persian-tools2';
import Print from '@material-ui/icons/Print'
const useStyles = makeStyles(theme => ({
  divider: {
    height: theme.spacing(2),
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  inputBackGround: {
    background: '#f8f8f8',
    border: '2px solid black'
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  rootDiv: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    // position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  }
}));

export const ProcessPDF = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [processInfo,setProcessInfo] = useState();
  const [processDto,setProcessDto] = useState();
  const [processUserDto,setProcessUserDto] = useState();
  const [initialBalance,setInitialBalance] = useState([]);
  useEffect(() => {
    if( props.location.state==undefined)
      return history.replace(processListPath)
    var dbid = props.location.state.dbid;
    getProcessInformation(dbid)
  }, []);

  function getProcessInformation(id){
    axios.get(ProcessGetByIDApi+'/'+id).then((res)=>{
      if(res.data.hasError===false){
        console.log("processInfo",res.data);
        res.data.processDto.title="اطلاعات فرایند : " + res.data.processDto.title
        setProcessDto(res.data.processDto);
        setProcessUserDto(res.data.processUserDtos);
        setInitialBalance(res.data.initialBalanceDtos);
      } 
    })
}
function printPDF(){
  window.print();
  // var content = document.getElementById("divcontents");
  // var pri = document.getElementById("ifmcontentstoprint").contentWindow;
  // pri.document.open();
  // pri.document.write(content.innerHTML);
  // pri.document.close();
  // pri.focus();
  // pri.print();
}
function headerRender(){
  return  (
    <>
    <Form style={{ border: '1px solid rgb(201, 211, 255)', padding: '21px' }}>
    <Form.Group>
      <Row className='marg-t-10'>
        <Col md='4'>
          fgdfffffffffffffffffffffffffffffffffffffffffffffffffffffff
        </Col>
      </Row>
    </Form.Group>
  </Form>
  </>
  )
}

  return (
    <div  onload="window.print()" id="divcontents"> 
    <iframe id="ifmcontentstoprint" style={{height: '0px', width: '0px', position: 'absolute'}}></iframe>    
    {
      
      processDto!=undefined?
      <>
      <div className={classes.rootDiv}>
        <div className="row">
          <div className="col-md-12">
            <CardComponentReport
              headerRender={
                <>
                  <Row className='marg-t-10' style={{marginRight: '10px',fontSize: '19px',fontWeight: 'bold'}}>
                    <Col md='4'>
                      <Form.Label>{processDto.title}</Form.Label>
                    </Col>
                    <Col md='4'>
                      <Form.Label>تاریخ اجرا :  {processDto.issueDatePersian}</Form.Label>
                    </Col>
                    <Col md='4'>
                      <Form.Label>کد فرایند :  {processDto.code}</Form.Label>
                    </Col>
                  </Row>
              </>
              }
              codeBlockHeight="400px">
              <Form style={{ border: '1px solid rgb(201, 211, 255)', padding: '21px' }}>
                <Form.Group>
                  <Row className='marg-t-10' style={{borderRadius: '11px',background: '#e4e6ef'}}>
                    <Col md='2' >
                      <Form.Label style={{fontSize: '19px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>خروجی نهایی : </Form.Label>
                    </Col>
                    <Col md='3'>
                      <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{processDto.isFinalStep===true?'است':'نیست'} </Form.Label>
                    </Col>
                  </Row>
                  <Row className='marg-t-10' style={{borderRadius: '11px',background: '#e4e6ef'}}>
                    <Col md='2' >
                      <Form.Label style={{fontSize: '19px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>نوع انجام فرایند </Form.Label>
                    </Col>
                    <Col md='3'>
                      <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{processDto.contractorTypeID===18?'پیمانکار':'داخلی'} </Form.Label>
                    </Col>
                  </Row>
                  

                  <Row  style={{background: '#3699ff',borderRadius: '13px',marginTop: '10px'}}>
                      <Col md='2' >
                        <Form.Label style={{fontSize: '19px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>نام کاربر : </Form.Label>
                      </Col>
                      <Col md='3' >
                          <Form.Label style={{fontSize: '19px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>روش پرداخت دستمزد : </Form.Label>
                      </Col>
                  </Row>
                  {
                    processDto.contractorTypeID===18&&processUserDto!=undefined?
                    processUserDto.map((item,index)=>{
                      return  (
                        <Row  style={{background: '#e4e6ef',borderRadius: '10px'}}>
                        <Col md='3'>
                          <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.userName} </Form.Label>
                        </Col>
                        <Col md='3'>
                          <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.salaryTypeName} </Form.Label>
                        </Col>
                      </Row>
                      )                  
                    })
                  :
                    <>
                      <Row  style={{background: '#e4e6ef'}}>
                        <Col md='2' >
                          <Form.Label style={{fontSize: '19px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>نام کاربر : </Form.Label>
                        </Col>
                        <Col md='2' >
                          <Form.Label style={{fontSize: '19px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>{processDto.contractorFullName} </Form.Label>
                        </Col>
                      </Row>
                    
                    </>
                  }


                  <Row  style={{background: '#3699ff',borderRadius: '13px',marginTop: '10px'}}>
                      <Col md='2' >
                        <Form.Label style={{fontSize: '19px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px',color: 'white'}}>نام محصول : </Form.Label>
                      </Col>
                      <Col md='2'>
                        <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px',color: 'white'}}>قیمت واحد </Form.Label>
                      </Col>
                      <Col md='2'>
                        <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px',color: 'white'}}> تعداد </Form.Label>
                      </Col>
                      <Col md='2'>
                        <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px',color: 'white'}}> واحد اندازه گیری </Form.Label>
                      </Col>
                  </Row>
                  {
                    initialBalance.map((item,index)=>{
                      return  (
                        <>

                        <Row  style={{background: '#e4e6ef',borderRadius: '10px'}}>
                          <Col md='2'>
                            <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.title} </Form.Label>
                          </Col>
                          <Col md='2'>
                            <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{addCommas(item.price)} ریال</Form.Label>
                          </Col>
                          <Col md='2'>
                            <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.usedCount} </Form.Label>
                          </Col>
                          <Col md='2'>
                            <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{item.unitName} </Form.Label>
                          </Col>
                        </Row>
                        </>

                      )                  
                    })
                  }
                  <Row>
                      <Col md='4'></Col>
                      <Col md='4'></Col>
                      <Col md='4' style={{marginTop: '20px !important' }}>
                            <div style={{borderRadius: '22px'}} class="alert alert-primary" role="alert">قیمت تمام شده : { addCommas(processDto.totalPrice)} ریال</div>
                      </Col>
                  </Row>

                  <Row className='marg-t-10' style={{background: '#e4e6ef'}}>
                    <Col md='2' >
                      <Form.Label style={{fontSize: '19px',fontWeight: 'bold',marginRight: '14px',marginTop: '10px'}}>توضیحات </Form.Label>
                    </Col>
                  </Row>
                  <Row style={{background: '#e4e6ef'}}>
                    <Col md='12' style={{marginRight: '31px'}}>
                      <Form.Label style={{fontSize: '16px',fontWeight: 'bold',lineHeight: 2,marginTop: '10px'}}>{processDto.description} </Form.Label>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </CardComponentReport>
          </div>
        </div>
        <Toaster position={toastConfig.position} />
      </div>

      <div className="row">
          <div className='category-add-footer' style={{width:'100%',right:0}}>
            <Print onClick={printPDF}></Print>
          </div>
      </div>

      </>
      :
      <></>
      
      }
    </div>

  );
}



export default ProcessPDF