import React from 'react';
// import PropTypes from 'prop-types';
import firebase from 'firebase';
import {Grid,Row,Col,Button} from 'react-bootstrap';
import isEmpty from 'is-empty';
import  Nav from '../../Nav';
import Map from './Map';

class Tracker extends React.Component {
    constructor(props){
        super(props);
        this.state={
            orderDetails:{
                pickUp:{
                    place:'',
                    contactName:'',
                    contactPhone:'',
                    instructions:'',
                    _status: 0
                },
                delivery:[],
                _status:0
            },
            currentTask: 1,
            coords:{
                latitude:0,
                longitude:0
            }
        };
        this.db=firebase.database().ref();
    }
    componentWillMount() {
        let  {order}=this.props.match.params;
        // console.log('match props: ',this.props.match.params);
        // let parsedOrder=JSON.parse(order);
        // const orderId=String(Object.keys(parsedOrder).pop());
        const ordersRef=this.db.child(`orders/${order}`);
        ordersRef.on('value',snap=>{
            let order=snap.val();
            this.setState({orderDetails:order})
        });
        const astroLoc=this.db.child(`ordersScheduled/${order}/coords`);
        astroLoc.on('value',snap=>{
            let coords=snap.val();
            this.setState({coords});
        });
    }
    render () {
        const {orderDetails,currentTask,coords}=this.state;
        const {pickUp}=orderDetails;
        return (
            <div>
                <Col xs={12} md={6}>
                    <h2>Rastreo de orden</h2>
                    <Grid>
                        <Row>
                            <Col xs={12} md={6}>
                                <Row style={{paddingBottom:15}}>
                                    <Col xs={2} sm={2} md={2} lg={2}>
                                        <h4>{orderDetails._status}</h4>
                                    </Col>
                                    <Col xs={8} sm={8} md={8} lg={8}>
                                        <h4 style={{fontWeight:'bold'}}>Orden tomada por AstroName</h4>
                                    </Col>
                                    <Col xs={2} sm={2} md={2} lg={2}>
                                    </Col>
                                </Row>
                                <Row style={{paddingBottom:15}}>
                                    <Col xs={2} sm={2} md={2} lg={2}>
                                        <h4>{pickUp._status}</h4>
                                    </Col>
                                    <Col xs={8} sm={8} md={8} lg={8}>
                                        <h4 style={{fontWeight:'bold'}}>Iniciar en {pickUp.place}</h4>
                                        <h4>
                                            {pickUp.instructions}<br />
                                            Cualquier percance comunicate con {pickUp.contactName} al {pickUp.contactPhone}
                                        </h4>
                                    </Col>
                                    <Col xs={2} sm={2} md={2} lg={2}>
                                    </Col>
                                </Row>
                                {!isEmpty(orderDetails) && orderDetails.delivery.map((r,i)=>{
                                    // if (i+2==currentTask) this.currentTaskId=r.orderId;
                                    return (
                                        <Row key={i} style={{paddingBottom:15}}>
                                            <Col xs={2} sm={2} md={2} lg={2}>
                                                <h4>{r._status}</h4>
                                            </Col>

                                            <Col xs={8} sm={8} md={8} lg={8}>
                                                <h4 style={{fontWeight:'bold'}}>{r.place}</h4>
                                                    <h4>
                                                        {r.instructions} <br />
                                                        Cualquier percance comunicate con {r.contactName} al {r.contactPhone}
                                                    </h4>
                                            </Col>

                                            <Col xs={2} sm={2} md={2} lg={2}>
                                                {i+2==r._status &&
                                                    <Button bsStyle='default' bsSize='sm'>
                                                        <h3>i</h3>
                                                    </Button>
                                                }
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Col>
                            <Col xs={12} md={5} >
                                <Map coords={coords} />
                            </Col>
                        </Row>
                    </Grid>
                </Col>
            </div>
        )
    }
}

export default Tracker;
