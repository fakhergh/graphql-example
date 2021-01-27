const { ApolloServer } = require("apollo-server-express");
const express = require("express");

const port = 4000;

const expressApp = express();

const users = [
  { id: 1, username: "hamdi" },
  { id: 2, username: "fakher" },
  { id: 3, username: "ala" },
];

const posts = [
  { id: 1, body: "hello world", userId: 1 },
  { id: 2, body: "hello world", userId: 2 },
  { id: 3, body: "hello world", userId: 3 },
];

const apolloServer = new ApolloServer({
  typeDefs: `
    type Query {
        getUsers: [User!]!
        getPosts(date: String!): [Post!]!
        getUserById(id: ID!): User
        getPostById(id: ID!): Post
    }
  
    type Mutation {
        addUser(username:String!): User!
        createPost(input: CreatePostInput!): Post!
    }
  
    type User {
        id: ID!
        username: String!
        posts: [Post!]!
    }
    
    type Post {
        id: ID!
        body: String!
        user: User!
    }
    
    input CreatePostInput {
      userId: ID!
      body:String!
    }
  `,
  resolvers: {
    Query: {
      getUsers: () => {
        return users;
      },
      getPosts: (_, { date }) => {
        return posts;
      },
      getUserById: (parent, args) => {
        const { id } = args;

        return users.find((user) => user.id == id);
      },
      getPostById: (parent, args) => {
        const { id } = args;

        return posts.find((post) => post.id == id);
      },
    },
    Mutation: {
      addUser: (parent, args, context, info) => {
        const user = { id: Date.now(), username: args.username };

        users.push(user);

        return user;
      },
      createPost: (parent, args) => {
        const { userId, body } = args.input;
        const post = { id: Date.now(), userId, body };

        posts.push(post);

        return post;
      },
    },
    User: {
      posts: (parent) => {
        return posts.filter((post) => post.userId == parent.id);
      },
    },
    Post: {
      user: (parent) => {
        return users.find((user) => user.id == parent.userId);
      },
    },
  },
});

apolloServer.applyMiddleware({ app: expressApp });

expressApp
  .listen(port)
  .on("listening", () => console.log(`Server is listening at port ${port}`));
