let mg;

let rules = [
  [
    0, 0, 0, 1, 0, 0, 0, 0, 0
  ],
  [
    0, 0, 1, 1, 0, 0, 0, 0, 0
  ]
];

let elements = {
  "htmlElements" : {
    'controll' : document.getElementById('createControll')
  },
  'saves' : []
};

function createGridFromForm() {
  let width = document.getElementById('width').value;
  let height = document.getElementById('height').value;
  let cs = document.getElementById('cells_size').value;
  removeElement('main', 'createControll');

  mg = new Grid(width, height, cs, true);
}

function addElement(toID, element) {
  document.getElementById(toID).appendChild(element);
}

function removeElement(fromID, ID) {
  document.getElementById(fromID).removeChild(document.getElementById(ID));
}

function changeGrid() {
	mg.stop();
  mg = undefined;
  removeElement('main', 'canvas');
  addElement('main', elements.htmlElements.controll);
}

function saveState() {
  if (mg == undefined) return false;

  let saveEl = document.getElementById('saveName');
  if (saveEl.value == '') {
    saveEl.setAttribute('placeHolder', 'Plase enter a save name');
		saveEl.style.border = '1px solid red';
    return false;
  }

	saveEl.style.border = '';

  let save = document.createElement('div'), saveID = elements.saves.length+1;
  save.ID = 'save' + saveID;
  save.setAttribute('class', 'save');
  save.setAttribute('onClick', 'loadState('+elements.saves.length+')');
  save.innerHTML = saveEl.value;
  document.getElementById('saves').appendChild(save);

  let temp1 = [];
  for (let i = 0; i < mg.width; i++) {
    let temp2 = [];
    for (let j = 0; j < mg.height; j++) {
      temp2.push(mg.env[i][j].state);
    }
    temp1.push(temp2);
  }
  elements.saves.push(temp1);
}

function loadState(hash) {
  if (mg.width != elements.saves[hash][0].length || mg.height != elements.saves[hash].length) {
    return false;
  }
  for (let i = 0; i < mg.width; i++) {
    for (let j = 0; j < mg.height; j++) {
      mg.env[i][j].state = elements.saves[hash][i][j];
    }
  }
  mg.env_h = mg.env;
  mg.showCells();
}

function r(p) {
  if(Math.floor(Math.random()*(p+1)) >= 1) return 1; return 0;
}