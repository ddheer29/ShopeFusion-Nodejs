const twilio = require("twilio");
const crypto = require("crypto");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  return { otp, expiresAt };
};

const sendOTP = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Divyang Dheer, Your OTP code is ${otp}. It is valid for 5 minutes.`,
      from: twilioPhoneNumber,
      to: phone,
    });
    console.log(`OTP sent: ${message.sid}`);
    return true;
  } catch (error) {
    console.log("Error sending OTP:", error.message);
    throw new Error("Error sending OTP");
  }
};

module.exports = { generateOTP, sendOTP };

// twilio recovery code - Q9H3W252GS5PWH6F4GK1W7DW
