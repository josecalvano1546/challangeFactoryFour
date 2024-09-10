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


  // Función para obtener parámetros de la URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window?.location?.search);
  return urlParams.get(param);
}

// Obtener el sessionId del parámetro de la URL
const sessionId = getQueryParam('sessionId');

// Mostrar el sessionId en la consola
console.log('Session ID:', sessionId);

  console.log('userContext -> ', userContext?.signedRequest);
  console.log('instanceUrl -> ', userContext?.instanceUrl);
  console.log('window.Sfdc  -> ', window.Sfdc );



useEffect(()=>{
    const clientId = '2955C56B48DF25AF97E3ACCE1BD2A255B0744F0D45E5AD33557CF7C5FAB86511';
const clientSecret = '3MVG91oqviqJKoEHAFhzv1IH9ArP.CAzKt6pvrvtHzcCb1n9wgOJVPRqnfCXMM76fXvjVPIwaOgMuls7hCs9A';
const authUrl = 'https://login.salesforce.com/services/oauth2/token';

console.log('--> se empieza a pedir cosas ');
async function getAccessToken() {
    const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': clientId,
            'client_secret': clientSecret
        })
    });

    if (!response.ok) {
        throw new Error('Error fetching access token');
    }

    const data = await response.json();
    return data.access_token;
}

// Usar el access token para realizar llamadas a la API REST
getAccessToken().then(accessToken => {
    console.log('Access Token:', accessToken);

    // Usar el access token para llamar a la API REST
    fetch('https://empathetic-narwhal-ln8yzw-dev-ed.trailblaze.my.salesforce.com/services/data/v57.0/sobjects/User/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log('User data:', data))
    .catch(error => console.error('Error:', error));
});


  },[])
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
