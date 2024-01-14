document.addEventListener('DOMContentLoaded', async () => {
    const cardContainer = document.getElementById('card-container');
    let selectedCards = [];

    const getPokemonData = async (pokemonId) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener datos del Pokémon:', error);
        }
    };

    const createCard = (pokemon) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <p>Attack: ${pokemon.stats[1].base_stat}</p>
            <p>Defense: ${pokemon.stats[2].base_stat}</p>
        `;

        card.addEventListener('click', () => {
            toggleCardSelection(card, pokemon);
        });

        cardContainer.appendChild(card);
    };

    const toggleCardSelection = (card, pokemon) => {
        if (selectedCards.length < 2) {
            card.classList.toggle('selected');
            selectedCards.push({ card, pokemon });

            if (selectedCards.length === 2) {
                setTimeout(() => {
                    resolveBattle();
                }, 1000);
            }
        }
    };

    const resolveBattle = () => {
        const attacker = selectedCards[0].pokemon.stats[1].base_stat;
        const defender = selectedCards[1].pokemon.stats[2].base_stat;

        if (attacker > defender) {
            showBattleResult(selectedCards[0].pokemon.name + ' ha ganado!');
        } else if (attacker < defender) {
            showBattleResult(selectedCards[1].pokemon.name + ' ha ganado!');
        } else {
            showBattleResult('It\'s a draw!');
        }

        resetSelectedCards();
    };

    const showBattleResult = (result) => {
        alert(result);
    };

    const resetSelectedCards = () => {
        selectedCards.forEach(cardData => {
            cardData.card.classList.remove('selected');
        });
        selectedCards = [];
    };

    // Obtener datos de los primeros 10 Pokémon
    // Obtener datos de los primeros N Pokémon
    window.leerNumPokemon = function() {
        var numPokemons = document.getElementById("numPokemon").value;
    
        if (isNaN(numPokemons) || numPokemons <= 0) {
            alert("Ingresa un número válido mayor que 0");
            return;
        }
    
        var url =  "https://pokeapi.co/api/v2/pokemon?limit=" + numPokemons;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("Aquí tienes tus pokemons", data.results);
    
                data.results.forEach(pokemon => {
                    getPokemonData(pokemon.name)
                        .then(pokemonData => createCard(pokemonData))
                        .catch(error => console.error("Error al obtener datos del Pokémon:", error));
                });
            })
            .catch(error => {
                console.error("Error al obtener datos de la PokeAPI:", error);
            });
    };
    window.buscarPokemon = function() {
        var searchTerm = document.getElementById("searchPokemon").value.toLowerCase();
    
        // Iterar sobre las tarjetas y mostrar/ocultar según la búsqueda
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const pokemonName = card.querySelector('h3').textContent.toLowerCase();
            if (pokemonName.includes(searchTerm)) {
                card.style.display = 'block'; // Mostrar la tarjeta
            } else {
                card.style.display = 'none';  // Ocultar la tarjeta
            }
        });
    };
   
    

});
