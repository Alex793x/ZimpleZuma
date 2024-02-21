"use strict"

window.addEventListener("load", start);

function start() {
  console.log(`Started`);
  
  // create balls
  test_createBalls();
  
  // load cannon with a random ball
  reloadCannon();
}

// A test-function to create six test-balls
// feel free to experiment with, or replace this function
// this is just for a demonstration ...
function test_createBalls() {
  addBallToChain(createBallElement(1));
  addBallToChain(createBallElement(2));
  addBallToChain(createBallElement(3));
  addBallToChain(createBallElement(4));
  addBallToChain(createBallElement(5));
  addBallToChain(createBallElement(6));
}

function reloadCannon() {
  // loads the cannon with a random ball
  const balltype = Math.ceil(Math.random()*8); 
  loadCannonWithBall(createBallElement(balltype));
}




// *** GRAPHICS / VIEW ***

function clickBall(event) {
  console.log('Clicked ball');

  // figure out if clicked on the left or right side
  const side = event.offsetX / event.target.offsetWidth < .5 ? "before" : "after";

  // use the cannonBall as the new element
  const newBall = cannonBall;

  // Remember the starting-position of the cannonBall - before inserting in the chain
  const source = newBall.getBoundingClientRect();

  // find the clicked ball (the div that contains the img clicked)
  const existingBall = event.target.parentElement;
  if(side === "before") {
    // insert cannonBall before existing ...
    existingBall.parentNode.insertBefore(newBall, existingBall);
  } else {
    // insert cannonBall after this
    existingBall.parentNode.insertBefore(newBall, existingBall.nextElementSibling);
  }

  // now the cannonBall is inserted in the chain - but it has to be animated, so FLIP it
  // Keep the div where it is, only animate the img.
  const img = newBall.firstElementChild;
  // 1. Find current position of the cannonball - that is the destination
  const dest = img.getBoundingClientRect();
  
  // 2. Translate it back to the starting-position
  const deltaX = source.x - dest.x;
  const deltaY = source.y - dest.y;

  // 3. Animate it to destination-position (translate->0)
  img.style.setProperty("--delta-x", deltaX + "px");
  img.style.setProperty("--delta-y", deltaY + "px");
  img.classList.add("animatefromcannon");
  // while doing that - animate the space
  newBall.classList.add("expand");

  newBall.addEventListener("animationend", animationComplete);

  function animationComplete() {
    newBall.removeEventListener("animationend", animationComplete);
    newBall.classList.remove("expand");
    img.classList.remove("animatefromcannon");
    img.style.removeProperty("--delta-x");
    img.style.removeProperty("--delta-y");

    // make newBall clickable as well
    makeBallClickable(newBall);

    // create new cannonball
    reloadCannon();
  }
}

function createBallElement(balltype) {
  const ball = document.createElement("div");
  ball.className = "ball";
  const img = document.createElement("img");
  img.src = `images/marble${balltype}.png`;
  img.dataset.balltype = balltype;
  ball.dataset.balltype = balltype;
  ball.appendChild(img);
  return ball;
}

function addBallToChain(ball) {
  // add ball to element
  document.querySelector("#balls").appendChild(ball);
  makeBallClickable(ball)
}

function removeBallsFromChain(balls) {
  balls.forEach(ball => {
    ball.classList.add("remove");
    // wait for next frame to start new animation
    requestAnimationFrame( () => ball.addEventListener("animationend", removeElement));
    function removeElement() {
      ball.removeEventListener("animationend", removeElement);
      ball.remove();
    }
  });
}

function makeBallClickable(ball) {
  // add eventlistener to click on ball
  ball.querySelector("img").addEventListener("click", clickBall);
}

let cannonBall = null;

function loadCannonWithBall(newCannonBall) {
  cannonBall = newCannonBall;
  document.querySelector("#cannon").appendChild(cannonBall);
}