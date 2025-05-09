// import React, { ReactNode, createContext, useContext, useState } from "react";
// import { User } from "../Models/user";

// // הגדרת טיפוס לקונטקסט
// interface AuthContextType {
//     user: User | null;
//     isLoggedIn: boolean;
//     setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
//     saveUser: (user: User) => void;
//     logout: () => void;
// }

// // יצירת הקונטקסט עם הטיפוס הנכון
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// interface AuthProviderProps {
//     children: ReactNode;
// }

// // ספק את הקונטקסט לכל רכיב שצריך גישה אליו
// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//     // טעינת המשתמש מה-LocalStorage (אם קיים)
//     const [user, setUser] = useState<User | null>(() => {
//         const storedUser = localStorage.getItem("user");
//         return storedUser ? JSON.parse(storedUser) : null;
//     });

//     // אתחול של isLoggedIn ל-FALSE
//     // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//     const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
//         return localStorage.getItem("user") !== null;
//     });

//     // פונקציה לשמירת המשתמש
//     const saveUser = (user: User) => {
//         localStorage.setItem("user", JSON.stringify(user)); // שמירת פרטי המשתמש
//         localStorage.setItem("isLoggedIn", "true"); // עדכון ה-LocalStorage
//         setUser(user); // עדכון סטייט מיידית
//         setIsLoggedIn(true); // סימון כמשתמש מחובר
//     };

//     // פונקציה להתנתקות (ניקוי המשתמש)
//     const logout = () => {
//         localStorage.removeItem("user");
//         localStorage.removeItem("isLoggedIn");
//         setUser(null);
//         setIsLoggedIn(false);
//     };

//     return (
//         <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, saveUser, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // הוק לשימוש בקונטקסט
// export const useAuth = (): AuthContextType => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };
"use client"

import type React from "react"
import { type ReactNode, createContext, useContext, useState } from "react"
import type { User } from "../Models/user"

// הגדרת טיפוס לקונטקסט
interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  saveUser: (user: User) => void
  logout: () => void
}

// יצירת הקונטקסט עם הטיפוס הנכון
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

// ספק את הקונטקסט לכל רכיב שצריך גישה אליו
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // טעינת המשתמש מה-LocalStorage (אם קיים)
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [isLoggedIn, setIsLoggedIn]=useState<boolean>(false);

  // פונקציה לשמירת המשתמש
  const saveUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user)) // שמירת פרטי המשתמש
    localStorage.setItem("isLoggedIn", "true") // עדכון ה-LocalStorage
    setUser(user) // עדכון סטייט מיידית
    setIsLoggedIn(true) // סימון כמשתמש מחובר
  }

  // פונקציה להתנתקות (ניקוי המשתמש)
  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// הוק לשימוש בקונטקסט
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}