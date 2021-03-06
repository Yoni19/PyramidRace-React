import "./style.scss";
import React from "react";

const HomeSection = () => {
  return (
    <section id="information" className="services-area">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="section-title pb-10">
              <h4 className="title">
                Pyramid <em>Race</em> !
              </h4>
              <p className="text">
                En jouant à ce jeu, tu amélioreras ta culture générale et tu
                pourras humilier des inconnus, ou mêmes tes (futurs-ex) amis, en
                montrant que c'est bien toi qui te trouves au sommet de la
                pyramide !
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-md-6">
                <div className="services-content mt-40 d-sm-flex">
                  <div className="services-icon">
                    <i className="lni-bolt"></i>
                  </div>
                  <div className="services-content media-body">
                    <h4 className="services-title">Rapidité</h4>
                    <p className="text">
                      Tu as 10 secondes pour répondre à chaque question. Plus tu
                      réponds vite, plus tu cumules des points bonus !
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="services-content mt-40 d-sm-flex">
                  <div className="services-icon">
                    <i className="lni lni-emoji-happy"></i>
                  </div>
                  <div className="services-content media-body">
                    <h4 className="services-title">Fun</h4>
                    <p className="text">
                      Tu verras, c'est amusant même si tu restes au pied de la
                      pyramide (en gros, même si t'es nul...)
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="services-content mt-40 d-sm-flex">
                  <div className="services-icon">
                    <i className="lni lni-pyramids"></i>
                  </div>
                  <div className="services-content media-body">
                    <h4 className="services-title">Rang</h4>
                    <p className="text">
                      Plus tu gagnes de parties, plus ton niveau augmente, plus
                      tu affrontes de redoutables adversaires !
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="services-content mt-40 d-sm-flex">
                  <div className="services-icon">
                    <i className="lni lni-network"></i>
                  </div>
                  <div className="services-content media-body">
                    <h4 className="services-title">Seul ou entre amis !</h4>
                    <p className="text">
                      Invite tes potes et montre leur que tu n'es pas un second
                      couteau aztèque !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="services-image d-lg-flex align-items-center">
        <div className="image">
          <img src="assets/images/pyramid.jpg" alt="Pyramid"></img>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
