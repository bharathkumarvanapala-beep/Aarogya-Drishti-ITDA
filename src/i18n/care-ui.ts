const te:Record<string,string>={
 'Total':'మొత్తం','Aggregates only; individual records are restricted.':'సమగ్ర గణాంకాలు మాత్రమే; వ్యక్తిగత రికార్డులకు ప్రాప్యత పరిమితం.',
 'Optional registration photo (also saved offline)':'ఐచ్ఛిక నమోదు ఫోటో (ఆఫ్‌లైన్‌లో కూడా సేవ్ అవుతుంది)',
 'Photography consent':'ఫోటోగ్రఫీ సమ్మతి','Mandal':'మండలం','Health worker activity':'కార్యకర్త సేవలు','Programme indicators':'కార్యక్రమ సూచికలు','Care cases':'రోగి కేసులు',
 'Oral photograph':'నోటి ఫోటో','Preview':'ముందస్తు చిత్రం','Decision':'నిర్ణయం','AI assessment':'పరిశోధన AI మూల్యాంకనం','Hospital / location':'ఆసుపత్రి / ప్రదేశం','Specialty':'వైద్య విభాగం','Attendance':'హాజరు','Investigation stage':'పరీక్ష దశ','Attach synthetic pathology PDF':'కల్పిత పాథాలజీ PDF జోడించండి','Offline passphrase':'ఆఫ్‌లైన్ రహస్య పదబంధం','Save photo offline':'ఫోటో ఆఫ్‌లైన్‌లో భద్రపరచండి','Download simulated report':'కల్పిత నివేదిక డౌన్‌లోడ్',
 'Encrypted draft saved on this device. Keep your passphrase to synchronize.':'ఈ పరికరంలో ముసాయిదా గుప్తీకరించి సేవ్ చేయబడింది. సమకాలీకరణ కోసం మీ రహస్య పదబంధం భద్రపరచండి.',
 'registrations acknowledged by server.':'నమోదులను సర్వర్ స్వీకరించింది.',
 'Photo encrypted and queued. Synchronize from the registration section when connected.':'ఫోటో గుప్తీకరించి నిల్వ చేయబడింది. కనెక్షన్ ఉన్నప్పుడు నమోదు విభాగం నుంచి సమకాలీకరించండి.',
 'Preview checked for resolution and exposure. Review focus and glare before submitting.':'చిత్ర పరిమాణం మరియు వెలుతురు తనిఖీ చేయబడ్డాయి. పంపే ముందు ఫోకస్ మరియు మెరుపును చూడండి.',
 'Report must be smaller than 1 MB':'నివేదిక 1 MB కంటే చిన్నదిగా ఉండాలి',
 'Select a JPEG/PNG smaller than 1.3 MB.':'1.3 MB కంటే చిన్న JPEG/PNG ఎంచుకోండి.',
 'Image is too dark or overexposed. Adjust lighting and retake.':'చిత్రం చాలా చీకటిగా లేదా ప్రకాశవంతంగా ఉంది. వెలుతురు సరిచేసి మళ్లీ తీయండి.',
 'Unable to save. Please retry.':'సేవ్ చేయలేకపోయాము. మళ్లీ ప్రయత్నించండి.',
 'REGISTERED':'నమోదైంది','RECAPTURE':'ఫోటో మళ్లీ తీయాలి','AWAITING_REVIEW':'సమీక్ష కోసం వేచి ఉంది','REFERRED':'రిఫర్ చేయబడింది','APPOINTMENT':'అపాయింట్‌మెంట్','MISSED':'హాజరు కాలేదు','CANCELLED':'రద్దైంది','ATTENDED':'హాజరయ్యారు','INVESTIGATION':'వైద్య పరీక్ష','REPORT_RECEIVED':'నివేదిక అందింది','DIAGNOSED':'వైద్య నిర్ణయం నమోదైంది',
 'REFER':'రిఫర్ చేయండి','URGENT_REFERRAL':'అత్యవసర రిఫరల్','FOLLOW_UP':'తదుపరి సంప్రదింపు','DEFER':'వాయిదా','AGREE':'ఏకీభవిస్తున్నాను','DISAGREE':'ఏకీభవించడం లేదు','SCHEDULED':'నిర్ణయించబడింది','SAMPLE_COLLECTED':'నమూనా సేకరించబడింది','REPORT_PENDING':'నివేదిక రావాలి','RECEIVED':'అందింది',
 'PENDING_VERIFICATION':'ధృవీకరణ కోసం వేచి ఉంది','APPROVED':'ఆమోదించబడింది','REJECTED':'తిరస్కరించబడింది','SUSPENDED':'నిలిపివేయబడింది',
 'reviewed':'సమీక్షించినవి','referrals':'రిఫరల్స్','appointments':'అపాయింట్‌మెంట్లు','attended':'హాజరైనవి','missed':'హాజరు కానివి'
};
export function careLabel(language:'en'|'te',text:string){return language==='te'?(te[text]||text):text;}
