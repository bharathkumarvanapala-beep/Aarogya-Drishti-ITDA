import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/session';

export function MedGemmaPage() {
  const [online, setOnline] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<string>('');
  useEffect(() => { apiRequest('/medgemma/status').then(s => setOnline(s.available === true)).catch(() => setOnline(false)); }, []);
  return <main className="max-w-4xl mx-auto p-6 space-y-6">
    <h1 className="text-3xl font-bold text-forest-900">MedGemma AI</h1>
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
      <strong>Under development · Updates coming later</strong>
      <p className="mt-2">The branch b service is available here as a rule-based research demo. It does not run MedGemma model weights. Use synthetic demonstration images only; results are not a diagnosis or guidance for patient care.</p>
    </div>
    <p role="status">Demo service: {online ? 'Connected' : 'Unavailable — please retry later. Other portal features remain available.'}</p>
    <form className="bg-white rounded-xl p-6 space-y-4" onSubmit={async e => {
      e.preventDefault(); setBusy(true); setError(''); setResult('');
      const data = new FormData(e.currentTarget); const file = data.get('image') as File;
      try {
        if (!file.size || file.size > 1_300_000) throw Error('Choose an image smaller than 1.3 MB.');
        const imageBase64 = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); });
        const output = await apiRequest('/medgemma/analyze', { imageBase64, age: Number(data.get('age')), site: data.get('site'), history: data.get('history'), syntheticOnly: true }); setResult(JSON.stringify(output.findings, null, 2));
      } catch (err) { setError(err instanceof Error ? err.message : 'Unable to read the image.'); }
      finally { setBusy(false); }
    }}>
      <label className="block">Demo image<input className="block mt-2" name="image" type="file" accept="image/jpeg,image/png,image/webp" required /></label>
      <label className="block">Age<input className="block border rounded p-2" name="age" type="number" min="0" max="120" required /></label>
      <label className="block">Image site<input className="block border rounded p-2 w-full" name="site" maxLength={200} /></label>
      <label className="block">Synthetic history<textarea className="block border rounded p-2 w-full" name="history" maxLength={4000} /></label>
      <label className="block"><input type="checkbox" required /> I am using a synthetic demonstration image, not a patient image.</label>
      <button className="rounded-lg bg-forest-800 text-white px-5 py-3 disabled:opacity-50" disabled={!online || busy}>{busy ? 'Running demo…' : 'Run research demo'}</button>
    </form>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {result && <section className="bg-white p-5 rounded-xl"><h2 className="font-bold">Rule-based demo output — not MedGemma inference</h2><pre className="whitespace-pre-wrap break-words text-sm mt-4">{result}</pre></section>}
  </main>;
}
