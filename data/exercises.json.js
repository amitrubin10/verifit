// מאגר תרגילים ביתיים
const EXERCISES_DB = [
    // פלג גוף עליון
    {
        id: "pushups", name: "שכיבות סמיכה", muscle: "חזה, כתפיים, תלת ראשי",
        category: "upper", difficulty: 2, equipment: "none",
        sets: 3, reps: "10-15", rest: 60,
        desc: "ידיים ברוחב כתפיים, גוף ישר כקרש. יורדים עד שהחזה כמעט נוגע ברצפה ודוחפים חזרה למעלה. אפשר להתחיל מהברכיים."
    },
    {
        id: "diamond_pushups", name: "שכיבות סמיכה יהלום", muscle: "תלת ראשי, חזה",
        category: "upper", difficulty: 3, equipment: "none",
        sets: 3, reps: "8-12", rest: 60,
        desc: "כמו שכיבות סמיכה רגילות, אבל הידיים קרובות ויוצרות צורת יהלום. מדגיש את התלת ראשי."
    },
    {
        id: "pike_pushups", name: "שכיבות סמיכה פייק", muscle: "כתפיים, תלת ראשי",
        category: "upper", difficulty: 3, equipment: "none",
        sets: 3, reps: "8-12", rest: 60,
        desc: "עמידה על ידיים ורגליים עם ישבן למעלה (צורת V הפוך). מורידים את הראש לרצפה ודוחפים למעלה."
    },
    {
        id: "dumbbell_rows", name: "חתירה עם משקולת", muscle: "גב, ביספס",
        category: "upper", difficulty: 2, equipment: "dumbbells",
        sets: 3, reps: "10-12", rest: 60,
        desc: "יד ורגל על ספסל/כיסא, משקולת ביד השנייה. מושכים את המשקולת לכיוון המותן ומורידים לאט."
    },
    {
        id: "bicep_curls", name: "כפיפות ביספס", muscle: "ביספס",
        category: "upper", difficulty: 1, equipment: "dumbbells",
        sets: 3, reps: "12-15", rest: 45,
        desc: "עמידה עם משקולות בידיים, מרפקים צמודים לגוף. מכופפים את הידיים ומורידים לאט."
    },
    {
        id: "tricep_dips", name: "טבילות תלת ראשי", muscle: "תלת ראשי, כתפיים",
        category: "upper", difficulty: 2, equipment: "none",
        sets: 3, reps: "10-15", rest: 60,
        desc: "ידיים על כיסא/ספה מאחור, רגליים ישרות. מורידים את הגוף ודוחפים למעלה."
    },
    {
        id: "shoulder_press", name: "לחיצת כתפיים", muscle: "כתפיים, תלת ראשי",
        category: "upper", difficulty: 2, equipment: "dumbbells",
        sets: 3, reps: "10-12", rest: 60,
        desc: "עמידה/ישיבה, משקולות בגובה הכתפיים. דוחפים למעלה ומורידים לאט."
    },
    {
        id: "lateral_raises", name: "הרמות צד", muscle: "כתפיים",
        category: "upper", difficulty: 1, equipment: "dumbbells",
        sets: 3, reps: "12-15", rest: 45,
        desc: "עמידה עם משקולות בצדדים. מרימים את הידיים הצידה עד גובה הכתפיים ומורידים לאט."
    },

    // פלג גוף תחתון
    {
        id: "squats", name: "סקוואט", muscle: "ירכיים, ישבן",
        category: "lower", difficulty: 1, equipment: "none",
        sets: 4, reps: "15-20", rest: 60,
        desc: "רגליים ברוחב כתפיים, יורדים כאילו יושבים על כיסא. ברכיים לא עוברות את קצה כפות הרגליים. חוזרים למעלה."
    },
    {
        id: "goblet_squats", name: "סקוואט עם משקולת", muscle: "ירכיים, ישבן",
        category: "lower", difficulty: 2, equipment: "dumbbells",
        sets: 4, reps: "12-15", rest: 60,
        desc: "מחזיקים משקולת בשתי ידיים בגובה החזה ומבצעים סקוואט. המשקולת עוזרת לשמור על יציבה ישרה."
    },
    {
        id: "lunges", name: "מכרעים", muscle: "ירכיים, ישבן",
        category: "lower", difficulty: 2, equipment: "none",
        sets: 3, reps: "12 לכל רגל", rest: 60,
        desc: "צעד גדול קדימה, יורדים עד שהברך האחורית כמעט נוגעת ברצפה. חוזרים ומחליפים רגל."
    },
    {
        id: "glute_bridge", name: "גשר ישבן", muscle: "ישבן, גב תחתון",
        category: "lower", difficulty: 1, equipment: "none",
        sets: 3, reps: "15-20", rest: 45,
        desc: "שכיבה על הגב, ברכיים כפופות. מרימים את האגן למעלה, סוחטים את הישבן בנקודה העליונה."
    },
    {
        id: "single_leg_bridge", name: "גשר רגל אחת", muscle: "ישבן",
        category: "lower", difficulty: 3, equipment: "none",
        sets: 3, reps: "10 לכל רגל", rest: 60,
        desc: "כמו גשר ישבן, אבל רגל אחת באוויר. יותר אינטנסיבי לישבן."
    },
    {
        id: "calf_raises", name: "הרמות עקב", muscle: "שוקיים",
        category: "lower", difficulty: 1, equipment: "none",
        sets: 3, reps: "20-25", rest: 30,
        desc: "עמידה על קצות האצבעות, מרימים את העקבים למעלה ומורידים לאט. אפשר על מדרגה לטווח תנועה מלא."
    },
    {
        id: "sumo_squats", name: "סקוואט סומו", muscle: "ירכיים פנימיות, ישבן",
        category: "lower", difficulty: 2, equipment: "none",
        sets: 3, reps: "15", rest: 60,
        desc: "רגליים רחבות, אצבעות כלפי חוץ. יורדים לסקוואט עמוק ועולים בחזרה."
    },
    {
        id: "wall_sit", name: "ישיבה על קיר", muscle: "ירכיים",
        category: "lower", difficulty: 2, equipment: "none",
        sets: 3, reps: "30-45 שניות", rest: 60,
        desc: "גב צמוד לקיר, ברכיים בזווית 90 מעלות כאילו יושבים על כיסא. מחזיקים."
    },

    // בטן
    {
        id: "crunches", name: "כפיפות בטן", muscle: "בטן עליונה",
        category: "core", difficulty: 1, equipment: "none",
        sets: 3, reps: "15-20", rest: 45,
        desc: "שכיבה על הגב, ברכיים כפופות. מרימים את הכתפיים מהרצפה תוך כיווץ הבטן."
    },
    {
        id: "plank", name: "פלאנק", muscle: "בטן, ליבה",
        category: "core", difficulty: 2, equipment: "none",
        sets: 3, reps: "30-60 שניות", rest: 45,
        desc: "עמידה על מרפקים ואצבעות רגליים, גוף ישר כקרש. שומרים על נשימה רגילה."
    },
    {
        id: "mountain_climbers", name: "מטפסי הרים", muscle: "בטן, קרדיו",
        category: "core", difficulty: 2, equipment: "none",
        sets: 3, reps: "20 לכל צד", rest: 45,
        desc: "בעמדת שכיבות סמיכה, מביאים ברך אחת לחזה ומחליפים במהירות."
    },
    {
        id: "leg_raises", name: "הרמות רגליים", muscle: "בטן תחתונה",
        category: "core", difficulty: 2, equipment: "none",
        sets: 3, reps: "12-15", rest: 45,
        desc: "שכיבה על הגב, ידיים בצדדים. מרימים רגליים ישרות עד 90 מעלות ומורידים לאט."
    },
    {
        id: "bicycle_crunch", name: "כפיפות אופניים", muscle: "בטן, אלכסוניים",
        category: "core", difficulty: 2, equipment: "none",
        sets: 3, reps: "15 לכל צד", rest: 45,
        desc: "שכיבה על הגב, ידיים מאחורי הראש. מביאים מרפק לברך הנגדית בתנועת סיבוב."
    },
    {
        id: "russian_twist", name: "סיבובים רוסיים", muscle: "אלכסוניים",
        category: "core", difficulty: 2, equipment: "none",
        sets: 3, reps: "15 לכל צד", rest: 45,
        desc: "ישיבה עם גב מוטה לאחור, רגליים באוויר. מסובבים את הגוף מצד לצד."
    },

    // קרדיו ביתי
    {
        id: "jumping_jacks", name: "ג'מפינג ג'קס", muscle: "קרדיו, כל הגוף",
        category: "cardio", difficulty: 1, equipment: "none",
        sets: 3, reps: "30", rest: 30,
        desc: "קפיצה עם פתיחת רגליים וידיים לצדדים ובחזרה."
    },
    {
        id: "burpees", name: "בורפיז", muscle: "קרדיו, כל הגוף",
        category: "cardio", difficulty: 3, equipment: "none",
        sets: 3, reps: "8-10", rest: 60,
        desc: "מעמידה, ירידה לסקוואט, ידיים לרצפה, קפיצה לעמדת שכיבות סמיכה, שכיבת סמיכה, קפיצה חזרה לעמידה."
    },
    {
        id: "high_knees", name: "ריצה במקום ברכיים גבוהות", muscle: "קרדיו, ירכיים",
        category: "cardio", difficulty: 2, equipment: "none",
        sets: 3, reps: "30 שניות", rest: 30,
        desc: "ריצה במקום תוך הרמת ברכיים גבוה ככל האפשר."
    },
    {
        id: "jump_squats", name: "סקוואט קפיצה", muscle: "ירכיים, קרדיו",
        category: "cardio", difficulty: 3, equipment: "none",
        sets: 3, reps: "10-12", rest: 60,
        desc: "סקוואט רגיל ובסוף קפיצה למעלה. נחיתה רכה וחזרה לסקוואט."
    }
];

// תוכנית שבועית - מותאמת לחיטוב (היפרטרופיה + שריפת שומן)
// יותר אימוני כוח, פחות קרדיו - חיטוב דורש בניית שריר
const WEEKLY_PLAN = {
    0: { name: "חזה + כתפיים + תלת", categories: ["upper", "core"], exerciseCount: 6 },          // ראשון - Push
    1: { name: "ירכיים + ישבן", categories: ["lower"], exerciseCount: 6 },                         // שני - Legs
    2: { name: "קרדיו + בטן (שריפת שומן)", categories: ["cardio", "core"], exerciseCount: 5 },    // שלישי
    3: { name: "גב + ביספס", categories: ["upper", "core"], exerciseCount: 6 },                    // רביעי - Pull
    4: { name: "ירכיים + ישבן + בטן", categories: ["lower", "core"], exerciseCount: 6 },          // חמישי - Legs
    5: { name: "אימון כל הגוף (חיטוב)", categories: ["upper", "lower", "core", "cardio"], exerciseCount: 6 }, // שישי
    6: { name: "יום מנוחה - התאוששות", categories: [], exerciseCount: 0 }                            // שבת
};

// ציוד
const EQUIPMENT_OPTIONS = [
    { id: "dumbbells", name: "משקולות יד" },
    { id: "resistance_bands", name: "גומיות התנגדות" },
    { id: "mat", name: "מזרן" },
    { id: "pull_up_bar", name: "מתח" }
];
