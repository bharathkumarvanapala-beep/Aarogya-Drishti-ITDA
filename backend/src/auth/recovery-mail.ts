import nodemailer from 'nodemailer';
import { ServiceUnavailableException } from '@nestjs/common';
export async function sendRecoveryEmail(to: string, token: string): Promise<void> {
  if(!process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.APP_ORIGIN) throw new ServiceUnavailableException('EMAIL_NOT_CONFIGURED');
  const url = new URL('/login', process.env.APP_ORIGIN); url.hash = 'reset=' + encodeURIComponent(token);
  const transport=nodemailer.createTransport({host:process.env.SMTP_HOST||'smtp.gmail.com',port:465,secure:true,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},connectionTimeout:10000,socketTimeout:15000});
  try {await transport.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to,subject:'Aarogya Drishti — Password recovery / పాస్‌వర్డ్ పునరుద్ధరణ',text:`Use this private link within 15 minutes to reset your password:\n${url.href}\n\nఈ లింక్‌ను 15 నిమిషాలలో ఉపయోగించండి. మీరు కోరనట్లయితే ఈ సందేశాన్ని విస్మరించండి.\nIf you did not request this, ignore this email.`});}
  catch {throw new ServiceUnavailableException('EMAIL_DELIVERY_FAILED');}
  finally {transport.close();}
}
