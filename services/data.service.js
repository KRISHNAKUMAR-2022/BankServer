const jwt=require('jsonwebtoken')

db = {
  1000: { "acno": 1000, "username": "anoop", "password": 1000, "balance": 6000, transaction: [] },
  1001: { "acno": 1001, "username": "sanoop", "password": 1001, "balance": 6000, transaction: [] },
  1002: { "acno": 1002, "username": "manoop", "password": 1002, "balance": 5000, transaction: [] },
  1003: { "acno": 1003, "username": "tanoop", "password": 1003, "balance": 5000, transaction: [] },
}

var register = (username, acno, password) => {

  if (acno in db) {
    return {
      status: false,
      message: "Already existing user...please log in",
      statusCode: 401
    }
  }
  else {
    db[acno] = {
      acno,
      username,
      password,
      "balance": 0,
      transaction: []
    }
    return {
      status: true,
      message: "Registered successfully ",
      statusCode: 200
    }
  }
}


const login = (acno, pswd) => {

  if (acno in db) {
    if (pswd == db[acno]["password"]) {
      currentUser = db[acno]["username"]
      currentAcno = acno
      token=jwt.sign({
        // store account no inside token
        currentAcno:acno
      },'supersecretkey12345')

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
        message: "incorrect passwod",
        statusCode: 401
      }
    }
  }
  else {
    return {
      status: false,
      message: "user don't exist !",
      statusCode: 401
    }
  }
}


const deposit = (acno, pswd, amt) => {
  // to convert sring to number=> use parseInt()
  var amount = parseInt(amt)
  if (acno in db) {
    if (pswd == db[acno]["password"]) {
      db[acno]["balance"] += amount
      db[acno].transaction.push({
        type: "CREDIT",
        amount: amount
      })
      return {
        status: true,
        message: amount + " Deposited successfully...New balance is " + db[acno]["balance"],
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: "Incorrect Password",
        statusCode: 401
      }
    }
  }
  else {
    return {
      status: false,
      message: "User don't exist !",
      statusCode: 401
    }
  }
}

const withdraw = (acno, pswd, amt) => {
  // to convert sring to number=> use parseInt()
  var amount = parseInt(amt)
  if (acno in db) {
    if (pswd == db[acno]["password"]) {
      if (db[acno]["balance"] > amount) {
        db[acno]["balance"] -= amount
        db[acno].transaction.push({
          type: "DEBIT",
          amount: amount
        })
        return {
          status: true,
          message: amount + " Debited successful...New balance is " + db[acno]["balance"],
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
        message: "Incorrect Password",
        statusCode: 401
      }
    }
  }
  else {
    return {
      status: false,
      message: "User don't exist !",
      statusCode: 401
    }
  }

}

const getTransaction=(acno)=>{
  if(acno in db)
  return {
    status:true,
    statusCode:200,
    transaction:db[acno].transaction
  }
  else{
    return {
      status:false,
      message:"User does't exist !",
      statusCode:401,
    }
  }
}


//   export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction
}
