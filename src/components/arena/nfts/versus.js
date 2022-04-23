import { Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import Nft from "./Card";

const Versus = ({ nft1, nft2 }) => {
  return (
    <Row>
      <Col xs={5}>
        <Nft
          key={nft1.index}
          nft={{
            ...nft1,
          }}
        />
      </Col>
      <Col
        xs={2}
        className="d-flex align-items-center justify-content-center fw-bold text-uppercase fs-3 text-warning"
      >
        vs
      </Col>
      <Col xs={5}>
        {nft2 ? (
          <Nft
            key={nft2.index}
            nft={{
              ...nft2,
            }}
          />
        ) : (
          <div className="bg-dark bg-gradient h-100"></div>
        )}
      </Col>
    </Row>
  );
};

Versus.propTypes = {
  nft1: PropTypes.instanceOf(Object).isRequired,
  nft2: PropTypes.instanceOf(Object),
};

export default Versus;
