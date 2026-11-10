import {MedgemmaController} from './medgemma.controller';
describe('Hosted research gateway',()=>{
 const saved={...process.env};const original=global.fetch;
 afterEach(()=>{process.env={...saved};global.fetch=original;});
 it('fails closed without service credentials',async()=>{delete process.env.AI_SERVICE_TOKEN;await expect(new MedgemmaController().status()).rejects.toThrow('RESEARCH_DEMO_NOT_CONFIGURED');});
 it('passes the service token only to the configured host and retains the demo label',async()=>{
  process.env.AI_RESEARCH_SERVICE_URL='https://research.example/research';process.env.AI_SERVICE_TOKEN='test-only-token';
  global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({available:true,modelLoaded:true})});
  const result=await new MedgemmaController().status();expect(result.modelLoaded).toBe(false);expect(result.mode).toBe('rule-based-demo');
  expect(global.fetch).toHaveBeenCalledWith(new URL('https://research.example/research/status'),expect.objectContaining({redirect:'error',headers:expect.objectContaining({'X-AI-Service-Token':'test-only-token'})}));
 });
 it('returns an unavailable response without exposing upstream details',async()=>{
  process.env.AI_RESEARCH_SERVICE_URL='https://research.example/research';process.env.AI_SERVICE_TOKEN='test-only-token';
  global.fetch=jest.fn().mockRejectedValue(Error('private upstream detail'));await expect(new MedgemmaController().status()).rejects.toThrow('RESEARCH_DEMO_UNAVAILABLE');
 });
});
