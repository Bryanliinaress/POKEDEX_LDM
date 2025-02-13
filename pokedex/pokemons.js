let abort = new AbortController();

async function obtenerPokemones(signal) {
    await delay(280)
        try{
            document.getElementById("contenedor_de_pokemons").innerHTML = ""
            let pokeapi = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025', {signal: signal});
            let pokemons = await pokeapi.json();
            for(let pokemon of pokemons.results){
                    if(document.getElementById("nombre_busqueda").value == ""){
                        let contenedor = document.createElement("div")
                        let datosPokemon = await fetch(pokemon.url, {signal: signal});
                        let datosPokemonJson = await datosPokemon.json()
                        let sprite = document.createElement("img")
                        sprite.src = datosPokemonJson.sprites.front_default
                        contenedor.appendChild(sprite)
                        let nombre = document.createElement("p")
                        nombre.textContent = datosPokemonJson.name
                        contenedor.appendChild(nombre)
                        contenedor.classList.add("pokemon")
                        document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
                }else{
                }
            };
        }catch (error){
            if (error.name === 'AbortError') {
                console.log('Fetch abortado intencionalmente');
                } else {
                console.log(error);
                }
        }
}

let buscar = document.getElementById("nombre_busqueda");
buscar.addEventListener("input", async function(){
    abort.abort()
    abort = new AbortController();
    if((buscar.value == null || buscar.value == "")){
        continuar = true
        obtenerPokemones(abort.signal)
    }else{
        try{
            await delay(280)
            let pokeapi = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
            let pokemons = await pokeapi.json();
            document.getElementById("contenedor_de_pokemons").innerHTML = ""
            for(let pokemon of pokemons.results){
                if(!buscar.value == ""){
                    if(((pokemon.name).toLowerCase()).startsWith((buscar.value).toLowerCase())){
                        let datosPokemon = await fetch(pokemon.url)
                        let datosPokemonJson = await datosPokemon.json()
                        if(datosPokemonJson.name.includes(buscar.value)){
                            let contenedor = document.createElement("div")
                            let sprite = document.createElement("img")
                            sprite.src = datosPokemonJson.sprites.front_default
                            contenedor.appendChild(sprite)
                            let nombre = document.createElement("p")
                            nombre.textContent = pokemon.name
                            contenedor.appendChild(nombre)
                            contenedor.classList.add("pokemon")
                            document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
                        }
                    }
                }
            }
        } catch (error){
            console.log(error);
    }
    }
});

async function obtenerTipos() {
    document.getElementById("Tipos_Pokemons").innerHTML = ""
        try{
            let pokeapi = await fetch('https://pokeapi.co/api/v2/type?limit=18');
            let types = await pokeapi.json();
            console.log(types)
            for(let type of types.results){
                let contenedor = document.createElement("div")
                let datosTipo = await fetch(type.url)
                let datosTipoJson = await datosTipo.json()
                let sprite = document.createElement("img")
                sprite.src = datosTipoJson.sprites['generation-viii']['brilliant-diamond-and-shining-pearl'].name_icon
                contenedor.appendChild(sprite)
                let nombre = document.createElement("p")
                nombre.textContent = datosTipoJson.name
                contenedor.appendChild(nombre)
                contenedor.classList.add("tipo")
                document.getElementById("Tipos_Pokemons").appendChild(contenedor)
            };
        }catch (error){
            console.log(error);
        }
}



function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

obtenerPokemones()
obtenerTipos()