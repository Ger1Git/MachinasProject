const express = require('express')
const app = express()
const axios = require('axios')

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

let loggedUser = {
   name: '',
   username: '',
   email: ''
}

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended:false}))
app.use(express.static('Nodejs'))
app.use('/css', express.static(__dirname + '/css'))

app.get('/account', (req, res) => {
    res.render('account.ejs', { name: loggedUser.name, email: loggedUser.email, username: loggedUser.username})
})

app.get('/homepage', (req, res) => {
  res.render('homepage.ejs')
})

app.get('/contact-us', (req, res) => {
  res.render('contact-us.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/logout', (req, res) =>{
    res.redirect('/login');
})

 /// get JWT from response HEADER
function getCustomerAuthToken(user, res){  
  axios
  .post('https://dev05-na02-fresh.demandware.net/s/RefArch/dw/shop/v22_10/customers/auth?client_id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', DATA, getHeader(user))
  .then((response) => {
      if(response.status == 200){
        console.log("Token:", response.headers.authorization);
        let jwt = response.headers.authorization;
        getCustomerData(jwt);
        res.redirect('/account');
      } else {
        console.log("It's not working...");
        res.redirect('/login');
      }
  })
  .catch((e) => {
    console.error(e);
    console.log("Not working Error");
    res.redirect('/login');
  })
}


function getCustomerData(jwt){ 
  console.log("test customer data", getHeaderOptions(jwt));
  axios
  .get('https://dev05-na02-fresh.demandware.net/s/RefArch/dw/shop/v22_10/customers/abrZxZWKKD36NAkmsszpfSr3VP', getHeaderOptions(jwt))
  .then((response) => {
      if(response.status == 200){
        console.log("Customer Data:",response.data);
        loggedUser.name = response.data.last_name;
        loggedUser.username = response.data.login;
        loggedUser.email = response.data.email;
      } else {
        console.log("It's not working...");
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
      if(response.status == 200){
        console.log("Token:", response.headers.authorization);
      } else {
        console.log("It's not working...");
      }
  })
  .catch((e) => {
    console.error(e);
    console.log("Not working Error");
  })
}


app.post('/login', (req, res) => {
    try {
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

app.listen(3000)

