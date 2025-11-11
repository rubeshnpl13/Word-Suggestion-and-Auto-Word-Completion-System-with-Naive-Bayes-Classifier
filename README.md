# Word Suggestions API (Project report on github repo)

A Node.js backend that provides predictive word suggestions using a Naive Bayes classifier that learns and adapts over time.

---

## ## Prerequisites

Before you begin, ensure you have the following software installed on your local machine.

1.  **Node.js (via nvm)**
    - This project requires a specific version of Node.js. It is highly recommended to use [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) to manage Node versions and avoid compatibility issues.

2.  **MongoDB**
    - The application requires a running MongoDB database instance. Please [install MongoDB Community Edition](https://www.mongodb.com/try/download/community) and ensure the database service is running on the default port (`27017`).

3.  **Git**
    - You will need [Git](https://git-scm.com/downloads) to clone the repository.

---

## ## Getting Started

Follow these steps to get your development environment set up and running.

1.  **Clone the Repository**
    - Open your terminal and clone the project from GitHub.
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    ```

2.  **Navigate to the Project Directory**
    ```bash
    cd your-repository-name
    ```

3.  **Set the Correct Node.js Version**
    - Use `nvm` to install and use the Long-Term Support (LTS) version of Node, which is what this project uses.
    ```bash
    nvm install --lts
    nvm use --lts
    ```
    - **Pro-Tip:** You can create a file named `.nvmrc` in the project root with the node version (e.g., `lts/iron`) so that you can just run `nvm use` in the future.

4.  **Install Dependencies**
    - Install all the required `npm` packages defined in the `package.json` file.
    ```bash
    npm install
    ```

---

## ## Environment Variables (.env)
Create a .env file in the project root before running the server. You can copy from a provided example if available.

Create from template
If .env.example exists:
cp .env.example .env
Required keys and examples
PORT=3000
DATABASE_URL=mongodb://127.0.0.1:27017/word-suggestion
ACCESS_TOKEN_SECRET=replace-with-a-long-random-string
REFRESH_TOKEN_SECRET=replace-with-another-long-random-string
DEFAULT_PASSWORD=optional-default-password

## ## Running the Application

1.  **Start the Development Server**
    - This command will start the server using `nodemon`, which automatically restarts the application whenever file changes are detected.
    ```bash
    npm run dev
    ```

2.  **Verify the Server is Running**
    - Once the server starts, you should see the following confirmation messages in your terminal:
    ```
    Server running on port 3000
    MongoDB Connected: 127.0.0.1
    ```
    - The API is now ready to accept requests at `http://localhost:3000`.

---

## ## API Endpoints

Here is a list of the available API endpoints.

| Method | Endpoint        | Description                          |
| :----- | :-------------- | :----------------------------------- |
| `GET`  | `/api/words`    | Fetches a list of all words.         |
| `POST` | `/api/words`    | Adds a new word to the database.     |
| `GET`  | `/api/words/:id`| Fetches a single word by its ID.   |

*(**Note:** This is an example. Update this table with your actual API endpoints.)*

---

## ## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **Nodemon**: Utility for auto-restarting the server during development.

