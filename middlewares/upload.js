const cloudinary = require("cloudinary").v2;
          
cloudinary.config({ 
  cloud_name: 'dolzqjqfs', 
  api_key: '952475732894842', 
  api_secret: 'IY5QSH_FlBfP02Fwl2QwoJSJDtc' 
});

const upload=async(filepath)=>{
    const result = await cloudinary.v2.uploader.upload(filepath, {
        folder: "products",
      });
    return result;
    
}

module.exports=upload;