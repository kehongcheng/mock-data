const Koa = require('koa');
const router = require('koa-router');
const staticCache = require('koa-static-cache');
const static = require('koa-static');
const betterBody = require('koa-better-body');
const koaBody = require('koa-body');
const session = require('koa-session');
const pathlib = require('path');
const fs = require('fs');
const convert = require('koa-convert');
const common = require('./common/index');

let data = require('./data/data')
let base_url = '/api/202cb962ac59075b964b07152d234b70'
// create http server
let server = new Koa();


// add keys
server.keys = require('./.keys');


// upload file
server.use(convert(betterBody({
    uploadDir: pathlib.resolve('./www/upload'),
    keepExtentions: 'true'
})));

// static file
server.use(static(pathlib.resolve('www')));

// allow cors
const cors = require('koa2-cors'); //跨域处理
const { userList } = require('./data/data');
const { resolve } = require('path');

server.use(
    cors({
        origin: '*',
        maxAge: 86400, //预检请求有效期
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE'], //允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Token'], //服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'X-Token'] //获取其他自定义字段
    })
);


// log
server.use(async (ctx, next)=>{
    console.log('request path : ' + ctx.request.URL.pathname);
    await next();
})

// create router
let r1 = router();
server.use(r1.routes());


// -----------------------user-admin--------------

r1.post(base_url + '/user/login', async ctx=>{
    const {username, password} = ctx.request.fields
    ctx.status = 200;
    ctx.statusText = 'OK';
    if(username == 'admin'){
        ctx.response.body = data.user[0];
    }else{
        ctx.response.body = data.user[1];
    }
})

r1.get(base_url + '/user/info', async ctx=>{
    ctx.status = 200;
    ctx.statusText = 'OK';
    ctx.response.body = data.userInfo[ctx.query.token];
})

r1.post(base_url + '/user/logout', async ctx=>{
    ctx.status = 200;
    ctx.statusText = 'OK';
    ctx.response.body = {"code":20000,"data":"success"};
})

// -----------------------user-list--------------

r1.get(base_url + '/get/userlist', async ctx=>{
    ctx.status = 200;
    ctx.statusText = 'OK';
    ctx.response.body = data.userList;
})

r1.post(base_url + '/del/userlist', async ctx=>{
    
    let username = ctx.request.query.username;
    let _userList = data.userList.data;
    let index = _userList.findIndex(data=>data.username==username);
    ctx.status = 200;
    ctx.statusText = 'OK';
    
    if(index != -1){
        console.log("删除用户：" + username);
        _userList.splice(index, 1);
        ctx.response.body = {code: 20000, data: 1};
    }else{
        ctx.response.body = {code: 20000, data: 0};
    }
    
})

r1.post(base_url + '/add/userlist', async ctx=>{
    let date = new Date();
    let formatDate = "" + date.getFullYear() + "-" + ((date.getMonth()+1)>10?(date.getMonth()+1):"0"+(date.getMonth()+1)) + "-" + (date.getDate()>10?date.getDate():"0"+date.getDate())
    let username = ctx.request.query.username;
    let password = ctx.request.query.password;
    let _userList = data.userList.data;
    let index = _userList.findIndex(data=>data.username==username);

    ctx.status = 200;
    ctx.statusText = 'OK';
    // 1成功 2用户已存在 3满了
    if(_userList.length >= 100){
        ctx.response.body = {"code":20000,"data":"3"};
    }else if(index==-1){
        console.log("添加用户：" + username);
        _userList.push({
            date: formatDate,
            username: username,
            password: common.md5(password)
        })
        ctx.response.body = {"code":20000,"data":"1"};
    }else{
        ctx.response.body = {"code":20000,"data":"2"};
    } 
    
})

// -----------------------position-list--------------
r1.get(base_url + '/get/positionlist', async ctx=>{
    ctx.status = 200;
    ctx.statusText = 'OK';
    ctx.response.body = {"code":20000,"data":data.positionList};
})

r1.post(base_url + '/del/positionlist', async ctx=>{
    let id = ctx.request.query.id;
    let _positionList = data.positionList;
    let index = _positionList.findIndex(data=>data.id==id);
    ctx.status = 200;
    ctx.statusText = 'OK';
    
    if(index != -1){
        // 删除图片
        if(_positionList[index].companyLogoUrl){
            var filepath = pathlib.resolve('./www/upload/') + '\\' + common.pathToFileName(_positionList[index].companyLogoUrl, '/');
            common.delFile(filepath);
        }
        _positionList.splice(index, 1);
        ctx.response.body = {code: 20000, data: 1};
    }else{
        ctx.response.body = {code: 20000, data: 0};
    }
})

r1.post(base_url + '/add/positionlist', async ctx=>{
    let date = new Date();
    let formatDate = "" + date.getFullYear() + "-" + ((date.getMonth()+1)>10?(date.getMonth()+1):"0"+(date.getMonth()+1)) + "-" + (date.getDate()>10?date.getDate():"0"+date.getDate())
    let {companyLogo, companyLogoUrl, companyName, positionName, city, salary} = ctx.request.query;
    ctx.status = 200;
    ctx.statusText = 'OK';
    let _positionList = data.positionList;

    ctx.status = 200;
    ctx.statusText = 'OK';
    // 1成功 3满了
    if(_positionList.length >= 500){
        ctx.response.body = {"code":20000,"data":"3"};
    }else {
        
        _positionList.unshift({
            id: _positionList.length?_positionList[0].id + 1:1,
            companyLogo: companyLogo?companyLogo:'',
            companyLogoUrl: companyLogoUrl?companyLogoUrl:'',
            companyName: companyName,
            positionName: positionName,
            city: city,
            salary: salary,
            createTime: formatDate
        })
        ctx.response.body = {"code":20000,"data":"1"};
    }
})

r1.post(base_url + '/edit/positionlist', async ctx=>{
    let {id, companyLogo, companyLogoUrl, companyName, positionName, city, salary} = ctx.request.query;
    let _positionList = data.positionList;
    let index = _positionList.findIndex(data=>data.id==id);

    ctx.status = 200;
    ctx.statusText = 'OK';
    // 1成功 0失败
    if(index != -1){
        
        if(companyLogoUrl){
            if(companyLogoUrl != _positionList[index].companyLogoUrl && _positionList[index].companyLogoUrl){
                var filepath = pathlib.resolve('./www/upload/') + common.pathToFileName(_positionList[index].companyLogoUrl);
                common.delFile(filepath);
                _positionList[index].companyLogoUrl = companyLogoUrl
                companyLogo?(_positionList[index].companyLogo = companyLogo):_positionList[index].companyLogo="";
            }else{
                _positionList[index].companyLogoUrl = companyLogoUrl
                _positionList[index].companyLogo = companyLogo
            }
        }else{
            if(_positionList[index].companyLogoUrl){
                var filepath = pathlib.resolve('./www/upload/') + '\\' + common.pathToFileName(_positionList[index].companyLogoUrl, '/');
                common.delFile(filepath);
                _positionList[index].companyLogoUrl = ""
                _positionList[index].companyLogo = ""
            }
        }

        companyName && (_positionList[index].companyName = companyName);
        positionName && (_positionList[index].positionName = positionName);
        city && (_positionList[index].city = city);
        salary && (_positionList[index].salary = salary);
        ctx.response.body = {"code":20000,"data":"1", "msg": "修改信息成功"};
    }else{
        companyLogo && (_positionList[0].companyLogo = companyLogo);
        companyLogoUrl && (_positionList[0].companyLogoUrl = companyLogoUrl);
        ctx.response.body = {"code":20000,"data":"1", "msg": "添加图片成功"};
    }
})


r1.post('/uploadfile', async (ctx, next) => {
    // 上传文件
    const filePath = ctx.request.files[0].path; // 路径
    const fileName = ctx.request.files[0].name; // 文件名
    const hashName = common.pathToFileName(filePath)  // 文件hash名
    ctx.status = 200;
    ctx.statusText = 'OK';
    return ctx.response.body = {"code": 20000, "data": {
        "fileName": fileName,
        "hashName": hashName        
    }};
  });

server.listen(3000);

