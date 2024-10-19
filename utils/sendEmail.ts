import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'bertrand77@ethereal.email',
          pass: 'aEh6qJjGykdZQacjmZ'
      }
  }); 

    const info = await transporter.sendMail({
      from: 'your-ethereal-user@example.com', 
      to, 
      subject, 
      text, 
    });

    console.log(`Email sent to ${to}: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    console.error('Error sending email', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
