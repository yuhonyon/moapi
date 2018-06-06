import zlib from 'zlib';
import archiver from 'archiver'
export function zip(stirng){
  return new Promise((resolve,reject)=>{
    zlib.deflate(input, (err, buffer) => {
      if (!err) {
        resolve(buffer)
      } else {
        reject(err)
      }
    });
  })
}

export function unzip(buffer){
  return new Promise((resolve,reject)=>{
    zlib.unzip(buffer, (err, buffer) => {
      if (!err) {
        resolve(buffer)
      } else {
        reject(err)
      }
    });
  })
}
