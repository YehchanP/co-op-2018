var canvasWidth = 1280;
var canvasHeight = 720;

var scanSpeed = 60;
var speedCounter = 0;
var speedLimit = 1500 / scanSpeed;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var stage = "map"; //the different stages

var inventory = {
  fuel: 0,
  iron: 0,
  copper: 0,
  star: 0
};

var sizeOfPlanet = 150;//size of the planets


//NOTE: This is all the variables for the MAP stage
//selecting the x and y position of the circles and the amount of circles
var numberOfCircles = [0,1,2,1,0,1,1,1,1,0]; //number of circles in each row. If the number is 0, then it is a planet.
var radius = 15; //the radius of the circle
var xPosOfCircle; //xposition of the circle
var yPosOfCircle; //the y position of the circle
var totalAmountOfCircles; //total amount of circles used to set the 2d array of y pos of circle
var randomX;
var extraX;
var leftOrRight; // this is to offset the map a bit so it doesnt look like a row
var typeOfPlanet; //takes what type of planet it is
var arrayCounterOfPlanets; //the sepcific array point of the planet
var planetNumber; //gives the value of type planet an integer
var numOfOptions;
var connectionsOfDots; //this is how the dots are connected with the number of options you have. NOTE: They can have a 2 digit number for 2 options
var imageHighlighted; //the image being highlighted (really just a line)
var imageLimit; //the number of image Highlighted maximum
var currentCircle; //What the current circle they are on
var currentX = 0; //the current circles X coordinate
var currentY = 0; //the current circles Y coordinate
var specificY = 0; //find the specific Y value its drawing to

function restart(){
  randomCirclesSpawn();
  totalAmountOfCircles = 0;
  randomX = new Array(numberOfCircles.length);
  xPosOfCircle = [];
  yPosOfCircle = new Array(numberOfCircles.length);
  //for loop creating the number of circles
  for(var i = 0; i < numberOfCircles.length; i++){
    totalAmountOfCircles = numberOfCircles[i]; //it takes the number of circles
    if(totalAmountOfCircles === 0){
      totalAmountOfCircles = 1; //if the number of circles is a planet, then it changes it to a 1
    }
    yPosOfCircle[i] = new Array(totalAmountOfCircles); //it creates the array with that specific number of circle, creating the 2d array
    randomX[i] = new Array(totalAmountOfCircles); //it creates the array with that specific number of circle, creating the 2d array
  }

  //for loop in puting in specific x cordinates
  extraX =  40; //the start position of the circles
  for(var i = 0; i < numberOfCircles.length; i++){
    if(numberOfCircles[i] === 0){
      extraX = extraX + 40; //if the number of circles is 0, meaning a planet, then it would be an extra gap between the circles
      xPosOfCircle[i] = extraX; //the specific x pos of the circle
    } else {
      xPosOfCircle[i] = extraX; //moves a bit differently, so not all of it in a column
    }
    extraX += 120; //adds up to the spacing
  }

  //setting specific Y values to each one
  counter = 0; //sets a counter for the for loop
  for(var i = 0; i < numberOfCircles.length; i++){
    counter = numberOfCircles[i]; //gets the number of circles and makes it the counter for the next for loop
    if(counter === 0)
      counter = 1;//if its 0, changes to 1

    for(var b = 0; b < counter; b++){
      yPosOfCircle[i][b] = Math.floor(Math.random() * 580) + 30; //takes a random y position
      for(var a = 0; a < b; a++){
        if(yPosOfCircle[i][a] >= yPosOfCircle[i][b] - 100 && yPosOfCircle[i][a] <= yPosOfCircle[i][b] + 100){
          yPosOfCircle[i][b] = Math.floor(Math.random() * 580) + 10; //this for loop is to check if theres any other that overlaps, creating gaps in the y position
          a = -1;
        }
      }
      if(numberOfCircles[i] === 0){
        yPosOfCircle[i][b] = Math.floor(Math.random()*100) + 310; //if its 0, then it takes another number closer to the center
      }

      //for creating offsets in the x position
      leftOrRight = Math.floor(Math.random()*3);//gets values from 0 - 2. If 0, then left a bit, if 2 right a bit. if 1 then doesnt move
      if(numberOfCircles[i] === 0){
        leftOrRight = 1;
      }
      if(leftOrRight === 0){
        randomX[i][b] = Math.floor(Math.random()*-20) - 1;//moves -50 to - 1 space to the left
      }else if(leftOrRight === 1){
        randomX[i][b] = 0;//doesnt move period
      }else if(leftOrRight === 2){
        randomX[i][b] = Math.floor(Math.random()*20) + 1; //moves 50 to 1 spaces to the right
      }
    }
  }

  //specific planets
  typeOfPlanet = new Array(numberOfCircles.length); //takes what type of planet it is
  arrayCounterOfPlanets = 0; //the sepcific array point of the planet
  planetNumber = 0; //gives the value of type planet an integer
  for(var i = 0; i < numberOfCircles.length; i++){
    if(numberOfCircles[i] === 0){
      //if the number of circles is 0, so a planet, a random number of the amount of planets we have
      planetNumber = Math.floor(Math.random()*2);
      typeOfPlanet[arrayCounterOfPlanets] = planetNumber;
      arrayCounterOfPlanets++;
    }
  }

  //num of options and path ways in each circle
  numOfOptions = new Array(numberOfCircles.length); //how many times the path is split from the circle
  for(var i=0; i < numberOfCircles.length; i ++){
  	numOfOptions[i] = new Array(numberOfCircles[i]); //creates it as a 2d array
  	var amountOfCircles = numberOfCircles[i]; //amount of circles is a counter
  	if(amountOfCircles === 0){
  		amountOfCircles = 1;
  	}
  	for(var a = 0; a < amountOfCircles; a++){
      if(numberOfCircles[i] === 0 || numberOfCircles[i] === 1){
        // NOTE: this is only when you have one circle in that column
        numOfOptions[i][a] = numberOfCircles[i + 1]; // if its a planet or theres only one option, it will connect to however many circles there are
        if(numberOfCircles[i + 1] === 0){
          numOfOptions[i][a] = 1; //if the next one is a 0, then the number of options would be 1
        }
        if(numOfOptions[i][a] === undefined){
          numOfOptions[i][a] = 0; //if there is no circles after it, number of options doesnt exist so the code does not crash
        }
      }else{
        numOfOptions[i][a] = Math.floor(Math.random()*2) + 1; //either 1 or 2 options
        if(numberOfCircles[i + 1] === 1 || numberOfCircles[i + 1] === 0){
          numOfOptions[i][a] = 1; //if the next circle is 1 or a planet, then the options connect there.
        }
      }
  	}
  }

  //connecting lines into dots using numOfOptions
  connectionsOfDots = new Array(numberOfCircles.length); //this is how the dots are connected with the number of options you have. NOTE: They can have a 2 digit number for 2 options
  for(var i = 0; i < numberOfCircles.length; i++){
    connectionsOfDots[i] = new Array(numberOfCircles[i]); //creates the array
  }
  for(var i = 0; i < numberOfCircles.length; i++){
    var amountOfCircle = numberOfCircles[i]; //amount of circle which is defined by the number there is (just another counter)
    if(amountOfCircle === 0)
      amountOfCircle = 1;
    for(var a = 0; a < amountOfCircle; a++){
      var integerTogether1 = 0; //the first integer (tens value)
      var integerTogether2 = 0; //the second integer (ones value)
      //the two integers are used to make the maps connect the dots
      if(numOfOptions[i][a] === 1){
        //if the number of options at the specific circle is 1, then only one digit is used
        integerTogether2 = Math.floor(Math.random()*numberOfCircles[i + 1]); //gets a random circle from the next column, and puts that as a ones value
      }else if(numOfOptions[i][a] === 2){
        integerTogether1 = Math.floor(Math.random()*numberOfCircles[i + 1]);
        integerTogether2 = Math.floor(Math.random()*2);
        //a series of if statements to decide what integer 2 will be, so it doenst overlap with integer 1
        if(integerTogether1 === 1){
          if(integerTogether2 === 0 && numberOfCircles[i + 1] === 3){
            integerTogether2 = 2;
          }else{
            integerTogether2 = 0;
          }
        }else if(integerTogether1 === 2){
          if(integerTogether2 === 0){
            integerTogether2 = 1;
          }else{
            integerTogether2 = 0;
          }
        }else if(integerTogether1 === 0){
          if(integerTogether2 === 0 && numberOfCircles[i + 1] === 3){
            integerTogether2 = 2;
          }else{
            integerTogether2 = 1;
          }
        }
      }
      connectionsOfDots[i][a] = integerTogether1*10 + integerTogether2; //takes both numbers and puts them into the ararys in which dots it connects to
    }
  }

  //for the highlighted scanner
  yHighlited = []; //highlighted line array
  yHighlitedDirection = [];
  imageHighlighted = -1; //the image being highlighted (really just a line)
  imageLimit = 0; //the number of image Highlighted maximum
  currentCircle = new Array(numberOfCircles.length); //What the current circle they are on
  for(var i = 0; i < numberOfCircles.length; i++){
    var amount = numberOfCircles[i]; //counter
    if(amount === 0)
      amount = 1;
    currentCircle[i] = new Array(amount); //creates the array
  }
  currentCircle[0][0] = "current"; //sets the first planet as the current circle
}

//makes the procedural generation of the map
function randomCirclesSpawn(){
  for(var i = 0; i < numberOfCircles.length; i ++){
      numberOfCircles[i] = 1;
  }
  numberOfCircles[0] = 0;
  numberOfCircles[numberOfCircles.length - 1] = 0;
  var randomPlanetSpawn = Math.floor(Math.random()*2) + 3;
  numberOfCircles[randomPlanetSpawn] = 0;
  for(var i = 0; i < numberOfCircles.length; i++){
    if(numberOfCircles[i] != 0){
      numberOfCircles[i] = Math.floor(Math.random()*2) + 1;
    }
  }

  //the code for linear paths not existing
  for(var i = 1; i < numberOfCircles.length;i++){
    var doubleCheckPath = numberOfCircles[i - 1];
    if(doubleCheckPath === numberOfCircles[i] && numberOfCircles[i] === 1){
      numberOfCircles[i] = 2;
    }
  }
}

window.onload = function() {
    //sets variables
    restart();
    //repeats animation at a fixed rate
    var id = setInterval(animation, scanSpeed);
}

function animation(){
  if(stage === "map"){
    ctx.drawImage(backgroundMap, 0, 0);
    findCurrentCircle(); //finds the current circle
    drawLines(); //draws the lines
    drawHighlight(); //draws the highlighted line
    drawCircle();
    drawHighlightCircle();
    arrayCounterOfPlanets = 0; //type of planet
  }
  if(stage === "back"){
    ctx.drawImage(backgroundMap, 0, 0);
  }
}

//finding the current circles
function findCurrentCircle(){
  for(var x = 0; x < numberOfCircles.length; x++){
    var amount = numberOfCircles[x]; //counter
    if(amount === 0)
      amount = 1;
    for(var y = 0; y < amount; y++){
      if(currentCircle[x][y] === "current"){
        //if they find the current circle, take that x and y value
        currentX = x;
        currentY = y;
        break;
      }
    }
    findOptions(); //after finding the current circle, find options
  }
}

//finding which lines were used
function findOptions(){
  yHighlited = [];
  yHighlitedDirection = [];
  var counter = 0;
  imageLimit = 0;
  if(numOfOptions[currentX][currentY] === 2){
    //if the number of options in that circle is 2, then there is 2 highlited parts and image limit is 2
    yHighlited[counter] = Math.floor(connectionsOfDots[currentX][currentY]/10);
    yHighlitedDirection[counter] = "front";
    counter++;
    imageLimit++;
    yHighlited[counter] = connectionsOfDots[currentX][currentY] - Math.floor(connectionsOfDots[currentX][currentY]/10)*10;
    yHighlitedDirection[counter] = "front";
    counter++;
    imageLimit++;
  }
  if(numOfOptions[currentX][currentY] === 1){
    //if only one option, then only a limit of 1 and only 1 is highlighted
    yHighlited[counter] = connectionsOfDots[currentX][currentY];
    yHighlitedDirection[counter] = "front";
    counter++;
    imageLimit++;
  }
  checkBackOptions(counter);
}

//checks the back options
function checkBackOptions(counter){
  var i = 0;
  for(var a = 0; a < numberOfCircles[currentX - 1]; a++){
    if(numOfOptions[currentX - 1][a] === 1){
      i = connectionsOfDots[currentX - 1][a];
      if(i === currentY){
        yHighlited[counter] = a;
        yHighlitedDirection[counter] = "back";
        counter++;
        imageLimit++;
      }
    }else if(numOfOptions[currentX - 1][a] === 2){
      i = Math.floor(connectionsOfDots[currentX - 1][a]/10);
      if(i === currentY){
        yHighlited[counter] = a;
        yHighlitedDirection[counter] = "back";
        counter++;
        imageLimit++;
      }
      i = connectionsOfDots[currentX - 1][a] - Math.floor(connectionsOfDots[currentX - 1][a]/10)*10;
      if(i === currentY){
        yHighlited[counter] = a;
        yHighlitedDirection[counter] = "back";
        counter++;
        imageLimit++;
      }
    }
  }
}

//drawing the highlighted lines
function drawHighlight(){
    //if its the first imageHighlighted then draws from current circles to the new circle
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle="#FFFF00"; //colour yellow
    if(randomX[currentX + 1] === undefined){

    }else{
      ctx.moveTo(xPosOfCircle[currentX] + randomX[currentX][currentY],yPosOfCircle[currentX][currentY]); //starts from the circle its looking at
      if(yHighlitedDirection[imageHighlighted] === "front")
        ctx.lineTo(xPosOfCircle[currentX + 1] + randomX[currentX + 1][yHighlited[imageHighlighted]],yPosOfCircle[currentX + 1][yHighlited[imageHighlighted]]); //draws to the circle its connecting too
      if(yHighlitedDirection[imageHighlighted] === "back")
        ctx.lineTo(xPosOfCircle[currentX - 1] + randomX[currentX - 1][yHighlited[imageHighlighted]],yPosOfCircle[currentX - 1][yHighlited[imageHighlighted]]); //draws to the circle its connecting too
      ctx.stroke();
    }
    if(speedCounter === speedLimit){
      speedCounter = 0;
      imageHighlighted += 1;
      if(imageHighlighted === imageLimit){
        imageHighlighted = 0;
      }
    }
    speedCounter++;
}

//drawing the highlighted circles
function drawHighlightCircle(){
  ctx.beginPath();
  ctx.fillStyle = 'yellow';
  if(yHighlited[imageHighlighted] != undefined){
    if(yHighlitedDirection[imageHighlighted] === "front")
      ctx.arc(xPosOfCircle[currentX + 1] + randomX[currentX + 1][yHighlited[imageHighlighted]],yPosOfCircle[currentX + 1][yHighlited[imageHighlighted]],radius,0,2*Math.PI); //draws a circle in the specific placement
    if(yHighlitedDirection[imageHighlighted] === "back")
      ctx.arc(xPosOfCircle[currentX - 1] + randomX[currentX - 1][yHighlited[imageHighlighted]],yPosOfCircle[currentX - 1][yHighlited[imageHighlighted]],radius,0,2*Math.PI); //draws a circle in the specific placement
  }
  ctx.fill();
  if(numberOfCircles[currentX + 1] === 0 && yHighlitedDirection[imageHighlighted] === "front"){
    ctx.drawImage(highlight,xPosOfCircle[currentX + 1] - sizeOfPlanet/2,yPosOfCircle[currentX + 1][yHighlited[imageHighlighted]] - sizeOfPlanet/2,sizeOfPlanet + 10,sizeOfPlanet + 10);
    ctx.drawImage(planet,xPosOfCircle[currentX + 1] - sizeOfPlanet/2,yPosOfCircle[currentX + 1][yHighlited[imageHighlighted]] - sizeOfPlanet/2,sizeOfPlanet,sizeOfPlanet);
  }
}

//drawing the specific pathways
var specificY = 0; //find the specific Y value its drawing to
function drawLines(){
  for(var x = 0; x < numberOfCircles.length; x++){
    var counterOfCircles = numberOfCircles[x]; //another counter for the foor loop
    if(counterOfCircles === 0){
      counterOfCircles = 1;
    }
    for(var y = 0; y < counterOfCircles; y++){
      specificY = 0; //sets speificY = 0
      if(numOfOptions[x][y] === 2){
        specificY = Math.floor(connectionsOfDots[x][y]/10); //takes the first integer which is the next columns circle its drawing too
        drawingSpecificLines(x,y);//takes the x and y of current circle and starts drawing from there
        specificY = connectionsOfDots[x][y] - Math.floor(connectionsOfDots[x][y]/10)*10; //takes the second integer which is also another circle
        drawingSpecificLines(x,y); //tkaes the x and y of current circle and draws it from there
      }else if(numOfOptions[x][y] === 1){
        specificY = connectionsOfDots[x][y]; //takes the one digit
        drawingSpecificLines(x,y); //drawing from the x and y of current circle
      }
    }
  }
}

function drawingSpecificLines(x,y){
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.strokeStyle="#FFFFFF";
  ctx.moveTo(xPosOfCircle[x] + randomX[x][y],yPosOfCircle[x][y]); //starts from the circle its looking at
  ctx.lineTo(xPosOfCircle[x + 1] + randomX[x + 1][specificY],yPosOfCircle[x + 1][specificY]); //draws to the circle its connecting too
  ctx.stroke();
}

//drawing the specific circles
function drawCircle(){
  for(var x = 0; x < numberOfCircles.length;x++){
    var circleCounter = numberOfCircles[x]; //counter again
    if(circleCounter === 0){
      circleCounter = 1;
    }
    for(var y = 0; y < circleCounter; y++){
      if(numberOfCircles[x] === 0){
        //if its a planet, it will draw a planet from the type of planets we have
        if(typeOfPlanet[arrayCounterOfPlanets] === 1){
          ctx.drawImage(planet,xPosOfCircle[x] - sizeOfPlanet/2,yPosOfCircle[x][y] - sizeOfPlanet/2,sizeOfPlanet,sizeOfPlanet);
        }else if(typeOfPlanet[arrayCounterOfPlanets] === 0){
          ctx.drawImage(planet,xPosOfCircle[x] - sizeOfPlanet/2,yPosOfCircle[x][y] - sizeOfPlanet/2,sizeOfPlanet,sizeOfPlanet);
        }
        arrayCounterOfPlanets++; //array moves up for different planets
      }else{
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(xPosOfCircle[x] + randomX[x][y],yPosOfCircle[x][y],radius,0,2*Math.PI); //draws a circle in the specific placement
        ctx.fill();
      }
    }
  }
}

window.onkeyup = function(e){
  if(e.key = " "){
    if(stage === "map"){
      if(yHighlited[imageHighlighted] != undefined){
        if(imageHighlighted >= 0){
          currentCircle[currentX][currentY] = undefined;
          if(yHighlitedDirection[imageHighlighted] === "front")
            currentCircle[currentX + 1][yHighlited[imageHighlighted]] = "current"; //changes the current circle to a new stage
          if(yHighlitedDirection[imageHighlighted] === "back")
            currentCircle[currentX - 1][yHighlited[imageHighlighted]] = "current"; //changes the current circle to a new stage
          imageLimit = 0;
          imageHighlighted = -1;
          speedCounter = 0;
        }
      }
    }
  }
}
