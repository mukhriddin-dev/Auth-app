// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestData } from "../../models/RequestData";
import { ResponseStatus } from "../../models/ResponseStatus";

/*
export default (req: NextApiRequest, res: NextApiResponse<ResponseStatus>) => {
  let status = new ResponseStatus();
  status.message = "Hello";
  status.statusCode = 200;
  res.status(200).json(status);
};
*/

const URL: string = "https://identitytoolkit.googleapis.com/v1/accounts";

const LOGIN: string = ":signInWithPassword?key=";
const USERDATA: string = ":lookup?key=";
const SIGNUP: string = ":signUp?key=";
const VERIFY_EMAIL: string = ":sendOobCode?key=";
const CONFIRM_EMAIL: string = ":update?key="
const SEND_PASSWORD_RESET: string = ":sendOobCode?key=";
const CONFIRM_PASSWORD_RESET: string = ":resetPassword?key=";
const UPDATE_PROFILE: string = ":update?key=";

const KEY: string = "AIzaSyB-xvYJGdr3lk0L4GEncNXvsx_1qcAZ6YA";

const debug: boolean = false;

//============================================================
// call Id Service (Google Firebase in this example)
//
export async function IdService(body: string, URL: string, reqMethod: string) {
  if (debug) {
    console.log("IdService");
    console.log(body);
  }
  let status = new ResponseStatus();

  try {
    if (debug) {
      console.log("URL " + URL);
      console.log("REQUESTBODY");
      console.log(body);
    }
    const response = await fetch(URL, {
      method: reqMethod,
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if ( debug ) {
      console.log("DATA");
      console.log(data);
    }

    status.statusCode = response.status;
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(data.message || "Error registering user!");
    }
    return data;
  } catch (error) {
    console.log("ERROR " + error);
    return null;
  }
}

//============================================================
// Login User
//
export async function LoginUser(requestData: RequestData) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("LOGIN");
    console.log(requestData);
  }
  try {
    let loginBody = JSON.stringify({
      email: requestData.email,
      password: requestData.password,
      returnSecureToken: true,
    });
    if (debug) {
      console.log(loginBody);
    }
    let loginStatus = IdService(loginBody, URL + LOGIN + KEY, "POST");
    if (debug) {
      console.log("LOGIN STATUS");
      console.log(loginStatus);
    }
    if (!loginStatus) {
      throw new Error("E-LOGIN-FAILED");
    }
    if (debug) {
      console.log("<<============RETURN LOGIN==============>>");
    }
    return loginStatus;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    return status;
  }
}

//============================================================
// Get user data
//
export async function GetUserData(requestData: RequestData) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("GetUserData");
    console.log(requestData);
  }
  try {
    let loginBody = JSON.stringify({
      idToken: requestData.idToken,
    });
    if (debug) {
      console.log(loginBody);
    }
    let userdataStatus = IdService(loginBody, URL + USERDATA + KEY, "POST");
    if (debug) {
      console.log("USERDATA STATUS");
      console.log(userdataStatus);
    }
    if (!userdataStatus) {
      throw new Error("E-GETDATA-FAILED");
    }
    return userdataStatus;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    return status;
  }
}

//============================================================
// Signup user
//
export async function SignupUser(requestData: RequestData) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("SIGNUP USER");
    console.log(requestData);
  }
  try {
    let singupBody = JSON.stringify({
      email: requestData.email,
      password: requestData.password,
      displayName: requestData.displayName,
      returnSecureToken: true,
    });
    if (debug) {
      console.log(singupBody);
    }
    let signupStatus = await IdService(singupBody, URL + SIGNUP + KEY, "POST");
    if (debug) {
      console.log("SINGUP STATUS");
      console.log(signupStatus);
    }
    if (!signupStatus) {
      throw new Error("E-SIGNUP-FAILED");
    }
    return signupStatus;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    return status;
  }
}

//============================================================
// Signup user
//
export async function SendVerifyEmail(requestData: RequestData) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("SEND VERIFY EMAIL");
    console.log(requestData);
  }
  try {
    let emailBody = JSON.stringify({
      requestType: "VERIFY_EMAIL",
      idToken: requestData.idToken,
    });
    if (debug) {
      console.log(emailBody);
    }
    let emailStatus = await IdService(
      emailBody,
      URL + VERIFY_EMAIL + KEY,
      "POST"
    );
    if (debug) {
      console.log("===>>>>> SEND EMAIL STATUS");
      console.log(emailStatus);
    }
    if (!emailStatus) {
      throw new Error("E-SENDEMAIL-FAILED");
    }
    return emailStatus;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    return status;
  }
}

//============================================================
// Send password reset user
//
export async function SendPasswordReset(requestData: RequestData) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("SEND PASSWORD RESET");
    console.log(requestData);
  }
  try {
    let resetBody = JSON.stringify({
      email: requestData.email,
      requestType: "PASSWORD_RESET",
    });
    if (debug) {
      console.log(resetBody);
    }
    let passwordresetStatus = await IdService(resetBody, URL + SEND_PASSWORD_RESET + KEY, "POST");
    if (debug) {
      console.log("SEND PASSWORD RESET STATUS");
      console.log(passwordresetStatus);
    }
    if (!passwordresetStatus) {
      throw new Error("E-RESET-FAILED");
    }
    return passwordresetStatus;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    return status;
  }
}

//============================================================
// Confirm password reset user
//
export async function ConfirmPasswordReset(requestData: RequestData) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("CONFIRM PASSWORD USER");
    console.log(requestData);
  }
  try {
    let confirmBody = JSON.stringify({
      oobCode: requestData.oobCode,
      newPassword: requestData.password,
    });
    if (debug) {
      console.log(confirmBody);
    }
    let confirmPasswordresetStatus = await IdService(confirmBody, URL + CONFIRM_PASSWORD_RESET + KEY, "POST");
    if (debug) {
      console.log("CONFIRM PASSWORD RESET STATUS");
      console.log(confirmPasswordresetStatus);
    }
    if (!confirmPasswordresetStatus) {
      throw new Error("E-CONFIRM-RESET-FAILED");
    }
    return confirmPasswordresetStatus;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    return status;
  }
}

//============================================================
// Update user profile
//
export async function UpdateUserProfile(requestData: RequestData) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("UPDATE USER PROFILE");
    console.log(requestData);
  }
  try {
    let updateProfileBody = JSON.stringify({
      idToken: requestData.idToken,
      displayName: requestData.displayName,
      photoUrl: requestData.photoUrl,
      deleteAttribute: requestData.deleteAttribute,
      returnSecureToken: true,
    });
    if (debug) {
      console.log(updateProfileBody);
    }
    let updateProfileStatus = await IdService(updateProfileBody, URL + UPDATE_PROFILE + KEY, "POST");
    if (debug) {
      console.log("UPDATE USER PROFILE STATUS");
      console.log(updateProfileStatus);
    }
    if (!updateProfileStatus) {
      throw new Error("E-UPDATE-PROFILE-FAILED");
    }
    return updateProfileStatus;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    return status;
  }
}

//============================================================
// Confirm email
//
export async function ConfirmEmail(requestData: RequestData) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("CONFIRM EMAIL");
    console.log(requestData);
  }
  try {
    let confirmEmailBody = JSON.stringify({
      oobCode: requestData.oobCode,
    });
    if (debug) {
      console.log(confirmEmailBody);
    }
    let confirmEmailStatus = await IdService(confirmEmailBody, URL + CONFIRM_EMAIL + KEY, "POST");
    if (debug) {
      console.log("CONFIRM EMAIL STATUS");
      console.log(confirmEmailStatus);
    }
    if (!confirmEmailStatus) {
      throw new Error("E-CONFIRM-EMAIL-FAILED");
    }
    return confirmEmailStatus;
  } catch (error) {
    console.log("ERROR");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    return status;
  }
}