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
