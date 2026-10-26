// Store recipes in a JavaScript array.
let recipes = [];
let editIndex = -1;

const form = document.getElementById("recipeForm");
const titleInput = document.getElementById("title");
const ingredientsInput = document.getElementById("ingredients");
const instructionsInput = document.getElementById("instructions");
const imageInput = document.getElementById("image");
const recipeList = document.getElementById("recipeList");
const searchInput = document.getElementById("search");
const detailsSection = document.getElementById("detailsSection");

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Do not reload the page.

    // Check that the required fields are not empty or only spaces.
    if (!titleInput.value.trim() || !ingredientsInput.value.trim() || !instructionsInput.value.trim()) {
        alert("Please fill in the title, ingredients, and instructions.");
        return;
    }

    const file = imageInput.files[0];

    if (file) {
        if (!file.type.startsWith("image/")) {
            alert("Please choose an image file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            saveRecipe(reader.result);
        };
        reader.onerror = function () {
            alert("The image could not be opened. Please try another image.");
        };
        reader.readAsDataURL(file);
    } else {
        // Keep the old image when editing without selecting a new one.
        const oldImage = editIndex === -1 ? "" : recipes[editIndex].image;
        saveRecipe(oldImage);
    }
});

// CREATE and UPDATE
function saveRecipe(image) {
    const recipe = {
        title: titleInput.value.trim(),
        ingredients: ingredientsInput.value.trim(),
        instructions: instructionsInput.value.trim(),
        image: image
    };

    if (editIndex === -1) {
        recipes.push(recipe); // Create a recipe.
    } else {
        recipes[editIndex] = recipe; // Update an existing recipe.
    }

    resetForm();
    detailsSection.hidden = true;
    displayRecipes();
}

// READ: Show all recipes, including search results.
function displayRecipes() {
    recipeList.innerHTML = "";
    const search = searchInput.value.toLowerCase().trim();
    let found = false;

    recipes.forEach(function (recipe, index) {
        if (!recipe.title.toLowerCase().includes(search) &&
            !recipe.ingredients.toLowerCase().includes(search)) {
            return;
        }

        found = true;
        const card = document.createElement("div");
        card.className = "recipe-card";

        if (recipe.image) {
            const picture = document.createElement("img");
            picture.src = recipe.image;
            picture.alt = recipe.title;
            card.appendChild(picture);
        }

        const name = document.createElement("h3");
        name.textContent = recipe.title;
        card.appendChild(name);

        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.onclick = function () { viewRecipe(index); };
        card.appendChild(viewButton);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = function () { editRecipe(index); };
        card.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.onclick = function () { deleteRecipe(index); };
        card.appendChild(deleteButton);

        recipeList.appendChild(card);
    });

    if (!found) {
        const message = document.createElement("p");
        message.textContent = recipes.length === 0 ? "No recipes yet. Add your first recipe!" : "No matching recipes found.";
        recipeList.appendChild(message);
    }
}

// READ: View the details of one recipe.
function viewRecipe(index) {
    const recipe = recipes[index];
    document.getElementById("detailsTitle").textContent = recipe.title;
    document.getElementById("detailsIngredients").textContent = recipe.ingredients;
    document.getElementById("detailsInstructions").textContent = recipe.instructions;

    const picture = document.getElementById("detailsImage");
    picture.hidden = !recipe.image;
    if (recipe.image) picture.src = recipe.image;

    detailsSection.hidden = false;
    detailsSection.scrollIntoView({ behavior: "smooth" });
}

// UPDATE: Load an existing recipe into the form.
function editRecipe(index) {
    const recipe = recipes[index];
    titleInput.value = recipe.title;
    ingredientsInput.value = recipe.ingredients;
    instructionsInput.value = recipe.instructions;
    imageInput.value = "";
    editIndex = index;

    document.getElementById("formHeading").textContent = "Edit Recipe";
    document.getElementById("saveButton").textContent = "Update Recipe";
    document.getElementById("cancelButton").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// DELETE: Remove a recipe from the array.
function deleteRecipe(index) {
    if (confirm("Are you sure you want to delete this recipe?")) {
        recipes.splice(index, 1);
        resetForm();
        detailsSection.hidden = true;
        displayRecipes();
    }
}

function resetForm() {
    form.reset();
    editIndex = -1;
    document.getElementById("formHeading").textContent = "Add New Recipe";
    document.getElementById("saveButton").textContent = "Add Recipe";
    document.getElementById("cancelButton").hidden = true;
}

// Optional feature: Search recipes by title or ingredients.
searchInput.addEventListener("input", displayRecipes);
document.getElementById("cancelButton").addEventListener("click", resetForm);
document.getElementById("closeDetails").addEventListener("click", function () {
    detailsSection.hidden = true;
});

displayRecipes();
