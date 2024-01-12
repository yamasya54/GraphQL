const { ApolloServer, gql } = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require("apollo-server-core");

const typeDefs = gql`
type User {
    name: String!
    surname:String!
    age:Int
}

type Query {
    user : User
}
`;

const resolvers = {
    Query :{
        user: () => ({name:"yavuz",surname:"amsya",age:37})
    }
};

const server = new ApolloServer({ typeDefs, resolvers,plugins:[ApolloServerPluginLandingPageGraphQLPlayground({})] });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});