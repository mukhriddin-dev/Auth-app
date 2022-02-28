// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestData } from "../../models/RequestData";
import { ResponseStatus } from "../../models/ResponseStatus";
import { ConfirmEmail } from "./hello";

const debug: boolean = false;

//============================================================
// POST /api/verifyEmail
//
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseStatus>
) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("VERIFY EMAIL");
    console.log(req.body);
  }

  let requestData = new RequestData();
  requestData.oobCode = req.body.oobCode;

  try {
    //
    // Send verification email
    //
    if (debug) {
      console.log("VERFIFY EMAIL");
    }
    let verifyEmailStatus = await ConfirmEmail(requestData);
    if (debug) {
      console.log("VERIFY EMAIL STATUS");
      console.log(verifyEmailStatus);
    }
    //
    // Check for error
    //
    if (!verifyEmailStatus) {
      throw new Error("E-VERIFY-EMAIL-FAILED");
    } else {
      if ( verifyEmailStatus.statusCode === 500 ) {
        console.log("Error code: " + verifyEmailStatus);
        throw new Error("E-VERIFY-EMAIL-FAILED");
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
    console.log("ERROR (verifyEmail)");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    res.status(status.statusCode).json(status);
  }
}

export default handler;
