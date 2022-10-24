const express = require('express')
const app = express()
const axios = require('axios')
const bcrypt = require('bcrypt')



const DATA = {
  type: 'credentials'
}
function getHeader(user) {
  const HEADER = { 
    headers : { Accept: 'application/json', Authorization: 'Basic ' + btoa(user.email + ':' + user.password) }}
  return HEADER;
}

function getHeaderOptions(jwt){
  const HEADER = {
    headers: {Accept: 'application/json', Authorization: jwt}
  }
  return HEADER;
}



app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended:false}))
app.use(express.static('Nodejs'))
app.use('/css', express.static(__dirname + '/css'))

app.get('/account', (req, res) => {
    res.render('account.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

 /// get JWT from response HEADER
function getCustomerAuthToken(user, res){  
  axios
  .post('https://dev05-na02-fresh.demandware.net/s/RefArch/dw/shop/v22_10/customers/auth?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', DATA, getHeader(user))
  .then((response) => {
      // console.log('Req body:', response.data)
      // console.log('Req header :', response.headers)
      // console.log('Respone', response.status)
      if(response.status == 200){
        console.log("Asta vrem:",response.headers.authorization);
        let jwt = response.headers.authorization;
        getCustomerData(jwt);
        res.redirect('/account');
      } else {
        console.log("Not working...");
      }
  })
  .catch((e) => {
    console.error(e);
    console.log("Not working Error");
  })
}


function getCustomerData(jwt){ 
  console.log("test customer data", getHeaderOptions(jwt));
  axios
  .get('https://dev05-na02-fresh.demandware.net/s/RefArch/dw/shop/v22_10/customers/abrZxZWKKD36NAkmsszpfSr3VP', getHeaderOptions(jwt))
  .then((response) => {
      console.log('Req body:', response.data)
      console.log('Req header :', response.headers)
      console.log('Respone', response.status)
      if(response.status == 200){
        console.log("Customer Data:",response.data);
      } else {
        console.log("Not working...");
      }
      return response;
  })
  .catch((e) => {
    console.error(e)
  })
}

function getCustomerRegister(userTest){
  axios
  .post('https://dev05-na02-fresh.demandware.net/s/RefArch/dw/shop/v22_10/customers', DATA, getHeader(userTest))
  .then((response) => {
      // console.log('Req body:', response.data)
      // console.log('Req header :', response.headers)
      // console.log('Respone', response.status)
      if(response.status == 200){
        console.log("Asta vrem:",response.headers.authorization);
      } else {
        console.log("Not working...");
      }
  })
  .catch((e) => {
    console.error(e);
    console.log("Not working Error");
  })
}


app.post('/login', (req, res) => {
    try {
        console.log(req.body)
        const user = {
            email: req.body.emailLogin,
            password: req.body.passwordLogin
        }
        getCustomerAuthToken(user, res);
        console.log(user);
  
    } catch(err) {
      console.log(err);
    }
  })

  app.post('/register', (req, res) => {
    try {
        console.log(req.body)
        const userTest = {
          password: req.body.passwordRegister,
          customer : {
            login: req.body.emailRegister
          }
        }
        getCustomerRegister(userTest, res);
        console.log(userTest);
  
    } catch(err) {
      console.log(err);
    }
  })

// getCustomerAuthToken();

app.listen(3000)



// function clearInput(elementId){
//   var getValue= document.getElementById(elementId);
//     if (getValue.value !="") {
//         getValue.value = "";
//     }
// }
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const document = new JSDOM('http://localhost:3000/login').window.document;
// console.log(document.getElementsByName("passwordLogin"));