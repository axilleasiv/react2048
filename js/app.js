/**
 * @jsx React.DOM
 */


var GridRow = React.createClass({
	render: function() {
		var gridCells = [0, 0, 0, 0];

		gridCells = gridCells.map(function(cell){
			return (<GridCell/>)
		})

		return (<div className="grid-row">
					{gridCells}
				</div>);
	}
});

var GridCell = React.createClass({
	render: function() {
		return (<div className="grid-cell"></div>);
	}
});

var Grid = React.createClass({
	render: function(){
		var gridRows = [0, 0, 0, 0];

		gridRows = gridRows.map(function(cell){
			return (<GridRow/>)
		})

		return (<div>{gridRows}</div>);
	}
});

var Tile = React.createClass({
	render: function(){
		// console.log(this.props);
		var tileValue = 'tile-' + this.props.value,
			tilePos = 'tile-position-' + this.props.x + '-' + this.props.y,
			tileClass = {
				'tile': true,
				'tile-new': true,
				'tile-merged': this.props.merged
			},
			calculatePosition = function(x, y){
				var tilePosition = 121;

				x = x * tilePosition;
				y = y * tilePosition;

				return 'translate(' + x + 'px, ' + y + 'px)';

			},
			position = calculatePosition(this.props.x, this.props.y),
			tileStyle = {};


			tileStyle.WebkitTransform = position;
			tileStyle.MozTransform = position;
			tileStyle.transform = position;
			tileClass[tileValue] = true;
			tileClass[tilePos] = true;
			tileClass = React.addons.classSet(tileClass);


		return (<div style={tileStyle} className={tileClass}>
					<div className="tile-inner">{this.props.value}</div>
				</div>);
	}
});


var Tiles = React.createClass({

	render: function(){

		var tiles = this.props.tiles.map(function(tile){
			return (<Tile value={tile.value} x={tile.x} y={tile.y} />);
		});

		return (<div>{tiles}</div>);
	}
});

var Button = React.createClass({
	
	handleClick: function(e) {
		console.log('clcik');
	},

	render: function(){
		return (<a onClick={this.handleClick} className={this.props.class}>{this.props.text}</a>);
	}
});


var Score = React.createClass({
	render: function(){
		return (<div className={this.props.class}>{this.props.score}</div>);
	}
});

var SelectTiles = React.createClass({
	
	handleChange: function(e){
		console.log(this);
	},

	render: function(){
		return (<select v-on="change: changesTilesSize" onChange={this.handleChange}>
					<option value="4">4 tiles</option>
					<option value="5">5 tiles</option>
					<option value="6">6 tiles</option>
				</select>);
	}

});

var Game = React.createClass({

	getInitialState: function() {
		return {
				score: 1,
				size: 4,
				bestScore: gameStorage.fetch('react2048-config').bestScore || 10,
				tiles: []
			};
	},

	componentDidMount: function() {
		// console.log('--------componentDidMount-------');
	},
	
	componentDidUpdate: function() {
		// console.log('--------componentDidUpdate-------');
	},
	
	componentWillMount: function() {
		// console.log('--------componentWillMount-------');

		var data = gameStorage.fetch('react2048');

		if (data.length === 0) {
			this.init();
		} else {
			this.continueGame(data);
		}

	},
	
	componentWillReceiveProps: function() {
		// console.log('--------componentWillReceiveProps-------');
	},
	
	componentWillUnmount: function() {
		// console.log('--------componentWillUnmount-------');
	},
	
	componentWillUpdate: function() {
		// console.log('--------componentWillUpdate-------');
	},

	render: function(){

		return (<div className="container" id="mainVue">
					<div className="heading">
						<h1 className="title">2048</h1>
						<div className="scores-container">
							<Score class="score-container" score={this.state.score} />
							<Score class="best-container" score={this.state.bestScore} />
						</div>
					</div>
					<div className="above-game">
						<p className="game-intro">Join the numbers and get to the <strong>2048 tile!</strong></p>
						<Button text="New Game" class="restart-button" />
						<label className='left' for="noTiles">Select the number of tiles</label>
						<SelectTiles />
					</div>
					<div className="game-container">
						<div className="game-message">
							<p></p>
							<div className="lower">
								<a className="keep-playing-button" v-on="click: clearMessage">Keep going</a>
								<a className="retry-button" v-on="click: init">Try again</a>
							</div>
						</div>
						<div className="grid-container" id="grid-container">
							<Grid/>
						</div>
						<div className="tile-container" id="tile-container">
							<Tiles tiles={this.state.tiles} />
						</div>
					</div>
				</div>);
	},

	init: function() {

		var startTiles = this.props.startTiles;
		this.initArrayGrid(this.state.size);
		
		//this.clearMessage();
		
		this.updateScore(0);

		for (var i = 0; i < this.props.startTiles; i++) {
			this.addRandomTile();
		}
	},

	continueGame: function(data) {
		var arr,
			conf;

		this.conf = conf =  gameStorage.fetch('react2048-config');    
		this.initArrayGrid(this.state.size);
		arr = this.grid;
		this.state.tiles = data;

		data.forEach(function(item) {
			arr[item.x][item.y] = 1;
		});
	},

	gameOver: function() {
		this.message();
	},

	initArrayGrid: function(size) {
		var arr = [];

		for (var x = 0; x < size; x++) {
			arr[x] = [];
			for (var y = 0; y < size; y++) {
				arr[x][y] = 0;
			}
		}

		this.grid = arr;
	},

	changesTilesSize: function(e) {
		this.state.size = parseInt(e.target.value);
		
		this.init();
	},

	addRandomTile: function() {
	
		if (this.availableCells().length > 0) {
			var value = Math.random() < 0.9 ? 2 : 4,
				randomCell = this.randomAvailableCell(),
				tiles = this.state.tiles;

			this.grid[randomCell.x][randomCell.y] = 1;

			tiles.push({
				x: randomCell.x,
				y: randomCell.y,
				value: value
			});

			this.setState({
				tiles: tiles
			});

			console.log(this.state.tiles);

		}

	},

	// Find the first available random position
	randomAvailableCell: function() {
		var cells = this.availableCells();

		if (cells.length) {
			return cells[Math.floor(Math.random() * cells.length)];
		}
	},

	availableCells: function() {
		var cells = [],
			size = this.state.size,
			grid = this.grid;

		for (var x = 0; x < size; x++) {
			for (var y = 0; y < size; y++) {
				if (!grid[x][y]) {
					cells.push({
						x: x,
						y: y
					});
				}
			}
		}

		return cells;
	},

	getVector: function(direction) {
		var map = {
			0: {
				x: 0,
				y: -1
			}, // Up
			1: {
				x: 1,
				y: 0
			}, // Right
			2: {
				x: 0,
				y: 1
			}, // Down
			3: {
				x: -1,
				y: 0
			} // Left
		};

		return map[direction];
	},

	findFarthestPosition: function(cell, vector) {
		var previous;

		do {
			previous = cell;
			cell = {
				x: previous.x + vector.x,
				y: previous.y + vector.y
			};

		} while (this.withinBounds(cell) && !this.grid[cell.x][cell.y]);

		return {
			farthest: previous,
			next: cell // Used to check if a merge is required
		};
	},

	findTile: function(position) {

		if (position.x === -1 || position.y === -1)
			return null;
		else {
			var tiles = this.state.tiles;

			return tiles.filter(function(item, index) {
				//console.log(item, index);

				return item.x === position.x && item.y === position.y;
			})[0];
		}

	},

	moveTile: function(tile, position) {

		if (tile.x === position.x && tile.y === position.y) {
			return false;
		} else {
			this.grid[tile.x][tile.y] = 0;
			this.grid[position.x][position.y] = 1;

			var tiles = this.state.tiles;

			//Better Way to find index of data
			for (var key in tiles) {
				if (tiles[key].x === tile.x && tiles[key].y === tile.y) {
					break;
				}
			}

			tiles[key].x = position.x;
			tiles[key].y = position.y;
			
			// this.setState({
			// 	tiles: tiles
			// });

			// tile.x = position.x;
			// tile.y = position.y;

			return true;
		}

	},

	mergeTiles: function(curr, next, position) {
		//debugger;
		next.value = next.value * 2;
		next.merged = true;
		var tiles = this.state.tiles;

		//Better Way to find index of data
		for (var key in tiles) {
			if (tiles[key].x === curr.x && tiles[key].y === curr.y) {
				break;
			}
		}

		this.grid[curr.x][curr.y] = 0;
		tiles.splice(key, 1);
		
		console.log(tiles);

		// this.setState({
		// 	tiles: tiles
		// });

		


		// Update the score
		this.updateScore(next.value);

		return true;
	},

	move: function(direction) {

		var vector = this.getVector(direction);
		var traversals = this.buildTraversals(vector);
		var moved = false;
		var self = this;
		var grid = self.grid;
		var positions;
		var next;
		var tile;


		traversals.x.forEach(function(x) {
			traversals.y.forEach(function(y) {
				// console.log(x, y);
				if (grid[x][y]) {
					var tile = self.findTile({
						x: x,
						y: y
					});
					var positions = self.findFarthestPosition({
						x: x,
						y: y
					}, vector);
					//console.log(positions);
					var next = self.findTile(positions.next);

					//console.log(next); 
					// Only one merger per row traversal?
					if (next && next.value === tile.value) {
						moved = self.mergeTiles(tile, next, positions.next);
					
					} else {

						moved = self.moveTile(tile, positions.farthest);
					}

				}

			});
		});
		
		if (moved) {
			this.addRandomTile();

			if(grid.toString().indexOf('0') === -1){
				if(!this.tileMatchesAvailable()){
					this.gameOver();
				}

			}

		}

	},

	tileMatchesAvailable: function() {

		var size = this.state.size;
		var grid = this.grid;
		var tiles = this.state.tiles;
		var tile;

		for (var x = 0; x < size; x++) {
			for (var y = 0; y < size; y++) {
				tile = grid[x][y];

				if (tile) {
					for (var direction = 0; direction < 4; direction++) {
						var vector = this.getVector(direction);
						var cell = {
							x: x + vector.x,
							y: y + vector.y
						},
							other;

						if (cell.x >= 0 && cell.x < size && cell.y >= 0 && cell.y < size){
							other = grid[cell.x][cell.y];
						} else {
							continue;
						}

						if (other && this.findTile(cell).value === this.findTile({
							x: x,
							y: y
						}).value) {
							return true; // These two tiles can be merged
						}
					}
				}
			}
		}

		return false;
	},

	withinBounds: function(position) {
		var size = this.state.size;

		return position.x >= 0 && position.x < size && position.y >= 0 && position.y < size;
	},

	buildTraversals: function(vector) {
		var traversals = {
			x: [],
			y: []
		},
			size = this.state.size;

		for (var pos = 0; pos < size; pos++) {
			traversals.x.push(pos);
			traversals.y.push(pos);
		}

		// Always traverse from the farthest cell in the chosen direction
		if (vector.x === 1) traversals.x = traversals.x.reverse();
		if (vector.y === 1) traversals.y = traversals.y.reverse();

		return traversals;
	},

	updateScore: function(score) {
		var scoreContainer = document.getElementsByClassName('score-container')[0];

		//On init
		if (score === 0) {
			//this.conf.score = 0;
			this.setState({
				score:0
			});

			return false;
		}
	   
		this.setState({
			score: this.state.score + score
		});

		//this.conf.score += score;
		//gameStorage.save('score', this.score);

		if(this.state.score > this.state.bestScore) {
			this.state.bestScore = this.state.score;
			//gameStorage.save('bestScore', this.bestScore);
		}

		// The mighty 2048 tile
		if (score === 2048)
			this.message(true);

		var addition = document.createElement("div");
		addition.classList.add("score-addition");
		addition.textContent = "+" + score;
		scoreContainer.appendChild(addition);

	},

	message: function(won) {
		var type = won ? "game-won" : "game-over";
		var message = won ? "You win!" : "Game over!";
		var messageContainer = document.querySelector(".game-message");

		messageContainer.classList.add(type);
		messageContainer.getElementsByTagName("p")[0].textContent = message;
	},

	clearMessage: function() {
		messageContainer = document.querySelector(".game-message");

		messageContainer.classList.remove("game-won");
		messageContainer.classList.remove("game-over");
	},

	clearContainer: function(container) {
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	},

	getWindowSize: function() {
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			x = w.innerWidth || e.clientWidth || g.clientWidth,
			y = w.innerHeight || e.clientHeight || g.clientHeight;

		if (x < 520) {
			this.tileDimension = 69.5;
			this.tilePosition = 67;
		} else {
			this.tileDimension = 124;
			this.tilePosition = 121;

		}
	}

	
});


var data = []

var game = React.renderComponent(
		<Game tiles={data} startTiles="2" score="0" bestScore="0" />, 
		document.body
	);

var Keys = new KeyboardInputManager();


Keys.on('move', function(direction) {
	game.move(direction);
});


// window.onresize = function(event) {
//     Game.getWindowSize();
// };