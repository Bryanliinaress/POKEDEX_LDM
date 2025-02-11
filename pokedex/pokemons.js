async function obtenerPokemones() {
        try{
            const pokeapi = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
            const pokemons = await pokeapi.json();
            console.log(pokemons);
            for(const pokemon of pokemons.results){
                let contenedor = document.createElement("div")
                const datosPokemon = await fetch(pokemon.url)
                const datosPokemonJson = await datosPokemon.json()
                console.log(datosPokemonJson)
                let sprite = document.createElement("img")
                sprite.src = datosPokemonJson.sprites.front_default
                contenedor.innerHTML = `<p>${pokemon.name}</p>`
                contenedor.appendChild(sprite)
                contenedor.classList.add("pokemon")
                document.getElementById("contenedor_de_pokemons").appendChild(contenedor)
            };
        }catch (error){
            console.log(error);
        }
}

obtenerPokemones();