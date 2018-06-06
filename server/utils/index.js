const path=require("path");
const fs=require("fs-extra");
function resolve(src){
  return path.join(__dirname,src);
}

function parse(buffer){
  return JSON.parse(buffer.toString())
}

async function getProject(){
  const data=await fs.readFile(resolve("../data/project.json"));
  return parse(data);
}

async function saveProject(info){
  await fs.writeFile(resolve("../data/project.json"),JSON.stringify(info));
  return
}
module.exports={resolve,parse,getProject,saveProject}
