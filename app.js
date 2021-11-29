const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
let db = null;
const format = require("date-fns/format");
const getMonth = require("date-fns/getMonth");
const dbPath = path.join(__dirname, "todoApplication.db");
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(8000, () =>
      console.log("Server Running at http://localhost:8000")
    );
  } catch (error) {
    console.log(`DB error ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
const hasPriorityValue = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusValue = (requestQuery) => {
  return requestQuery.status !== undefined;
};
const hasCategoryValue = (requestQuery) => {
  return requestQuery.category !== undefined;
};
const hasPriorityAndStatus = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndPriorityValues = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};
const hasCategoryAndStatusValues = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

//API -1
app.get("/todos/", async (request, response) => {
  let data = null;
  let requestTodoQuery = "";
  const { search_q = "", priority, status, category } = request.query;
  switch (true) {
    case hasStatusValue(request.query):
      requestTodoQuery = `
            SELECT * FROM todo 
            WHERE 
                    todo LIKE '%${search_q}%'AND
                    status = '${status}'`;
      break;
    case hasPriorityValue(request.priority):
      requestTodoQuery = `
                SELECT * FROM todo 
                WHERE 
                    todo LIKE '%${search_q}%'AND
                    priority='${priority}';`;
      break;
    case hasPriorityAndStatus(request.query):
      requestTodoQuery = `
            SELECT * 
            FROM 
            todo 
            WHERE 
                    todo LIKE '%${search_q}%'
                    AND priority='${priority}'AND
                    status = '${status}'`;
      break;
    case hasCategoryAndPriorityValues(request.query):
      requestTodoQuery = `
            SELECT * 
            FROM 
            todo 
            WHERE 
                    todo LIKE '%${search_q}%'
                    AND priority='${priority}'AND
                    category = '${category}'`;
      break;
    case hasCategoryAndStatusValues(request.query):
      requestTodoQuery = `
            SELECT * 
            FROM 
            todo 
            WHERE 
                    todo LIKE '%${search_q}%'
                    AND category='${category}'AND
                    status = '${status}'`;
      break;
    case hasCategoryValue(request.query):
      requestTodoQuery = requestTodoQuery = `
            SELECT * 
            FROM 
            todo 
            WHERE 
                    todo LIKE '%${search_q}%'
                    AND category = '${category}'`;
      break;
    default:
      requestTodoQuery = `
            SELECT * FROM todo 
            WHERE 
            todo LIKE '%${search_q}%';`;
  }
  data = await db.all(requestTodoQuery);
  response.send(data);
});
module.exports = app;
