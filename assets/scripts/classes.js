class Grid {
  constructor(width, height, cellSize, wrapped) {
    this.width = width;
    this.height = height;
    this.wrapped = wrapped;
    this.cellSize = cellSize;
    this.speed = 66.6666;
    this.running = false;

    this.env = [];
    this.env_h = [];
    this.ctx;
    this.canvas;
    this.interval;
    this.canvas;

    this.create();
    this.showCells();
  }

  create() {
    this.canvas = document.createElement('canvas');

    this.canvas.setAttribute('width', this.width*this.cellSize+2);
    this.canvas.setAttribute('height', this.height*this.cellSize+2);
    this.canvas.id = 'canvas';
    addElement('main', this.canvas);
    document.getElementById('controll').setAttribute('style', 'display: block');

    this.ctx = this.canvas.getContext('2d');

    this.ctx.moveTo(0, 0);
    this.ctx.fillStyle = '#d2d2d2';
    this.ctx.fillRect(0, 0, this.width*this.cellSize+2, this.height*this.cellSize+2);
    this.ctx.stroke();

    this.env = [];

    for (let i = 0; i < this.height; i++) {
      this.env.push([]);
      for (let j = 0; j < this.width; j++) {
        this.env[i].push(new Cell(j, i, 0));
      }
    }

    this.addListener(this);
  }

  showCells() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.env[i][j].displayOn(this);
      }
    }
  }

  addListener(grid2) {
    this.canvas.addEventListener('mousedown', function(event) {
      let pos = grid2.canvas.getBoundingClientRect();
      let mx = Math.floor((event.clientX-pos.x)/grid2.cellSize), my = Math.floor((event.clientY-pos.y)/grid2.cellSize);
      grid2.env[my][mx].changeState();
      grid2.showCells();
    });
  }

  randomize(density) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.env[i][j].state = r(density);
      }
    }
    this.showCells();
  }

  update_nc() {
    if (this.wrapped) {
      let yd = 0;
      let xd = 0;
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          let temp_nc = 0;
          for (let k = -1; k < 2; k++) {
            for (let l = -1; l < 2; l++) {
              if (!(k == 0 && l == 0)) {
                let ik = i+k;
                let jl = j+l;

                if (ik >= 0 && ik < this.height) yd = 0;
                 else if (ik < 0) yd = 1;
                    else yd = -1;

                if (jl >= 0 && jl < this.width) xd = 0;
                  else if (jl < 0) xd = 1;
                    else xd = -1;

                if (this.env[ik+(this.height*yd)][jl+(this.width*xd)].state >= 1) {
                  temp_nc++;
                }
              }
            }
          }
          this.env[i][j].nc = temp_nc;
        }
      }
    } else {
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          let temp_nc = 0;
          for (let k = -1; k < 2; k++) {
            for (let l = -1; l < 2; l++) {
              if (!(k == 0 && l == 0)) {
                if (!((i+k < 0) || (i+k >= this.height) || (j+l < 0) || (j+l >= this.width))) {
                  if (this.env[i+k][j+l].state >= 1) {
                    temp_nc++;
                  }
                }
              }
            }
          }
          this.env[i][j].nc = temp_nc;
        }
      }
    }
  }

  update_state() {
    this.env_h = JSON.parse(JSON.stringify(this.env));
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.env[i][j].state = rules[this.env_h[i][j].state][this.env_h[i][j].nc];
      }
    }
    this.showCells();
  }

  change_wrapped() {
    this.wrapped = !this.wrapped;
  }

  start() {
    if (!this.running) {
      this.interval = window.setInterval(function(){mg.update()}, this.speed);
      this.running = true;
    }
  }

  stop() {
    if (this.running) {
      clearInterval(this.interval);
      this.running = false;
    }
  }

  changeSpeed(fps) {
    this.speed = 1000/fps;
    if (this.running) {
      this.stop();
      this.start();
    }
  }

  update() {
    this.update_nc();
    this.update_state();
  }

  destroy() {
    removeElement('main', 'canvas');
  }
}

class Cell {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.nc;
  }

  displayOn(grid1) {
    if (this.state >= 1) {
      grid1.ctx.fillStyle = '#000';
    } else {
      grid1.ctx.fillStyle = '#d2d2d2';
    }
    let ms = grid1.cellSize;

    grid1.ctx.fillRect(this.x*ms+2, this.y*ms+2, (ms/5)*4, (ms/5)*4);
  }

  changeState(){
    if (this.state >= 1) {
      this.state = 0;
    } else {
      this.state = 1;
    }
  }
}