/* jshint unused: false */


(function(){document.getElementsByTagName('html')[0].classList.remove('no-js');})();



(function() {

    var Events = (function() {

        var topics = {};

        return {

            subscribe: function(topic, callback) {

                if (!topics[topic]) { topics[topic] = { queue:[] }; }

                var index = topics[topic].queue.push(callback) - 1;

                return {

                    remove: function() {

                        delete topics[topic].queue[index];

                    }

                };

            },

            publish: function(topic, info) {

                if (!topics[topic] || !topics[topic].queue.length) { return; }

                var callbacks = topics[topic].queue;

                callbacks.forEach(function(cb) {
                    cb(info || {});
                });

            }

        };

    }());





    function get(el) {
        return document.querySelectorAll(el);
    }



    var Board = (function() {

        var El = {},
            cross = true,
            winLine = [];


        var lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        function setElements() {

            El.board = get('.board--table')[0];

            El.cells = get('.board--cell');

            El.clearButton = get('#clearButton')[0];

            El.scoreBoard = get('.board--score')[0];

        }



        function setSymbol(cell) {

            if (cell.innerHTML !== '') { return; }

            if (cross) {

                cell.innerHTML = 'X';

                cell.dataset.symbol = 1;

                cross = !cross;

            } else {

                cell.innerHTML = 'O';

                cell.dataset.symbol = -1;

                cross = !cross;

            }

        }


        function clearAll() {

            [].forEach.call(El.cells, function(cell) {
                cell.dataset.symbol = '';
                cell.innerHTML = '';
                cell.style.backgroundColor = '';
                cell.style.color = '';
            });

            El.scoreBoard.innerHTML = '';

            cross = true;
        }


        function getScore(cells) {

            var score = 0;

            cells.forEach(function(cell) {

                var sym = parseInt(cell.dataset.symbol) || 0;

                score += sym;

            });

            return score;

        }


        function checkLines() {

            var won = false;

            lines.forEach(function(line) {

                var row = [];

                line.forEach(function(index) {

                    row.push(El.cells[index]);

                });

                var score = getScore(row),
                    dim = Math.sqrt(El.cells.length);

                if (score === dim || score === -(dim)) {

                    won = true;
                    winLine = row;

                }

            });

            return won;

        }

        function showTheWin() {

            winLine.forEach(function(cell, i) {

                window.setTimeout(function() {
                    cell.style.backgroundColor = 'green';
                    cell.style.color = 'white';
                }, parseInt(i) * 100);

            });

            El.scoreBoard.innerHTML = ['X','O'][cross * 1] + ' won !';

        }


        function checkForWin() {

            if (checkLines()) {

                showTheWin();

            }

        }


        function clickOn() {

            [].forEach.call(El.cells, function(cell) {

                cell.addEventListener('click', function() {

                    setSymbol(this);

                    checkForWin();

                });

            });

        }

        function clearOn() {

            El.clearButton.addEventListener('click', clearAll);

        }


        function init() {

            setElements();

            clickOn();

            clearOn();

        }

        return {

            init: init

        };

    }());

    Board.init();



}());