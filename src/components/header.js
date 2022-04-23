import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Link } from "react-router-dom";
import Wallet from "../components/Wallet";
import { useBalance } from "../hooks";

const Header = () => {
  const { address, destroy } = useContractKit();
  const { balance } = useBalance();

  return (
    <Navbar
      bg="light"
      expand="lg"
      className="p-3 mb-5 rounded-bottom rounded-3"
    >
      <Navbar.Brand>
        <h4 className="fw-bold">AvatarArena</h4>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse className="justify-content-end">
        <Nav className="justify-content-end">
          <Nav.Item className="d-flex align-items-center mb-2 mb-lg-0">
            <Link to="/battle-result" className="text-dark">
              View Battle result
            </Link>
          </Nav.Item>

          <Nav.Item className="d-flex align-items-center mb-2 mb-lg-0">
            <Link to="/new-battle" className="text-dark">
              New battle
            </Link>
          </Nav.Item>

          <Nav.Item className="d-flex align-items-center mb-2 mb-lg-0">
            <Link to="/all-nfts" className="text-dark">
              All NFTs
            </Link>
          </Nav.Item>

          <Nav.Item className="d-flex align-items-center mb-2 mb-lg-0">
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
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
