const exec = require('child_process').exec;
const acmd = function(command) {
  return new Promise((resolve,reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      resolve(stdout.toString());
    });
  });
};

module.exports=acmd;
