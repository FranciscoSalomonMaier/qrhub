import { useEffect, useState } from "react";
import { api } from "./services/api";

function App() {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function testBackendConnection() {
            try {
                const { data } = await api.get("/health");

                setResponse(data);
            } catch (requestError) {
                console.error(requestError);

                setError(
                    requestError.response?.data?.message ??
                        requestError.message ??
                        "Não foi possível conectar ao backend."
                );
            } finally {
                setLoading(false);
            }
        }

        testBackendConnection();
    }, []);

    if (loading) {
        return <p>Testando conexão...</p>;
    }

    if (error) {
        return (
            <main>
                <h1>Erro na conexão</h1>
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Conexão funcionando</h1>

            <p>Status: {response.status}</p>
            <p>Mensagem: {response.message}</p>
            <p>Aplicação: {response.application}</p>
            <p>Horário: {response.timestamp}</p>
        </main>
    );
}

export default App;