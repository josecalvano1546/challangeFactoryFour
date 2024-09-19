import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Spinner } from "react-bootstrap";
import CardError from "./components/cardError/CardError";
import CardSuccess from "./components/cardSuccess/CardSuccess";
import Header from "./components/header/Header";
function App() {
  const [responses, setResponses] = useState(null);

  const [salesforceData, setSalesforceData] = useState(null);
  const [error, setError] = useState(null);



  //Names of API_NAME
  let names = [
    "accounts",
    "assets",
    "customers",
    "datapoints",
    "devices",
    "documents",
    "forms",
    "invites",
    "media",
    "messages",
    "namespaces",
    "orders",
    "patients",
    "relationships",
    "rules",
    "templates",
    "users",
    "workflows",
  ];

  const getApi = () => {
    let requests = names.map((API_NAME) =>
      fetch(`https://api.factoryfour.com/${API_NAME}/health/status`).then(
        (res) => res.json()
      )
    );
    Promise.allSettled(requests).then((responses) => {
      // All request successful or not
      const res = responses.map((response) => {
        console.log(response.value);
        return response;
      });
      setResponses(res);
    });
  };

  useEffect(() => {
    getApi();
    setInterval(() => {
      getApi();
    }, 15000); //Time in ms (request the health status of each API every 15 seconds).
  }, []);

  const [userContext, setUserContext] = useState(null);
  
  useEffect(() => {
    // Espera a que la página esté cargada y luego obtiene la signed request
    window.Sfdc && window.Sfdc.canvas && window.Sfdc.canvas.client && window.Sfdc.canvas.client.autorun((args) => {
      // La información de la signed request está disponible en args
      const signedRequest = args.oauthToken;
      const instanceUrl = args.instanceUrl;

      // Puedes guardar estos valores en tu estado o localStorage para usarlos más adelante
      setUserContext({
        signedRequest,
        instanceUrl
      });

      // Ahora puedes hacer llamadas a las APIs de Salesforce utilizando este token y la URL
    });
  }, []);


  // Función para obtener parámetros de la URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window?.location?.search);
  return urlParams.get(param);
}

// Obtener el sessionId del parámetro de la URL
const sessionId = getQueryParam('sessionId');
const recordId = getQueryParam('recordId');

// Mostrar el sessionId en la consola
console.log('Session ID:', sessionId);
console.log('Record ID:', recordId);


  useEffect(() => {
    const fetchSalesforceData = async () => {
      if (!sessionId) return;

      try {
        console.log('se pide la data')
        const response = await fetch('https://empathetic-narwhal-ln8yzw-dev-ed.trailblaze.my.salesforce.com/services/data/v54.0/sobjects/Account', {
          headers: {
            'Authorization': `Bearer ${sessionId}`,
          },
        });

        if (!response.ok) {
          console.log('error')
          throw new Error(`Error en la petición: ${response.statusText}`);
        }

        const data = await response.json();
        setSalesforceData(data);
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      }
    };

    console.log('se pidio tode ', sessionId)
    fetchSalesforceData();
  }, [sessionId]);

  return (
    <div className="App">
      <Header />
      <Container fluid>
        <Row className="justify-content-md-center">
          {responses !== null ? (
            responses.map((response, index) =>
              response.status === "rejected" ? (
                <CardError index={index} names={names} />
              ) : (
                <CardSuccess index={index} names={names} response={response} />
              )
            )
          ) : (
            <Spinner
              animation="border"
              variant="primary"
              style={{ marginTop: "2%" }}
            />
          )}
        </Row>
      </Container>
    </div>
  );
}

export default App;
