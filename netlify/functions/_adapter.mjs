function lowerHeaders(input={}){
  const out={};
  for(const [key,value] of Object.entries(input||{})) out[key.toLowerCase()]=Array.isArray(value)?value.join(', '):String(value);
  return out;
}
function requestFrom(event){
  const headers=lowerHeaders(event.headers);
  const query=event.rawQuery||new URLSearchParams(event.multiValueQueryStringParameters||event.queryStringParameters||{}).toString();
  const host=headers.host||'nimble-malabi-d4b9f4.netlify.app';
  const path=event.path||'/';
  const url=event.rawUrl||`https://${host}${path}${query?'?'+query:''}`;
  let body;
  if(event.body!==undefined&&event.body!==null) body=event.isBase64Encoded?Buffer.from(event.body,'base64').toString('utf8'):event.body;
  return {method:event.httpMethod||event.requestContext?.http?.method||'GET',url,headers,body};
}
export function wrap(fn){
  return async event=>{
    const headers={};
    let body='';
    const res={
      statusCode:200,
      setHeader(name,value){headers[name.toLowerCase()]=value},
      getHeader(name){return headers[name.toLowerCase()]},
      end(value=''){body=String(value??'')}
    };
    await fn(requestFrom(event),res);
    const multiValueHeaders={};
    const singleHeaders={};
    for(const [name,value] of Object.entries(headers)){
      if(name==='set-cookie') multiValueHeaders['Set-Cookie']=Array.isArray(value)?value:[value];
      else singleHeaders[name]=Array.isArray(value)?value.join(', '):String(value);
    }
    return {statusCode:res.statusCode||200,headers:singleHeaders,multiValueHeaders,body};
  };
}
