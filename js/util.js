'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}


function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function findEmptyCells() {
    var emptyCells = []

    for (var i = 1; i < gBoard.length - 1; i++) {
        for (var j = 1; j < gBoard[0].length - 1; j++) {
            var currCell = gBoard[i][j]

            if (currCell === EMPTY) {
                var emptyCell = { i, j }
                emptyCells.push(emptyCell)
            }
        }
    }
    return emptyCells
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function playSound(sound) {
    const audioPop = new Audio(sound)
    audioPop.play()
}



function revealEmptyNegsCells(i, j) {
    if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[0].length) return
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return

    gBoard[i][j].isShown = true
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

function findNegsMines(rowIdx, colIdx, mat) {
    var closeMinesCount = 0
    // console.log('rowIdx, collIdx', rowIdx, colIdx)

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[0].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (mat[i][j].isMine) closeMinesCount++

        }
    }
    return closeMinesCount
}


function findCellsForMines(currI, currj) {
    var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === currI && j === currj) continue
            var emptyCell = { i, j }
            emptyCells.push(emptyCell)

        }
    }

    return emptyCells
}


function showNegs(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) continue

            if (gBoard[i][j].isMine) renderCell({ i, j }, NORMALMINE)
            if (!gBoard[i][j].isMine) renderCell({ i, j }, getNegsShown(gBoard[i][j].minesAroundCount))

        }
    }

}

function unShowNegs(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === rowIdx && j === colIdx) gBoard[i][j].isShown = false
            if (gBoard[i][j].isShown && gBoard[i][j].minesAroundCount) continue
            renderCell({ i, j }, UNMARKED)

        }
    }

}

function unRevealEmptyNegsCells(i, j) {
    // console.log('i, j', i, j)
    if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[0].length) return
    if (gBoard[i][j].isMarked || !gBoard[i][j].isShown) return

    gBoard[i][j].isShown = false
    // console.log('should get info')
    renderCell({ i, j },UNMARKED)

    if (!gBoard[i][j].minesAroundCount) {
        unRevealEmptyNegsCells(i - 1, j)
        unRevealEmptyNegsCells(i + 1, j)
        unRevealEmptyNegsCells(i, j - 1)
        unRevealEmptyNegsCells(i, j + 1)
        unRevealEmptyNegsCells(i - 1, j - 1)
        unRevealEmptyNegsCells(i - 1, j + 1)
        unRevealEmptyNegsCells(i + 1, j - 1)
        unRevealEmptyNegsCells(i + 1, j + 1)
    }
}

 function findSafeCells(board){
   var safeCells = []
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[0].length; j++){
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].isMarked) continue
            var safeCell = {i , j}
            safeCells.push(safeCell)
        }
    } return safeCells
 }