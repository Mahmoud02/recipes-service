import util from "util" ;
import grpc from "@grpc/grpc-js" ;
import loader from "@grpc/proto-loader" ;
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import server from "fastify" ;

// Require the framework and instantiate it
const app = server()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkg_def = loader.loadSync(__dirname +
    '/../shared/grpc-recipe.proto');
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;

const HOST = '127.0.0.1';
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';

const client = new recipe.RecipeService(
    TARGET,
    grpc.credentials.createInsecure()
);
const getMetaData = util.promisify(client.getMetaData.bind(client));
const getRecipe = util.promisify(client.getRecipe.bind(client));

app.get('/', async () => {
    const [meta, recipe] = await Promise.all([
        getMetaData({}),
        getRecipe({id: 42}),
    ]);

    return {
        consumer_pid: process.pid,
        producer_data: meta,
        recipe
    };
});

app.listen(PORT, HOST, () => {
    console.log(`Consumer running at http://${HOST}:${PORT}/`);
});
