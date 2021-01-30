var dog, sadDog, happyDog, happyDogBark;
var database;
var foodS, foodStock, clickFood;
var fedTime, lastFed;
var feed, addFood;
var foodObj;


function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happydog.png");
  happyDogBark=loadSound("happyBark.mp3")
  clickFood=loadSound("clickFood.mp3")
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  textFont("Algerian")
  
  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background("orange");
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    textFont("Algerian")
    text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
  } else if (lastFed == 0) {
    textFont("Algerian")
    text("Last Feed : 12 AM", 350, 30);
  } else {
    textFont("Algerian")
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog() {
  dog.addImage(happyDog);
  happyDogBark.play()

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFoods() {
  clickFood.play();
  foodS++;
  database.ref('/').update({
    Food: foodS
  }) 
}



