    let level
    const gameOptions = document.createElement("div");
    const players = document.createElement("select");
    const levels = document.createElement("select");
    gameOptions.id = "options"
    players.id = "id_players"
    levels.id = "id_levels"

    const playersOptions = [
        ['1p', '1 Jugador'],
        ['2p', '2 Jugadores'],
    ]
    const playersLength = playersOptions.length

    for (let i = 0; i < playersLength;i++) {
        var option = document.createElement("option")
        option.value = playersOptions[i][0]
        option.text = playersOptions[i][1]
        players.appendChild(option)
    }

    const levelsOptions = [
        ['1', 'Difícil'],
        ['2', 'Muy Difícil'],
        ['3', 'Total Pro'],
    ]
    const levelsLength = levelsOptions.length

    for (let i = 0; i < levelsLength;i++) {
        var option = document.createElement("option")
        option.value = levelsOptions[i][0]
        option.text = levelsOptions[i][1]
        levels.appendChild(option)
    }

    gameOptions.appendChild(players)
    gameOptions.appendChild(levels)

    function reloadPage() {
        location.reload()
    }

    function clearBoard() {
        const boxes = document.getElementsByClassName('box')
        boxesLength = boxes.length
        for (let i = 0; i < boxesLength; i++) {
            boxes[i].textContent = ''
            boxes[i].classList.remove(
                'set-p1', 'set-p2', 'set-cpu', 'box-winner')
            boxes[i].classList.add('box-empty')
        }
    }

    function getEmptySquares() {
        return document.getElementsByClassName('box-empty')
    }

    function getElementByRowAndColumn(row, column) {
        return document.querySelector(
            `[data-row="${row}"][data-column="${column}"]`)
    }
    
    function getElementByRowColumnAndClassName(row, column, classname) {
        return document.querySelector(
            `[data-row="${row}"][data-column="${column}"].${classname}`)
    }

    function getFirstElementByLineNumberAndClassName(line, number, classname) {
        return document.querySelector(`[data-${line}="${number}"].${classname}`)
    }

    function getElementsByLineAndNumber(line, number) {
        return document.querySelectorAll(`[data-${line}="${number}"]`)
    }

    function getElementsByLineNumberAndClassName(line, number, classname) {
        return document.querySelectorAll(
            `[data-${line}="${number}"].${classname}`)
    }

    function getElementsByLineNumberAndPlayer(line, number, player) {
        return document.querySelectorAll(
            `[data-${line}="${number}"].set-${player}`)
    }

    function preGame() {
        clearBoard()

        swal({
            title: 'Elige el Modo de Juego',
            content: gameOptions,
        }).then((ok, ko) => {
            const p = document.getElementById("id_players")
            const gameMode = p.options[p.selectedIndex].value
            const l = document.getElementById("id_levels")
            level = l.options[l.selectedIndex].value
            startGame(gameMode)
        })
    }

    preGame()

    function startGame(gameMode) {
        const p1 = 'Jugador 1'
        let p2 = 'CPU'
        if (gameMode == '2p') p2 = 'Jugador 2'

        let firstPlayer, otherPlayer
        if (Math.random() < 0.5) {
            // firstPlayer = p2
            // otherPlayer = p1
            firstPlayer = p1
            otherPlayer = p2
        } else {
            firstPlayer = p2
            otherPlayer = p1
            // firstPlayer = p1
            // otherPlayer = p2
        }

        move(firstPlayer, otherPlayer)
    }

    function move(playing, notPlaying) {
        let playingEl = document.getElementById('playing')
        playingEl.textContent = playing

        const emptySquares = getEmptySquares()
        const esLength = emptySquares.length
        
        if (playing == 'CPU') {
            autoMovePiece()
        } else {
            for (let i = 0; i < esLength; i++) {
                emptySquares[i].addEventListener('click', movePiece)
            }
        }

        function autoMovePiece() {
            let square

            // Helpers
            function center(player) {
                const center = getElementByRowAndColumn(2, 2)
                if (center.classList.contains(`set-${player}`)) {
                    return true
                }
                return false
            }
            centerCPU = center('cpu')
            centerP1 = center('p1')

            function p1Position(squares) {
                const squaresLength = squares.length
                for (let i = 0; i < squaresLength; i++) {
                    if (getElementByRowAndColumn(squares[i][0], squares[i][1]
                        ).classList.contains('set-p1')) {
                        return true
                    }
                }
                return false
            }

            const crossSquares = [[1, 2], [2, 1], [2, 3], [3, 2]]
            const cornerSquares = [[1, 1], [1, 3], [3, 1], [3, 3]]
            const p1Cross = p1Position(crossSquares)
            const p1Corner = p1Position(cornerSquares)

            function twoSqaresMovement(line, selLength, player) {
                for (let i = 0; i < selLength; i++) {
                    const lineLength = getElementsByLineNumberAndPlayer(
                        line, i+1, player).length
                    if (lineLength == 2) {
                        return getFirstElementByLineNumberAndClassName(
                            line, i+1, 'box-empty')
                    }
                }
                return false
            }

            function oneSquareAttackMovement(line, selLength) {
                let movements = []

                function checkSquareDefense(line, number) {
                    const boxEmptyLength = getElementsByLineNumberAndClassName(
                        line, number, "box-empty").length
                    const p1Length = getElementsByLineNumberAndClassName(
                        line, number, 'set-p1').length

                    if (boxEmptyLength == 2 && p1Length == 1) {
                        return true
                    }
                    return false
                }

                for (let i = 0; i < selLength; i++) {
                    const cpuLength = getElementsByLineNumberAndClassName(
                        line, i+1, 'set-cpu').length
                    const p1Length = getElementsByLineNumberAndClassName(
                        line, i+1, "set-p1").length
                    if (cpuLength == 1 && p1Length == 0) {
                        const emptyLine = getElementsByLineNumberAndClassName(
                            line, i+1, "box-empty")
                        for (let i = 0; i < emptyLine.length; i++) {
                            movements.push(emptyLine[i])
                        }

                        for (let i = 0; i < movements.length; i++) {
                            const sq = movements[i]
                            const row = sq.getAttribute('data-row')
                            const column = sq.getAttribute('data-column')
                            const diagonal1 = sq.getAttribute('data-diagonal1')
                            const diagonal2 = sq.getAttribute('data-diagonal2')
                            const opts = [
                                ['row', row],
                                ['column', column],
                                ['diagonal1', diagonal1],
                                ['diagonal2', diagonal2],
                            ]
                            for (let j = 0; j < opts.length; j++) {
                                if (checkSquareDefense(opts[j][0], opts[j][1])) {
                                    return sq
                                }
                            }
                        }
                        const idx = Math.floor(Math.random() *
                            emptyLine.length)
                        return emptyLine[idx]
                    }
                }
                return false
            }

            // Movement Functions
            function firstCPU() {
                const levelMovement = 3
                const movement = getElementByRowAndColumn(3, 2)
                if (level >= levelMovement && esLength == 9) {
                    // return movement
                    return false
                }
                return false
            }

            function winOrDefense(player) {
                const levelMovement = 1

                if (level >= levelMovement) {
                    const opts = [
                        ["row", 3],
                        ["column", 3],
                        ["diagonal1", 3],
                        ["diagonal2", 3]
                    ]

                    for (let i = 0; i < opts.length; i++) {
                        if (twoSqaresMovement(opts[i][0], opts[i][1], player)) {
                            return twoSqaresMovement(
                                opts[i][0], opts[i][1], player)
                        }
                    }
                }
                return false
            }

            function defenseCornerStart() {
                const levelMovement = 3
                if (level >= levelMovement &&
                    esLength == 8 && 
                    p1Corner) {
                    return getElementByRowAndColumn(2, 2)
                }
                return false
            }

            function centerDefenseFirstMovement() {
                const levelMovement = 2
                if (level >= levelMovement &&
                    esLength == 8 &&
                    centerP1) {
                    const corner = Math.floor(
                        Math.random() * cornerSquares.length)
                    const line = cornerSquares[corner][0]
                    const number = cornerSquares[corner][1]
                    return getElementByRowAndColumn(line, number)
                }
                return false
            }

            function crossDefenseMovement() {
                const levelMovement = 3
                const esArray = [...emptySquares]

                if (level >= levelMovement &&
                    esArray.length == 8 &&
                    p1Cross) {
                    const opts = [
                        [[1, 2], [[2, 1], [2, 3]]],
                        [[2, 1], [[1, 2], [3, 2]]],
                        [[2, 3], [[1, 2], [3, 2]]],
                        [[3, 2], [[2, 1], [2, 3]]]
                    ]

                    for (let i = 0; i < opts.length; i++) {
                        const row = opts[i][0][0]
                        const column = opts[i][0][1]
                        const p1Square = getElementByRowColumnAndClassName(
                            row, column, "set-p1")
                        if (p1Square) {
                            for (let j = 0; j < opts[i][1].length; j++) {
                                const row = opts[i][1][j][0]
                                const column = opts[i][1][j][1]
                                const eSToRemove = getElementByRowAndColumn(
                                    row, column)
                                const idx = esArray.indexOf(eSToRemove)
                                esArray.splice(idx, 1)
                            }
                        }
                    }
                    const idx = Math.floor(Math.random() * esArray.length)
                    return esArray[idx]
                }
                return false
            }

            function centerAttackFirstMovement() {
                const levelMovement = 3
                if (level >= levelMovement &&
                    esLength == 7 &&
                    centerCPU &&
                    p1Cross) {
                    return getElementByRowAndColumn(1, 1)
                }
                return false
            }

            function doubleDefenseOrAttack(player) {
                const levelMovement = 3
                const targetSquares = document.getElementsByClassName(
                    `set-${player}`)
                const targetLength = targetSquares.length
                let doubleSquares = []
                let doubleSquaresAndAttack = []

                for (let i = 0; i < targetLength; i++) {
                    targetSquares[i].classList.add('check-double')
                }

                function twoSqaresDouble(line, number) {
                    const lineLength = getElementsByLineNumberAndClassName(
                        line, number, 'check-double').length
                    const emptyLength = getElementsByLineNumberAndClassName(
                        line, number, 'box-empty').length
                    if (lineLength == 2 && emptyLength == 2) {
                        return true
                    }
                    return false
                }

                for (let i = 0; i < esLength; i++) {
                    let doubleOpts = 0
                    const sq = emptySquares[i]
                    sq.classList.add('check-double')
                    const opts = [
                        ['row', sq.getAttribute('data-row')],
                        ['column', sq.getAttribute('data-column')],
                        ['diagonal1', sq.getAttribute('data-diagonal1')],
                        ['diagonal2', sq.getAttribute('data-diagonal2')],
                    ]
                    const optsLength = opts.length
                    for (let i = 0; i < optsLength; i++) {
                        if (twoSqaresDouble(opts[i][0], opts[i][1])) {
                            doubleOpts++
                        }
                    }

                    sq.classList.remove('check-double')

                    if (level >= levelMovement && doubleOpts > 1) {
                        doubleSquares.push(sq)
                    }
                }

                for (let i = 0; i < targetLength; i++) {
                    targetSquares[i].classList.remove('check-double')
                }

                function checkSquareAttack(line, number) {
                    const cpuLength = getElementsByLineNumberAndClassName(
                        line, number, 'set-cpu')
                    const p1Length = getElementsByLineNumberAndClassName(
                        line, number, 'set-p1')

                    if (cpuLength == 1 && p1Length == 0) {
                        return true
                    }
                    return false
                }

                for (let i = 0; i < doubleSquares.length; i++) {
                    const ds = doubleSquares[i]
                    const opts = [
                        ['row', ds.getAttribute('data-row')],
                        ['column', ds.getAttribute('data-column')],
                        ['diagonal1', ds.getAttribute('data-diagonal1')],
                        ['diagonal2', ds.getAttribute('data-diagonal2')]
                    ]

                    for (let i = 0; i < opts.length; i++) {
                        if (checkSquareAttack(opts[i][0], opts[i][1])) {
                            doubleSquaresAndAttack.push(ds)
                        }
                    }
                }

                if (level >= levelMovement) {
                    if (player == 'p1' && doubleSquaresAndAttack.length) {
                        return doubleSquaresAndAttack[0]
                    } else if (doubleSquares.length) {
                        return doubleSquares[0]
                    }
                }

                return false
            }

            function oneSquareAttack() {
                const levelMovement = 1
                let movement

                if (level >= levelMovement) {
                    if (oneSquareAttackMovement("row", 3)) {
                        return movement = oneSquareAttackMovement("row", 3)
                    } else if (oneSquareAttackMovement("column", 3)){
                        return movement = oneSquareAttackMovement("column", 3)
                    } else if (oneSquareAttackMovement("diagonal1", 1)){
                        return movement = oneSquareAttackMovement("diagonal1", 2)
                    } else if (oneSquareAttackMovement("diagonal2", 1)){
                        return movement = oneSquareAttackMovement("diagonal2", 2)
                    }
                }
                return false
            }

            function randomMovement() {
                const idx = Math.floor(Math.random() * esLength)
                return emptySquares[idx]
            }

            if (firstCPU()) {
                square = firstCPU()
            } else if (winOrDefense("cpu")) {
                // console.log('win')
                square = winOrDefense("cpu")
            } else if (winOrDefense("p1")) {
                // console.log('defense')
                square = winOrDefense("p1")
            } else if (defenseCornerStart()) {
                // console.log('defense corner')
                square = defenseCornerStart()
            } else if (centerDefenseFirstMovement()) {
                // console.log('center defense')
                square = centerDefenseFirstMovement()
            } else if (crossDefenseMovement()) {
                // console.log('cross defense')
                square = crossDefenseMovement()
            } else if (centerAttackFirstMovement()) {
                // console.log('center attack')
                square = centerAttackFirstMovement()
            } else if (doubleDefenseOrAttack('cpu')) {
                // console.log('double attack')
                square = doubleDefenseOrAttack('cpu')
            } else if (doubleDefenseOrAttack('p1')) {
                // console.log('double defense')
                square = doubleDefenseOrAttack('p1')
            } else if (oneSquareAttack()) {
                // console.log('one square')
                square = oneSquareAttack()
            } else {
                // console.log('random')
                square = randomMovement()
            }

            setTimeout(() => {
                square.classList.remove('box-empty')
                square.classList.add('set-cpu')
                square.textContent = 'x'
                resolveOrMove()
            }, 300)
        }

        function movePiece(e) {
            for (let i = 0; i < esLength; i++) {
                emptySquares[i].removeEventListener('click', movePiece)
            }
            
            this.classList.remove('box-empty')

            if (playing == 'Jugador 1') {
                this.classList.add('set-p1')
                this.textContent = 'o '
            }

            if (playing == 'Jugador 2') {
                this.classList.add('set-p2')
                this.textContent = 'x '
            }

            resolveOrMove()
        }

        function winner() {
            function checkWinnerLine(line, selLength, player) {
                for (let i = 0; i < selLength; i++) {
                    const lineLength = getElementsByLineNumberAndPlayer(
                        line, i+1, player).length
                    if (lineLength == 3) {
                        return [line, i+1, playing]
                    }
                }
                return false
            }

            const opts = [
                ['row', 3, 'p1'],
                ['column', 3, 'p1'],
                ['diagonal1', 1, 'p1'],
                ['diagonal2', 1, 'p1'],
                ['row', 3, 'p2'],
                ['column', 3, 'p2'],
                ['diagonal1', 1, 'p2'],
                ['diagonal2', 1, 'p2'],
                ['row', 3, 'cpu'],
                ['column', 3, 'cpu'],
                ['diagonal1', 1, 'cpu'],
                ['diagonal2', 1, 'cpu'],
            ]
            const optsLength = opts.length
            for (let i = 0; i < optsLength; i++) {
                const checkWinner = checkWinnerLine(
                    opts[i][0], opts[i][1], opts[i][2])
                if (checkWinner) {
                    return checkWinner
                }
            }
            return false
        }

        function finalMessage(title) {
            swal({
                title: title,
                text: 'Si quieres, puedes jugar una nueva partida',
                buttons: ['Ver Resultado', 'Jugar de Nuevo']
            }).then((ok, ko) => {
                if (ok) {
                    preGame()
                } else {
                    const newGame = document.getElementById('new-game')
                    newGame.classList.remove('hide')
                }
            })

        }

        function youWon(winner) {
            const player = winner[2]
            let title = `¡Ganaste, ${player}!`
            if (player == 'CPU') {
                title = '¡Vaya, Perdiste!'
            }

            const winnerSquares = getElementsByLineAndNumber(
                winner[0], winner[1])
            for (let i = 0; i < 3; i++) {
                winnerSquares[i].classList.add('box-winner')
            }

            finalMessage(title)
        }

        function tie() {
            const emptyBoxes = getEmptySquares()
            if (emptyBoxes.length == 0) {
                return true
            }

            return false
        }

        function resolveOrMove() {
            const getWinner = winner()
            const gameTie = tie()

            if (getWinner) {
                youWon(getWinner)
            } else if (gameTie) {
                const title = '¡Empate!'
                finalMessage(title)
            } else {
                move(notPlaying, playing)
            }
        }
    }
