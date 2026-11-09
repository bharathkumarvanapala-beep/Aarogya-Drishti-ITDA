import { useEffect, useRef, useState } from 'react';
import { careApi } from '../../services/careApi';

export function CareVideo({ caseId }: { caseId: string }) {
  const local = useRef<HTMLVideoElement>(null), remote = useRef<HTMLVideoElement>(null);
  const peer = useRef<RTCPeerConnection | null>(null), stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [status, setStatus] = useState('Video is off. Recording is disabled.');
  const [active, setActive] = useState(false);
  const stop = () => { if (timer.current) clearInterval(timer.current); peer.current?.close(); stream.current?.getTracks().forEach(t => t.stop()); peer.current = null; setActive(false); };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); peer.current?.close(); stream.current?.getTracks().forEach(t => t.stop()); }, []);
  async function join() {
    try {
      setActive(true);
      stream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (local.current) local.current.srcObject = stream.current;
      const room = await careApi<{ initiator: boolean; expires: number }>(`/cases/${caseId}/call`, {});
      const pc = new RTCPeerConnection(); peer.current = pc;
      stream.current.getTracks().forEach(track => pc.addTrack(track, stream.current!));
      pc.ontrack = e => { if (remote.current) remote.current.srcObject = e.streams[0]; };
      const send = (data: unknown) => careApi(`/cases/${caseId}/signals`, data);
      pc.onicecandidate = e => { if (e.candidate) void send({ candidate: e.candidate.toJSON() }).catch(() => setStatus('Connection failed. End and retry.')); };
      pc.onconnectionstatechange = () => setStatus(`Connection: ${pc.connectionState}`);
      if (room.initiator) { const offer = await pc.createOffer(); await pc.setLocalDescription(offer); await send({ description: offer }); }
      let cursor = -1, polling = false; const pending: RTCIceCandidateInit[] = [];
      timer.current = setInterval(async () => {
        if (polling) return; polling = true;
        try {
          if (Date.now() >= room.expires) { stop(); setStatus('Consultation expired.'); return; }
          const signals = await careApi<{ index: number; data: { description?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit } }[]>(`/cases/${caseId}/signals`);
          for (const s of signals.filter(s => s.index > cursor)) {
            if (s.data.description) {
              await pc.setRemoteDescription(s.data.description);
              for (const candidate of pending.splice(0)) await pc.addIceCandidate(candidate);
              if (s.data.description.type === 'offer') { const answer = await pc.createAnswer(); await pc.setLocalDescription(answer); await send({ description: answer }); }
            }
            if (s.data.candidate) { if (pc.remoteDescription) await pc.addIceCandidate(s.data.candidate); else pending.push(s.data.candidate); }
            cursor = s.index;
          }
        } catch { setStatus('Connection interrupted. End the call and retry.'); }
        finally { polling = false; }
      }, 1500);
      setStatus('Waiting for the other assigned participant. Link expires in 30 minutes.');
    } catch (e) { stop(); setStatus(e instanceof Error ? e.message : 'Camera or microphone unavailable'); }
  }
  return <section className="p-4 border rounded-xl space-y-3"><h3 className="font-bold">Secure consultation / వీడియో సంప్రదింపు</h3>
    <p>{status}</p><p className="text-sm">Synthetic actors only. Both participants must sign in and open this case. Local-network WebRTC; cross-network use requires a configured TURN service.</p>
    <div className={active ? 'grid sm:grid-cols-2 gap-3' : 'hidden'}><video className="w-full" aria-label="Local camera" ref={local} autoPlay muted playsInline /><video className="w-full" aria-label="Remote participant" ref={remote} autoPlay playsInline /></div>
    <button className="p-3 bg-forest-800 text-white rounded" disabled={active} onClick={join}>Join consultation</button>{active && <button className="p-3 border rounded ml-2" onClick={stop}>End call</button>}
  </section>;
}
