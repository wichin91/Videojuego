
const express = require('express')
const cors = require("cors")
const pokemones = require('./pokemon')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(cors())
app.use(express.json())

const jugadores = []

class Jugador {
    constructor(nombre) {
        this.nombre = nombre
        this.pokemon = null
        this.ataque = null
    }
}

app.post('/unirse', (req, res) => {
    const nombre = req.body.nombre
    let jugador

    // res.setHeader("Access-Control-Allow-Origin", "*")

    if (!jugadores.find(jugador => jugador.nombre == nombre)) {
        jugador = new Jugador(nombre)
        jugadores.push(jugador)
        res.send({nombre: nombre, pokemones: pokemones})
    } else {
        res.send(false)
    }
    console.log(jugadores);
})

app.get('/desunirse/:jugadorNombre', (req, res) => {
    const jugadorNombre = req.params.jugadorNombre || ""
    const jugadorIndex = jugadores.findIndex(item => item.nombre == jugadorNombre)
    if (jugadorIndex >= 0) {
        jugadores.splice(jugadorIndex,1)
    }

    res.end()
    console.log(jugadores);
})

app.post('/pokemon/:jugadorNombre', (req, res) => {
    const jugadorNombre = req.params.jugadorNombre || ""
    const jugadorPokemon = req.body.pokemon || ""
    const jugador = jugadores.find(jugador => jugador.nombre == jugadorNombre)
    const pokemon = pokemones.find(pokemon => pokemon.nombre == jugadorPokemon)

    jugador.pokemon = {...pokemon}
    jugador.pokemon.jugador = jugadorNombre
    console.log(jugadores);

    res.send(jugador.pokemon)
})

app.post('/pokemon/posicion/:jugadorNombre', (req, res) => {
    const jugadorNombre = req.params.jugadorNombre || ""
    const jugadorPokemonX = req.body.x || ""
    const jugadorPokemonY = req.body.y || ""
    const jugador = jugadores.find(jugador => jugador.nombre == jugadorNombre)
    jugador.pokemon.x = jugadorPokemonX
    jugador.pokemon.y = jugadorPokemonY

    let enemigos = jugadores.filter(jugador => 
        jugador.nombre != jugadorNombre)

    res.send(enemigos)
})

app.post('/colision/:jugadorNombre', (req, res) => {
    const jugadorNombre = req.params.jugadorNombre || ""
    const enemigoNombre = req.body.enemigo || ""
    const jugador = jugadores.find(jugador => jugador.nombre == jugadorNombre)
    const enemigo = jugadores.find(jugador => jugador.nombre == enemigoNombre)

    if (!jugador.pokemon.enemigo && !enemigo.pokemon.enemigo) {
        jugador.pokemon.enemigo = enemigoNombre
        enemigo.pokemon.enemigo = jugadorNombre
        console.log(jugador.nombre);
        res.send({enemigo: enemigoNombre})
    } else if(jugadorNombre == enemigo.pokemon.enemigo) {
        res.send({enemigo: enemigoNombre})
        console.log(jugador.nombre);
    } else (res.send(false))
})

app.post('/ataque/:jugadorNombre', (req, res) => {
    const jugadorNombre = req.params.jugadorNombre || ""
    const jugadorAtaque = req.body.ataque || ""
    const jugador = jugadores.find(jugador => jugador.nombre == jugadorNombre)
    jugador.ataque = jugadorAtaque
    res.end()
})

app.get('/ataque/:enemigoNombre', (req, res) => {
    const enemigoNombre = req.params.enemigoNombre || ""
    const enemigo = jugadores.find(enemigo => enemigo.nombre == enemigoNombre)

    if (enemigo.ataque) {
        res.send({ataque: enemigo.ataque})
        enemigo.ataque = null
    } else (res.send(false))
})

app.get('/reiniciar/:jugadorNombre', (req, res) => {
    const jugadorNombre = req.params.jugadorNombre || ""
    const jugador = jugadores.find(jugador => jugador.nombre == jugadorNombre)

    jugador.pokemon.enemigo = null
    jugador.ataque = null
    res.end()
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})