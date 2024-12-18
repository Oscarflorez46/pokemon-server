const express = require("express");
const{test, createPokemonStatus, getPokemonStatus} = require("../controllers/pokemonController")
const router = express.Router()

router.get("/test",test)
router.get("/",getPokemonStatus)
router.post("/", createPokemonStatus)
module.exports = router