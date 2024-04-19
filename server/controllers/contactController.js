const nodemailer = require('nodemailer')


exports.contactAction = async (req, res) => {
    const { name, email, phone, subject, message } = req.body
    if(!name || !email || !phone || !subject || !message) return res.status(400).json({message: {status: '500', text:'All fields are required!'}})
    
    // send email
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    transport.sendMail({
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Message from: ${email} - Subject: ${subject}`,
        text: `You recieved this email from: <${name}>, Email: <${email}>, Phone: <${phone}>. Message text: ${message}`
    }, (error, info)=>{
        if(error){

            return res.status(500).json({message: {status: '500', text:'Internal server error.'}});
        } 
        console.log(info.response);
        return res.status(200).json({message: {status: '200', text:'We recieved your email.'}})
    })
}