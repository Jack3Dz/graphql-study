const express = require('express');
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const { getProducts, addProduct } = require("./data/products");
const { getPeople, addPerson } = require("./data/person");

const cors = require("cors");

var schema = buildSchema(`
    type Product {
        name: String,
        id: Int
    },
    type Person {
        id: Int,
        name: String
    },
    input PersonInput {
        name: String
    },
    type Query {
        hello: String,
        products: [Product],
        people: [Person],
        product(id: Int!): Product,
        rollDice(numDice: Int!, numSides: Int): [Int],
    },
    type Mutation {
        createProduct(name: String!, description: String!): String,
        createPerson(person: PersonInput!): String
    }
`);

const throwDice = (numDice, numSides) => {
    const dices = [];
    for (var i = 0; i < numDice; i++) {
        const dice = Math.floor(numSides * Math.random());
        dices.push(dice);
    }
    return dices;
}

var root = {
    hello: () => {
        return "Hello world!";
    },
    rollDice: args => {
        const { numDice, numSides } = args;
        console.log("args", args);
        return throwDice(numDice, numSides);
    },
    products: () => {
        return getProducts();
    },
    product: ({ id }) => {
        const products = getProducts();
        return products.find(p => p.id === id);
    },
    createProduct: args => {
        const { name, description } = args;
        const newProduct = addProduct(name, description);
        return `Created: ${newProduct.id} ${newProduct.name} - ${
            newProduct.description
        }`;
    },
    people: () => {
        return getPeople();
    },
    createPerson: args => {
        const { person } = args;
        return addPerson(person);
    }
}

const app = express();
const port = 3000;

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
)

app.listen(port, () => console.log(`App listening on ${port} port!`));