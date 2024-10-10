import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          message: "User already exists",
          success: false,
        },
        {
          status: 400,
        }
      );
    }
    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
            return Response.json(
              {
                success: false,
                message: 'User already exists with this email',
              },
              { status: 400 }
            );
          } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verificationToken = verificationToken;
            existingUserByEmail.verificationTokenExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
          }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verificationToken,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        roomRequests: [],
      });

      await newUser.save();
    }
    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationToken
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
