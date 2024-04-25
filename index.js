import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import env from "dotenv";
import bcrypt from "bcrypt";


const port = 3000;
const app = express();
const saltRound=10;
env.config()
// connect to the database

const db = new pg.Client({
    user: process.env.PG_User,
    host: process.env.PG_Host,
    database: process.env.PG_db,
    password: process.env.postgred_password,
    port: process.env.port_num,
});
db.connect();

// middleware 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static("public"))


app.get("/login", (req, res) => {
    res.render("login.ejs")
 
});

app.get("/register", (req, res) => {
    res.render("register.ejs")
});
app.post("/register", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try {
        // Check if the user already exists in the database
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (checkResult.rows.length > 0) {
            // If user already exists, send a message indicating that the email is already in use
            return res.status(400).send("User with this email already exists.");
        } else {
            bcrypt.hash(password, saltRound, async(err, hash)=>{
                if (err){
                    console.log("Error hashing password",err)
                }else{
                    // to store the password to our db
                const result= await db.query(
                    "INSERT INTO users(email,password) VALUES ($1,$2)",
                    [email,hash]
                );
                console.log(result);
                res.send("You have sucessfully create a new account") 

                }
                
            })
        }
    } catch (error) {
        // Handle errors
        console.error("Error registering user:", error);
        return res.status(500).send("An error occurred while registering the user.");
    }
});

            


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [username]
        );
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (isPasswordCorrect) {
                res.send(`You are sucessfully login ${username}`)
            } else {
                res.status(401).send("Invalid username or password");
            }
        } else {
            res.status(401).send("Account does not exist");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("An error occurred while logging in.");
    }
});


app.get('/country',(req,res)=>{
    res.render("capital.ejs", { country: country });


})
app.get("/", (req, res) => {
    const email = req.body.username;
    res.send(`Hello ${email}`);
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
