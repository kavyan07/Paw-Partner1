import React from "react";
import * as Components from "./Components";

function App() {
  const [signIn, toggleSignIn] = React.useState(true); // State to toggle between Sign In/Sign Up
  const [role, setRole] = React.useState("user"); // State to track the role (user, admin, pet shop, adoption center)

  // Toggle between Sign In and Sign Up forms
  const toggleForm = () => {
    toggleSignIn(!signIn);
  };

  // Handle the role change via radio button selection
  const handleRadioChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <Components.Background>
      <Components.Container>
        <Components.CardContainer>
          {/* Render corresponding forms based on the selected role */}
          {role === "admin" && (
            <>
              {/* Admin Sign Up Form */}
              {!signIn && (
                <Components.FormContainer>
                  <Components.Form>
                    <Components.Title>Admin Create Account</Components.Title>
                    <Components.Input type="text" placeholder="Name" />
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Button>Sign Up</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}

              {/* Admin Sign In Form */}
              {signIn && (
                <Components.FormContainer>
                  <Components.Form>
                    <Components.Title>Admin Sign In</Components.Title>
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Anchor href="#">Forgot your password?</Components.Anchor>
                    <Components.Button>Sign In</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}
            </>
          )}

          {role === "user" && (
            <>
              {/* User Sign Up Form */}
              {!signIn && (
                <Components.FormContainer>
                  <Components.Form>
                    <Components.Title>User Create Account</Components.Title>
                    <Components.Input type="text" placeholder="Name" />
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Button>Sign Up</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}

              {/* User Sign In Form */}
              {signIn && (
                <Components.FormContainer>
                  <Components.Form>
                    <Components.Title>User Sign In</Components.Title>
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Anchor href="#">Forgot your password?</Components.Anchor>
                    <Components.Button>Sign In</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}
            </>
          )}

          {role === "petShop" && (
            <>
              {/* Pet Shop Sign Up Form */}
              {!signIn && (
                <Components.FormContainer>
                  <Components.Form>
                    <Components.Title>Pet Shop Create Account</Components.Title>
                    <Components.Input type="text" placeholder="Shop Name" />
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Button>Sign Up</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}

              {/* Pet Shop Sign In Form */}
              {signIn && (
                <Components.FormContainer>
                  <Components.Form>
                    <Components.Title>Pet Shop Sign In</Components.Title>
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Anchor href="#">Forgot your password?</Components.Anchor>
                    <Components.Button>Sign In</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}
            </>
          )}

          {role === "adoptionCenter" && (
            <>
              {/* Adoption Center Sign Up Form */}
              {!signIn && (
                <Components.FormContainer>
                  <Components.Form>
                    <Components.Title>Adoption Center Create Account</Components.Title>
                    <Components.Input type="text" placeholder="Center Name" />
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Button>Sign Up</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}

              {/* Adoption Center Sign In Form */}
              {signIn && (
                <Components.FormContainer>
                  <Components.Form>
                    <Components.Title>Adoption Center Sign In</Components.Title>
                    <Components.Input type="email" placeholder="Email" />
                    <Components.Input type="password" placeholder="Password" />
                    <Components.Anchor href="#">Forgot your password?</Components.Anchor>
                    <Components.Button>Sign In</Components.Button>
                  </Components.Form>
                </Components.FormContainer>
              )}
            </>
          )}

          {/* Toggle Button for switching between Sign In and Sign Up */}
          <Components.ToggleButtonContainer>
            <Components.ToggleButton onClick={toggleForm}>
              {signIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Components.ToggleButton>
          </Components.ToggleButtonContainer>

          {/* Render Radio Buttons below the toggle button */}
          <Components.RadioContainer>
            {["user", "admin", "petShop", "adoptionCenter"].map((roleOption) => (
              <Components.RadioLabel key={roleOption}>
                <Components.RadioInput
                  type="radio"
                  value={roleOption}
                  checked={role === roleOption}
                  onChange={handleRadioChange}
                />
                {roleOption.replace(/([A-Z])/g, " $1").toUpperCase()}
              </Components.RadioLabel>
            ))}
          </Components.RadioContainer>
        </Components.CardContainer>
      </Components.Container>
    </Components.Background>
  );
}

export default App;
