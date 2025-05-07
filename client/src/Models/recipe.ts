export type Recipe = {
    Id?: number; // מזהה מתכון
    Name: string; // שם המתכון
    Instructions :Instructions[], // מערך של הוראות
    Difficulty: string; // רמת קושי
    Duration: number; // זמן הכנה
    Description: string; // תיאור קצר
    UserId: number; // משתמש מוסיף
    CategoryId: number; // מזהה קטגוריה
    Img: string; // קישור לתמונה מתאימה
    Ingridents: Ingridents[]; // מערך של מרכיבים
};
export type Instructions={
    // Id:number;
    Name:string;
}
//רכיב
export type Ingridents = {
    Name: string; // שם המוצר
    Count: string; // כמות
    Type: string; // סוג הכמות (כפות, כוסות, חבילות, גרם וכו')
};

export type Category={
    Id:number;
    Name:string
}