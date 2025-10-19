 const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const healthEl = document.getElementById('health');
    const scoreEl = document.getElementById('score');

    // ======= Player Object =======
    class Player {
      constructor(x, y, width, height, color, speed, hp) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.hp = hp;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }

      move(keys) {
        if(keys['ArrowLeft'] && this.x > 0) this.x -= this.speed;
        if(keys['ArrowRight'] && this.x + this.width < canvas.width) this.x += this.speed;
      }

      takeDamage(amount) {
        this.hp -= amount;
        if(this.hp < 0) this.hp = 0;
        healthEl.textContent = `Health: ${this.hp}`;
      }
    }

    // ======= Enemy Object =======
    class Enemy {
  constructor(x, y, width, height, color, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.y += this.speed;
    if(this.y > canvas.height) this.reset();
  }

  reset() {
    this.x = Math.random() * (canvas.width - this.width);
    this.y = 0;
  }

  mathChallenge() {
    const problem = generateMathProblem(currentLevel); // currentLevel can scale difficulty
    const answer = prompt(`Solve: ${problem.question}`);

    if(parseInt(answer) === problem.answer) {
      updateScore(problem.points);
      alert(`Correct! +${problem.points} points`);
      return true;
    } else {
      player.takeDamage(problem.damage);
      alert(`Wrong! -${problem.damage} HP`);
      return false;
    }
  }
}

let currentLevel = 1;

// Increase level every X points
function checkLevelUp() {
  if(score >= currentLevel * 50) {
    currentLevel++;
    alert(`Level Up! Now Level ${currentLevel}`);
  }
}

    // ======= Score =======
    let score = 0;
    function updateScore(points) {
      score += points;
      scoreEl.textContent = `Score: ${score}`;
    }

    // ======= Game Setup =======
    const player = new Player(375, 450, 50, 50, '#FFD700', 7, 100);
    const enemy = new Enemy(Math.random() * 750, 0, 50, 50, '#1E3A8A', 3, 10);

    const keys = {};
    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);

    function checkCollision(a, b) {
      return a.x < b.x + b.width &&
             a.x + a.width > b.x &&
             a.y < b.y + b.height &&
             a.y + a.height > b.y;
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      player.move(keys);
      enemy.move();

      if(checkCollision(player, enemy)) {
        enemy.mathChallenge();
        enemy.reset();
      }

      player.draw();
      enemy.draw();

      requestAnimationFrame(gameLoop);
    }

    gameLoop();

//game engineering
    function generateMathProblem(level = 1) {
  const operators = ['+', '-', '*', '/', '%', '**'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  // Random numbers based on level difficulty
  let a = Math.floor(Math.random() * (5 + level * 5)) + 1; 
  let b = Math.floor(Math.random() * (5 + level * 5)) + 1; 

  // Avoid division by zero
  if (operator === '/' || operator === '%') {
    if (b === 0) b = 1;
  }

  // Limit exponentiation size
  if (operator === '**') {
    if (a > 10) a = 10;
    if (b > 3) b = 3;
  }

  let answer;
  switch(operator) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '*': answer = a * b; break;
    case '/': answer = Math.floor(a / b); break; // integer division
    case '%': answer = a % b; break;
    case '**': answer = a ** b; break;
  }

  // Points: correct answer gives more points for harder operators
  let points = 5;
  if (['*','/'].includes(operator)) points = 10;
  if (['%','**'].includes(operator)) points = 15;

  // Damage: wrong answer reduces HP
  let damage = 5 + Math.floor(points / 2);

  return { question: `${a} ${operator} ${b} = ?`, answer, points, damage };
}


//animation effect for game
// Particle for effects
class Particle {
  constructor(x, y, color, size, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.02;
  }
}

let particles = [];

// In mathChallenge(), add particle effect on correct answer 
// Trigger Effects on Enemy Defeat

if(parseInt(answer) === problem.answer) {
  updateScore(problem.points);
  // Trigger golden particles for correct answer
  for(let i = 0; i < 20; i++) {
    particles.push(new Particle(
      this.x + this.width/2,
      this.y + this.height/2,
      '#FFD700',
      Math.random() * 5 + 2,
      { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 }
    ));
  }
  alert(`Correct! +${problem.points} points`);
}else {
  player.takeDamage(problem.damage);
  for(let i = 0; i < 20; i++) {
    particles.push(new Particle(
      player.x + player.width/2,
      player.y + player.height/2,
      '#FF0000',
      Math.random() * 5 + 2,
      { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 }
    ));
  }
  alert(`Wrong! -${problem.damage} HP`);
}//wrong answer trigger red particles

//floating text animation
class FloatingText {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.font = '20px Orbitron';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }

  update() {
    this.y -= 1;
    this.alpha -= 0.02;
  }
}

let floatingTexts = [];

//check if floating
if(parseInt(answer) === problem.answer) {
  floatingTexts.push(new FloatingText(player.x, player.y - 20, `+${problem.points}`, '#FFD700'));
} else {
  floatingTexts.push(new FloatingText(player.x, player.y - 20, `-${problem.damage} HP`, '#FF0000'));
}
// Update and draw particles and floating texts in game loop
//highlighting bonus effects
if(['%', '**'].includes(operator)) {
  // Flash background or create particles
  for(let i = 0; i < 30; i++) {
    particles.push(new Particle(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      '#FFD700',
      Math.random() * 5 + 2,
      { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 }
    ));
  }
}
   //update game loop
   function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.move(keys);
  enemy.move();

  if(checkCollision(player, enemy)) {
    enemy.mathChallenge();
    enemy.reset();
  }

  player.draw();
  enemy.draw();

  // Update particles
  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if(p.alpha <= 0) particles.splice(index, 1);
  });

  // Update floating texts
  floatingTexts.forEach((t, index) => {
    t.update();
    t.draw();
    if(t.alpha <= 0) floatingTexts.splice(index, 1);
  });

  requestAnimationFrame(gameLoop);
}



