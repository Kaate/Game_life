"use strict";
const game = document.body.querySelector('.game');

const lifeCountBtn = document.querySelector(".lifeCountBtn");
const generatorRandomBtn = document.querySelector(".generatorRandomBtn");
const сlearBtn = document.querySelector(".сlearBtn");
const playBtn = document.querySelector(".playBtn");
const stopBtn = document.querySelector(".stopBtn");

let stop = false;

function getLifeCount() {
    return document.querySelector('#lifeCount').value;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function makeClickable(){
    const allCells = document.querySelectorAll('.life-cell');

    for (let cell of allCells) {
        cell.addEventListener('click', () => {
            if (cell.classList.contains('death')) {
                cell.classList.remove('death');
                cell.classList.add('life');
            }
            else if (cell.classList.contains('life')) {
                cell.classList.remove('life');
                cell.classList.add('death');
            }
    
        })
    }    
}

function killCell(cell){
    if (!cell.classList.contains('death')) cell.classList.add('death')
    cell.classList.remove('life')
}


stopBtn.addEventListener('click', () => stop = true)
for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
        let block = document.createElement("div");

        block.classList.add('life-cell');
        block.classList.add('death');
        block.setAttribute('id', `cell-${i}-${j}`);

        game.append(block)
    }
}

////////// добавление игрового поля
lifeCountBtn.addEventListener('click', () => {
    game.innerHTML = '';
    const lifeCount = getLifeCount();

    for(let i = 0; i < lifeCount; i++){
        for(let j = 0; j < lifeCount; j++){
            let block = document.createElement("div");

            block.classList.add('life-cell');
            block.classList.add('death');
            block.setAttribute('id', `cell-${i}-${j}`);

            if (lifeCount > 450) {
                const height = lifeCount * 3 / lifeCount;
                block.style["width"] = `${height}px`;
                block.style["height"] = `${height}px`;

                game.style["width"] = `${lifeCount * 3}px`
                game.style["height"] = `${lifeCount * 3}px`
                game.style["margin-left"] = "3%"
            } else {
                const height = getComputedStyle(document.documentElement)
                .getPropertyValue('--game-size')
                const heightCell = height / lifeCount;  
                block.style["width"] = `${heightCell}px`;
                block.style["height"] = `${heightCell}px`;

                game.style["width"] = `${height}px`
                game.style["height"] = `${height}px`
                game.style["margin-left"] = "30%"
            }
            game.append(block)
        }
    }

    makeClickable();
})


generatorRandomBtn.addEventListener('click', () => {
    const allCells = document.querySelectorAll('.life-cell');

    for (let cell of allCells) {
        killCell(cell);
        const rand = getRandomInt(2);
        if (!rand) {
            cell.classList.remove('life')
        }
        else {
            cell.classList.add('life')
            cell.classList.remove('death')
        }
    }
})


сlearBtn.addEventListener('click', () => {
    const allCells = document.querySelectorAll('.life-cell');
    for (let cell of allCells) killCell(cell);
})

makeClickable(); 

////////// проверка границ
function getBorderIdx(i, n) {
    let result = i;
    if (result == -1)
    {
       result = n - 1;
    } else if (result == n) {
        result = 0;
    }

    return result;
}

////////// проверка живых соседей
function countAliveNeighbours(i, j) {
    const n = getLifeCount();
    let result = 0;

    for (let k = -1; k < 2; k++) {
        for (let m = -1; m < 2; m++) {
            if (k == 0 && m == 0)
                continue;
            
            let w_idx = getBorderIdx(i + k, n);
            let h_idx = getBorderIdx(j + m, n);
            
            const neighbour = document.getElementById(`cell-${w_idx}-${h_idx}`);
            if (neighbour.classList.contains('life'))
                result++;
        }
    }

    return result;
}

function createFromSet(inp) {
    let arr = [];
    for (const elem of inp) {
        let idxs = elem.split('-');
        arr.push([Number(idxs[0]), Number(idxs[1])])
    }

    return arr
}

playBtn.addEventListener('click', () => {
    сlearBtn.disabled = true;
    generatorRandomBtn.disabled = true;
    lifeCountBtn.disabled = true;

    stop = false;

    const lifeCount = getLifeCount();
    let arrayUpdate = []

    for (let i = 0; i < lifeCount; i++) {
        for (let j = 0; j < lifeCount; j++) {
            arrayUpdate.push([i,j])
        }
    }

    (function IterationFunction () {
        const start = new Date().getTime();
        const  newState = new Array(lifeCount * lifeCount).fill(false); // dead by default;

        for(let cell of arrayUpdate){
            const aliveNeighbours = countAliveNeighbours(cell[0], cell[1]);
            const currentCell = document.getElementById(`cell-${cell[0]}-${cell[1]}`);
            
            if (currentCell.classList.contains('life'))
            {
                if (aliveNeighbours == 2 || aliveNeighbours == 3)
                {
                    newState[cell[0] + lifeCount * cell[1]] = true;
                }
            }
            else if (currentCell.classList.contains('death'))
            {
                if (aliveNeighbours == 3)
                {
                    newState[cell[0] + lifeCount * cell[1]] = true;
                }
            }
        }

        const idxSet = new Set();
        for (let cell of arrayUpdate)
        {
            let changed = false;
            for (let k = -1; k < 2; k++) {
                for (let m = -1; m < 2; m++) {
 
                    let w_idx = getBorderIdx(cell[0] + k, lifeCount);
                    let h_idx = getBorderIdx(cell[1] + m, lifeCount);
                    
                    const neighbour = document.getElementById(`cell-${w_idx}-${h_idx}`);
                    const oldS = neighbour.classList.contains('death') ? 'death' : 'life';
                    const newS = newState[w_idx + lifeCount * h_idx] ? 'life' : 'death';
                    if (oldS != newS)
                    {
                        changed = true;
                    }
                }
            }
            if (changed)
            {
                for (let k = -1; k < 2; k++) {
                    for (let m = -1; m < 2; m++) {
     
                        let w_idx = getBorderIdx(cell[0] + k, lifeCount);
                        let h_idx = getBorderIdx(cell[1] + m, lifeCount);
                        idxSet.add(`${w_idx}-${h_idx}`);
                    }
                }
            }
        }

        const end = new Date().getTime();
        document.querySelector('.timeOneGeneration').innerHTML = `${end - start} ms`

        /////////////отрисовка
        for (let cell of arrayUpdate)
        {
            const currentCell = document.getElementById(`cell-${cell[0]}-${cell[1]}`);

            const newCellState = newState[cell[0] + lifeCount * cell[1]] ? 'life' : 'death';

            const oldCellState = currentCell.classList.contains('death') ? 'death' : 'life';
            
            currentCell.classList.remove(oldCellState);
            currentCell.classList.add(newCellState);
        }
        arrayUpdate = createFromSet(idxSet);
        idxSet.clear;
        
        let lifeCellCount = document.getElementsByClassName('life').length
        
        if (!lifeCellCount || stop || arrayUpdate.length == 0)
        {
            сlearBtn.disabled = false;
            generatorRandomBtn.disabled = false;
            lifeCountBtn.disabled = false;
        } else {
            setTimeout(IterationFunction, document.getElementById('rangeTime').value);
        }
        
    })();
})




