import React from "react";
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie'
import { authSuccess } from '../../redux/authentication/authActions'
import {useDispatch} from "react-redux"


const SignUp = () => {

  const history = useHistory()
  const dispatch = useDispatch()
  var myForm = document.getElementById('signup-form')

  const handleClickSignup = (e) => {
    e.preventDefault();

    let data = {
      user: {
        email: e.currentTarget.email.value,
        pseudo:  e.currentTarget.pseudo.value,
        password: e.currentTarget.password.value
      }
    }
    fetch('https://pyramid-race-api.herokuapp.com/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => {
      for (var pair of response.headers.entries()) { // accessing the entries
        if (pair[0] === "authorization") { // key I'm looking for in this instance
        Cookies.set("token", pair[1])
        }
      }
      return response.json()
    })
    .then((response) => {
      dispatch(authSuccess(response))
      history.push('/')
    })
    .catch((error) => console.log(error))
  }

  return (
    <div>
      <section
        id="contact"
        class="contact-area"
        style={{ marginBottom: "50px", marginTop: "50px" }}
      >
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <div class="section-title text-center pb-10">
                <h3 class="title">Inscription</h3>
                <p class="text">
                  Tu es brave et courageux, si tu es ici c'est que tu veux
                  tenter l'aventure et atteindre le sommet de la Pyramid Race !
                </p>
                <small>
                  Tu vas surement mourir mais bravo pour ton courage 😏
                </small>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="contact-form">
                <form id="signup-form" method="post" onSubmit={handleClickSignup}>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="single-form form-group">
                        <input
                          type="email"
                          name="email"
                          placeholder="Tape ton adresse mail"
                        ></input>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="single-form form-group">
                        <input
                          type="text"
                          name="pseudo"
                          placeholder="Tape ton pseudo (Choisi un truc qui en jette sinon on te jette (de la pyramide...)"
                        ></input>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="single-form form-group">
                        <input
                          placeholder="Tape ton mot de passe"
                          type="password"
                          name="password"
                        ></input>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="single-form form-group text-center">
                        <button type="submit" class="main-btn">
                          M'inscrire
                        </button>
                      </div>
                    </div>
                    <img
                      src="/assets/images/aztequesign.png"
                      style={{ marginTop: "50px" }}
                    ></img>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
