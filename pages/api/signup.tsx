// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestData } from "../../models/RequestData";
import { ResponseStatus } from "../../models/ResponseStatus";
import TransformData from "../../models/TransfrormData";
import { UserData } from "../../models/UserData";
import { SignupUser, SendVerifyEmail } from "./hello";

const debug: boolean = false;

//============================================================
// POST /api/signup
//
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseStatus>
) {
  let status = new ResponseStatus();
  let userData = new UserData();
  if (debug) {
    console.log("SIGNUP");
    console.log(req.body);
  }

  let requestData = new RequestData();
  requestData.email = req.body.email;
  requestData.password = req.body.password;
  requestData.displayName = req.body.displayName;
  requestData.returnSecureToken = true;
  requestData.requestType = "SIGNUP";

  try {
    let signupStatus = await SignupUser(requestData);
    if (debug) {
      console.log("<<==== SIGNUP STATUS ==>");
      console.log(signupStatus);
    }

    /* sample response for signup user
    {
      kind: 'identitytoolkit#SignupNewUserResponse',
      idToken: '***'.
      displayName: '****',
      email: '***@***',
      refreshToken: '***',
      expiresIn: '3600',
      localId: '***'
    }
    */

    //
    // Check for error
    //
    if (!signupStatus) {
      throw new Error("E-SIGNUP-FAILED");
    }
    let idToken = signupStatus.idToken;
    if (debug) {
      console.log("IDTOKEN ==>>> " + idToken);
    }
    if (!idToken) {
      throw new Error("E-SIGNUP-FAILED");
    }
    userData.idToken = idToken;
    userData.displayName = signupStatus.displayName;
    userData.email = signupStatus.email;
    userData.refereshToken = signupStatus.refereshToken;
    userData.expiresIn = signupStatus.expiresIn;
    userData.localId = signupStatus.localId;
    //
    // Send verification email
    //
    if (debug) {
      console.log("SEND VERFIFY EMAIL");
    }
    requestData.idToken = signupStatus.idToken;
    let verifyEmailStatus = await SendVerifyEmail(requestData);
    if (debug) {
      console.log("VERIFY EMAIL STATUS");
      console.log(verifyEmailStatus);
    }

    /* sample response on sending email verificaton
    {
      kind: 'identitytoolkit#GetOobConfirmationCodeResponse',
      email: '***@***'
    }
    */

    //
    // Check for error
    //
    if (
      !verifyEmailStatus &&
      verifyEmailStatus.kind !==
        "identitytoolkit#GetOobConfirmationCodeResponse"
    ) {
      throw new Error("E-SENDEMAIL-FAILED");
    }
    status.message = "SUCCESS";
    status.statusCode = 200;
    status.userData = userData;
    if (debug) {
      console.log("STATUS");
      console.log(status);
    }
    res.status(200).json(status);
  } catch (error) {
    console.log("ERROR (signup)");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    res.status(status.statusCode).json(status);
  }
}

export default handler;
