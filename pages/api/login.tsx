// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestData } from "../../models/RequestData";
import { ResponseStatus } from "../../models/ResponseStatus";
import TransformData from "../../models/TransfrormData";
import { UserData } from "../../models/UserData";
import { GetUserData, LoginUser } from './hello';

const debug: boolean = false;
const jwtKey: string = '12345';


//============================================================
// POST /api/login
//
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseStatus>
) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("LOGIN");
    console.log(req.body);
  }

  let requestData = new RequestData();
  let userData = new UserData();
  requestData.email = req.body.email;
  requestData.password = req.body.password;
  requestData.returnSecureToken = true;
  requestData.requestType = "LOGIN";

  try {
    let loginStatus =  await LoginUser(requestData);
    if (debug) {
      console.log("LOGIN STATUS");
      console.log(loginStatus);
    }
    if (!loginStatus) {
      throw new Error("E-LOGIN-FAILED");
    }
    let idToken = loginStatus.idToken;
    requestData.idToken = idToken;
    if (debug) {
      console.log("IDTOKEN ==>>> " + idToken);
    }
    let getUserStatus = await GetUserData ( requestData);
    if (debug) {
      console.log("GET DATA STATUS");
      console.log(getUserStatus);
    }
    if (!getUserStatus) {
      throw new Error("E-GETDATA-FAILED");
    }
    let userData = TransformData(getUserStatus.users[0]);
    //
    // Some of the userdata is received when user is authenticated
    // Assign it from the return status from Login (loginStatus)
    //
    userData.refereshToken = loginStatus.refreshToken;
    userData.expiresIn = loginStatus.expiresIn;
    userData.displayName = loginStatus.displayName;
    userData.localId = loginStatus.localId;
    userData.registered = loginStatus.registered;
    userData.idToken = requestData.idToken;
    status.userData = userData;
    if (debug) {
      console.log("USERDATA");
      console.log(userData);
    }
    if ( !userData.emailVerified ) {
        throw new Error("E-EMAIL-NOT-VERIFIED");
    }
    const jwt = require('njwt');
    status.authToken = jwt.create(UserData, jwtKey).compact();
  
    status.message = "SUCCESS";
    status.statusCode = 200;
    if (debug) {
      console.log("STATUS");
      console.log(status);
    }
    res.status(status.statusCode).json(status);
  } catch (error) {
    console.log("ERROR");
    // console.log(error);
    // console.log(userData)
    status.message = error.message;
    status.statusCode = 500;
    res.status(status.statusCode).json(status);
  }
}

export default handler;
