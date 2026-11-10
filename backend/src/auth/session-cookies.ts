import { Request, Response } from 'express';
import { AuthResponseDto } from './dto';
export function cookieValue(req: Request,name:string): string|undefined {
 const part=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='));
 if(!part)return;try{return decodeURIComponent(part.slice(name.length+1));}catch{return;}
}
export function sendSession(req:Request,res:Response,result:AuthResponseDto,remember=false):AuthResponseDto {
 if(req.headers['x-session-mode']!=='cookie')return result;
 const options={httpOnly:true,secure:process.env.NODE_ENV!=='development',sameSite:'strict' as const,path:'/api/v1'};
 if(result.accessToken)res.cookie('ad_access',result.accessToken,{...options,...(remember?{maxAge:15*60*1000}:{})});
 if(result.refreshToken)res.cookie('ad_refresh',result.refreshToken,{...options,...(remember?{maxAge:7*86400000}:{})});
 return {...result,accessToken:undefined,refreshToken:undefined};
}
export function clearSession(res:Response){for(const name of ['ad_access','ad_refresh'])res.clearCookie(name,{httpOnly:true,secure:process.env.NODE_ENV!=='development',sameSite:'strict',path:'/api/v1'});}
