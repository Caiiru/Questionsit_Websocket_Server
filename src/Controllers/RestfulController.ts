import axios from "axios";


const BASE_URL_REST = 'http://localhost:8080/api';
export class RestfulController {

    async Connect() {
        // Implementar conexões RESTful aqui
        try {
            const response = await axios.get(`${BASE_URL_REST}/healthcheck`);

            console.log("Conexão restful estabelecida:", response.data);

            return true;
        } catch (error) {
            console.error("Erro ao conectar com o serviço RESTful:", error);

            return false;
        }
    }
}
