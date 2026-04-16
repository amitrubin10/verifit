// מאגר מאכלים ישראליים - ערכים תזונתיים ל-100 גרם
const FOODS_DB = {
    proteins: [
        { id: "chicken_breast", name: "חזה עוף", cal: 165, protein: 31, carbs: 0, fat: 3.6, serving: 150, unit: "גרם" },
        { id: "eggs", name: "ביצים", cal: 155, protein: 13, carbs: 1.1, fat: 11, serving: 120, unit: "גרם (2 ביצים)" },
        { id: "tuna_canned", name: "טונה בקופסה", cal: 116, protein: 26, carbs: 0, fat: 1, serving: 100, unit: "גרם" },
        { id: "cottage", name: "קוטג' 5%", cal: 98, protein: 11, carbs: 3, fat: 5, serving: 150, unit: "גרם" },
        { id: "turkey_breast", name: "חזה הודו", cal: 135, protein: 30, carbs: 0, fat: 1, serving: 150, unit: "גרם" },
        { id: "beef_lean", name: "בשר בקר רזה", cal: 250, protein: 26, carbs: 0, fat: 15, serving: 150, unit: "גרם" },
        { id: "yogurt_greek", name: "יוגורט יווני", cal: 97, protein: 9, carbs: 4, fat: 5, serving: 170, unit: "גרם" },
        { id: "white_cheese_5", name: "גבינה לבנה 5%", cal: 75, protein: 10, carbs: 3.5, fat: 5, serving: 100, unit: "גרם" },
        { id: "shakshuka", name: "שקשוקה (2 ביצים)", cal: 180, protein: 14, carbs: 10, fat: 10, serving: 250, unit: "גרם", isComplete: true },
        { id: "schnitzel", name: "שניצל עוף אפוי", cal: 220, protein: 25, carbs: 12, fat: 8, serving: 150, unit: "גרם", isComplete: true },
        { id: "tofu", name: "טופו", cal: 76, protein: 8, carbs: 1.9, fat: 4.8, serving: 150, unit: "גרם" },
        { id: "lentils_cooked", name: "עדשים מבושלות", cal: 116, protein: 9, carbs: 20, fat: 0.4, serving: 150, unit: "גרם" }
    ],
    carbs: [
        { id: "rice", name: "אורז לבן מבושל", cal: 130, protein: 2.7, carbs: 28, fat: 0.3, serving: 150, unit: "גרם" },
        { id: "brown_rice", name: "אורז מלא מבושל", cal: 112, protein: 2.6, carbs: 24, fat: 0.9, serving: 150, unit: "גרם" },
        { id: "pita", name: "פיתה", cal: 275, protein: 9.1, carbs: 56, fat: 1.2, serving: 60, unit: "גרם (1 פיתה)" },
        { id: "whole_bread", name: "לחם מלא", cal: 247, protein: 13, carbs: 41, fat: 3.4, serving: 60, unit: "גרם (2 פרוסות)" },
        { id: "sweet_potato", name: "בטטה", cal: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: 200, unit: "גרם" },
        { id: "potato", name: "תפוח אדמה", cal: 77, protein: 2, carbs: 17, fat: 0.1, serving: 200, unit: "גרם" },
        { id: "couscous", name: "קוסקוס", cal: 112, protein: 3.8, carbs: 23, fat: 0.2, serving: 150, unit: "גרם" },
        { id: "pasta", name: "פסטה מבושלת", cal: 131, protein: 5, carbs: 25, fat: 1.1, serving: 180, unit: "גרם" },
        { id: "bulgur", name: "בורגול", cal: 83, protein: 3.1, carbs: 19, fat: 0.2, serving: 150, unit: "גרם" },
        { id: "oats", name: "שיבולת שועל", cal: 389, protein: 17, carbs: 66, fat: 7, serving: 50, unit: "גרם" },
        { id: "corn", name: "תירס", cal: 86, protein: 3.3, carbs: 19, fat: 1.2, serving: 150, unit: "גרם" }
    ],
    veggies: [
        { id: "cucumber", name: "מלפפון", cal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, serving: 100, unit: "גרם" },
        { id: "tomato", name: "עגבנייה", cal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, serving: 100, unit: "גרם" },
        { id: "pepper", name: "פלפל", cal: 31, protein: 1, carbs: 6, fat: 0.3, serving: 100, unit: "גרם" },
        { id: "lettuce", name: "חסה", cal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, serving: 80, unit: "גרם" },
        { id: "carrot", name: "גזר", cal: 41, protein: 0.9, carbs: 10, fat: 0.2, serving: 80, unit: "גרם" },
        { id: "cabbage", name: "כרוב", cal: 25, protein: 1.3, carbs: 6, fat: 0.1, serving: 100, unit: "גרם" },
        { id: "broccoli", name: "ברוקולי", cal: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: 100, unit: "גרם" },
        { id: "zucchini", name: "קישוא", cal: 17, protein: 1.2, carbs: 3.1, fat: 0.3, serving: 150, unit: "גרם" },
        { id: "eggplant", name: "חציל", cal: 25, protein: 1, carbs: 6, fat: 0.2, serving: 150, unit: "גרם" },
        { id: "onion", name: "בצל", cal: 40, protein: 1.1, carbs: 9, fat: 0.1, serving: 50, unit: "גרם" },
        { id: "israeli_salad", name: "סלט ישראלי", cal: 50, protein: 1.5, carbs: 6, fat: 2.5, serving: 200, unit: "גרם", isComplete: true }
    ],
    fats: [
        { id: "olive_oil", name: "שמן זית", cal: 884, protein: 0, carbs: 0, fat: 100, serving: 10, unit: "מ\"ל (כף)" },
        { id: "avocado", name: "אבוקדו", cal: 160, protein: 2, carbs: 9, fat: 15, serving: 70, unit: "גרם (חצי)" },
        { id: "tahini", name: "טחינה", cal: 595, protein: 17, carbs: 21, fat: 54, serving: 15, unit: "גרם (כף)" },
        { id: "hummus", name: "חומוס", cal: 166, protein: 8, carbs: 14, fat: 10, serving: 80, unit: "גרם" },
        { id: "almonds", name: "שקדים", cal: 579, protein: 21, carbs: 22, fat: 50, serving: 25, unit: "גרם (קומץ)" },
        { id: "peanuts", name: "בוטנים", cal: 567, protein: 26, carbs: 16, fat: 49, serving: 25, unit: "גרם (קומץ)" },
        { id: "peanut_butter", name: "חמאת בוטנים", cal: 588, protein: 25, carbs: 20, fat: 50, serving: 15, unit: "גרם (כף)" }
    ],
    fruits: [
        { id: "apple", name: "תפוח", cal: 52, protein: 0.3, carbs: 14, fat: 0.2, serving: 150, unit: "גרם (1)" },
        { id: "banana", name: "בננה", cal: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: 120, unit: "גרם (1)" },
        { id: "orange", name: "תפוז", cal: 47, protein: 0.9, carbs: 12, fat: 0.1, serving: 150, unit: "גרם (1)" },
        { id: "watermelon", name: "אבטיח", cal: 30, protein: 0.6, carbs: 8, fat: 0.2, serving: 200, unit: "גרם" },
        { id: "grapes", name: "ענבים", cal: 69, protein: 0.7, carbs: 18, fat: 0.2, serving: 100, unit: "גרם" },
        { id: "strawberry", name: "תותים", cal: 32, protein: 0.7, carbs: 8, fat: 0.3, serving: 150, unit: "גרם" },
        { id: "dates", name: "תמרים", cal: 277, protein: 1.8, carbs: 75, fat: 0.2, serving: 30, unit: "גרם (3)" }
    ],
    snacks: [
        { id: "rice_cakes", name: "פריכיות אורז", cal: 35, protein: 0.7, carbs: 7, fat: 0.3, serving: 20, unit: "גרם (2)" },
        { id: "granola_bar", name: "חטיף גרנולה", cal: 190, protein: 3, carbs: 28, fat: 7, serving: 40, unit: "גרם" },
        { id: "protein_shake", name: "שייק חלבון", cal: 120, protein: 24, carbs: 3, fat: 1, serving: 30, unit: "גרם אבקה", isComplete: true },
        { id: "veggies_hummus", name: "ירקות + חומוס", cal: 120, protein: 5, carbs: 12, fat: 6, serving: 150, unit: "גרם", isComplete: true },
        { id: "cottage_fruit", name: "קוטג' + פרי", cal: 130, protein: 12, carbs: 12, fat: 5, serving: 200, unit: "גרם", isComplete: true }
    ],
    // מאכלי ג'אנק - גרסאות מותאמות לדיאטה (מנות קטנות יותר)
    favorites: [
        { id: "pizza_slice", name: "פיצה (משולש)", cal: 270, protein: 12, carbs: 33, fat: 10, serving: 120, unit: "גרם (1 משולש)", isComplete: true },
        { id: "pizza_2slices", name: "פיצה (2 משולשים)", cal: 270, protein: 12, carbs: 33, fat: 10, serving: 240, unit: "גרם (2 משולשים)", isComplete: true },
        { id: "burekas_cheese", name: "בורקס גבינה", cal: 340, protein: 8, carbs: 28, fat: 22, serving: 100, unit: "גרם (1)", isComplete: true },
        { id: "burekas_potato", name: "בורקס תפו\"א", cal: 310, protein: 5, carbs: 32, fat: 18, serving: 100, unit: "גרם (1)", isComplete: true },
        { id: "hamburger", name: "המבורגר בלחמניה", cal: 295, protein: 17, carbs: 24, fat: 14, serving: 200, unit: "גרם (1)", isComplete: true },
        { id: "pita_omelette", name: "פיתה עם חביתה", cal: 235, protein: 15, carbs: 30, fat: 7, serving: 180, unit: "גרם (1)", isComplete: true },
        { id: "pita_shawarma", name: "פיתה שווארמה", cal: 280, protein: 22, carbs: 30, fat: 9, serving: 250, unit: "גרם (1)", isComplete: true },
        { id: "sabich", name: "סביח", cal: 290, protein: 10, carbs: 35, fat: 13, serving: 280, unit: "גרם (1)", isComplete: true },
        { id: "falafel_pita", name: "פיתה פלאפל", cal: 260, protein: 10, carbs: 36, fat: 10, serving: 250, unit: "גרם (1)", isComplete: true },
        { id: "schnitzel_pita", name: "פיתה שניצל", cal: 310, protein: 18, carbs: 34, fat: 11, serving: 250, unit: "גרם (1)", isComplete: true },
        { id: "toast_cheese", name: "טוסט גבינה", cal: 290, protein: 14, carbs: 28, fat: 13, serving: 120, unit: "גרם (1)", isComplete: true },
        { id: "jachnun", name: "ג'חנון", cal: 380, protein: 7, carbs: 42, fat: 20, serving: 150, unit: "גרם (1)", isComplete: true },
        { id: "malawach", name: "מלאווח", cal: 350, protein: 7, carbs: 38, fat: 19, serving: 130, unit: "גרם (1)", isComplete: true }
    ]
};

// אימוג'י למאכלים
const FOOD_EMOJI = {
    // חלבונים
    chicken_breast: "\uD83C\uDF57", eggs: "\uD83C\uDF73", tuna_canned: "\uD83D\uDC1F", cottage: "\uD83E\uDDC0",
    turkey_breast: "\uD83C\uDF57", beef_lean: "\uD83E\uDD69", yogurt_greek: "\uD83E\uDD5B", white_cheese_5: "\uD83E\uDDC0",
    shakshuka: "\uD83C\uDF73", schnitzel: "\uD83C\uDF57", tofu: "\uD83E\uDDC6", lentils_cooked: "\uD83E\uDED8",
    // פחמימות
    rice: "\uD83C\uDF5A", brown_rice: "\uD83C\uDF5A", pita: "\uD83E\uDD59", whole_bread: "\uD83C\uDF5E",
    sweet_potato: "\uD83C\uDF60", potato: "\uD83E\uDD54", couscous: "\uD83E\uDED5", pasta: "\uD83C\uDF5D",
    bulgur: "\uD83C\uDF3E", oats: "\uD83E\uDD63", corn: "\uD83C\uDF3D",
    // ירקות
    cucumber: "\uD83E\uDD52", tomato: "\uD83C\uDF45", pepper: "\uD83C\uDF36\uFE0F", lettuce: "\uD83E\uDD6C",
    carrot: "\uD83E\uDD55", cabbage: "\uD83E\uDD6C", broccoli: "\uD83E\uDD66", zucchini: "\uD83E\uDD52",
    eggplant: "\uD83C\uDF46", onion: "\uD83E\uDDC5", israeli_salad: "\uD83E\uDD57",
    // שומנים
    olive_oil: "\uD83E\uDED2", avocado: "\uD83E\uDD51", tahini: "\uD83E\uDD5C", hummus: "\uD83E\uDED8",
    almonds: "\uD83C\uDF30", peanuts: "\uD83E\uDD5C", peanut_butter: "\uD83E\uDD5C",
    // פירות
    apple: "\uD83C\uDF4E", banana: "\uD83C\uDF4C", orange: "\uD83C\uDF4A", watermelon: "\uD83C\uDF49",
    grapes: "\uD83C\uDF47", strawberry: "\uD83C\uDF53", dates: "\uD83C\uDF34",
    // חטיפים
    rice_cakes: "\uD83C\uDF58", granola_bar: "\uD83C\uDF6B", protein_shake: "\uD83E\uDD64",
    veggies_hummus: "\uD83E\uDD57", cottage_fruit: "\uD83C\uDF53",
    // ג'אנק אהוב
    pizza_slice: "\uD83C\uDF55", pizza_2slices: "\uD83C\uDF55", burekas_cheese: "\uD83E\uDD50", burekas_potato: "\uD83E\uDD50",
    hamburger: "\uD83C\uDF54", pita_omelette: "\uD83E\uDD59", pita_shawarma: "\uD83E\uDD59", sabich: "\uD83E\uDD59",
    falafel_pita: "\uD83E\uDDC6", schnitzel_pita: "\uD83E\uDD59", toast_cheese: "\uD83C\uDF5E",
    jachnun: "\uD83E\uDED3", malawach: "\uD83E\uDED3"
};

// רשימת מאכלים אהובים - ג'אנק שאפשר לשלב בתפריט
const FOOD_FAVORITE_OPTIONS = [
    { label: "פיצה", ids: ["pizza_slice", "pizza_2slices"] },
    { label: "בורקס", ids: ["burekas_cheese", "burekas_potato"] },
    { label: "המבורגר", ids: ["hamburger"] },
    { label: "פיתה עם חביתה", ids: ["pita_omelette"] },
    { label: "שווארמה", ids: ["pita_shawarma"] },
    { label: "סביח", ids: ["sabich"] },
    { label: "פלאפל", ids: ["falafel_pita"] },
    { label: "פיתה שניצל", ids: ["schnitzel_pita"] },
    { label: "טוסט", ids: ["toast_cheese"] },
    { label: "ג'חנון", ids: ["jachnun"] },
    { label: "מלאווח", ids: ["malawach"] }
];

// רשימת מאכלים שאפשר לסנן
const FOOD_DISLIKE_OPTIONS = [
    "ביצים", "טונה", "חומוס", "טחינה", "אבוקדו", "חציל",
    "ברוקולי", "בטטה", "טופו", "עדשים", "בשר בקר",
    "גבינות", "דגים", "אגוזים", "חלבי"
];

// מיפוי מאכלים לא אהובים למזהים
const DISLIKE_TO_IDS = {
    "ביצים": ["eggs", "shakshuka"],
    "טונה": ["tuna_canned"],
    "חומוס": ["hummus", "veggies_hummus"],
    "טחינה": ["tahini"],
    "אבוקדו": ["avocado"],
    "חציל": ["eggplant"],
    "ברוקולי": ["broccoli"],
    "בטטה": ["sweet_potato"],
    "טופו": ["tofu"],
    "עדשים": ["lentils_cooked"],
    "בשר בקר": ["beef_lean"],
    "גבינות": ["cottage", "white_cheese_5", "cottage_fruit"],
    "דגים": ["tuna_canned"],
    "אגוזים": ["almonds", "peanuts", "peanut_butter"],
    "חלבי": ["cottage", "white_cheese_5", "yogurt_greek", "cottage_fruit"]
};
