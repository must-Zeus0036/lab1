let recipes = [];

// Function to load recipe data from the server
async function loadData() {
    const url = "http://localhost:5000/api/dishes";
    try {
        const response = await fetch(url); // Fetch data from the server
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        recipes = data;
        renderRecipes();
    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById('recipe-container').innerHTML =
            '<p class="error-message">Failed to load recipes. Please try again later.</p>';
    }
}

function showAddForm() {
    const container = document.getElementById('recipe-container');
    container.textContent = ''; // Clear container

    // Create main container
    const addContainer = document.createElement('div');
    addContainer.className = 'add-form-container';

    // Create heading
    const heading = document.createElement('h2');
    heading.textContent = 'Add New Dish';
    addContainer.appendChild(heading);

    // Create form
    const form = document.createElement('form');
    form.id = 'add-recipe-form';

    // Create form groups (reusing the function from edit form)
    const createInputGroup = (id, labelText, type) => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.required = true;

        group.append(label, input);
        return group;
    };

    const createSelectGroup = (id, labelText, options) => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;

        const select = document.createElement('select');
        select.id = id;
        select.required = true;

        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.text;
            select.appendChild(optElement);
        });

        group.append(label, select);
        return group;
    };

    const createTextareaGroup = (id, labelText) => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;

        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.required = true;

        group.append(label, textarea);
        return group;
    };

    // Add form fields
    form.appendChild(createInputGroup('name', 'Dish Name', 'text'));
    form.appendChild(createInputGroup('origin', 'Origin', 'text'));
    form.appendChild(createInputGroup('cookingTime', 'Cooking Time (minutes)', 'number'));

    // Difficulty select
    form.appendChild(createSelectGroup('difficulty', 'Difficulty', [
        { value: 'Easy', text: 'Easy' },
        { value: 'Medium', text: 'Medium' },
        { value: 'Hard', text: 'Hard' }
    ]));

    // Spice level select
    form.appendChild(createSelectGroup('spiceLevel', 'Spice Level', [
        { value: 'None', text: 'None' },
        { value: 'Mild', text: 'Mild' },
        { value: 'Medium', text: 'Medium' },
        { value: 'Hot', text: 'Hot' }
    ]));

    // Ingredients textarea
    const ingredientsGroup = createTextareaGroup('ingredients', 'Ingredients (comma separated)');
    form.appendChild(ingredientsGroup);

    // Form actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'form-actions';

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.className = 'save-button';
    addButton.textContent = 'Add Dish';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.id = 'cancel-add';
    cancelButton.className = 'cancel-button';
    cancelButton.textContent = 'Cancel';

    actionsDiv.append(addButton, cancelButton);
    form.appendChild(actionsDiv);

    // Add form to container
    addContainer.appendChild(form);

    // Add container to DOM
    container.appendChild(addContainer);

    // Event listeners
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewRecipe();
    });

    cancelButton.addEventListener('click', renderRecipes);
}

async function addNewRecipe() {
    const formData = {
        name: document.getElementById('name').value,
        origin: document.getElementById('origin').value,
        cookingTime: document.getElementById('cookingTime').value,
        difficulty: document.getElementById('difficulty').value,
        spiceLevel: document.getElementById('spiceLevel').value,
        ingredients: document.getElementById('ingredients').value
            .split(',')
            .map(ing => ing.trim())
            .filter(ing => ing !== '')
    };

    try {
        const response = await fetch(`http://localhost:5000/api/dishes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
        }

        const newRecipe = await response.json();
        recipes.push(newRecipe); // Add the new recipe to the local array
        showMessage('Dish added successfully!', 'success');
        renderRecipes();
    } catch (error) {
        console.error('Error adding recipe:', error);
        showMessage('Failed to add dish. Please try again.', 'error');
    }
}

// Function to display the list of recipes
function renderRecipes() {
    const container = document.getElementById('recipe-container');
    container.innerHTML = '';

    // Create "Add Dish" button and append it first
    const addDishButton = document.createElement('button');
    addDishButton.textContent = 'Add Dish';
    addDishButton.className = 'add-dish-button';
    addDishButton.addEventListener('click', showAddForm);
    container.appendChild(addDishButton);


    // Display message if there are no recipes
    if (recipes.length === 0) {
        const noRecipesMessage = document.createElement('p');
        noRecipesMessage.className = 'no-recipes';
        noRecipesMessage.textContent = 'No recipes found.';
        container.appendChild(noRecipesMessage);
        return;
    }

    // Create table to display recipes
    const table = document.createElement('table');

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    ['Name', 'Origin', 'Time', 'Difficulty', 'Spice', 'Ingredients', 'Actions'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    recipes.forEach(recipe => {
        const row = document.createElement('tr');

        // Name with clickable link
        const nameCell = document.createElement('td');
        const nameLink = document.createElement('a');
        nameLink.href = '#';
        nameLink.className = 'recipe-name';
        nameLink.textContent = recipe.name;
        nameLink.addEventListener('click', () => showRecipeDetails(recipe));
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        // Other cells
        [recipe.origin, `${recipe.cookingTime} min`, recipe.difficulty, recipe.spiceLevel].forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
            row.appendChild(cell);
        });

        // Ingredients
        const ingredientsCell = document.createElement('td');
        ingredientsCell.innerHTML = recipe.ingredients.join(', ');
        row.appendChild(ingredientsCell);

        // Action buttons
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-button';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => showEditForm(recipe));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteRecipe(recipe._id, row));

        actionsCell.append(editBtn, deleteBtn);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

function showEditForm(recipe) {
    const container = document.getElementById('recipe-container');
    container.textContent = ''; // Clear container

    // Create main container
    const editContainer = document.createElement('div');
    editContainer.className = 'edit-form-container';

    // Create heading
    const heading = document.createElement('h2');
    heading.textContent = `Edit ${recipe.name}`;
    editContainer.appendChild(heading);

    // Create form
    const form = document.createElement('form');
    form.id = 'edit-recipe-form';

    // Create form groups
    const createInputGroup = (id, labelText, type, value) => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = value;
        input.required = true;

        group.append(label, input);
        return group;
    };

    const createSelectGroup = (id, labelText, options, selectedValue) => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;

        const select = document.createElement('select');
        select.id = id;
        select.required = true;

        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.value = option.value;
            optElement.textContent = option.text;
            if (option.value === selectedValue) {
                optElement.selected = true;
            }
            select.appendChild(optElement);
        });

        group.append(label, select);
        return group;
    };

    const createTextareaGroup = (id, labelText, value) => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;

        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.required = true;
        textarea.value = value;

        group.append(label, textarea);
        return group;
    };

    // Add form fields
    form.appendChild(createInputGroup('name', 'Dish Name', 'text', recipe.name));
    form.appendChild(createInputGroup('origin', 'Origin', 'text', recipe.origin));
    form.appendChild(createInputGroup('cookingTime', 'Cooking Time (minutes)', 'number', recipe.cookingTime));

    // Difficulty select
    form.appendChild(createSelectGroup('difficulty', 'Difficulty', [
        { value: 'Easy', text: 'Easy' },
        { value: 'Medium', text: 'Medium' },
        { value: 'Hard', text: 'Hard' }
    ], recipe.difficulty));

    // Spice level select
    form.appendChild(createSelectGroup('spiceLevel', 'Spice Level', [
        { value: 'None', text: 'None' },
        { value: 'Mild', text: 'Mild' },
        { value: 'Medium', text: 'Medium' },
        { value: 'Hot', text: 'Hot' }
    ], recipe.spiceLevel));

    // Ingredients textarea
    const ingredientsGroup = createTextareaGroup('ingredients', 'Ingredients (comma separated)', recipe.ingredients.join(', '));
    form.appendChild(ingredientsGroup);

    // Form actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'form-actions';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.className = 'save-button';
    saveButton.textContent = 'Save Changes';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.id = 'cancel-edit';
    cancelButton.className = 'cancel-button';
    cancelButton.textContent = 'Cancel';

    actionsDiv.append(saveButton, cancelButton);
    form.appendChild(actionsDiv);

    // Add form to container
    editContainer.appendChild(form);

    // Add container to DOM
    container.appendChild(editContainer);

    // Event listeners
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateRecipe(recipe._id);
    });

    cancelButton.addEventListener('click', renderRecipes);
}

async function updateRecipe(id) {
    const formData = {
        name: document.getElementById('name').value,
        origin: document.getElementById('origin').value,
        cookingTime: document.getElementById('cookingTime').value,
        difficulty: document.getElementById('difficulty').value,
        spiceLevel: document.getElementById('spiceLevel').value,
        ingredients: document.getElementById('ingredients').value
            .split(',')
            .map(ing => ing.trim())
            .filter(ing => ing !== '')
    };

    try {
        const response = await fetch(`http://localhost:5000/api/dishes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedRecipe = await response.json();

        // Update the recipe in our array
        const index = recipes.findIndex(r => r._id === id);
        if (index !== -1) {
            recipes[index] = updatedRecipe;
        }

        showMessage('Recipe updated successfully!', 'success');
        renderRecipes();
    } catch (error) {
        console.error('Error updating recipe:', error);
        showMessage('Failed to update recipe. Please try again.', 'error');
    }
}

async function deleteRecipe(id, rowElement) {
    if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/dishes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove the row from the table
        rowElement.remove();

        // Update the recipes array
        recipes = recipes.filter(recipe => recipe._id !== id);

        // Show success message
        showMessage('Recipe deleted successfully!', 'success');

        // If no recipes left, show message
        if (recipes.length === 0) {
            document.getElementById('recipe-container').innerHTML =
                '<p class="no-recipes">No recipes found.</p>';
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        showMessage('Failed to delete recipe. Please try again.', 'error');
    }
}

function showRecipeDetails(recipe) {
    const container = document.getElementById('recipe-container');
    container.textContent = ''; // Clear container

    // Create main container
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'recipe-details';

    // Create recipe name heading
    const heading = document.createElement('h2');
    heading.textContent = recipe.name;
    detailsContainer.appendChild(heading);

    // Create recipe meta container
    const metaContainer = document.createElement('div');
    metaContainer.className = 'recipe-meta';

    // Helper function to create meta info paragraphs
    const createMetaInfo = (label, value) => {
        const p = document.createElement('p');
        const span = document.createElement('span');
        span.className = 'label';
        span.textContent = `${label}:`;
        p.append(span, ` ${value}`);
        return p;
    };

    // Add meta information
    metaContainer.appendChild(createMetaInfo('Origin', recipe.origin));
    metaContainer.appendChild(createMetaInfo('Cooking Time', `${recipe.cookingTime} minutes`));
    metaContainer.appendChild(createMetaInfo('Difficulty', recipe.difficulty));
    metaContainer.appendChild(createMetaInfo('Spice Level', recipe.spiceLevel));

    detailsContainer.appendChild(metaContainer);

    // Create ingredients section
    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.className = 'ingredients';

    const ingredientsHeading = document.createElement('h3');
    ingredientsHeading.textContent = 'Ingredients';
    ingredientsContainer.appendChild(ingredientsHeading);

    const ingredientsList = document.createElement('ul');
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });
    ingredientsContainer.appendChild(ingredientsList);

    detailsContainer.appendChild(ingredientsContainer);

    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'recipe-actions';

    // Create back button
    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.className = 'back-button';
    backButton.textContent = 'Back to All Recipes';
    backButton.addEventListener('click', renderRecipes);

    // Create edit button
    const editButton = document.createElement('button');
    editButton.id = 'edit-button';
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit Recipe';
    editButton.addEventListener('click', () => showEditForm(recipe));

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete-button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete Recipe';
    deleteButton.addEventListener('click', () => {
        deleteRecipe(recipe._id);
        renderRecipes();
    });

    buttonsContainer.append(backButton, editButton, deleteButton);
    detailsContainer.appendChild(buttonsContainer);

    // Add everything to the main container
    container.appendChild(detailsContainer);
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.getElementById('recipe-container');
    container.prepend(messageDiv);

    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});
