// Sample recipe data
const sampleRecipes = [
    {
        id: '1',
        title: 'Mediterranean Grilled Chicken',
        description: 'Tender chicken marinated in Mediterranean herbs and spices, grilled to perfection',
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
        prepTime: 20,
        cookTime: 25,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Mediterranean',
        mealType: 'Dinner',
        dietaryRestrictions: ['Gluten-Free', 'Keto'],
        ingredients: [
            { id: '1', name: 'Chicken breast', amount: 4, unit: 'pieces' },
            { id: '2', name: 'Olive oil', amount: 3, unit: 'tbsp' },
            { id: '3', name: 'Lemon juice', amount: 2, unit: 'tbsp' },
            { id: '4', name: 'Garlic', amount: 3, unit: 'cloves' },
            { id: '5', name: 'Oregano', amount: 1, unit: 'tsp' },
            { id: '6', name: 'Thyme', amount: 1, unit: 'tsp' },
            { id: '7', name: 'Salt', amount: 1, unit: 'tsp' },
            { id: '8', name: 'Black pepper', amount: 0.5, unit: 'tsp' }
        ],
        instructions: [
            'In a bowl, whisk together olive oil, lemon juice, minced garlic, oregano, thyme, salt, and pepper.',
            'Place chicken breasts in a resealable bag and pour marinade over them. Marinate for at least 30 minutes.',
            'Preheat grill to medium-high heat.',
            'Remove chicken from marinade and grill for 6-7 minutes per side until internal temperature reaches 165°F.',
            'Let rest for 5 minutes before serving.'
        ],
        nutritionalInfo: {
            calories: 285,
            protein: 35,
            carbs: 2,
            fat: 14
        },
        rating: 4.8,
        reviews: 127,
        isFavorite: false
    },
    {
        id: '2',
        title: 'Chocolate Lava Cake',
        description: 'Decadent individual chocolate cakes with a molten center that flows like lava',
        image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
        prepTime: 15,
        cookTime: 12,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'French',
        mealType: 'Dessert',
        dietaryRestrictions: ['Vegetarian'],
        ingredients: [
            { id: '1', name: 'Dark chocolate', amount: 100, unit: 'g' },
            { id: '2', name: 'Butter', amount: 100, unit: 'g' },
            { id: '3', name: 'Eggs', amount: 2, unit: 'large' },
            { id: '4', name: 'Egg yolks', amount: 2, unit: 'large' },
            { id: '5', name: 'Sugar', amount: 60, unit: 'g' },
            { id: '6', name: 'All-purpose flour', amount: 2, unit: 'tbsp' },
            { id: '7', name: 'Butter for ramekins', amount: 1, unit: 'tbsp' },
            { id: '8', name: 'Cocoa powder', amount: 1, unit: 'tbsp' }
        ],
        instructions: [
            'Preheat oven to 425°F (220°C). Butter 4 ramekins and dust with cocoa powder.',
            'Melt chocolate and butter in a double boiler until smooth.',
            'In a bowl, whisk together eggs, egg yolks, and sugar until thick and pale.',
            'Stir in the melted chocolate mixture and flour until just combined.',
            'Divide batter among prepared ramekins.',
            'Bake for 12-14 minutes until edges are firm but centers still jiggle slightly.',
            'Let cool for 1 minute, then run a knife around edges and flip onto plates. Serve immediately.'
        ],
        nutritionalInfo: {
            calories: 420,
            protein: 8,
            carbs: 35,
            fat: 28
        },
        rating: 4.9,
        reviews: 89,
        isFavorite: true
    },
    {
        id: '3',
        title: 'Asian Fusion Buddha Bowl',
        description: 'A colorful and nutritious bowl packed with fresh vegetables, quinoa, and tahini dressing',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        prepTime: 25,
        cookTime: 15,
        servings: 2,
        difficulty: 'Easy',
        cuisine: 'Asian Fusion',
        mealType: 'Lunch',
        dietaryRestrictions: ['Vegan', 'Gluten-Free'],
        ingredients: [
            { id: '1', name: 'Quinoa', amount: 1, unit: 'cup' },
            { id: '2', name: 'Sweet potato', amount: 1, unit: 'large' },
            { id: '3', name: 'Broccoli', amount: 1, unit: 'head' },
            { id: '4', name: 'Red cabbage', amount: 2, unit: 'cups' },
            { id: '5', name: 'Carrots', amount: 2, unit: 'medium' },
            { id: '6', name: 'Edamame', amount: 1, unit: 'cup' },
            { id: '7', name: 'Tahini', amount: 3, unit: 'tbsp' },
            { id: '8', name: 'Soy sauce', amount: 2, unit: 'tbsp' },
            { id: '9', name: 'Rice vinegar', amount: 1, unit: 'tbsp' },
            { id: '10', name: 'Sesame oil', amount: 1, unit: 'tsp' }
        ],
        instructions: [
            'Cook quinoa according to package instructions.',
            'Roast cubed sweet potato at 400°F for 20 minutes until tender.',
            'Steam broccoli until bright green and tender-crisp.',
            'Shred red cabbage and julienne carrots.',
            'Cook edamame according to package instructions.',
            'Whisk together tahini, soy sauce, rice vinegar, and sesame oil for dressing.',
            'Assemble bowls with quinoa as base, then arrange vegetables on top.',
            'Drizzle with tahini dressing and serve.'
        ],
        nutritionalInfo: {
            calories: 385,
            protein: 18,
            carbs: 52,
            fat: 15
        },
        rating: 4.6,
        reviews: 203,
        isFavorite: false
    },
    {
        id: '4',
        title: 'Classic Margherita Pizza',
        description: 'Traditional Italian pizza with fresh mozzarella, basil, and tomato sauce on crispy crust',
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
        prepTime: 120,
        cookTime: 15,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Italian',
        mealType: 'Dinner',
        dietaryRestrictions: ['Vegetarian'],
        ingredients: [
            { id: '1', name: 'Pizza dough', amount: 1, unit: 'lb' },
            { id: '2', name: 'Crushed tomatoes', amount: 1, unit: 'cup' },
            { id: '3', name: 'Fresh mozzarella', amount: 8, unit: 'oz' },
            { id: '4', name: 'Fresh basil', amount: 12, unit: 'leaves' },
            { id: '5', name: 'Olive oil', amount: 2, unit: 'tbsp' },
            { id: '6', name: 'Garlic', amount: 2, unit: 'cloves' },
            { id: '7', name: 'Salt', amount: 1, unit: 'tsp' },
            { id: '8', name: 'Black pepper', amount: 0.5, unit: 'tsp' }
        ],
        instructions: [
            'Let pizza dough come to room temperature for 30 minutes.',
            'Preheat oven to 500°F with pizza stone if available.',
            'Mix crushed tomatoes with minced garlic, salt, and pepper for sauce.',
            'Roll out dough on floured surface to desired thickness.',
            'Spread sauce evenly, leaving border for crust.',
            'Tear mozzarella into pieces and distribute over sauce.',
            'Bake for 12-15 minutes until crust is golden and cheese is bubbly.',
            'Top with fresh basil leaves and drizzle with olive oil before serving.'
        ],
        nutritionalInfo: {
            calories: 315,
            protein: 15,
            carbs: 42,
            fat: 12
        },
        rating: 4.7,
        reviews: 156,
        isFavorite: true
    },
    {
        id: '5',
        title: 'Avocado Toast Supreme',
        description: 'Gourmet avocado toast with poached egg, cherry tomatoes, and everything seasoning',
        image: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=800',
        prepTime: 10,
        cookTime: 8,
        servings: 2,
        difficulty: 'Easy',
        cuisine: 'Modern American',
        mealType: 'Breakfast',
        dietaryRestrictions: ['Vegetarian'],
        ingredients: [
            { id: '1', name: 'Sourdough bread', amount: 2, unit: 'slices' },
            { id: '2', name: 'Ripe avocados', amount: 1, unit: 'large' },
            { id: '3', name: 'Eggs', amount: 2, unit: 'large' },
            { id: '4', name: 'Cherry tomatoes', amount: 6, unit: 'pieces' },
            { id: '5', name: 'Lemon juice', amount: 1, unit: 'tbsp' },
            { id: '6', name: 'Everything seasoning', amount: 1, unit: 'tsp' },
            { id: '7', name: 'Red pepper flakes', amount: 0.25, unit: 'tsp' },
            { id: '8', name: 'Salt', amount: 0.5, unit: 'tsp' }
        ],
        instructions: [
            'Toast sourdough bread until golden brown.',
            'Bring water to simmer in saucepan and poach eggs for 3-4 minutes.',
            'Mash avocado with lemon juice and salt.',
            'Halve cherry tomatoes.',
            'Spread mashed avocado on toast.',
            'Top with poached egg and cherry tomatoes.',
            'Sprinkle with everything seasoning and red pepper flakes.',
            'Serve immediately while egg is still runny.'
        ],
        nutritionalInfo: {
            calories: 285,
            protein: 12,
            carbs: 28,
            fat: 16
        },
        rating: 4.4,
        reviews: 92,
        isFavorite: false
    },
    {
        id: '6',
        title: 'Thai Green Curry',
        description: 'Aromatic and spicy Thai curry with coconut milk, vegetables, and fragrant herbs',
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Thai',
        mealType: 'Dinner',
        dietaryRestrictions: ['Gluten-Free', 'Dairy-Free'],
        ingredients: [
            { id: '1', name: 'Green curry paste', amount: 3, unit: 'tbsp' },
            { id: '2', name: 'Coconut milk', amount: 400, unit: 'ml' },
            { id: '3', name: 'Chicken thigh', amount: 500, unit: 'g' },
            { id: '4', name: 'Thai eggplant', amount: 200, unit: 'g' },
            { id: '5', name: 'Bell peppers', amount: 2, unit: 'medium' },
            { id: '6', name: 'Thai basil', amount: 20, unit: 'leaves' },
            { id: '7', name: 'Fish sauce', amount: 2, unit: 'tbsp' },
            { id: '8', name: 'Palm sugar', amount: 1, unit: 'tbsp' },
            { id: '9', name: 'Kaffir lime leaves', amount: 4, unit: 'leaves' }
        ],
        instructions: [
            'Heat 2 tbsp coconut milk in wok over medium heat.',
            'Add green curry paste and fry until fragrant.',
            'Add chicken and cook until no longer pink.',
            'Pour in remaining coconut milk and bring to simmer.',
            'Add eggplant and bell peppers, cook for 8-10 minutes.',
            'Season with fish sauce and palm sugar.',
            'Add lime leaves and simmer for 2 minutes.',
            'Garnish with Thai basil and serve with jasmine rice.'
        ],
        nutritionalInfo: {
            calories: 320,
            protein: 28,
            carbs: 12,
            fat: 20
        },
        rating: 4.8,
        reviews: 174,
        isFavorite: true
    }
];

// Initialize data in localStorage if not exists
if (!localStorage.getItem('recipes')) {
    localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
}

if (!localStorage.getItem('shoppingList')) {
    localStorage.setItem('shoppingList', JSON.stringify([]));
}