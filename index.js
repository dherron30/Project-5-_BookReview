import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv'; 
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL;

const db = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.stack);
    process.exit(1);
  });


// Set EJS as the view engine
app.set('view engine', 'ejs');

//Serve static files from the 'public' directory
app.use(express.static("public"));

app.use(express.json()); // Built-in middleware to parse JSON
app.use(express.urlencoded({ extended: true })); // Built-in middleware to parse URL-encoded data


//JSON 
let books = [
    {id: 1, author: "Michiko Aoyama", title:"What you are looking for is in the library", date_read: "2025-04-24", rating: 10},
    {id: 2, author: "Santa Montefiore", title:"Shadows in the Moonlight", date_read: "2025-04-15",rating: 10},
    {id: 3, author: "Sheila OFlannagan", title:"The Woman on the bridge", date_read: "2025-04-18", rating: 9},
];

app.get("/", (req, res) => res.send("App is running!"));

app.get("/books", async (req,res) => {
    try {
        const result = await db.query("SELECT * FROM books ORDER BY id ASC ");
        const books = result.rows;

        if (books.length === 0) {
            return res.status(404).json({message: "No books found"});
        }

        res.render("index.ejs", { books });
    } catch (err){
        console.log(err);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// Route for the About page
app.get("/about", (req,res) => {
    res.render("about.ejs");
});

// User clicks on read my review and it takes the user to the review using my DB
app.get("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try{
    const result = await db.query(
        "SELECT * FROM books WHERE id = $1",
        [bookId]
    );
    const book = result.rows[0];

    if (!book){
        return res.status(404).send("Book not found");
    }

    res.render("review", { book });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


// Dynamic route to show review for a given book ID
app.get('/books/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [bookId]);
    const book = result.rows[0];
    if (!book) return res.status(404).render('not-found', { id: bookId });

    res.render('review', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET: Render blog page
app.get("/blog", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY date_read DESC");
    res.render("blog.ejs", { posts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading blog");
  }
});

// POST: Add a new book review
app.post("/books", async (req, res) => {
  const { author, title, date_read, rating, description } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO books (author, title, date_read, rating, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [author, title, date_read, rating, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting book:", err);
    if (err.code === "23505") {
      res.status(409).json({ error: "Book already exists" });
    } else {
      res.status(500).json({ error: "Failed to add book" });
    }
  }
});

// PUT: Update a book review by ID
app.put("/books/:id", async (req, res) => {
  const id = req.params.id;
  const { author, title, date_read, rating, description } = req.body;

  try {
    const result = await db.query(
      "UPDATE books SET author = $1, title = $2, date_read = $3, rating = $4, description = $5 WHERE id = $6 RETURNING *",
      [author, title, date_read, rating, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update book" });
  }
});

// DELETE: Delete a book review by ID
app.delete("/books/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    //res.redirect("/blog"); // redirect after delete
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete book" });
  }
});


// Listening and connecting to port 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});