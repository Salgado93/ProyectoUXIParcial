import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SignOutButton from "../SignOut/SignOut";
import { withAuthorization } from "../Sesion";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import NewClassDetails from "../Class/Classes";
import $ from 'jquery';

const homePage = () => (
  <div>
    <Home />
  </div>
);

const buttons_styles = {
  textDecoration: "none",
  background: "none"
};

class Principal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Clases: []
    };

    this.props.firebase.db
      .collection("Classes")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({
            Clases: [...this.state.Clases, doc.data()]
          });
        });
        console.log(this.state.Clases);
      });
  }

  onSubmit = event => {
    let nameClass = document.getElementById("nameClass").value;
    let sectionName = document.getElementById("sectionName").value;
    let roomClass = document.getElementById("roomClass").value;

    this.props.firebase.db
      .collection("Classes")
      .add({
        nameClass,
        sectionName,
        roomClass
      })
      .then(idRef => {
        this.setState({
          Clases: [
            ...this.state.Clases,
            {
              nameClass,
              sectionName,
              roomClass
            }
          ]
        });
        document.getElementById("nameClass").value = "";
        document.getElementById("sectionName").value = "";
        document.getElementById("roomClass").value = "";
        $('#mostrar_crear').modal('hide');
      })
      .catch(() => {
        alert("No se ha podido guardar");
      });
    event.preventDefault();
  };

  render() {
    const isInvalid =
      this.nameClass === "" || this.sectionName === "" || this.roomClass === "";

    return (
      <div className="div.container-fluid.d-flex justify-content-center">
        <nav className=" navbar  navbar-expand-lg navbar-light bg-white page-header ">
          <div className="btn-group dropright">
            <div className="dropdown-menu">
              <button className="dropdown-item" type="button"></button>
            </div>
          </div>
          <div id="plusButton" className="dropdown dropleft ml-auto">
            <button
              className="dropdown-toogle icons"
              href="#"
              id="dropdownMenu2"
              data-toggle="dropdown"
            >
              <FontAwesomeIcon icon={["fas", "plus"]} />
            </button>
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                type="button"
                data-toggle="modal"
                data-target="#mostrar_apuntarse"
              >
                Apuntarse en una clase
              </button>
              <button
                className="dropdown-item"
                type="button"
                data-toggle="modal"
                data-target="#mostrar_crear"
              >
                Crear una clase
              </button>
            </div>
          </div>

          <div id="userButton" className=" dropdown btn-group dropleft mr-3">
            <button
              className="dropdown-toogle icons"
              href="#"
              id="dropdownMenu2"
              data-toggle="dropdown"
            >
              <FontAwesomeIcon icon={["far", "user"]} />
            </button>
            <div className="dropdown-menu text-center ">
              <SignOutButton style={buttons_styles} />
            </div>
          </div>

          <div className="modal fade" id="mostrar_apuntarse">
            <div className="modal-dialog">
              <div className="modal-content">
                <h4 className="modal-header text-center">
                  Apuntarse a una clase
                </h4>
                <div className="modal-body">
                  <h6>
                    Pídele el código de la clase a tu profesor e introdúcelo
                    aquí.
                  </h6>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success">
                    Unirse
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal fade" id="mostrar_crear">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header text-center">
                  <h1 className="text-info lead text-center">
                    Crear una clase
                  </h1>
                </div>

                <div className="modal-body">
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group form-check">
                      <input
                        placeholder="Nombre clase"
                        type="text"
                        name="nameClass"
                        id="nameClass"
                        className="form-control input-css"
                        required
                      ></input>
                    </div>
                    <div className="form-group form-check">
                      <input
                        placeholder="Seccion"
                        type="text"
                        name="sectionName"
                        id="sectionName"
                        className="form-control  input-css"
                        required
                      ></input>
                    </div>
                    <div className="form-group form-check">
                      <input
                        placeholder="Aula"
                        type="text"
                        name="roomClass"
                        id="roomClass"
                        className="form-control  input-css"
                        required
                      ></input>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={isInvalid}
                      id="modalSubmit"
                    >
                      Crear
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-dismiss="modal"
                    >
                      Cancelar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/*-----------------------------all task code show here!!!!-------------------------*/}

        <div className="container-fluid d-flex flex-wrap mt-4 tex-center"></div>
      </div>
    );
  }
}

const Home = withRouter(withFirebase(Principal));
const condition = authUser => !!authUser;
export default withAuthorization(condition)(homePage);
export { Principal };
