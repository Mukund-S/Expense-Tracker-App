# Expense Management System

## Project Description:

The purpose of this project report is to implement expense tracker which is a web application offering a user-friendly platform for efficient expense management. Users can track expenses, set budgets, and analyze spending habits through categorized expenses, budget limits, and insightful reports, facilitating better financial control.

## Collections

- User (name, email, password, country)
- Transactions (title, amount, category, description, transactionType, date, user)
- Budget (food, utility, grocery, user_id)
- Roles (role, user_id)
- Groups (group_name, group_members, user)
- Location (country, currency)
- Feedback (review, rating, user_id)

## Technical Architecture:

- Frontend:

  Utilize React.js for building the user interface, tsparticle library for awesome background effect and used other libraries like unique-names-generator, react-datepicker, moment

- Backend:

  Use Node.js and Express.js to build a RESTful API for handling client requests and serving as the application's backend.

- Database:

  Store all data, including user information, expense entries, and categories, in MongoDB, a NoSQL database.

## Run Locally

```bash
  cd Expense-Tracker-App
```

Go to the frontend directory and Install dependencies

```bash
  cd frontend
```

```bash
  npm install
```

Go to the backend directory and Install dependencies

```bash
  cd backend
```

```bash
  npm install
```

Start the frontend server

```bash
  npm start
```

Start the backend server

```bash
  npm run dev
```

