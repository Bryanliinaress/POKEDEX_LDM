function pokedex(){
    let abort = new AbortController();
    let abortSignal = abort.signal;
    async function obtenerPokemones() {
        abort = new AbortController();
        abortSignal = abort.signal;
            try{
                await delay(200)
                document.getElementById("contenedor_de_pokemons").innerHTML = ""
                let pokeapi = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
                let pokemons = await pokeapi.json();
                for(let pokemon of pokemons.results){
                    if(abortSignal.aborted){
                        break;
                    }else{
                    let contenedor = document.createElement("div")
                    let datosPokemon = await fetch(pokemon.url)
                    let datosPokemonJson = await datosPokemon.json()
                    let sprite = document.createElement("img")
                    sprite.src = datosPokemonJson.sprites.front_default
                    contenedor.appendChild(sprite)
                    let nombre = document.createElement("p")
                    nombre.textContent = datosPokemonJson.name
                    contenedor.appendChild(nombre)
                    contenedor.classList.add("pokemon")
                    document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
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
        if(buscar.value == null || buscar.value == ""){
            obtenerPokemones()
        }else{
            try{
                await delay(300)
                let pokeapi = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
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
                for(let type of types.results){
                    console.log(type)
                    let contenedorTipo = document.createElement("div")
                    contenedorTipo.addEventListener("click",  async () => {
                        contenedorTipo.style.scale(0.9,0.9)
                        abort.abort()
                        await delay(20)
                        abort = new AbortController()
                        abortSignal = abort.signal
                        document.getElementById("contenedor_de_pokemons").innerHTML = ""
                        let pokeapi = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
                        let pokemons = await pokeapi.json();
                        for(let pokemon of pokemons.results){
                            let datosPokemon = await fetch(pokemon.url)
                            let datosPokemonJson = await datosPokemon.json()
                            for(let tipos of datosPokemonJson.types){
                                if(abortSignal.aborted){
                                    break;
                                }else{
                                    if(tipos.type.name.startsWith((type.name))){
                                        console.log(tipos.type.name)
                                        console.log(type.name)
                                        let datoPokemon = await fetch(pokemon.url)
                                        let datoPokemonJson = await datoPokemon.json()
                                        console.log(datoPokemonJson)
                                        let contenedor = document.createElement("div")
                                        let sprite = document.createElement("img")
                                        sprite.src = datoPokemonJson.sprites.front_default
                                        contenedor.appendChild(sprite)
                                        let parrafo = document.createElement("p")
                                        parrafo.textContent = datoPokemonJson.name
                                        contenedor.appendChild(parrafo)
                                        contenedor.classList.add("pokemon")
                                        document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
                                    }
                                }
                            }
                        }
                    });
                    let datosTipo = await fetch(type.url)
                    let datosTipoJson = await datosTipo.json()
                    let sprite = document.createElement("img")
                    sprite.src = datosTipoJson.sprites['generation-viii']['brilliant-diamond-and-shining-pearl'].name_icon
                    contenedorTipo.appendChild(sprite)
                    let nombre = document.createElement("p")
                    nombre.textContent = datosTipoJson.name
                    contenedorTipo.appendChild(nombre)
                    contenedorTipo.classList.add("tipo")
                    document.getElementById("Tipos_Pokemons").appendChild(contenedorTipo)
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
}
pokedex()
