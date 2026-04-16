// לוגיקת הרכבת אימון יומי
const WorkoutPlanner = {
    // בחירת תרגילים ליום לפי תוכנית שבועית
    generateDailyWorkout(dayOfWeek, equipment = []) {
        const plan = WEEKLY_PLAN[dayOfWeek];
        if (!plan || plan.exerciseCount === 0) {
            return { name: plan ? plan.name : 'יום מנוחה', exercises: [], isRestDay: true };
        }

        // סינון תרגילים לפי קטגוריה וציוד
        const available = EXERCISES_DB.filter(ex => {
            // בדיקת קטגוריה
            if (!plan.categories.includes(ex.category)) return false;
            // בדיקת ציוד
            if (ex.equipment !== 'none' && !equipment.includes(ex.equipment)) return false;
            return true;
        });

        // בחירה רנדומלית עם ניסיון לפיזור קטגוריות
        const selected = [];
        const perCategory = {};

        // חלוקה לפי קטגוריה
        plan.categories.forEach(cat => {
            perCategory[cat] = available.filter(ex => ex.category === cat);
        });

        // בוחרים מכל קטגוריה
        let remaining = plan.exerciseCount;
        for (const cat of plan.categories) {
            if (remaining <= 0) break;
            const catExercises = perCategory[cat];
            const count = Math.min(
                Math.ceil(remaining / (plan.categories.length - plan.categories.indexOf(cat))),
                catExercises.length
            );
            const picked = this.pickRandom(catExercises, count);
            selected.push(...picked);
            remaining -= picked.length;
        }

        // אם חסרים, ממלאים מכל מה שזמין
        if (selected.length < plan.exerciseCount) {
            const notSelected = available.filter(ex => !selected.find(s => s.id === ex.id));
            const extra = this.pickRandom(notSelected, plan.exerciseCount - selected.length);
            selected.push(...extra);
        }

        return {
            name: plan.name,
            exercises: selected.slice(0, plan.exerciseCount),
            isRestDay: false
        };
    },

    pickRandom(arr, count = 1) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    // שם הקטגוריה בעברית
    getCategoryName(cat) {
        const names = {
            upper: 'פלג גוף עליון',
            lower: 'פלג גוף תחתון',
            core: 'בטן וליבה',
            cardio: 'קרדיו'
        };
        return names[cat] || cat;
    },

    // שם היום בעברית
    getDayName(dayOfWeek) {
        const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        return days[dayOfWeek];
    }
};
