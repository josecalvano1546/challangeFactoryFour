import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";

const CardError = (Props) => {
  return (
    <>
      <Card
        border="danger"
        style={{ width: "18rem", marginBottom: "2%", marginTop: "2%" }}
      >
        <Card.Header style={{ backgroundColor: "white" }}>
          {Props.names[Props.index]}
        </Card.Header>
        <Card.Body>
          <Card.Title style={{ backgroundColor: "red" }}>Error</Card.Title>
          <Card.Text>
            <br />
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
    </>
  );
};
export default CardError;
