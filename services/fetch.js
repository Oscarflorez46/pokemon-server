exports.fetchPokemon = async (pokemon_id,pokemonStatus)=>{
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_id}`)
        let pokemon = await response.json()  
        // let pokemonMoves=[]  
        // for(let i=0;i<pokemon.moves.length;i++){
        //     pokemonMoves[i] =  pokemon.moves[i].move.name 
        // } 
        
        pokemon = {
            pokemon_id : pokemonStatus.pokemon_id,
            view : pokemonStatus.view,
            catch: pokemonStatus.catch,
            in_team : pokemonStatus.in_team,
            name : pokemon.name,
            image : pokemon.sprites.front_default,
            types : pokemon.types.map(p=> p.type.name).join(","),
            experience:pokemon.base_experience,
            // pokemonMoves:pokemonMoves
            moves:pokemon.moves.map(m=> m.move.name).join(","),
            stats:pokemon.stats.map(s=> s.stat.name).join(","),
            abilities:pokemon.abilities.map(a=> a.ability.name)
            // pokemonStats:pokemon.Stats
        }
        console.log(pokemon)
        return pokemon
    } catch (error) {
        console.error(error)
        return error
    }
}  