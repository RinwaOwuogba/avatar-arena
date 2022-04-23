import React from "react";
import { Nav } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Link } from "react-router-dom";
import Wallet from "../components/Wallet";
import { useBalance } from "../hooks";

const Header = () => {
  const { address, destroy } = useContractKit();
  const { balance } = useBalance();

  return (
    <header className="d-flex align-items-center justify-content-between pt-3 pb-5">
      <h4 className="fw-bold">AvatarArena</h4>

      <Nav className="justify-content-end">
        <Nav.Item className="d-flex align-items-center me-4">
          <Link to="/arena" className="text-dark">
            Arena
          </Link>
        </Nav.Item>

        <Nav.Item className="d-flex align-items-center me-4">
          <Link to="/all-nfts" className="text-dark">
            All NFTs
          </Link>
        </Nav.Item>

        <Nav.Item className="d-flex align-items-center me-4">
          <Link to="/my-nfts" className="text-dark">
            My NFTs
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Wallet
            address={address}
            amount={balance.CELO}
            symbol="CELO"
            destroy={destroy}
          />
        </Nav.Item>
      </Nav>
    </header>
  );
};

export default Header;
