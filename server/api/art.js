// Get all art pieces: 
app.get("/api/products", async (req, res, next) => {
        try {
          res.send(await fetchProducts());
        } catch (ex) {
          next(ex);
        }
      });