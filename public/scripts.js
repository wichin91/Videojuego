
// Secciones
const DOMSectionNombre = document.querySelector('.nombre-jugador')
const DOMSectionMascotas = document.querySelector('.seleccionar-mascota')
const DOMSectionMapa = document.querySelector('.mover-mapa')
const DOMSectionAtaques = document.querySelector('.seleccionar-ataque')
const DOMSectionMensaje = document.querySelector('.mensaje')
const DOMSectionReiniciar = document.querySelector('.reiniciar')
const media = window.matchMedia("(max-width: 600px)")

const DOMJugadorNombreDiv = document.querySelector('#nombre-div')
const DOMJugadorNombre = document.querySelector('#jugador-nombre')

// Jugador
const inpNombreJugador = document.querySelector('#input-nombre')
let jugadorNombre = null
let enemigoNombre = null

// Mascotas
const DOMContenedorTarjetas = document.querySelector('#contenedor-tarjetas')
let DOMInputsTarjetas
let listaPokemones
let jugadorMascotaNombre = null
let jugadorMascotaObj

// Mapa
const DOMMapa = document.querySelector('#mapa')
let lienzo = DOMMapa.getContext("2d")
let intervalo
let listaEnemigos = []
let enemigosMascotas = []

// Ataques
const DOMNombreOponente = document.querySelector('#oponente')
const DOMVidas = document.querySelector('#vidas')
const DOMContenedorAtaques = document.querySelector('#contenedor-ataques')
const DOMResultado = document.querySelector('#resultado')
let listaAtaques
let ataqueJugador
let ataqueEnemigo
let vidasJugador
let vidasEnemigo

// Botones
const btnNombreJugador = document.querySelector('#boton-nombre')
const btnSeleccionarMascota = document.querySelector('#boton-mascota')
const btnUp = document.querySelector('#arrow-up')
const btnLeft = document.querySelector('#arrow-left')
const btnRight = document.querySelector('#arrow-right')
const btnDown = document.querySelector('#arrow-down')
let btnsAtaques
const btnMensaje = document.querySelector('#boton-mensaje')
const btnReiniciar = document.querySelector('#boton-reiniciar')



// inicio de la app, se escuchan los eventos 
function iniciarJuego(event) {
    DOMSectionMascotas.style.display = 'none'
    DOMSectionMapa.style.display = 'none'
    DOMSectionAtaques.style.display = 'none'
    DOMSectionMensaje.style.display = 'none'
    DOMSectionReiniciar.style.display = 'none'
    
    inpNombreJugador.addEventListener('keypress', unirseAlJuego)
    btnNombreJugador.addEventListener('click', unirseAlJuego)
    btnSeleccionarMascota.addEventListener('click', seleccionarMascota)
    btnReiniciar.addEventListener('click', () => {location.reload()})
}

// le manda al servidor el nombre del jugador y le responde con el nombre del jugador si este no esta ocupado y con la lista de pokemones
function unirseAlJuego(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        if (inpNombreJugador.value) {
            fetch('http://192.168.100.10:3000/unirse', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: inpNombreJugador.value
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    listaPokemones = data.pokemones
                    jugadorNombre = data.nombre
    
                    crearTarjetas()
                } else {
                    alert('Ese nombre ya esta ocupado.')
                }
            })
            .catch(err => {
                alert('Solicitud para unirse al juego fallida. ' + err)
                location.reload()
            })
        } else {alert('Ingrese el nombre del jugador.')}
    }
}

// le manda al servidor una señal cuando se va a cerrar la app para que lo quite de la lista de jugadores
function desunirseAlJuego(event) {
    event.preventDefault()
    event.returnValue
    clearInterval(intervalo)

    if (jugadorNombre) {
        fetch(`http://192.168.100.10:3000/desunirse/${jugadorNombre}`, {
            method: 'get',
            keepalive: true
        })
    }
}

function crearTarjetas() {
    DOMJugadorNombreDiv.style.display = 'block'
    DOMSectionNombre.style.display = 'none'
    DOMSectionMascotas.style.display = 'flex'
    DOMJugadorNombre.innerHTML = jugadorNombre
    
    listaPokemones.forEach(pokemon => {
        let opcionPokemon = `
        <label class="tarjeta-mascota" for="${pokemon.nombre}">
            <p>${pokemon.nombre}</p>
            <img src="${pokemon.imgUrl}" alt="${pokemon.nombre}">
        </label>
        <input type="radio" name="mascota" id="${pokemon.nombre}" value="${pokemon.nombre}">`
        DOMContenedorTarjetas.innerHTML += opcionPokemon
    });
    
    DOMInputsTarjetas = document.getElementsByName('mascota')
    DOMInputsTarjetas.forEach(item => {
        item.addEventListener('change', cambiarEstiloTarjeta)
    })
}

// cambia el estilo de seleccion de las tarjetas cuando son seleccionadas
function cambiarEstiloTarjeta() {
    DOMInputsTarjetas.forEach(input => {
        if (input.checked) {
            input.labels[0].style.background = "white"
            if (media.matches) {
                input.labels[0].style.transform = "translateX(-6px)"
            } else {
                input.labels[0].style.transform = "translateY(-6px)"
            }
        } else {
            input.labels[0].style.background = ""
            input.labels[0].style.transform = "initial"
        }
    })
}

// funcion que se ejecuta al click del boton de seleccionar mascota, se inicia el mapa
function seleccionarMascota() {
    jugadorMascotaNombre = Array.from(DOMInputsTarjetas)
        .find(item => item.checked)
    if (jugadorMascotaNombre) {
        jugadorMascotaNombre = jugadorMascotaNombre.id
        DOMSectionMascotas.style.display = 'none'
        DOMSectionMapa.style.display = 'flex'
        enviarPokemon(jugadorMascotaNombre)
    } else {alert('Selecciona una mascota.')}
}

// despues del click a seleccionar mascota, se envia el nombre del pokemon al servidor y responde con el objeto del pokemon y se inicia un intervalo
function enviarPokemon(jugadorMascotaNombre) {
    fetch(`http://192.168.100.10:3000/pokemon/${jugadorNombre}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pokemon: jugadorMascotaNombre
        })
    })
    .then(res => res.json())
    .then(data => {
        jugadorMascotaObj = new Pokemon(data)
        btnUp.addEventListener('mousedown', ()=>jugadorMascotaObj.arrowUp(DOMMapa))
        btnLeft.addEventListener('mousedown', ()=>jugadorMascotaObj.arrowLeft(DOMMapa))
        btnRight.addEventListener('mousedown', ()=>jugadorMascotaObj.arrowRight(DOMMapa))
        btnDown.addEventListener('mousedown', ()=>jugadorMascotaObj.arrowDown(DOMMapa))

        intervalo = setInterval(enviarPosicion, 100)
    })
    .catch(err => {
        alert('Solicitud para enviar pokemon fallida. ' + err)
        location.reload()
    })
}

// cada intervalo se envia la posicion y recibe la info de los enemigos
function enviarPosicion(){
    fetch(`http://192.168.100.10:3000/pokemon/posicion/${jugadorNombre}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x: jugadorMascotaObj.x,
            y: jugadorMascotaObj.y,
        })
    })
    .then(res => res.json())
    .then(data => {
        checarEnemigos(data)
    })
    .catch(err => {
        alert('Solicitud para enviar posicion fallida. ' + err)
        location.reload()
    })
}

// revisa la informacion de los enemigos y crea una lista de los enemigos que estan en juego
function checarEnemigos(lista) {
    lista.forEach((element, index) => {
        if (element.pokemon && element.pokemon.x) {
            if (!listaEnemigos.find(item => item.nombre == element.nombre)) {
                listaEnemigos.push(element)
                enemigosMascotas.push(new Pokemon(element.pokemon))
            } else {
                enemigosMascotas[index].x = element.pokemon.x
                enemigosMascotas[index].y = element.pokemon.y
                enemigosMascotas[index].enemigo = element.pokemon.enemigo
            }
        }
    });

    listaEnemigos.forEach((element, index, object) => {
        if(!lista.find(item => item.nombre == element.nombre)){
            object.splice(index, 1)
            enemigosMascotas.splice(index, 1)
        }
    })
    
    pintarPokemones()
}

// pinta al jugador y a cada uno de los enemigos en el mapa
function pintarPokemones() {
    lienzo.clearRect(0, 0, DOMMapa.width, DOMMapa.height);
    jugadorMascotaObj.pintarMiPokemon(lienzo)

    enemigosMascotas.forEach((enemigoPok, enemigoIndex) => {
        if (enemigoPok.x) {
            if (!enemigoPok.enemigo) {
                enemigoPok.pintarPokemon(lienzo)
            }
            detectarColision(enemigoPok, enemigoIndex)
        }
    })
}

// detecta si hay una colision entre el jugador y alguno de los enemigos
function detectarColision(enemigoPok, enemigoIndex) {
    const posEnemigo = {up: enemigoPok.y,
                    down: (enemigoPok.y + enemigoPok.alto),
                    left: enemigoPok.x, 
                    right: (enemigoPok.x + enemigoPok.ancho)}

    const posJugador =  {up: jugadorMascotaObj.y,
                    down: (jugadorMascotaObj.y + jugadorMascotaObj.alto),
                    left: jugadorMascotaObj.x, 
                    right: (jugadorMascotaObj.x + jugadorMascotaObj.ancho)}
    
    if (posJugador.down < posEnemigo.up ||
        posJugador.up > posEnemigo.down ||
        posJugador.right < posEnemigo.left ||
        posJugador.left > posEnemigo.right
    ) {
        return
    } 
    else {
        enviarColision(enemigoPok)
    }
}

// en caso de que detecte una colision se enviara al servidor, en el servidor se asignara el oponente, en caso de que el enemigo ya este ocupado no hara nada, y si no se iniciara la secuencia de ataques
function enviarColision(enemigoPok) {
    fetch(`http://192.168.100.10:3000/colision/${jugadorNombre}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            enemigo: enemigoPok.jugador
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            clearInterval(intervalo)
            jugadorMascotaObj.enemigo = data.enemigo
            enemigoNombre = data.enemigo
        
            secuenciaAtaques()
        }
    })
    .catch(err => {
        alert('Solicitud para enviar colision fallida. ' + err)
        location.reload()
    })
}

function secuenciaAtaques() {
    DOMSectionMapa.style.display = 'none'
    DOMSectionAtaques.style.display = 'flex'
    DOMNombreOponente.innerHTML = jugadorMascotaObj.enemigo
    
    vidasJugador = jugadorMascotaObj.vidas
    vidasEnemigo = jugadorMascotaObj.vidas
    listaAtaques = jugadorMascotaObj.ataques
    DOMVidas.innerHTML = ('❤ ').repeat(vidasJugador)
    
    listaAtaques.forEach(ataque => {
        let btnAtaque = document.createElement('button')
        btnAtaque.className = 'boton'
        btnAtaque.id = `ataque-${ataque.ataque}`
        btnAtaque.innerHTML = `${ataque.icono}${ataque.ataque.toUpperCase()}`
        btnAtaque.addEventListener('click', () => enviarAtaque(ataque.ataque))
        DOMContenedorAtaques.appendChild(btnAtaque)
    });
}

function enviarAtaque(ataque) {
    ataqueJugador = ataque
    fetch(`http://192.168.100.10:3000/ataque/${jugadorNombre}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataque: ataqueJugador
        })
    })
    intervalo = setInterval(obtenerAtaque, 100)
}

function obtenerAtaque() {
    fetch(`http://192.168.100.10:3000/ataque/${enemigoNombre}`)
    .then(res => res.json())
    .then(data => {
        if (data) {
            clearInterval(intervalo)
            ataqueEnemigo = data.ataque
            DOMSectionMensaje.style.display = 'none'
            combate()
        } else {
            mostrarMensaje('Esperando a que el rival envie su ataque...', 'none')
        }
    })
    .catch(err => {
        alert('Solicitud para obtener ataque fallida. ' + err)
        location.reload()
    })
}

function combate() {
    let texto = `El oponente ha atacado con ${ataqueEnemigo.toUpperCase()}<br>Tu has atacado con ${ataqueJugador.toUpperCase()}<br><br>
    `
    if (ataqueJugador == ataqueEnemigo) {
        texto += 'Empataste contra el oponente'
    } else if ((ataqueJugador === 'fuego' && ataqueEnemigo === 'tierra') ||
            (ataqueJugador === 'agua' && ataqueEnemigo === 'fuego') ||
            (ataqueJugador === 'tierra' && ataqueEnemigo === 'agua')) {
        texto += 'Muy bien! Le has quitado una vida al oponente'
        vidasEnemigo --
    } else {
        texto += 'Lo siento, has perdido una vida'
        vidasJugador --
    }
    mostrarMensaje(texto, 'inline-block')
    revisarVidas()
}

function revisarVidas() {
    DOMVidas.innerHTML = ('❤ ').repeat(vidasJugador)
    if (vidasJugador == 0) {
        reiniciarJuego()
    } else if (vidasEnemigo == 0) {
        mostrarMensaje('Felicidades! Has ganado el juego', 'inline-block')
        DOMSectionAtaques.style.display = 'none'
        DOMSectionMapa.style.display = 'flex'
        fetch(`http://192.168.100.10:3000/reiniciar/${jugadorNombre}`)
        
        enviarPokemon(jugadorMascotaNombre)
        // intervalo = setInterval(enviarPosicion, 100)
    }
}

function reiniciarJuego() {
    DOMSectionReiniciar.style.display = 'flex'
}

function mostrarMensaje(text, displayBtn) {
    DOMSectionMensaje.style.display = 'flex'
    DOMResultado.innerHTML = text
    btnMensaje.style.display = displayBtn
}

btnMensaje.addEventListener('click', () => {
    DOMSectionMensaje.style.display = 'none'
})

window.addEventListener('load', iniciarJuego)
window.addEventListener('beforeunload', desunirseAlJuego)

window.addEventListener('keydown', (event)=>{
    if (jugadorMascotaObj) {
        if (event.key == 'ArrowUp') {
            jugadorMascotaObj.arrowUp(DOMMapa)
        } else if (event.key == 'ArrowLeft') {
            jugadorMascotaObj.arrowLeft(DOMMapa)
        } else if (event.key == 'ArrowDown') {
            jugadorMascotaObj.arrowDown(DOMMapa)
        } else if (event.key == 'ArrowRight') {
            jugadorMascotaObj.arrowRight(DOMMapa)
        }
    }
})