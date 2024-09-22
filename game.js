'use strict'

var gLive = 3
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
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


const MINE = '<img src="imgs/mine.png">'
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



function onInitGame() {

    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
    gIsFirstClick = true
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
        spawnMines(gLevel.mines, i, j)
        gIsFirstClick = false
    }

    if (gBoard[i][j].isShown) return

    if (gBoard[i][j].isMine) {
        console.log('boom!')
        renderCell(currPosClick, MINE)
        gLive--
        gBoard[i][j].isShown = true
        if (!gLive) endGame()

    }
    if (!gBoard[i][j].isMine) {
        console.log('not mine whoho!')
        var minesAroundCount = findNegsMines(i, j, gBoard)
        if (!minesAroundCount) {
            revealEmptyNegsCells(i, j)

        }
        else {

            renderCell(currPosClick, getNegsShown(minesAroundCount))
            // console.log('count', count)
            gBoard[i][j].isShown = true

        }
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
    const cell = gBoard[i][j];

    if (cell.isMarked) {
        cell.isMarked = false
        renderCell({ i, j }, UNMARKED)
    } else {
        cell.isMarked = true
        renderCell({ i, j }, FLAG)
    }
}


function revealEmptyNegsCells(i, j) {
    if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[0].length) return
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return

    gBoard[i][j].isShown = true
    var minesAroundCount = findNegsMines(i, j, gBoard)
    renderCell({ i, j }, getNegsShown(minesAroundCount))

    if (!minesAroundCount) {
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

function endGame(){


}