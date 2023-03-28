
class Pokemon {
    constructor(nombre, imgUrl) {
        this.nombre = nombre
        this.imgUrl = imgUrl
        this.vidas = 3
        this.ataques = []
        this.jugador = null
        this.enemigo = null
        this.ancho = 40
        this.alto = 45
        this.x = null
        this.y = null

    }
}

let bulbasaur = new Pokemon('Bulbasaur', './images/bulbasaur.png');
let squirtle = new Pokemon('Squirtle', './images/squirtle.png');
let charmander = new Pokemon('Charmander', './images/charmander.png');
let pikachu = new Pokemon('Pikachu', './images/pikachu.png');

bulbasaur.ataques.push(
    {ataque: 'tierra', icono: '🌱'},
    {ataque: 'agua', icono: '💧'},
    {ataque: 'fuego', icono: '🔥'},
)
squirtle.ataques.push(
    {ataque: 'agua', icono: '💧'},
    {ataque: 'fuego', icono: '🔥'},
    {ataque: 'tierra', icono: '🌱'},
)
charmander.ataques.push(
    {ataque: 'fuego', icono: '🔥'},
    {ataque: 'agua', icono: '💧'},
    {ataque: 'tierra', icono: '🌱'},
)
pikachu.ataques.push(
    {ataque: 'fuego', icono: '🔥'},
    {ataque: 'agua', icono: '💧'},
    {ataque: 'tierra', icono: '🌱'},
)

let pokemones = []
pokemones.push(bulbasaur, squirtle, charmander, pikachu)

module.exports = pokemones