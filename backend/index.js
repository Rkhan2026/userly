const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

//json
app.use(express.json());

//CORS (Cross-Origin Resource Sharing)
    //This code is typically used during development when the client (frontend) and server (backend) 
    //are hosted on different origins (e.g., localhost:3000 and localhost:5000). 
    //However, in production, it is safer to replace * with a list of trusted origins.

//When a web application hosted on one domain (e.g., https://example.com) makes a 
//request to a server on a different domain (e.g., https://api.example.com), the 
//browser enforces same-origin policy restrictions. These restrictions block cross-origin 
//requests unless the server explicitly allows them.
//The provided middleware configures the server to respond with headers that 
//relax these restrictions, allowing cross-origin requests.

app.use((req, res, next) => {
    //This defines a middleware function in the Express.js app 
    // (pp is assumed to be an Express instance). The middleware intercepts all 
    // incoming requests before they are processed by the routes.

  res.setHeader('Access-Control-Allow-Origin', '*');
  //This sets the Access-Control-Allow-Origin header, which specifies which origins are 
  //allowed to make requests. 
  //The value * means any origin can access the resource.

  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
    //This header specifies the HTTP methods allowed for cross-origin requests. In this 
    // case, the server permits 
    // GET, POST, PUT, and DELETE requests from any origin

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    //This header specifies which custom headers can be sent in the request. For 
    // example, if the client sends a request with a Content-Type: application/json header, 
    // the server allows it.

  next();
  //The next() function passes control to the next middleware or route handler. 
  // Without this, the server would hang, as 
  //the middleware would not pass the request down the chain.
});


//test api to check that it is connected using tools like Postman 
//GET or open localhost:4000/test on browser
app.get('/test', (req, res) => {
  try {
    res.status(200).json({ message: 'API is working' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();//.user is the user model in schema.prisma
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get user by id
app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//create user
app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update user
app.put('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
        email: req.body.email
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));