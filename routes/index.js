const express = require('express');
const router = express.Router();
const common = require('../lib/common');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const auth = require("../models/auth"),
      board = require("../models/board");


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 회원가입
router.post('/signup', async (req, res, next)=> {
  let body = req.body;
  let email = body.email,
      password = body.password;
  let passHex = crypto.createHash('sha1').update(password).digest('hex');

  let account = await auth.user.find({ email: email }).limit(1).exec();
  if (account.length > 0){
    res.json(common.prepare_response(400, null, '이미 가입된 이메일 입니다.'));
    return;
  } else {
    let docs = {
      name: body.name,
      email: email,
      password: passHex,
      ctime: +new Date()
    };
    await new auth.user(docs).save();
    res.json(common.prepare_response(200, null));
  }
});

// 로그인
router.post('/login', async (req, res, next)=> {
  let email = req.body.email,
      password = req.body.password;
  console.log('LOGIN >>>>>>>>> ',req.token);
  let result = {};
  let account = await auth.user.find({ email: email }).limit(1).exec();
  if( account.length > 0 ){
    let passHex = crypto.createHash('sha1').update(password).digest('hex');
    if( passHex !== account[0]['password'] ){
      res.json(common.prepare_response(400, null, 'INCORRECT'));
      return;
    }

    res.json(common.prepare_response(200, result));
  } else {
    res.json(common.prepare_response(204));
  }
});

// 트윗 작성
router.put('/board', async (req, res, next)=> {
  let body = req.body;
  if( !req.token ){
    res.json(common.prepare_response(401, null, 'Unauthorized'));
    return;
  }

  let seq = await board.board.find().sort({'utime': -1}).limit(1).exec();
  if( seq.length < 1 ){
    seq = 0;
  } else {
    seq = seq[0]['seq']+1;
  }

  await board.board.create({
    name: body.name,
    content: body.content,
    seq: seq,
    utime: +new Date()
  })
      .catch(async (err) =>{
        console.log(123, err);
        res.json(common.prepare_response(449, null, err.name));
      })

  res.json(common.prepare_response(200));
});

// 트윗 리스트
router.get('/board', async (req, res, next)=> {
  let body = req.query;
  let limit;
  if( !body.limit ){
    limit = 5;
  } else {
    limit = Number(body.limit);
  }

  let obj = {
    list: {},
    next: false
  };
  let projection = { _id:0};
  if( Number(body.n) === 1 ){
    // 새로고침
    let where = {
      seq: {$gt: Number(body.seq)}
    };
    let list = await board.board.find(where, projection).sort({'utime': -1}).exec();
    res.json(common.prepare_response(200, list));
  } else {
    // 더보기
    let where = {};
    if (body.seq) {
      where = {
        seq: {$lt: Number(body.seq)}
      };
    }
    let list = await board.board.find(where, projection).sort({'utime': -1}).limit(limit+1).exec();
    if( list.length > limit ){
      obj.next = true;
      obj.list = list.slice(0,limit);
    } else {
      obj.list = list;
    }

    res.json(common.prepare_response(200, obj));
  }
});



module.exports = router;
