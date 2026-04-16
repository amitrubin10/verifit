// לוגיקת הרכבת תפריט יומי - מבוססת יעדי קלוריות וחלבון
const MealPlanner = {
    getFilteredFoods(dislikedIds) {
        const filtered = {};
        for (const [category, items] of Object.entries(FOODS_DB)) {
            filtered[category] = items.filter(f => !dislikedIds.includes(f.id));
        }
        return filtered;
    },

    pickRandom(arr, count = 1) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    // חישוב קלוריות של פריט בגודל מנה
    itemCalories(food) {
        return Math.round((food.cal * food.serving) / 100);
    },

    itemMacros(food) {
        const ratio = food.serving / 100;
        return {
            protein: Math.round(food.protein * ratio),
            carbs: Math.round(food.carbs * ratio),
            fat: Math.round(food.fat * ratio)
        };
    },

    // התאמת גודל מנה כדי לפגוע ביעד קלורי
    adjustServing(food, targetCal) {
        const calPer100 = food.cal;
        if (calPer100 === 0) return { ...food };
        // כמה גרם צריך כדי להגיע ליעד
        const idealGrams = (targetCal / calPer100) * 100;
        // לא פחות מ-30% מהמנה המקורית ולא יותר מ-180%
        const minGrams = food.serving * 0.3;
        const maxGrams = food.serving * 1.8;
        const adjusted = Math.round(Math.max(minGrams, Math.min(maxGrams, idealGrams)) / 5) * 5; // עיגול ל-5
        return {
            ...food,
            serving: adjusted,
            unit: food.unit.replace(/\d+/, adjusted) // עדכון מספר ביחידה אם יש
        };
    },

    // בחירת מאכל אהוב אם יש
    pickFavorite(foods, favoriteIds) {
        if (!favoriteIds || favoriteIds.length === 0) return null;
        const available = (foods.favorites || []).filter(f => favoriteIds.includes(f.id));
        if (available.length === 0) return null;
        return this.pickRandom(available)[0];
    },

    // בחירת מקור חלבון מיטבי - מעדיף חלבון גבוה ליחס קלוריות
    pickBestProtein(proteins, targetCal) {
        if (proteins.length === 0) return null;
        // מיון לפי יחס חלבון/קלוריות (יותר חלבון לקלוריה = יותר טוב)
        const scored = proteins.map(p => ({
            food: p,
            score: (p.protein / Math.max(p.cal, 1)) + (Math.random() * 0.3) // קצת רנדומיות לגיוון
        }));
        scored.sort((a, b) => b.score - a.score);
        // בוחר מ-3 הראשונים לגיוון
        const top = scored.slice(0, Math.min(3, scored.length));
        return top[Math.floor(Math.random() * top.length)].food;
    },

    // הרכבת ארוחה חכמה - מתאימה ליעד קלורי וחלבון
    buildMeal(foods, targetCal, mealType, favoriteIds) {
        const meal = { type: mealType, items: [], totalCal: 0, protein: 0, carbs: 0, fat: 0 };

        // יעד חלבון לארוחה (40% מהקלוריות, 4 קל' לגרם חלבון)
        const targetProtein = Math.round((targetCal * 0.40) / 4);

        // סיכוי של 40% לשלב מאכל אהוב בצהריים/ערב, 30% בבוקר
        const favoriteChance = mealType === 'breakfast' ? 0.3 : 0.4;
        const useFavorite = Math.random() < favoriteChance;

        if (useFavorite && favoriteIds && favoriteIds.length > 0) {
            const fav = this.pickFavorite(foods, favoriteIds);
            if (fav) {
                meal.items.push(fav);
                const favCal = this.itemCalories(fav);
                const favMacros = this.itemMacros(fav);
                meal.totalCal += favCal;
                meal.protein += favMacros.protein;
                meal.carbs += favMacros.carbs;
                meal.fat += favMacros.fat;

                // אם חסר חלבון - מוסיף מקור חלבון קטן
                if (meal.protein < targetProtein * 0.6) {
                    const remainingCal = targetCal - meal.totalCal;
                    if (remainingCal > 80) {
                        const protein = this.pickBestProtein(foods.proteins, remainingCal * 0.6);
                        if (protein) {
                            const adjusted = this.adjustServing(protein, remainingCal * 0.5);
                            meal.items.push(adjusted);
                            const m = this.itemMacros(adjusted);
                            meal.totalCal += this.itemCalories(adjusted);
                            meal.protein += m.protein;
                            meal.carbs += m.carbs;
                            meal.fat += m.fat;
                        }
                    }
                }

                // תמיד מוסיף ירק
                const veggie = this.pickRandom(foods.veggies)[0];
                if (veggie) {
                    meal.items.push(veggie);
                    const vm = this.itemMacros(veggie);
                    meal.totalCal += this.itemCalories(veggie);
                    meal.protein += vm.protein;
                    meal.carbs += vm.carbs;
                    meal.fat += vm.fat;
                }

                meal.isFavorite = true;
                return meal;
            }
        }

        // === ארוחה רגילה - מותאמת קלורית ===
        let remainingCal = targetCal;
        let remainingProtein = targetProtein;

        if (mealType === 'breakfast') {
            // חלבון (40% מהקלוריות)
            const proteinCal = targetCal * 0.40;
            const breakfastProteins = foods.proteins.filter(f =>
                ['eggs', 'shakshuka', 'cottage', 'white_cheese_5', 'yogurt_greek', 'tofu'].includes(f.id)
            );
            const protein = this.pickBestProtein(
                breakfastProteins.length > 0 ? breakfastProteins : foods.proteins,
                proteinCal
            );
            if (protein) {
                const adjusted = this.adjustServing(protein, proteinCal);
                meal.items.push(adjusted);
                remainingCal -= this.itemCalories(adjusted);
            }

            // פחמימה (40% מהנותר)
            const carbCal = remainingCal * 0.6;
            const breakfastCarbs = foods.carbs.filter(f =>
                ['whole_bread', 'oats', 'pita'].includes(f.id)
            );
            const carb = this.pickRandom(breakfastCarbs.length > 0 ? breakfastCarbs : foods.carbs)[0];
            if (carb) {
                const adjusted = this.adjustServing(carb, carbCal);
                meal.items.push(adjusted);
                remainingCal -= this.itemCalories(adjusted);
            }

            // ירק (השאר)
            const veggie = this.pickRandom(foods.veggies)[0];
            if (veggie) meal.items.push(veggie);

        } else if (mealType === 'lunch') {
            // חלבון (35% מהקלוריות)
            const proteinCal = targetCal * 0.35;
            const lunchProteins = foods.proteins.filter(f =>
                ['chicken_breast', 'turkey_breast', 'schnitzel', 'beef_lean', 'tuna_canned', 'lentils_cooked'].includes(f.id)
            );
            const protein = this.pickBestProtein(
                lunchProteins.length > 0 ? lunchProteins : foods.proteins,
                proteinCal
            );
            if (protein) {
                const adjusted = this.adjustServing(protein, proteinCal);
                meal.items.push(adjusted);
                remainingCal -= this.itemCalories(adjusted);
            }

            // פחמימה (35% מהקלוריות)
            const carbCal = remainingCal * 0.5;
            const carb = this.pickRandom(foods.carbs)[0];
            if (carb) {
                const adjusted = this.adjustServing(carb, carbCal);
                meal.items.push(adjusted);
                remainingCal -= this.itemCalories(adjusted);
            }

            // ירק
            const veggie = this.pickRandom(foods.veggies)[0];
            if (veggie) meal.items.push(veggie);

            // שומן (השאר)
            if (remainingCal > 50) {
                const fat = this.pickRandom(foods.fats.filter(f => f.id !== 'peanut_butter'))[0];
                if (fat) {
                    const adjusted = this.adjustServing(fat, remainingCal * 0.5);
                    meal.items.push(adjusted);
                }
            }

        } else if (mealType === 'dinner') {
            // ערב: חלבון גבוה (45%), פחמימה קלה (30%), ירקות
            const proteinCal = targetCal * 0.45;
            const protein = this.pickBestProtein(foods.proteins, proteinCal);
            if (protein) {
                const adjusted = this.adjustServing(protein, proteinCal);
                meal.items.push(adjusted);
                remainingCal -= this.itemCalories(adjusted);
            }

            // פחמימה קלה
            const carbCal = remainingCal * 0.55;
            if (carbCal > 60) {
                const carb = this.pickRandom(foods.carbs)[0];
                if (carb) {
                    const adjusted = this.adjustServing(carb, carbCal);
                    meal.items.push(adjusted);
                    remainingCal -= this.itemCalories(adjusted);
                }
            }

            // ירקות
            const veggie = this.pickRandom(foods.veggies)[0];
            if (veggie) meal.items.push(veggie);
        }

        // חישוב סיכום סופי
        meal.totalCal = 0;
        meal.protein = 0;
        meal.carbs = 0;
        meal.fat = 0;
        meal.items.forEach(item => {
            meal.totalCal += this.itemCalories(item);
            const macros = this.itemMacros(item);
            meal.protein += macros.protein;
            meal.carbs += macros.carbs;
            meal.fat += macros.fat;
        });

        return meal;
    },

    // הרכבת חטיף - מתאים ליעד קלורי
    buildSnack(foods, targetCal) {
        targetCal = targetCal || 150;
        // מעדיף חטיפים עשירי חלבון
        const allSnacks = [...(foods.snacks || []), ...(foods.fruits || [])];
        if (allSnacks.length === 0) return null;

        // מיון לפי קרבה ליעד קלורי
        const scored = allSnacks.map(s => {
            const cal = this.itemCalories(s);
            const proteinBonus = this.itemMacros(s).protein * 2; // בונוס לחלבון
            return {
                food: s,
                score: -Math.abs(cal - targetCal) + proteinBonus + (Math.random() * 30)
            };
        });
        scored.sort((a, b) => b.score - a.score);
        const snack = scored[0].food;

        return {
            type: 'snack',
            items: [snack],
            totalCal: this.itemCalories(snack),
            ...this.itemMacros(snack)
        };
    },

    // הרכבת תפריט יומי מלא - מאוזן קלורית
    generateDailyMenu(targetCalories, dislikedIds = [], favoriteIds = []) {
        const foods = this.getFilteredFoods(dislikedIds);

        // חלוקת קלוריות: בוקר 25%, צהריים 35%, ערב 25%, חטיפים 15%
        const breakfastCal = Math.round(targetCalories * 0.25);
        const lunchCal = Math.round(targetCalories * 0.35);
        const dinnerCal = Math.round(targetCalories * 0.25);
        const snackCal = Math.round(targetCalories * 0.075); // כל חטיף 7.5%

        const breakfast = this.buildMeal(foods, breakfastCal, 'breakfast', favoriteIds);
        const lunch = this.buildMeal(foods, lunchCal, 'lunch', favoriteIds);
        const dinner = this.buildMeal(foods, dinnerCal, 'dinner', favoriteIds);
        const snack1 = this.buildSnack(foods, snackCal);
        const snack2 = this.buildSnack(foods, snackCal);

        const meals = [breakfast, lunch, dinner];
        if (snack1) meals.splice(1, 0, snack1);
        if (snack2) meals.splice(4, 0, snack2);

        // === בקרת תקציב קלורי - חובה לשמור על גירעון ===
        this.enforceCalorieBudget(meals, targetCalories);

        const totals = meals.reduce((acc, m) => ({
            calories: acc.calories + m.totalCal,
            protein: acc.protein + m.protein,
            carbs: acc.carbs + m.carbs,
            fat: acc.fat + m.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return { meals, totals };
    },

    // וידוא שהסה"כ לא חורג מהיעד - מקטין מנות אם צריך
    enforceCalorieBudget(meals, targetCalories) {
        let totalCal = meals.reduce((sum, m) => sum + m.totalCal, 0);

        // מותר חריגה של עד 5% מעל היעד
        const maxCal = Math.round(targetCalories * 1.05);

        if (totalCal <= maxCal) return; // בסדר

        // צריך לקצץ - מחשב יחס הקיצוץ
        const ratio = maxCal / totalCal;

        // מקצץ מכל ארוחה שאינה חטיף (חטיפים כבר קטנים)
        meals.forEach(meal => {
            if (meal.type === 'snack') return;

            meal.items.forEach(item => {
                // לא מקטינים ירקות - הם כמעט לא קלוריות
                const isVeggie = FOODS_DB.veggies && FOODS_DB.veggies.some(v => v.id === item.id);
                if (isVeggie) return;

                // מקטין מנה לפי היחס, מינימום 50% מהמנה המקורית
                const newServing = Math.round((item.serving * Math.max(ratio, 0.7)) / 5) * 5;
                item.serving = Math.max(newServing, 30); // מינימום 30 גרם
            });

            // חישוב מחדש
            meal.totalCal = 0;
            meal.protein = 0;
            meal.carbs = 0;
            meal.fat = 0;
            meal.items.forEach(item => {
                meal.totalCal += this.itemCalories(item);
                const macros = this.itemMacros(item);
                meal.protein += macros.protein;
                meal.carbs += macros.carbs;
                meal.fat += macros.fat;
            });
        });
    },

    // החלפת ארוחה בודדת
    swapMeal(mealIndex, targetCalories, dislikedIds = [], favoriteIds = []) {
        const foods = this.getFilteredFoods(dislikedIds);
        const calSplit = [0.25, 0.075, 0.35, 0.075, 0.25];
        const types = ['breakfast', 'snack', 'lunch', 'snack', 'dinner'];
        const type = types[mealIndex] || 'lunch';
        const mealCal = Math.round(targetCalories * (calSplit[mealIndex] || 0.3));

        if (type === 'snack') {
            return this.buildSnack(foods, mealCal);
        }
        return this.buildMeal(foods, mealCal, type, favoriteIds);
    },

    getMealTypeName(type) {
        const names = {
            breakfast: '\u05D0\u05E8\u05D5\u05D7\u05EA \u05D1\u05D5\u05E7\u05E8',
            lunch: '\u05D0\u05E8\u05D5\u05D7\u05EA \u05E6\u05D4\u05E8\u05D9\u05D9\u05DD',
            dinner: '\u05D0\u05E8\u05D5\u05D7\u05EA \u05E2\u05E8\u05D1',
            snack: '\u05D7\u05D8\u05D9\u05E3'
        };
        return names[type] || type;
    },

    getMealIcon(type) {
        const icons = {
            breakfast: '\u2600\uFE0F',
            lunch: '\uD83C\uDF5D',
            dinner: '\uD83C\uDF19',
            snack: '\uD83C\uDF4E'
        };
        return icons[type] || '';
    }
};
