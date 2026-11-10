import {Body, Controller, Get, Post, ServiceUnavailableException, UseGuards} from '@nestjs/common';
import {Equals, IsInt, IsString, Max, MaxLength, Min} from 'class-validator';
import {Roles} from '../common/decorators/roles.decorator';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {RolesGuard} from '../auth/guards/roles.guard';

export class ResearchDemoDto {
 @IsString() @MaxLength(1800000) imageBase64: string;
 @IsInt() @Min(0) @Max(120) age: number;
 @IsString() @MaxLength(200) site: string;
 @IsString() @MaxLength(4000) history: string;
 @Equals(true) syntheticOnly: boolean;
}

@Controller('medgemma')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('ASHA_WORKER','ANM_WORKER','COMMUNITY_HEALTH_OFFICER','MEDICAL_OFFICER','SPECIALIST_DOCTOR')
export class MedgemmaController {
 private async forward(path:string,body?:ResearchDemoDto) {
  const origin=process.env.AI_RESEARCH_SERVICE_URL;
  const token=process.env.AI_SERVICE_TOKEN;
  if(!origin || !token)throw new ServiceUnavailableException('RESEARCH_DEMO_NOT_CONFIGURED');
  try {
   const url=new URL(origin.replace(/\/$/,'')+path);
   if(url.protocol!=='https:' && !(process.env.NODE_ENV==='development'&&['localhost','127.0.0.1'].includes(url.hostname)))throw Error('HTTPS required');
   const response=await fetch(url,{method:body?'POST':'GET',redirect:'error',headers:{'Content-Type':'application/json','X-AI-Service-Token':token},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw Error('Upstream unavailable');
   const result=await response.json();
   return {...result,mode:'rule-based-demo',modelLoaded:false,researchOnly:true};
  }catch{throw new ServiceUnavailableException('RESEARCH_DEMO_UNAVAILABLE');}
 }
 @Get('status') status(){return this.forward('/status');}
 @Post('analyze') analyze(@Body() body:ResearchDemoDto){return this.forward('/analyze',body);}
}
