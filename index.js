const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const crypto = require("crypto");
const uniqueId = crypto.randomBytes(16).toString("hex");
const { users, posts, comments } = require("./data");


const typeDefs = gql`

#user
  type User {
    id: ID!
    fullName: String!
    age:Int!
    posts: [Post!]!
    comments: [Comment!]!
  }
  
input CreateUserInput {
    fullName:String!
    age:Int!

}

input UpdateUserInput {
    fullName:String
    age:Int
}

#post
  type Post {
    id: ID!
    title: String!
    user_id: ID!
    user: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    post_id: ID!
    user: User!
    post: Post!
  }

  type Query {
    # user
    users: [User!]!
    user(id: ID!): User!

    # post
    posts: [Post!]!
    post(id: ID!): Post!

    # comment
    comments: [Comment!]!
    comment(id: ID!): Comment!
  }

  type Mutation {
    #user
    createUser(data:CreateUserInput!): User!
    updateUser(id:ID!,data:UpdateUserInput!):User!


    createPost(title:String!,user_id:ID!):Post!
  }
`;

const resolvers = {
  Query: {
    //!user
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id),

    //!post
    posts: () => posts,
    post: (parent, args) => posts.find((post) => post.id === args.id),

    //!comment
    comments: () => comments,
    comment: (parent, args) =>
      comments.find((comment) => comment.id === args.id),
  },

  User: {
    posts: (parent) => posts.filter((post) => post.user_id === parent.id),
    comments: (parent) =>
      comments.filter((comment) => comment._id === parent.id),
  },

  Post: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    comments: (parent) =>
      comments.filter((comment) => comment.post_id === parent.id),
  },
  Comment: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    post: (parent) => posts.find((post) => post.id === parent.post_id),
  },
  Mutation: {
    createUser: (parent,{data}) => {
      const user = {
        id: uniqueId,
        fullName: data.fullName,
      };
      users.push(user);
      return user;
    },
    updateUser:(parent,{id,data})=>{
        const user_index = users.findIndex((user)=>user.id === id)
        if(user_index === -1){
            throw new Error('user not found!')
        }
    
       const updated_user = users[user_index] = {
        ...users[user_index],...data
       }
        return updated_user
    },
    createPost: (parent,{title ,user_id}) => {
    const post={
        id:uniqueId,
        title,
        user_id
}
    posts.push(post)
    return post
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
