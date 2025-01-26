import React, { useState, useEffect, useRef, Check } from 'react';
import { PlusCircle, X, ShoppingCart, ChevronDown, ChevronUp, Calendar, Edit2, Trash2} from 'lucide-react';

const MEAL_TYPES = ['Breakfast', 'Lunch/Dinner', 'Snacks'];

const DEFAULT_MEALS = {
  'Breakfast': {
  'Oatmeal hot with dates, avocado, egg whites': {
    ingredients: ['rolled oats', 'dates', 'avocado', 'egg whites', 'salt', 'honey'],
    category: 'Breakfast'
  },
  'Avocado toast with sunny side egg': {
    ingredients: ['sourdough bread', 'avocado', 'eggs', 'salt', 'pepper', 'red pepper flakes', 'microgreens'],
    category: 'Breakfast'
  },
  'Oatmeal overnight with chia, fruit': {
    ingredients: ['rolled oats', 'chia seeds', 'milk', 'honey', 'mixed fruits', 'nuts', 'cinnamon'],
    category: 'Breakfast'
  },
  'Shakshuka with fresh bread': {
    ingredients: ['eggs', 'tomatoes', 'bell peppers', 'onion', 'garlic', 'bread', 'cumin', 'paprika', 'fresh herbs'],
    category: 'Breakfast'
  },
  'Crepe with hazelnut spread, fruits': {
    ingredients: ['flour', 'eggs', 'milk', 'butter', 'hazelnut spread', 'fresh fruits', 'powdered sugar'],
    category: 'Breakfast'
  },
  'Chocolate buttermilk Pancakes': {
    ingredients: ['flour', 'cocoa powder', 'buttermilk', 'eggs', 'sugar', 'baking powder', 'vanilla extract', 'mixed berries'],
    category: 'Breakfast'
  },
  'Cottage cheese almond flour pancakes': {
    ingredients: ['cottage cheese', 'almond flour', 'eggs', 'vanilla extract', 'maple syrup', 'baking powder'],
    category: 'Breakfast'
  },
  'Frozen waffles with hazelnut spread': {
    ingredients: ['frozen waffles', 'hazelnut spread', 'banana', 'berries', 'maple syrup'],
    category: 'Breakfast'
  },
  'Cheerios with milk': {
    ingredients: ['cheerios', 'milk', 'banana', 'honey', 'mixed berries'],
    category: 'Breakfast'
  },
  'Idli and chutney / sambhar': {
    ingredients: ['idli batter', 'coconut chutney', 'sambhar', 'ghee'],
    category: 'Breakfast'
  },
  'Idiyappam and egg curry': {
    ingredients: ['idiyappam', 'eggs', 'onion', 'tomatoes', 'curry leaves', 'coconut milk', 'spices'],
    category: 'Breakfast'
  },
  'Omelette with veggies': {
    ingredients: ['eggs', 'bell peppers', 'onion', 'cheese', 'spinach', 'mushrooms', 'herbs'],
    category: 'Breakfast'
  },
  'Bagel with cream cheese': {
    ingredients: ['bagel', 'cream cheese', 'tomato', 'cucumber', 'red onion', 'capers'],
    category: 'Breakfast'
  },
  'Smoothies': {
    ingredients: ['mixed fruits', 'yogurt', 'milk', 'honey', 'protein powder', 'chia seeds', 'spinach'],
    category: 'Breakfast'
  },
  'Whole wheat banana carrot Muffins': {
    ingredients: ['whole wheat flour', 'banana', 'carrots', 'eggs', 'milk', 'honey', 'cinnamon', 'walnuts'],
    category: 'Breakfast'
  },
  'Zucchini chocolate loaf': {
    ingredients: ['flour', 'zucchini', 'cocoa powder', 'eggs', 'sugar', 'vegetable oil', 'chocolate chips'],
    category: 'Breakfast'
  },
  'Menmen': {
    ingredients: ['eggs', 'tomatoes', 'peppers', 'onion', 'Turkish pepper paste', 'bread', 'feta cheese'],
    category: 'Breakfast'
  },
},
'Lunch/Dinner': {
'Quinoa Buddha Bowl': {
ingredients: ['quinoa', 'chickpeas', 'sweet potato', 'kale', 'tahini', 'olive oil', 'lemon'],
category: 'Lunch/Dinner'
},
'Chicken Caesar Wrap': {
ingredients: ['tortilla', 'chicken breast', 'romaine lettuce', 'parmesan', 'caesar dressing'],
category: 'Lunch/Dinner'
},
'Salmon with Roasted Vegetables': {
ingredients: ['salmon fillet', 'broccoli', 'carrots', 'olive oil', 'lemon', 'garlic', 'herbs'],
category: 'Lunch/Dinner'
},
'Vegetarian Curry': {
ingredients: ['chickpeas', 'coconut milk', 'onion', 'tomatoes', 'curry powder', 'rice', 'cilantro'],
category: 'Lunch/Dinner'
}
},
'Snacks': {
'Greek Yogurt Parfait': {
ingredients: ['greek yogurt', 'granola', 'honey', 'mixed berries'],
category: 'Snacks'
},
'Hummus and Vegetables': {
ingredients: ['hummus', 'carrots', 'cucumber', 'bell peppers', 'pita bread'],
category: 'Snacks'}
}
};

const MealPlanner = () => {
  const [mealList, setMealList] = useState(() => {
    const saved = localStorage.getItem('meallist');
    return saved ? JSON.parse(saved) : DEFAULT_MEALS;
  });

  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const saved = localStorage.getItem('weeklyPlan');
    return saved ? JSON.parse(saved) : generateWeeklyPlan(DEFAULT_MEALS);
  });

  const [monthlyPlan, setMonthlyPlan] = useState(() => {
    const saved = localStorage.getItem('monthlyPlan');
    return saved ? JSON.parse(saved) : generateMonthlyPlan(DEFAULT_MEALS);
  });

  const [editingMeal, setEditingMeal] = useState(null);
  const [editedMealName, setEditedMealName] = useState('');
  const [editedIngredients, setEditedIngredients] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [newMeal, setNewMeal] = useState('');
  const [newIngredients, setNewIngredients] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('weekly');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showIngredients, setShowIngredients] = useState({});
  const [draggedMeal, setDraggedMeal] = useState(null);
  const [draggedMealInfo, setDraggedMealInfo] = useState(null);
  const [touchStartPos, setTouchStartPos] = useState(null);
  const draggedElement = useRef(null);
  const ghostElement = useRef(null);

  function generateWeeklyPlan(meals) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plan = {};
    
    days.forEach(day => {
      plan[day] = {};
      MEAL_TYPES.forEach(mealType => {
        plan[day][mealType] = [];
        const mealOptions = Object.keys(meals[mealType] || {});
        const numMeals = mealType === 'Snacks' ? 2 : 1;
        
        for (let i = 0; i < numMeals; i++) {
          if (mealOptions.length > 0) {
            const randomMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
            plan[day][mealType].push(randomMeal);
          }
        }
      });
    });
    
    return plan;
  }

  function generateMonthlyPlan(meals) {
    const weeks = Array.from({ length: 4 }, (_, i) => i + 1);
    const plan = {};
    
    weeks.forEach(week => {
      plan[week] = generateWeeklyPlan(meals);
    });
    
    return plan;
  }

  const handleTouchStart = (e, meal, mealType, day = null, week = null) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setDraggedMeal({ meal, type: mealType });
    setDraggedMealInfo({ week, day });

    const element = e.target.closest('.meal-card');
    if (element) {
      const ghost = element.cloneNode(true);
      ghost.style.position = 'fixed';
      ghost.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
      ghost.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
      ghost.style.opacity = '0.7';
      ghost.style.pointerEvents = 'none';
      ghost.style.zIndex = '1000';
      document.body.appendChild(ghost);
      ghostElement.current = ghost;
      draggedElement.current = element;
      element.style.opacity = '0.5';
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (ghostElement.current && draggedMeal) {
      const touch = e.touches[0];
      ghostElement.current.style.left = `${touch.clientX - ghostElement.current.offsetWidth / 2}px`;
      ghostElement.current.style.top = `${touch.clientY - ghostElement.current.offsetHeight / 2}px`;

      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = dropTarget?.closest('.drop-zone');
      
      document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.style.backgroundColor = 'inherit';
      });
      if (dropZone) {
        dropZone.style.backgroundColor = '#e5e7eb';
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (ghostElement.current) {
      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = dropTarget?.closest('.drop-zone');

      if (dropZone && draggedMeal) {
        const { week, day, type } = dropZone.dataset;
        handleDrop(week, day, type);
      }

      document.body.removeChild(ghostElement.current);
      ghostElement.current = null;
      if (draggedElement.current) {
        draggedElement.current.style.opacity = '1';
        draggedElement.current = null;
      }
      document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.style.backgroundColor = 'inherit';
      });
    }
    setTouchStartPos(null);
    setDraggedMeal(null);
    setDraggedMealInfo(null);
  };

  const handleDeleteMeal = (meal) => {
  if (window.confirm(`Are you sure you want to delete ${meal}?`)) {
    setMealList(prev => {
      const newList = { ...prev };
      delete newList[selectedMealType][meal];
      return newList;
    });

    // Remove meal from plans
    const removeMealFromPlan = (plan) => {
      const newPlan = { ...plan };
      Object.keys(newPlan).forEach(day => {
        Object.keys(newPlan[day]).forEach(type => {
          newPlan[day][type] = newPlan[day][type].filter(m => m !== meal);
        });
      });
      return newPlan;
    };

    setWeeklyPlan(prev => removeMealFromPlan(prev));
    setMonthlyPlan(prev => {
      const newMonthlyPlan = { ...prev };
      Object.keys(newMonthlyPlan).forEach(week => {
        newMonthlyPlan[week] = removeMealFromPlan(newMonthlyPlan[week]);
      });
      return newMonthlyPlan;
    });
  }
};

const handleDrop = (targetWeek, targetDay, targetType) => {
  if (!draggedMeal) return;
  
  const plan = viewMode === 'weekly' ? weeklyPlan : monthlyPlan[targetWeek];
  const existingMeals = plan[targetDay][targetType] || [];
  
  // Prevent duplicates
  if (!existingMeals.includes(draggedMeal.meal)) {
    if (viewMode === 'weekly') {
      setWeeklyPlan(prev => ({
        ...prev,
        [targetDay]: {
          ...prev[targetDay],
          [targetType]: [...existingMeals, draggedMeal.meal]
        }
      }));
    } else {
      setMonthlyPlan(prev => ({
        ...prev,
        [targetWeek]: {
          ...prev[targetWeek],
          [targetDay]: {
            ...prev[targetWeek][targetDay],
            [targetType]: [...existingMeals, draggedMeal.meal]
          }
        }
      }));
    }
  }
};

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (newMeal.trim() && newIngredients.trim()) {
      const ingredients = newIngredients.split(',').map(i => i.trim());
      setMealList(prev => ({
        ...prev,
        [selectedMealType]: {
          ...prev[selectedMealType],
          [newMeal.trim()]: {
            ingredients,
            category: selectedCategory || 'Custom'
          }
        }
      }));
      setNewMeal('');
      setNewIngredients('');
      setSelectedCategory('');
    }
  };

  const getMealCategories = (mealType) => {
    const categories = new Set();
    Object.values(mealList[mealType] || {}).forEach(meal => {
      categories.add(meal.category);
    });
    return Array.from(categories);
  };

  const generateShoppingList = (planData) => {
    const ingredientsByMeal = new Map();
    
    const processPlan = (plan, weekPrefix = '') => {
      Object.entries(plan).forEach(([day, mealTypes]) => {
        Object.entries(mealTypes).forEach(([mealType, meals]) => {
          meals.forEach(meal => {
            if (mealList[mealType]?.[meal]) {
              mealList[mealType][meal].ingredients.forEach(ingredient => {
                if (!ingredientsByMeal.has(ingredient)) {
                  ingredientsByMeal.set(ingredient, new Set());
                }
                const mealInfo = weekPrefix ? 
                  `${meal} (${mealType}, Week ${weekPrefix}, ${day})` :
                  `${meal} (${mealType}, ${day})`;
                ingredientsByMeal.get(ingredient).add(mealInfo);
              });
            }
          });
        });
      });
    };
    
    if (viewMode === 'weekly') {
      processPlan(planData);
    } else {
      processPlan(planData[selectedWeek], selectedWeek);
    }
    
    return Array.from(ingredientsByMeal.entries())
      .map(([ingredient, meals]) => ({
        ingredient,
        meals: Array.from(meals)
      }))
      .sort((a, b) => a.ingredient.localeCompare(b.ingredient));
  };

  // Render meal options in the sidebar
  const renderMealOption = (meal, details) => (
    <div
      key={meal}
      draggable
      className="bg-white rounded border cursor-move hover:bg-gray-50"
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', meal);
        setDraggedMeal({ meal, type: selectedMealType });
      }}
      onDragEnd={() => {
        setDraggedMeal(null);
        document.querySelectorAll('.drop-zone').forEach(zone => {
          zone.style.backgroundColor = 'inherit';
        });
      }}
    >
      <div className="flex justify-between items-center p-2">
        <span className="flex-1">{meal}</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setEditingMeal(meal)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDeleteMeal(meal)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={() => setShowIngredients(prev => ({...prev, [meal]: !prev[meal]}))}
            className="text-gray-500 hover:text-gray-700"
          >
            {showIngredients[meal] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      {showIngredients[meal] && (
        <div className="p-2 border-t bg-gray-50">
          <div className="text-sm text-gray-600 mb-2">
            Category: {details.category}
          </div>
          <div className="text-sm text-gray-600">
            Ingredients: {details.ingredients.join(', ')}
          </div>
        </div>
      )}
    </div>
  );

  const renderMealCard = (meal, mealType, index, day = null, week = null) => (
    <div 
      key={`${meal}-${index}`}
      className="meal-card group bg-white rounded border text-sm cursor-move hover:bg-gray-50 relative mb-2"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', meal);
        setDraggedMeal({ meal, type: mealType });
        setDraggedMealInfo({ week, day, index });
      }}
      onDragEnd={() => {
        setDraggedMeal(null);
        setDraggedMealInfo(null);
        document.querySelectorAll('.drop-zone').forEach(zone => {
          zone.style.backgroundColor = 'inherit';
        });
      }}
    >
      <div className="p-2">
        <div className="font-medium break-words">{meal}</div>
        <div className="text-xs text-gray-500">
          {mealList[mealType]?.[meal]?.category || 'Uncategorized'}
        </div>
      </div>
      <button
        onClick={() => {
          const newPlan = viewMode === 'weekly' ? 
            {
              ...weeklyPlan,
              [day]: {
                ...weeklyPlan[day],
                [mealType]: weeklyPlan[day][mealType].filter((_, i) => i !== index)
              }
            } :
            {
              ...monthlyPlan,
              [week]: {
                ...monthlyPlan[week],
                [day]: {
                  ...monthlyPlan[week][day],
                  [mealType]: monthlyPlan[week][day][mealType].filter((_, i) => i !== index)
                }
              }
            };
          
          viewMode === 'weekly' ? setWeeklyPlan(newPlan) : setMonthlyPlan(newPlan);
        }}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
      >
        <X size={14} />
      </button>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold">Meal Planner</h1>
        <div className="flex flex-wrap gap-4">
          <select 
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="weekly">Weekly View</option>
            <option value="monthly">Monthly View</option>
          </select>

          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="p-2 border rounded"
          >
            {MEAL_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button
            onClick={() => setShowShoppingList(!showShoppingList)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            {showShoppingList ? 'Hide' : 'Show'} Shopping List
          </button>
        </div>
      </div>

      {showShoppingList && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-4">Shopping List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generateShoppingList(
              viewMode === 'weekly' ? weeklyPlan : monthlyPlan[selectedWeek]
            ).map(({ ingredient, meals }, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id={`ingredient-${index}`} 
                    className="h-4 w-4" 
                  />
                  <label htmlFor={`ingredient-${index}`} className="font-medium">
                    {ingredient}
                  </label>
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Used in: {meals.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">{selectedMealType} Options</h2>

            <form onSubmit={handleAddMeal} className="mb-4 space-y-2">
              <input
                type="text"
                value={newMeal}
                onChange={(e) => setNewMeal(e.target.value)}
                placeholder="Add new meal..."
                className="w-full p-2 border rounded"
              />
              <textarea
                value={newIngredients}
                onChange={(e) => setNewIngredients(e.target.value)}
                placeholder="Add ingredients (comma-separated)..."
                className="w-full p-2 border rounded"
                rows="2"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                {getMealCategories(selectedMealType).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="Custom">Custom</option>
              </select>
              <button 
                type="submit"
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <PlusCircle size={20} />
                Add Meal
              </button>
            </form>

            <div className="space-y-2">
              {Object.entries(mealList[selectedMealType] || {}).map(([meal, details]) => 
                renderMealOption(meal, details)
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-2/3">
          {viewMode === 'monthly' && (
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="mb-4 p-2 border rounded"
            >
              {Array.from({ length: 4 }, (_, i) => i + 1).map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          )}

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-7 gap-4">
              {Object.entries(
                viewMode === 'weekly' ? weeklyPlan : monthlyPlan[selectedWeek] || {}
              ).map(([day, mealTypes]) => (
                <div 
                  key={day} 
                  className="bg-gray-50 p-3 rounded-lg min-h-[300px]"
                >
                  <h3 className="font-semibold text-sm mb-2">{day}</h3>
                  {MEAL_TYPES.map(type => (
                    <div 
                      key={type}
                      className="drop-zone mb-4"
                      data-week={selectedWeek}
                      data-day={day}
                      data-type={type}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'inherit';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.backgroundColor = 'inherit';
                        handleDrop(selectedWeek, day, type);
                      }}
                    >
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        {type}
                      </div>
                      {(mealTypes[type] || []).map((meal, index) => 
                        renderMealCard(
                          meal, 
                          type, 
                          index, 
                          day, 
                          viewMode === 'monthly' ? selectedWeek : null
                        )
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => {
            if (viewMode === 'weekly') {
              setWeeklyPlan(generateWeeklyPlan(mealList));
            } else {
              setMonthlyPlan(prev => ({
                ...prev,
                [selectedWeek]: generateWeeklyPlan(mealList)
              }));
            }
          }}
          className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 mx-auto"
        >
          <Calendar size={20} />
          Generate New {viewMode === 'weekly' ? 'Week' : 'Week ' + selectedWeek}
        </button>
      </div>
    </div>
  );
}

export default MealPlanner;