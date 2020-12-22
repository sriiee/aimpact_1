const common = require('../lib/common');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.verification = (req, res, next) => {
    let url = req.originalUrl;
    // //console.log('############# URL : ', url);
    let email = req.headers.email,
        token = req.headers.token,
        nToken;
    if(url === "/login") {
        // //console.log('###### LOGIN ######');
        email = req.body.email;
        nToken = jwt.sign({
                email: email
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: '15m'}
        );
        req.token = nToken;
        req.newToken = true;
        //console.log('##### LOGIN NEW TOKEN', nToken);
        next();
    }
    else if(url === "/signup"){
        //console.log('signup');
        next();
    }
    else {
        try {
            //console.log('##### email ', email);
            //console.log('##### token ', token);
            if (token && token !== 'undefined' && token !== 'null') {
                //console.log('================ TOKEN ================');
                jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded)=>{
                    if(err){
                        //console.log('################# Expired');
                        req.token = 'expired';
                        next();
                    } else{
                        let etime = decoded['exp'],
                            now = moment().unix(),
                            time = etime-now;
                        //console.log('##### Verify Decoded', decoded);
                        //console.log('##### Time', time);
                        if( time > 0 && time <= 300 ){
                            nToken = jwt.sign({
                                    email: email
                                },
                                process.env.JWT_SECRET_KEY,
                                {expiresIn: '15m'}
                            );
                            req.token = nToken;
                            req.newToken = true;
                            //console.log('============== 5m NEW TOKEN ==============');
                            //console.log(nToken);
                        }
                        req.token = token;
                        next();
                    }
                })
            } else {
                //console.log('================ NO TOKEN ================');
                nToken = jwt.sign({
                        email: email
                    },
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: '15m'}
                );
                //console.log('============== NEW TOKEN ==============');
                //console.log(nToken);
                req.token = nToken;
                req.newToken = true;
                next();
            }
        } catch (err) {
            console.error(err);
            //console.log('############ ERRRRRRR #############');
            res.json(common.prepare_response(500));
            return;
        }
    }
};

