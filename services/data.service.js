const jwt = require('jsonwebtoken')

// import db
const db = require('./db')

// db = {
//   1000: { "acno": 1000, "username": "anoop", "password": 1000, "balance": 6000, transaction: [] },
//   1001: { "acno": 1001, "username": "sanoop", "password": 1001, "balance": 6000, transaction: [] },
//   1002: { "acno": 1002, "username": "manoop", "password": 1002, "balance": 5000, transaction: [] },
//   1003: { "acno": 1003, "username": "tanoop", "password": 1003, "balance": 5000, transaction: [] },
// }

const register = (username, acno, password) => {
  // asynchronomus 
  return db.User.findOne({
    acno
  }).then(user => {
    if (user) {
      return {
        status: false,
        message: "Already existing user...please log in",
        statusCode: 401
      }
    }
    else {
      const newUser = new db.User({
        acno,
        username,
        password,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
        status: true,
        message: "Registered successfully ",
        statusCode: 200
      }
    }
  })
}


const login = (acno, pswd) => {

  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      currentUser = user.username
      currentAcno = acno
      token = jwt.sign({
        // store account no inside token
        currentAcno: acno
      }, 'supersecretkey12345')
      return {
        status: true,
        message: "Login successful ",
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        status: false,
        message: "Incorrect account number or password",
        statusCode: 401
      }
    }
  })
}



const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      user.balance += amount
      user.transaction.push({
        type: "CREDIT",
        amount: amount
      })
      user.save()
      return {
        status: true,
        message: amount + " Deposited successfully...New balance is " + user.balance,
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: "Invalid account number or password",
        statusCode: 401
      }
    }
  })
}

const withdraw = (acno, pswd, amt) => {
  // to convert sring to number=> use parseInt()
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      if (user.balance > amount) {
        user.balance -= amount
        user.transaction.push({
          type: "DEBIT",
          amount: amount
        })
        user.save()
        return {
          status: true,
          message: amount + " Debited successful...New balance is " + user.balance,
          statusCode: 200
        }
      }
      else {
        return {
          status: false,
          message: "Insufficient Balance",
          statusCode: 422
        }
      }
    }
    else {
      return {
        status: false,
        message: "Invalid account number or password",
        statusCode: 401
      }
    }
  })
}


const getTransaction = (acno) => {
  return db.User.findOne({
    acno
  }).then(user => {
    if (user)
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction
      }
    else {
      return {
        status: false,
        message: "User does't exist !",
        statusCode: 401,
      }
    }
  })
}

//   export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction
}
