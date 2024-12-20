# pokemon-server

¡Claro! Vamos a repasar este código línea por línea. Este código está implementando varias rutas para manejar el estado de un Pokémon en una base de datos utilizando Express.js y Mongoose. Se asume que existe un modelo de Mongoose llamado StatusPokemon que se maneja para obtener o actualizar los estados de los Pokémon en función de varias acciones (ver, capturar, agregar al equipo).

1. Importaciones
js
Copiar código
const { json } = require("express")
const StatusPokemon = require ("../models/pokemonModels")
const { json } = require("express"): Aquí se está importando la función json desde express, aunque no se está utilizando directamente en el código, puede ser innecesaria en este contexto.
const StatusPokemon = require ("../models/pokemonModels"): Importa el modelo StatusPokemon desde el archivo pokemonModels ubicado en la carpeta models. Este modelo representa el estado de los Pokémon en la base de datos.
2. Función test
js
Copiar código
exports.test =(req,res)=>{
    console.log("hola controller")
    res.status(200).send("Hola desde controller")
}
exports.test: Esta es una función que responde a una solicitud HTTP. En este caso, parece que es solo una ruta de prueba.
console.log("hola controller"): Imprime en la consola el mensaje "hola controller" para verificar que la ruta se haya llamado correctamente.
res.status(200).send("Hola desde controller"): Responde con un estado HTTP 200 (OK) y envía un mensaje de texto "Hola desde controller" como respuesta.
3. Función createPokemonStatus
js
Copiar código
exports.createPokemonStatus = async (req,res)=>{
    try{
        const status = await StatusPokemon.create({
            pokemon_id: req.body.pokemon_id,
            view: req.body.view,
            catch: req.body.catch,
            in_team : req.body.in_team
        })
        res.status(201).json(status)
    } catch (error){
        console.error(error)
        res.status(500).json({error})
    }
}
exports.createPokemonStatus: Esta función maneja la creación de un nuevo estado de Pokémon en la base de datos.
const status = await StatusPokemon.create({...}): Utiliza Mongoose para crear un nuevo documento de StatusPokemon con los valores que vienen en el cuerpo de la solicitud (req.body). Los campos son:
pokemon_id: ID del Pokémon.
view: Booleano que indica si el Pokémon ha sido visto.
catch: Booleano que indica si el Pokémon ha sido capturado.
in_team: Booleano que indica si el Pokémon está en el equipo.
res.status(201).json(status): Si la creación es exitosa, responde con un estado HTTP 201 (creado) y envía el objeto status recién creado como JSON.
catch (error): Si hay un error, lo captura, lo imprime en la consola y responde con un estado 500 (error interno del servidor) y el objeto de error como JSON.
4. Función getPokemonStatus
js
Copiar código
exports.getPokemonStatus = async (req,res)=>{
    try{
        const status = await StatusPokemon.find({})
        res.status(200).json(status)
    }catch (error) {
        console.error(error)
        return res.status(500).json({error})
    }
}
exports.getPokemonStatus: Esta función maneja la obtención de todos los estados de Pokémon almacenados en la base de datos.
const status = await StatusPokemon.find({}): Utiliza Mongoose para obtener todos los documentos de la colección StatusPokemon. El {} significa que no hay filtros y se obtienen todos los registros.
res.status(200).json(status): Si se obtienen los estados correctamente, responde con un estado 200 (OK) y envía los estados en formato JSON.
catch (error): Si ocurre un error, lo captura, lo imprime y responde con un estado 500 (error interno del servidor) y el objeto de error.
5. Función getPokemonByPokemonId
js
Copiar código
exports.getPokemonByPokemonId = async (req,res)=>{
    try {
        const pokemon_id =req.params.pokemon_id;
        let pokemon = await StatusPokemon.findOne({pokemon_id:pokemon_id});
        if(!pokemon){
            res.status(404).json({message:"Pokemon not found"})
        }else{
            res.status(200).json(pokemon)
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({error})
    }
}
exports.getPokemonByPokemonId: Esta función maneja la obtención de un estado de Pokémon específico usando su ID.
const pokemon_id = req.params.pokemon_id;: Obtiene el pokemon_id de los parámetros de la URL (por ejemplo, si la ruta es /pokemon/:pokemon_id, obtiene el valor de pokemon_id).
let pokemon = await StatusPokemon.findOne({pokemon_id: pokemon_id});: Utiliza Mongoose para buscar un único documento en la colección StatusPokemon donde el campo pokemon_id coincida con el ID proporcionado.
if (!pokemon): Si no se encuentra el Pokémon, responde con un estado 404 (no encontrado) y un mensaje de error.
else: Si el Pokémon se encuentra, responde con el estado 200 (OK) y el objeto pokemon en formato JSON.
6. Función catchPokemonByPokemonId
js
Copiar código
exports.catchPokemonByPokemonId = async (req,res)=>{
        const pokemon_id =req.params.pokemon_id;
        const pokemonStatusId = req.body.pokemon_id
        if(pokemon_id ==pokemonStatusId){
            try{
                const pokemonStatusView = req.body.view;
                const pokemonStatusCatch = req.body.catch
                let pokemon = await StatusPokemon.findOne({"pokemon_id":pokemon_id})
                if (!pokemon){
                    return res.status(400).json({message:"Bad request, pokemon not view yet"})
                }
                else if(pokemon.view != pokemonStatusView){
                    return res.status(400).json({message:"Bad request, inconsistent data"})
                }
                else if(pokemon.catch != pokemonStatusCatch){
                    return res.status(400).json({message:"Bad request, inconsistent data"})
                } 
                else if (pokemon.catch){
                    return res.status(200).json(pokemon)
                }else{
                    pokemon = await StatusPokemon
                    .findOneAndReplace({"pokemon_id":pokemon_id},{
                        pokemon_id : pokemon_id,
                        view : true,
                        catch : true,
                    },{new:true}
                )
                return res.status(200).json(pokemon)
                }
            }catch (error){
                console.error(error)
                return res.status(500).json({error})
            }            
            }else{
                return res.status(400).json({message:"Bad request, pokemon_id in body different pokemon_id in params"})
            } 
}
exports.catchPokemonByPokemonId: Esta función maneja el proceso de "capturar" un Pokémon.
const pokemon_id = req.params.pokemon_id;: Obtiene el pokemon_id de los parámetros de la URL.
const pokemonStatusId = req.body.pokemon_id: Obtiene el pokemon_id desde el cuerpo de la solicitud.
if (pokemon_id == pokemonStatusId): Verifica que el pokemon_id en la URL coincida con el pokemon_id en el cuerpo de la solicitud.
Luego se verifican varias condiciones:
Si el Pokémon no ha sido visto (view), responde con un error.
Si los datos son inconsistentes (por ejemplo, el view o catch no coinciden), responde con un error.
Si el Pokémon ya ha sido capturado (catch), responde con el estado actual.
Si todo es correcto, actualiza el estado del Pokémon a "visto" y "capturado".
Si alguna de las condiciones no se cumple, responde con un error adecuado (400).
7. Función inTeamPokemonByPokemonId
js
Copiar código
exports.inTeamPokemonByPokemonId = async (req,res)=>{    
    try {
        const pokemon_id = req.params.pokemon_id
        const pokemon = await StatusPokemon.findOne({"pokemon_id":pokemon_id})
        const newPokemon = await StatusPokemon.findOneAndReplace
        ({"pokemon_id":pokemon_id},{
            pokemon_id : pokemon_id,
            view : true,
            catch : true, 
            in_team : !pokemon.in_team 
        },{new:true})
        return res.status(200).json(newPokemon)
    } catch (error) {
        console.error(error)
        return res.status(500).json({error})
    }        
}
exports.inTeamPokemonByPokemonId: Esta función maneja el proceso de agregar o quitar un Pokémon del equipo.
const pokemon_id = req.params.pokemon_id: Obtiene el pokemon_id de los parámetros de la URL.
const pokemon = await StatusPokemon.findOne({"pokemon_id":pokemon_id}): Busca el Pokémon en la base de datos.
const newPokemon = await StatusPokemon.findOneAndReplace(...): Actualiza el estado del Pokémon, invirtiendo el valor del campo in_team (si está en el equipo, lo quita; si no, lo agrega).
res.status(200).json(newPokemon): Responde con el estado 200 (OK) y el objeto del Pokémon actualizado.
Si ocurre un error, lo captura e imprime en consola, respondiendo con un error 500.
Conclusión
Este archivo implementa varias rutas en un controlador de Express para manejar el estado de los Pokémon, como verlos, capturarlos, agregar o quitar del equipo, y obtener sus estados. Utiliza Mongoose para interactuar con la base de datos MongoDB. Cada función maneja las solicitudes HTTP de manera asíncrona usando async/await para interactuar con la base de datos.