

// Get express module
var express = require('express');
// Iniate express module with the Javascript file
var app = express();

// Pull pool data from dbcon folder.
var mysql = require('./dbcon.js');


// Get express handlebars
var expHandle = require('express-handlebars');

app.engine('handlebars', expHandle());
// When passing a a parameter, it will assume it's a file with .handlebars extension.
app.set('view engine', 'handlebars');

// Parses JSON forms and HTML query pairs
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Random port to be listening on.
app.set('port', 7667);

// Link handlebars to public folder.
app.use(express.static('public'));



// Running tests
app.get('/testMe', function(req, res) {
  var context = {};
  context.jsscripts = ['testMe.js'];

});



// Renders the Customer's page AND showing Customer data.
app.get('/customers', function(req, res, err) {
  var context = {};
  context.jsscripts = ["customers.js"];
  mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name`, `email`, `reward_ID` FROM `Customers`', function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `reward_ID`, `reward_name` FROM `Rewards`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `first_name`, `last_name`, `email`, `reward_name` FROM `Customers` C LEFT JOIN `Rewards` R ON R.reward_ID = C.reward_ID',
      function(err, results3, fields){
        if(err){
          next(err);
          return;
        }
        context.list = results
        context.array = results2
        context.stuff = results3
        res.render('customers', context);
      })
    }) 
  })
});


// Renders the Customer's page AFTER adding a Customer.
app.post('/customers', function(req, res, err) {
  var context = {};
  context.jsscripts = ["customers.js"];
  mysql.pool.query('INSERT INTO `Customers`(`first_name`, `last_name`, `email`) VALUES (?,?,?)',
  [req.body.first_name, req.body.last_name, req.body.email],  
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name`, `email`, `reward_ID` FROM `Customers`', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `reward_ID`, `reward_name` FROM `Rewards`', function(err, results2, fields){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT `first_name`, `last_name`, `email`, `reward_name` FROM `Customers` C LEFT JOIN `Rewards` R ON R.reward_ID = C.reward_ID',
        function(err, results3, fields){
          if(err){
            next(err);
            return;
          }
          context.list = results
          context.array = results2
          context.stuff = results3
          res.render('customers', context);
        })
      }) 
    })
  })
});


// Renders the Customer's page AFTER updating a Customer.
/*
app.put('/customers', function(req, res, err) {
  console.log(req.body)
  var context = {};
  context.jsscripts = ["customers.js"];
  mysql.pool.query('UPDATE `Customers` SET `first_name`=?, `last_name`=?, `email`=? WHERE `customer_ID`=?',
  [req.body.first_name, req.body.last_name, req.body.email, req.body.customer_ID],  
  function(err, results4, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name`, `email`, `reward_ID` FROM `Customers`', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `reward_ID`, `reward_name` FROM `Rewards`', function(err, results2, fields){
        if(err){
          console.log(err)
          next(err);
          return;
        }
        mysql.pool.query('SELECT `first_name`, `last_name`, `email`, `reward_name` FROM `Customers` C LEFT JOIN `Rewards` R ON R.reward_ID = C.reward_ID',
        function(err, results3, fields){
          if(err){
            console.log(err)
            next(err);
            return;
          }
          context.list = results
          context.array = results2
          context.stuff = results3
          res.render('customers', context);
        })
      }) 
    })
  })
});
*/


app.get('/updatecustomers', function(req, res, err) {
  var context = {};
  context.jsscripts = ["updatecustomers.js"];
  mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name`, `email` FROM `Customers` WHERE `customer_ID` = ?',[req.query.customer_ID], function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    context.list = results[0]
    res.render('updatecustomers', context);
  })
});


// Renders update page
app.post('/updatecustomers', function(req, res, err) {
  var context = {};
  context.jsscripts = ["updatecustomers.js"];
  mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name`, `email` FROM `Customers` WHERE `customer_ID` = ?',[req.body.customer_ID], function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    context.list = results[0]
    res.render('updatecustomers', context);
  })
});


// Renders the Customer's page AFTER updating a Customer.
app.put('/updatecustomers', function(req, res, err) {
  var context = {};
  context.jsscripts = ["updatecustomers.js"];
  mysql.pool.query('UPDATE `Customers` SET `first_name`=?, `last_name`=?, `email`=? WHERE `customer_ID` = ?',[req.body.first_name, req.body.last_name, req.body.email, req.body.customer_ID], function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    res.render('updatecustomers');
  })
});




// Renders the Customer's page AFTER updating a reward associated with the customers.
app.put('/custreward', function(req, res, err) {
  var context = {};
  context.jsscripts = ["customers.js"];
  var normal = [req.body.reward_ID];
  //console.log(normal);
  // Updates a Customer's Reward ID to NULL.
  if (normal == 'blah') {
    mysql.pool.query('UPDATE `Customers` SET `reward_ID`=NULL WHERE `customer_ID` = ?',
    [req.body.customer_ID],  
    function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name`, `email` FROM `Customers`', function(err, results2, fields) {
        if (err) {
          next(err);
          return;
        }
        mysql.pool.query('SELECT `reward_ID`, `reward_name` FROM `Rewards`', function(err, results3, fields){
          if(err){
            next(err);
            return;
          }
          context.list = results2
          context.array= results3
          res.render('customers', context);
        }) 
      })
    })
    // Updates a Customer's Reward ID to a value that's not NULL.
  } else {
  mysql.pool.query('UPDATE `Customers` SET `reward_ID`=? WHERE `customer_ID` = ?',
  [req.body.reward_ID, req.body.customer_ID],  
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name`, `email` FROM `Customers`', function(err, results2, fields) {
      if (err) {
        next(err);
        return;
      }
      mysql.pool.query('SELECT `reward_ID`, `reward_name` FROM `Rewards`', function(err, results3, fields){
        if(err){
          next(err);
          return;
        }
        context.list = results2
        context.array= results3
        res.render('customers', context);
      }) 
    })
  })
}
});


// Renders the Customer's page AFTER deleting a Customer.
app.delete('/customers', function(req, res, err) {
  var context = {};
  context.jsscripts = ["customers.js"];
  mysql.pool.query('DELETE FROM `Customers` WHERE `customer_ID`=?',
  [req.body.customer_ID],  
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name`, `email`, `reward_ID` FROM `Customers`', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `reward_ID`, `reward_name` FROM `Rewards`', function(err, results2, fields){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT `first_name`, `last_name`, `email`, `reward_name` FROM `Customers` C LEFT JOIN `Rewards` R ON R.reward_ID = C.reward_ID',
        function(err, results3, fields){
          if(err){
            next(err);
            return;
          }
          context.list = results
          context.array = results2
          context.stuff = results3
          res.render('customers', context);
        })
      }) 
    })
  })
});




//------Rewards----------------------------------------------------------------------------------------------------------------------------------------------------


// Renders the Rewards page.
app.get('/rewards', function(req, res, err) {
  var context = {};
  context.jsscripts = ["rewards.js"];
  mysql.pool.query('SELECT `reward_ID`, `reward_name`, `description` FROM `Rewards`', function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    context.list = results
    res.render('rewards', context);

  })
});



// Renders the Rewards page AFTER inserting a Reward
app.post('/rewards', function(req, res, err) {
  var context = {};
  context.jsscripts = ["rewards.js"];
  mysql.pool.query('INSERT INTO `Rewards`(`reward_name`, `description`) VALUES (?,?)',
  [req.body.reward_name, req.body.description], 
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `reward_ID`, `reward_name`, `description` FROM `Rewards`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2
      res.render('rewards', context);
    })
  })
});


// Renders the Rewards page AFTER updating
app.put('/rewards', function(req, res, err) {
  var context = {};
  context.jsscripts = ["rewards.js"];
  mysql.pool.query('UPDATE `Rewards` SET description=? WHERE reward_ID=?',
  [req.body.description, req.body.reward_ID],  
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `reward_ID`, `reward_name`, `description` FROM `Rewards`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2
      res.render('rewards', context);
    })
  })
});


// Renders the Rewards page AFTER deleting
app.delete('/rewards', function(req, res, err) {
  var context = {};
  context.jsscripts = ["rewards.js"];
  mysql.pool.query('DELETE FROM `Rewards` WHERE reward_ID = ?',[req.body.reward_ID],
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `reward_ID`, `reward_name`, `description` FROM `Rewards`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2
      res.render('rewards', context);
    })
  })
});



//---------------Items--------------------------------------------------------------------------------------------------------------------

// Renders the Items page.
app.get('/items', function(req, res, err) {
  var context = {};
  context.jsscripts = ["items.js"];
  mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    context.list = results
    res.render('items', context);
  })
});



// Renders the Rewards page AND showing REWARD data.
app.get('/showitems', function(req, res, err) {
  var context = {};
  context.jsscripts = ["items.js"];
  var order = req.query.itemFilter;
  //console.log(order);
  if(order == 'normal') {
    mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
     // console.log('gateway1')
      context.list = results
      res.render('showitems', context);
    })
  } else if (order == 'price') {
  mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items` ORDER BY price', function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    //console.log('gateway2')
    context.list = results
    res.render('showitems', context);
  })
  } else {
    mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items` ORDER BY name', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      //console.log('gateway3')
      context.list = results
      res.render('showitems', context);
    })
  }
});


// Renders the Item page AFTER inserting
app.post('/items', function(req, res, err) {
  var context = {};
  context.jsscripts = ["items.js"];
  mysql.pool.query('INSERT INTO `Items`(`name`, `price`) VALUES (?,?)',
  [req.body.name, req.body.price], 
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2
      res.render('items', context);
    })
  })
});



// Renders the Items page AFTER updating
app.put('/items', function(req, res, err) {
  var context = {};
  context.jsscripts = ["items.js"];
  mysql.pool.query('UPDATE `Items` SET price=? WHERE item_ID=?',
  [req.body.price, req.body.item_ID],  
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2
      res.render('items', context);
    })
  })
});


// Renders the Items page AFTER deleting
app.delete('/items', function(req, res, err) {
  var context = {};
  context.jsscripts = ["items.js"];
  mysql.pool.query('DELETE FROM `Items` WHERE item_ID = ?',[req.body.item_ID],
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2
      res.render('items', context);
    })
  })
});

//-------------Bills----------------------------------------------------------------------------------------------------------------------

// Render Bills page
app.get('/bills', function(req, res, err) {
  var context = {};
  context.jsscripts = ["bills.js"];
  mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    context.list = results
    res.render('bills', context);
  })
});


/*
app.get('/bills', function(req, res, err) {
  console.log("BILLS");
  var context = {};
  context.jsscripts = ["bills.js"];
  var sql = 'SELECT `bill_ID`, `amount` FROM `Bills`; \
  SELECT `item_ID`, `name` FROM `Items`; \
  INSERT INTO `Bills` (amount) VALUES (0.00) ; \
  SELECT `bill_ID` FROM `Bills` ORDER BY `bill_ID` DESC LIMIT 1';
  mysql.pool.query(sql, function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    // Context list = list of the SQL query outcomes
    context.list = results

    // SQL queries in this response:
    // 0 = Select all bill_ID from Bills
    // 1 = Select all item_ID and names from Items
    // 2 = Inserts a new row into Bill (so an ItemBill can be created)
    // 3 = Selects latest bill_ID from Bill (the new bill)
    // Store context list[3] (Selects the last bill_ID after inserting) after stringify with JSON to access the bill_ID
    var testresult = Object.values(JSON.parse(JSON.stringify(context.list[3])));
    // Test to make sure the actual bill_ID INT is accessible
    console.log(testresult[0].bill_ID);
    // render and create an object to access data in handlebars side, 
    // e1 = bill_ID INT
    // items = list of item names
    res.render('bills', {
      example: {
        e1: testresult[0].bill_ID,
        items: context.list[1],
        bills: context.list[0]
      }
    });
  })
});
*/


// Renders the Bills page AFTER inserting
app.post('/bills', function(req, res, err) {
  var context = {};
  context.jsscripts = ["bills.js"];
  mysql.pool.query('INSERT INTO `Bills`(`amount`) VALUES (0.00)',
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2
      res.render('bills', context);
    })
  })
});


// Renders the Bills page AFTER deleting
app.delete('/bills', function(req, res, err) {
  var context = {};
  context.jsscripts = ["bills.js"];
  mysql.pool.query('DELETE FROM `Bills` WHERE bill_ID = ?',[req.body.bill_ID],
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2
      res.render('bills', context);
    })
  })
});


//----------------------------Item Bill--------------------------------------------------------------------------------------------------


// Renders the itembills page.
app.get('/itembills', function(req, res, err) {
  var context = {};
  context.jsscripts = ["itembills.js"];
  mysql.pool.query('SELECT `ib_ID`, `bill_ID`, `name`, `quantity` FROM `ItemBills` IB JOIN `Items` I ON I.item_ID = IB.item_ID ', function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results3, fields){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT B.bill_ID as bill_ID, SUM(`quantity` * `price`) AS TOTAL FROM `Bills` B JOIN `ItemBills` IB ON IB.bill_ID = B.bill_ID JOIN `Items` I ON I.item_ID = IB.item_ID GROUP BY bill_ID', function(err, results4, fields){
          if(err){
            next(err);
            return;
          }
    context.calculation = results4
    context.list = results2
    context.array = results3
    context.stuff = results
    res.render('itembills', context);
      })
    })
   })
  })
});


//Renders the itembills page AFTER Inserting.
app.post('/itembills', function(req, res, err) {
  var context = {};
  context.jsscripts = ["itembills.js"];
  mysql.pool.query('INSERT INTO `ItemBills`(`item_ID`, `bill_ID`, `quantity`) VALUES (?,?,?)',
  [req.body.item_ID, req.body.bill_ID, req.body.quantity],  
  function(err, results5, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `ib_ID`, `bill_ID`, `name`, `quantity` FROM `ItemBills` IB JOIN `Items` I ON I.item_ID = IB.item_ID ', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results2, fields){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results3, fields){
          if(err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT B.bill_ID as bill_ID, SUM(`quantity` * `price`) AS TOTAL FROM `Bills` B JOIN `ItemBills` IB ON IB.bill_ID = B.bill_ID JOIN `Items` I ON I.item_ID = IB.item_ID GROUP BY bill_ID', function(err, results4, fields){
            if(err){
              next(err);
              return;
            }
      context.calculation = results4
      context.list = results2
      context.array = results3
      context.stuff = results
      res.render('itembills', context);
        })
      })
     })
    })
  })
});


/*
app.post('/itembills', function(req,res,err){
  console.log("Went Item Bills");
  var context = {};
  var billIDlocal;
  //context.jsscripts = ["itembillcreate.js"];
  mysql.pool.query('INSERT INTO `ItemBill`(`bill_ID`, `item_ID`, `quantity`) VALUES (?,?,?)',
  [req.body.itembill_bill_ID, req.body.itembill_item_ID, req.body.itembill_quantity], 
  function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    billIDlocal = req.body.itembill_bill_ID;
    mysql.pool.query('SELECT `item_ID`, `name` FROM `Items`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      context.list = results2;
      var items = context.list;
      console.log("Item bills selects: ");
      console.log(items);
      res.render('itembills', {
        data: {
          bill_ID: billIDlocal,
          itemNames: items
        }
      });
    })
  })
});
*/


// Renders the itemsbills page after DELETING
app.delete('/itembills', function(req, res, err) {
  var context = {};
  context.jsscripts = ["itembills.js"];
  mysql.pool.query('DELETE FROM `ItemBills` WHERE `ib_ID` = ?',[req.body.ib_ID],  
  function(err, results5, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `ib_ID`, `bill_ID`, `name`, `quantity` FROM `ItemBills` IB JOIN `Items` I ON I.item_ID = IB.item_ID ', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results2, fields){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results3, fields){
          if(err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT B.bill_ID as bill_ID, SUM(`quantity` * `price`) AS TOTAL FROM `Bills` B JOIN `ItemBills` IB ON IB.bill_ID = B.bill_ID JOIN `Items` I ON I.item_ID = IB.item_ID GROUP BY bill_ID', function(err, results4, fields){
            console.log(results4)
            if(err){
              next(err);
              return;
            }
      context.calculation = results4
      context.list = results2
      context.array = results3
      context.stuff = results
      res.render('itembills', context);
        })
      })
     })
    })
  })
});


// Renders the itemsbills page after UPDATING A BILL.
app.put('/itembills', function(req, res, err) {
  var context = {};
  context.jsscripts = ["itembills.js"];
  mysql.pool.query('UPDATE `Bills` SET amount=? WHERE bill_ID=?',
  [req.body.amount, req.body.bill_ID],  
  function(err, results5, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `ib_ID`, `bill_ID`, `name`, `quantity` FROM `ItemBills` IB JOIN `Items` I ON I.item_ID = IB.item_ID ', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `item_ID`, `name`, `price` FROM `Items`', function(err, results2, fields){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results3, fields){
          if(err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT B.bill_ID as bill_ID, SUM(`quantity` * `price`) AS TOTAL FROM `Bills` B JOIN `ItemBills` IB ON IB.bill_ID = B.bill_ID JOIN `Items` I ON I.item_ID = IB.item_ID GROUP BY bill_ID', function(err, results4, fields){
            if(err){
              next(err);
              return;
            }
      context.calculation = results4
      context.list = results2
      context.array = results3
      context.stuff = results
      res.render('itembills', context);
        })
      })
     })
    })
  })
});

/*
// Renders the bills page after UPDATING A BILL.
app.put('/itembills', function(req, res, err) {
  var context = {};
  context.jsscripts = ["bills.js"];
  mysql.pool.query('UPDATE `Bills` SET amount=? WHERE bill_ID=?',
  [req.body.amount, req.body.bill_ID],  
  function(err, results5, fields){
    if(err){
      console.log(err);
      next(err);
      return;
    }
      mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results, fields){
        if(err){
          next(err);
          return;
        }
      context.list = results
      res.render('bills', context);
    })
  })
});
*/


//-------------Orders----------------------------------------------------------------------------------------------------------------------

// Renders the Orders page.
app.get('/orderssss', function(req, res, err) {
  var context = {};
  context.jsscripts = ["orders.js"];
  mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name` FROM `Customers`', function(err, results, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results2, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `order_ID` FROM `Orders`', function(err, results3, fields){
        if(err){
          next(err);
          return;
        }
      context.list = results
      context.array = results2
      context.stuff = results3
      res.render('orders', context);
    }) 
  })
})
});


// Renders the Orders page and SHOWS orders.
app.get('/orders', function(req, res, err) {
  var context = {};
  context.jsscripts = ["orders.js"];
  mysql.pool.query('SELECT `order_ID`, `first_name`, `last_name`, `amount`, `reward_used` from `Orders` O  JOIN `Customers` C ON C.customer_ID = O.customer_ID JOIN `Bills` B ON B.bill_ID = O.bill_ID', function(err, results3, fields){
    if(err){
      next(err);
      return;
    }
    // Converts MySQL BOOLEAN to true and false
    var convertBool;
    for (var i = 0; i < results3.length; i++) {
      convertBool = results3[i].reward_used
      if (convertBool == 0) {
        results3[i].reward_used = false
      } else {
        results3[i].reward_used = true
      }
    };
    mysql.pool.query('SELECT `order_ID` FROM `Orders`', function(err, results4, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name` FROM `Customers`', function(err, results, fields) {
        if (err) {
          next(err);
          return;
        }
        mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results2, fields){
          if(err){
            next(err);
            return;
          }
          context.thing = results4
          context.stuff = results3
          context.list = results
          context.array = results2
          res.render('orders', context); 
      }) 
    })
    })
  })
});


// Renders the Orders page AFTER inserting
// If customer uses reward, updates their reward status.
app.post('/orders', function(req, res, err) {
  var context = {};
  context.jsscripts = ["orders.js"];
  mysql.pool.query('INSERT INTO `Orders`(`customer_ID`, `bill_ID`, `reward_used`) VALUES (?,?,?)',
  [req.body.customer_ID, req.body.bill_ID, req.body.reward_used], 
  function(err, results5, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `order_ID`, `first_name`, `last_name`, `amount`, `reward_used` from `Orders` O  JOIN `Customers` C ON C.customer_ID = O.customer_ID JOIN `Bills` B ON B.bill_ID = O.bill_ID', function(err, results3, fields){
      if(err){
        next(err);
        return;
      }
      // Converts MySQL Boolean to true and false.
      var convertBool;
      for (var i = 0; i < results3.length; i++) {
        convertBool = results3[i].reward_used
        if (convertBool == 0) {
          results3[i].reward_used = false
        } else {
          results3[i].reward_used = true
        }
      };
      mysql.pool.query('SELECT `order_ID` FROM `Orders`', function(err, results4, fields){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name` FROM `Customers`', function(err, results, fields) {
          if (err) {
            next(err);
            return;
          }
          mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results2, fields){
            if(err){
              next(err);
              return;
            }
            if (req.body.reward_used == 1) {
              mysql.pool.query('UPDATE `Customers` SET `reward_ID`=NULL WHERE `customer_ID` = ?',
              [req.body.customer_ID],  
              function(err, results5, fields){
                if(err){
                  next(err);
                  return;
                }
              }
            )}
            context.thing = results4
            context.stuff = results3
            context.list = results
            context.array= results2
            res.render('orders', context); 
        }) 
      })
      })
    })
  })
});


// Renders the Orders page AFTER deleting
app.delete('/orders', function(req, res, err) {
  var context = {};
  context.jsscripts = ["orders.js"];
  mysql.pool.query('DELETE FROM `Orders` WHERE `order_ID` = ?',[req.body.order_ID],
  function(err, results4, fields){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT `customer_ID`, `first_name`, `last_name` FROM `Customers`', function(err, results, fields){
      if(err){
        next(err);
        return;
      }
      mysql.pool.query('SELECT `bill_ID`, `amount` FROM `Bills`', function(err, results2, fields){
        if(err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT `order_ID` FROM `Orders`', function(err, results3, fields){
          if(err){
            next(err);
            return;
          }
        context.list = results
        context.array = results2
        context.stuff = results3
        res.render('orders', context);
      }) 
    })
  })
}) 
});





// Route for a 404 error.
app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  });
  
  // Route for a 500 error.
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
  });
  
  app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });