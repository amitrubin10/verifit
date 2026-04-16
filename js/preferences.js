// ניהול העדפות משתמש ו-localStorage
const Preferences = {
    STORAGE_KEY: 'fitday_prefs',
    WEIGHTS_KEY: 'fitday_weights',
    WORKOUTS_KEY: 'fitday_workouts',
    DAILY_KEY: 'fitday_daily',
    MEASUREMENTS_KEY: 'fitday_measurements',
    EXERCISE_LOG_KEY: 'fitday_exercise_log',

    save(prefs) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prefs));
    },

    load() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    isSetupDone() {
        return !!this.load();
    },

    // חישוב BMR לפי Mifflin-St Jeor
    calculateBMR(prefs) {
        const { gender, age, height, weight } = prefs;
        if (gender === 'male') {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    },

    // חישוב TDEE (הוצאה קלורית יומית)
    calculateTDEE(prefs) {
        const bmr = this.calculateBMR(prefs);
        const multipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725
        };
        return Math.round(bmr * (multipliers[prefs.activityLevel] || 1.2));
    },

    // חישוב יעד קלורי (עם גירעון)
    calculateDailyCalories(prefs) {
        const tdee = this.calculateTDEE(prefs);
        const deficit = 500; // גירעון של 500 קלוריות - ירידה מהירה יותר
        return Math.max(1200, Math.round(tdee - deficit)); // מינימום 1200
    },

    // חישוב מאקרו - מותאם לחיטוב (חלבון גבוה)
    calculateMacros(calories) {
        return {
            protein: Math.round((calories * 0.40) / 4), // 40% חלבון - חשוב לחיטוב ובניית שריר
            carbs: Math.round((calories * 0.30) / 4),    // 30% פחמימות
            fat: Math.round((calories * 0.30) / 9)       // 30% שומן, 9 קלוריות לגרם
        };
    },

    // שמירת שקילה
    saveWeight(weight) {
        const weights = this.getWeights();
        const today = new Date().toISOString().split('T')[0];
        // עדכון או הוספה
        const existing = weights.findIndex(w => w.date === today);
        if (existing >= 0) {
            weights[existing].value = weight;
        } else {
            weights.push({ date: today, value: weight });
        }
        localStorage.setItem(this.WEIGHTS_KEY, JSON.stringify(weights));
    },

    getWeights() {
        const data = localStorage.getItem(this.WEIGHTS_KEY);
        return data ? JSON.parse(data) : [];
    },

    // מעקב אימונים - סימון יום כבוצע
    markWorkoutDone(date) {
        const workouts = this.getWorkoutDays();
        if (!workouts.includes(date)) {
            workouts.push(date);
            localStorage.setItem(this.WORKOUTS_KEY, JSON.stringify(workouts));
        }
    },

    getWorkoutDays() {
        const data = localStorage.getItem(this.WORKOUTS_KEY);
        return data ? JSON.parse(data) : [];
    },

    // חישוב streak
    getStreak() {
        const days = this.getWorkoutDays().sort().reverse();
        if (days.length === 0) return 0;

        let streak = 0;
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (days.includes(dateStr)) {
                streak++;
            } else if (i > 0) { // מאפשר את היום הנוכחי לא להיספר
                break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }
        return streak;
    },

    // נתוני יום נוכחי (תפריט + אימון שנבחרו)
    saveDailyData(data) {
        const today = new Date().toISOString().split('T')[0];
        const daily = this.getDailyData();
        daily[today] = data;
        // שומר רק 7 ימים אחרונים
        const keys = Object.keys(daily).sort().reverse().slice(0, 7);
        const trimmed = {};
        keys.forEach(k => trimmed[k] = daily[k]);
        localStorage.setItem(this.DAILY_KEY, JSON.stringify(trimmed));
    },

    getDailyData() {
        const data = localStorage.getItem(this.DAILY_KEY);
        return data ? JSON.parse(data) : {};
    },

    getTodayData() {
        const today = new Date().toISOString().split('T')[0];
        return this.getDailyData()[today] || null;
    },

    // === מעקב היקפים לחיטוב ===
    saveMeasurements(measurements) {
        const all = this.getMeasurements();
        const today = new Date().toISOString().split('T')[0];
        const existing = all.findIndex(m => m.date === today);
        const entry = { date: today, ...measurements };
        if (existing >= 0) {
            all[existing] = entry;
        } else {
            all.push(entry);
        }
        localStorage.setItem(this.MEASUREMENTS_KEY, JSON.stringify(all));
    },

    getMeasurements() {
        const data = localStorage.getItem(this.MEASUREMENTS_KEY);
        return data ? JSON.parse(data) : [];
    },

    getLatestMeasurements() {
        const all = this.getMeasurements();
        return all.length > 0 ? all[all.length - 1] : null;
    },

    // === מעקב עלייה הדרגתית באימונים ===
    saveExerciseLog(exerciseId, sets, reps, weight) {
        const log = this.getExerciseLog();
        const today = new Date().toISOString().split('T')[0];
        if (!log[exerciseId]) log[exerciseId] = [];
        log[exerciseId].push({ date: today, sets, reps, weight });
        // שומר רק 30 רשומות אחרונות לכל תרגיל
        if (log[exerciseId].length > 30) {
            log[exerciseId] = log[exerciseId].slice(-30);
        }
        localStorage.setItem(this.EXERCISE_LOG_KEY, JSON.stringify(log));
    },

    getExerciseLog() {
        const data = localStorage.getItem(this.EXERCISE_LOG_KEY);
        return data ? JSON.parse(data) : {};
    },

    getLastExerciseEntry(exerciseId) {
        const log = this.getExerciseLog();
        const entries = log[exerciseId];
        return entries && entries.length > 0 ? entries[entries.length - 1] : null;
    }
};
