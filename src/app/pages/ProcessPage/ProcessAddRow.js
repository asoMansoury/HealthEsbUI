import React from 'react';
import AsyncAutoComplete from './AsyncAutoComplete';
import { Form, Row, Col, Button } from 'react-bootstrap';
import deleteImage from '../pulseDesignImages/delete.svg';
import RemainModal from './RemainModal';
import OrderModal from './OrderModal';
import {InitialBalanceGetQuantityStockApi} from '../commonConstants/ApiConstants';
import axios from 'axios';

export default class ProcessAddRow extends React.Component {
    constructor(props) {
        super(props);
        this.style = '  .card-footer                '
            + '  {  height: 0;               '
            + '     padding: 0;               '
            + '     margin:0;                 '
            + '     border:none;      }      '
            + '.card{border:none !important;}';
        this.state = {
            productId: 0,
            datas: [],
            prevDatas:[],
            fromLoadData: false,
            model:[]
        };
        this.inputCountKeyUp= this.inputCountKeyUp.bind(this);
        this.getData = this.getData.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    getData(){
        return this.state.datas;
    }

    loadData() {
        var tmpArray = this.state.datas;
        axios.get(InitialBalanceGetQuantityStockApi+'/' + this.state.productId)
            .then(res =>{
                res.data.stockRoom_InitialBalanceDtos.map((item,index)=>{
                    tmpArray.push({
                        count:0,
                        currentCount:item.currentCount,
                        id:item.id,
                        initialBalanceEntitiesFK_ID:item.initialBalanceEntitiesFK_ID,
                        isEnabled:item.isEnabled,
                        stockRoom_InitialBalanceFK_ID:item.stockRoom_InitialBalanceFK_ID,
                        title:item.title,
                        totalPrice:item.totalPrice,
                        pricePerUnit:item.pricePerUnit
                    })
                });
                this.setState({
                    ...this.state,
                    datas: tmpArray,
                    prevDatas:tmpArray
                })
            })
            .catch(error => {
            })
    }
    setProductId = (x,y) => {
        this.setState({ productId: x, productName : y, fromLoadData: true });
    }

    handleClose(){
        var tmpPrevData = this.state.prevDatas;
        this.setState({
            ...this.state,
            datas:tmpPrevData
        })
    }

    componentDidUpdate() {
        if (this.state.fromLoadData) {
            this.loadData();
            this.setState({ fromLoadData: false });
        }
    }

     inputCountKeyUp(e){
        let id= parseInt(e.currentTarget.getAttribute('id'));
        let prodId = parseInt(e.currentTarget.getAttribute('prodid'));
        let currentCount = e.currentTarget.getAttribute('currentCount');
        let index = parseInt(e.currentTarget.getAttribute('indexItem'));
        
        let count = e.currentTarget.value;
        if(parseInt(currentCount)<parseInt(count)){
            e.currentTarget.value = currentCount;
            count = parseInt(currentCount);
        }
                    
        var tmpArray = [];
        var prevItem = this.state.datas.filter(z=>z.initialBalanceEntitiesFK_ID===prodId&&z.id===id)[0];


        this.state.datas.map((item,index)=>{
            if(prevItem.id!==item.id)
                tmpArray.push(item)
            else{
                prevItem.count=parseInt(count);
                tmpArray.push(prevItem);
            }

        })
        this.setState({...this.state,datas:tmpArray});

    }

    render() {
        var selectedProductID=  this.props.selectedProductID;
        var setSelectedProductID = this.props.setSelectedProductID;
        var rowID = this.props.id;
        return (
            <>
                <div class='process-row-container'>
                    <Row className='process-row'>
                        <Col md='4'>
                            <AsyncAutoComplete setSelectedProductID={setSelectedProductID} selectedProductID={selectedProductID} setProductId={this.setProductId} width='100%' id={'async-auto-complete-' + this.props.id} />
                        </Col>
                        <Col md='7'>
                            <RemainModal handleClose={this.handleClose} inputCountKeyUp={this.inputCountKeyUp} data={this.state.datas} prodId = {this.state.productId} prodName = {this.state.productName} />
                        </Col>
                        {/* <Col md='4'>
                            <OrderModal model={this.state.model} data={this.state.datas} prodId = {this.state.productId} prodName = {this.state.productName}/>
                        </Col> */}
                        <Col md='1'>
                            <div className='delete-btn-row-proc'>
                                <img style={{ heigt: '25px', width: '25px' }} src={deleteImage} id={rowID} onClick={this.props.removeRowHandler} />
                            </div>
                        </Col>
                    </Row>
                    <style>
                        {this.style}
                    </style>
                </div>
            </>
        );
    }
}