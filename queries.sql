CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  date_read DATE,
  rating INT CHECK (rating >=1 AND rating <=5),
  description TEXT
);

ALTER TABLE books RENAME 
COLUMN descrition TO description;
-- Update ratings to add a condition WHERE rating is more <1 or >5
UPDATE books SET rating = 1 WHERE rating < 1;
UPDATE books SET rating = 5 WHERE rating > 5;

-- update title TEXT to NOtT NULL
ALTER TABLE books
ALTER COLUMN title SET NOT NULL;

-- Make title NOT NULL (only works if no NULL titles currently exist)
ALTER TABLE books
  ALTER COLUMN title SET NOT NULL;

-- Add created_at column with default value
ALTER TABLE books
  ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add a new column called review to table called books
  ALTER TABLE books
ADD COLUMN review TEXT;

-- INSERT data into each column 
INSERT INTO books (author,title, date_read,rating)
VALUES ('Michiko Aoyama','What you are looking for is in the library', '2025-04-24', 10/10);

INSERT INTO books (author,title, date_read, rating)
VALUES ('Santa Montefiore', 'Shadows in the Moonlight', '2025-04-15',10);

INSERT INTO books (author,title, date_read, rating)
VALUES ('Sheila OFlannagan', 'The Woman on the bridge', '2025-04-18',9);

INSERT INTO books (author,title, date_read, rating)
VALUES ('Toshikaza Kawaguchi', 'Before the coffee gets cold', '2025-08-16',10);


INSERT INTO books (author,title, date_read, rating)
VALUES ('Sanaka Hiiragi', 'The Lantern of Lost Memories', '2025-08-10',10);

-- Add a review for each book based on the id 
UPDATE books
SET review = 'A lovely book, just the perfect book before bed. Each chapter is dedicated to a character who has lost their way in life.The librarian recommends books they need even ones they didnt know they needed, which you can check out yourself after you have enjoyed this lovely uplifting book.'
WHERE id = 1;

UPDATE books
SET review = 'Could not put this book down, this was one mystery that had more twists and turns than a racetrack. If you love romance and mystery with a splash of the spiritual and pyshic themes. Then this is the book for you. '
WHERE id = 2;

UPDATE books
SET review = 'Lovely book based on the real-life events the authors grandparents went through when they met during the time in the war of the Irish independence. Makes you emphasis with the characters and think about your own ancesters expereince at that time.'
WHERE id = 3;

UPDATE books
SET review = 'Received this book as a gift, read on holiday and really enjoyed it. Lovely read, each chapter is dedicated to each character and their reason for going back in time, be it grief or regret. The stories really stuck with me, was pleased when I discovered the author has sequels.'
WHERE id = 4;

UPDATE books
SET review = 'A beautiful illustrated book translated from Japanese.Bought has a gift for my Mum and she enjoyed as well. Beautifully written. Pulls at your heartstrings.'
WHERE id = 5;

-- Add content to isbn column
UPDATE books
SET isbn = 9780369742018
WHERE id = 1;

UPDATE books
SET isbn = 9781398720022
WHERE id = 2;

UPDATE books
SET isbn = 1035402793
WHERE id = 3;

UPDATE books
SET isbn = 1529029589
WHERE id = 4;

UPDATE books
SET isbn = 1538757435
WHERE id = 5;

UPDATE books
SET isbn = 9780241425459
WHERE ID = 6;

UPDATE books
SET isbn = 1529089433
WHERE id = 8;


