// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestData } from "../../models/RequestData";
import { ResponseStatus } from "../../models/ResponseStatus";
import { SendVerifyEmail } from "./hello";

const debug: boolean = false;

//============================================================
// POST /api/resendEmail
//
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseStatus>
) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("RESEND EMAIL");
    console.log(req.body);
  }

  let requestData = new RequestData();
  requestData.idToken = req.body.idToken;
  requestData.returnSecureToken = true;
  requestData.requestType = "VERIFY_EMAIL";

  try {
    //
    // Send verification email
    //
    if (debug) {
      console.log("SEND VERFIFY EMAIL");
    }
    let verifyEmailStatus = await SendVerifyEmail(requestData);
    if (debug) {
      console.log("VERIFY EMAIL STATUS");
      console.log(verifyEmailStatus);
    }
    //
    // Check for error
    //
    if (!verifyEmailStatus) {
      throw new Error("E-SEND-EMAIL-FAILED");
    }
    status.message = "SUCCESS";
    status.statusCode = 200;
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
