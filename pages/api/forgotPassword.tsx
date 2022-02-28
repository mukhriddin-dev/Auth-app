// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RequestData } from "../../models/RequestData";
import { ResponseStatus } from "../../models/ResponseStatus";
import { SendPasswordReset } from "./hello";

const debug: boolean = false;

//============================================================
// POST /api/forgotPassword
//
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseStatus>
) {
  let status = new ResponseStatus();
  if (debug) {
    console.log("FORGOT PASSWORD");
    console.log(req.body);
  }

  let requestData = new RequestData();
  requestData.email = req.body.email;

  try {
    //
    // Send forgot password email
    //
    if (debug) {
      console.log("SEND FOR GOTPASSWORD  EMAIL");
    }
    let forgotPasswordStatus = await SendPasswordReset(requestData);
    if (debug) {
      console.log("FORGOT PASSWORD STATUS");
      console.log(forgotPasswordStatus);
    }
    //
    // Check for error
    //
    if (!forgotPasswordStatus) {
      throw new Error("E-PASSWORD-RESET");
    }
    status.message = "SUCCESS";
    status.statusCode = 200;
    if (debug) {
      console.log("STATUS");
      console.log(status);
    }
    res.status(200).json(status);
  } catch (error) {
    console.log("ERROR (reset passwowrd)");
    console.log(error);
    status.message = error.message;
    status.statusCode = 500;
    res.status(status.statusCode).json(status);
  }
}

export default handler;
