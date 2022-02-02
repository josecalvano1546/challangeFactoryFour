import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";

const CardSuccess = (Props) => {
  function getDate(time) {
    let date = new Date(time);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let setDate = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    return setDate;
  }
  return (
    <>
      <Card
        border="success"
        style={{
          width: "18rem",
          marginBottom: "2%",
          marginTop: "2%",
          marginRight: "1%",
        }}
      >
        <Card.Header style={{ backgroundColor: "white" }}>
          {Props.names[Props.index]}
        </Card.Header>
        <Card.Body>
          <Card.Title style={{ backgroundColor: "green" }}>Healthy</Card.Title>
          <Card.Text>
            Hostname:{" "}
            {Props.response.value.hostname.slice(
              Props.names[Props.index].length + 1
            )}
            <br />
            {getDate(Props.response.value.time)}
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
    </>
  );
};
export default CardSuccess;
