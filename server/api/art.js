// Importing Express
const express = require("express");
const apiRouter = express.Router();


// Get all art pieces: 
apiRouter.get("/api/products", async (req, res, next) => {
        try {
          res.send(await fetchProducts());
        } catch (ex) {
          next(ex);
        }
      });

// Get art piece details:
// This put has the correct path set up
// Change an employee's details
app.put("/api/employees/:id", async (req, res, next) => {
  try {
    const SQL = `
        UPDATE employees
        SET name = $1, department_id = (SELECT id from departments WHERE name=$2), updated_at = now()
        WHERE id = $3
        RETURNING *
      `;
    const response = await client.query(SQL, [
      req.body.name,
      req.body.department,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});