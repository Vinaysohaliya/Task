import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    // Create a transporter object using Ethereal for testing
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'bertrand77@ethereal.email',
          pass: 'aEh6qJjGykdZQacjmZ'
      }
  }); 

    // Send the email
    const info = await transporter.sendMail({
      from: 'your-ethereal-user@example.com', // Sender address
      to, // List of receivers
      subject, // Subject line
      text, // Plain text body
    });

    console.log(`Email sent to ${to}: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    console.error('Error sending email', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
