export type Recipe = {
    Id?: number; 
    Name: string; 
    Instructions :Instructions[], 
    Difficulty: string;
    Duration: number; 
    Description: string; 
    UserId: number; 
    CategoryId: number; 
    Img: string; 
    Ingridents: Ingridents[]; 
};
export type Instructions={
    Name:string;
}

export type Ingridents = {
    Name: string; 
    Count: string;
    Type: string; 
};

export type Category={
    Id:number;
    Name:string
}