const { GetRecipeDb, AddRecipyDB, EditRecipyDb, DeleteDb, GetRecipesDb } = require("../reposetory/recipe");

const GetAllRecipe = (_req, res) => {
    GetRecipesDb()
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })
}

const GetRecipe = (req, res) => {
    const { Id } = req.params;
    GetRecipeDb(Id)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors && err.errors.length > 0) {
                console.log(err.errors[0].message);
                return res.status(400).send(err.errors[0].message);
            } else {
                console.error("שגיאה כללית:", err.message || err);
                return res.status(400).send(err.message || "שגיאה כללית");
            }
        });
        
}

const AddRecipy = (req, res) => {
    console.log("📦 נתונים שהתקבלו:", req.body);
    console.log("ccc: ",req.body.CategoryId);
    const {
        Name, UserId, CategoryId, Img, Duration, Difficulty, Description,
        Ingridents, Instructions } = req.body;
    console.log(req);
    if (!Name || !UserId || !CategoryId || !Img || !Duration || !Difficulty || !Description || !Ingridents || !Instructions) {
        // לא נשלח מידע
        console.log("on ADDRECIPE ");
        return res.status(400).send('המידע שנשלח לא תקין')
    };

    const newRecipe = {
        Name, UserId, CategoryId, Img, Duration, Difficulty, Description,
        Ingridents, Instructions
    };
    AddRecipyDB(newRecipe)
        .then(x => res.send(x))
        //שינתי פה את הקטש
        .catch(err => {
            if (err?.errors && err.errors.length > 0) {
                console.log(err.errors[0].message);
                return res.status(400).send(err.errors[0].message);
            }
        
            console.error("שגיאה כללית:", err.message || err);
            return res.status(400).send(err.message || "שגיאה לא ידועה");
        });
}

const EditRecipy = (req, res) => {
    const { Id,
        Name, UserId, CategoryId, Img, Duration, Difficulty, Description,
        Ingridents, Instructions } = req.body;

    if (!Id || !Name || !UserId || !CategoryId || !Img || !Duration || !Difficulty || !Description || !Ingridents || !Instructions) {
        // לא נשלח מידע
        return res.status(400).send('המידע שנשלח לא תקין')
    };

    const updateRecipe = {
        Id, Name, CategoryId, Img, Duration, Difficulty,
        Description, Ingridents, Instructions
    };
    EditRecipyDb(updateRecipe)
        .then(x => res.send(x))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })

}

const Delete = (req, res) => {
    const { Id } = req.params;
    DeleteDb(Id)
        .then(_ => res.send('ok'))
        .catch(err => {
            if (err?.errors[0]) {
                return res.status(400).send(err?.errors[0]?.message)
            }
            return res.status(400).send(err)

        })

}

module.exports = { Delete, EditRecipy, AddRecipy, GetAllRecipe, GetRecipe };