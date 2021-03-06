const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const schemas = require('./schemas')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

var rooms = new Map()

//Socket konfg
//###########
io.set('heartbeat interval', 2000);
io.set('heartbeat timeout', 10000);

//client verbindet sich
io.on('connection', socket => {

	const roomId = socket.handshake.query.roomId

	const boxes = getBoxesOfRoom(roomId)

	//id zuweisen
	const id = socket.id

	const box = new Box(id)

	socket.join(roomId)

	//neuen client anlegen
	boxes.set(id, box)

	//über client benachrichtigen
	console.log(`${id} joined ${roomId}. (${boxes.size})`)

	//clients über neuen client informieren
	socket.broadcast.to(roomId).emit('new', {
		id: id
	})

	//clients beim neuen client initialisieren
	socket.on('init', fn => {
		let boxesArr = []
		for(let value of boxes.values()){
			boxesArr.push(value)
		}
		fn(boxesArr)
	})

	//Box informationen vom Client erhalten
	socket.on('toServer', buffer => {
		const data = schemas.toServerSchema.decode(buffer)
		//suche die passende box und setze x, y und angle
		box.x = data.x
		box.y = data.y
		box.angle = data.angle
		box.velocity = data.velocity
		box.angularVelocity = data.angularVelocity
	})

	socket.on('setFillStyle', color => {
		box.fillStyle = color
		box.fillImage = ""
		socket.broadcast.to(roomId).emit('setFillStyle', {id, color})
	})

	socket.on('setStrokeStyle', color => {
		box.strokeStyle = color
		socket.broadcast.to(roomId).emit('setStrokeStyle', {id, color})
	})
	
	socket.on('setShapeType', shapeType => {
		box.shapeType = shapeType
		socket.broadcast.to(roomId).emit('setShapeType', {id, shapeType})
	})

	socket.on('setFillImage', imageSrc => {
		box.fillImage = imageSrc
		box.fillStyle = ""
		socket.broadcast.to(roomId).emit('setFillImage', {id, imageSrc})
	})

	//periodischen senden von updates an die  Clients;
	const toClientsIntervall = setInterval(toClients, 50)

	//Box Informationen an clients senden
	function toClients() {
		const data = {
			id: box.id,
			x: box.x,
			y: box.y,
			angle: box.angle,
			velocity: box.velocity,
			angularVelocity: box.angularVelocity
		}
		const buffer = schemas.toClientSchema.encode(data)
		socket.broadcast.to(roomId).emit('toClient', buffer);
	}

	//Clients über das verlassen eines Cleints informieren
	//so dass Sie den client entfernen können (leave event)
	socket.on('disconnect', () => {
		boxes.delete(id)
		socket.broadcast.to(roomId).emit('leave', {
			id: id
		});
		console.log(`Client ${id} disconnected. (${boxes.size})`)
		clearInterval(toClientsIntervall)
	})
})

function getBoxesOfRoom(roomId){
	if(rooms.has(roomId)){
		return rooms.get(roomId)
	}else{
		const newRoom = new Map()
		rooms.set(roomId, newRoom)
		return newRoom
	}
}

//Box constructor Server Version
function Box(id, x, y, angle, velocity) {
	this.id = id
	this.x = x || 0
	this.y = y || 5
	this.angle = angle || 0
	this.velocity = velocity || {0: 0, 1: 0}
	this.angularVelocity = 0
	this.fillStyle = "#0000ff"
	this.strokeStyle = "#ff0000"
	this.shapeType = "CIRCLE"
	this.fillImage = null
}

nextApp.prepare().then(() => {

	app.get('/room/:roomId', (req, res) => {
		const queryParams = {roomId: req.params.roomId}
		nextApp.render(req, res, '/room', queryParams)
	})

	app.get('*', (req, res) => {
		return nextHandler(req, res)
	})

	server.listen(3000, err => {
		if (err) throw err
		console.log('> Ready on http://localhost:3000')
	})
})
