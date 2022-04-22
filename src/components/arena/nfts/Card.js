import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import Identicon from "../../ui/Identicon";

const NftCard = ({ nft }) => {
  const { image, description, owner, name, index } = nft;

  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              #{index}
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={image} alt={description} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1 text-muted">
            {description}
          </Card.Text>
          <Card.Text className="flex-grow-1 fw-bold">Wins: {10}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;
