const policies=[
{id:"PS-00482",payer:"UnitedHealthcare",title:"Prior Authorization Requirements Update",classification:"Billing",effective:"Jan 01, 2027",priority:"High",status:"In Review",reviewer:"Clara",confidence:"94%",action:"High"},
{id:"PS-00481",payer:"Cigna",title:"Claims Submission Requirements Update",classification:"Billing",effective:"Sep 25, 2026",priority:"Critical",status:"New",confidence:"88%",action:"High"},
{id:"PS-00479",payer:"Aetna",title:"Documentation Requirement Update",classification:"Documentation",effective:"Oct 15, 2026",priority:"Medium",status:"Reassigned",reviewer:"John",confidence:"82%",action:"Medium"},
{id:"PS-00477",payer:"Humana",title:"Provider Bulletin — General Information",classification:"Other",effective:"Nov 01, 2026",priority:"Low",status:"In Review",reviewer:"Clara",confidence:"96%",action:"Low"}];

function go(page){
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
 const el=document.getElementById("page-"+page); if(el) el.classList.add("active");
 function openRulesImport(){
 const modal=document.createElement("div"); modal.className="modal-backdrop"; modal.id="rules-import-modal";
 modal.innerHTML=`<div class="modal"><div class="modal-head"><div><h3>Import Practice-Reported Rules</h3><div class="muted">Use XLS data to compare business-reported rules with rules detected by Payer Surveillance.</div></div><button class="icon-btn" onclick="closeModal('rules-import-modal')">×</button></div><div class="upload-zone"><div class="upload-icon">XLS</div><b>Choose XLS file</b><span>Prototype upload control — no file processing required.</span><input type="file" accept=".xls,.xlsx"></div><div class="field-note"><b>Recommended columns</b><br>Jira Ref · Payer · Rule / Issue · Reported Date · Effective Date</div><div class="modal-actions"><button class="btn secondary" onclick="closeModal('rules-import-modal')">Cancel</button><button class="btn primary" onclick="closeModal('rules-import-modal');showToast('Practice-reported rules import staged for comparison.')">Import Rules</button></div></div>`; document.body.appendChild(modal);
}
function openMissedPolicy(){
 const modal=document.createElement("div"); modal.className="modal-backdrop"; modal.id="missed-policy-modal";
 modal.innerHTML=`<div class="modal"><div class="modal-head"><div><h3>Report Missed Policy</h3><div class="muted">Capture a policy the surveillance workflow did not identify.</div></div><button class="icon-btn" onclick="closeModal('missed-policy-modal')">×</button></div><div class="form-grid"><label>Payer<select><option>UnitedHealthcare</option><option>Cigna</option><option>Aetna</option><option>Humana</option></select></label><label>Document Type<select><option>PDF</option><option>HTML</option><option>XLS</option><option>Other</option></select></label><label>Policy / Document URL<input placeholder="Optional source URL"></label><label>Effective Date<input type="date"></label><label class="full">Upload Document<input type="file" accept=".pdf,.html,.xls,.xlsx,.doc,.docx"></label></div><div class="modal-actions"><button class="btn secondary" onclick="closeModal('missed-policy-modal')">Cancel</button><button class="btn primary" onclick="closeModal('missed-policy-modal');showToast('Missed policy added to coverage review.')">Submit</button></div></div>`; document.body.appendChild(modal);
}
function closeModal(id){const el=document.getElementById(id); if(el) el.remove()}
function showToast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}

document.querySelectorAll(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
 const titles={updates:"Policy Updates",dashboard:"Dashboard",sources:"Source Configuration",business:"Business Metrics",operations:"Operational Metrics",quality:"Model & Coverage Quality",glossary:"Glossary",analysis:"Policy Analysis & Review"};
 document.getElementById("page-title").textContent=titles[page]||"Payer Surveillance";
 document.getElementById("global-actions").style.display=page==="updates"?"flex":"none";
 window.scrollTo(0,0);
}
const statusOptions=["New","Unassigned","In Review","Reassigned","Escalated","Reviewed — No Action Required","Sent for Billing Rules Review"];
function changePolicyStatus(id,status){
 const p=policies.find(x=>x.id===id); if(!p) return;
 if(status==="In Review"||status==="Reassigned") return openStatusEditor(id,status);
 if(status==="Escalated") return openStatusEditor(id,status);
 p.status=status;
 if(status!=="In Review"&&status!=="Reassigned") p.reviewer=p.reviewer||"";
 renderPolicies(); showToast(`${id} moved to ${status}.`);
}
function openStatusEditor(id,status){
 const p=policies.find(x=>x.id===id); const modal=document.createElement("div"); modal.className="modal-backdrop"; modal.id="status-editor-modal";
 const needsReviewer=status==="In Review"||status==="Reassigned";
 const needsNotes=status==="Escalated";
 modal.innerHTML=`<div class="modal"><div class="modal-head"><div><h3>${status}</h3><div class="muted">Update ownership and keep a lightweight operational note.</div></div><button class="icon-btn" onclick="closeModal('status-editor-modal');renderPolicies()">×</button></div><div class="form-grid">${needsReviewer?`<label>${status==="Reassigned"?"New Reviewer":"Reviewer"}<select id="status-reviewer"><option>Clara</option><option>John</option><option>Priya</option><option>David</option></select></label>`:""}${needsNotes?`<label class="full">Reason / Notes<textarea id="status-notes" placeholder="Why is this being escalated?"></textarea></label>`:`<label class="full">Notes <span class="muted">(optional)</span><textarea id="status-notes" placeholder="Add context for the next person."></textarea></label>`}</div><div class="modal-actions"><button class="btn secondary" onclick="closeModal('status-editor-modal');renderPolicies()">Cancel</button><button class="btn primary" onclick="saveStatusEdit('${id}','${status}')">Save</button></div></div>`;
 document.body.appendChild(modal);
}
function saveStatusEdit(id,status){
 const p=policies.find(x=>x.id===id); if(!p) return;
 const reviewer=document.getElementById("status-reviewer"); const notes=document.getElementById("status-notes");
 if((status==="In Review"||status==="Reassigned")&&!reviewer.value) return;
 if(status==="Escalated"&&!notes.value.trim()){showToast("Escalation reason is required.");return;}
 p.status=status; if(reviewer) p.reviewer=reviewer.value; p.statusNote=notes?notes.value.trim():"";
 closeModal("status-editor-modal"); renderPolicies(); showToast(`${id} updated: ${status}${p.reviewer?` — ${p.reviewer}`:""}.`);
}
function renderPolicies(){
 const q=(document.getElementById("search").value||"").toLowerCase(), payer=document.getElementById("payer").value, status=document.getElementById("status").value, act=document.getElementById("actionability").value;
 const rows=policies.filter(p=>(!q||JSON.stringify(p).toLowerCase().includes(q))&&(!payer||p.payer===payer)&&(!status||p.status===status)&&(!act||p.action===act));
 document.getElementById("policy-table").innerHTML=rows.map(p=>`<tr><td onclick="openAnalysis('${p.id}')"><button class="link-btn">${p.id}</button></td><td onclick="openAnalysis('${p.id}')">${p.payer}</td><td onclick="openAnalysis('${p.id}')"><b>${p.title}</b></td><td onclick="openAnalysis('${p.id}')">${p.classification}</td><td onclick="openAnalysis('${p.id}')">${p.effective}</td><td onclick="openAnalysis('${p.id}')" class="priority ${p.priority.toLowerCase()}">${p.priority}</td><td><div class="status-editor"><select onchange="changePolicyStatus('${p.id}',this.value)">${statusOptions.map(o=>`<option ${o===p.status?"selected":""}>${o}</option>`).join("")}</select>${p.reviewer?`<small>Reviewer: ${p.reviewer}</small>`:""}</div></td></tr>`).join("");
}
function openAnalysis(id){
 const p=policies.find(x=>x.id===id);
 document.getElementById("analysis-content").innerHTML=`
 <div class="analysis-grid"><div class="analysis-main">
 <div class="eyebrow">${p.id}</div><div class="analysis-title">${p.title}</div><div class="muted">${p.payer}</div>
 <div class="meta"><span>Effective date: <b>${p.effective}</b></span><span>Classification: <b>${p.classification}</b></span></div>
 <div class="ai-box"><div class="ai-stat"><small>AI confidence</small><b>${p.confidence}</b></div><div class="ai-stat"><small>Classification</small><b>${p.classification}</b></div><div class="ai-stat"><small>Actionability</small><b>${p.action}</b></div></div>
 <h3>Policy Summary</h3><div class="summary">The policy introduces a change that may affect billing workflow and requires the operational team to validate and incorporate the applicable requirement before the effective date.</div>
 <h3>Evidence</h3>
 <div class="evidence"><strong>PAGE 9 · CPT / BILLING REQUIREMENT</strong><br>“CPT 66589 must be accompanied by the required units of dosage provided.”</div>
 <div class="evidence"><strong>PAGE 9 · REIMBURSEMENT IMPACT</strong><br>“Claims that do not meet the required submission conditions may be rejected and reimbursement may not be made.”</div>
 <h3>How was this prediction derived?</h3><div class="muted">Each document is evaluated against the standardized policy taxonomy. Signals are semantic, not exact phrase matches.</div>
 <div class="reason-row"><b>Denial / Rejection</b><span class="strength positive">Strong +</span><span>Page 9 — claim rejection language indicates payment risk when requirements are not met.</span></div>
 <div class="reason-row"><b>Reimbursement Impact</b><span class="strength positive">Strong +</span><span>Page 9 — reimbursement impact is explicitly described.</span></div>
 <div class="reason-row"><b>Billing Requirement</b><span class="strength positive">Strong +</span><span>Page 9 — CPT information must be included with the claim.</span></div>
 <div class="reason-row"><b>Modifier Requirement</b><span class="strength">Moderate +</span><span>Page 10 — a required modifier is specified for the applicable procedure.</span></div>
 <div class="reason-row"><b>Instruction / Exclusion</b><span class="strength negative">Moderate −</span><span>Page 11 — instruction-for-use language is explicitly excluded from consideration.</span></div>
 <div class="feedback"><h3>Validate AI Analysis</h3><div class="muted">Your feedback helps improve future policy classification and actionability assessments.</div>
 <div class="feedback-buttons"><button onclick="chooseFeedback(this,true)">✓ Correct</button><button onclick="chooseFeedback(this,false)">✕ Incorrect</button></div>
 <textarea id="feedback-text" placeholder="Tell us what was correct, incorrect, or what the AI should have identified differently."></textarea>
 <div class="error-note" id="feedback-error">Feedback is required when the analysis is marked incorrect.</div>
 <div><button class="btn primary submit-review" onclick="submitReview('${p.id}')">Submit Review</button></div>
 <div id="handoff" class="handoff"></div></div></div>
 <aside class="analysis-side"><h3>Source</h3><div class="source-card"><b>Source URL</b><br><a href="#" onclick="return false">https://payer.example.com/provider/policies/prior-authorization</a></div><div class="source-card"><b>Downloaded Policy Document</b><br>📄 Prior_Authorization_Update_2027.pdf<br><button class="link-btn">Open Document ↗</button></div><h3>Final downstream action</h3><div class="source-card">If the analysis is correct and actionable, the user can create a downstream billing-rules review item for the team responsible for incorporation.</div></aside></div>`;
 go("analysis");
}
let feedbackCorrect=null;
function chooseFeedback(btn,correct){feedbackCorrect=correct;document.querySelectorAll(".feedback-buttons button").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");document.getElementById("feedback-text").placeholder=correct?"Notes are optional. Add context if useful.":"Please explain what is incorrect or what should be changed.";document.getElementById("feedback-error").style.display="none";}
function submitReview(id){
 const text=document.getElementById("feedback-text").value.trim(), err=document.getElementById("feedback-error");
 if(feedbackCorrect===null){err.textContent="Select Correct or Incorrect before submitting.";err.style.display="block";return}
 if(feedbackCorrect===false&&!text){err.textContent="Feedback is required when the analysis is marked incorrect.";err.style.display="block";return}
 err.style.display="none";
 const h=document.getElementById("handoff");
 if(feedbackCorrect && policies.find(p=>p.id===id).action==="High"){h.innerHTML="<b>✓ Billing Rules Review created</b><br>The validated policy has been handed off for downstream billing-rules incorporation.";h.classList.add("show")}
 else if(feedbackCorrect){h.innerHTML="<b>✓ Reviewed — No Action Required</b>";h.classList.add("show")}
 else{h.innerHTML="<b>✓ Feedback submitted</b><br>The correction has been captured for model improvement.";h.classList.add("show")}
}
function showSourceDetail(payer){
 const details={
  UnitedHealthcare:{purpose:"Reimbursement Policies",url:"https://www.uhcprovider.com/en/policies-protocols/commercial-policies/commercial-reimbursement-policies.html"},
  Cigna:{purpose:"Provider Newsroom",url:"https://cigna.com/provider-news"}, Aetna:{purpose:"Provider Policy Updates",url:"https://aetna.com/provider-policy-updates"}, Humana:{purpose:"Provider Newsroom",url:"https://humana.com/provider-news"}
 };
 const d=details[payer]||{purpose:"Policy Updates",url:"https://payer.example.com/provider/policies"}; const box=document.getElementById("source-detail"); box.classList.remove("hidden");
 box.innerHTML=`<div class="source-detail-head"><div><h3>${payer} — Source Configuration</h3><div class="muted">${d.purpose}</div></div><span class="pill good">Active</span></div><div class="source-url"><b>Configured URL</b><br><a href="${d.url}" target="_blank" rel="noopener">${d.url} ↗</a></div><div class="toggle-row"><span>Purpose</span><b>${d.purpose}</b></div><div class="toggle-row"><span>HTML extraction</span><b>Included · MVP</b></div><div class="toggle-row"><span>PDF extraction</span><b>Included · MVP</b></div><div class="toggle-row"><span>XLS extraction</span><b>Phase 2</b></div><div class="toggle-row"><span>URL discovery / scan</span><b>Phase 2</b></div><div class="toggle-row"><span>Discovery depth</span><b>Phase 2</b></div><div class="toggle-row"><span>Content scope</span><b>Scan & select exclusions · Phase 2</b></div>`;
}
function openRulesImport(){
 const modal=document.createElement("div"); modal.className="modal-backdrop"; modal.id="rules-import-modal";
 modal.innerHTML=`<div class="modal"><div class="modal-head"><div><h3>Import Practice-Reported Rules</h3><div class="muted">Use XLS data to compare business-reported rules with rules detected by Payer Surveillance.</div></div><button class="icon-btn" onclick="closeModal('rules-import-modal')">×</button></div><div class="upload-zone"><div class="upload-icon">XLS</div><b>Choose XLS file</b><span>Prototype upload control — no file processing required.</span><input type="file" accept=".xls,.xlsx"></div><div class="field-note"><b>Recommended columns</b><br>Jira Ref · Payer · Rule / Issue · Reported Date · Effective Date</div><div class="modal-actions"><button class="btn secondary" onclick="closeModal('rules-import-modal')">Cancel</button><button class="btn primary" onclick="closeModal('rules-import-modal');showToast('Practice-reported rules import staged for comparison.')">Import Rules</button></div></div>`; document.body.appendChild(modal);
}
function openMissedPolicy(){
 const modal=document.createElement("div"); modal.className="modal-backdrop"; modal.id="missed-policy-modal";
 modal.innerHTML=`<div class="modal"><div class="modal-head"><div><h3>Report Missed Policy</h3><div class="muted">Capture a policy the surveillance workflow did not identify.</div></div><button class="icon-btn" onclick="closeModal('missed-policy-modal')">×</button></div><div class="form-grid"><label>Payer<select><option>UnitedHealthcare</option><option>Cigna</option><option>Aetna</option><option>Humana</option></select></label><label>Document Type<select><option>PDF</option><option>HTML</option><option>XLS</option><option>Other</option></select></label><label>Policy / Document URL<input placeholder="Optional source URL"></label><label>Effective Date<input type="date"></label><label class="full">Upload Document<input type="file" accept=".pdf,.html,.xls,.xlsx,.doc,.docx"></label></div><div class="modal-actions"><button class="btn secondary" onclick="closeModal('missed-policy-modal')">Cancel</button><button class="btn primary" onclick="closeModal('missed-policy-modal');showToast('Missed policy added to coverage review.')">Submit</button></div></div>`; document.body.appendChild(modal);
}
function closeModal(id){const el=document.getElementById(id); if(el) el.remove()}
function showToast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}

document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
document.querySelectorAll("[data-page-link]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.pageLink)));
document.getElementById("search").addEventListener("input",renderPolicies);
document.getElementById("payer").addEventListener("change",renderPolicies);
document.getElementById("status").addEventListener("change",renderPolicies);
document.getElementById("actionability").addEventListener("change",renderPolicies);
renderPolicies();
