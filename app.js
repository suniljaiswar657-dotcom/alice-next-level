(() => {
"use strict";
const KEY="alice-next-level.memories.v1";
const $=s=>document.querySelector(s);
const form=$("#memory-form"),id=$("#memory-id"),title=$("#title"),content=$("#content"),tags=$("#tags"),save=$("#save"),cancel=$("#cancel"),search=$("#search"),list=$("#list"),empty=$("#empty"),count=$("#count"),status=$("#status"),file=$("#file");
let memories=load();
function valid(x){return x&&typeof x.id==="string"&&typeof x.title==="string"&&typeof x.content==="string"&&Array.isArray(x.tags)}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x.filter(valid):[]}catch{return[]}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(memories));return true}catch{say("Could not save: browser storage may be full or disabled.",true);return false}}
function say(t,err=false){status.textContent=t;status.style.color=err?"var(--red)":"var(--green)"}
function node(tag,text,cls){const n=document.createElement(tag);if(cls)n.className=cls;n.textContent=text;return n}
function render(){
 const q=search.value.trim().toLocaleLowerCase();
 const shown=memories.filter(m=>[m.title,m.content,m.tags.join(" ")].join(" ").toLocaleLowerCase().includes(q)).sort((a,b)=>b.updatedAt-a.updatedAt);
 count.textContent=memories.length+" saved";list.replaceChildren();empty.classList.toggle("hidden",shown.length>0);
 empty.textContent=memories.length===0?"No memories yet. Add one above to start your vault.":"No matching memories. Try a different search.";
 for(const m of shown){
  const card=node("article","","memory");card.append(node("h3",m.title),node("p",m.content),node("div","Updated "+new Date(m.updatedAt).toLocaleString(),"meta"));
  if(m.tags.length){const ts=node("div","","tags");m.tags.forEach(t=>ts.append(node("span",t,"tag")));card.append(ts)}
  const actions=node("div","","card-actions"),edit=node("button","Edit","secondary"),del=node("button","Delete","danger");edit.type=del.type="button";edit.onclick=()=>editMemory(m.id);del.onclick=()=>deleteMemory(m.id);actions.append(edit,del);card.append(actions);list.append(card)
 }
}
function reset(){form.reset();id.value="";save.textContent="Save memory";cancel.classList.add("hidden")}
function editMemory(key){const m=memories.find(x=>x.id===key);if(!m)return;id.value=m.id;title.value=m.title;content.value=m.content;tags.value=m.tags.join(", ");save.textContent="Update memory";cancel.classList.remove("hidden");say("Editing memory. Save to apply changes.");title.focus();form.scrollIntoView({behavior:"smooth",block:"start"})}
function deleteMemory(key){const m=memories.find(x=>x.id===key);if(!m||!confirm('Delete "'+m.title+'" from this browser? This cannot be undone without a backup.'))return;memories=memories.filter(x=>x.id!==key);if(!persist())return;if(id.value===key)reset();say("Memory deleted from this browser.");render()}
form.addEventListener("submit",e=>{e.preventDefault();const t=title.value.trim(),c=content.value.trim(),tg=[...new Set(tags.value.split(",").map(x=>x.trim()).filter(Boolean))];if(!t||!c){say("Add both a title and details.",true);return}const now=Date.now(),key=id.value;
 if(key){const i=memories.findIndex(x=>x.id===key);if(i<0){say("Memory not found. Please try again.",true);return}memories[i]={...memories[i],title:t,content:c,tags:tg,updatedAt:now}}
 else memories.push({id:crypto.randomUUID?crypto.randomUUID():"m-"+now+"-"+Math.random().toString(16).slice(2),title:t,content:c,tags:tg,createdAt:now,updatedAt:now});
 if(!persist())return;reset();say(key?"Memory updated on this device.":"Memory saved on this device.");render()
});
cancel.addEventListener("click",()=>{reset();say("Edit cancelled.")});search.addEventListener("input",render);
$("#export").addEventListener("click",()=>{const data={format:"alice-next-level-memory-backup",version:1,exportedAt:new Date().toISOString(),memories};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));const a=node("a","","");a.href=url;a.download="alice-memory-backup.json";document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);say("Backup export started.")});
$("#import").addEventListener("click",()=>file.click());
file.addEventListener("change",async()=>{const f=file.files&&file.files[0];if(!f)return;try{const data=JSON.parse(await f.text()),incoming=Array.isArray(data)?data:data.memories;if(!Array.isArray(incoming)||!incoming.every(valid))throw Error("This is not a valid Alice memory backup.");if(!confirm("Import "+incoming.length+" memories? Matching IDs will be replaced; other memories will be kept."))return;const old=memories,map=new Map(memories.map(m=>[m.id,m]));incoming.forEach(m=>map.set(m.id,{...m,tags:m.tags.filter(t=>typeof t==="string")}));memories=[...map.values()];if(!persist()){memories=old;return}say("Imported "+incoming.length+" memories.");render()}catch(e){say(e.message||"Could not import this file.",true)}finally{file.value=""}});
render();
})();