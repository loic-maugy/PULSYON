/* Moteur commun des briefs PULSYON. Chaque page définit window.BRIEF avant de charger ce fichier. */
(function(){
var B=window.BRIEF,MAIL='maugyloic.10@gmail.com',WA='33610166787',KEY='pulsyon-brief-'+B.key,st={};
try{st=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){st={}}
var $=function(id){return document.getElementById(id)};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function all(){var a=[];B.sections.forEach(function(s){s[1].forEach(function(q){a.push(q)})});return a}
function filled(q){var v=st[q.i];return Array.isArray(v)?v.length>0:!!(v&&String(v).trim())}
function render(){
  var h='';
  B.sections.forEach(function(sec){
    h+='<fieldset class="sec"><legend>'+esc(sec[0])+'</legend>';
    sec[1].forEach(function(q){
      var id='f_'+q.i,v=st[q.i],lab=esc(q.q)+(q.r?' <span class="req" aria-hidden="true">*</span>':'');
      var hint=q.h?'<small id="h_'+q.i+'">'+esc(q.h)+'</small>':'',d=q.h?' aria-describedby="h_'+q.i+'"':'';
      h+='<div class="q" data-q="'+q.i+'">';
      if(q.t==='checks'){
        v=v||[];h+='<div class="lab" id="l_'+q.i+'">'+lab+hint+'</div><div class="opts" role="group" aria-labelledby="l_'+q.i+'">';
        q.o.forEach(function(o){h+='<label><input type="checkbox" name="'+q.i+'" value="'+esc(o)+'"'+(v.indexOf(o)>-1?' checked':'')+'><span>'+esc(o)+'</span></label>'});
        h+='</div>';
      }else if(q.t==='consent'){
        h+='<div class="opts"><label><input type="checkbox" id="'+id+'" name="'+q.i+'"'+(v?' checked':'')+'><span>'+lab+'</span></label></div>';
      }else if(q.t==='textarea'){
        h+='<label for="'+id+'">'+lab+hint+'</label><textarea id="'+id+'" name="'+q.i+'"'+d+'>'+esc(v||'')+'</textarea>';
      }else if(q.t==='select'){
        h+='<label for="'+id+'">'+lab+hint+'</label><select id="'+id+'" name="'+q.i+'"'+d+'><option value="">Choisir…</option>'+q.o.map(function(o){return '<option'+(v===o?' selected':'')+'>'+esc(o)+'</option>'}).join('')+'</select>';
      }else{
        h+='<label for="'+id+'">'+lab+hint+'</label><input type="'+q.t+'" id="'+id+'" name="'+q.i+'" value="'+esc(v||'')+'"'+d+(q.t==='tel'?' inputmode="tel" autocomplete="tel"':'')+(q.t==='email'?' autocomplete="email"':'')+'>';
      }
      h+='</div>';
    });
    h+='</fieldset>';
  });
  $('form').innerHTML=h;progress();
}
function read(e){
  var t=e.target,n=t.name;if(!n)return;
  if(t.type==='checkbox'&&t.value&&t.value!=='on'){
    st[n]=[].slice.call(document.querySelectorAll('input[name="'+n+'"]:checked')).map(function(x){return x.value});
  }else if(t.type==='checkbox'){st[n]=t.checked}else{st[n]=t.value}
  save();progress();
}
function progress(){
  var qs=all(),n=0;qs.forEach(function(q){if(filled(q))n++});
  var p=Math.round(100*n/qs.length);$('pct').textContent=p+' %';$('fill').style.width=p+'%';
}
function validate(){
  var bad=null;
  document.querySelectorAll('.q').forEach(function(d){d.classList.remove('invalid');var e=d.querySelector('.err');if(e)e.remove()});
  all().forEach(function(q){
    var msg='';
    if(q.r&&!filled(q))msg='Ce champ est obligatoire.';
    else if(q.t==='email'&&filled(q)&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(st[q.i]))msg='Adresse email invalide.';
    else if(q.i==='pages'&&B.max&&(st.pages||[]).length>B.max)msg='Votre formule permet '+B.max+' page'+(B.max>1?'s':'')+' au maximum.';
    if(msg){var d=document.querySelector('[data-q="'+q.i+'"]');d.classList.add('invalid');d.insertAdjacentHTML('beforeend','<div class="err" role="alert">'+msg+'</div>');if(!bad)bad=d}
  });
  if(bad){bad.scrollIntoView({behavior:'smooth',block:'center'});return false}return true;
}
function summary(){
  var o=['BRIEF CLIENT PULSYON · '+B.name+' ('+B.scope+')',''];
  B.sections.forEach(function(sec){
    var lines=[];sec[1].forEach(function(q){
      if(!filled(q)||q.t==='consent')return;
      var v=st[q.i];lines.push('- '+q.q+' : '+(Array.isArray(v)?v.join(' ; '):v))});
    if(lines.length){o.push(sec[0].toUpperCase());o=o.concat(lines);o.push('')}
  });
  o.push('Consentement au traitement de la demande : oui');
  return o.join('\n');
}
function copy(t){
  if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(t).then(function(){return true},function(){return false});
  var a=$('out');a.select();try{return Promise.resolve(document.execCommand('copy'))}catch(e){return Promise.resolve(false)}
}
function say(t){$('status').textContent=t}
function sent(url,msg){copy($('out').value).then(function(ok){say(ok?msg:'Copie impossible : sélectionnez le texte ci-dessus et copiez-le à la main.');window.open(url,'_blank','noopener')})}
$('form').addEventListener('input',read);$('form').addEventListener('change',read);
$('build').onclick=function(){
  if(!validate())return;
  $('out').value=summary();$('result').classList.add('on');$('result').scrollIntoView({behavior:'smooth'});say('');
};
$('mail').onclick=function(){sent('mailto:'+MAIL+'?subject='+encodeURIComponent('Brief client PULSYON · '+B.name+' · '+(st.ent||''))+'&body='+encodeURIComponent('Bonjour Loïc,\n\nVoici mon brief (collé ci-dessous) :\n\n'),'Brief copié. Collez-le dans votre email.')};
$('wa').onclick=function(){sent('https://wa.me/'+WA+'?text='+encodeURIComponent('Bonjour Loïc, voici mon brief PULSYON ('+B.name+'). Je le colle juste après ce message.'),'Brief copié. Collez-le dans la conversation WhatsApp.')};
$('copy').onclick=function(){copy($('out').value).then(function(ok){say(ok?'Brief copié.':'Copie impossible : copiez le texte à la main.')})};
$('dl').onclick=function(){var b=new Blob([$('out').value],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='brief-pulsyon-'+B.key+'.txt';document.body.appendChild(a);a.click();a.remove();say('Fichier téléchargé : envoyez-le-moi par email ou WhatsApp.')};
render();
})();
