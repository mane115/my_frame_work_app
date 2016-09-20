const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;
const rp = require('request-promise');
const request = require('request');
// const account = require('./account.json');
const account = {
    password:'e10adc3949ba59abbe56e057f20f883e',
    username:'13823044664'
}
//模拟登陆
var session;
var formData = account;
//var intbeeUrl = 'http://10.0.1.100:8085';
var intbeeUrl ='http://120.24.43.211:8080';
var login = function() {
    return new Promise((success, fail) => {
        request.post({
            url: `${intbeeUrl}/login`,
            formData: formData
        }, function(err, res, body) {
            if (err) return;
            session = res.headers['set-cookie'];
            console.log('login success');
            success(session)
        });
    });
};
login().then(session => {
    var option = {
        uri: intbeeUrl + '/frontend/business/price',
        headers: {
            Cookie: session
        },
        method: 'Get'
    }
    return rp(option)
}).then(console.log);
//

app.use(bodyParser.json({
    limit: '1mb'
}));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    next();
});
app.use('/public', express.static('dist/'));
app.use('/static', express.static('static/'));
app.use('/test', express.static('test/'));

app.post('/post', function(req, res, next) {
    console.log(req.body);
    setTimeout(function() {
        res.json({
            code: 0,
            message: 'success',
            result: req.body
        })
    }, 1000)
});
app.get('/payment', function(req, res, next) {
    setTimeout(function() {
        res.json({
            code: 0,
            message: 'success',
            result: {
                cost: '9999'
            }
        })
    }, 1500)
});
app.get('/user', function(req, res) {
    res.json({
        code: 0,
        message: 'success',
        result: {
            username: '测试',
            company_name: '测试店铺名称要很长',
            mobile: '13823044664',
            company_auth: '测试广州三星手机电话厂商',
            shop_url: "http://www.baidu.com/adfasdfsadf/adsfasdfasdf/afadfasfd",
            expire: 1503726362061,
            image_url: '/static/img/phone.png'
        }
    })
});
app.all('/err', function(req, res) {
    setTimeout(function() {
        res.json({
            code: '9999',
            message: 'test err'
        })
    }, 1000)
});
app.post('/forward', function(req, res) {
    var option = {
        body: req.body.data,
        uri: req.body.url,
        headers: {
            'content-type': 'application/json'
        },
        json: true,
        method: req.body.method || 'GET'
    };
    if (req.body.headers) {
        option.headers = req.body.headers
    }
    option.headers['content-type'] = 'application/json';
    rp(option).then(result => {
        if (typeof result === 'string') result = JSON.parse(result);
        res.json(result)
    });
})
app.post('/forward/intbee', function(req, res) {
    console.log(req.body);
    //test
    //if (req.body.url === '/frontend/business/identity') {
    //    return res.json({
    //        "code": 0,
    //        "message": "成功",
    //        "size": 0,
    //        "result": {
    //            "id": 15,
    //            "uuid": "57c66227d83f6166652a3aef",
    //            "shop_verify_url": "data",
    //            "shop_verify_code": "015671",
    //            "shop_verify_status": 0,
    //            "shop_verify_time": 1472619048000,
    //            "status": 0,
    //            "company_name": "asdf",
    //            "company_no": "sdf",
    //            "legal_representative": "asdf",
    //            "company_residence": "asdf",
    //            "business_create_at": 1472619264000,
    //            "business_expire_at": 1472601600000,
    //            "business_license": "http://static.intbee.com/userid/FklodhWboivSZSh5hpaPv05HGpUO.png",
    //            "manufacture_id": 25525,
    //            "creation_time": 1472619048000,
    //            "update_time": 1472619048000,
    //            "is_company": 1,
    //            "is_business": 0,
    //            "is_payment": 0,
    //            "is_bindemail": 0
    //        }
    //    })
    //}
    if (req.body.url.indexOf('120.24.43.211:8080') === -1) req.body.url = intbeeUrl + req.body.url;
    var option = {
        body: JSON.stringify(req.body.data),
        uri: req.body.url,
        headers: {
            'content-type': "application/json",
            Cookie: session
        },
        method: req.body.method || 'GET'
    };
    rp(option).then(result => {
        if (typeof result === 'string') result = JSON.parse(result);
        res.json(result)
    }).catch(err => {
        console.log(err);
        res.json({
            code: 999,
            message: err
        })
    })
});
app.listen(port, function() {
    console.log(`listen in ${port}`)
});
//定时登陆 每小时
setInterval(login, 3600000);
