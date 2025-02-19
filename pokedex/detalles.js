let encontrado = 0;
let detalles = document.getElementById("detallesPokemones")
async function detallesPokemon(){
    encontrado = 0;
    let volver = document.getElementById("Home")
    volver.addEventListener("click", () =>{
        window.location.href = `index.html`
    })
    let nombrePokemon = localStorage.getItem("nombrePokemon")
    let pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
    let pokemonJson = await pokemon.json()
    detalles.innerHTML = ``
    let nombre = document.createElement("h1")
    nombre.textContent = pokemonJson.name
    nombre.id = "nombrePokemon"
    let imagen = document.createElement("img")
    imagen.src = pokemonJson.sprites.front_default
    imagen.id = "imagenPokemon"
    let espciePokemon = await fetch(`${pokemonJson.species.url}`)
    let espciePokemonJson = await espciePokemon.json()
    let descripcion = document.createElement("p")
    for(let descript of espciePokemonJson.flavor_text_entries){
        if(encontrado == 0){
            if(descript.language.name == "es"){
                descripcion.textContent = descript.flavor_text
                descripcion.id = "descripcionPokemon"
                encontrado = 1
            }   
        }
    }
    let estadisticas = document.createElement("table")
    let enunciado = document.createElement("caption")
    enunciado.textContent= "ESTADÍSTICAS"
    estadisticas.appendChild(enunciado)
    for(let estadistica of pokemonJson.stats){
        let fila = document.createElement("tr")
        let nommbreEstadistica = document.createElement("td")
        let valorEstadistica = document.createElement("td")
        nommbreEstadistica.textContent = ` ${estadistica.stat.name}`
        valorEstadistica.textContent = `${estadistica.base_stat}`
        fila.appendChild(nommbreEstadistica)
        fila.appendChild(valorEstadistica)
        estadisticas.appendChild(fila)
        estadisticas.id = "tablaEstadisticas"
    }
    let habilidades = document.createElement("p")
    let enunciadoHabilidades = document.createElement("caption")
    enunciadoHabilidades.textContent= "HABILIDADES"
    enunciadoHabilidades.id="EhabilidadesPokemon"
    for(let habilidad of pokemonJson.abilities){
        encontrado = 0
        let habilidadPokemon = await fetch(`${habilidad.ability.url}`)
        let habilidadPokemonJson = await habilidadPokemon.json()
        habilidades.textContent += (` ${habilidadPokemonJson.name}: `)
        for(descript of habilidadPokemonJson.flavor_text_entries){
            if(encontrado == 0){
                if(descript.language.name == "es"){
                    habilidades.textContent += (` ${descript.flavor_text}\n\n`)
                    encontrado = 1
                    habilidades.id = "habilidadesPokemon"
                }
            }
        }
    }

    let evolutionChain = await fetch(`${espciePokemonJson.evolution_chain.url}`)
    let evolutionChainJson = await evolutionChain.json()
    let evoluciones = document.createElement("div")
    if(await conseguirPokemonBase(evolutionChainJson) != null){
        evoluciones.appendChild(await conseguirPokemonBase(evolutionChainJson))
        console.log(evoluciones)
    }
    if(await conseguirEvolucion1(evolutionChainJson) != null){
        evoluciones.appendChild(await conseguirEvolucion1(evolutionChainJson))
    }
    if(await conseguirEvolucion2(evolutionChainJson) != null){
        evoluciones.appendChild(await conseguirEvolucion2(evolutionChainJson))
    }
    let contenedorFuera = document.getElementById("wrapper")
    let flechaDerechaFuera = document.createElement("img")
    flechaDerechaFuera.src = "/Img/flechaR.jpg"
    flechaDerechaFuera.id="flechaFder"
    let flechaIzquierdaFuera = document.createElement("img")
    flechaIzquierdaFuera.src = "/Img/flechaL.jpg"
    flechaIzquierdaFuera.id= "flechaFiz"
    contenedorFuera.appendChild(flechaIzquierdaFuera)
    evoluciones.id = "evolucionesPokemon"
    let flechaDerecha = document.createElement("img")
    flechaDerecha.src = "/Img/flechaR.jpg"
    flechaDerecha.id= "flechaFotos"
    let flechaIzquierda = document.createElement("img")
    flechaIzquierda.src = "/Img/flechaL.jpg"
    flechaIzquierda.id= "flechaFotos"
    let principal = document.createElement("div")
    principal.id = "principal"
    detalles.appendChild(estadisticas)
    detalles.appendChild(enunciadoHabilidades)
    detalles.appendChild(habilidades)
    detalles.appendChild(flechaIzquierda)
    principal.appendChild(nombre)
    principal.appendChild(imagen)
    principal.appendChild(descripcion)
    detalles.appendChild(principal)
    detalles.appendChild(flechaDerecha)
    detalles.appendChild(evoluciones)
    contenedorFuera.appendChild(flechaDerechaFuera)
}

async function conseguirPokemonBase(cadena){
    let pokemonBaseContenedor = document.createElement("div")
    let pokemonBaseNombre = document.createElement("h2")
    let pokemonBaseImagen = document.createElement("img")
    try{
        let pokemonBase = await fetch(`${cadena.chain.species.url}`)
        if(pokemonBase != null){
            let pokemonBaseJson = await pokemonBase.json()
            let pokemonBaseURL = await fetch(`${pokemonBaseJson.varieties[0].pokemon.url}`)
            let pokemonBaseURLJson = await pokemonBaseURL.json()
            pokemonBaseNombre.textContent = pokemonBaseJson.name
            pokemonBaseImagen.src = pokemonBaseURLJson.sprites.front_default
            pokemonBaseImagen.addEventListener("click", () =>{
                detalles.innerHTML = ""
                localStorage.setItem("nombrePokemon", pokemonBaseJson.name)
                detallesPokemon()
            })
            pokemonBaseImagen.style.width = '40%'
            pokemonBaseNombre.style.textTransform = 'capitalize'
            pokemonBaseNombre.style.textAlign = 'center'
            pokemonBaseImagen.style.display = 'block'
            pokemonBaseImagen.style.margin = '0 auto'
            pokemonBaseContenedor.style.border = '2px solid black'
            pokemonBaseContenedor.style.borderRadius = '10px'
            pokemonBaseContenedor.style.marginRight = '20px'
            pokemonBaseContenedor.appendChild(pokemonBaseNombre)
            pokemonBaseContenedor.appendChild(pokemonBaseImagen)
            pokemonBaseContenedor.appendChild(await conseguirTipos(pokemonBaseURLJson))
            pokemonBaseContenedor.classList.add("evolucion")
            return pokemonBaseContenedor
        }else{
            return null
        }
    }catch (error){
        console.log(error)
    }
}

async function conseguirEvolucion1(cadena){
    let evolution1Contenedor = document.createElement("div")
    let evolucion1Nombre = document.createElement("h2")
    let evolucion1Imagen = document.createElement("img")
    try{
        if(cadena.chain.evolves_to.lenght < 2){
            let evolucion1 = await fetch(`${cadena.chain.evolves_to[0].species.url}`)
            if(evolucion1 != null){
                let evolucion1Json = await evolucion1.json()
                let evolucion1URL = await fetch(`${evolucion1Json.varieties[0].pokemon.url}`)
                let evolucion1URLJson = await evolucion1URL.json()
                evolucion1Nombre.textContent = evolucion1URLJson.name
                evolucion1Imagen.src = evolucion1URLJson.sprites.front_default
                evolucion1Imagen.addEventListener("click", () => {
                    detalles.innerHTML = ""
                    localStorage.setItem("nombrePokemon", evolucion1URLJson.name)
                    detallesPokemon()
                })
                evolucion1Imagen.style.width = '40%'
                evolucion1Nombre.style.textTransform = 'capitalize'
                evolucion1Nombre.style.textAlign = 'center'
                evolucion1Imagen.style.display = 'block'
                evolucion1Imagen.style.margin = '0 auto'
                evolution1Contenedor.style.border = '2px solid black'
                evolution1Contenedor.style.borderRadius = '10px'
                evolution1Contenedor.style.marginRight = '20px'
                evolution1Contenedor.appendChild(evolucion1Nombre)
                evolution1Contenedor.appendChild(evolucion1Imagen)
                evolution1Contenedor.appendChild(await conseguirTipos(evolucion1URLJson))
                evolution1Contenedor.classList.add("evolucion")
                return evolution1Contenedor
            }else{
                return null
            }
        }else{
            for(let evoluciones of cadena.chain.evolves_to){
                let evolucion1 = await fetch(`${evoluciones.species.url}`)
                if(evolucion1 != null){
                    let evolucion1Json = await evolucion1.json()
                    let evolucion1URL = await fetch(`${evolucion1Json.varieties[0].pokemon.url}`)
                    let evolucionURLJson = await evolucion1URL.json()
                    let evolucion1Nombre = document.createElement("h2")
                    let evolucion1Imagen = document.createElement("img")
                    evolucion1Nombre.textContent = evolucionURLJson.name
                    evolucion1Imagen.src = evolucionURLJson.sprites.front_default
                    evolucion1Imagen.addEventListener("click", () => {
                        detalles.innerHTML = ""
                        localStorage.setItem("nombrePokemon", evolucionURLJson.name)
                        detallesPokemon()
                    })
                    evolucion1Imagen.style.width = '40%'
                    evolucion1Nombre.style.textTransform = 'capitalize'
                    evolucion1Nombre.style.textAlign = 'center'
                    evolucion1Imagen.style.display = 'block'
                    evolucion1Imagen.style.margin = '0 auto'
                    evolution1Contenedor.style.border = '2px solid black'
                    evolution1Contenedor.style.borderRadius = '10px'
                    evolution1Contenedor.style.marginRight = '20px'
                    evolution1Contenedor.appendChild(evolucion1Nombre)
                    evolution1Contenedor.appendChild(evolucion1Imagen)
                    evolution1Contenedor.appendChild(await conseguirTipos(evolucionURLJson))
                    evolution1Contenedor.classList.add("evolucion")
                }
            }
            return evolution1Contenedor
        }
    }catch (error){
        console.log(error)
    }
}

async function conseguirEvolucion2(cadena) {
    let evolution2Contenedor = document.createElement("div")
    let evolucion2Nombre = document.createElement("h2")
    let evolucion2Imagen = document.createElement("img")
    try{
        let evolucion2 = await fetch(`${cadena.chain.evolves_to[0].evolves_to[0].species.url}`)
        if(evolucion2 != null){
            let evolucion2Json = await evolucion2.json()
            let evolucion2URL = await fetch(`${evolucion2Json.varieties[0].pokemon.url}`)
            let evolucion2URLJson = await evolucion2URL.json()
            evolucion2Nombre.textContent = evolucion2URLJson.name
            evolucion2Imagen.src = evolucion2URLJson.sprites.front_default
            evolucion2Imagen.addEventListener("click", () => {
                detalles.innerHTML = ""
                localStorage.setItem("nombrePokemon", evolucion2URLJson.name)
                detallesPokemon()
            })
            evolucion2Imagen.style.width = '40%'
            evolucion2Nombre.style.textTransform = 'capitalize'
            evolucion2Nombre.style.textAlign = 'center'
            evolucion2Imagen.style.display = 'block'
            evolucion2Imagen.style.margin = '0 auto'
            evolution2Contenedor.style.border = '2px solid black'
            evolution2Contenedor.style.borderRadius = '10px'
            evolution2Contenedor.style.marginRight = '20px'
            evolution2Contenedor.appendChild(evolucion2Nombre)
            evolution2Contenedor.appendChild(evolucion2Imagen)
            evolution2Contenedor.appendChild(await conseguirTipos(evolucion2URLJson))
            evolution2Contenedor.classList.add("evolucion")
            return evolution2Contenedor
        }else{
            return null
        }
    }catch (error){
        console.log(error)
    }
}

async function conseguirTipos(cadena){
    let tipo = ""
    let tiposContenedor = document.createElement("div")
    for(let tipos of cadena.types){
        console.log(tipos)
        tipo = document.createElement("img")
        let tipoURL = await fetch(`${tipos.type.url}`)
        let tipoJson = await tipoURL.json()
        tipo.src = tipoJson.sprites['generation-viii']['brilliant-diamond-and-shining-pearl'].name_icon
        tiposContenedor.appendChild(tipo)
        tiposContenedor.classList.add("tipos")
    }
    return tiposContenedor
}

detallesPokemon()