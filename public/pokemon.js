class Pokemon {
    constructor(obj) {
        this.nombre = obj.nombre
        this.imgUrl = obj.imgUrl
        this.vidas = obj.vidas
        this.ataques = obj.ataques
        this.jugador = obj.jugador
        this.enemigo = obj.enemigo
        this.ancho = obj.ancho
        this.alto = obj.alto
        if (obj.x && obj.y) {
            this.x = obj.x
            this.y = obj.y
        } else{
            this.x = Math.floor(Math.random() * (301 - this.ancho))
            this.y = Math.floor(Math.random() * (151 - this.alto))
        }
        this.imagen = new Image();
        this.imagen.src = this.imgUrl
    }
    pintarMiPokemon(lienzo) {
        lienzo.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto)
        lienzo.beginPath()
        lienzo.strokeStyle = 'red'
        lienzo.roundRect(this.x, this.y, this.ancho, this.alto, 5)
        lienzo.stroke()
    }
    pintarPokemon(lienzo) {
        lienzo.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto)
    }
    arrowUp(mapa){
        if ((this.y - 5) >= 0) {
            this.y -= 5
        } else {
            this.y = 0
        }
    }
    arrowLeft(mapa){
        if ((this.x - 5) >= 0) {
            this.x -= 5
        } else {
            this.x = 0
        }
    }
    arrowDown(mapa){
        if ((this.y + 5) <= mapa.height - this.alto) {
            this.y += 5
        } else {
            this.y = mapa.height - this.alto
        }
    }
    arrowRight(mapa){
        if ((this.x + 5) <= mapa.width - this.ancho) {
            this.x += 5
        } else {
            this.x = mapa.width - this.ancho
        }
    }
}

