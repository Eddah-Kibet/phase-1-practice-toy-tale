let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
})
document.addEventListener("DOMContentLOaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyFormContainer = document.querySelector(".container");
  const newToyBtn = document.getElementById("new-toy-btn");
  const toyForm = document.querySelector(".add-toy-form");

  let showForm = false;
  //toggle form visibilty

  newToyBtn.addEventListener("click", () => {
    showForm = !showForm;
    toyFormContainer.style.display = showForm ? "block" : "none";
  });

  //Fetch and display toys
  fetch ("https://localhost:3000/toys")
  .then(res => res.json())
  .then(toys => {
    toys.forEach(renderToyCard);
  });

  //Add toys form submission
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = {
      name: name,
      likes: 0
    };

    fetch ("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "appliaction/json"
      },
      body: JSON.stringify(newToy)({
        "name": "Jessie",
        "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
        "likes": 0
      })
    })
    .then(res => res.json())
    .then(toy => {
      renderToyCard(toy);
      toyForm.reset();
    });
  });

// Render a single toy card
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Like button handler
    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ likes: newLikes })
      })
        .then(res => res.json())
        .then(updatedToy => {
          toy.likes = updatedToy.likes;
          card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        });
    });

    toyCollection.appendChild(card);
  }
});