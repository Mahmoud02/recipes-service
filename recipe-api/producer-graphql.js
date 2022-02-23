// Require the framework and instantiate it
import server from "fastify" ;
import graphql from "fastify-gql" ;
import fs from "fs" ;
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = server()

console.log(__dirname)
const schema = fs.readFileSync(__dirname +
    '/../shared/graphql-schema.gql').toString();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;

const resolvers = {
    Query: {
        pid: () => process.pid,
        recipe: async (_obj, {id}) => {
            if (id != 42) throw new Error(`recipe ${id} not found`);
            return {
                id, name: "Chicken Tikka Masala",
                steps: "Throw it in a pot...",
            }
        }
    },
    Recipe: {
        ingredients: async (obj) => {
            return (obj.id != 42) ? [] : [
                { id: 1, name: "Chicken", quantity: "1 lb", },
                { id: 2, name: "Sauce", quantity: "2 cups", }
            ]
        }
    }
};

app
    .register(graphql, { schema, resolvers, graphiql: true })
    .listen(PORT, HOST, () => {
        console.log(`Producer running at http://${HOST}:${PORT}/graphql`);
    });
