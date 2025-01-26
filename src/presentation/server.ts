import express from 'express';

interface Options {
    port: number;
    publicPath: string;
}

export class Server {
    private readonly app = express();
    private readonly port: number;
    private readonly publicPath: string;

    constructor(options: Options){
        const {port,publicPath} = options;
        
        this.port = port;
        this.publicPath = publicPath;
    };

    async start(){
        
        this.app.use(express.static(this.publicPath));

        this.app.listen(this.port, () =>{
            console.log(`Server running on port ${this.port}`)
        });
    }
}