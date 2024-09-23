'use strict'

var gLife = 3
var gIsFirstClick = true

var gBoard = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
}

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: true,
    secsPassed: 0
}

var gFlaggedMines = 0
var gCellsShown = 0

var startTime
var gInterval

const MINE = '<img src="imgs/mine1.png">'
const NEGS1 = '<img src="imgs/1.png">'
const NEGS2 = '<img src="imgs/2.png">'
const NEGS3 = '<img src="imgs/3.png">'
const NEGS4 = '<img src="imgs/4.png">'
const NEGS5 = '<img src="imgs/5.png">'
const NEGS6 = '<img src="imgs/6.png">'
const NEGS7 = '<img src="imgs/7.png">'
const NEGS8 = '<img src="imgs/8.png">'
const UNMARKED = '<img src="imgs/questionmark.png">'
const EMPTY = '<img src="imgs/empty.png">'
const FLAG = '<img src="imgs/flag.png">'
const NORMALMINE = '<img src="imgs/mine.png">'

const PLAYING_IMG = '🤓'
const WINING_IMG = '😎'
const LOSING_IMG = '☠️'

const WIN_SOUND = `./sounds/winsound.mp3`
const LOSE_SOUND = `./sounds/losesound.mp3`



function onInitGame() {

    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
    gIsFirstClick = true
    gLife = 3
    gGame.isOn = true
    gCellsShown = 0
    gFlaggedMines = 0
    var elEmoji = document.querySelector('.emoji-game')
    elEmoji.innerHTML = PLAYING_IMG
    var elLife = document.querySelector('.life span')
     elLife.innerHTML = gLife
    
}



function buildBoard(size) {
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    // board[1][3].isMarked = true
    // board[2][2].isMarked = true
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            var className = `cell cell-${i}-${j} floor`
            strHTML += `<td class="cell ${className}" onclick="showCell(${i},${j})" oncontextmenu="toggleMark(event, ${i}, ${j})">`
            if (!cell.isMarked) strHTML += UNMARKED
            if (cell.isMine) className += ` mine`

            strHTML += '</td>'
        }
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function showCell(i, j) {
    var currPosClick = { i, j }
    if (gIsFirstClick) {
        startTimer()
        spawnMines(gLevel.mines, i, j)
        getNegsMines()
        console.log('gBoard', gBoard)
        gIsFirstClick = false
    }

    if (gBoard[i][j].isShown) return
    if (!gGame.isOn) return

    if (gBoard[i][j].isMine) {
        console.log('boom!')
        gLife--
        console.log('glive', gLife)
        if (!gLife) {
            endGame('lose')
            gBoard[i][j].isShown = true
            renderCell(currPosClick, MINE)
            var elLife = document.querySelector('.life span')
            elLife.innerHTML = gLife
        }
        else {

            renderCell(currPosClick, MINE)
            gBoard[i][j].isShown = true
            setTimeout(() => {
                gBoard[i][j].isShown = false
                renderCell(currPosClick, UNMARKED)
            }, 1000)
            var elLife = document.querySelector('.life span')
            elLife.innerHTML = gLife
        }

    }
    if (!gBoard[i][j].isMine) {
        console.log('not mine whoho!')

        if (!gBoard[i][j].minesAroundCount) {
            revealEmptyNegsCells(i, j)

        }
        else {
            gBoard[i][j].isShown = true
            renderCell(currPosClick, getNegsShown(gBoard[i][j].minesAroundCount))
            // console.log('count', count)
            gCellsShown++

        }
    }
    if (isWin()) {
        endGame('win')
    }


}







function spawnMines(mines, currI, currj) {
    for (var i = 0; i < mines; i++) {

        var newRowIdx = getRandomInt(0, gBoard.length)
        var newColIdx = getRandomInt(0, gBoard[0].length)
        if (gBoard[currI][currj] === gBoard[newRowIdx][newColIdx]) spawnMines(mines, currI, currj)
        else gBoard[newRowIdx][newColIdx].isMine = true
    }
    // gBoard[3][3].isMine = true
    // gBoard[2][3].isMine = true
}


function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function getClassName(location) {
    const cellClass = `cell-${location.i}-${location.j}`
    return cellClass
}

function getNegsShown(count) {
    if (!count) return EMPTY
    if (count === 1) return NEGS1
    if (count === 2) return NEGS2
    if (count === 3) return NEGS3
    if (count === 4) return NEGS4
    if (count === 5) return NEGS5
    if (count === 6) return NEGS6
    if (count === 7) return NEGS7
    if (count === 8) return NEGS8
}

function toggleMark(event, i, j) {
    event.preventDefault()
    const cell = gBoard[i][j]

    if (cell.isMarked) {
        cell.isMarked = false
        renderCell({ i, j }, UNMARKED)
        if (gBoard[i][j].isMine) gFlaggedMines--
    }
    else {
        cell.isMarked = true
        renderCell({ i, j }, FLAG)
    }
    if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gFlaggedMines++
    if (isWin()) {
        endGame('win')
    }
}


function revealEmptyNegsCells(i, j) {
    if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[0].length) return
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return

    gBoard[i][j].isShown = true
    // var minesAroundCount = findNegsMines(i, j, gBoard)
    renderCell({ i, j }, getNegsShown(gBoard[i][j].minesAroundCount))
    gCellsShown++

    if (!gBoard[i][j].minesAroundCount) {
        revealEmptyNegsCells(i - 1, j)
        revealEmptyNegsCells(i + 1, j)
        revealEmptyNegsCells(i, j - 1)
        revealEmptyNegsCells(i, j + 1)
        revealEmptyNegsCells(i - 1, j - 1)
        revealEmptyNegsCells(i - 1, j + 1)
        revealEmptyNegsCells(i + 1, j - 1)
        revealEmptyNegsCells(i + 1, j + 1)
    }
}


function findEmptyCells() {
    var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isShown) continue
            var emptyCell = { i, j }
            emptyCells.push(emptyCell)

        }
    }
    return emptyCells
}

function endGame(result) {
    stopTimer()
    document.querySelector('.timer').innerTEXT = '00'
    gGame.isOn = false
    if (result === 'lose') {
        showAllMines()
        playSound(LOSE_SOUND)
        var elEmoji = document.querySelector('.emoji-game')
        elEmoji.innerHTML = LOSING_IMG

    
    }
    if (result === 'win') {
        console.log('damm bro')
        playSound(WIN_SOUND)
        var elEmoji = document.querySelector('.emoji-game')
        elEmoji.innerHTML = WINING_IMG

    }


}

function getNegsMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var minesAround = findNegsMines(i, j, gBoard)
            gBoard[i][j].minesAroundCount = minesAround
        }

    }
}
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
            break

        default:
            gLevel.size = 4
            gLevel.mines = 2
            break;
    }
    onInitGame()
}


function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine) continue
            gBoard[i][j].isShown = true
            renderCell({ i, j }, NORMALMINE)
        }
    }
}

function isWin() {
    console.log('gFlaggedMines', gFlaggedMines)
    return gFlaggedMines + gCellsShown === gLevel.size ** 2

}


function startTimer() {
    startTime = new Date().getTime()
    gInterval = setInterval(updateTimer, 31)
}

function stopTimer() {
    clearInterval(gInterval)
}

function updateTimer() {
    const currentTime = new Date().getTime()
    const elapsedTime = currentTime - startTime
    const seconds = Math.floor(elapsedTime / 1000)
    document.querySelector('.timer').textContent =
        `${seconds.toString().padStart(2, '0')}`

}



