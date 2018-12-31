import React from 'react';
import {connect} from 'react-redux';
// import PropTypes from 'prop-types';
import firebase from 'firebase';
import {Panel,Row,Col} from 'react-bootstrap';
import {objectConvertor} from '../../../lib/helpers';
import df from 'dateformat';
import isEmpty from 'is-empty';
import {Link} from 'react-router-dom';
import {FaTruck,FaAmericanSignLanguageInterpreting} from 'react-icons/fa';

class Scheduler extends React.Component {
    constructor(props){
        super(props);
        this.state={

        };
        this.db=firebase.database().ref();
    }

    onGoingOrders=()=>{
        const {onGoingOrders}=this.state;
        return(
            <div>
                <h3>Tareas agendadas</h3>
                {onGoingOrders.map((r,i)=>{
                    let date=df(r.date,'mm/dd HH:MM');
                    let status,type,icon;
                    // if(r._status==0) status='No ha empezado';
                    // else if(r._status==1) status='En progreso';

                    if(r.type=='pd') {
                        type='Pickup & Delivery';
                        icon=<FaTruck size={25} className='icon-lg' />;
                    }  else if (r.type=='cash'){
                        type='Cash Pickup';
                        icon=<FaAmericanSignLanguageInterpreting size={25} className='icon-lg' />;
                    }
                    return (
                        <Col xs={12} key={i}>
                            <Col xs={1} sm={1} md={1} lg={1}>
                                <br />
                                {icon}
                            </Col>
                            <Col xs={10} sm={10} md={4} lg={4}>
                                <Link to={`/tracking/${r.key}`}><h4>{type}</h4></Link>
                                <h4></h4>
                                <h6 style={{color:'gray'}}>{date}</h6>
                            </Col>
                        </Col>
                    )
                })}
            </div>
        )
    }

    componentWillReceiveProps(nextProps){
        if(this.props.auth!==nextProps.auth){
            const {email}=nextProps.auth;
            const ordersRef=this.db.child('ordersScheduled').orderByChild('customer').equalTo(email);
            ordersRef.on('value',snap=>{
                let orders=snap.val();
                let ordersCleaned=objectConvertor(orders);
                this.setState({onGoingOrders: ordersCleaned});
            });
        }
    }
    render () {
        const {onGoingOrders}=this.state;
        return(
            <div>

                {!isEmpty(onGoingOrders) ? this.onGoingOrders(): <p>No tienes ordenes agendadas...</p>}
            </div>
        )
    }
}

let mapStateToProps=state=>{
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps,null)(Scheduler);
