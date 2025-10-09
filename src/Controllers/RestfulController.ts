

const BASE_URL = '/api/';
export class RestfulController{
    public registerRoutes(app: any) {
        app.get(BASE_URL + 'status', (req: any, res: any) => {
            res.status(200).send({ status: 'Servidor rodando' });
        });
        
    }
}