// pages/api/getUserDetails.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  try {
    const cookie = req.cookies.get("access_token")?.value;

    // Make a request to the Express server with the cookie
    const response = await axios.get("http://localhost:5000/api/user/details", {
      headers: {
        Cookie: "access_token=" + cookie, // Pass the cookie in the header
      },
    });

    // Send the response back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.json({ error: "Failed to fetch user details" });
  }
}
