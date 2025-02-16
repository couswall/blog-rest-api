import express, { Router } from 'express';
import { Server as HttpServer } from 'http';

interface Options {
    port: number;
    publicPath: string;
    routes: Router;
}

export class Server {
    public readonly app = express();
    private readonly port: number;
    private serverListener?: HttpServer;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options){
        const {port,publicPath, routes} = options;
        
        this.port = port;
        this.publicPath = publicPath;
        this.routes = routes;
    };

    async start(){
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));

        this.app.use(express.static(this.publicPath));

        this.app.use(this.routes);

        this.serverListener = this.app.listen(this.port, () =>{
            console.log(`Server running on port ${this.port}`)
        });
    };

    public close(){
        this.serverListener?.close();
    }
}