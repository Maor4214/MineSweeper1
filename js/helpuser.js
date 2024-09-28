'use strict'

var gUserSapwnMinesCount = 0
var gIsDarkMode = false
var gIsExtUsed = false
var gIsHintUsed = false

function changeLvl(lvl) {
    switch (lvl) {
        case 'ez':
            gLevel.size = 4
            gLevel.mines = 2
            break;
        case 'med':
            gLevel.size = 8
            gLevel.mines = 14
            break;
        case 'hard':
            gLevel.size = 12
            gLevel.mines = 32
            break;

        case 'custome':
            gLevel.size = +prompt('Choose the size of the board')
            gLevel.mines = +prompt('Choose how much mine you want to spawn')
            break;

        default:
            gLevel.size = 4
            gLevel.mines = 2
            break
    }
    restartGame()
}



function megaHint() {
    if (!gMegaHint.timeUsed) return
    gMegaHint.isUsed = true
}

function activeHint(start, end) {
    // console.log('start', start)
    // console.log('end', end)
    for (var i = start.i; i <= end.i; i++) {
        for (var j = start.j; j <= end.j; j++) {
            // console.log('work?',)
            if (gBoard[i][j].isMine) {
                renderCell({ i, j }, NORMALMINE)
            }
            if (!gBoard[i][j].isMine) {
                renderCell({ i, j }, getNegsShown(gBoard[i][j].minesAroundCount))
            }
        }
        // gInterval[1] = setInterval(unmarkCell(start, end), 2000)
        setTimeout(() => {
            unmarkCell(start, end)
            gMegaHint = {
                isUsed: false,
                timeUsed: 0
            }

        }, 2000);
    }
}

function unmarkCell(start, end) {
    for (var i = start.i; i <= end.i; i++) {
        for (var j = start.j; j <= end.j; j++) {
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].isMarked) {
                console.log('goBack to flag')
                renderCell({ i, j }, FLAG)
            }
            else renderCell({ i, j }, UNMARKED)
        }

    }
}


function hint(num) {
    switch (num) {
        case '1':
            if (hint1Used) return
            if (gIsHintUsed) return
            isHint = true
            HINT1.innerHTML = HINT_OFF
            hint1Used = true
            break;
        case '2':
            if (hint2Used) return
            if (gIsHintUsed) return
            HINT2.innerHTML = HINT_OFF
            isHint = true
            hint2Used = true
            break;
        case '3':
            if (hint3Used) return
            if (gIsHintUsed) return
            isHint = true
            HINT3.innerHTML = HINT_OFF
            hint3Used = true
            break
    }


}

function undoMove() {
    var countUndo = 0
    if (gIsFirstClick) return
    if (countUndo) return
    var undoCellIdx = gBoard[gLastCellClicked.i][gLastCellClicked.j]

    if (undoCellIdx.isMine) {
        gLife++
        console.log('gLife', gLife)
        countUndo++
        var elLife = document.querySelector('.life span')
        elLife.innerHTML = gLife

    }
    if (!undoCellIdx.isMine) {

        unRevealEmptyNegsCells(gLastCellClicked.i, gLastCellClicked.j)
        renderCell(gLastCellClicked, UNMARKED)


        countUndo++
    }


}

function manuallyCreateMine() {
    // var count = 0
    // gBoard[minePos.i][minePos.j].isMine
    // count++
    // console.log('count', count)
    for (var i = 0; i < gLevel.mines; i++) {
        var iPos = +prompt('Choose Row')
        var jPos = +prompt('Choose Column')
        gBoard[iPos][jPos].isMine = true
    }

}

function manuallyCreateMine() {
    if (!gIsFirstClick) return
    isManuallyCreate = true
    alert(`Choose ${gLevel.mines} cells to make them mines`)
}

function userSpawnMines(i, j) {

    if (gBoard[i][j].isMine) {
        alert('You allready put a mine here')
        return
    }
    gBoard[i][j].isMine = true
    gUserSapwnMinesCount++


}

function safeClick() {

    if (!gSafeClicks) return

    var safeCells = findSafeCells(gBoard)
    // console.log('safeCells', safeCells)
    var safeCellIdx = getRandomInt(0, safeCells.length)
    var safeCell = safeCells[safeCellIdx]
    // console.log('safeCell', safeCell)
    var safeCellClass = getClassName(safeCell)
    var elSafeCell = document.querySelector(`.${safeCellClass}`)
    safeCells.splice(safeCellIdx, 1)
    elSafeCell.style = 'border-radius: 0px;'
    elSafeCell.style = 'border-color: red;'
    elSafeCell.style = 'border-style: solid;'
    gSafeClicks--
    // if (!gSafeClicks)  document.querySelector('.safe-click').innerHTML = 'No more Safe click allowed'
    elSafeClicks.innerHTML = gSafeClicks

    setTimeout(() => {
        if (!gBoard[safeCell.i][safeCell.j].isMine)
            elSafeCell.style = 'border-radius: 0px;'
        elSafeCell.style = 'border-color: none;'
        elSafeCell.style = 'border-style: none;'

    }, 2000);


}

function switchToDarkMode() {
    if (gIsDarkMode) {
        gIsDarkMode = false
        document.body.style = `background-image: url('imgs/normalBack.png');`
    }

    else if (!gIsDarkMode) {
        gIsDarkMode = true
        document.body.style = `background-image: url('imgs/darkBack.png');`

    }
}


function extMines() {
    if (gIsExtUsed) return
    if (gLevel.mines <= 3) return
    if (gIsFirstClick) return
    var mineCells = findMineCells(gBoard)
    for (var i = 0; i < 3; i++) {
        var mineCellIdx = getRandomInt(0, mineCells.length)
        var newMine = mineCells[mineCellIdx]
        gBoard[newMine.i][newMine.j].isMine = false
        mineCells.splice(mineCellIdx, 1)
    }
    getNegsMines()
    renderNewNegs(gBoard)
    gIsExtUsed = true

}