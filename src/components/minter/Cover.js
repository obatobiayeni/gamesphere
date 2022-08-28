import React from 'react';
import image from '../../assets/Cards.png'

const Cover = ({ connect }) => {
    return (
      <div className="gamesphere_cover d-flex align-items-center justify-content-between">
        <div className="text-start">
          <h1>Mint all your favourite<br></br> powerups in one place</h1>
          <button
            className="mt-5"
            onClick={() => connect().catch((e) => console.log(e))}
          >
            get started
          </button>
        </div>

        <div className="header_image">
          <img src={image}/>
        </div>

      </div>
    );
};

export default Cover;
