# Teacher & Student Registration — Setup Guide (Baby Steps)

## Folder Structure
```
project/
├── server.js
├── package.json
├── schema/
│   ├── teacherSchema.js
│   └── studentSchema.js
├── model/
│   ├── teacherModel.js
│   └── studentModel.js
└── router/
    ├── teacherRouter.js
    └── studentRouter.js
```

## Step 1: Install MongoDB Community Server (if not already installed)
You already have **MongoDB Compass** (the GUI) installed. Compass alone is just a viewer —
you also need the actual MongoDB **server** (`mongod`) running in the background for your
app to connect to.

- Download MongoDB Community Server: https://www.mongodb.com/try/download/community
- Install it, then make sure the MongoDB service is running:
  - **Mac (via Homebrew, easiest):**
    ```bash
    brew tap mongodb/brew
    brew install mongodb-community
    brew services start mongodb-community
    ```
  - This starts MongoDB in the background at `mongodb://127.0.0.1:27017`

**Alternative — MongoDB Atlas (cloud, no local install):**
If you'd rather not install anything locally, create a free cluster at
https://www.mongodb.com/cloud/atlas and use the connection string it gives you
(looks like `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/`).
Just paste that into `MONGO_URI` in `server.js` instead of the local one.

## Step 2: Install project dependencies
```bash
npm install
```

## Step 3: Run the server
```bash
node server.js
```
You should see:
```
✅ MongoDB connected successfully!
🚀 Server running on http://localhost:3000
```
📸 **Screenshot #1: successful MongoDB connection** — take it here.

## Step 4: Test Teacher Registration
**POST** `http://localhost:3000/teacher/register`
```json
{
  "name": "Anjali Patil",
  "email": "anjali@school.com",
  "password": "secret123",
  "subject": "Mathematics"
}
```
Use Postman/Thunder Client. Expect `201 Created` with a success message.
📸 **Screenshot #2: teacher registration in Postman** — take it here.

## Step 5: Test Student Registration
**POST** `http://localhost:3000/student/register`
```json
{
  "name": "Riya Sharma",
  "email": "riya@student.com",
  "password": "pass1234",
  "course": "Computer Science",
  "age": 21
}
```
Expect `201 Created` with a success message.
📸 **Screenshot #3: student registration in Postman** — take it here.

## Step 6: Verify in MongoDB Compass
1. Open MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017` (or your Atlas connection string)
3. Open the `teacherStudentDB` database
4. You'll see two collections: `teachers` and `students`
5. Click into each — you'll see the registered documents
📸 **Screenshot #4: teacher data in MongoDB** — take it here.
📸 **Screenshot #5: student data in MongoDB** — take it here.
📸 **Screenshot #6: passwords stored in hashed form** — zoom into the `password` field in
either document; it should look like a long scrambled string starting with `$2b$10$...`
(that's bcrypt's hash format) — NOT the plain text password you typed.

## Step 7: Test validation errors (optional but good to confirm)
Try registering with missing/invalid fields, e.g.:
```json
{ "name": "A", "email": "not-an-email", "password": "123" }
```
You should get a `400` response listing every validation error.

## How password hashing works here
When a valid registration request comes in, **before** saving to MongoDB, the router does:
```js
const hashedPassword = await bcrypt.hash(password, 10);
```
`10` is the "salt rounds" — how many times bcrypt scrambles the password. The database
only ever stores `hashedPassword`, never the original plain-text password. This means
even if someone got access to your database, they couldn't read anyone's actual password.
