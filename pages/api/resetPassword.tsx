// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestData } from "../../models/RequestData";
import { ResponseStatus } from "../../models/ResponseStatus";
import { ConfirmPasswordReset } from "./hello";

const debug: boolean = false;

//============================================================
// POST /api/resetPassword
//
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseStatus>
) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("RESET PASSWORD");
    console.log(req.body);
  }

  let requestData = new RequestData();
  requestData.oobCode = req.body.oobCode;
  requestData.password = req.body.password;

  try {
    //
    // Send pasword reset     //
    if (debug) {
      console.log("RESET PASSWORD");
      console.log(requestData);
    }
    let resetPasswordStatus = await ConfirmPasswordReset(requestData);
    if (debug) {
      console.log("RESET PASSWORD STATUS");
      console.log(resetPasswordStatus);
    }
    //
    // Check for error
    //
    if (!resetPasswordStatus) {
      throw new Error("E-VERIFY-EMAIL-FAILED");
    } else {
      if ( resetPasswordStatus.statusCode === 500 ) {
        console.log("Error code: " + resetPasswordStatus);
        throw new Error("E-REST-PASSWORD-FAILED");
      }
    }
    status.message = "SUCCESS";
    status.statusCode = 200;
    if (debug) {
      console.log("STATUS");
      console.log(status);
    }
    res.status(200).json(status);
  } catch (error) {
    console.log("ERROR (resetPassword)");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    res.status(status.statusCode).json(status);
  }
}

export default handler;
