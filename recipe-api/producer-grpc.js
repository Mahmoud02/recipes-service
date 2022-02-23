import grpc from "@grpc/grpc-js" ;
import loader from "@grpc/proto-loader" ;
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pkg_def = loader.loadSync(__dirname +
    '/../shared/grpc-recipe.proto');
const recipe = grpc.loadPackageDefinition(pkg_def).recipe;

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const server = new grpc.Server();

server.addService(recipe.RecipeService.service, {
    getMetaData: (_call, cb) => {
        cb(null, {
            pid: process.pid,
        });
    },
    getRecipe: (call, cb) => {
        if (call.request.id !== 42) {
            return cb(new Error(`unknown recipe ${call.request.id}`));
        }
        cb(null, {
            id: 42, name: "Chicken Barbecue",
            steps: "Throw it in a pot...",
            ingredients: [
                { id: 1, name: "Chicken", quantity: "1 lb", },
                { id: 2, name: "Sauce", quantity: "2 cups", }
            ]
        });
    },
});

server.bindAsync(`${HOST}:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) throw err;
        server.start();
        console.log(`Producer running at http://${HOST}:${port}/`);
});
