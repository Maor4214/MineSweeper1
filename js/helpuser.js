'use strict'


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
            isHint = true
            HINT1.innerHTML = HINT_OFF
            hint1Used = true
            break;
        case '2':
            if (hint2Used) return
            HINT2.innerHTML = HINT_OFF
            isHint = true
            hint2Used = true
            break;
        case '3':
            if (hint3Used) return
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