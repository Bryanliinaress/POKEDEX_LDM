async function obtenerPokemones() {
        try{
            let pokeapi = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
            let pokemons = await pokeapi.json();
            console.log(pokemons);
            for(let pokemon of pokemons.results){
                let contenedor = document.createElement("div")
                let datosPokemon = await fetch(pokemon.url)
                let datosPokemonJson = await datosPokemon.json()
                console.log(datosPokemonJson)
                let sprite = document.createElement("img")
                sprite.src = datosPokemonJson.sprites.front_default
                contenedor.appendChild(sprite)
                let nombre = document.createElement("p")
                nombre.textContent = datosPokemonJson.name
                contenedor.appendChild(nombre)
                contenedor.classList.add("pokemon")
                document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
            };
        }catch (error){
            console.log(error);
        }
}

let buscar = document.getElementById("nombre_busqueda");
buscar.addEventListener("input", async function(){
    document.getElementById("contenedor_de_pokemons").innerHTML = ""
    try{
        let pokeapi = await fetch('https://pokeapi.co/api/v2/pokemon?limit =10000')
        let pokemons = await pokeapi.json();
        for(let pokemon of pokemons.results){
            let datosPokemon = await fetch(pokemon.url)
            let datosPokemonJson = await datosPokemon.json()
            if(datosPokemonJson.name.includes(buscar.value)){
                let contenedor = document.createElement("div")
                let sprite = document.createElement("img")
                sprite.src = pokemon.sprites.front_default
                contenedor.appendChild(sprite)
                let nombre = document.createElement("p")
                nombre.textContent = pokemon.name
                contenedor.appendChild(nombre)
                contenedor.classList("pokemon")
                document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
            }
        }
    } catch (error){
        console.log(error);
    }
});

obtenerPokemones();