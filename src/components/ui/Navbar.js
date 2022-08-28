import React from "react";
import logo from "../../assets/logo.png"
import { useContractKit } from "@celo-tools/use-contractkit";
import Wallet from "../../components/wallet";
import { useBalance } from "../../hooks";

const Navbar = () => {
    const { address, destroy, connect } = useContractKit();
    const { balance } = useBalance();
    return (
        <nav className="d-flex justify-content-between py-3">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <div className="nav_content">
                {/*display user wallet*/}
                {address ? (
                    <Wallet
                        address={address}
                        amount={balance.CELO}
                        symbol="CELO"
                        destroy={destroy}
                    />
                ): (
                    <div className="nav_connect d-flex align-items-center justify-content-around">
                        <p className="me-3">Learn more</p>
                        <button 
                            className="ms-3"
                            onClick={() => connect().catch((e) => console.log(e))}
                        >Connect wallet</button>
                    </div>
                )}
                
            </div>
        </nav>
    );
};

export default Navbar;