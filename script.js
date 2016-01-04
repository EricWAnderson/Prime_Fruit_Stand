var user = {
  totalCash: 100,
}

// How long do you want to play?
var gameTime = 300000;

// Is time up?
var timeout = false;
// Time counter
var totalTime = 0;

var apple = new Fruit('apple', 5.00);
var orange = new Fruit('orange', 5.00);
var banana = new Fruit('banana', 5.00);
// var grapes = new Fruit('grapes', 7.50);
var pear = new Fruit('pear', 5.00);

var fruitArray = [apple, orange, banana, pear];

setInterval(function() {
  if (!timeout){
    totalTime += 1;
    //console.log("Seconds elapsed: ", totalTime);
    $(".remaining").text( (gameTime /1000) - totalTime );
  }
}, 1000);

setInterval(function() {
  if (!timeout) {
  for (var i = 0; i < fruitArray.length; i++) {
    fruitArray[i].changePrice();
  }

  }
}, 15000);

// This function will end the game
window.setTimeout(function(){
  timeout = true;
 
  for (var i = 0; i < fruitArray.length; i++) {
    if (user[fruitArray[i].name]) {
      while (user[fruitArray[i].name].inventory > 0) {
        sellFruit(user, fruitArray[i]);
      }
    }
  }
 // alert("Game over!!\nYour final cash total: $" + user.totalCash.toFixed(2));
  // remove buy /sell buttons
  $('#fruit-stand').slideUp();
  $('.user-interface').prepend('<h1>* ~ ! ~ GAME OVER ~ ! ~ *</h1>');
  $('.greeting').text("Please leave the");
}, gameTime);

$(document).ready(function(){
  // Print initial time remaining to dom
  $(".remaining").text(gameTime/1000);

  for (var i = 0; i < fruitArray.length; i++) {
    fruitArray[i].changePrice();
  }
  updateCash(user);

  //listen to buy button)
  $(".buy").on('click', function(){
    if(!timeout) {
      var buttonClass = $(this).parent().attr('class');
      buttonClass = buttonClass.substring(0, buttonClass.length - 6);
      for (var i = 0; i < fruitArray.length; i++) {
        if (buttonClass == fruitArray[i].name) {
          buyFruit(user, fruitArray[i]);
        }
      }
    }
  });
  // listen to sell fruit
  $(".sell").on('click', function(){
    if(!timeout) {
      var buttonClass = $(this).parent().attr('class');
      // Because fruit-stand always ends with 6 characters
      buttonClass = buttonClass.substring(0, buttonClass.length - 6);
      for (var i = 0; i < fruitArray.length; i++) {
        if (buttonClass == fruitArray[i].name) {
          sellFruit(user, fruitArray[i]);
        }
      }
    }
  });

});

function sellFruit(user, sold) {
  if (!user[sold.name] || user[sold.name].inventory <= 0) {
      console.log('try again');
      return false;
    } else {
      user.totalCash += sold.price;
    }

  user[sold.name].inventory--;

  updateCash(user);
  return true;
}


function buyFruit(user, purchase) {
  if (!user[purchase.name]) {
    user[purchase.name] = {
      numberPurchased: 0,
      avgPrice: 0,
      inventory: 0
    };
    console.log('no fruit');
  } else { console.log('you have the fruit'); }

  if (user.totalCash - purchase.price < 0) {
    console.log('try again');
    return;
  } else {
    user.totalCash -= purchase.price;
  }

  var bought = user[purchase.name].numberPurchased;
  var avg = user[purchase.name].avgPrice;

  user[purchase.name].numberPurchased++;
  user[purchase.name].inventory++;

  user[purchase.name].avgPrice = (bought * avg + purchase.price) / (bought + 1);

  updateCash(user);
}

function Fruit(name, price) {
  this.name = name;
  this.price = parseFloat(price);

  this.changePrice = function() {
    if (this.price - .5 < 0.5) {
      var lowerBound = (this.price * 100) - 50;
      this.price += randomNumber(lowerBound, 50) / 100;
      this.price = Math.round(this.price*100) / 100;
    } else if (this.price + .5 > 9.99) {
      var upperBound = 999 - ((this.price) * 100);
      this.price += randomNumber(-50, upperBound) / 100;
      this.price = Math.round(this.price*100) / 100;
    } else {
      this.price += randomNumber(-50, 50) / 100;
      this.price = Math.round(this.price*100) / 100;
    }
    updateDomPrice(this);
  }
}

function updateCash(user) {
  //print totalcash
  $('.user-totalCash').text("$" + user.totalCash.toFixed(2));
  //print inventory
  for (key in user) {
    if (key != 'totalCash') {
      $('.user-' + key).text(user[key].inventory);
      $('.avg-' + key).text("avg price: " + user[key].avgPrice.toFixed(2));
    }
  }
}

function updateDomPrice(fruit) {
  //this is a placeholder
  $el = $("."+fruit.name.toString());
  $el.text("$" + fruit.price.toFixed(2));
}


function randomNumber(min, max) {
	return Math.floor(Math.random() * (1 + max - min) + min);
}
