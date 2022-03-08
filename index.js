const express = require("express")
const {graphqlHTTP} = require("express-graphql")
const {buildSchema} = require("graphql");
const axios =  require("axios");

const app = express()

let msg = "initial message";

const schema = buildSchema(`

    type User {
        username: String,
        role: String,
        token: String
    }

    type Post {
        userId: ID,
        id: ID,
        title: String,
        body: String
    }

    type Query {
        hello: String,
        welcome(name:String): String,
        getUser(username: String): User,
        getUsers:[User]
        fetchPosts: [Post]
        getMessage: String
    }

    type Mutation {
        setMessage(message: String!): String
    }
`)

const root = {
    hello: () => "hello from mike",
    welcome: (args) => `${args.name}`,
    getUser: (args) => {
        return {
            username: `${args.username}`, 
            role: "admin", 
            token: "jniuhwefiuyrehq8euwhir"
        }
    },
    getUsers: () => {
        const letUsers = []
        for(i=0;i<=3;i++) {
            letUsers.push({
                username: `${"sam"}`, 
                role: "admin", 
                token: "jniuhwefiuyrehq8euwhir"
            })
        }

        return letUsers;
    },
    fetchPosts: async () => {
        return axios.get("https://jsonplaceholder.typicode.com/posts").then(res => {
            return res.data;
        })
    },
    getMessage: () => {
        return msg;
    },
    setMessage: (args) => {
        msg = args.message
        return "message set successfully!";
    }
}

app.use("/graphql", graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root
}))
app.listen(8000, console.log("server started on port 8000"))