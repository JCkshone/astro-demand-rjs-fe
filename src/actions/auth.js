import firebase from 'firebase';

export function getUser(email){
    return dispatch=>{
        const auth=firebase.auth();
        const db=firebase.database().ref();
        auth.onAuthStateChanged(user=>{
            if(user) {
                let userRef=db.child('users').orderByChild('email').equalTo(user.email);
                userRef.once('value',snap=>{
                    let userData=snap.val();
                    let userVals=Object.values(userData).pop();
                    let userId=Object.keys(userData).pop();
                    console.log('userId: ',userId);
                    let userObj={
                        ...userVals,
                        userId
                    }
                    dispatch({type:'SET_AUTH',data:userObj});
                })
            } else {
                dispatch({type:'SET_NOT_LOGGED'})
            }
        })
    }
}
