import React, { Component } from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

const clientId =
  "293362927237-7musc0tc5uipjceg736p9lsvsk3g1m6q.apps.googleusercontent.com";

class GoogleAuth extends Component {
  componentDidMount() {
    window.gapi.load("client: Auth2", () => {
      window.gapi.client
        .init({
          clientId,
          scope: "email"
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();

          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = isSignedIn => {
    if (isSignedIn) {
      this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <div>
          <button
            onClick={this.onSignOutClick}
            className="ui red google button"
          >
            <i className="google icon" />
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <div>
        <button onClick={this.onSignInClick} className="ui green google button">
          <i className="google icon" />
          Sign In with Google
        </button>
      </div>
    );
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = state => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
