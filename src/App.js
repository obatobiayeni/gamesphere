import React from "react";
import Cover from "./components/minter/Cover";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/wallet";
import { useBalance, useGamesphereContract } from "./hooks";
import Nfts from "./components/minter/nfts";
import { useContractKit } from "@celo-tools/use-contractkit";
import "./App.css";
import { Container, Nav } from "react-bootstrap";
import Navbar from "./components/ui/Navbar"

const App = function AppWrapper() {
  const { address, connect } = useContractKit();

  //  fetch user's celo balance using hook
  const { balance, getBalance } = useBalance();

  // initialize the NFT mint contract
  const gamesphereContract = useGamesphereContract();

  return (
    <>
      <Notification />
      <Navbar/>
      {address ? (
        <Container fluid="md">
          <main>
            <Nfts
              name="Gamesphere"
              updateBalance={getBalance}
              minterContract={gamesphereContract}
            />
          </main>
        </Container>
      ) : (
        <Cover connect={connect} />
      )}
    </>
  );
};

export default App;
