// Global variables
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
let currentView = 'recipes';
let selectedRecipe = null;
let searchTerm = '';
let selectedCuisine = 'All';
let selectedMealType = 'All';
let selectedDifficulty = 'All';
let showFilters = false;
let isAuthenticated = false;
let pendingAction = null;
let recipeToDelete = null;

// Password configuration
const ADMIN_PASSWORD = 'amaan2010'; // Change this to your desired password

// DOM elements
const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const filterToggle = document.getElementById('filter-toggle');
const clearFilters = document.getElementById('clear-filters');
const filters = document.getElementById('filters');
const cuisineFilter = document.getElementById('cuisine-filter');
const mealFilter = document.getElementById('meal-filter');
const difficultyFilter = document.getElementById('difficulty-filter');
const recipesGrid = document.getElementById('recipes-grid');
const recipeDetail = document.getElementById('recipe-detail');
const favoriteCount = document.getElementById('favorite-count');
const cartCount = document.getElementById('cart-count');

// Modal elements
const passwordModal = document.getElementById('password-modal');
const passwordInput = document.getElementById('password-input');
const deleteModal = document.getElementById('delete-modal');
const deleteRecipeTitle = document.getElementById('delete-recipe-title');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCounts();
    showView('recipes');
    renderRecipes(recipes);
});

// Event listeners
function setupEventListeners() {
    // Navigation
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            showView(view);
        });
    });

    // Search and filters
    searchInput.addEventListener('input', handleSearch);
    filterToggle.addEventListener('click', toggleFilters);
    clearFilters.addEventListener('click', clearAllFilters);
    cuisineFilter.addEventListener('change', handleFilterChange);
    mealFilter.addEventListener('change', handleFilterChange);
    difficultyFilter.addEventListener('change', handleFilterChange);

    // Recipe form
    setupRecipeForm();
    
    // Shopping list
    setupShoppingList();

    // Password modal
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyPassword();
        }
    });
}

// Password and authentication functions
function showPasswordModal(action, recipeId = null) {
    if (isAuthenticated) {
        executeAction(action, recipeId);
        return;
    }
    
    pendingAction = { action, recipeId };
    passwordModal.style.display = 'flex';
    passwordInput.value = '';
    passwordInput.focus();
}

function closePasswordModal() {
    passwordModal.style.display = 'none';
    pendingAction = null;
    passwordInput.value = '';
}

function verifyPassword() {
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === ADMIN_PASSWORD) {
        isAuthenticated = true;
        closePasswordModal();
        
        if (pendingAction) {
            executeAction(pendingAction.action, pendingAction.recipeId);
            pendingAction = null;
        }
        
        // Auto-logout after 5 minutes for security
        setTimeout(() => {
            isAuthenticated = false;
        }, 5 * 60 * 1000);
        
    } else {
        alert('Incorrect password. Please try again.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function executeAction(action, recipeId) {
    switch (action) {
        case 'create':
            showView('create');
            break;
        case 'delete':
            showDeleteConfirmation(recipeId);
            break;
    }
}

// Delete confirmation functions
function showDeleteConfirmation(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    recipeToDelete = recipeId;
    deleteRecipeTitle.textContent = recipe.title;
    deleteModal.style.display = 'flex';
}

function closeDeleteModal() {
    deleteModal.style.display = 'none';
    recipeToDelete = null;
}

function confirmDelete() {
    if (recipeToDelete) {
        deleteRecipe(recipeToDelete);
        closeDeleteModal();
    }
}

function deleteRecipe(recipeId) {
    // Remove recipe from recipes array
    recipes = recipes.filter(recipe => recipe.id !== recipeId);
    
    // Remove related shopping list items
    shoppingList = shoppingList.filter(item => item.recipeId !== recipeId);
    
    // Save to localStorage
    saveRecipes();
    saveShoppingList();
    updateCounts();
    
    // Update UI
    if (selectedRecipe && selectedRecipe.id === recipeId) {
        goBackToRecipes();
    } else {
        renderRecipes(getFilteredRecipes());
    }
    
    alert('Recipe deleted successfully!');
}

// Navigation
function showView(viewName) {
    // Check if authentication is required for create view
    if (viewName === 'create' && !isAuthenticated) {
        showPasswordModal('create');
        return;
    }
    
    currentView = viewName;
    
    // Update nav buttons
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Show/hide search container
    if (viewName === 'recipes' || viewName === 'search' || viewName === 'favorites') {
        searchContainer.style.display = 'block';
        if (viewName === 'search') {
            showFilters = true;
            filters.style.display = 'block';
            filterToggle.classList.add('active');
        }
    } else {
        searchContainer.style.display = 'none';
    }

    // Show/hide views
    views.forEach(view => {
        view.style.display = 'none';
    });

    // Show current view content
    switch (viewName) {
        case 'recipes':
            document.getElementById('recipes-view').style.display = 'block';
            renderRecipes(getFilteredRecipes());
            break;
        case 'search':
            document.getElementById('recipes-view').style.display = 'block';
            renderRecipes(getFilteredRecipes());
            break;
        case 'favorites':
            document.getElementById('recipes-view').style.display = 'block';
            const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);
            renderRecipes(favoriteRecipes, "You haven't favorited any recipes yet. Click the heart icon on recipes you love!");
            break;
        case 'create':
            document.getElementById('create-view').style.display = 'block';
            break;
        case 'shopping':
            document.getElementById('shopping-view').style.display = 'block';
            renderShoppingList();
            break;
    }
}

// Search and filters
function handleSearch() {
    searchTerm = searchInput.value;
    updateClearButton();
    if (currentView === 'recipes' || currentView === 'search' || currentView === 'favorites') {
        renderRecipes(getFilteredRecipes());
    }
}

function toggleFilters() {
    showFilters = !showFilters;
    filters.style.display = showFilters ? 'block' : 'none';
    filterToggle.classList.toggle('active', showFilters);
}

function handleFilterChange() {
    selectedCuisine = cuisineFilter.value;
    selectedMealType = mealFilter.value;
    selectedDifficulty = difficultyFilter.value;
    updateClearButton();
    if (currentView === 'recipes' || currentView === 'search' || currentView === 'favorites') {
        renderRecipes(getFilteredRecipes());
    }
}

function clearAllFilters() {
    searchTerm = '';
    selectedCuisine = 'All';
    selectedMealType = 'All';
    selectedDifficulty = 'All';
    
    searchInput.value = '';
    cuisineFilter.value = 'All';
    mealFilter.value = 'All';
    difficultyFilter.value = 'All';
    
    updateClearButton();
    if (currentView === 'recipes' || currentView === 'search' || currentView === 'favorites') {
        renderRecipes(getFilteredRecipes());
    }
}

function updateClearButton() {
    const hasActiveFilters = searchTerm || selectedCuisine !== 'All' || selectedMealType !== 'All' || selectedDifficulty !== 'All';
    clearFilters.style.display = hasActiveFilters ? 'block' : 'none';
}

function getFilteredRecipes() {
    let filtered = recipes;
    
    if (currentView === 'favorites') {
        filtered = recipes.filter(recipe => recipe.isFavorite);
    }
    
    return filtered.filter(recipe => {
        const matchesSearch = !searchTerm || 
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine === selectedCuisine;
        const matchesMealType = selectedMealType === 'All' || recipe.mealType === selectedMealType;
        const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;

        return matchesSearch && matchesCuisine && matchesMealType && matchesDifficulty;
    });
}

// Recipe rendering
function renderRecipes(recipesToRender, emptyMessage = "No recipes found. Try adjusting your search or filters.") {
    if (recipesToRender.length === 0) {
        recipesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-utensils"></i>
                <h3>No Recipes Found</h3>
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }

    recipesGrid.innerHTML = recipesToRender.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetail('${recipe.id}')">
            <div class="recipe-image">
                <img src="${recipe.image}" alt="${recipe.title}" onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'">
                <button class="delete-btn" onclick="event.stopPropagation(); showPasswordModal('delete', '${recipe.id}')" title="Delete Recipe">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="favorite-btn ${recipe.isFavorite ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${recipe.id}')">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="difficulty-badge difficulty-${recipe.difficulty.toLowerCase()}">
                    ${recipe.difficulty}
                </div>
            </div>
            <div class="recipe-content">
                <div class="recipe-header">
                    <span class="cuisine-tag">${recipe.cuisine}</span>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${recipe.rating}</span>
                        <span>(${recipe.reviews})</span>
                    </div>
                </div>
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-meta">
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${recipe.prepTime + recipe.cookTime}m</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>${recipe.servings} servings</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-utensils"></i>
                        <span>${recipe.mealType}</span>
                    </div>
                </div>
                <div class="dietary-tags">
                    ${recipe.dietaryRestrictions.slice(0, 2).map(restriction => 
                        `<span class="dietary-tag">${restriction}</span>`
                    ).join('')}
                    ${recipe.dietaryRestrictions.length > 2 ? 
                        `<span class="dietary-tag">+${recipe.dietaryRestrictions.length - 2}</span>` : ''
                    }
                </div>
                <button class="view-recipe-btn" onclick="event.stopPropagation(); showRecipeDetail('${recipe.id}')">
                    View Recipe
                </button>
            </div>
        </div>
    `).join('');
}

function showRecipeDetail(recipeId) {
    selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
    if (!selectedRecipe) return;

    document.getElementById('recipes-view').style.display = 'none';
    document.getElementById('recipe-detail-view').style.display = 'block';
    searchContainer.style.display = 'none';

    recipeDetail.innerHTML = `
        <div class="detail-header" style="background-image: url('${selectedRecipe.image}')">
            <div class="detail-overlay"></div>
            <div class="detail-actions">
                <button class="back-btn" onclick="goBackToRecipes()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="detail-delete-btn" onclick="showPasswordModal('delete', '${selectedRecipe.id}')" title="Delete Recipe">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="detail-favorite-btn ${selectedRecipe.isFavorite ? 'active' : ''}" onclick="toggleFavorite('${selectedRecipe.id}')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="detail-info">
                <div class="detail-cuisine">
                    ${selectedRecipe.cuisine} • 
                    <span class="difficulty-badge difficulty-${selectedRecipe.difficulty.toLowerCase()}">
                        ${selectedRecipe.difficulty}
                    </span>
                </div>
                <h1 class="detail-title">${selectedRecipe.title}</h1>
                <p class="detail-description">${selectedRecipe.description}</p>
            </div>
        </div>
        <div class="detail-content">
            <div class="detail-stats">
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <div class="stat-label">Prep Time</div>
                    <div class="stat-value">${selectedRecipe.prepTime}m</div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-fire"></i>
                    <div class="stat-label">Cook Time</div>
                    <div class="stat-value">${selectedRecipe.cookTime}m</div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-users"></i>
                    <div class="stat-label">Servings</div>
                    <div class="stat-value">${selectedRecipe.servings}</div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-star"></i>
                    <div class="stat-label">Rating</div>
                    <div class="stat-value">${selectedRecipe.rating}/5</div>
                </div>
            </div>
            <div class="detail-sections">
                <div>
                    <div class="section-title">
                        Ingredients
                        <button class="add-to-cart-btn" onclick="addToShoppingList('${selectedRecipe.id}')">
                            <i class="fas fa-plus"></i>
                            Add to List
                        </button>
                    </div>
                    <ul class="ingredients-list">
                        ${selectedRecipe.ingredients.map(ingredient => `
                            <li class="ingredient-item">
                                <span class="ingredient-name">${ingredient.name}</span>
                                <span class="ingredient-amount">${ingredient.amount} ${ingredient.unit}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div>
                    <div class="section-title">Instructions</div>
                    <ol class="instructions-list">
                        ${selectedRecipe.instructions.map((instruction, index) => `
                            <li class="instruction-item">
                                <div class="instruction-number">${index + 1}</div>
                                <div class="instruction-text">${instruction}</div>
                            </li>
                        `).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
}

function goBackToRecipes() {
    selectedRecipe = null;
    document.getElementById('recipe-detail-view').style.display = 'none';
    showView(currentView);
}

// Recipe actions
function toggleFavorite(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
        saveRecipes();
        updateCounts();
        
        // Update UI
        if (selectedRecipe && selectedRecipe.id === recipeId) {
            selectedRecipe.isFavorite = recipe.isFavorite;
            showRecipeDetail(recipeId);
        }
        
        if (currentView === 'recipes' || currentView === 'search') {
            renderRecipes(getFilteredRecipes());
        } else if (currentView === 'favorites') {
            const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);
            renderRecipes(favoriteRecipes, "You haven't favorited any recipes yet. Click the heart icon on recipes you love!");
        }
    }
}

function addToShoppingList(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    // Remove existing items for this recipe
    shoppingList = shoppingList.filter(item => item.recipeId !== recipeId);

    // Add new items
    const newItems = recipe.ingredients.map(ingredient => ({
        id: `${recipeId}-${ingredient.id}`,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        checked: false,
        recipeId: recipeId,
        recipeTitle: recipe.title
    }));

    shoppingList.push(...newItems);
    saveShoppingList();
    updateCounts();
    
    // Show feedback
    alert(`Added ${recipe.title} ingredients to shopping list!`);
}

// Recipe form
function setupRecipeForm() {
    const cancelBtn = document.getElementById('cancel-create');
    const saveBtn = document.getElementById('save-recipe');
    const addIngredientBtn = document.getElementById('add-ingredient');
    const addInstructionBtn = document.getElementById('add-instruction');

    cancelBtn.addEventListener('click', () => {
        resetRecipeForm();
        showView('recipes');
    });

    saveBtn.addEventListener('click', saveNewRecipe);
    addIngredientBtn.addEventListener('click', addIngredientRow);
    addInstructionBtn.addEventListener('click', addInstructionRow);

    // Handle remove buttons with event delegation
    document.getElementById('ingredients-list').addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove')) {
            removeIngredientRow(e.target.closest('.ingredient-row'));
        }
    });

    document.getElementById('instructions-list').addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove')) {
            removeInstructionRow(e.target.closest('.instruction-row'));
        }
    });
}

function addIngredientRow() {
    const ingredientsList = document.getElementById('ingredients-list');
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.innerHTML = `
        <input type="text" placeholder="Ingredient name" class="ingredient-name">
        <input type="number" placeholder="Amount" class="ingredient-amount">
        <input type="text" placeholder="Unit" class="ingredient-unit">
        <button type="button" class="btn-remove">
            <i class="fas fa-minus"></i>
        </button>
    `;
    ingredientsList.appendChild(newRow);
}

function removeIngredientRow(row) {
    const ingredientsList = document.getElementById('ingredients-list');
    if (ingredientsList.children.length > 1) {
        row.remove();
    }
}

function addInstructionRow() {
    const instructionsList = document.getElementById('instructions-list');
    const stepNumber = instructionsList.children.length + 1;
    const newRow = document.createElement('div');
    newRow.className = 'instruction-row';
    newRow.innerHTML = `
        <span class="step-number">${stepNumber}</span>
        <textarea placeholder="Step ${stepNumber} instructions" class="instruction-text"></textarea>
        <button type="button" class="btn-remove">
            <i class="fas fa-minus"></i>
        </button>
    `;
    instructionsList.appendChild(newRow);
}

function removeInstructionRow(row) {
    const instructionsList = document.getElementById('instructions-list');
    if (instructionsList.children.length > 1) {
        row.remove();
        updateInstructionNumbers();
    }
}

function updateInstructionNumbers() {
    const instructionRows = document.querySelectorAll('.instruction-row');
    instructionRows.forEach((row, index) => {
        const stepNumber = row.querySelector('.step-number');
        const textarea = row.querySelector('.instruction-text');
        stepNumber.textContent = index + 1;
        textarea.placeholder = `Step ${index + 1} instructions`;
    });
}

function saveNewRecipe() {
    const form = document.getElementById('recipe-form');
    
    // Get basic form data
    const title = document.getElementById('recipe-title').value.trim();
    const description = document.getElementById('recipe-description').value.trim();
    const image = document.getElementById('recipe-image').value.trim() || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800';
    const prepTime = parseInt(document.getElementById('prep-time').value) || 0;
    const cookTime = parseInt(document.getElementById('cook-time').value) || 0;
    const servings = parseInt(document.getElementById('servings').value) || 1;
    const difficulty = document.getElementById('difficulty').value;
    const cuisine = document.getElementById('cuisine').value.trim();
    const mealType = document.getElementById('meal-type').value;

    if (!title || !description || !cuisine) {
        alert('Please fill in all required fields.');
        return;
    }

    // Get ingredients
    const ingredientRows = document.querySelectorAll('.ingredient-row');
    const ingredients = [];
    ingredientRows.forEach((row, index) => {
        const name = row.querySelector('.ingredient-name').value.trim();
        const amount = parseFloat(row.querySelector('.ingredient-amount').value) || 0;
        const unit = row.querySelector('.ingredient-unit').value.trim();
        
        if (name) {
            ingredients.push({
                id: (index + 1).toString(),
                name,
                amount,
                unit
            });
        }
    });

    // Get instructions
    const instructionRows = document.querySelectorAll('.instruction-row');
    const instructions = [];
    instructionRows.forEach(row => {
        const text = row.querySelector('.instruction-text').value.trim();
        if (text) {
            instructions.push(text);
        }
    });

    if (ingredients.length === 0 || instructions.length === 0) {
        alert('Please add at least one ingredient and one instruction.');
        return;
    }

    // Create new recipe
    const newRecipe = {
        id: Date.now().toString(),
        title,
        description,
        image,
        prepTime,
        cookTime,
        servings,
        difficulty,
        cuisine,
        mealType,
        dietaryRestrictions: [],
        ingredients,
        instructions,
        nutritionalInfo: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        },
        rating: 0,
        reviews: 0,
        isFavorite: false
    };

    recipes.unshift(newRecipe);
    saveRecipes();
    resetRecipeForm();
    showView('recipes');
    alert('Recipe saved successfully!');
}

function resetRecipeForm() {
    document.getElementById('recipe-form').reset();
    
    // Reset ingredients to one row
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = `
        <div class="ingredient-row">
            <input type="text" placeholder="Ingredient name" class="ingredient-name">
            <input type="number" placeholder="Amount" class="ingredient-amount">
            <input type="text" placeholder="Unit" class="ingredient-unit">
            <button type="button" class="btn-remove">
                <i class="fas fa-minus"></i>
            </button>
        </div>
    `;
    
    // Reset instructions to one row
    const instructionsList = document.getElementById('instructions-list');
    instructionsList.innerHTML = `
        <div class="instruction-row">
            <span class="step-number">1</span>
            <textarea placeholder="Step 1 instructions" class="instruction-text"></textarea>
            <button type="button" class="btn-remove">
                <i class="fas fa-minus"></i>
            </button>
        </div>
    `;
}

// Shopping list
function setupShoppingList() {
    const clearCompletedBtn = document.getElementById('clear-completed');
    clearCompletedBtn.addEventListener('click', clearCompletedItems);
}

function renderShoppingList() {
    const shoppingListContainer = document.getElementById('shopping-list');
    const shoppingStats = document.getElementById('shopping-stats');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    const pendingItems = shoppingList.filter(item => !item.checked);
    const completedItems = shoppingList.filter(item => item.checked);
    
    shoppingStats.textContent = `${pendingItems.length} items to buy • ${completedItems.length} completed`;
    clearCompletedBtn.style.display = completedItems.length > 0 ? 'block' : 'none';

    if (shoppingList.length === 0) {
        shoppingListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your shopping list is empty</h3>
                <p>Add ingredients from recipes to start building your shopping list.</p>
            </div>
        `;
        return;
    }

    // Group items by recipe
    const groupedItems = {};
    shoppingList.forEach(item => {
        if (!groupedItems[item.recipeTitle]) {
            groupedItems[item.recipeTitle] = [];
        }
        groupedItems[item.recipeTitle].push(item);
    });

    shoppingListContainer.innerHTML = Object.entries(groupedItems).map(([recipeTitle, items]) => `
        <div class="recipe-group">
            <h3>${recipeTitle}</h3>
            ${items.map(item => `
                <div class="shopping-item ${item.checked ? 'completed' : ''}">
                    <div class="shopping-checkbox ${item.checked ? 'checked' : ''}" onclick="toggleShoppingItem('${item.id}')">
                        ${item.checked ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <div class="shopping-item-info">
                        <span class="shopping-item-name">${item.name}</span>
                        <span class="shopping-item-amount">${item.amount} ${item.unit}</span>
                    </div>
                    <button class="remove-item-btn" onclick="removeShoppingItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function toggleShoppingItem(itemId) {
    const item = shoppingList.find(item => item.id === itemId);
    if (item) {
        item.checked = !item.checked;
        saveShoppingList();
        updateCounts();
        renderShoppingList();
    }
}

function removeShoppingItem(itemId) {
    shoppingList = shoppingList.filter(item => item.id !== itemId);
    saveShoppingList();
    updateCounts();
    renderShoppingList();
}

function clearCompletedItems() {
    shoppingList = shoppingList.filter(item => !item.checked);
    saveShoppingList();
    updateCounts();
    renderShoppingList();
}

// Utility functions
function updateCounts() {
    const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);
    const pendingShoppingItems = shoppingList.filter(item => !item.checked);
    
    favoriteCount.textContent = favoriteRecipes.length;
    cartCount.textContent = pendingShoppingItems.length;
    
    favoriteCount.style.display = favoriteRecipes.length > 0 ? 'flex' : 'none';
    cartCount.style.display = pendingShoppingItems.length > 0 ? 'flex' : 'none';
}

function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

function saveShoppingList() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}