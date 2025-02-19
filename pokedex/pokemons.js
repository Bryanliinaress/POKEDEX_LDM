function pokedex(){
    let offset = 0;
    const limit = 25;
    let cargando = false;
    let abort = new AbortController();
    let abortSignal = abort.signal;
    let nuevoOffset
    let search = '';
    let filtro = '';
    let tipoPokemon = '';
    let encontrado = 0;
    let arrayTipos = [];
    let cantiadPokemosn = document.querySelectorAll(".pokemon")?.length
    async function obtenerPokemones(offset) {
        if (cargando) return;
        cargando = true;
        if(nuevoOffset == 0){
            document.getElementById("contenedor_de_pokemons").innerHTML = ""
            offset = 0;
            nuevoOffset = 1;
        }
        abort = new AbortController();
        abortSignal = abort.signal;
            try{
                await delay(200)
                if(offset < 1025){
                    let pokeapi = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
                    let pokemons = await pokeapi.json();
                    for(let pokemon of pokemons.results){
                        if(abortSignal.aborted){
                            break;
                        }else{
                        let alreadyExists = document.querySelector(`#pokemon-${pokemon.name}`);
                        if(alreadyExists) continue;
                        let contenedor = document.createElement("div")
                        contenedor.id = "pokemon-" + pokemon.name 
                        let datosPokemon = await fetch(pokemon.url)
                        let datosPokemonJson = await datosPokemon.json()
                        let sprite = document.createElement("img")
                        sprite.src = datosPokemonJson.sprites.front_default
                        contenedor.appendChild(sprite)
                        let nombre = document.createElement("p")
                        nombre.textContent = datosPokemonJson.name
                        contenedor.appendChild(nombre)
                        contenedor.classList.add("pokemon")
                        contenedor.addEventListener("click",  async function(){
                            localStorage.setItem("nombrePokemon", pokemon.name)
                            window.location.href= `detalle.html`
                        })
                        document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
                        }
                    };
                }
            }catch (error){
                if (error.name === 'AbortError') {
                    console.log('Fetch abortado intencionalmente');
                    } else {
                    console.log(error);
                    }
            }finally{
                cargando = false;
            }
    }

let buscar = document.getElementById("nombre_busqueda");
buscar.addEventListener("input", async function(){
    abort.abort()
    offset = 0;
    abort = new AbortController()
    abortSignal = abort.signal
    searchValue = buscar.value
    if((buscar.value == null || buscar.value == "")&& arrayTipos.length == 0){
        cargando = false;
        nuevoOffset = 0
        search = ""
        await delay(100)
        obtenerPokemones(nuevoOffset)
        return
    }else if ((buscar.value == null || buscar.value == "") && arrayTipos.length != 0){
        cargando = false
        offset = 0
        search = ""
        await delay(100)
        document.getElementById("contenedor_de_pokemons").innerHTML = ""
        poekmonsTipos(offset)
        return
    }else{
        try{
            await delay(300)
            if(offset < 1025){
                let pokeapi = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1025`);
                let pokemons = await pokeapi.json();
                let contenedor_pokemons = document.getElementById("contenedor_de_pokemons")
                if (search !== searchValue) {
                    contenedor_pokemons.innerHTML = "";
                    search = searchValue;
                }
                for(let pokemon of pokemons.results){
                    if(abortSignal.aborted)return;
                    let alreadyExists = document.querySelector(`#pokemon-${pokemon.name}`);
                    if(alreadyExists) continue;
                        if(buscar.value != ""){
                            if(((pokemon.name).toLowerCase()).startsWith((buscar.value).toLowerCase())){
                                    let datosPokemon = await fetch(pokemon.url)
                                    let datosPokemonJson = await datosPokemon.json()
                                    let tieneTipos = arrayTipos.every(tipo => datosPokemonJson.types.some(t => t.type.name == tipo))
                                    if(tieneTipos){
                                        if(datosPokemonJson.name.includes(buscar.value)){
                                        let contenedor = document.createElement("div")
                                        contenedor.id = "pokemon-" + pokemon.name
                                        let sprite = document.createElement("img")
                                        sprite.src = datosPokemonJson.sprites.front_default
                                        contenedor.appendChild(sprite)
                                        let nombre = document.createElement("p")
                                        nombre.textContent = pokemon.name
                                        contenedor.appendChild(nombre)
                                        contenedor.classList.add("pokemon")
                                        contenedor.addEventListener("click",  async function(){
                                            localStorage.setItem("nombrePokemon", pokemon.name)
                                            window.location.href= `detalle.html`
                                        })
                                        contenedor_pokemons.appendChild(contenedor)
                                        }
                                }
                        }
                    }
                }
            }
        }catch (error){
            console.log(error);
        }finally{
            cargando = false;
        }
    }
});

    async function obtenerTipos() { 
            try{
                let pokeapi = await fetch('https://pokeapi.co/api/v2/type?limit=18');
                let types = await pokeapi.json();
                for(let type of types.results){
                    let contenedorTipo = document.createElement("div")
                    contenedorTipo.addEventListener("click",  async () => {
                        if (!contenedorTipo.classList.contains("animacionClick")) {
                            contenedorTipo.classList.add("animacionClick")
                            arrayTipos.push(type.name)
                        } else {
                            contenedorTipo.classList.remove("animacionClick")
                            arrayTipos.splice(arrayTipos.indexOf(type.name), 1)
                        }
                        filtro = type.name
                        document.getElementById("contenedor_de_pokemons").innerHTML = ""
                        cargando = false
                        offset = 0
                        tipoPokemon = type
                        encontrado = 0;
                        poekmonsTipos(offset)
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

    async function poekmonsTipos(offset){
        if (cargando){
            return;}
        cargando = true
        try{
            encontrado = 0;
            if(offset < 1025){
                let pokeapi = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
                let pokemons = await pokeapi.json();
                let detallesPokemons = await Promise.all(pokemons.results.map(pokemon => fetch(pokemon.url).then(res => res.json())));
                for(let datos of detallesPokemons){
                        if(abortSignal.aborted){
                            return
                        }else{
                            let alreadyExists = document.querySelector(`#pokemon-${datos.name}`);
                            if(alreadyExists) continue;
                            if(document.getElementById("nombre_busqueda").value == ""){
                                let tieneTipos = arrayTipos.every(tipo => datos.types.some(t => t.type.name == tipo))
                                if(tieneTipos){
                                    console.log(datos)
                                    let alreadyExists = document.querySelector(`#pokemon-${datos.name}`);
                                    if(alreadyExists) continue;
                                    let contenedor = document.createElement("div")
                                    contenedor.id = "pokemon-" + datos.name
                                    let sprite = document.createElement("img")
                                    sprite.src = datos.sprites.front_default
                                    contenedor.appendChild(sprite)
                                    let parrafo = document.createElement("p")
                                    parrafo.textContent = datos.name
                                    contenedor.appendChild(parrafo)
                                    contenedor.id = `pokemon-${datos.name}`; 
                                    contenedor.classList.add("pokemon")
                                    contenedor.addEventListener("click",  async function(){
                                        localStorage.setItem("nombrePokemon", datos.name)
                                        window.location.href= `detalle.html`
                                    })
                                    document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
                                    encontrado += 1;
                                }
                            }else{
                                if(datos.name.toLowerCase().startsWith((document.getElementById("nombre_busqueda").value).toLowerCase())){
                                    let tieneTipos = arrayTipos.every(tipo => datos.types.some(t => t.type.name == tipo))
                                    if(tieneTipos){
                                        console.log(datos)
                                        let alreadyExists = document.querySelector(`#pokemon-${datos.name}`);
                                        if(alreadyExists) continue;
                                        let contenedor = document.createElement("div")
                                        contenedor.id = "pokemon-" + datos.name
                                        let sprite = document.createElement("img")
                                        sprite.src = datos.sprites.front_default
                                        contenedor.appendChild(sprite)
                                        let parrafo = document.createElement("p")
                                        parrafo.textContent = datos.name
                                        contenedor.appendChild(parrafo)
                                        contenedor.id = `pokemon-${datos.name}`; 
                                        contenedor.classList.add("pokemon")
                                        contenedor.addEventListener("click",  async function(){
                                            localStorage.setItem("nombrePokemon", datos.name)
                                            window.location.href= `detalle.html`
                                        })
                                        document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
                                        encontrado += 1;
                                    }
                                }
                            }
                        }
                }
                cantiadPokemosn = document.querySelectorAll("contenedor_de_pokemons .pokemon").length
                if((encontrado == 0 && pokemons.results.length > 0) || cantiadPokemosn < 25){
                    offset += limit
                    setTimeout(() => poekmonsTipos(offset), 0);
                }
            }
        }catch (error){
            console.log(error);
        }finally{
            cargando = false;
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
            offset += limit;
            if(filtro != ""){
                poekmonsTipos(tipoPokemon, offset)
            }else if(document.getElementById("nombre_busqueda").value != ""){
                return;
            }else{
                obtenerPokemones(offset)
            }
        }
    };


    let debounceTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(handleScroll, 70); 
    });


    function delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
    obtenerPokemones(offset)
    obtenerTipos()
}
pokedex()

