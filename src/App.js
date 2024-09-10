import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Spinner } from "react-bootstrap";
import CardError from "./components/cardError/CardError";
import CardSuccess from "./components/cardSuccess/CardSuccess";
import Header from "./components/header/Header";
function App() {
  const [responses, setResponses] = useState(null);

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

  console.log('userContext -> ', userContext?.signedRequest);
  console.log('instanceUrl -> ', userContext?.instanceUrl);
  console.log('window.Sfdc  -> ', window.Sfdc );


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
