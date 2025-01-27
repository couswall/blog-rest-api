import express, { Router } from 'express';

interface Options {
    port: number;
    publicPath: string;
    routes: Router;
}

export class Server {
    private readonly app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options){
        const {port,publicPath, routes} = options;
        
        this.port = port;
        this.publicPath = publicPath;
        this.routes = routes;
    };

    async start(){
        
        this.app.use(express.static(this.publicPath));

        this.app.use(this.routes);

        this.app.listen(this.port, () =>{
            console.log(`Server running on port ${this.port}`)
        });
    }
}