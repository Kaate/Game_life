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


lifeCountBtn.addEventListener('click', () => {
    game.innerHTML = '';
    const lifeCount = getLifeCount();

    for(let i = 0; i < lifeCount; i++){
        for(let j = 0; j < lifeCount; j++){
            let block = document.createElement("div");

            block.classList.add('life-cell');
            block.classList.add('death');
            block.setAttribute('id', `cell-${i}-${j}`);

            const height = 900 / lifeCount;  
            block.style["width"] = `${height}px`;
            block.style["height"] = `${height}px`;

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

function countAliveNeighbours(i, j) {
    const n = getLifeCount();
    let result = 0;

    for (let k = -1; k < 2; k++)
    {
        for (let m = -1; m < 2; m++)
        {
            if (k == 0 && m == 0)
                continue;
            
            let w_idx = i + k;
            if (w_idx == -1)
            {
                w_idx = n - 1;
            } else if (w_idx == n) {
                w_idx = 0;
            }
            let h_idx = j + m;
            if (h_idx == -1)
            {
                h_idx = n - 1;
            } else if (h_idx == n) {
                h_idx = 0;
            }

            const neighbour = document.getElementById(`cell-${w_idx}-${h_idx}`);
            
            
            if (neighbour.classList.contains('life'))
                result++;
        }
    }

    return result;
}

playBtn.addEventListener('click', () => {
    сlearBtn.disabled = true;
    generatorRandomBtn.disabled = true;
    lifeCountBtn.disabled = true;

    stop = false;

    const lifeCount = getLifeCount();

    (function IterationFunction () {
        const start = new Date().getTime();
        const  newState = new Array(lifeCount * lifeCount).fill(false); // dead by default;

        for (let i = 0; i < lifeCount; i++) {
            for (let j = 0; j < lifeCount; j++) {
                const aliveNeighbours = countAliveNeighbours(i, j);
                const currentCell = document.getElementById(`cell-${i}-${j}`);
                
                if (currentCell.classList.contains('life'))
                {
                    if (aliveNeighbours == 2 || aliveNeighbours == 3)
                    {
                        newState[i + lifeCount * j] = true;
                    }
                }
                else if (currentCell.classList.contains('death'))
                {
                    if (aliveNeighbours == 3)
                    {
                        newState[i + lifeCount * j] = true;
                    }
                }
            }
        }

        let notChanged = true;
        for (let i = 0; i < lifeCount; i++)
        {
            for (let j = 0; j < lifeCount; j++)
            {
                const currentCell = document.getElementById(`cell-${i}-${j}`);
                const newCellState = newState[i + lifeCount * j] ? 'life' : 'death';

                // getCellState()
                const oldCellState = currentCell.classList.contains('death') ? 'death' : 'life';
                
                if (newCellState != oldCellState)
                {
                    notChanged = false;
                }
                
                currentCell.classList.remove(oldCellState);
                currentCell.classList.add(newCellState);
            }
        }
        const end = new Date().getTime();
        document.querySelector('.timeOneGeneration').innerHTML = `${end - start} ms`
        
        
        if (!(document.getElementsByClassName('life').length == 0 || stop || notChanged))
        {
            setTimeout(IterationFunction, document.getElementById('rangeTime').value);
        } else {
            сlearBtn.disabled = false;
            generatorRandomBtn.disabled = false;
            lifeCountBtn.disabled = false;
        }
        
    })();
})




