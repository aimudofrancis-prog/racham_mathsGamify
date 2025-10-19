// ==== SETUP CANVAS ====
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

// ==== GLOBAL VARIABLES ====
let currentLevel = 1;       // Current level
let correctAnswers = 0;     // Counts correct answers for current level
let score = 0;              // Track score points
let isQuestionActive = false; // Flag to control math question display

// ==== PLAYER (YELLOW BOX) ====
class Player {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.color = "#FFD700";
    this.speed = 5;
  }

  draw() {
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(keys) {
    if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
    if (keys["ArrowRight"] && this.x + this.width < canvas.width) this.x += this.speed;
    if (keys["ArrowUp"] && this.y > 0) this.y -= this.speed;
    if (keys["ArrowDown"] && this.y + this.height < canvas.height) this.y += this.speed;
  }
}

// ==== ENEMY (BLUE BOX) ====
class Enemy {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.reset();
  }

  reset() {
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.speed = 2 + Math.random() * 3;
    this.color = "#007BFF";
  }

  draw() {
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.y += this.speed;
    if (this.y > canvas.height) this.reset();
  }

  mathChallenge() {
    if (isQuestionActive) return; // ✅ Only trigger one question at a time
    isQuestionActive = true;

    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*', '%'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let correctAnswer;
    switch(operator) {
        case '+': correctAnswer = a + b; break;
        case '-': correctAnswer = a - b; break;
        case '*': correctAnswer = a * b; break;
        case '%': correctAnswer = a % b; break;
    }

    showMathQuestion(a, b, operator, (answer) => {
        if (answer === correctAnswer) {
            correctAnswers++;
            score += 10;
            alert("✅ Correct!");

            if (correctAnswers >= 8) {
                if (currentLevel < 10) {
                    currentLevel++;
                    correctAnswers = 0;
                    alert(`🎉 Level Up! Welcome to Level ${currentLevel}`);
                } else {
                    alert("🏆 Congratulations! You completed Level 10 and won the game!");
                    currentLevel = 1;
                    correctAnswers = 0;
                    score = 0;
                }
            }
        } else {
            alert("❌ Oops! Try again!");
        }
        isQuestionActive = false; // ✅ Allow next question
    });
  }
}

// ==== NON-BLOCKING HTML INPUT FOR QUESTIONS ====
function showMathQuestion(a, b, operator, callback) {
  const inputDiv = document.createElement('div');
  inputDiv.style.position = 'absolute';
  inputDiv.style.top = '50%';
  inputDiv.style.left = '50%';
  inputDiv.style.transform = 'translate(-50%, -50%)';
  inputDiv.style.background = '#0F172A';
  inputDiv.style.padding = '20px';
  inputDiv.style.border = '2px solid #FFD700';
  inputDiv.style.color = '#FFD700';
  inputDiv.style.fontFamily = 'Orbitron, sans-serif';
  inputDiv.style.textAlign = 'center';
  inputDiv.style.zIndex = 1000;

  const question = document.createElement('div');
  question.textContent = `Level ${currentLevel}: What is ${a} ${operator} ${b}?`;

  const input = document.createElement('input');
  input.type = 'number';
  input.style.marginTop = '10px';
  input.style.fontSize = '16px';

  const submit = document.createElement('button');
  submit.textContent = 'Submit';
  submit.style.marginLeft = '10px';
  submit.style.cursor = 'pointer';

  inputDiv.appendChild(question);
  inputDiv.appendChild(input);
  inputDiv.appendChild(submit);
  document.body.appendChild(inputDiv);

  submit.addEventListener('click', () => {
    const answer = parseInt(input.value);
    callback(answer);
    document.body.removeChild(inputDiv);
  });
}

// ==== COLLISION DETECTION ====
function checkCollision(p, e) {
  return (
    p.x < e.x + e.width &&
    p.x + p.width > e.x &&
    p.y < e.y + e.height &&
    p.y + p.height > e.y
  );
}

// ==== GAME SETUP ====
const player = new Player();
const enemy = new Enemy();
const keys = {};

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// ==== GAME LOOP ====
function gameLoop() {
  // ✅ Deep blue background
  ctx.fillStyle = "#0F172A"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Move & Draw Player
  player.move(keys);
  player.draw();

  // Move & Draw Enemy
  enemy.move();
  enemy.draw();

  // Collision Check
  if (checkCollision(player, enemy)) {
    enemy.mathChallenge();
    enemy.reset();
  }

  requestAnimationFrame(gameLoop);
}

// ==== PARTICLE BACKGROUND (OPTIONAL EFFECT) ====
const particleCount = 15;
for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement("div");
  particle.classList.add("particle");
  particle.style.left = Math.random() * 100 + "vw";
  particle.style.top = Math.random() * 100 + "vh";
  particle.style.animationDuration = 2 + Math.random() * 3 + "s";
  document.body.appendChild(particle);
}

// ==== START GAME ====
gameLoop();
