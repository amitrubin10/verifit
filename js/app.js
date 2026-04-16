// אפליקציה ראשית
const App = {
    prefs: null,
    dailyMenu: null,
    dailyWorkout: null,
    completedExercises: new Set(),
    foodLog: [],
    timerInterval: null,
    timerSeconds: 0,

    init() {
        if (Preferences.isSetupDone()) {
            this.prefs = Preferences.load();
            this.showMainScreen();
        } else {
            this.showSetupScreen();
        }
    },

    // === מסך הגדרות ===
    showSetupScreen() {
        document.getElementById('setup-screen').classList.remove('hidden');
        document.getElementById('main-screen').classList.add('hidden');
        this.renderFoodFavorites();
        this.renderFoodDislikes();
        this.renderEquipment();
        document.getElementById('setup-form').addEventListener('submit', (e) => this.handleSetup(e));
    },

    renderFoodFavorites() {
        const container = document.getElementById('food-favorites');
        container.innerHTML = FOOD_FAVORITE_OPTIONS.map(opt =>
            `<span class="chip" data-value="${opt.label}">${opt.label}</span>`
        ).join('');
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                e.target.classList.toggle('selected');
            }
        });
    },

    renderFoodDislikes() {
        const container = document.getElementById('food-dislikes');
        container.innerHTML = FOOD_DISLIKE_OPTIONS.map(name =>
            `<span class="chip" data-value="${name}">${name}</span>`
        ).join('');
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                e.target.classList.toggle('selected');
            }
        });
    },

    renderEquipment() {
        const container = document.getElementById('equipment-list');
        container.innerHTML = EQUIPMENT_OPTIONS.map(eq =>
            `<span class="chip" data-value="${eq.id}">${eq.name}</span>`
        ).join('');
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                e.target.classList.toggle('selected');
            }
        });
    },

    handleSetup(e) {
        e.preventDefault();

        const favorites = [...document.querySelectorAll('#food-favorites .chip.selected')]
            .map(el => el.dataset.value);
        const dislikes = [...document.querySelectorAll('#food-dislikes .chip.selected')]
            .map(el => el.dataset.value);
        const equipment = [...document.querySelectorAll('#equipment-list .chip.selected')]
            .map(el => el.dataset.value);

        // איסוף מזהי מאכלים לא רצויים
        const dislikedFoodIds = [];
        dislikes.forEach(d => {
            if (DISLIKE_TO_IDS[d]) {
                dislikedFoodIds.push(...DISLIKE_TO_IDS[d]);
            }
        });

        // איסוף מזהי מאכלים אהובים
        const favoriteFoodIds = [];
        favorites.forEach(label => {
            const opt = FOOD_FAVORITE_OPTIONS.find(f => f.label === label);
            if (opt) favoriteFoodIds.push(...opt.ids);
        });

        this.prefs = {
            gender: document.getElementById('gender').value,
            age: parseInt(document.getElementById('age').value),
            height: parseInt(document.getElementById('height').value),
            weight: parseFloat(document.getElementById('weight').value),
            targetWeight: parseFloat(document.getElementById('target-weight').value),
            activityLevel: document.getElementById('activity-level').value,
            favorites,
            favoriteFoodIds,
            dislikes,
            dislikedFoodIds: [...new Set(dislikedFoodIds)],
            equipment
        };

        Preferences.save(this.prefs);
        Preferences.saveWeight(this.prefs.weight);
        this.showMainScreen();
    },

    // === מסך ראשי ===
    showMainScreen() {
        document.getElementById('setup-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');

        this.setupTabs();
        this.setupInfoBtn();
        this.setupSettingsBtn();
        this.renderDailyHeader();
        this.loadOrGenerateDaily();
        this.renderProgress();
    },

    setupTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
            });
        });
    },

    setupInfoBtn() {
        document.getElementById('info-btn').addEventListener('click', () => {
            document.getElementById('info-screen').classList.remove('hidden');
        });
        document.getElementById('info-close').addEventListener('click', () => {
            document.getElementById('info-screen').classList.add('hidden');
        });
    },

    setupSettingsBtn() {
        document.getElementById('settings-btn').addEventListener('click', () => {
            if (confirm('לחזור למסך הגדרות? (הנתונים ישמרו)')) {
                this.showSetupScreen();
                // מילוי הטופס עם ערכים קיימים
                if (this.prefs) {
                    document.getElementById('gender').value = this.prefs.gender;
                    document.getElementById('age').value = this.prefs.age;
                    document.getElementById('height').value = this.prefs.height;
                    document.getElementById('weight').value = this.prefs.weight;
                    document.getElementById('target-weight').value = this.prefs.targetWeight;
                    document.getElementById('activity-level').value = this.prefs.activityLevel;
                }
            }
        });
    },

    renderDailyHeader() {
        const today = new Date();
        const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
            'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

        document.getElementById('today-date').textContent =
            `יום ${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

        const targetCal = Preferences.calculateDailyCalories(this.prefs);
        document.getElementById('cal-target').textContent = targetCal.toLocaleString();
    },

    loadOrGenerateDaily() {
        const saved = Preferences.getTodayData();
        const targetCal = Preferences.calculateDailyCalories(this.prefs);

        if (saved && saved.menu) {
            this.dailyMenu = saved.menu;
            this.dailyWorkout = saved.workout;
            this.completedExercises = new Set(saved.completedExercises || []);
            this.foodLog = saved.foodLog || [];
        } else {
            this.generateNewDay();
        }

        this.renderMeals();
        this.renderWorkout();
        this.initFoodLog();
    },

    generateNewDay() {
        const targetCal = Preferences.calculateDailyCalories(this.prefs);
        this.dailyMenu = MealPlanner.generateDailyMenu(targetCal, this.prefs.dislikedFoodIds, this.prefs.favoriteFoodIds || []);
        this.dailyWorkout = WorkoutPlanner.generateDailyWorkout(
            new Date().getDay(),
            this.prefs.equipment
        );
        this.completedExercises = new Set();
        this.saveDaily();
    },

    saveDaily() {
        Preferences.saveDailyData({
            menu: this.dailyMenu,
            workout: this.dailyWorkout,
            completedExercises: [...this.completedExercises],
            foodLog: this.foodLog
        });
    },

    // === תפריט ===
    renderMeals() {
        const container = document.getElementById('meals-container');
        const macros = this.dailyMenu.totals;

        let html = `
            <div class="macros-summary">
                <div class="macro-pill macro-protein">
                    <div class="macro-value">${macros.protein}g</div>
                    <div class="macro-label">חלבון</div>
                </div>
                <div class="macro-pill macro-carbs">
                    <div class="macro-value">${macros.carbs}g</div>
                    <div class="macro-label">פחמימה</div>
                </div>
                <div class="macro-pill macro-fat">
                    <div class="macro-value">${macros.fat}g</div>
                    <div class="macro-label">שומן</div>
                </div>
            </div>
        `;

        this.dailyMenu.meals.forEach((meal, index) => {
            html += `
                <div class="meal-card ${meal.isFavorite ? 'meal-favorite' : ''}">
                    <div class="meal-header">
                        <span class="meal-type">${MealPlanner.getMealIcon(meal.type)} ${MealPlanner.getMealTypeName(meal.type)}${meal.isFavorite ? ' \u2B50' : ''}</span>
                        <span class="meal-calories">${meal.totalCal} קל'</span>
                    </div>
                    <ul class="meal-items">
                        ${meal.items.map(item => `
                            <li>
                                <span class="meal-item-name">${item.name}</span>
                                <span class="meal-item-amount">${item.serving} ${item.unit}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <button class="btn-swap" data-meal-index="${index}">&#x21BB; החלף ארוחה</button>
                </div>
            `;
        });

        container.innerHTML = html;

        // כפתורי החלפה
        container.querySelectorAll('.btn-swap').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.mealIndex);
                this.swapMeal(index);
            });
        });
    },

    swapMeal(index) {
        const targetCal = Preferences.calculateDailyCalories(this.prefs);
        const newMeal = MealPlanner.swapMeal(index, targetCal, this.prefs.dislikedFoodIds, this.prefs.favoriteFoodIds || []);
        if (newMeal) {
            this.dailyMenu.meals[index] = newMeal;
            // עדכון סיכומים
            this.dailyMenu.totals = this.dailyMenu.meals.reduce((acc, m) => ({
                calories: acc.calories + m.totalCal,
                protein: acc.protein + m.protein,
                carbs: acc.carbs + m.carbs,
                fat: acc.fat + m.fat
            }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
            this.saveDaily();
            this.renderMeals();
        }
    },

    // === אימון ===
    renderWorkout() {
        const workout = this.dailyWorkout;
        document.getElementById('workout-title').textContent = workout.name;

        if (workout.isRestDay) {
            document.getElementById('exercises-container').innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                    <div style="font-size:3rem; margin-bottom:16px;">&#x1F9D8;</div>
                    <h3>יום מנוחה</h3>
                    <p>הגוף צריך להתאושש. תנוח, תשתה מים, ותאכל טוב.</p>
                </div>
            `;
            document.getElementById('exercises-total').textContent = '0';
            document.getElementById('exercises-done').textContent = '0';
            document.getElementById('rest-timer').classList.add('hidden');
            return;
        }

        document.getElementById('exercises-total').textContent = workout.exercises.length;
        document.getElementById('exercises-done').textContent = this.completedExercises.size;
        document.getElementById('rest-timer').classList.remove('hidden');

        const container = document.getElementById('exercises-container');
        container.innerHTML = workout.exercises.map((ex, i) => {
            const isDone = this.completedExercises.has(ex.id);
            const lastLog = Preferences.getLastExerciseEntry(ex.id);
            const prevText = lastLog
                ? `\u05E4\u05E2\u05DD \u05E7\u05D5\u05D3\u05DE\u05EA: ${lastLog.reps} \u05D7\u05D6\u05E8\u05D5\u05EA${lastLog.weight ? ` \u00D7 ${lastLog.weight} \u05E7"\u05D2` : ''}`
                : '';
            return `
                <div class="exercise-card ${isDone ? 'done' : ''}" data-exercise-id="${ex.id}">
                    <div class="exercise-top">
                        <div>
                            <div class="exercise-name">${ex.name}</div>
                            <div class="exercise-muscles">${ex.muscle}</div>
                        </div>
                        <div class="exercise-checkbox ${isDone ? 'checked' : ''}" data-id="${ex.id}"></div>
                    </div>
                    <div class="exercise-details">
                        <span><span class="exercise-detail-value">${ex.sets}</span> \u05E1\u05D8\u05D9\u05DD</span>
                        <span><span class="exercise-detail-value">${ex.reps}</span> \u05D7\u05D6\u05E8\u05D5\u05EA</span>
                        <span><span class="exercise-detail-value">${ex.rest}</span> \u05E9\u05E0' \u05DE\u05E0\u05D5\u05D7\u05D4</span>
                    </div>
                    <div class="exercise-log">
                        <div class="exercise-log-row">
                            <label>\u05D7\u05D6\u05E8\u05D5\u05EA:</label>
                            <input type="number" class="log-reps" data-id="${ex.id}" placeholder="${ex.reps}" min="1">
                            <label>\u05DE\u05E9\u05E7\u05DC:</label>
                            <input type="number" class="log-weight" data-id="${ex.id}" placeholder="-" min="0" step="0.5">
                            <button class="btn-save-log" data-id="${ex.id}">\u05E9\u05DE\u05D5\u05E8</button>
                        </div>
                        ${prevText ? `<div class="exercise-prev">${prevText}</div>` : '<div class="exercise-prev">\u05E8\u05D0\u05E9\u05D5\u05DF - \u05EA\u05E8\u05E9\u05D5\u05DD \u05D1\u05D9\u05E6\u05D5\u05E2\u05D9\u05DD!</div>'}
                    </div>
                    <button class="btn-show-desc">&#x2139; \u05D0\u05D9\u05DA \u05DE\u05D1\u05E6\u05E2\u05D9\u05DD?</button>
                    <div class="exercise-desc">${ex.desc}</div>
                </div>
            `;
        }).join('');

        // אירועים
        container.querySelectorAll('.exercise-checkbox').forEach(cb => {
            cb.addEventListener('click', () => this.toggleExercise(cb.dataset.id));
        });

        container.querySelectorAll('.btn-show-desc').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.exercise-card').classList.toggle('expanded');
                btn.textContent = btn.closest('.exercise-card').classList.contains('expanded')
                    ? '\u25B2 \u05D4\u05E1\u05EA\u05E8' : '\u2139 \u05D0\u05D9\u05DA \u05DE\u05D1\u05E6\u05E2\u05D9\u05DD?';
            });
        });

        // שמירת לוג תרגיל
        container.querySelectorAll('.btn-save-log').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const card = btn.closest('.exercise-card');
                const reps = card.querySelector('.log-reps').value;
                const weight = card.querySelector('.log-weight').value;
                if (reps) {
                    const ex = workout.exercises.find(e => e.id === id);
                    Preferences.saveExerciseLog(id, ex ? ex.sets : 3, parseInt(reps), weight ? parseFloat(weight) : 0);
                    const prev = card.querySelector('.exercise-prev');
                    prev.innerHTML = `\u2705 \u05E0\u05E9\u05DE\u05E8! ${reps} \u05D7\u05D6\u05E8\u05D5\u05EA${weight ? ` \u00D7 ${weight} \u05E7"\u05D2` : ''}`;
                    prev.classList.add('improved');
                }
            });
        });

        // טיימר
        this.setupTimer();
    },

    toggleExercise(id) {
        if (this.completedExercises.has(id)) {
            this.completedExercises.delete(id);
        } else {
            this.completedExercises.add(id);
        }

        // עדכון UI
        const card = document.querySelector(`[data-exercise-id="${id}"]`);
        const cb = card.querySelector('.exercise-checkbox');
        card.classList.toggle('done');
        cb.classList.toggle('checked');
        document.getElementById('exercises-done').textContent = this.completedExercises.size;

        // בדיקת סיום אימון
        if (this.completedExercises.size === this.dailyWorkout.exercises.length) {
            const today = new Date().toISOString().split('T')[0];
            Preferences.markWorkoutDone(today);
            this.renderProgress();
            setTimeout(() => alert('כל הכבוד! סיימת את האימון! \uD83D\uDCAA'), 300);
        }

        this.saveDaily();
    },

    setupTimer() {
        const btn = document.getElementById('timer-btn');
        const display = document.getElementById('timer-display');
        let running = false;

        btn.addEventListener('click', () => {
            if (running) {
                clearInterval(this.timerInterval);
                running = false;
                btn.textContent = 'התחל מנוחה';
                this.timerSeconds = 0;
                display.textContent = '00:00';
            } else {
                this.timerSeconds = 0;
                running = true;
                btn.textContent = 'עצור';
                this.timerInterval = setInterval(() => {
                    this.timerSeconds++;
                    const mins = Math.floor(this.timerSeconds / 60);
                    const secs = this.timerSeconds % 60;
                    display.textContent =
                        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                }, 1000);
            }
        });
    },

    // === מעקב התקדמות ===
    renderProgress() {
        // משקל נוכחי
        const weights = Preferences.getWeights();
        const currentWeight = weights.length > 0 ? weights[weights.length - 1].value : '--';
        document.getElementById('current-weight-display').textContent =
            currentWeight !== '--' ? `${currentWeight} ק"ג` : '--';

        // שינוי
        if (weights.length >= 2) {
            const diff = (currentWeight - weights[0].value).toFixed(1);
            const display = document.getElementById('weight-diff-display');
            display.textContent = `${diff > 0 ? '+' : ''}${diff} ק"ג`;
            display.style.color = diff <= 0 ? 'var(--success)' : 'var(--warning)';
        }

        // streak
        document.getElementById('streak-display').textContent = Preferences.getStreak();

        // כפתור שמירת משקל
        document.getElementById('save-weight-btn').onclick = () => {
            const input = document.getElementById('weight-input');
            const val = parseFloat(input.value);
            if (val && val > 30 && val < 300) {
                Preferences.saveWeight(val);
                input.value = '';
                this.renderProgress();
                this.drawChart();
            }
        };

        // כפתור שמירת היקפים
        document.getElementById('save-measurements-btn').onclick = () => {
            const m = {
                waist: parseFloat(document.getElementById('m-waist').value) || 0,
                chest: parseFloat(document.getElementById('m-chest').value) || 0,
                arm: parseFloat(document.getElementById('m-arm').value) || 0,
                thigh: parseFloat(document.getElementById('m-thigh').value) || 0
            };
            if (m.waist || m.chest || m.arm || m.thigh) {
                Preferences.saveMeasurements(m);
                this.renderMeasurementsDiff();
                // ניקוי שדות
                ['m-waist', 'm-chest', 'm-arm', 'm-thigh'].forEach(id => {
                    document.getElementById(id).value = '';
                });
            }
        };

        // מילוי ערכים אחרונים כ-placeholder
        const latest = Preferences.getLatestMeasurements();
        if (latest) {
            if (latest.waist) document.getElementById('m-waist').placeholder = latest.waist;
            if (latest.chest) document.getElementById('m-chest').placeholder = latest.chest;
            if (latest.arm) document.getElementById('m-arm').placeholder = latest.arm;
            if (latest.thigh) document.getElementById('m-thigh').placeholder = latest.thigh;
        }

        this.renderMeasurementsDiff();
        this.drawChart();
    },

    renderMeasurementsDiff() {
        const all = Preferences.getMeasurements();
        const container = document.getElementById('measurements-diff');

        if (all.length < 1) {
            container.innerHTML = '';
            return;
        }

        const latest = all[all.length - 1];
        const first = all[0];
        const labels = { waist: '\u05DE\u05D5\u05EA\u05E0\u05D9\u05D9\u05DD', chest: '\u05D7\u05D6\u05D4', arm: '\u05D6\u05E8\u05D5\u05E2', thigh: '\u05D9\u05E8\u05DA' };

        container.innerHTML = Object.entries(labels).map(([key, label]) => {
            if (!latest[key]) return '';
            const current = latest[key];
            const diff = all.length >= 2 ? (current - first[key]).toFixed(1) : null;
            // מותניים: ירידה = טוב. חזה/זרוע/ירך: עלייה = טוב (חיטוב)
            const isGood = key === 'waist' ? diff < 0 : diff > 0;
            return `
                <div class="measure-diff-card">
                    <div class="measure-diff-label">${label}</div>
                    <div class="measure-diff-value">${current} \u05E1"\u05DE</div>
                    ${diff !== null ? `<div class="measure-diff-change ${isGood ? 'positive' : 'negative'}">${diff > 0 ? '+' : ''}${diff}</div>` : ''}
                </div>
            `;
        }).join('');
    },

    // === מעקב אכילה יומי ===
    initFoodLog() {
        this.setupFoodSearch();
        this.setupCustomFood();
        this.renderFoodLog();
        this.renderDailySummary();
    },

    // חיפוש מאכלים במאגר
    getAllFoodsFlat() {
        const all = [];
        for (const [category, items] of Object.entries(FOODS_DB)) {
            items.forEach(f => all.push({ ...f, category }));
        }
        return all;
    },

    searchFoods(query) {
        if (!query || query.length < 2) return [];
        const all = this.getAllFoodsFlat();
        const q = query.trim();
        return all.filter(f => f.name.includes(q)).slice(0, 8);
    },

    setupFoodSearch() {
        const input = document.getElementById('food-search');
        const resultsDiv = document.getElementById('food-search-results');

        input.addEventListener('input', () => {
            const results = this.searchFoods(input.value);
            if (results.length === 0) {
                resultsDiv.classList.add('hidden');
                return;
            }
            resultsDiv.classList.remove('hidden');
            resultsDiv.innerHTML = results.map((f, i) => {
                const cal = MealPlanner.itemCalories(f);
                const prot = MealPlanner.itemMacros(f).protein;
                return `<div class="search-result-item" data-index="${i}">
                    <span class="search-result-name">${f.name}</span>
                    <span class="search-result-cal">${cal} קל' | ${prot}g \u05D7\u05DC\u05D1\u05D5\u05DF</span>
                </div>`;
            }).join('');

            // click handlers
            resultsDiv.querySelectorAll('.search-result-item').forEach((el, i) => {
                el.addEventListener('click', () => {
                    this.addFoodToLog(results[i]);
                    input.value = '';
                    resultsDiv.classList.add('hidden');
                });
            });
        });

        // סגירת תוצאות בלחיצה מחוץ
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.food-search-wrapper')) {
                resultsDiv.classList.add('hidden');
            }
        });
    },

    setupCustomFood() {
        const btn = document.getElementById('btn-custom-food');
        const form = document.getElementById('custom-food-form');
        const addBtn = document.getElementById('btn-add-custom');

        btn.addEventListener('click', () => {
            form.classList.toggle('hidden');
        });

        addBtn.addEventListener('click', () => {
            const name = document.getElementById('custom-name').value.trim();
            const cal = parseInt(document.getElementById('custom-cal').value) || 0;
            const protein = parseInt(document.getElementById('custom-protein').value) || 0;
            const grams = parseInt(document.getElementById('custom-grams').value) || 100;

            if (!name) return;

            this.foodLog.push({
                name,
                cal: cal,
                protein: protein,
                carbs: 0,
                fat: 0,
                serving: grams,
                isCustom: true
            });

            // ניקוי
            document.getElementById('custom-name').value = '';
            document.getElementById('custom-cal').value = '';
            document.getElementById('custom-protein').value = '';
            document.getElementById('custom-grams').value = '100';
            form.classList.add('hidden');

            this.saveDaily();
            this.renderFoodLog();
            this.renderDailySummary();
        });
    },

    addFoodToLog(food) {
        this.foodLog.push({
            name: food.name,
            cal: food.cal,
            protein: food.protein,
            carbs: food.carbs || 0,
            fat: food.fat || 0,
            serving: food.serving,
            isCustom: false
        });
        this.saveDaily();
        this.renderFoodLog();
        this.renderDailySummary();
    },

    removeFoodFromLog(index) {
        this.foodLog.splice(index, 1);
        this.saveDaily();
        this.renderFoodLog();
        this.renderDailySummary();
    },

    renderFoodLog() {
        const container = document.getElementById('food-log-list');

        if (this.foodLog.length === 0) {
            container.innerHTML = '<div class="food-log-empty">\u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D0 \u05E0\u05E8\u05E9\u05DD \u05DB\u05DC\u05D5\u05DD. \u05D7\u05E4\u05E9 \u05DE\u05D0\u05DB\u05DC \u05D0\u05D5 \u05D4\u05D5\u05E1\u05E3 \u05DE\u05D0\u05DB\u05DC \u05D7\u05D5\u05E4\u05E9\u05D9.</div>';
            return;
        }

        container.innerHTML = this.foodLog.map((item, i) => {
            const cal = item.isCustom ? item.cal : MealPlanner.itemCalories(item);
            const prot = item.isCustom ? item.protein : MealPlanner.itemMacros(item).protein;
            return `
                <div class="food-log-item">
                    <div class="food-log-info">
                        <div class="food-log-name">${item.name}</div>
                        <div class="food-log-details">${item.serving}g | ${cal} \u05E7\u05DC' | ${prot}g \u05D7\u05DC\u05D1\u05D5\u05DF</div>
                    </div>
                    <button class="food-log-delete" data-index="${i}">\u00D7</button>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.food-log-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeFoodFromLog(parseInt(btn.dataset.index));
            });
        });
    },

    renderDailySummary() {
        const targetCal = Preferences.calculateDailyCalories(this.prefs);
        const macros = Preferences.calculateMacros(targetCal);

        // חישוב סה"כ מה שנאכל
        let eatenCal = 0, eatenProtein = 0;
        this.foodLog.forEach(item => {
            if (item.isCustom) {
                eatenCal += item.cal;
                eatenProtein += item.protein;
            } else {
                eatenCal += MealPlanner.itemCalories(item);
                eatenProtein += MealPlanner.itemMacros(item).protein;
            }
        });

        const deficit = targetCal - eatenCal;

        document.getElementById('log-cal-eaten').textContent = eatenCal;
        document.getElementById('log-cal-target').textContent = targetCal;
        document.getElementById('log-protein-eaten').textContent = eatenProtein;
        document.getElementById('log-protein-target').textContent = macros.protein;

        const deficitEl = document.getElementById('log-deficit');
        deficitEl.textContent = (deficit >= 0 ? '-' : '+') + Math.abs(deficit);
        deficitEl.classList.toggle('over-budget', deficit < 0);

        // Progress bar
        const pct = Math.min((eatenCal / targetCal) * 100, 120);
        const bar = document.getElementById('cal-progress-bar');
        bar.style.width = Math.min(pct, 100) + '%';
        bar.classList.toggle('over', pct > 100);
    },

    drawChart() {
        const canvas = document.getElementById('weight-chart');
        const ctx = canvas.getContext('2d');
        const weights = Preferences.getWeights().slice(-30); // 30 ימים אחרונים

        // Resize canvas
        canvas.width = canvas.parentElement.clientWidth - 32;
        canvas.height = 200;

        if (weights.length < 2) {
            ctx.fillStyle = '#666';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('צריך לפחות 2 שקילות להצגת גרף', canvas.width / 2, 100);
            return;
        }

        const w = canvas.width;
        const h = canvas.height;
        const padding = { top: 20, right: 20, bottom: 30, left: 50 };

        const values = weights.map(w => w.value);
        const minVal = Math.min(...values) - 1;
        const maxVal = Math.max(...values) + 1;

        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        // רקע
        ctx.clearRect(0, 0, w, h);

        // קווי עזר
        ctx.strokeStyle = '#2a2a3e';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            const val = maxVal - ((maxVal - minVal) / 4) * i;
            ctx.fillStyle = '#666';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(val.toFixed(1), padding.left - 8, y + 4);
        }

        // קו גרף
        ctx.beginPath();
        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';

        weights.forEach((point, i) => {
            const x = padding.left + (i / (weights.length - 1)) * chartW;
            const y = padding.top + ((maxVal - point.value) / (maxVal - minVal)) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // נקודות
        weights.forEach((point, i) => {
            const x = padding.left + (i / (weights.length - 1)) * chartW;
            const y = padding.top + ((maxVal - point.value) / (maxVal - minVal)) * chartH;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#e94560';
            ctx.fill();
            ctx.strokeStyle = '#0f0f1a';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // קו יעד
        if (this.prefs && this.prefs.targetWeight >= minVal && this.prefs.targetWeight <= maxVal) {
            const targetY = padding.top + ((maxVal - this.prefs.targetWeight) / (maxVal - minVal)) * chartH;
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = '#2ecc71';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(padding.left, targetY);
            ctx.lineTo(w - padding.right, targetY);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#2ecc71';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('יעד', w - padding.right + 4, targetY + 4);
        }
    }
};

// הפעלה
document.addEventListener('DOMContentLoaded', () => App.init());

// רישום Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}
