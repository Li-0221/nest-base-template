import{W as B}from"./index-Dv1ntQwP.js";import{a4 as d,d as E,i as f,R as x,r as n,o as N,h as R,w as s,a as S,b as a,e as g,P as _}from"./index-MVVa4Kd4.js";const F=l=>d.post("/log/list",l),U=l=>d.post("/log/create",l),$=l=>d.post("/log/edit",l),K=l=>d.delete(`/log/${l}`),q={class:"dialog-footer"},M=E({__name:"EditLog",emits:["refreshList"],setup(l,{expose:b,emit:v}){const X=v,V={toolbarKeys:["headerSelect","bulletedList","bold","emotion","fullScreen"]},u=f(),r=f(!1),e=x({id:"",time:"",detail:""}),y=x({time:[{required:!0,message:"请输入",trigger:"blur"}],detail:[{required:!0,message:"请输入",trigger:"blur"}]}),m=()=>{Object.keys(e).forEach(o=>{e[o]=""})},h=async o=>{o&&await o.validate(async t=>{t&&(e.id?(await $(e),_.success("编辑成功")):(await U({...e,id:void 0}),_.success("新增成功")),X("refreshList"),r.value=!1)})},k=()=>{m(),r.value=!1};return b({openDialog:o=>{o?(e.id=o.id,e.time=o.time,e.detail=o.detail):e.detail="<h1>软件名称1</h1><ul><li>新增功能XXXXXX</li><li>修复样式问题</li><li>修复xxxxxxxxxx</li></ul><h1>软件名称2</h1><ul><li>新增功能XXXXXX</li><li>修复样式问题</li><li>修复xxxxxxxxxx</li></ul><p><br></p><p><br></p>",r.value=!0}}),(o,t)=>{const C=n("el-date-picker"),p=n("el-form-item"),L=n("el-form"),c=n("el-button"),w=n("el-dialog");return N(),R(w,{modelValue:r.value,"onUpdate:modelValue":t[3]||(t[3]=i=>r.value=i),title:"日志信息",width:"850px","destroy-on-close":"",onClose:t[4]||(t[4]=i=>m())},{footer:s(()=>[S("span",q,[a(c,{onClick:k},{default:s(()=>[g("取消")]),_:1}),a(c,{type:"primary",onClick:t[2]||(t[2]=i=>h(u.value))},{default:s(()=>[g("确认")]),_:1})])]),default:s(()=>[a(L,{model:e,"label-width":"auto",ref_key:"formRef",ref:u,rules:y},{default:s(()=>[a(p,{label:"时间",prop:"time"},{default:s(()=>[a(C,{modelValue:e.time,"onUpdate:modelValue":t[0]||(t[0]=i=>e.time=i),type:"date",placeholder:"请输入"},null,8,["modelValue"])]),_:1}),a(p,{label:"内容",prop:"detail"},{default:s(()=>[a(B,{"toolbar-config":V,value:e.detail,"onUpdate:value":t[1]||(t[1]=i=>e.detail=i),height:"400px"},null,8,["value"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"])}}});export{M as _,K as d,F as l};