interface Options {
    port: number;
    publicPath: string;
}

export class Server {
    private readonly port: number;
    private readonly publicPath: string;

    constructor(options: Options){
        const {port,publicPath} = options;
        
        this.port = port;
        this.publicPath = publicPath;
    };

    async start(){
        console.log(`server running on port ${this.port}`);
    }
}